(function () {
  "use strict";

  var STORAGE = {
    imports: "flashlab-decks-v1",
    progress: "flashlab-progress-v1",
    xp: "flashlab-xp-v1"
  };
  var BUILTIN_PATHS = [
    "./decks/capitais-estados-brasil.json",
    "./decks/paises-america-do-sul.json",
    "./decks/capitais-america-do-sul.json"
  ];
  var DAY = 24 * 60 * 60 * 1000;
  var TEN_MINUTES = 10 * 60 * 1000;
  var LIMIT = 15;

  function el(id) { return document.getElementById(id); }
  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  }
  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      toast("Could not save: browser storage is full or blocked.");
      return false;
    }
  }
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (letter) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[letter];
    });
  }
  function niceNumber(n) { return Number(n || 0).toLocaleString("en-US"); }
  function shuffle(list) {
    var result = list.slice();
    for (var i = result.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = result[i]; result[i] = result[j]; result[j] = temp;
    }
    return result;
  }
  function nextDate(days) { return new Date(Date.now() + days * DAY).toISOString(); }
  function isDue(record) {
    return !!record && (!record.dueAt || new Date(record.dueAt).getTime() <= Date.now());
  }
  function safeInt(value) { return Math.max(0, Number(value) || 0); }

  var importedDecks = read(STORAGE.imports, []);
  if (!Array.isArray(importedDecks)) importedDecks = [];
  var progress = read(STORAGE.progress, {});
  if (!progress || typeof progress !== "object" || Array.isArray(progress)) progress = {};
  var totalXP = Number(read(STORAGE.xp, 0));
  if (!Number.isFinite(totalXP)) totalXP = 0;
  var builtins = [];
  var session = null;
  var revealed = false;
  var ratingLocked = false;
  var toastTimer = null;

  function toast(message) {
    var node = el("toast");
    node.textContent = message;
    node.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { node.classList.remove("visible"); }, 2900);
  }
  function allDecks() { return builtins.concat(importedDecks); }
  function getRecord(deckId, cardId) {
    return progress[deckId] && progress[deckId][cardId] ? progress[deckId][cardId] : null;
  }
  function setRecord(deckId, cardId, record) {
    if (!progress[deckId]) progress[deckId] = {};
    progress[deckId][cardId] = record;
    save(STORAGE.progress, progress);
  }
  function deckStats(deck) {
    var stats = { due: 0, newCards: 0, studied: 0, upcoming: 0 };
    deck.cards.forEach(function (card) {
      var record = getRecord(deck.id, card.id);
      if (!record || !safeInt(record.reviews)) {
        stats.newCards++;
        if (record && record.firstSeenAt) stats.studied++;
      } else {
        stats.studied++;
        if (isDue(record)) stats.due++;
        else stats.upcoming++;
      }
    });
    return stats;
  }
  function updateXP() {
    el("total-xp").textContent = niceNumber(totalXP);
    if (session) el("session-xp").textContent = niceNumber(session.xp);
  }
  function view(id) {
    ["library-view", "study-view", "summary-view"].forEach(function (name) {
      el(name).hidden = name !== id;
    });
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function renderLibrary() {
    var decks = allDecks();
    el("deck-count").textContent = decks.length;
    el("library-empty").hidden = decks.length > 0;
    if (window.FlashcardsGarden) {
      window.FlashcardsGarden.render(decks, getRecord, deckStats, startSession, window.FlashcardsGame);
    } else {
      el("deck-grid").textContent = "Could not load the garden interface. Please refresh.";
    }
    updateXP();
    if (window.FlashcardsGame) window.FlashcardsGame.updateBalance();
  }

  function normalizeDeck(source, filename, imported) {
    var object = Array.isArray(source) ? { title: filename.replace(/\.json$/i, ""), cards: source } : source;
    if (!object || typeof object !== "object" || !Array.isArray(object.cards)) {
      throw new Error("The JSON must contain a 'cards' field with a list of questions.");
    }
    if (object.cards.length < 1 || object.cards.length > 1000) {
      throw new Error("Use between 1 and 1,000 flashcards per deck.");
    }
    var ids = new Set();
    var cards = object.cards.map(function (sourceCard, index) {
      if (!sourceCard || typeof sourceCard !== "object") throw new Error("Invalid card " + (index + 1) + ".");
      var front = sourceCard.front !== undefined ? sourceCard.front : (sourceCard.question !== undefined ? sourceCard.question : sourceCard.frente);
      var back = sourceCard.back !== undefined ? sourceCard.back : (sourceCard.answer !== undefined ? sourceCard.answer : sourceCard.verso);
      if (typeof front !== "string" || typeof back !== "string" || !front.trim() || !back.trim()) {
        throw new Error("Card " + (index + 1) + " must have text fields 'front' and 'back'.");
      }
      if (front.length > 1500 || back.length > 1500) throw new Error("Card " + (index + 1) + " has too much text.");
      var id = String(sourceCard.id === undefined ? ("c" + (index + 1)) : sourceCard.id);
      if (ids.has(id)) throw new Error("Duplicate card ID: " + id);
      ids.add(id);
      return { id: id, front: front.trim(), back: back.trim() };
    });
    var title = typeof object.title === "string" && object.title.trim()
      ? object.title.trim().slice(0, 110)
      : filename.replace(/\.json$/i, "").slice(0, 110);
    return {
      id: imported ? ("import-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7)) : String(object.id),
      title: title,
      description: typeof object.description === "string" ? object.description.slice(0, 280) : "",
      symbol: typeof object.symbol === "string" ? object.symbol.slice(0, 3) : "✳",
      imported: !!imported,
      cards: cards
    };
  }

  // English interface labels; deck card content retains its source language.
  var starterLabels = {
    "br-estados-capitais": { title: "Brazilian state capitals", description: "The 26 states and Federal District: 27 capitals." },
    "america-do-sul-paises": { title: "South American countries", description: "Identify 12 sovereign countries from geographic clues." },
    "america-do-sul-capitais": { title: "South American capitals", description: "The capitals of 12 countries, including Bolivia's special case." }
  };
  async function loadBuiltins() {
    var results = await Promise.allSettled(BUILTIN_PATHS.map(async function (path) {
      var response = await fetch(path, { cache: "no-store" });
      if (!response.ok) throw new Error("HTTP " + response.status);
      var parsed = await response.json();
      return normalizeDeck(parsed, path.split("/").pop(), false);
    }));
    builtins = results.filter(function (item) { return item.status === "fulfilled"; })
      .map(function (item) {
        var deck = item.value;
        if (starterLabels[deck.id]) {
          deck.title = starterLabels[deck.id].title;
          deck.description = starterLabels[deck.id].description;
        }
        return deck;
      });
    if (results.some(function (item) { return item.status === "rejected"; })) {
      toast("Some starter decks could not load. Try refreshing the page.");
    }
    renderLibrary();
  }

  async function importFile(file) {
    if (!file) return;
    if (file.size > 1024 * 1024) { toast("The file must be under 1 MB."); return; }
    try {
      var text = await file.text();
      var parsed = JSON.parse(text);
      var deck = normalizeDeck(parsed, file.name, true);
      var updated = importedDecks.concat([deck]);
      if (!save(STORAGE.imports, updated)) return;
      importedDecks = updated;
      renderLibrary();
      toast("Deck imported: " + deck.cards.length + " cards.");
    } catch (error) {
      toast(error instanceof SyntaxError ? "Invalid JSON. Please check the file syntax." : error.message);
    }
  }

  function startSession(deck, cardId) {
    var single = typeof cardId === "string";
    var due = [];
    var fresh = [];
    var selected = null;
    deck.cards.forEach(function (card) {
      var record = getRecord(deck.id, card.id);
      if (single && card.id === cardId) selected = card;
      if (!record || !safeInt(record.reviews)) fresh.push(card);
      else if (isDue(record)) due.push(card);
    });
    if (single && !selected) return;
    due.sort(function (a, b) {
      var ra = getRecord(deck.id, a.id);
      var rb = getRecord(deck.id, b.id);
      return new Date(ra.dueAt || 0) - new Date(rb.dueAt || 0);
    });
    var candidates = due.concat(shuffle(fresh));
    var practice = !single && candidates.length === 0;
    if (practice) candidates = shuffle(deck.cards);
    if (single) candidates = [selected];
    var selectedRecord = single ? getRecord(deck.id, selected.id) : null;
    var early = Boolean(single && selectedRecord && safeInt(selectedRecord.reviews) && !isDue(selectedRecord));
    session = {
      deck: deck,
      queue: candidates.slice(0, single ? 1 : LIMIT),
      index: 0,
      seen: Object.create(null),
      correct: 0,
      wrong: 0,
      xp: 0,
      events: [],
      single: single,
      early: early,
      practice: practice,
      mode: "practice",
      coins: 0
    };
    revealed = false;
    ratingLocked = false;
    var canPlay = window.FlashcardsGame &&
      window.FlashcardsGame.startSession(!early && !practice);
    session.mode = canPlay ? "coins" : (practice ? "practice" : "free");
    el("study-title").textContent = deck.title;
    el("study-mode-label").textContent = single
      ? (early ? "EARLY REVIEW · NO XP" : "SINGLE-CARD REVIEW")
      : (practice ? "EXTRA PRACTICE · NO XP / COINS" :
          (session.mode === "coins" ? "STUDY SESSION · XP + COINS" : "STUDY SESSION · XP ONLY"));
    view("study-view");
    showCard();
    if (practice) toast("All caught up! Extra practice does not change reviews or earn XP.");
    if (early) toast("Early review: learning updates, no XP gained or lost.");
  }

  function showCard() {
    if (!session) return;
    if (session.index >= session.queue.length) { finishSession(); return; }
    revealed = false;
    ratingLocked = false;
    var card = session.queue[session.index];
    var record = getRecord(session.deck.id, card.id);
    var seen = session.seen[card.id] || 0;
    el("card-content").textContent = card.front;
    el("card-front-small").hidden = true;
    el("card-front-small").textContent = "";
    el("card-side-label").textContent = "QUESTION";
    el("card-status-label").textContent = seen > 0 ? "TRY AGAIN" : (record && record.masteryReachedAt ? "MASTERY MILESTONE" : (record && safeInt(record.reviews) ? "REVIEW" : "NEW CARD"));
    el("card-hint").textContent = "Recall the answer before revealing";
    el("flashcard").classList.remove("is-revealed");
    el("flashcard").setAttribute("aria-label", "Reveal answer");
    el("rating-area").hidden = true;
    el("reveal-actions").hidden = false;
    el("reveal-explainer").hidden = false;
    el("lifeline-start").hidden = false;
    el("lifeline-panel").hidden = true;
    el("lifeline-options").replaceChildren();
    el("lifeline-feedback").textContent = "";
    el("card-counter").textContent = String(session.index + 1).padStart(2, "0") + " / " + String(session.queue.length).padStart(2, "0");
    el("progress-fill").style.width = (100 * session.index / session.queue.length) + "%";
    el("remaining-text").textContent = (session.queue.length - session.index) + " card(s) remaining";
    updateXP();
    if (window.FlashcardsGame) window.FlashcardsGame.beginRound(record);
    el("lifeline-button").disabled = uniqueAnswers(session.deck, card).length < 4;
    el("lifeline-hint").textContent = el("lifeline-button").disabled ?
      "Needs at least 4 distinct answers in this deck" : el("lifeline-hint").textContent;
  }
  function reveal(choice) {
    if (!session || revealed || ratingLocked) return;
    if (window.FlashcardsGame && !window.FlashcardsGame.lockRound(choice === "double" ? "double" : "normal")) return;
    revealed = true;
    var card = session.queue[session.index];
    var existing = getRecord(session.deck.id, card.id) || {};
    if (!existing.firstSeenAt && !existing.lastReviewedAt) {
      existing.firstSeenAt = new Date().toISOString();
      setRecord(session.deck.id, card.id, existing);
    }
    el("card-front-small").textContent = card.front;
    el("card-front-small").hidden = false;
    el("card-content").textContent = card.back;
    el("card-side-label").textContent = "ANSWER";
    el("card-hint").textContent = "Rate your recall";
    el("flashcard").setAttribute("aria-label", "Answer: " + card.back);
    el("flashcard").classList.add("is-revealed");
    el("reveal-actions").hidden = true;
    el("reveal-explainer").hidden = true;
    el("lifeline-start").hidden = true;
    el("rating-area").hidden = false;
    var old = getRecord(session.deck.id, card.id) || {};
    el("correct-review-label").textContent = session.practice ?
      "No schedule changes" : intervalLabel(nextIntervalDays(old, "correct"));
    el("effortless-review-label").textContent = session.practice ?
      "No schedule changes" : intervalLabel(nextIntervalDays(old, "effortless"));
    if (session.practice) {
      el("xp-preview").textContent = "Extra practice: no XP and no schedule changes.";
    } else if (session.early) {
      el("xp-preview").textContent = "Early study: health and review dates update, with no XP changes.";
    } else {
      var preview = calculateScore(old, "correct", reviewSchedule(old, "correct"));
      el("xp-preview").textContent =
        "Correct or Effortless: " + signedPoints(preview.total) +
        " XP · Failed recall: −40 XP · XP never changes review dates.";
    }

  }

  function uniqueAnswers(deck, currentCard) {
    var seen = new Set();
    return deck.cards.map(function (card) { return card.back.trim(); })
      .filter(function (answer) {
        var key = answer.toLocaleLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }
  function useLifeline() {
    if (!session || revealed || ratingLocked) return;
    var card = session.queue[session.index];
    var choices = uniqueAnswers(session.deck, card);
    if (choices.length < 4) return;
    if (window.FlashcardsGame && !window.FlashcardsGame.lockRound("lifeline")) return;
    var normalized = card.back.trim().toLocaleLowerCase();
    var other = shuffle(choices.filter(function (item) {
      return item.toLocaleLowerCase() !== normalized;
    })).slice(0, 3);
    var answers = shuffle([card.back.trim()].concat(other));
    var panel = el("lifeline-options");
    panel.replaceChildren();
    el("reveal-actions").hidden = true;
    el("lifeline-start").hidden = true;
    el("reveal-explainer").hidden = true;
    el("lifeline-panel").hidden = false;
    answers.forEach(function (answer, i) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "lifeline-option";
      button.textContent = String.fromCharCode(65 + i) + "  " + answer;
      button.addEventListener("click", function () {
        if (revealed || ratingLocked) return;
        revealed = true;
        var correct = answer.toLocaleLowerCase() === normalized;
        panel.querySelectorAll("button").forEach(function (option) {
          option.disabled = true;
          var label = option.textContent.slice(3).toLocaleLowerCase();
          option.classList.toggle("is-correct", label === normalized);
        });
        if (!correct) button.classList.add("is-incorrect");
        var existing = getRecord(session.deck.id, card.id) || {};
        if (!existing.firstSeenAt && !existing.lastReviewedAt) {
          existing.firstSeenAt = new Date().toISOString();
          setRecord(session.deck.id, card.id, existing);
        }
        el("card-front-small").textContent = card.front;
        el("card-front-small").hidden = false;
        el("card-content").textContent = card.back;
        el("card-side-label").textContent = "ANSWER";
        el("card-hint").textContent = correct ? "Recognized with a lifeline" : "The correct answer is shown";
        el("flashcard").classList.add("is-revealed");
        el("lifeline-feedback").textContent = correct ?
          "✓ Lifeline worked · partial XP · earlier review" :
          "× Missed · shorter penalty · review again soon";
        rate(correct ? "assisted" : "incorrect", true);
      });
      panel.appendChild(button);
    });
  }

  // Ratings feed only the memory scheduler. No XP enters these functions.
  function isSuccess(rating) { return rating === "correct" || rating === "effortless" || rating === "assisted"; }
  function unresolvedMisses(record) {
    if (Number.isFinite(Number(record.unrecoveredMisses))) return safeInt(record.unrecoveredMisses);
    // Preserve a minimum useful count for v0.1/v0.2 data.
    return record.lastRating === "again" ? 1 : 0;
  }
  function nextIntervalDays(old, rating) {
    var streak = safeInt(old.streak);
    var previous = safeInt(old.intervalDays);
    if (rating === "effortless") {
      if (!streak || !previous) return 3;
      if (streak === 1) return Math.max(7, previous + 1);
      return Math.max(previous + 1, Math.round(previous * 2.8));
    }
    if (!streak || !previous) return 1;
    if (streak === 1) return Math.max(3, previous + 1);
    return Math.max(previous + 1, Math.round(previous * 2.5));
  }
  function reviewSchedule(old, rating) {
    var success = isSuccess(rating);
    // Lifeline recognition is weaker evidence than unaided recall: review after 6 hours.
    var intervalDays = rating === "assisted" ? 0.25 :
      (success ? nextIntervalDays(old, rating) : 0);
    var next = {
      reviews: safeInt(old.reviews) + 1,
      correct: safeInt(old.correct) + (success ? 1 : 0),
      misses: safeInt(old.misses) + (success ? 0 : 1),
      streak: rating === "assisted" ? 0 : (success ? safeInt(old.streak) + 1 : 0),
      unrecoveredMisses: success ? 0 : unresolvedMisses(old) + 1,
      intervalDays: intervalDays,
      lastRating: rating,
      lastReviewedAt: new Date().toISOString(),
      dueAt: "",
      masteryReachedAt: old.masteryReachedAt || null,
      firstSeenAt: old.firstSeenAt || old.lastReviewedAt || new Date().toISOString(),
      peakStabilityDays: Math.max(
        Number(old.peakStabilityDays) || 0,
        Number(old.intervalDays) || 0,
        old.masteryReachedAt ? 30 : 0,
        intervalDays
      )
    };
    next.dueAt = success ? nextDate(intervalDays) :
      new Date(Date.now() + TEN_MINUTES).toISOString();
    // "Mastery" is an experimental, one-time game milestone, NOT permanent memory.
    // A long scheduled interval is only a proxy for retrieval stability.
    if (success && !next.masteryReachedAt && next.streak >= 4 && intervalDays >= 30) {
      next.masteryReachedAt = next.lastReviewedAt;
    }
    return next;
  }
  // Score calculation reads study history but NEVER changes the scheduler.
  // A deliberate miss costs 40 XP and adds at most 25 XP to the next success.
  function calculateScore(old, rating, next) {
    if (!isSuccess(rating)) {
      return { base: 0, decay: 0, recovery: 0, mastery: 0, penalty: -40, total: -40 };
    }
    var priorSuccesses = safeInt(old.correct);
    var reducedBase = Math.max(20, Math.round((100 / (1 + priorSuccesses * 0.35)) / 5) * 5);
    var base = 100;
    var decay = reducedBase - 100;
    var recovery = 25 * unresolvedMisses(old);
    var mastery = !old.masteryReachedAt && !!next.masteryReachedAt ? 500 : 0;
    return {
      base: base, decay: decay, recovery: recovery, mastery: mastery, penalty: 0,
      total: base + decay + recovery + mastery
    };
  }
  function intervalLabel(days) {
    return days === 1 ? "Review tomorrow" : "Review in " + days + " days";
  }
  function signedPoints(n) {
    return n > 0 ? "+" + niceNumber(n) : niceNumber(n);
  }
  function ratingLabel(rating) {
    return {
      norecall: "No recall",
      incorrect: "Incorrect",
      correct: "Correct",
      effortless: "Effortless",
      assisted: "Lifeline"
    }[rating] || rating;
  }
  function rate(rating, usedLifeline) {
    if (!session || !revealed || ratingLocked) return;
    if (["norecall", "incorrect", "correct", "effortless", "assisted"].indexOf(rating) === -1) return;
    ratingLocked = true;
    var card = session.queue[session.index];
    var old = getRecord(session.deck.id, card.id) || {};
    var seen = session.seen[card.id] || 0;
    var success = isSuccess(rating);
    var next = reviewSchedule(old, rating);
    var score = (session.practice || session.early)
      ? { base: 0, decay: 0, recovery: 0, mastery: 0, penalty: 0, total: 0 }
      : usedLifeline ?
        (success ?
          { base: Math.max(5, Math.round(calculateScore(old, "correct", next).total / 4)),
            decay: 0, recovery: 0, mastery: 0, penalty: 0, total: 0 } :
          { base: 0, decay: 0, recovery: 0, mastery: 0, penalty: -10, total: -10 }) :
        calculateScore(old, rating, next);
    if (usedLifeline && success && !session.practice && !session.early) score.total = score.base;
    var gameOutcome = window.FlashcardsGame ? window.FlashcardsGame.resolveRound(success) : { delta: 0, choice: "" };
    session.coins += gameOutcome.delta;

    if (!session.practice) {
      setRecord(session.deck.id, card.id, next);
      session.xp += score.total;
      totalXP += score.total;
      save(STORAGE.xp, totalXP);
    }
    if (success) {
      session.correct++;
      // Remove duplicate pending retries after successful recall.
      session.queue = session.queue.slice(0, session.index + 1).concat(
        session.queue.slice(session.index + 1).filter(function (queued) {
          return queued.id !== card.id;
        })
      );
    } else {
      session.wrong++;
      if (!session.practice && seen < 2) {
        var insertAt = Math.min(session.queue.length, session.index + 4);
        session.queue.splice(insertAt, 0, card);
      }
    }
    session.events.push({
      question: card.front, rating: rating, base: score.base, decay: score.decay,
      recovery: score.recovery, mastery: score.mastery, penalty: score.penalty,
      coins: gameOutcome.delta, choice: gameOutcome.choice,
      total: score.total
    });
    session.seen[card.id] = seen + 1;
    updateXP();
    if (session.practice) {
      toast("Extra practice: no XP, coin or schedule changes.");
    } else if (session.early) {
      toast(ratingLabel(rating) + " · Early review recorded · No XP");
    } else if (!success) {
      toast("−40 XP · " + ratingLabel(rating) + " · Review again soon");
    } else if (score.mastery) {
      toast(signedPoints(score.total) + " XP · Mastery milestone unlocked!");
    } else if (score.recovery) {
      toast(signedPoints(score.total) + " XP · Comeback bonus!");
    } else {
      toast(signedPoints(score.total) + " XP · " + ratingLabel(rating));
    }
    if (session.mode === "coins") {
      var coinText = (gameOutcome.delta > 0 ? "+" : "") + gameOutcome.delta + " coins";
      toast(coinText + (usedLifeline ? " · Lifeline" : gameOutcome.choice === "double" ? " · Double bet" : "") +
        " · " + signedPoints(score.total) + " XP");
    }
    session.index++;
    window.setTimeout(function () { showCard(); }, usedLifeline ? 1100 : 330);
  }

  function renderScoreReport(finished) {
    var sums = { base: 0, decay: 0, recovery: 0, mastery: 0, penalty: 0 };
    var counts = { norecall: 0, incorrect: 0, correct: 0, effortless: 0, assisted: 0 };
    finished.events.forEach(function (event) {
      Object.keys(sums).forEach(function (key) { sums[key] += event[key]; });
      counts[event.rating]++;
    });
    var rows = [
      ["Recall rewards", sums.base],
      ["Repeated-recall reduction", sums.decay],
      ["Comeback bonuses", sums.recovery],
      ["Mastery milestones", sums.mastery],
      ["Miss penalties", sums.penalty]
    ];
    var net = rows.reduce(function (total, row) { return total + row[1]; }, 0);
    el("score-breakdown").innerHTML = rows.map(function (row) {
      var cssClass = row[1] > 0 ? "positive" : (row[1] < 0 ? "negative" : "neutral");
      return '<div class="score-breakdown-row"><span>' + row[0] +
        '</span><strong class="' + cssClass + '">' + signedPoints(row[1]) +
        ' XP</strong></div>';
    }).join("") +
      '<div class="score-breakdown-row net"><span>Session total</span><strong class="' +
      (net < 0 ? "negative" : "") + '">' + signedPoints(net) + ' XP</strong></div>';
    el("summary-recall-counts").innerHTML =
      '<span>No recall: ' + counts.norecall + '</span>' +
      '<span>Incorrect: ' + counts.incorrect + '</span>' +
      '<span>Correct: ' + counts.correct + '</span>' +
      '<span>Effortless: ' + counts.effortless + '</span>' +
      '<span>Lifeline: ' + counts.assisted + '</span>';
    el("score-events-list").innerHTML = finished.events.map(function (event) {
      var details = [];
      if (event.base) details.push("Base +" + niceNumber(event.base));
      if (event.decay) details.push("Repeat " + signedPoints(event.decay));
      if (event.recovery) details.push("Comeback +" + niceNumber(event.recovery));
      if (event.mastery) details.push("Mastery +" + niceNumber(event.mastery));
      if (event.penalty) details.push("Miss " + signedPoints(event.penalty));
      if (finished.mode === "coins") details.push((event.choice === "double" ? "Double bet" :
        event.choice === "lifeline" ? "Lifeline" : "Normal") + ": " +
        signedPoints(event.coins || 0) + " coins");
      if (!details.length) details.push("Extra practice");
      return '<li><div class="score-event-content">' +
        '<span class="score-event-rating">' + ratingLabel(event.rating) + '</span>' +
        '<strong>' + escapeHTML(event.question) + '</strong>' +
        '<small>' + escapeHTML(details.join(" · ")) + '</small></div>' +
        '<span class="score-event-points ' + (event.total < 0 ? "negative" : "") + '">' +
        signedPoints(event.total) + ' XP</span></li>';
    }).join("");
    var details = document.querySelector(".score-events");
    if (details) details.open = false;
    if (net !== finished.xp) {
      console.warn("Score breakdown total differs from session XP", net, finished.xp);
    }
  }

  function finishSession() {
    if (!session) return;
    var finished = session;
    if (window.FlashcardsGame) window.FlashcardsGame.endSession(); // Cash out remaining buy-in.
    el("summary-deck-title").textContent = finished.deck.title +
      (finished.practice ? " · extra practice" : finished.early ? " · early review" : finished.single ? " · single-card review" : " · daily review");
    el("summary-xp").textContent = niceNumber(finished.xp);
    el("summary-correct").textContent = niceNumber(finished.correct);
    el("summary-wrong").textContent = niceNumber(finished.wrong);
    if (window.FlashcardsGame) window.FlashcardsGame.renderSummary(finished);
    renderScoreReport(finished);
    var stats = deckStats(finished.deck);
    if (finished.practice) {
      el("summary-next").textContent = "You were already up to date. Extra practice did not change your review schedule.";
    } else if (finished.early) {
      el("summary-next").textContent = "Early recall recorded. Health and next review were updated, without any XP change.";
    } else if (stats.due + stats.newCards > 0) {
      el("summary-next").textContent = "There are still " + (stats.due + stats.newCards) + " cards available to study in this deck.";
    } else {
      el("summary-next").textContent = "All caught up for now. Come back when your next reviews are due.";
    }
    session = null;
    view("summary-view");
    renderLibrary();
  }

  function backHome() {
    if (window.FlashcardsGame) window.FlashcardsGame.endSession();
    session = null;
    renderLibrary();
    view("library-view");
  }

  window.FlashcardsResetDeck = function (deck) {
    if (!window.confirm("Reset all " + deck.cards.length + " card reviews in \"" +
      deck.title + "\"?\n\nThis removes its review schedule and memory-health colors. XP, coins, and other decks are kept.")) return;
    if (window.FlashcardsGame) window.FlashcardsGame.resetPlotAccrual(deck, getRecord);
    delete progress[deck.id];
    if (!save(STORAGE.progress, progress)) return;
    renderLibrary();
    toast("Study progress reset for " + deck.title + ".");
  };
  el("import-button").addEventListener("click", function () { el("deck-file").click(); });
  el("deck-file").addEventListener("change", async function () {
    await importFile(this.files && this.files[0]);
    this.value = "";
  });
  el("brand-home").addEventListener("click", backHome);
  el("back-to-library").addEventListener("click", backHome);
  el("summary-home").addEventListener("click", backHome);
  el("flashcard").addEventListener("click", function () { reveal("normal"); });
  el("reveal-button").addEventListener("click", function () { reveal("normal"); });
  el("double-reveal-button").addEventListener("click", function () { reveal("double"); });
  el("lifeline-button").addEventListener("click", useLifeline);
  document.querySelectorAll("[data-rating]").forEach(function (button) {
    button.addEventListener("click", function () { rate(button.getAttribute("data-rating")); });
  });
  window.addEventListener("keydown", function (event) {
    if (!session || event.altKey || event.ctrlKey || event.metaKey) return;
    var tag = event.target && event.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (event.code === "Space" && !revealed) { event.preventDefault(); reveal("normal"); }
    if (revealed && !ratingLocked && (event.key === "1" || event.key === "2" || event.key === "3" || event.key === "4")) {
      event.preventDefault();
      rate({ "1": "norecall", "2": "incorrect", "3": "correct", "4": "effortless" }[event.key]);
    }
    if (event.key === "Escape") backHome();
  });
  updateXP();
  renderLibrary();
  loadBuiltins();
})();