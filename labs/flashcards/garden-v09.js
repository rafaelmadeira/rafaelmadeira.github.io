(function () {
  "use strict";

  // v0.9: the plot is the long-term memory garden; the session strip is the
  // history of individual encounters. They intentionally use different states.
  var base = window.FlashcardsGarden;
  if (!base) return;

  var STORE_KEY = "flashlab-plots-v09";
  var HOUR = 60 * 60 * 1000;
  var HARVEST_VALUE = 3;
  var ICONS = {
    "br-estados-capitais": "🇧🇷",
    "america-do-sul-paises": "🌎",
    "america-do-sul-capitais": "🧭"
  };
  var SUGGESTED = ["🦉", "🌎", "🧠", "📚", "🚀", "⭐", "🐸", "💎", "🏛️", "🧭", "🇧🇷", "🌻"];
  var cached = null;
  var current = null;
  var demo = false;
  var demoPicked = Object.create(null);
  var scythe = false;
  var dragging = false;
  var critterSeed = 0;

  function el(id) { return document.getElementById(id); }
  function number(value) { return Number(value || 0).toLocaleString("en-US"); }
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
    });
  }
  function readStore() {
    try {
      var x = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
      if (x && typeof x === "object" && !Array.isArray(x)) {
        return {
          emojis: x.emojis && typeof x.emojis === "object" ? x.emojis : {},
          harvested: x.harvested && typeof x.harvested === "object" ? x.harvested : {},
          earned: x.earned && typeof x.earned === "object" ? x.earned : {}
        };
      }
    } catch (_) {}
    return { emojis: {}, harvested: {}, earned: {} };
  }
  var plotStore = readStore();
  function saveStore() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(plotStore)); }
    catch (error) { console.warn("Could not save plot settings", error); }
  }
  function emojiFor(deck) {
    return plotStore.emojis[deck.id] || ICONS[deck.id] ||
      (deck.symbol && deck.symbol !== "✳" ? deck.symbol : "🌱");
  }
  function setEmoji(deck, value) {
    var valueString = String(value || "").trim();
    if (!valueString) return false;
    // One grapheme keeps composed flags and joined emoji together.
    var clusters = typeof Intl.Segmenter === "function"
      ? Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(valueString), function (part) { return part.segment; })
      : Array.from(valueString);
    var icon = clusters[0] || "";
    if (!icon || icon.length > 16) return false;
    plotStore.emojis[deck.id] = icon;
    saveStore();
    return true;
  }
  function harvestedAt(deck, card) {
    return Number(plotStore.harvested[deck.id] && plotStore.harvested[deck.id][card.id]) || 0;
  }
  function planted(record) {
    return !!(record && (record.firstSeenAt || record.lastReviewedAt || Number(record.reviews) > 0));
  }
  function cellStage(deck, card, getRecord, now, index) {
    if (demo && index < Math.min(12, deck.cards.length))
      return demoPicked[card.id] ? "budding" : "mature";
    var r = getRecord(deck.id, card.id);
    if (!planted(r)) return "empty";
    var m = base.metrics(deck.id, card.id, getRecord, now);
    var recentFailure = ["norecall", "incorrect", "again"].indexOf(r.lastRating) >= 0;
    if (recentFailure || r.lastRating === "assisted" || Number(r.correct) <= 0 || m.health < 35)
      return "budding";
    var canMature = Number(r.streak) >= 2 && Number(r.intervalDays) >= 3 && m.health >= 35;
    var phase = canMature ? "mature" : "growing";
    var lastHarvest = harvestedAt(deck, card);
    if (lastHarvest) {
      var hours = Math.max(0, (now - lastHarvest) / HOUR);
      if (hours < 0.25) return "budding";
      if (hours < 6) return "growing";
    }
    return phase;
  }
  function stages(deck, getRecord, now) {
    var out = { empty: 0, budding: 0, growing: 0, mature: 0 };
    deck.cards.forEach(function (card, index) { out[cellStage(deck, card, getRecord, now, index)]++; });
    return out;
  }
  function makeTile(deck, card, index, getRecord, now, isPreview) {
    var stage = cellStage(deck, card, getRecord, now, index);
    var tile = document.createElement(isPreview ? "span" : "button");
    tile.className = "plot-tile stage-" + stage + (isPreview ? " preview-tile" : "");
    tile.dataset.stage = stage;
    tile.dataset.index = index;
    tile.textContent = stage === "budding" ? "🌱" : stage === "empty" ? "" : emojiFor(deck);
    var memory = base.metrics(deck.id, card.id, getRecord, now);
    if (memory.studied) {
      // Memory-health color is a narrow underline. The emoji/growth is a
      // separate visual layer; changing palettes never changes memory records.
      tile.style.borderBottom = (isPreview ? "2px" : "4px") + " solid " + base.color(memory);
    }
    if (isPreview) {
      tile.setAttribute("aria-hidden", "true");
    } else {
      tile.type = "button";
      tile.disabled = stage !== "mature";
      var m = base.metrics(deck.id, card.id, getRecord, now);
      tile.title = card.front + " · " + (stage === "mature" ? "Ready to harvest" : stage) +
        (m.studied ? " · estimated memory " + m.health + "%" : "");
      tile.setAttribute("aria-label", card.front + " — " +
        (stage === "mature" ? "harvest for " + HARVEST_VALUE + " coins" : stage));
    }
    return tile;
  }
  function lastModified(deck, card, getRecord) {
    var r = getRecord(deck.id, card.id);
    var value = r && (r.lastReviewedAt || r.firstSeenAt);
    var ms = Date.parse(value || "");
    return Number.isFinite(ms) ? ms : 0;
  }
  function preview(deck, getRecord) {
    var grid = document.createElement("div");
    grid.className = "plot-preview";
    grid.setAttribute("aria-hidden", "true");
    var cards = deck.cards.slice().sort(function (a, b) {
      return lastModified(deck, b, getRecord) - lastModified(deck, a, getRecord);
    }).slice(0, 100);
    var now = Date.now();
    cards.forEach(function (card) {
      var index = deck.cards.indexOf(card);
      grid.appendChild(makeTile(deck, card, index, getRecord, now, true));
    });
    // Decorative critter has no relation to the cards or their memory state.
    var critter = document.createElement("span");
    critter.className = "preview-critter";
    critter.textContent = "🐞";
    grid.appendChild(critter);
    return grid;
  }
  function render(decks, getRecord, deckStats, startSession, game) {
    cached = { decks: decks, getRecord: getRecord, deckStats: deckStats, startSession: startSession, game: game };
    var host = el("deck-grid");
    if (!host) return;
    host.replaceChildren();
    decks.forEach(function (deck) {
      var stats = deckStats(deck);
      var counts = stages(deck, getRecord, Date.now());
      var ready = stats.due + stats.newCards;
      var card = document.createElement("article");
      card.className = "deck-card garden-deck v09-deck";
      card.innerHTML =
        '<div class="deck-card-top"><span class="deck-symbol" aria-hidden="true">' + escapeHTML(emojiFor(deck)) +
        '</span><span class="deck-meta">' + deck.cards.length + ' CARDS' +
        (deck.imported ? ' · IMPORTED' : '') + '</span></div>' +
        '<h3>' + escapeHTML(deck.title) + '</h3>' +
        '<p class="deck-description">' + escapeHTML(deck.description || "Personal study deck.") + '</p>' +
        '<div class="plot-preview-shell"></div>' +
        '<div class="preview-statline"><span><strong>' + counts.mature +
        '</strong> ready to harvest</span><span>' + (deck.cards.length > 100 ? 'Latest 100 shown' : deck.cards.length + ' cards') + '</span></div>' +
        '<div class="deck-spacer"></div>' +
        '<div class="plot-preview-actions"><button type="button" class="plot-open-link">' +
        (deck.cards.length > 100 ? "See all →" : "Open plot →") + '</button>' +
        '<button type="button" class="deck-play-button study-deck">' +
        (ready ? "Study deck ↗" : "Practice deck ↗") + '</button></div>' +
        '<div class="preview-due">' + (ready ? '<strong>' + ready + '</strong> cards ready to study' :
        '✓ All reviews up to date') +
        (game && game.hasHelper && game.hasHelper(deck.id) ? '<span>⚒ HELPER</span>' : '') + '</div>';
      card.querySelector(".plot-preview-shell").appendChild(preview(deck, getRecord));
      card.querySelector(".study-deck").addEventListener("click", function () { startSession(deck); });
      card.querySelector(".plot-open-link").addEventListener("click", function () {
        if (window.FlashcardsOpenPlot) window.FlashcardsOpenPlot(deck);
      });
      host.appendChild(card);
    });
    var legend = el("garden-legend");
    if (legend) {
      legend.innerHTML =
        '<span>Empty</span><span class="plot-legend-key"><i class="legend-empty"></i> → 🌱 → ' +
        escapeHTML("🌎") + ' → ' + escapeHTML("🌎") + '</span><span>Mature / ready to harvest</span>';
      legend.setAttribute("aria-label", "Gray empty, seedling, small faded emoji, full-color mature emoji");
    }
    var disclaimer = document.querySelector(".garden-disclaimer");
    if (disclaimer) disclaimer.textContent =
      "Each cell is one flashcard. Plants grow as recall becomes more reliable. The plot never replaces your spaced-repetition schedule.";
  }

  function updateCounts() {
    if (!current) return;
    var board = el("plot-board");
    if (!board) return;
    var count = { empty: 0, budding: 0, growing: 0, mature: 0 };
    board.querySelectorAll(".plot-tile").forEach(function (tile) {
      count[tile.dataset.stage] = (count[tile.dataset.stage] || 0) + 1;
    });
    ["empty", "budding", "growing", "mature"].forEach(function (status) {
      var node = el("plot-count-" + status);
      if (node) node.textContent = number(count[status]);
    });
    if (el("plot-harvest-value")) el("plot-harvest-value").textContent = "◈ " + number(count.mature * HARVEST_VALUE);
    if (el("plot-earned-total"))
      el("plot-earned-total").textContent = "◈ " + number(plotStore.earned[current.deck.id] || 0);
    if (el("plot-wallet-balance") && current.game)
      el("plot-wallet-balance").textContent = "◈ " + number(current.game.walletBalance());
    var harvestButton = el("plot-harvest-mode");
    if (harvestButton) harvestButton.disabled = count.mature === 0 && !scythe;
  }
  function describeNotice(message) {
    var node = el("plot-notice");
    if (!node) return;
    node.textContent = message;
  }
  function changeTile(tile, stage, deck) {
    tile.dataset.stage = stage;
    tile.className = "plot-tile stage-" + stage + " just-harvested";
    tile.disabled = stage !== "mature";
    tile.textContent = stage === "budding" ? "🌱" : stage === "empty" ? "" : emojiFor(deck);
  }
  function harvest(tile) {
    if (!current || !tile || tile.dataset.stage !== "mature") return false;
    var index = Number(tile.dataset.index);
    var card = current.deck.cards[index];
    if (!card) return false;
    var isDemo = demo;
    if (isDemo) {
      demoPicked[card.id] = true;
    } else {
      if (!plotStore.harvested[current.deck.id]) plotStore.harvested[current.deck.id] = {};
      plotStore.harvested[current.deck.id][card.id] = Date.now();
      plotStore.earned[current.deck.id] = Number(plotStore.earned[current.deck.id] || 0) + HARVEST_VALUE;
      saveStore();
      if (current.game && current.game.creditHarvest) current.game.creditHarvest(HARVEST_VALUE);
    }
    changeTile(tile, "budding", current.deck);
    describeNotice(isDemo ? "Demo harvest — no coins added or memory changed." :
      "◈ +" + HARVEST_VALUE + " coins harvested. Memory progress stays intact.");
    updateCounts();
    return true;
  }
  function scytheCursor() {
    var cursor = el("scythe-cursor");
    if (!cursor) {
      cursor = document.createElement("div");
      cursor.id = "scythe-cursor";
      cursor.setAttribute("aria-hidden", "true");
      cursor.innerHTML =
        '<svg width="46" height="46" viewBox="0 0 46 46" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M11 37 L27 15" stroke="#86623d" stroke-width="5" stroke-linecap="round"/>' +
        '<path d="M27 16 Q35 4 44 5 Q39 19 25 23 L21 19 Z" fill="#b9c2be" stroke="#5e7771" stroke-width="2"/>' +
        '</svg>';
      document.body.appendChild(cursor);
    }
    return cursor;
  }
  function toggleScythe(next) {
    scythe = Boolean(next);
    dragging = false;
    document.body.classList.toggle("scythe-active", scythe);
    var cursor = el("scythe-cursor");
    if (cursor) cursor.hidden = !scythe;
    var button = el("plot-harvest-mode");
    if (button) {
      button.setAttribute("aria-pressed", String(scythe));
      button.textContent = scythe ? "Done harvesting ✓" : "⚒ Harvest";
    }
    var board = el("plot-board");
    if (board) board.classList.toggle("harvest-mode", scythe);
    if (scythe) describeNotice("Hold and drag across mature cells to harvest them.");
    updateCounts();
  }
  function tileFromPointer(event) {
    var picked = document.elementFromPoint(event.clientX, event.clientY);
    if (!picked || !current || !el("plot-board") || !el("plot-board").contains(picked)) return null;
    return picked.closest(".plot-tile");
  }
  function isHelperAvailable() {
    return !!(demo || (current && current.game && current.game.hasHelper(current.deck.id)));
  }
  function attachBoardEvents(board) {
    board.addEventListener("click", function (event) {
      var tile = event.target.closest(".plot-tile");
      if (!tile) return;
      if (!isHelperAvailable() || scythe) harvest(tile);
      else describeNotice("Select Harvest to use your helper's scythe, or click a ready cell.");
    });
    board.addEventListener("pointerdown", function (event) {
      if (!scythe || event.button !== 0) return;
      dragging = true;
      harvest(tileFromPointer(event));
      event.preventDefault();
    });
    board.addEventListener("pointermove", function (event) {
      if (!scythe || !dragging) return;
      harvest(tileFromPointer(event));
      event.preventDefault();
    });
  }
  document.addEventListener("pointerup", function () { dragging = false; });
  document.addEventListener("pointercancel", function () { dragging = false; });
  document.addEventListener("pointermove", function (event) {
    if (!scythe) return;
    var cursor = el("scythe-cursor");
    if (cursor) {
      cursor.style.left = (event.clientX + 10) + "px";
      cursor.style.top = (event.clientY - 29) + "px";
    }
  });
  function lastReviewLabel(deck, getRecord) {
    var latest = 0;
    deck.cards.forEach(function (card) {
      var r = getRecord(deck.id, card.id);
      var t = Date.parse(r && r.lastReviewedAt || "");
      if (Number.isFinite(t)) latest = Math.max(latest, t);
    });
    if (!latest) return "Never";
    var minutes = Math.max(0, Math.round((Date.now() - latest) / 60000));
    if (minutes < 2) return "Just now";
    if (minutes < 60) return minutes + " min ago";
    var hours = Math.round(minutes / 60);
    if (hours < 48) return hours + " h ago";
    return Math.round(hours / 24) + " d ago";
  }
  function recentActivity(deck, getRecord) {
    var history = deck.cards.map(function (card) {
      return { card: card, record: getRecord(deck.id, card.id) };
    }).filter(function (item) { return item.record && item.record.lastReviewedAt; })
      .sort(function (a, b) { return Date.parse(b.record.lastReviewedAt) - Date.parse(a.record.lastReviewedAt); })
      .slice(0, 5);
    if (!history.length) return '<p class="plot-activity-empty">Study some cards to see your recent activity.</p>';
    return history.map(function (item) {
      var rating = ({
        norecall: "No recall", incorrect: "Incorrect", correct: "Correct",
        effortless: "Effortless", assisted: "Lifeline"
      })[item.record.lastRating] || "Studied";
      return '<div class="plot-activity-row"><span>' + escapeHTML(item.card.front) +
        '</span><strong>' + escapeHTML(rating) + '</strong></div>';
    }).join("");
  }
  function renderPlot(deck, getRecord, deckStats, startSession, game) {
    current = { deck: deck, getRecord: getRecord, deckStats: deckStats, startSession: startSession, game: game };
    toggleScythe(false);
    var host = el("plot-view");
    if (!host) return;
    var stats = deckStats(deck);
    var ready = stats.newCards + stats.due;
    var legacy = game && game.plotEarnings ? game.plotEarnings(deck, getRecord) : 0;
    var helper = game && game.hasHelper && game.hasHelper(deck.id);
    var cost = game && game.helperCost ? game.helperCost() : 60;
    var emoji = emojiFor(deck);
    host.innerHTML =
      '<div class="plot-navigation"><button type="button" class="back-link" id="plot-back"><span aria-hidden="true">←</span> Your plots</button>' +
      '<span class="eyebrow">YOUR MEMORY GARDEN / PLOT DETAILS</span></div>' +
      '<div class="plot-page-heading"><div><span class="plot-overline">' + deck.cards.length + ' FLASHCARDS · ' +
      (deck.imported ? 'IMPORTED DECK' : 'STARTER DECK') + '</span><h1><span aria-hidden="true">' +
      escapeHTML(emoji) + '</span> ' + escapeHTML(deck.title) + '</h1><p>' +
      escapeHTML(deck.description || "Study and watch this plot grow.") + '</p></div>' +
      '<button type="button" class="button button-primary" id="plot-study">' +
      (ready ? 'Study deck ↗' : 'Practice deck ↗') + '</button></div>' +
      '<div class="plot-detail-layout"><section class="plot-board-panel"><div class="plot-board-head">' +
      '<div><strong>Your plot</strong><span id="plot-board-count">' + deck.cards.length + ' cells · all cards</span></div>' +
      '<div class="plot-palette-switch" aria-label="Memory color palette">' +
      '<button type="button" data-v09-palette="greens">4 greens</button>' +
      '<button type="button" data-v09-palette="spectrum">Red → green</button></div></div>' +
      '<div class="plot-board-viewport"><div class="plot-board" id="plot-board"></div>' +
      '<span class="plot-field-critter critter-one" aria-hidden="true">🐞</span>' +
      '<span class="plot-field-critter critter-two" aria-hidden="true">🐛</span>' +
      (helper ? '<span class="plot-field-helper" aria-hidden="true" title="Your helper">🧑‍🌾</span>' : '') + '</div>' +
      '<div class="plot-board-footer"><span>Click each mature cell to harvest. A helper lets you sweep.</span>' +
      '<span class="plot-legend-inline">□ empty &nbsp; 🌱 budding &nbsp; ' + escapeHTML(emoji) +
      ' growing &nbsp; ' + escapeHTML(emoji) + ' mature</span></div>' +
      '<div class="plot-harvest-actions"><button type="button" class="button button-primary" id="plot-harvest-mode" hidden>⚒ Harvest</button>' +
      '<span id="plot-notice" role="status" aria-live="polite">Mature cells are worth ' + HARVEST_VALUE + ' coins each.</span></div>' +
      '</section><aside class="plot-sidebar">' +
      '<section class="plot-side-card"><span class="plot-overline">PERSONALIZE</span><h2>Your plot icon</h2>' +
      '<div class="plot-emoji-picker" id="plot-emoji-picker"></div>' +
      '<div class="plot-custom-emoji"><input type="text" id="plot-emoji-input" aria-label="Choose one emoji for this plot" ' +
      'placeholder="Or paste any emoji" maxlength="24" autocomplete="off">' +
      '<button type="button" id="plot-emoji-save">Set emoji</button></div>' +
      '</section>' +
      '<section class="plot-side-card helper-card"><span class="plot-overline">WORKERS</span>' +
      '<h2>Harvest helper <span aria-hidden="true">⚒</span></h2>' +
      '<p>' + (helper ? 'Hired! Activate the scythe and sweep through mature cells.' :
        'Without a helper, harvest each cell individually. Hire one to unlock click-and-drag harvesting.') +
      '</p><button type="button" class="button ' + (helper ? 'helper-hired' : 'helper-buy') +
      '" id="plot-helper-action"' + (helper ? ' disabled' : '') + '>' +
      (helper ? '✓ Helper hired' : 'Hire helper · ◈ ' + cost) + '</button>' +
      '<p class="helper-detail">One-time unlock for this plot. No automatic harvesting.</p></section>' +
      '<section class="plot-side-card plot-stats-card"><span class="plot-overline">PLOT STATS</span>' +
      '<div class="plot-mini-stats"><div><span>Empty</span><strong id="plot-count-empty">0</strong></div>' +
      '<div><span>Budding</span><strong id="plot-count-budding">0</strong></div>' +
      '<div><span>Growing</span><strong id="plot-count-growing">0</strong></div>' +
      '<div><span>Mature</span><strong id="plot-count-mature">0</strong></div></div>' +
      '<div class="plot-economy-stat"><span>Available to harvest</span><strong id="plot-harvest-value">◈ 0</strong></div>' +
      '<div class="plot-economy-stat"><span>Harvested from this plot</span><strong id="plot-earned-total">◈ 0</strong></div>' +
      '<div class="plot-economy-stat"><span>Wallet</span><strong id="plot-wallet-balance">◈ 0</strong></div>' +
      '<div class="plot-economy-stat"><span>Seeds planted</span><strong>' +
      deck.cards.filter(function (card) { return planted(getRecord(deck.id, card.id)); }).length + '</strong></div>' +
      '<div class="plot-economy-stat"><span>Last review</span><strong>' +
      escapeHTML(lastReviewLabel(deck, getRecord)) + '</strong></div>' +
      '<div class="plot-economy-stat"><span>Workers</span><strong>' + (helper ? '1' : '0') + '</strong></div>' +
      '<div class="plot-economy-stat"><span>Due / new</span><strong>' + ready + '</strong></div>' +
      (legacy > 0 ? '<div class="plot-legacy"><span>Unclaimed v0.8 earnings: ◈ ' + legacy +
        '</span><button type="button" id="plot-legacy-collect">Claim old coins</button></div>' : '') +
      '</section>' +
      '<section class="plot-side-card plot-activity-card"><span class="plot-overline">RECENT ACTIVITY</span>' +
      '<h2>Last reviewed</h2><div class="plot-activity-list">' + recentActivity(deck, getRecord) +
      '</div></section>' +
      '<section class="plot-side-card plot-test-card"><span class="plot-overline">PROTOTYPE TOOL</span>' +
      '<h2>Try harvesting</h2><p>Preview 12 mature cells and a loaner helper immediately. This changes no memories or coins.</p>' +
      '<button type="button" id="plot-demo" class="button plot-demo-button">' +
      (demo ? 'Stop demo preview' : 'Preview harvest (demo)') + '</button></section>' +
      '<button class="plot-reset" type="button" id="plot-reset-progress">Reset this deck’s study progress</button>' +
      '</aside></div>';
    var board = el("plot-board");
    var now = Date.now();
    deck.cards.forEach(function (card, index) {
      board.appendChild(makeTile(deck, card, index, getRecord, now, false));
    });
    attachBoardEvents(board);
    el("plot-back").addEventListener("click", function () {
      toggleScythe(false);
      demo = false;
      demoPicked = Object.create(null);
      if (window.FlashcardsClosePlot) window.FlashcardsClosePlot();
    });
    el("plot-study").addEventListener("click", function () {
      toggleScythe(false);
      demo = false;
      demoPicked = Object.create(null);
      startSession(deck);
    });
    var picker = el("plot-emoji-picker");
    SUGGESTED.forEach(function (suggestion) {
      var button = document.createElement("button");
      button.type = "button";
      button.textContent = suggestion;
      button.className = "emoji-option" + (suggestion === emoji ? " selected" : "");
      button.setAttribute("aria-label", "Use " + suggestion);
      button.setAttribute("aria-pressed", String(suggestion === emoji));
      button.addEventListener("click", function () {
        setEmoji(deck, suggestion);
        renderPlot(deck, getRecord, deckStats, startSession, game);
      });
      picker.appendChild(button);
    });
    el("plot-emoji-save").addEventListener("click", function () {
      if (setEmoji(deck, el("plot-emoji-input").value)) {
        renderPlot(deck, getRecord, deckStats, startSession, game);
      } else describeNotice("Enter one emoji or symbol.");
    });
    el("plot-emoji-input").addEventListener("keydown", function (event) {
      if (event.key === "Enter") { event.preventDefault(); el("plot-emoji-save").click(); }
    });
    el("plot-helper-action").addEventListener("click", function () {
      if (helper) return;
      if (game && game.hireHelper && game.hireHelper(deck.id)) {
        renderPlot(deck, getRecord, deckStats, startSession, game);
        describeNotice("Helper hired! Click Harvest, then drag across mature cells.");
      } else {
        describeNotice("Not enough coins yet — keep studying or harvest manually.");
      }
    });
    el("plot-reset-progress").addEventListener("click", function () {
      if (window.FlashcardsResetDeck) window.FlashcardsResetDeck(deck);
      // Reset prompt is handled by the app. It returns to the library on success.
    });
    el("plot-demo").addEventListener("click", function () {
      demo = !demo;
      demoPicked = Object.create(null);
      toggleScythe(false);
      renderPlot(deck, getRecord, deckStats, startSession, game);
      describeNotice(demo ?
        "Demo: 12 mature cells and a loaner helper, with no real coins or memory changes." :
        "Demo ended. Your real plot and progress are unchanged.");
    });
    var hasTool = helper || demo;
    el("plot-harvest-mode").hidden = !hasTool;
    el("plot-harvest-mode").addEventListener("click", function () { toggleScythe(!scythe); });
    var oldCoinsButton = el("plot-legacy-collect");
    if (oldCoinsButton) oldCoinsButton.addEventListener("click", function () {
      var received = game.collectPlot(deck, getRecord);
      renderPlot(deck, getRecord, deckStats, startSession, game);
      describeNotice("◈ +" + received + " coins carried over from the previous plot system.");
    });
    document.querySelectorAll("[data-v09-palette]").forEach(function (button) {
      var selected = button.getAttribute("data-v09-palette") === base.currentPalette();
      button.setAttribute("aria-pressed", String(selected));
      button.addEventListener("click", function () {
        // The original palette controls are deliberately absent from the library;
        // only v0.9 controls exist, so the old garden never redraws v0.8 cards.
        base.changePalette(button.getAttribute("data-v09-palette"));
        renderPlot(deck, getRecord, deckStats, startSession, game);
      });
    });
    updateCounts();
  }
  function closePlot() {
    toggleScythe(false);
    demo = false;
    demoPicked = Object.create(null);
    current = null;
  }

  // Reuse the v0.8 memory-health model and palette functions to preserve data.
  base.render = render;
  base.renderPlot = renderPlot;
  base.closePlot = closePlot;
  base.resetDeckVisuals = function (deck) {
    delete plotStore.harvested[deck.id];
    saveStore();
  };
  base.currentPlot = function () { return current && current.deck; };
  base.harvestValue = HARVEST_VALUE;
})();
