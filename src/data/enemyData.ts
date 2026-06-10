// Enemy fleet definitions for sea combat.
// Enemies are organised by sea region (derived from seaArea).
// Ship IDs reference shipData.ts. Stats may differ from player-purchasable versions.

export interface EnemyFleet {
  name: string;
  shipId: string; // flagship visual/stat reference
  guns: number;
  crew: number;
  durability: number;
  maxDurability: number;
  gold: number; // base reward on victory
}

// seaArea = column + row * 30; world is 2160px wide (30 cols), ~900px tall
// Rough region buckets by seaArea value:
//   0–89    Atlantic Ocean
//  90–179   Mediterranean / North Africa
// 180–269   West Africa / South Atlantic
// 270–359   Indian Ocean / Middle East
// 360+      Southeast Asia / Far East

export type SeaRegion =
  | 'atlantic'
  | 'mediterranean'
  | 'west_africa'
  | 'indian_ocean'
  | 'far_east';

export const getSeaRegion = (seaArea: number): SeaRegion => {
  if (seaArea < 90) return 'atlantic';
  if (seaArea < 180) return 'mediterranean';
  if (seaArea < 270) return 'west_africa';
  if (seaArea < 360) return 'indian_ocean';
  return 'far_east';
};

// Encounter probability per world tick (one tick = 20 minutes game-time).
// ~72 ticks per day. Probability below is per-tick.
export const ENCOUNTER_CHANCE_PER_TICK: Record<SeaRegion, number> = {
  atlantic: 0.0008,
  mediterranean: 0.0015,
  west_africa: 0.001,
  indian_ocean: 0.0012,
  far_east: 0.001,
};

// Enemy tables per region. One is chosen at random on encounter.
const enemyTables: Record<SeaRegion, EnemyFleet[]> = {
  atlantic: [
    {
      name: 'Atlantic Pirate',
      shipId: '6',  // Latin
      guns: 4,
      crew: 30,
      durability: 25,
      maxDurability: 25,
      gold: 300,
    },
    {
      name: 'Portuguese Privateer',
      shipId: '8',  // Caravel Round
      guns: 8,
      crew: 50,
      durability: 40,
      maxDurability: 40,
      gold: 600,
    },
    {
      name: 'Spanish Galleon',
      shipId: '11', // Galleon
      guns: 20,
      crew: 120,
      durability: 80,
      maxDurability: 80,
      gold: 2000,
    },
  ],
  mediterranean: [
    {
      name: 'Barbary Corsair',
      shipId: '7',  // Galley
      guns: 6,
      crew: 60,
      durability: 30,
      maxDurability: 30,
      gold: 400,
    },
    {
      name: 'Ottoman Warship',
      shipId: '9',  // Galleas
      guns: 16,
      crew: 100,
      durability: 60,
      maxDurability: 60,
      gold: 1200,
    },
    {
      name: 'Venetian Trader',
      shipId: '6',
      guns: 3,
      crew: 25,
      durability: 20,
      maxDurability: 20,
      gold: 500,
    },
  ],
  west_africa: [
    {
      name: 'African Pirate',
      shipId: '1',  // Balsa
      guns: 2,
      crew: 20,
      durability: 15,
      maxDurability: 15,
      gold: 200,
    },
    {
      name: 'Slave Trader',
      shipId: '8',
      guns: 10,
      crew: 60,
      durability: 35,
      maxDurability: 35,
      gold: 800,
    },
  ],
  indian_ocean: [
    {
      name: 'Arab Dhow',
      shipId: '19', // Dhow
      guns: 4,
      crew: 35,
      durability: 22,
      maxDurability: 22,
      gold: 350,
    },
    {
      name: 'Malay Pirate',
      shipId: '6',
      guns: 6,
      crew: 45,
      durability: 28,
      maxDurability: 28,
      gold: 500,
    },
    {
      name: 'Indian Merchant',
      shipId: '8',
      guns: 8,
      crew: 55,
      durability: 38,
      maxDurability: 38,
      gold: 900,
    },
  ],
  far_east: [
    {
      name: 'Wokou Pirate',
      shipId: '6',
      guns: 5,
      crew: 40,
      durability: 24,
      maxDurability: 24,
      gold: 450,
    },
    {
      name: 'Chinese Junk',
      shipId: '20', // Junk
      guns: 12,
      crew: 80,
      durability: 50,
      maxDurability: 50,
      gold: 1100,
    },
    {
      name: 'Japanese Warship',
      shipId: '20',
      guns: 14,
      crew: 90,
      durability: 55,
      maxDurability: 55,
      gold: 1400,
    },
  ],
};

export const getRandomEnemy = (region: SeaRegion): EnemyFleet => {
  const table = enemyTables[region];
  return { ...table[Math.floor(Math.random() * table.length)] };
};
