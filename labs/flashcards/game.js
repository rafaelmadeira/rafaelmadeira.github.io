(function () {
  "use strict";

  var STORAGE_KEY = "flashlab-game-v1"; // Keep v0.5 balances and plot earnings.
  var HOUR = 3600000;
  var START_COINS = 30;
  var STARTER_PLOTS = {
    "br-estados-capitais": 8,
    "america-do-sul-paises": 6,
    "america-do-sul-capitais": 6
  };
  function el(id) { return document.getElementById(id); }
  function read() {
    try {
      var existing = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (existing && typeof existing === "object" && Number.isFinite(existing.coins) &&
        existing.plots && typeof existing.plots === "object") return existing;
    } catch (_) { /* Default to starter wallet. */ }
    return { coins: START_COINS, plots: {} };
  }
  var wallet = read();
  wallet.coins = Math.max(0, Math.floor(wallet.coins));
  var sessionActive = false;
  var currentRound = null;

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet)); }
    catch (error) { console.warn("Unable to save coin progress", error); }
  }
  function fmt(value) { return Number(value).toLocaleString("en-US"); }
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
      var record = getRecord(deck.id, card.id);
      return sum + (record &&
        (record.firstSeenAt || record.lastReviewedAt || Number(record.reviews) > 0) ? 1 : 0);
    }, 0);
  }
  function earningsWithFraction(deck, getRecord) {
    var plot = seedPlot(deck);
    var elapsed = Math.max(0, Date.now() - (Number(plot.since) || Date.now()));
    return Math.max(0, Number(plot.pending) || 0) +
      (elapsed / HOUR) * plantedCount(deck, getRecord) * 0.025;
  }
  function plotEarnings(deck, getRecord) {
    return Math.floor(earningsWithFraction(deck, getRecord));
  }
  function collectPlot(deck, getRecord) {
    var total = earningsWithFraction(deck, getRecord);
    var amount = Math.floor(total);
    if (amount <= 0) return 0;
    wallet.plots[deck.id] = { pending: total - amount, since: Date.now() };
    wallet.coins += amount;
    save();
    updateBalance();
    return amount;
  }
  function updateBalance() {
    if (el("total-coins")) el("total-coins").textContent = fmt(wallet.coins);
  }
  function startSession(eligible) {
    sessionActive = Boolean(eligible);
    currentRound = null;
    updateBalance();
  }
  function endSession() {
    sessionActive = false;
    currentRound = null;
  }
  function beginRound() {
    currentRound = null;
    var doubleButton = el("double-reveal-button");
    var revealButton = el("reveal-button");
    if (!doubleButton || !revealButton) return;
    doubleButton.hidden = !sessionActive;
    el("reveal-actions").classList.toggle("only-one", !sessionActive);
    el("normal-reveal-hint").textContent = sessionActive ?
      "Correct: +1 coin · Miss: −1 coin" : "Practice · no coin changes";
    if (!sessionActive) {
      el("reveal-explainer").textContent = "Extra practice and early reviews do not change your coin balance.";
    } else {
      el("reveal-explainer").textContent = "Choose before seeing the answer. Correct and Effortless count as wins.";
      el("double-reveal-hint").textContent = wallet.coins > 0 ?
        "Win +" + fmt(wallet.coins) + " · Miss −" + fmt(wallet.coins) + " (all coins)" :
        "Earn a coin with normal recall to unlock";
      doubleButton.disabled = wallet.coins === 0;
    }
  }
  function lockRound(choice) {
    if (currentRound) return false;
    if (!sessionActive) {
      currentRound = { mode: "practice", balance: wallet.coins };
      return true;
    }
    if (choice === "double" && wallet.coins <= 0) return false;
    currentRound = {
      mode: choice === "double" ? "double" : "normal",
      balance: wallet.coins
    };
    return true;
  }
  function resolveRound(success) {
    if (!currentRound) return { delta: 0, choice: "" };
    var round = currentRound;
    currentRound = null; // A reveal choice can settle exactly once.
    if (round.mode === "practice") return { delta: 0, choice: "" };
    var delta;
    if (round.mode === "double") {
      // All-in, not ±2 coins: success doubles the entire wallet; failure wipes it.
      delta = success ? round.balance : -round.balance;
    } else {
      delta = success ? 1 : -Math.min(1, round.balance);
    }
    wallet.coins = Math.max(0, wallet.coins + delta);
    save();
    updateBalance();
    return { delta: delta, choice: round.mode };
  }
  function renderSummary(finished) {
    var enabled = finished.mode === "coins";
    var block = el("summary-coin-block");
    block.hidden = !enabled;
    document.querySelector(".summary-stats").classList.toggle("with-coins", enabled);
    el("summary-coins").textContent =
      (finished.coins > 0 ? "+" : "") + fmt(finished.coins);
  }
  window.FlashcardsGame = {
    plotEarnings: plotEarnings,
    collectPlot: collectPlot,
    updateBalance: updateBalance,
    startSession: startSession,
    endSession: endSession,
    beginRound: beginRound,
    lockRound: lockRound,
    resolveRound: resolveRound,
    renderSummary: renderSummary
  };
  updateBalance();
})();