(function () {
  "use strict";
  var STORAGE_KEY = "flashlab-game-v1";
  var HOUR = 3600000;
  var START_COINS = 30;
  var ABILITIES = {
    double: { name: "Double", symbol: "×2", family: "MULTIPLIER", detail: "Double gains & losses" },
    triple: { name: "Triple", symbol: "×3", family: "MULTIPLIER", detail: "Triple gains & losses" },
    shield: { name: "Shield", symbol: "◈", family: "PROTECTION", detail: "Lose no coins on a miss" },
    half: { name: "Half Loss", symbol: "½", family: "PROTECTION", detail: "Halve any coin loss" },
    lucky: { name: "Lucky", symbol: "+3", family: "MODIFIER", detail: "+3 coins on success" },
    boost: { name: "XP Boost", symbol: "✳", family: "MODIFIER", detail: "+50 XP on success" },
    safe: { name: "Safe Bet", symbol: "↗", family: "PROTECTION", detail: "Double win; lose at most 1" }
  };
  var BASE_DECK = [
    "double","shield","lucky","half","boost","safe",
    "double","triple","lucky","shield","boost","half",
    "lucky","double","safe","half","triple","double"
  ];
  var STARTER_PLOTS = {
    "br-estados-capitais": 8,
    "america-do-sul-paises": 6,
    "america-do-sul-capitais": 6
  };
  function el(id) { return document.getElementById(id); }
  function read() {
    try {
      var data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (data && typeof data === "object" && Number.isFinite(data.coins) &&
          data.plots && typeof data.plots === "object") return data;
    } catch (err) { /* Default below. */ }
    return { coins: START_COINS, plots: {} };
  }
  var wallet = read();
  wallet.coins = Math.max(0, Math.floor(wallet.coins));
  var run = null;
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet)); }
    catch (err) { console.warn("Unable to store coin progress", err); }
  }
  function fmt(value) { return Number(value).toLocaleString("en-US"); }
  function randomize(list) {
    var arr = list.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
    }
    return arr;
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
    return deck.cards.reduce(function (count, card) {
      var r = getRecord(deck.id, card.id);
      return count + (r && (r.firstSeenAt || r.lastReviewedAt || Number(r.reviews) > 0) ? 1 : 0);
    }, 0);
  }
  function earningsWithFraction(deck, getRecord) {
    var plot = seedPlot(deck);
    var elapsed = Math.max(0, Date.now() - (Number(plot.since) || Date.now()));
    // Each exposed memory earns 0.025 game coin/hour. The rate is deliberately provisional.
    return Math.max(0, Number(plot.pending) || 0) +
      (elapsed / HOUR) * plantedCount(deck, getRecord) * 0.025;
  }
  function plotEarnings(deck, getRecord) {
    return Math.floor(earningsWithFraction(deck, getRecord));
  }
  function updateBalance() {
    if (el("total-coins")) el("total-coins").textContent = fmt(wallet.coins);
    if (el("session-coins")) el("session-coins").textContent = fmt(wallet.coins);
  }
  function collectPlot(deck, getRecord) {
    var amountTotal = earningsWithFraction(deck, getRecord);
    var coins = Math.floor(amountTotal);
    if (coins <= 0) return 0;
    wallet.plots[deck.id] = { pending: amountTotal - coins, since: Date.now() };
    wallet.coins += coins;
    save();
    updateBalance();
    return coins;
  }
  function drawOne() {
    if (!run.draw.length && run.discard.length) {
      run.draw = randomize(run.discard);
      run.discard = [];
    }
    return run.draw.pop() || null;
  }
  function startSession(wager) {
    run = wager ? {
      draw: randomize(BASE_DECK), discard: [], hand: [], selected: null,
      bet: 0, swapped: false, locked: false
    } : null;
    if (run) for (var i = 0; i < 3; i++) run.hand.push(drawOne());
    updateBalance();
  }
  function endSession() {
    run = null;
    var node = el("game-table");
    if (node) node.hidden = true;
  }
  function beginRound() {
    var board = el("game-table");
    if (!board) return;
    board.hidden = !run;
    if (!run) return;
    run.selected = null;
    run.bet = 0;
    run.swapped = false;
    run.locked = false;
    render();
  }
  function outcome(success, cardName) {
    if (!run) return { delta: 0, bonusXP: 0, special: "" };
    var wager = run.bet || 1;
    var coins = success ? wager : -wager;
    var xp = 0;
    if (cardName === "double") coins *= 2;
    if (cardName === "triple") coins *= 3;
    if (cardName === "shield" && !success) coins = 0;
    if (cardName === "half" && !success) coins = -Math.ceil(Math.abs(coins) / 2);
    if (cardName === "lucky" && success) coins += 3;
    if (cardName === "boost" && success) xp = 50;
    if (cardName === "safe") coins = success ? coins * 2 : Math.max(-1, coins);
    coins = Math.max(-wallet.coins, coins);
    return { delta: coins, bonusXP: xp, special: cardName ? ABILITIES[cardName].name : "" };
  }
  function render() {
    if (!run || !el("game-table")) return;
    el("hand-count").textContent = run.hand.length + " / 3";
    el("draw-count").textContent = run.draw.length + " left";
    el("session-coins").textContent = fmt(wallet.coins);
    el("special-hand").innerHTML = run.hand.map(function (id, index) {
      var card = ABILITIES[id];
      var chosen = run.selected === index;
      return '<button type="button" data-hand-index="' + index +
        '" class="special-card' + (chosen ? ' selected' : '') +
        '" aria-pressed="' + chosen + '"' + (run.locked ? ' disabled' : '') +
        '><span class="special-family">' + card.family + '</span>' +
        '<span class="special-symbol" aria-hidden="true">' + card.symbol + '</span>' +
        '<strong>' + card.name + '</strong><small>' + card.detail + '</small>' +
        (chosen ? '<span class="special-tag">WILL PLAY</span>' : '') +
        '</button>';
    }).join("");
    var canSwap = run.selected !== null && !run.swapped && !run.locked;
    el("discard-and-draw").disabled = !canSwap;
    el("swap-count").textContent = run.swapped ? "used" : "1 left";
    el("deselect-card").disabled = run.selected === null || run.locked;
    Array.prototype.forEach.call(el("wager-options").querySelectorAll("[data-wager]"), function (button) {
      var wager = Number(button.dataset.wager);
      button.disabled = run.locked || (wager > 0 && wager > wallet.coins);
      button.setAttribute("aria-pressed", String(wager === run.bet));
    });
    var name = run.selected === null ? null : run.hand[run.selected];
    var winning = outcome(true, name);
    var losing = outcome(false, name);
    el("round-preview").textContent =
      "Correct: +" + winning.delta + " coins" +
      (winning.bonusXP ? " + " + winning.bonusXP + " XP" : "") +
      " · Miss: " + (losing.delta < 0 ? "−" + Math.abs(losing.delta) : losing.delta) + " coins";
    el("game-instruction").textContent = run.locked
      ? "Choice locked. Rate your recall to resolve the wager and play your selected card."
      : (name ? ABILITIES[name].name + " ready to play. It will be used when you rate your answer." :
        "Select one special card, discard and draw once, or keep your hand for later.");
  }
  function lockRound() {
    if (!run) return;
    run.locked = true;
    render();
  }
  function selectCard(index) {
    if (!run || run.locked || index < 0 || index >= run.hand.length) return;
    run.selected = run.selected === index ? null : index;
    render();
  }
  function swapCard() {
    if (!run || run.locked || run.swapped || run.selected === null) return;
    var idx = run.selected;
    var old = run.hand.splice(idx, 1)[0];
    run.discard.push(old);
    var next = drawOne();
    if (next) run.hand.splice(idx, 0, next);
    run.selected = null;
    run.swapped = true;
    render();
  }
  function selectWager(number) {
    if (!run || run.locked || number < 0 || number > wallet.coins) return;
    if ([0,1,3,5,10].indexOf(number) < 0) return;
    run.bet = number;
    render();
  }
  function resolveRound(success) {
    if (!run) return { delta: 0, bonusXP: 0, special: "" };
    // The reveal locked wager and card choice before the learner sees the answer.
    if (!run.locked) return { delta: 0, bonusXP: 0, special: "" };
    var cardName = run.selected === null ? null : run.hand[run.selected];
    var result = outcome(success, cardName);
    wallet.coins = Math.max(0, wallet.coins + result.delta);
    save();
    updateBalance();
    if (cardName) {
      run.hand.splice(run.selected, 1);
      run.discard.push(cardName);
      var drawn = drawOne();
      if (drawn) run.hand.push(drawn);
    }
    return result;
  }
  function renderSummary(finished) {
    var coinStat = el("summary-coin-block");
    var statContainer = document.querySelector(".summary-stats");
    var wager = finished.mode === "wager";
    coinStat.hidden = !wager;
    statContainer.classList.toggle("with-coins", wager);
    el("summary-coins").textContent = (finished.coins > 0 ? "+" : "") + fmt(finished.coins);
  }
  document.addEventListener("click", function (e) {
    if (!run || !el("game-table") || el("game-table").hidden) return;
    var selected = e.target.closest("[data-hand-index]");
    if (selected && el("game-table").contains(selected)) {
      selectCard(Number(selected.dataset.handIndex)); return;
    }
    var bet = e.target.closest("[data-wager]");
    if (bet && el("wager-options").contains(bet)) {
      selectWager(Number(bet.dataset.wager)); return;
    }
    if (e.target.closest("#discard-and-draw")) swapCard();
    if (e.target.closest("#deselect-card") && !run.locked) {
      run.selected = null; render();
    }
  });
  window.FlashcardsGame = {
    plotEarnings: plotEarnings, collectPlot: collectPlot, updateBalance: updateBalance,
    startSession: startSession, endSession: endSession, beginRound: beginRound,
    lockRound: lockRound, resolveRound: resolveRound, renderSummary: renderSummary
  };
  updateBalance();
})();
