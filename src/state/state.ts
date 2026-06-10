import { START_TIME_PASSED } from '../constants';
import { Provisions, fleets, Fleets } from '../game/world/fleets';
import type { Port } from '../game/port/port';
import type { World } from '../game/world/world';
import type { QuestId } from '../interface/quest/questData';
import { ItemId } from '../data/itemData';
import type { GoodId } from '../data/marketData';
import type { EnemyFleet } from '../data/enemyData';
import type { DiscoveryId } from '../data/discoveryData';

export type Stage = 'world' | 'port' | 'building';

export type Velocity = {
  direction: number;
  speed: number;
};

export type ProvisionsType = {
  [key in Provisions]: number;
};

type UsedShipsAtPort = { [key: string]: UsedShips };
export type UsedShips = { [key: string]: string };

export type Role =
  | number
  | 'firstMate'
  | 'bookKeeper'
  | 'chiefNavigator'
  | null;

type Mate = {
  sailorId: string;
  role: Role;
};

// Supply level (0–100) per good per port. 100 = fully stocked, lower = scarcer = higher prices.
export type PortSupply = { [portId: string]: { [goodId in GoodId]?: number } };

export type CombatPhase =
  | 'encounter'   // enemy spotted, offer fight/flee
  | 'fighting'    // broadside exchange
  | 'boarding'    // hand-to-hand after durability low
  | 'victory'
  | 'defeat'
  | 'fled';

export interface CombatState {
  phase: CombatPhase;
  enemy: EnemyFleet;
  playerDurability: number;
  round: number;
  log: string[];
}

export interface State {
  portId: string | null;
  buildingId: string | null;
  timePassed: number;
  world: World;
  fleets: Fleets;
  seaArea: number | undefined;
  wind: Velocity;
  current: Velocity;
  playerFleet: Velocity;
  port: Port;
  dayAtSea: number;
  gold: number;
  quests: QuestId[];
  usedShipsAtPort: UsedShipsAtPort;
  savings: number;
  debt: number;
  items: ItemId[];
  mates: Mate[];
  portSupply: PortSupply;
  fame: number;
  // discovery items currently in cargo (found but not yet presented to a researcher)
  discoveries: DiscoveryId[];
  // discovery ids already presented — cannot be found again
  discoveredIds: DiscoveryId[];
  combat: CombatState | null;
  captainId: string; // which of the 6 captains the player is using
  gameStarted: boolean; // false until startNewGame() is called; gates title screen
}

export const SAVED_STATE_KEY = 'savedState';

const savedState = JSON.parse(
  window.localStorage.getItem(SAVED_STATE_KEY) || '{}',
);

const state = {
  portId: '1',
  buildingId: null,
  timePassed: START_TIME_PASSED,
  fleets,
  dayAtSea: 0,
  gold: 0,
  quests: [] as QuestId[],
  usedShipsAtPort: {},
  savings: 0,
  debt: 0,
  items: [],
  mates: [
    {
      sailorId: '1',
      role: null,
    },
  ] as Mate[],
  portSupply: {} as PortSupply,
  fame: 0,
  discoveries: [] as DiscoveryId[],
  discoveredIds: [] as DiscoveryId[],
  combat: null,
  captainId: '1',
  gameStarted: false,
  ...savedState,
} as State;

export default state;
