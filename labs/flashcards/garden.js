(function () {
  "use strict";
  var DAY = 86400000;
  var FACTOR = 19 / 81;
  var cached = null;
  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }
  function number(v) { return Math.max(0, Number(v) || 0); }
  function fmt(v) { return Number(v).toLocaleString("en-US"); }
  function firstSeen(r) { return r && (r.firstSeenAt || r.lastReviewedAt || null); }
  function stage(peak, reviewed) {
    if (!reviewed) return "Exposed";
    if (peak < 3) return "Newly learned";
    if (peak < 14) return "Budding";
    if (peak < 60) return "Growing";
    if (peak < 180) return "Well established";
    return "Deeply rooted";
  }
  function dueLabel(r, now) {
    if (!r || !number(r.reviews)) return "Ready to study";
    var due = Date.parse(r.dueAt || "");
    if (!Number.isFinite(due) || due <= now) return "Due now";
    var minutes = Math.ceil((due - now) / 60000);
    if (minutes < 60) return "In " + minutes + " min";
    if (minutes < 1440) return "In " + Math.ceil(minutes / 60) + " hr";
    return "In " + Math.ceil(minutes / 1440) + " days";
  }
  function metrics(deckId, cardId, getRecord, now) {
    now = now || Date.now();
    var r = getRecord(deckId, cardId);
    var born = firstSeen(r);
    var bornMs = Date.parse(born || "");
    var studied = Boolean(r && (r.firstSeenAt || r.lastReviewedAt || number(r.reviews)));
    if (!studied) {
      return { studied: false, health: null, age: null, stability: null,
        stage: "Unseen", phase: "Not opened", due: "Not studied", legacyAge: false };
    }
    var reviews = number(r.reviews);
    var lastMs = Date.parse(r.lastReviewedAt || born || "");
    var elapsedDays = Number.isFinite(lastMs) ? Math.max(0, (now - lastMs) / DAY) : 0;
    var assisted = r.lastRating === "assisted";
    var lastSuccess = assisted || ["correct","effortless","good","easy","hard"].indexOf(r.lastRating) >= 0;
    var stability = reviews && lastSuccess
      ? Math.max(1 / 144, Number(r.intervalDays) || 1)
      : (reviews ? 10 / 1440 : 0.08);
    var startHealth = reviews ? (assisted ? 0.65 : lastSuccess ? 1 : 0.38) : 0.30;
    var health = Math.max(0, Math.min(100,
      Math.round(100 * startHealth * Math.pow(1 + FACTOR * elapsedDays / stability, -0.5))
    ));
    var peak = Math.max(
      number(r.peakStabilityDays),
      number(r.intervalDays),
      r.masteryReachedAt ? 30 : 0
    );
    var growth = stage(peak, reviews > 0);
    var phase = health >= 95 ? "Thriving" : health >= 80 ? "Healthy" :
      health >= 55 ? "Fading" : "Wilting";
    return {
      studied: true, health: health, stability: stability, stage: growth, phase: phase,
      age: Number.isFinite(bornMs) ? Math.max(0, Math.floor((now - bornMs) / DAY)) : null,
      due: dueLabel(r, now), legacyAge: !r.firstSeenAt && Boolean(r.lastReviewedAt)
    };
  }
  // Plot palette is visual-only. Never change the scheduler, estimated health, or review data.
  var PALETTE_KEY = "flashlab-plot-palette-v1";
  var UNOPENED = "#e8ecee";
  var GREENS = ["#d8f2be", "#9bd982", "#41b56b", "#086b45"];
  // Anchors define a continuous (interpolated) red-to-green gradient.
  var SPECTRUM = [
    [216, 83, 80],   // red
    [236, 153, 75],  // orange
    [237, 204, 80],  // gold
    [160, 201, 90],  // chartreuse
    [33, 128, 77]    // deep green
  ];
  function storedPalette() {
    try { return localStorage.getItem(PALETTE_KEY) === "spectrum" ? "spectrum" : "greens"; }
    catch (_) { return "greens"; }
  }
  var palette = storedPalette();
  function colorFromSpectrum(health) {
    var scaled = Math.max(0, Math.min(100, Number(health) || 0)) / 25;
    var lower = Math.min(3, Math.floor(scaled));
    var t = Math.max(0, Math.min(1, scaled - lower));
    var start = SPECTRUM[lower], end = SPECTRUM[lower + 1];
    var hex = start.map(function (channel, i) {
      return Math.round(channel + (end[i] - channel) * t).toString(16).padStart(2, "0");
    });
    return "#" + hex.join("");
  }
  function color(m) {
    if (!m.studied) return UNOPENED;
    var health = Math.max(0, Math.min(100, Number(m.health) || 0));
    if (palette === "spectrum") return colorFromSpectrum(health);
    return GREENS[Math.min(3, Math.floor(health / 25))];
  }
  function refreshPaletteControls() {
    document.querySelectorAll("[data-plot-palette]").forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.dataset.plotPalette === palette));
    });
    var legend = document.getElementById("legend-swatches");
    if (!legend) return;
    legend.replaceChildren();
    var colors = palette === "greens"
      ? [UNOPENED].concat(GREENS)
      : [UNOPENED].concat([0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100].map(colorFromSpectrum));
    colors.forEach(function (value) {
      var swatch = document.createElement("i");
      swatch.style.background = value;
      legend.appendChild(swatch);
    });
    var container = document.getElementById("garden-legend");
    if (container) container.setAttribute("aria-label",
      palette === "greens" ? "Unopened gray followed by four greens for increasing recall health" :
        "Unopened gray followed by a continuous red to green health gradient");
  }
  function changePalette(next) {
    if (next !== "greens" && next !== "spectrum") return;
    if (palette === next) return;
    palette = next;
    try { localStorage.setItem(PALETTE_KEY, next); } catch (_) { /* Still works without storage. */ }
    refreshPaletteControls();
    hideTooltip();
    if (cached && !document.getElementById("library-view").hidden) {
      render(cached.decks, cached.getRecord, cached.deckStats, cached.startSession, cached.game);
    }
  }
  function stabilityText(days) {
    if (days === null) return "—";
    if (days < 0.1) return "<0.1 day";
    if (days < 10) return days.toFixed(1) + " days";
    return fmt(Math.round(days)) + " days";
  }
  function hideTooltip() {} // Intentionally no interactive overlays on the garden.
  function render(decks, getRecord, deckStats, startSession, game) {
    cached = { decks: decks, getRecord: getRecord, deckStats: deckStats, startSession: startSession, game: game };
    hideTooltip();
    var container = document.getElementById("deck-grid");
    if (!container) return;
    container.replaceChildren();
    var now = Date.now();
    decks.forEach(function (deck) {
      var stats = deckStats(deck);
      var ready = stats.due + stats.newCards;
      var healthyCount = 0, healthTotal = 0, unseen = 0;
      var earnings = game ? game.plotEarnings(deck, getRecord) : 0;
      var article = document.createElement("article");
      article.className = "deck-card garden-deck";
      article.innerHTML =
        '<div class="deck-card-top"><span class="deck-symbol" aria-hidden="true">' +
          escapeHTML(deck.symbol || "✳") + '</span><span class="deck-meta">' +
          deck.cards.length + ' CARDS' + (deck.imported ? ' · IMPORTED' : '') + '</span></div>' +
        '<h3>' + escapeHTML(deck.title) + '</h3>' +
        '<p class="deck-description">' + escapeHTML(deck.description || "Personal study deck.") + '</p>' +
        '<div class="garden-grid" role="group" aria-label="Individual cards in ' +
          escapeHTML(deck.title) + '"></div>' +
        '<div class="garden-plot-stats"><span class="garden-average"></span>' +
          '<span class="garden-unseen"></span></div>' +
        '<div class="deck-spacer"></div>' +
        '<div class="garden-income"><div><small>PLOT EARNINGS</small><strong class="earnings-amount">◈ ' + fmt(earnings) + '</strong></div>' +
          '<button type="button" class="plot-collect" ' + (earnings ? '' : 'disabled') + '>Collect</button>' +
          '<div class="harvest-numbers" aria-live="polite" hidden>◈ 0</div></div>' +
        '<div class="deck-card-foot"><span class="deck-due">' +
          (ready ? '<strong>' + ready + '</strong> ready to study' : '<strong>✓</strong> Up to date') +
          '</span><button type="button" class="reset-deck-progress" title="Reset only this deck’s learning history">Reset progress</button></div>' +
        '<div class="plot-play-actions">' +
          '<div class="plot-entry">BUY-IN <strong>◈ ' + fmt(game ? game.getBuyIn() : 20) +
          '</strong><span>' + ((game && game.walletBalance() < game.getBuyIn()) ?
            'Not enough coins · study for XP' : 'Moves to your session table') + '</span></div>' +
          '<button class="deck-play-button study-deck" type="button">' +
          (ready ? 'Study deck' : 'Practice deck') + ' ↗</button>' +
        '</div>';
      var grid = article.querySelector(".garden-grid");
      deck.cards.forEach(function (card) {
        var m = metrics(deck.id, card.id, getRecord, now);
        if (m.studied) { healthyCount++; healthTotal += m.health; } else unseen++;
        var tile = document.createElement("span");
        tile.className = "garden-cell";
        tile.style.backgroundColor = color(m);
        tile.setAttribute("aria-hidden", "true");
        grid.appendChild(tile);
      });
      article.querySelector(".garden-average").textContent = healthyCount
        ? "Avg. health ~" + Math.round(healthTotal / healthyCount) + "%"
        : "No cards opened yet";
      article.querySelector(".garden-unseen").textContent = unseen + " unopened";
      article.querySelector(".study-deck").addEventListener("click", function () {
        startSession(deck);
      });
      article.querySelector(".reset-deck-progress").addEventListener("click", function () {
        if (typeof window.FlashcardsResetDeck === "function") window.FlashcardsResetDeck(deck);
      });
      var collectButton = article.querySelector(".plot-collect");
      collectButton.addEventListener("click", function () {
        if (!game || collectButton.disabled) return;
        var amount = game.collectPlot(deck, getRecord);
        if (!amount) { collectButton.disabled = true; return; }
        collectButton.disabled = true;
        var countNode = article.querySelector(".harvest-numbers");
        var valueNode = article.querySelector(".earnings-amount");
        countNode.hidden = false;
        countNode.classList.remove("float-away");
        countNode.textContent = "◈ 0";
        var cells = Array.prototype.slice.call(grid.querySelectorAll(".garden-cell"));
        var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!reduce) cells.forEach(function (cell, index) {
          window.setTimeout(function () {
            cell.classList.add("harvest-sweep");
            window.setTimeout(function () { cell.classList.remove("harvest-sweep"); }, 320);
          }, index * (780 / Math.max(1, cells.length)));
        });
        var start = performance.now(), duration = reduce ? 0 : 940;
        function tick(now) {
          var p = duration ? Math.min(1, (now - start) / duration) : 1;
          countNode.textContent = "◈ " + fmt(Math.floor(amount * p));
          if (p < 1) window.requestAnimationFrame(tick);
          else {
            countNode.textContent = "◈ +" + fmt(amount);
            valueNode.textContent = "◈ " + fmt(game.plotEarnings(deck, getRecord));
            countNode.classList.add("float-away");
            window.setTimeout(function () {
              countNode.hidden = true;
              collectButton.disabled = game.plotEarnings(deck, getRecord) < 1;
            }, reduce ? 0 : 690);
          }
        }
        window.requestAnimationFrame(tick);
      });
      container.appendChild(article);
    });
  }
  document.querySelectorAll("[data-plot-palette]").forEach(function (button) {
    button.addEventListener("click", function () { changePalette(button.dataset.plotPalette); });
  });
  refreshPaletteControls();
  window.FlashcardsGarden = { render: render, metrics: metrics, color: color, hideTooltip: hideTooltip,
    changePalette: changePalette, currentPalette: function () { return palette; } };
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && cached && !document.getElementById("library-view").hidden)
      render(cached.decks, cached.getRecord, cached.deckStats, cached.startSession, cached.game);
  });
})();
