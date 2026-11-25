// OWNED BY YOU. Request the game data, separate HTTP and JSON failures, and call parseConfig.

import { GENRE } from "./genre.js";
import { parseConfig, type ConfigFor } from "./supplied/config.js";

export class LoadError extends Error {}

export async function loadConfig(): Promise<ConfigFor<typeof GENRE>> {
  let response: Response;
  try {
    response = await fetch("/api/boards/reference", { headers: { Accept: "application/json" } });
  } catch {
    throw new LoadError("Game data unavailable: network failure");
  }
  if (!response.ok) throw new LoadError(`Game data unavailable: HTTP ${response.status}`);

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new LoadError("Game data was malformed JSON");
  }
  return parseConfig(GENRE, data); // throws ConfigError ("Unexpected game definition ...")
}
