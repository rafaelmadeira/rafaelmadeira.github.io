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
    var lastSuccess = ["correct","effortless","good","easy","hard"].indexOf(r.lastRating) >= 0;
    var stability = reviews && lastSuccess
      ? Math.max(1 / 144, Number(r.intervalDays) || 1)
      : (reviews ? 10 / 1440 : 0.08);
    var startHealth = reviews ? (lastSuccess ? 1 : 0.38) : 0.30;
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
  function color(m) {
    if (!m.studied) return "#e8ecee";
    var h = m.health;
    if (h < 20) return "#e8f6eb";
    if (h < 40) return "#c7ebd0";
    if (h < 60) return "#a7dfb5";
    if (h < 75) return "#88d5a0";
    if (h < 85) return "#63c981";
    if (h < 93) return "#42b76a";
    if (h < 97) return "#16884b";
    return "#0c6739";
  }
  function stabilityText(days) {
    if (days === null) return "—";
    if (days < 0.1) return "<0.1 day";
    if (days < 10) return days.toFixed(1) + " days";
    return fmt(Math.round(days)) + " days";
  }
  function hideTooltip() {
    var tip = document.getElementById("plant-tooltip");
    if (tip) tip.hidden = true;
  }
  function showTooltip(tile, deck, card, getRecord) {
    var m = metrics(deck.id, card.id, getRecord, Date.now());
    var tip = document.getElementById("plant-tooltip");
    if (!tip) return;
    var ageText = m.age === null ? "—" : m.age + (m.age === 1 ? " day" : " days") +
      (m.legacyAge ? " (minimum)" : "");
    tip.innerHTML =
      '<div class="plant-tip-kicker">' + escapeHTML(deck.title) + '</div>' +
      '<div class="plant-tip-question">' + escapeHTML(card.front) + '</div>' +
      '<div class="plant-tip-status"><i style="background:' + color(m) + '"></i>' +
        escapeHTML(m.stage) + (m.studied ? ' · ' + escapeHTML(m.phase) : '') + '</div>' +
      '<div class="plant-tip-stats">' +
        '<span>Age<strong>' + ageText + '</strong></span>' +
        '<span>Stability <em>(proxy)</em><strong>' + stabilityText(m.stability) + '</strong></span>' +
        '<span>Health <em>(est.)</em><strong>' +
          (m.health === null ? "—" : m.health + "%") + '</strong></span>' +
        '<span>Next review<strong>' + escapeHTML(m.due) + '</strong></span>' +
      '</div><div class="plant-tip-note">Experimental estimate, not calibrated FSRS. Click to recall.</div>';
    tip.hidden = false;
    var rect = tile.getBoundingClientRect();
    var w = tip.offsetWidth, h = tip.offsetHeight;
    tip.style.left = Math.round(Math.max(12, Math.min(window.innerWidth - w - 12,
      rect.left + rect.width / 2 - w / 2))) + "px";
    var top = rect.top > h + 16 ? rect.top - h - 10 : rect.bottom + 10;
    tip.style.top = Math.round(Math.max(8, Math.min(window.innerHeight - h - 8, top))) + "px";
  }
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
          '</span></div>' +
        '<div class="plot-play-actions">' +
          '<button class="deck-play-button study-free" type="button">' +
          (ready ? 'Study free' : 'Practice free') + '</button>' +
          '<button class="deck-play-button play-coins" type="button" ' +
          (ready ? '' : 'disabled title="No cards due; free practice is available"') + '>Play for coins ◈</button>' +
        '</div>';
      var grid = article.querySelector(".garden-grid");
      deck.cards.forEach(function (card) {
        var m = metrics(deck.id, card.id, getRecord, now);
        if (m.studied) { healthyCount++; healthTotal += m.health; } else unseen++;
        var tile = document.createElement("button");
        tile.type = "button";
        tile.className = "garden-cell";
        tile.style.backgroundColor = color(m);
        tile.setAttribute("aria-label", card.front + ". " +
          (m.studied ? m.stage + ", estimated health " + m.health + "%" : "Never opened") +
          ". Click to study.");
        tile.addEventListener("click", function () {
          hideTooltip();
          startSession(deck, card.id);
        });
        tile.addEventListener("pointerenter", function () { showTooltip(tile, deck, card, getRecord); });
        tile.addEventListener("pointerleave", hideTooltip);
        tile.addEventListener("focus", function () { showTooltip(tile, deck, card, getRecord); });
        tile.addEventListener("blur", hideTooltip);
        grid.appendChild(tile);
      });
      article.querySelector(".garden-average").textContent = healthyCount
        ? "Avg. health ~" + Math.round(healthTotal / healthyCount) + "%"
        : "No cards opened yet";
      article.querySelector(".garden-unseen").textContent = unseen + " unopened";
      article.querySelector(".study-free").addEventListener("click", function () {
        hideTooltip(); startSession(deck, null, "free");
      });
      article.querySelector(".play-coins").addEventListener("click", function () {
        hideTooltip(); startSession(deck, null, "wager");
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
  window.FlashcardsGarden = { render: render, metrics: metrics, color: color, hideTooltip: hideTooltip };
  window.addEventListener("scroll", hideTooltip, true);
  window.addEventListener("resize", hideTooltip);
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && cached && !document.getElementById("library-view").hidden)
      render(cached.decks, cached.getRecord, cached.deckStats, cached.startSession, cached.game);
  });
})();
