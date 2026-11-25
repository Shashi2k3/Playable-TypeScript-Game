# Treasure Hunt — a small playable TypeScript game

A browser game built for Project 2 of a TypeScript training course. You move around a 3×3 board,
collect the treasure and reach the exit before your moves run out.

```
  S  .  T        S = start (0,0)     T = treasure, worth 10 points (2,0)
  .  #  .        # = wall (1,1)      E = exit (2,2)
  .  .  E
```

## How to play

1. Wait until **Game data** says *verified*, then click **Start game**.
2. Move with **North / East / South / West**. You have **6 moves**.
3. Step on the treasure to score 10. Reach the exit **holding the treasure** to win.
4. If your moves run out first, you lose. Click **Restart** to play again.

Moving into the wall or off the board is rejected (`Rejected: WALL` / `Rejected: EDGE`) and costs no move.
After the game ends, the move buttons are disabled until you restart.

Winning route: **East, East, South, South**.

## Run it locally

Requires **Node.js 22+** (npm comes with it).

```bash
npm ci        # install dependencies
npm start     # build and serve the game
```

Open http://127.0.0.1:4182 in a browser. Stop the server with `Ctrl+C`.
If port 4182 is busy, run `PORT=4183 npm start` (PowerShell: `$env:PORT=4183; npm start`).

The game data comes from a small local Node server in `server/`, so no other services or keys are needed.

## Run the tests

```bash
npm run check:rules            # game rule tests (Node test runner)
npx playwright install chromium   # first time only, for browser tests
npm test                       # rule tests + browser tests
```

Expected result: 16 rule tests pass (6 skipped; they belong to the unused "range" game mode) and
10 browser tests pass.

## Try the error handling

The server can simulate failures. Stop the normal server first, then run one of:

```bash
npm start -- --fault=slow         # data arrives after 1.5 s, so you can see "Loading"
npm start -- --fault=http         # server answers 503
npm start -- --fault=malformed    # broken JSON
npm start -- --fault=unexpected   # a different board, which is rejected
npm start -- --collector=down     # event recording fails; the game still works
```

## Event log

Every move is recorded with a run ID, sequence number, the move, whether it was accepted, and the state
before and after. Click **Local event view** on the page to see the rows for your current run.
Events live only in the server's memory and disappear when it stops.

## Project structure

| Path | What it is |
|---|---|
| `src/models.ts` | Game state and action types |
| `src/rules.ts` | Game rules: start state, move evaluation, win/lose |
| `src/api.ts` | Loads and checks the board data from the server |
| `src/app.ts` | Connects the buttons, rules, page and event recording |
| `src/genre.ts` | Selects the treasure game mode |
| `src/supplied/` | Course-supplied helpers (buttons, rendering, data checks, event sending) |
| `tests/` | Rule tests, my own regression tests and browser tests |
| `fixtures/` | Board data and the expected results used by the tests |
| `server/` | Local server for the page, game data and events |
| `tools/` | Course-supplied boot check, release and recovery scripts |

The rules in `src/rules.ts` are pure functions: they never touch the page and never change the state
they are given; each move returns a new state.
