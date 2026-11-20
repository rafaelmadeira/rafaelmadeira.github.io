# Flashcards Lab v0.6 — Double or nothing

Live: https://rafaelmadeira.com/labs/flashcards/

Single-player prototype. In-game coins have no monetary value. No accounts, cloud sync, shops, buildable decks or special cards.

## The whole study decision
Every normal scheduled flashcard presents precisely two ways to reveal the answer:
- **Reveal answer**: if rated Correct or Effortless, **+1 coin**. If No recall or Incorrect, **−1 coin**, never below zero.
- **Double or nothing**: commits your **whole current coin balance** before reveal. If Correct or Effortless, doubles that balance (+N); if No recall or Incorrect, loses the whole amount (−N, balance zero).

At zero coins, Double or nothing is disabled until at least one coin is earned or harvested. Neither reveal choice changes XP or the spaced-repetition algorithm. The front of the flashcard and Space keyboard shortcut use **normal reveal**.

For early single-card review and extra practice when there are no new/due cards, only ordinary reveal is available; the existing study rules mean no coins, no XP, and (in extra practice) no schedule changes. This prevents repeatedly farming known cards.

## Plots and harvest
All 3 starter plots remain. Cards become green based on a provisional, non-calibrated forgetfulness/health heuristic and opened cards yield 0.025 game coin/hour per plot. Plot Collection animates a left-to-right sweep and transfers pending earnings into your wallet. Prior starter harvests 8/6/6 coins are preserved (not reset). The wallet initially starts with 30 coins.

## Existing behavior retained
- 27 Brazilian state/Federal District capitals, 12 South American countries, and 12 South American capitals; JSON deck imports supported.
- Same review scheduler, XP earning and scoring ledger, memory visualization and tooltip.
- Previous v0.4 study data and v0.5 game wallet/plot earnings preserved using the same localStorage keys.
- Keyboard: Space to reveal normally; 1–4 grade; Escape leave session.
- End-of-session ledger now reports both XP and net coins. Each question shows whether Normal or Double or nothing was chosen.

## Testing
1. Start Study deck. Confirm two reveal buttons and no extra card-hand panel or bet picker.
2. At balance N, test Normal +1 and −1. At balance N, test Double or nothing: win yields 2N, miss yields zero.
3. Check that a double bet is chosen before reveal and cannot be switched after seeing the answer.
4. When balance is zero, Double or nothing is disabled; Normal success recovers one coin.
5. Complete a session, see XP and coin totals, and reload: wallet, schedule and plots persist.
6. Early direct-card study and extra practice allow no score farming.
