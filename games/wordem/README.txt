WORD HOLD'EM PROTOTYPE V2
========================

FILES
- index.html
- word_holdem_dictionary.js

GITHUB PAGES
Upload both files to the same folder in your GitHub Pages site. Keep the dictionary filename unchanged because index.html loads it with:
  ./word_holdem_dictionary.js

MULTIPLAYER
1. Open the hosted page.
2. Choose table size (3, 5, or 7) and private hand size (3, 5, or 7).
3. Click Create online table.
4. Copy the invite link from the game and send it to the other player.
5. The other player opens the link. No game account is required.

The game and chat use Trystero/WebRTC peer-to-peer messaging. Chat is intentionally ephemeral: messages are not stored and disappear when the page/session is gone. Multiplayer should be tested from the HTTPS GitHub Pages URL, not by opening index.html directly as a file.

CURRENT RULES
- Race to 500 total points.
- Each round has 60 seconds.
- Community cards are replaced every round.
- Private letter cards persist across rounds.
- Only private letters actually used in a submitted word are replaced before the next round.
- Each player may replace their entire private letter hand once per match.
- Two effect cards are freshly dealt each round.
- A table-only word is legal, but effect cards activate only if at least one private letter is used.
- Community sweep: +10 for using every table letter.
- Hand sweep: +15 for using every private letter.
- Full house: +25 extra for using every real table + hand letter. This stacks with both sweep bonuses.
- If both players cross 500 on the same round, the higher total wins. If their totals are tied, play continues.

DICTIONARY
The bundled local dictionary contains 111,829 lowercase English entries up to 14 letters. It combines the prior Worditaire dictionary with additional en_US Hunspell roots, so 7-table + 7-hand full-house words are possible.

NOTES
- The computer currently searches the full dictionary for its best scoring legal word.
- The online host is authoritative for deals, scoring, redraws, round advancement, and the match result.
- The room currently accepts one opponent. The networking layer can support more peers later; 3-4 player game rules/state would be the next expansion.
