# Flashcards Lab v0.9 — Emoji plots + encounter history

Live: https://rafaelmadeira.com/labs/flashcards/

Static site with localStorage. Preserves existing XP, card reviews, imported decks, wallet and previous session buy-in behavior.

## New in v0.9
- Home: compact fixed-height plot previews showing up to the 100 most recently studied cards; full plot details via Open plot / See all.
- Each deck has a configurable emoji. Memory cells progress through empty gray, budding seedling, growing small faded emoji, and mature full-color emoji.
- A separate thin underline preserves the previous estimated memory health palette. Growth stages do not control spaced repetition.
- Mature cells yield 3 virtual coins per manual click. Harvest resets only their visual lifecycle, not their study records; regrowth is time gated.
- Per-plot helper costs 60 virtual coins, never collects autonomously, and unlocks a harvesting scythe that sweeps cells via dragging.
- Plot details include stage counts, due/new, workers, recent activity, previously harvested coins and wallet balance.
- Demo harvest preview shows up to 12 mature cells plus a temporary helper, without affecting saved coins or memory.
- Study session strip represents each encounter: correct green, incorrect red X, no recall gray dash; missed encounters stay in place and add a new future attempt. The same history appears on summary.
- Existing double bet, lifelines, coins, XP, spaced repetition, imported JSON and three geography decks remain intact.

## Storage and compatibility
- Existing browser storage keys: flashlab-decks-v1, flashlab-progress-v1, flashlab-xp-v1, flashlab-game-v1.
- New plot customization key: flashlab-plots-v09 (emoji, harvest timestamps, harvested totals).
- Previous passive plot earnings are frozen once and can be claimed on the plot page. Passive earnings no longer accrue in this prototype.
- Experimental growth rule: two successful unassisted reviews in a row, at least a three-day interval and 35% health for maturity. Failed recall/assisted recognition yield budding.
- Harvest regrowth: budding for 15 minutes, growing for 6 hours, then mature if memory health still qualifies.
- The learning schedule and plot harvested state remain separate.

## Manual test
1. Open home, inspect fixed-height deck previews and open a full plot.
2. Choose an emoji and reload to confirm persistence.
3. Enable the demo, click a mature tile, then use the Harvest tool to sweep others. Confirm wallet unchanged.
4. Study: No recall gives gray dash; Incorrect gives red X; both insert a new attempt later in the strip. Repeated misses grow the total.
5. Finish study and inspect the retained session history in the summary.
6. With sufficient coins, hire a helper; perform real harvesting on mature cells and confirm coins and regrowth.
7. Verify any previous passive plot earnings are claimable exactly once.

Note: grow thresholds, currency yields and the helper price are experimental prototypes, not a calibrated memory model.