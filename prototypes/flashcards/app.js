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
      toast("Não foi possível salvar: o armazenamento do navegador está cheio ou bloqueado.");
      return false;
    }
  }
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (letter) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[letter];
    });
  }
  function niceNumber(n) { return Number(n || 0).toLocaleString("pt-BR"); }
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
        ? "<strong>" + ready + "</strong> para estudar"
        : "<strong>✓</strong> em dia · prática extra";
      return '<button class="deck-card" type="button" data-deck-index="' + index + '">' +
        '<span class="deck-card-top"><span class="deck-symbol" aria-hidden="true">' +
        escapeHTML(deck.symbol || "✳") +
        '</span><span class="deck-meta">' + deck.cards.length + ' CARTAS' +
        (deck.imported ? ' · IMPORTADO' : '') + '</span></span>' +
        '<span class="deck-card-title"><h3>' + escapeHTML(deck.title) + '</h3></span>' +
        '<span class="deck-description">' + escapeHTML(deck.description || "Coleção pessoal de estudo.") + '</span>' +
        '<span class="deck-spacer"></span>' +
        '<span class="deck-progress" aria-label="' + stats.studied + ' de ' + deck.cards.length + ' já estudadas"><span style="width:' + progressPercent + '%"></span></span>' +
        '<span class="deck-card-foot"><span class="deck-due">' + status + '</span><span class="deck-play">Estudar <span aria-hidden="true">↗</span></span></span>' +
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
      throw new Error("O JSON precisa conter um campo 'cards' com uma lista de perguntas.");
    }
    if (object.cards.length < 1 || object.cards.length > 1000) {
      throw new Error("Use entre 1 e 1.000 flashcards por deck.");
    }
    var ids = new Set();
    var cards = object.cards.map(function (sourceCard, index) {
      if (!sourceCard || typeof sourceCard !== "object") throw new Error("Carta " + (index + 1) + " inválida.");
      var front = sourceCard.front !== undefined ? sourceCard.front : (sourceCard.question !== undefined ? sourceCard.question : sourceCard.frente);
      var back = sourceCard.back !== undefined ? sourceCard.back : (sourceCard.answer !== undefined ? sourceCard.answer : sourceCard.verso);
      if (typeof front !== "string" || typeof back !== "string" || !front.trim() || !back.trim()) {
        throw new Error("A carta " + (index + 1) + " precisa ter 'front' e 'back' em texto.");
      }
      if (front.length > 1500 || back.length > 1500) throw new Error("A carta " + (index + 1) + " tem texto longo demais.");
      var id = String(sourceCard.id === undefined ? ("c" + (index + 1)) : sourceCard.id);
      if (ids.has(id)) throw new Error("Há cartas com o mesmo ID: " + id);
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

  async function loadBuiltins() {
    var results = await Promise.allSettled(BUILTIN_PATHS.map(async function (path) {
      var response = await fetch(path, { cache: "no-store" });
      if (!response.ok) throw new Error("HTTP " + response.status);
      var parsed = await response.json();
      return normalizeDeck(parsed, path.split("/").pop(), false);
    }));
    builtins = results.filter(function (item) { return item.status === "fulfilled"; })
      .map(function (item) { return item.value; });
    if (results.some(function (item) { return item.status === "rejected"; })) {
      toast("Alguns decks de exemplo não carregaram. Tente atualizar a página.");
    }
    renderLibrary();
  }

  async function importFile(file) {
    if (!file) return;
    if (file.size > 1024 * 1024) { toast("O arquivo precisa ter menos de 1 MB."); return; }
    try {
      var text = await file.text();
      var parsed = JSON.parse(text);
      var deck = normalizeDeck(parsed, file.name, true);
      var updated = importedDecks.concat([deck]);
      if (!save(STORAGE.imports, updated)) return;
      importedDecks = updated;
      renderLibrary();
      toast("Deck importado: " + deck.cards.length + " cartas.");
    } catch (error) {
      toast(error instanceof SyntaxError ? "JSON inválido. Confira a sintaxe do arquivo." : error.message);
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
    el("study-mode-label").textContent = practice ? "PRÁTICA EXTRA · SEM XP" : "SESSÃO DE ESTUDO";
    view("study-view");
    showCard();
    if (practice) toast("Você está em dia! Prática extra não modifica revisões nem soma XP.");
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
    el("card-side-label").textContent = "PERGUNTA";
    el("card-status-label").textContent = seen > 0 ? "NOVA TENTATIVA" : (record ? "REVISÃO" : "CARTA NOVA");
    el("card-hint").textContent = "Pense na resposta antes de revelar";
    el("flashcard").classList.remove("is-revealed");
    el("flashcard").setAttribute("aria-label", "Revelar resposta");
    el("rating-area").hidden = true;
    el("reveal-button").hidden = false;
    el("card-counter").textContent = String(session.index + 1).padStart(2, "0") + " / " + String(session.queue.length).padStart(2, "0");
    el("progress-fill").style.width = (100 * session.index / session.queue.length) + "%";
    el("remaining-text").textContent = (session.queue.length - session.index) + " carta(s) restantes";
    updateXP();
  }
  function reveal() {
    if (!session || revealed || ratingLocked) return;
    revealed = true;
    var card = session.queue[session.index];
    el("card-front-small").textContent = card.front;
    el("card-front-small").hidden = false;
    el("card-content").textContent = card.back;
    el("card-side-label").textContent = "RESPOSTA";
    el("card-hint").textContent = "Marque como foi sua lembrança";
    el("flashcard").setAttribute("aria-label", "Resposta: " + card.back);
    el("flashcard").classList.add("is-revealed");
    el("reveal-button").hidden = true;
    el("rating-area").hidden = false;
  }

  function rate(rating) {
    if (!session || !revealed || ratingLocked) return;
    if (["again", "hard", "easy"].indexOf(rating) === -1) return;
    ratingLocked = true;
    var card = session.queue[session.index];
    var old = getRecord(session.deck.id, card.id) || {};
    var seen = session.seen[card.id] || 0;
    var previouslyDue = safeInt(old.reviews) > 0 && isDue(old);
    var score = 0;
    if (rating !== "again") {
      session.correct++;
      if (!session.practice) {
        var base = rating === "hard" ? 130 : 100;
        var difficulty = 1 + Math.min(0.60, safeInt(old.misses) * 0.15);
        var raw = (base * difficulty + (previouslyDue ? 20 : 0)) * (seen > 0 ? 0.25 : 1);
        score = Math.max(5, Math.round(raw / 5) * 5);
        session.xp += score;
        totalXP += score;
        save(STORAGE.xp, totalXP);
      }
    } else {
      session.wrong++;
    }

    if (!session.practice) {
      var record = {
        reviews: safeInt(old.reviews) + 1,
        correct: safeInt(old.correct) + (rating === "again" ? 0 : 1),
        misses: safeInt(old.misses) + (rating === "again" ? 1 : 0),
        streak: rating === "again" ? 0 : safeInt(old.streak) + 1,
        intervalDays: 0,
        lastRating: rating,
        lastReviewedAt: new Date().toISOString(),
        dueAt: ""
      };
      if (rating === "again") {
        record.dueAt = new Date(Date.now() + TEN_MINUTES).toISOString();
        if (seen < 2) {
          var insertAt = Math.min(session.queue.length, session.index + 4);
          session.queue.splice(insertAt, 0, card);
        }
      } else {
        var previousInterval = safeInt(old.intervalDays);
        record.intervalDays = rating === "hard"
          ? (previousInterval ? Math.max(1, Math.round(previousInterval * 1.5)) : 1)
          : (previousInterval ? Math.max(3, Math.round(previousInterval * 2.5)) : 3);
        record.dueAt = nextDate(record.intervalDays);
      }
      setRecord(session.deck.id, card.id, record);
    }

    session.seen[card.id] = seen + 1;
    updateXP();
    if (rating === "again") {
      toast(session.practice ? "Erro anotado (prática extra)." : "Errou · carta volta mais adiante.");
    } else if (session.practice) {
      toast("Acertou! Prática extra não soma XP.");
    } else {
      toast("+" + niceNumber(score) + " XP · " + (rating === "hard" ? "lembrou com esforço" : "lembrou facilmente"));
    }
    session.index++;
    window.setTimeout(function () { showCard(); }, 330);
  }

  function finishSession() {
    if (!session) return;
    var finished = session;
    el("summary-deck-title").textContent = finished.deck.title +
      (finished.practice ? " · prática extra" : " · revisão do dia");
    el("summary-xp").textContent = niceNumber(finished.xp);
    el("summary-correct").textContent = niceNumber(finished.correct);
    el("summary-wrong").textContent = niceNumber(finished.wrong);
    var stats = deckStats(finished.deck);
    if (finished.practice) {
      el("summary-next").textContent = "Você já estava em dia. Essa prática não modificou seu agendamento de revisão.";
    } else if (stats.due + stats.newCards > 0) {
      el("summary-next").textContent = "Ainda há " + (stats.due + stats.newCards) + " carta(s) disponíveis para estudar neste deck.";
    } else {
      el("summary-next").textContent = "Tudo revisado por enquanto. Volte quando houver cartas agendadas.";
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
    if (revealed && !ratingLocked && (event.key === "1" || event.key === "2" || event.key === "3")) {
      event.preventDefault();
      rate({ "1": "again", "2": "hard", "3": "easy" }[event.key]);
    }
    if (event.key === "Escape") backHome();
  });
  updateXP();
  renderLibrary();
  loadBuiltins();
})();