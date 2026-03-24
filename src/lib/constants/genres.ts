export const GAME_GENRES = [
  "action",
  "adventure",
  "arcade",
  "battle_royale",
  "card",
  "casual",
  "city_builder",
  "educational",
  "fighting",
  "horror",
  "hyper_casual",
  "idle",
  "match3",
  "merge",
  "moba",
  "music",
  "platformer",
  "puzzle",
  "racing",
  "rpg",
  "sandbox",
  "shooter",
  "simulation",
  "social_casino",
  "sports",
  "strategy",
  "survival",
  "tower_defense",
  "trivia",
  "word",
  "other",
] as const;

export type GameGenre = (typeof GAME_GENRES)[number];

// Genre-specific analysis fields per genre
export const GENRE_SPECIFIC_FIELDS: Record<string, { key: string; labelKey: string }[]> = {
  match3: [
    { key: "matchMechanics", labelKey: "matchMechanics" },
    { key: "levelDesign", labelKey: "levelDesign" },
    { key: "boosters", labelKey: "boosters" },
  ],
  rpg: [
    { key: "characterProgression", labelKey: "characterProgression" },
    { key: "storyDepth", labelKey: "storyDepth" },
    { key: "combatSystem", labelKey: "combatSystem" },
  ],
  strategy: [
    { key: "resourceManagement", labelKey: "resourceManagement" },
    { key: "baseBuilding", labelKey: "baseBuilding" },
    { key: "allianceSystem", labelKey: "allianceSystem" },
  ],
  puzzle: [
    { key: "puzzleMechanics", labelKey: "puzzleMechanics" },
    { key: "difficultyProgression", labelKey: "difficultyProgression" },
  ],
  idle: [
    { key: "idleProgression", labelKey: "idleProgression" },
    { key: "offlineRewards", labelKey: "offlineRewards" },
    { key: "prestige", labelKey: "prestige" },
  ],
  casual: [
    { key: "accessibilityDesign", labelKey: "accessibilityDesign" },
    { key: "sessionDesign", labelKey: "sessionDesign" },
  ],
  hyper_casual: [
    { key: "coreMechanic", labelKey: "coreMechanic" },
    { key: "adIntegration", labelKey: "adIntegration" },
  ],
  battle_royale: [
    { key: "mapDesign", labelKey: "mapDesign" },
    { key: "lootSystem", labelKey: "lootSystem" },
    { key: "squadMechanics", labelKey: "squadMechanics" },
  ],
  moba: [
    { key: "heroDesign", labelKey: "heroDesign" },
    { key: "teamplay", labelKey: "teamplay" },
    { key: "rankSystem", labelKey: "rankSystem" },
  ],
  simulation: [
    { key: "realism", labelKey: "realism" },
    { key: "sandbox", labelKey: "sandbox" },
    { key: "progression", labelKey: "progression" },
  ],
  shooter: [
    { key: "gunplay", labelKey: "gunplay" },
    { key: "mapDesign", labelKey: "mapDesign" },
    { key: "weaponBalance", labelKey: "weaponBalance" },
  ],
  card: [
    { key: "deckBuilding", labelKey: "deckBuilding" },
    { key: "cardBalance", labelKey: "cardBalance" },
    { key: "collectionSystem", labelKey: "collectionSystem" },
  ],
  merge: [
    { key: "mergeMechanics", labelKey: "mergeMechanics" },
    { key: "boardDesign", labelKey: "boardDesign" },
  ],
  city_builder: [
    { key: "buildingVariety", labelKey: "buildingVariety" },
    { key: "economyBalance", labelKey: "economyBalance" },
    { key: "socialFeatures", labelKey: "socialFeatures" },
  ],
  tower_defense: [
    { key: "towerVariety", labelKey: "towerVariety" },
    { key: "pathDesign", labelKey: "pathDesign" },
    { key: "upgradeSystem", labelKey: "upgradeSystem" },
  ],
  racing: [
    { key: "drivingModel", labelKey: "drivingModel" },
    { key: "trackDesign", labelKey: "trackDesign" },
    { key: "vehicleCustomization", labelKey: "vehicleCustomization" },
  ],
  sports: [
    { key: "gameplayRealism", labelKey: "gameplayRealism" },
    { key: "teamManagement", labelKey: "teamManagement" },
    { key: "seasonMode", labelKey: "seasonMode" },
  ],
};
