import { worldMaps } from "./maps/world.js";
import { thailandMaps } from "./maps/thailand.js";
import { japanMaps } from "./maps/japan.js";

export const maps = [
  ...thailandMaps,
  ...japanMaps,
  ...worldMaps
];