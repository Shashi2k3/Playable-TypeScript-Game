// OWNED BY YOU. Treasure-hunt state and action types, with their invariants.

import type { Direction } from "./supplied/controls.js";

export type Status = "playing" | "won" | "lost";

export type Reason = "WALL" | "EDGE" | "GAME_COMPLETE" | "INVALID_ACTION";

export interface Position {
  readonly x: number; // 0 <= x < board width
  readonly y: number; // 0 <= y < board height, never a wall
}

export interface GameState {
  readonly position: Position;
  readonly movesRemaining: number; // >= 0; only accepted moves spend one
  readonly score: number; // sum of the values of `collected`
  readonly collected: readonly string[]; // treasure ids, each at most once
  readonly status: Status; // "won"/"lost" are final: no further action is accepted
}

export interface GameAction {
  readonly type: "move";
  readonly direction: Direction;
}

export interface RuleResult {
  readonly accepted: boolean | null; // null only for the start result
  readonly reason: Reason | null; // null exactly when accepted
  readonly state: GameState;
}
