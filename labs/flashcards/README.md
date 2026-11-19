# Flashcards Lab v0.3

Live: https://rafaelmadeira.com/labs/flashcards/

Moved from /prototypes/flashcards/ into /labs/flashcards/. The old URL redirects to this one.

## Study workflow

- Reveal each card.
- Rate your recall: 1 **No recall** (gray), 2 **Incorrect** (red), 3 **Correct** (green), 4 **Effortless** (blue).
- **No recall and Incorrect are intentionally identical for scheduling and XP**. Only their labels differ for study analytics.
- Correct and Effortless both count as successful recall. Effortless receives a longer next review interval, not more XP.
- The question and answer texts of the three starter decks remain in Portuguese. The interface is in English.
- A session covers up to 15 new or due cards. Failed cards repeat later in that same session (up to two reinsertions); duplicate pending retries are cleared after a success.
- Extra practice when all cards are up to date earns/loses no XP and does not change the schedule.

## Spaced repetition (experimental simplified scheduler)

This is a small two-success-grade, two-failure-label algorithm inspired by classic spaced repetition, **not FSRS or full Anki scheduling**:

- No recall and Incorrect: due again in about ten minutes; success streak resets.
- Correct: first success 1 day, second 3 days, then roughly 2.5× the previous interval.
- Effortless: first success 3 days, second at least 7 days, then roughly 2.8× the previous interval.
- As in other spaced-repetition systems, there is **no scientifically justified permanent "learned" status**. The app grants a one-time **mastery milestone** on the first review that achieves at least a 30-day next interval and four consecutive successful recalls. The 30-day threshold is a **game-design heuristic**, not a validated forgetting-curve threshold. The card **still returns for later reviews**.
- The date/interval scheduler does not consult XP or any XP multipliers.

## Score system

Each rating creates an entry in the session ledger. The complete breakdown and a per-card activity list appear on the session summary screen.

- No recall: **−40 XP**.
- Incorrect: **−40 XP** (exactly the same as No recall).
- First successful recall of any card: **+100 base XP**.
- Each later successful recall of that same card has a diminished base reward, computed as `max(20, roundToNearest5(100 / (1 + 0.35 × previousSuccessCount)))`. This decay depends on **lifetime successful recalls**, not the rating or scheduling.
- The next success after one or more unresolved misses earns an additional **+25 comeback XP per miss**. This resets after that success. The previous misses have already cost −40 XP each, so intentionally missing is always a losing strategy for XP (+25 bonus vs −40 penalty per miss).
- Reaching the mastery milestone awards a **one-time +500 XP bonus** per card, never awarded again even after a later lapse.
- Effortless earns the same base XP as Correct. Its advantage is a longer review interval, not XP.
- **Scheduling and game scoring are independent functions:** `reviewSchedule(old, rating)` and `calculateScore(old, rating, nextRecord)`. The latter reads learning history and the milestone trigger, but its result cannot modify the next review date.
- Total and session XP can be negative; earned XP and penalties remain visible, not silently clipped at zero.
- The summary lists base recall XP, repeated-recall reduction, comeback bonuses, mastery bonuses, miss penalties, and the net session score. A disclosure expands per-card scores.

Example: a first-try correct answer = +100 XP. A miss followed by a correct answer = −40 + (100 + 25 comeback) = +85 net XP. The comeback event is worth more than the first-try event, but deliberately failing does not increase your net score.

## Persistence and compatibility

- Data stays in the user's browser localStorage, under the same origin `rafaelmadeira.com`. Moving from /prototypes/flashcards/ to /labs/flashcards/ preserves existing imported decks, progress, and XP on that origin.
- Existing v0.1/v0.2 history is kept. Old `hard` and `good` or `easy` successful grades still contribute to the stored success streak. An old `again` receives a minimum pending-miss count of one the next time it's successfully reviewed.
- New per-card fields: `unrecoveredMisses` and `masteryReachedAt`.
- XP is stored as a signed number, including negative totals. All rankings/leaderboards are out of scope for v0.3.

## Import JSON

```json
{
  "title": "My deck",
  "description": "Facts to remember",
  "cards": [
    {"id": "one", "front": "What is the capital of Acre?", "back": "Rio Branco"},
    {"id": "two", "front": "What is the capital of Alagoas?", "back": "Maceió"}
  ]
}
```

The previous JSON format remains supported.

## Keys

- Space: reveal
- 1: No recall
- 2: Incorrect
- 3: Correct
- 4: Effortless
- Escape: leave the session
