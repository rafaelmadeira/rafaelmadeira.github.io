# Flashcards Lab v0.5 — Memory Garden + card draws

Live: https://rafaelmadeira.com/labs/flashcards/

This is a locally persisted, single-player design prototype; no real-money gambling, account, cloud sync, shop or upgrades.

## Your plots
- Each deck is a plot. Each square represents one memory/card, retaining the v0.4 health gradient, stages and tooltips.
- Each **exposed** card passively earns 0.025 game coin/hour for its plot. An initial *demo* harvest of 8/6/6 coins is seeded on the three built-in plots so harvesting can be tested immediately. New imports start at zero.
- **Collect** runs a left-to-right sweep through the squares and animates the total, then banks the coins. Fractional unclaimed earnings carry forward. Coins start at 30 so the wagering mode can be tested without waiting.
- These are illustrative economy numbers, not a claim about memory retention.

## Study modes
- **Study free**: same memory scheduler and XP as v0.4. No bets, hand or coin changes from answers.
- **Play for coins**: same scheduler and XP, plus a stake and special card choices. Available only when some cards are due or new (no farming coins by endlessly repeating extra practice).
- Clicking a square individually runs an ordinary free review; an early review earns no XP.
- When nothing is due, **Practice free** is score-free and schedule-free, just like v0.4.

## Special-card deck
- Each coin session starts with a freshly shuffled deck of 18 special cards and **three cards in hand**.
- Before revealing each flashcard, you may select **one card** to play (or none), and optionally discard **one selected card** to draw a replacement. Only one discard/draw per flashcard.
- Chosen card and bet are locked as soon as the flashcard is revealed. A selected special card is played only when you rate the answer; it then moves to discard, and a random card is drawn to refill the hand to three. If you keep your cards, your hand remains intact.
- When the draw pile empties, discarded specials are shuffled back into a new pile. **No deckbuilding**.
- Multiplier cards: Double (×2) and Triple (×3) affect both coin wins and losses.
- Protection cards: Shield (zero loss), Half Loss (loss halves, rounded up), Safe Bet (double gain, lose at most one).
- Modifier cards: Lucky (+3 coins on success), XP Boost (+50 XP on success).
- All cards are game modifiers; they **never** change spaced repetition.

## Wagers
- Before revealing: choose No bet, 1, 3, 5 or 10 coins, capped by available wallet.
- No bet settles ±1 coin on a correct/incorrect answer; any bet of N coins settles ±N, then applies optional card effects.
- 'Correct' and 'Effortless' count as success; 'No recall' and 'Incorrect' as failure.
- Losses are capped at the current wallet (balance never below zero). XP rewards and penalties retain the v0.4 formula; XP Boost is listed separately in the summary ledger.
- Session summary shows earned/lost coins and XP.

## Study schedule and data
- Scheduler remains unchanged from v0.4, inspired by spaced repetition but NOT validated FSRS.
- Green health indicator is a display-only estimated forgetting curve with scheduled interval as a heuristic proxy, not a calibrated probability.
- Old progress, XP and imports are read from the same v0.4 localStorage keys. The coin wallet/plot earnings use an additional `flashlab-game-v1` key.
- Three bundled Portuguese decks: 27 Brazilian state capitals, 12 South American countries and 12 South American capitals. JSON import is supported.
- Keyboard: Space reveal, 1–4 rating, Escape back to garden.

## Quick testing checklist
1. Check that existing XP, memory health and imported decks remain unchanged.
2. Collect from all three built-in plots; confirm coins increase only once and totals animate.
3. Start Play for coins: hand of three random cards and a draw pile.
4. Select a special; discard/draw once (second swap must be disabled); choose bet; reveal locks decisions.
5. Grade correct and incorrect, confirm multiplier/protection outcomes and hand replenishment.
6. Complete a session: verify net coins, XP ledger and spaced repetition dates.
7. Study free: no special cards, bets or change in coins from ratings.
8. Reload: coins, plots and progress persist, while a new session shuffles a new special-card deck.
