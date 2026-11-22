(function () {
  "use strict";
  var STORAGE_KEY = "flashlab-game-v1"; // Keep balance/plot data from v0.5 onward.
  var HOUR = 3600000;
  var BUY_IN = 20;
  var START_COINS = 30;
  var STARTER_PLOTS = {
    "br-estados-capitais": 8,
    "america-do-sul-paises": 6,
    "america-do-sul-capitais": 6
  };
  function el(id) { return document.getElementById(id); }
  function fmt(n) { return Number(n || 0).toLocaleString("en-US"); }
  function load() {
    try {
      var result = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (result && typeof result === "object" && Number.isFinite(result.coins) &&
          result.plots && typeof result.plots === "object") return result;
    } catch (_) { /* Default below */ }
    return { coins: START_COINS, plots: {} };
  }
  var wallet = load();
  wallet.coins = Math.max(0, Math.floor(wallet.coins));
  if (!wallet.helpers || typeof wallet.helpers !== "object") wallet.helpers = {};
  // A page reload while studying should never strand a previous session's escrow.
  if (wallet.active && Number.isFinite(wallet.active.bankroll)) {
    wallet.coins += Math.max(0, wallet.active.bankroll);
    delete wallet.active;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet)); } catch (_) {}
  }
  var game = null;
  var round = null;
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet)); }
    catch (error) { console.warn("Could not persist coin progress", error); }
  }
  function seedPlot(deck) {
    if (!Object.prototype.hasOwnProperty.call(wallet.plots, deck.id)) {
      wallet.plots[deck.id] = {
        pending: Object.prototype.hasOwnProperty.call(STARTER_PLOTS, deck.id) ? STARTER_PLOTS[deck.id] : 0,
        since: Date.now()
      };
      save();
    }
    return wallet.plots[deck.id];
  }
  function plantedCount(deck, getRecord) {
    return deck.cards.reduce(function (sum, card) {
      var r = getRecord(deck.id, card.id);
      return sum + (r && (r.firstSeenAt || r.lastReviewedAt || Number(r.reviews) > 0) ? 1 : 0);
    }, 0);
  }
  function earningsWithFraction(deck, getRecord) {
    var plot = seedPlot(deck);
    // v0.9 retires passive production. Freeze and preserve all pending v0.8
    // earnings (including accumulation since its last visit) for one-time claim.
    if (!plot.v09Frozen) {
      var elapsed = Math.max(0, Date.now() - (Number(plot.since) || Date.now()));
      plot.pending = Math.max(0, Number(plot.pending) || 0) +
        (elapsed / HOUR) * plantedCount(deck, getRecord) * 0.025;
      plot.since = Date.now();
      plot.v09Frozen = true;
      save();
    }
    return Math.max(0, Number(plot.pending) || 0);
  }
  function plotEarnings(deck, getRecord) { return Math.floor(earningsWithFraction(deck, getRecord)); }
  function collectPlot(deck, getRecord) {
    var total = earningsWithFraction(deck, getRecord), amount = Math.floor(total);
    if (amount <= 0) return 0;
    wallet.plots[deck.id] = { pending: total - amount, since: Date.now(), v09Frozen: true };
    wallet.coins += amount;
    save();
    updateBalance();
    return amount;
  }
  function resetPlotAccrual(deck, getRecord) {
    // Keep already-earned coins (including fractional) on deck-learning reset.
    var retained = earningsWithFraction(deck, getRecord);
    wallet.plots[deck.id] = { pending: retained, since: Date.now(), v09Frozen: true };
    save();
  }
  // Harvest is deliberately manual. A hired helper changes the gesture,
  // but never gathers coins automatically or affects spaced repetition.
  var HELPER_COST = 60;
  function helperCost() { return HELPER_COST; }
  function hasHelper(deckId) { return wallet.helpers[deckId] === true; }
  function hireHelper(deckId) {
    if (!deckId || hasHelper(deckId) || wallet.coins < HELPER_COST) return false;
    wallet.coins -= HELPER_COST;
    wallet.helpers[deckId] = true;
    save();
    updateBalance();
    return true;
  }
  function creditHarvest(amount) {
    var value = Math.floor(Number(amount) || 0);
    if (value <= 0 || value > 100) return 0;
    wallet.coins += value;
    save();
    updateBalance();
    return value;
  }

  function getBuyIn() { return BUY_IN; }
  function walletBalance() { return wallet.coins; }
  function updateBalance() {
    if (el("total-coins")) el("total-coins").textContent = fmt(wallet.coins);
  }
  function updateTable() {
    var box = el("session-money");
    if (!box) return;
    box.hidden = !game;
    if (!game) return;
    el("session-buyin").textContent = "◈ " + fmt(game.buyin);
    el("session-bankroll").textContent = "◈ " + fmt(game.bankroll);
    var difference = game.bankroll - game.buyin;
    el("session-profit").textContent = (difference > 0 ? "+" : "") + "◈ " + fmt(difference);
    el("session-profit").classList.toggle("profit", difference > 0);
    el("session-profit").classList.toggle("loss", difference < 0);
  }
  function startSession(eligible) {
    endSession();
    if (eligible && wallet.coins >= BUY_IN) {
      wallet.coins -= BUY_IN;
      game = { buyin: BUY_IN, bankroll: BUY_IN };
      wallet.active = { bankroll: game.bankroll };
      save();
    }
    round = null;
    updateBalance();
    updateTable();
    return !!game;
  }
  function endSession() {
    if (game) {
      wallet.coins += game.bankroll;
      delete wallet.active;
      save();
    }
    game = null; round = null;
    updateBalance(); updateTable();
  }
  function cardValue(record) {
    // More lapses and overdue reviews make a memory more valuable, still with a small bounded range.
    var failures = Math.min(3, Math.max(0, Number(record && record.misses) || 0));
    var dueTime = record && record.dueAt ? Date.parse(record.dueAt) : NaN;
    var overdue = Number.isFinite(dueTime) ?
      Math.max(0, (Date.now() - dueTime) / 86400000) : 0;
    return Math.min(12, 4 + failures * 2 + (overdue > 3 ? 2 : 0));
  }
  function beginRound(record) {
    round = null;
    updateTable();
    var stake = cardValue(record);
    var double = el("double-reveal-button");
    var hint = el("normal-reveal-hint");
    var value = el("card-stake");
    var doubleHint = el("double-reveal-hint");
    var lifelineHint = el("lifeline-hint");
    var enabled = !!game && game.bankroll > 0;
    value.hidden = !game;
    value.innerHTML = "CARD VALUE <strong>◈ " + fmt(stake) + "</strong>";
    hint.textContent = enabled ? "Win +" + stake + " · Miss −" + stake + " coins" : "Free review · no coins";
    double.hidden = !enabled;
    el("reveal-actions").classList.toggle("only-one", !enabled);
    double.disabled = !enabled || game.bankroll < stake * 2;
    doubleHint.textContent = "Win +" + (stake * 2) + " · Miss −" + (stake * 2) + " coins";
    lifelineHint.textContent = enabled ?
      "4 choices · win +" + Math.max(1, Math.round(stake / 4)) + ", lose −" + Math.max(1, Math.round(stake / 4)) :
      "4 choices · assisted recall";
    el("reveal-explainer").textContent = enabled ?
      "Coins at risk come from this session's table, never your whole wallet." :
      "Reviewing without coins; your learning schedule still works.";
  }
  function lockRound(choice) {
    if (round) return false;
    if (!game || game.bankroll <= 0) {
      round = { mode:"practice", stake:0 };
      return true;
    }
    var stake = cardValue(game.currentRecord);
    if (choice === "double" && game.bankroll < stake * 2) return false;
    round = { mode: ["normal","double","lifeline"].includes(choice) ? choice : "normal", stake:stake };
    return true;
  }
  function setCardRecord(record) {
    if (game) game.currentRecord = record || null;
    beginRound(record || null);
  }
  function resolveRound(success) {
    if (!round) return { delta:0,choice:"" };
    var r = round; round = null;
    if (r.mode === "practice" || !game) return { delta:0,choice:"" };
    var amount = r.mode === "double" ? r.stake * 2 :
      r.mode === "lifeline" ? Math.max(1, Math.round(r.stake / 4)) : r.stake;
    var delta = success ? amount : -Math.min(amount, game.bankroll);
    game.bankroll = Math.max(0, game.bankroll + delta);
    wallet.active = { bankroll:game.bankroll };
    save();
    updateTable();
    return { delta:delta, choice:r.mode };
  }
  function renderSummary(finished) {
    var visible = finished.mode === "coins";
    var block = el("summary-coin-block");
    block.hidden = !visible;
    document.querySelector(".summary-stats").classList.toggle("with-coins", visible);
    el("summary-coins").textContent = (finished.coins > 0 ? "+" : "") + fmt(finished.coins);
  }
  window.FlashcardsGame = {
    plotEarnings:plotEarnings,collectPlot:collectPlot,resetPlotAccrual:resetPlotAccrual,
    updateBalance:updateBalance,getBuyIn:getBuyIn,walletBalance:walletBalance,
    startSession:startSession,endSession:endSession,beginRound:setCardRecord,
    lockRound:lockRound,resolveRound:resolveRound,renderSummary:renderSummary,
    helperCost:helperCost,hasHelper:hasHelper,hireHelper:hireHelper,creditHarvest:creditHarvest
  };
  updateBalance();
})();