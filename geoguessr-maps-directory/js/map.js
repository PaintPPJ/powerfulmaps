import { worldMaps } from "./maps/world.js";
import { thailandMaps } from "./maps/thailand.js";
import { japanMaps } from "./maps/japan.js";
import { colombiaMaps } from "./maps/colombia.js";
import { australiaMaps } from "./maps/australia.js";


export const maps = [
  ...thailandMaps,
  ...japanMaps,
  ...worldMaps,
  ...colombiaMaps,
  ...australiaMaps,
];