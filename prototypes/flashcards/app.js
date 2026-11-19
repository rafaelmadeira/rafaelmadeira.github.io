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
  var totalXP = safeInt(read(STORAGE.xp, 0));
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
      if (!record) stats.newCards++;
      else {
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
    el("deck-grid").innerHTML = decks.map(function (deck, index) {
      var stats = deckStats(deck);
      var ready = stats.due + stats.newCards;
      var progressPercent = deck.cards.length ? 100 * stats.studied / deck.cards.length : 0;
      var status = ready > 0
        ? "<strong>" + ready + "</strong> ready to study"
        : "<strong>✓</strong> up to date · extra practice";
      return '<button class="deck-card" type="button" data-deck-index="' + index + '">' +
        '<span class="deck-card-top"><span class="deck-symbol" aria-hidden="true">' +
        escapeHTML(deck.symbol || "✳") +
        '</span><span class="deck-meta">' + deck.cards.length + ' CARDS' +
        (deck.imported ? ' · IMPORTED' : '') + '</span></span>' +
        '<span class="deck-card-title"><h3>' + escapeHTML(deck.title) + '</h3></span>' +
        '<span class="deck-description">' + escapeHTML(deck.description || "Personal study deck.") + '</span>' +
        '<span class="deck-spacer"></span>' +
        '<span class="deck-progress" aria-label="' + stats.studied + ' of ' + deck.cards.length + ' cards studied"><span style="width:' + progressPercent + '%"></span></span>' +
        '<span class="deck-card-foot"><span class="deck-due">' + status + '</span><span class="deck-play">Study <span aria-hidden="true">↗</span></span></span>' +
      '</button>';
    }).join("");
    document.querySelectorAll("[data-deck-index]").forEach(function (button) {
      button.addEventListener("click", function () {
        var deck = allDecks()[Number(button.getAttribute("data-deck-index"))];
        if (deck) startSession(deck);
      });
    });
    updateXP();
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

  function startSession(deck) {
    var due = [];
    var fresh = [];
    deck.cards.forEach(function (card) {
      var record = getRecord(deck.id, card.id);
      if (!record) fresh.push(card);
      else if (isDue(record)) due.push(card);
    });
    due.sort(function (a, b) {
      var ra = getRecord(deck.id, a.id);
      var rb = getRecord(deck.id, b.id);
      return new Date(ra.dueAt || 0) - new Date(rb.dueAt || 0);
    });
    var candidates = due.concat(shuffle(fresh));
    var practice = candidates.length === 0;
    if (practice) candidates = shuffle(deck.cards);
    session = {
      deck: deck,
      queue: candidates.slice(0, LIMIT),
      index: 0,
      seen: Object.create(null),
      correct: 0,
      wrong: 0,
      xp: 0,
      practice: practice
    };
    revealed = false;
    ratingLocked = false;
    el("study-title").textContent = deck.title;
    el("study-mode-label").textContent = practice ? "EXTRA PRACTICE · NO XP" : "STUDY SESSION";
    view("study-view");
    showCard();
    if (practice) toast("All caught up! Extra practice does not change reviews or earn XP.");
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
    el("card-status-label").textContent = seen > 0 ? "TRY AGAIN" : (record ? "REVIEW" : "NEW CARD");
    el("card-hint").textContent = "Recall the answer before revealing";
    el("flashcard").classList.remove("is-revealed");
    el("flashcard").setAttribute("aria-label", "Reveal answer");
    el("rating-area").hidden = true;
    el("reveal-button").hidden = false;
    el("card-counter").textContent = String(session.index + 1).padStart(2, "0") + " / " + String(session.queue.length).padStart(2, "0");
    el("progress-fill").style.width = (100 * session.index / session.queue.length) + "%";
    el("remaining-text").textContent = (session.queue.length - session.index) + " card(s) remaining";
    updateXP();
  }
  function reveal() {
    if (!session || revealed || ratingLocked) return;
    revealed = true;
    var card = session.queue[session.index];
    el("card-front-small").textContent = card.front;
    el("card-front-small").hidden = false;
    el("card-content").textContent = card.back;
    el("card-side-label").textContent = "ANSWER";
    el("card-hint").textContent = "Rate your recall";
    el("flashcard").setAttribute("aria-label", "Answer: " + card.back);
    el("flashcard").classList.add("is-revealed");
    el("reveal-button").hidden = true;
    el("rating-area").hidden = false;
    var old = getRecord(session.deck.id, card.id) || {};
    el("good-review-label").textContent = session.practice ?
      "No schedule changes" : intervalLabel(nextIntervalDays(old));
    el("xp-preview").textContent = session.practice ?
      "Extra practice changes neither the review schedule nor XP." :
      "Good: +" + niceNumber(xpForSuccess(old, session.seen[card.id] || 0)) +
      " XP. Your score never affects the next review.";
  }

  // Simple two-grade SM-2-inspired scheduler. Never reads XP.
  function nextIntervalDays(old) {
    var streak = safeInt(old.streak);
    var last = safeInt(old.intervalDays);
    if (!streak || !last) return 1;
    if (streak === 1) return Math.max(3, last + 1);
    return Math.max(last + 1, Math.round(last * 2.5));
  }
  function reviewSchedule(old, rating) {
    var success = rating === "good";
    var record = {
      reviews: safeInt(old.reviews) + 1,
      correct: safeInt(old.correct) + (success ? 1 : 0),
      misses: safeInt(old.misses) + (success ? 0 : 1),
      streak: success ? safeInt(old.streak) + 1 : 0,
      intervalDays: success ? nextIntervalDays(old) : 0,
      lastRating: rating,
      lastReviewedAt: new Date().toISOString(),
      dueAt: ""
    };
    record.dueAt = success ? nextDate(record.intervalDays) :
      new Date(Date.now() + TEN_MINUTES).toISOString();
    return record;
  }
  // Engagement only: never reads due dates or review intervals.
  function xpForSuccess(old, attemptsThisSession) {
    var bonus = 1 + Math.min(0.60, safeInt(old.misses) * 0.15);
    var repeat = attemptsThisSession > 0 ? 0.25 : 1;
    return Math.max(5, Math.round(100 * bonus * repeat / 5) * 5);
  }
  function intervalLabel(days) {
    return days === 1 ? "Review tomorrow" : "Review in " + days + " days";
  }
  function rate(rating) {
    if (!session || !revealed || ratingLocked) return;
    if (rating !== "again" && rating !== "good") return;
    ratingLocked = true;
    var card = session.queue[session.index];
    var old = getRecord(session.deck.id, card.id) || {};
    var seen = session.seen[card.id] || 0;
    var success = rating === "good";
    var score = 0;
    // Record the learning result independently of rewards.
    if (!session.practice) {
      setRecord(session.deck.id, card.id, reviewSchedule(old, rating));
      if (!success && seen < 2) {
        var insertAt = Math.min(session.queue.length, session.index + 4);
        session.queue.splice(insertAt, 0, card);
      }
    }
    // XP is calculated separately and never feeds scheduling.
    if (success) {
      session.correct++;
      if (!session.practice) {
        score = xpForSuccess(old, seen);
        session.xp += score;
        totalXP += score;
        save(STORAGE.xp, totalXP);
      }
    } else {
      session.wrong++;
    }
    session.seen[card.id] = seen + 1;
    updateXP();
    if (!success) {
      toast(session.practice ? "Not recalled (extra practice)." : "Not recalled. This card will come back soon.");
    } else if (session.practice) {
      toast("Good recall! Extra practice does not earn XP.");
    } else {
      toast("+" + niceNumber(score) + " XP · Good recall");
    }
    session.index++;
    window.setTimeout(function () { showCard(); }, 330);
  }

  function finishSession() {
    if (!session) return;
    var finished = session;
    el("summary-deck-title").textContent = finished.deck.title +
      (finished.practice ? " · extra practice" : " · daily review");
    el("summary-xp").textContent = niceNumber(finished.xp);
    el("summary-correct").textContent = niceNumber(finished.correct);
    el("summary-wrong").textContent = niceNumber(finished.wrong);
    var stats = deckStats(finished.deck);
    if (finished.practice) {
      el("summary-next").textContent = "You were already up to date. Extra practice did not change your review schedule.";
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
    session = null;
    renderLibrary();
    view("library-view");
  }

  el("import-button").addEventListener("click", function () { el("deck-file").click(); });
  el("deck-file").addEventListener("change", async function () {
    await importFile(this.files && this.files[0]);
    this.value = "";
  });
  el("brand-home").addEventListener("click", backHome);
  el("back-to-library").addEventListener("click", backHome);
  el("summary-home").addEventListener("click", backHome);
  el("flashcard").addEventListener("click", reveal);
  el("reveal-button").addEventListener("click", reveal);
  document.querySelectorAll("[data-rating]").forEach(function (button) {
    button.addEventListener("click", function () { rate(button.getAttribute("data-rating")); });
  });
  el("show-formula").addEventListener("click", function () {
    var details = el("formula-details");
    details.hidden = !details.hidden;
    this.setAttribute("aria-expanded", String(!details.hidden));
  });
  window.addEventListener("keydown", function (event) {
    if (!session || event.altKey || event.ctrlKey || event.metaKey) return;
    var tag = event.target && event.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (event.code === "Space" && !revealed) { event.preventDefault(); reveal(); }
    if (revealed && !ratingLocked && (event.key === "1" || event.key === "2")) {
      event.preventDefault();
      rate({ "1": "again", "2": "good" }[event.key]);
    }
    if (event.key === "Escape") backHome();
  });
  updateXP();
  renderLibrary();
  loadBuiltins();
})();