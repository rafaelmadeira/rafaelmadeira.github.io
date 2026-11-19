# Flashcards Lab v0.4 — Memory Garden

Live: https://rafaelmadeira.com/labs/flashcards/

Learning-only version: NO coins, yield, harvesting, purchases, shops, or upgrades.

Each deck is a plot; each square is a flashcard. Gray means never opened; already-exposed cards are pale-to-dark green by a provisional forgetting-curve health estimate. Hover/focus tooltip shows growth status, age, estimated health, stability proxy and next review; it never shows the answer. Click any square for exact-card recall, or click Study deck for regular due-card sessions.

Scientific note: NOT FSRS. The original simple scheduler remains unchanged. The memory visualization borrows a historical FSRS-like curve R(t) = (1 + (19/81) * days/stability)^(-0.5), with scheduled interval as a heuristic stability proxy, which is not calibrated to the user. Initial health 30% for exposure and 38% after an unsuccessful recall are illustrative UI heuristics, not validated recall probabilities. Health percentages must not be presented as experimentally measured values.

Growth stage comes from the greatest prior stability proxy, preserved through lapses; green intensity comes from current health. "Age" is days since first exposure. Prior v0.3 review records have no original first-exposure timestamp, so only the last known review is available as a minimum age for those records.

Early single-card review updates the learning record but awards/penalizes no XP. Regular due-card reviews retain the existing v0.3 XP mechanics and breakdown. Extra full-deck practice when nothing is due remains score-free and does not update the schedule.

Unchanged: three bundled Portuguese question/answer decks, JSON import format, localStorage, scoring history, and four recall ratings (No recall, Incorrect, Correct, Effortless). Keyboard: Space reveals, 1-4 rates, Escape exits.
