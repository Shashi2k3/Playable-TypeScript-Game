// OWNED BY YOU. Changed-input regressions with INDEPENDENT expected values (worked out by hand).
//
// Run with: npm run check:rules   (it builds first, then imports the compiled rules from dist/)

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseConfig } from "../dist/supplied/config.js";
import { evaluate } from "../dist/rules.js";

const board = JSON.parse(readFileSync(new URL("../fixtures/board-reference.json", import.meta.url), "utf8"));
const config = parseConfig("treasure", board);

function check(state, action, expected) {
  const before = JSON.stringify(state);
  assert.deepStrictEqual(evaluate(config, state, action), expected);
  assert.equal(JSON.stringify(state), before, "input state must not be mutated");
}

test("re-entering an already collected treasure square does not score again", () => {
  const state = { position: { x: 2, y: 1 }, movesRemaining: 3, score: 10, collected: ["t1"], status: "playing" };
  check(state, { type: "move", direction: "north" }, {
    accepted: true,
    reason: null,
    state: { position: { x: 2, y: 0 }, movesRemaining: 2, score: 10, collected: ["t1"], status: "playing" },
  });
});

test("reaching the exit on the last move without the treasure loses", () => {
  const state = { position: { x: 2, y: 1 }, movesRemaining: 1, score: 0, collected: [], status: "playing" };
  check(state, { type: "move", direction: "south" }, {
    accepted: true,
    reason: null,
    state: { position: { x: 2, y: 2 }, movesRemaining: 0, score: 0, collected: [], status: "lost" },
  });
});

test("an unknown action type is rejected and state is unchanged", () => {
  const state = { position: { x: 0, y: 0 }, movesRemaining: 6, score: 0, collected: [], status: "playing" };
  check(state, { type: "jump", direction: "east" }, { accepted: false, reason: "INVALID_ACTION", state });
});
