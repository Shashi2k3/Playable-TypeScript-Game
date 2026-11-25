// OWNED BY YOU. The application adapter: load -> start -> dispatch -> restart.

import { loadConfig } from "./api.js";
import { GENRE } from "./genre.js";
import type { GameState } from "./models.js";
import { evaluate, initialState, isFinished } from "./rules.js";
import type { TreasureConfig } from "./supplied/config.js";
import { connect, playable } from "./supplied/controls.js";
import { identify, paint, text } from "./supplied/render.js";
import { newRunId, recordEvent } from "./supplied/telemetry.js";

let config: TreasureConfig | null = null; // last verified game data
let state: GameState | null = null; // current session; null until Start
let runId = "";
let sequence = 0;

const STATUS_TEXT = { playing: "Playing", won: "You won!", lost: "Out of moves: you lost" } as const;

function show(next: GameState): void {
  state = next;
  paint(next);
  text("status", STATUS_TEXT[next.status]);
  playable(!isFinished(next));
}

async function load(): Promise<void> {
  text("api", "Loading game data...");
  try {
    config = await loadConfig();
    text("api", `Game data verified: ${config.name}`);
  } catch (error) {
    // Transport/definition problems stay in "api"; the last confirmed session is kept.
    text("api", (error as Error).message);
  }
}

function start(): void {
  if (!config) {
    text("status", "Cannot start: no verified game data yet");
    return;
  }
  runId = newRunId();
  sequence = 0;
  identify(runId);
  text("result", "No action yet");
  text("telemetry", "No event recorded yet");
  show(initialState(config));
}

connect(GENRE, {
  dispatch(action) {
    if (!config || !state) return;
    const before = state;
    const result = evaluate(config, before, action);
    show(result.state);
    text("result", result.accepted ? `Accepted: ${action.direction}` : `Rejected: ${result.reason}`);

    sequence += 1;
    recordEvent({ runId, sequence, action: action.direction, accepted: result.accepted === true, before, after: result.state })
      .then(() => text("telemetry", "Recorded locally"))
      .catch(() => text("telemetry", "Local recording unavailable"));
  },
  start,
  restart: start,
  reload: () => void load(),
});

playable(false);
text("status", "Press Start game once the game data is verified");
void load();
