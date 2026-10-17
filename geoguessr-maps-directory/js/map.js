import { worldMaps } from "./maps/world.js";
import { thailandMaps } from "./maps/thailand.js";
import { japanMaps } from "./maps/japan.js";
import { colombiaMaps } from "./maps/colombia.js";
import { australiaMaps } from "./maps/australia.js";
import { newzealandMaps } from "./maps/new zealand.js";
import { paraguayMaps } from "./maps/paraguay.js";
import {special_person } from "./maps/special_person.js";

export const maps = [
  ...thailandMaps,
  ...japanMaps,
  ...worldMaps,
  ...colombiaMaps,
  ...australiaMaps,
  ...newzealandMaps,
  ...paraguayMaps,
  ...special_person
  
];