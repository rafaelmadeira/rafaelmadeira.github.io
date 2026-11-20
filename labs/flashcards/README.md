# Flashcards Lab v0.8 — Compact garden + Lifeline

Live: https://rafaelmadeira.com/labs/flashcards/

A static HTML/CSS/JS learning-game prototype. Only virtual coins, not real money. Progress is saved in this browser using localStorage.

## Library
- The old large introduction and tutorial panel have been removed. The page opens directly to **Your plots**. **Import JSON deck** is in the top bar.
- Plot cells are **8 × 8 px**, with **2 px** gaps. They are static: no click-through, focus, or hover/tooltip. A plot is now only a memory-health snapshot; use the deck's **Study deck** button to review.
- Palette comparison remains available: **4 greens** versus **Red → green**, with the same gray for unseen cards. Switching colors never changes memory records.
- Every plot has a **Reset progress** control. It asks for confirmation before clearing the spaced-repetition records of that deck only; the global XP, imported deck itself, other decks and coins remain. This provides new cards to test without altering existing progress unless requested.
- The existing passive plot earnings/Collect animation remains.

## Study
- Regular **Reveal answer**: correct/effortless wins the card's nominal coin value; incorrect/no recall loses that value (up to remaining table balance).
- **Double bet**: same recall, exactly twice the card value won or lost. Unlike v0.6/0.7, this **never risks the global wallet**. It is disabled when the table cannot cover the doubled stake.
- **✳ Use a lifeline**: replaces both reveal choices with four multiple-choice options (real answer plus three different answers randomly drawn from the **same deck**). Disabled for decks without four distinct possible answers. The chosen option automatically grades the response; no additional self-rating is needed. Lifeline earns/loses 25% of the normal card's coin value, rounded to a minimum of one coin.
- A successful lifeline is considered **aided recognition**, not unaided recall: it earns approximately 25% of normal XP, does not extend the success streak or award mastery, and schedules another review in **6 hours**. A failed lifeline incurs −10 XP rather than the usual −40 and schedules a retry in 10 minutes, with the same in-session retry rules.
- The unassisted rating buttons remain No recall, Incorrect, Correct and Effortless. Keyboard Space: normal reveal; 1–4: grade; Escape: leave and cash out.

## Coins and sessions
- For now, a plot session has a **20-coin buy-in**, displayed on its card. This is **escrow**, not an entry fee: 20 coins move from the wallet to the session table and whatever remains on the table is returned when the session finishes or the user leaves.
- The table displays **buy-in / current bankroll / session P&L**, close to the card rather than only in the distant site header.
- Normal nominal card value starts at **4 coins**, rises by 2 per historical failure (max +6), and gets +2 if more than three days overdue, capped at 12. Double bet is 2× this value; Lifeline is a quarter (rounded, minimum 1).
- If the wallet is below 20 coins, scheduled flashcards remain available for study and XP **without coin betting**. If the table runs out of coins during a session, the remaining questions continue as XP-only recall.
- Wallet and plot earnings use the existing `flashlab-game-v1` key. A tab reload **automatically returns an interrupted session's remaining table balance** to the wallet so a crash does not strand escrowed coins.
- Existing XP, the simple spaced-repetition scheduler, three Portuguese JSON decks, imports, and plot palettes are preserved.

## Limitations
- Study timing is an experimental simplified scheduler, not calibrated FSRS.
- Color shades show an approximate heuristic forgetting curve, not a scientifically measured probability.
- Recognition alternatives are selected from the same deck. In decks with ambiguous answers (synonyms, variants, overlapping facts), they may not be ideal distractors.

## Manual QA
1. Open the library: no hero section; import visible in topbar; 8px cells have no tooltip.
2. Reset one deck, confirm only that deck goes gray; start a study session with new cards.
3. With at least 20 coins, confirm that 20 move to the table, card value is shown, and Double bet is only 2× card value.
4. Test Lifeline success and failure, four alternatives, instant grading, weaker XP reward and shorter aided-review interval.
5. Exit: table balance returns to wallet. Reload during a session to test crash-safe refund.
6. Reload after normal review: previously saved XP and due dates persist.
