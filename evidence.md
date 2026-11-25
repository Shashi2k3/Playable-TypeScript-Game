# Project 2 evidence: playable TypeScript game

Learner id: ______  Pair/team id: ______
Genre: `treasure` — 3×3 treasure hunt: start (0,0), wall (1,1), treasure t1 (2,0) worth 10, exit (2,2), six moves.

## 1. Plan check
- Slice: start at (0,0) with 6 moves, move N/E/S/W, collect the treasure, reach the exit to win; out of moves loses.
- Owned files: `models.ts` (types), `rules.ts` (logic), `api.ts` (data load), `app.ts` (browser + event), `learner.test.mjs` (regression).
- Release uses the supplied `tools/release.py`.

## 2. Typed models
- `GameState` = position, movesRemaining, score, collected, status (`"playing" | "won" | "lost"`); action = `{ type: "move", direction }`.
- Invariant: once status is won/lost, every further action is rejected with `GAME_COMPLETE`.
- Compiler check: setting `status: "paused"` gives error ______ (TS2322); reverted and rebuilt cleanly.

## 3. Core logic
- Starter: 14 failing, 6 skipped. Now: 16 pass, 0 fail, 6 skipped (range route not used).
- My regression: from (2,1) holding t1, moving north back onto the treasure keeps score at 10 — treasure scores only once.
- Wall/edge/invalid/after-finish moves are rejected and the input state is checked to be unchanged.

## 4. Checkpoints
- 120 min: start (F01), accepted move (F02) and rejected moves (F03 wall, F04 edge) pass.
- 180 min: Start + East renders position (1,0), movesRemaining 5 on the page.
- 270 min: rules and browser path done; API failures, event and release remaining.

## 5. Browser lifecycle
- Start shows position (0,0), 6 moves, score 0, playing.
- East, East, South, South → score 10, status won, move buttons disabled.
- Restart gives a fresh game and a new run ID (lifecycle browser check passes).

## 6. API loading and failure
- Shows "Loading game data..." first, then "Game data verified: Reference treasure hunt".
- Failures: "HTTP 503", "Game data was malformed JSON", "Unexpected game definition..." — shown in the Game data area only.
- A failed reload keeps the current game unchanged (all 5 request-failure browser checks pass).

## 7. Debugging
- Will be recorder later

## 8. Event
- Each move calls `recordEvent` with run ID, sequence, action, accepted, before and after state.
- Collector failure shows "Local recording unavailable" and the move still stands (event browser checks pass).

## 9. Release
- `npm test`: rules 16 pass / 6 skipped; browser 10 passed.
- Pack/verify not done: Python is not installed on this machine (environment blocked).
- Source = `src/*.ts`; artifact = packed release folder + `release.json`; process = running `serve.py`; scope is local only.

## 10. Individual responses
- To be updated later.

## 11. Assistance and status
- Used Claude LLM wherever I faced doubts or I felt I could automate the few known easier tasks.
