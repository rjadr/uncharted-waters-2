import updateInterface from './updateInterface';
import { sample } from '../utils';
import state, { SAVED_STATE_KEY } from './state';
import { getUsedShips, isDay } from './selectors';
import { shipData } from '../data/shipData';
import { Provisions, Ship } from '../game/world/fleets';
import { minutesUntilNextMorning } from '../interface/interfaceUtils';
import type { QuestId } from '../interface/quest/questData';
import { getPlayerFleet, getPlayerFleetShip, getTotalFreeCapacity, getGoodQuantity } from './selectorsFleet';
import { itemData, ItemId } from '../data/itemData';
import { type GoodId, getBuyPrice, getSellPrice, supplyModifier } from '../data/marketData';
import { getPortData } from '../game/port/portUtils';

export const updateGeneral = () => {
  updateInterface.general({
    portId: state.portId,
    buildingId: state.buildingId,
    timePassed: state.timePassed,
    gold: state.gold,
  });
};

export const enterBuilding = (buildingId: string) => {
  state.buildingId = buildingId;

  updateGeneral();
};

export const exitBuilding = (sleep = false) => {
  if (!sleep) {
    state.timePassed += sample([40, 60, 80]);
  } else {
    state.timePassed += minutesUntilNextMorning(state.timePassed);
  }

  state.buildingId = null;

  if (isDay()) {
    state.port.characters().spawnNpcs();
  } else {
    state.port.characters().despawnNpcs();
  }

  updateGeneral();
};

export const getAvailableSailorId = () =>
  state.mates.find(({ role }) => role === null || Number.isNaN(role))?.sailorId;

export const addShip = (ship: Omit<Ship, 'sailorId'>) => {
  const sailorId = getAvailableSailorId();
  const fleet = getPlayerFleet();

  if (!sailorId) {
    throw Error('Tried to add a ship to fleet despite no available sailors');
  }

  fleet.push(ship);

  for (let i = 0; i < state.mates.length; i += 1) {
    if (state.mates[i].sailorId === sailorId) {
      state.mates[i].role = fleet.length - 1;
      break;
    }
  }
};

const USED_SHIP_DURABILITY = 0.85;

export const buyUsedShip = (id: string, shipName: string) => {
  const usedShip = getUsedShips();
  const { durability, basePrice } = shipData[usedShip[id]];

  state.gold -= basePrice;

  addShip({
    id: usedShip[id],
    name: shipName,
    crew: 0,
    cargo: [],
    durability: Math.floor(durability * USED_SHIP_DURABILITY),
  });

  delete usedShip[id];

  updateGeneral();
};

export const SELL_SHIP_MODIFIER = 0.5;

export const sellShipNumber = (shipNumber: number) => {
  const { id } = getPlayerFleetShip(shipNumber);

  const fleet = getPlayerFleet();
  fleet.splice(shipNumber, 1);

  const sellPrice = shipData[id].basePrice * SELL_SHIP_MODIFIER;
  state.gold += sellPrice;

  for (let i = 0; i < state.mates.length; i += 1) {
    if (state.mates[i].role === shipNumber) {
      state.mates[i].role = null;
      break;
    }
  }

  if (fleet.length && shipNumber === 0) {
    const mate = state.mates.find(({ role }) => role === 1);

    if (mate) {
      mate.role = null;
    }

    state.mates[0].role = 0;
  }

  updateGeneral();
};

export const provisionCost: { [key in Provisions]: number } = {
  water: 0,
  food: 20,
  lumber: 90,
  shot: 120,
};

export const supplyShip = (
  shipNumber: number,
  provision: Provisions,
  quantity: number,
) => {
  const { cargo } = state.fleets['1'].ships[shipNumber];

  const notNew = cargo.some((item) => {
    if (item.type === provision) {
      // eslint-disable-next-line no-param-reassign
      item.quantity += quantity;
      return true;
    }

    return false;
  });

  if (notNew) {
    state.fleets['1'].ships[shipNumber].cargo = cargo;
  } else {
    state.fleets['1'].ships[shipNumber].cargo.push({
      type: provision,
      quantity,
    });
  }

  state.gold -= provisionCost[provision] * quantity;

  updateGeneral();
};

export const completeQuest = (id: QuestId) => {
  state.quests.push(id);
};

export const receiveGold = (amount: number) => {
  state.gold += amount;

  updateGeneral();
};

export const checkIn = () => {
  updateInterface.fade(() => {
    exitBuilding(true);
  });
};

export const exitBuildingIfNotLodge = () => {
  if (state.buildingId !== '5') {
    exitBuilding();
  }
};

export const receiveFirstShip = () => {
  const id = '6';

  const { durability } = shipData[id];

  addShip({
    id,
    name: 'Hermes II',
    crew: 0,
    cargo: [],
    durability: Math.floor(durability * USED_SHIP_DURABILITY),
  });

  updateGeneral();
};

export const receiveShip = (id: string, name: string) => {
  const { durability } = shipData[id];

  addShip({
    id,
    name,
    crew: 0,
    cargo: [],
    durability: Math.floor(durability * USED_SHIP_DURABILITY),
  });

  updateGeneral();
};

export const recruitRocco = () => {
  state.mates.push({
    sailorId: '32',
    role: null,
  });
};

export const recruitEnrico = () => {
  state.mates.push({
    sailorId: '33',
    role: null,
  });
};

export const assignFirstRoles = () => {
  if (Number.isNaN(state.mates[1].role)) {
    state.mates[1].role = 'firstMate';
  }

  if (Number.isNaN(state.mates[2].role)) {
    state.mates[2].role = 'bookKeeper';
  }

  /*
    In the original game, no check is done before assigning Rocco and Enrico their roles.
    If you hand them ships, they’ll be assigned First Mate and Bookkeeper while still
    remaining as captains (allowing them to captain 2 ships each).
   */
};

export const deposit = (amount: number) => {
  state.savings += amount;
  state.gold -= amount;

  updateGeneral();
};

export const withdraw = (amount: number) => {
  state.savings -= amount;
  state.gold += amount;

  updateGeneral();
};

export const borrow = (amount: number) => {
  state.debt += amount;
  state.gold += amount;

  updateGeneral();
};

export const repay = (amount: number) => {
  state.debt -= amount;
  state.gold -= amount;

  updateGeneral();
};

// TODO implement luck
export const pray = () => {};

export const donate = (amount: number) => {
  const percent = (amount / state.gold) * 100;
  state.gold -= amount;

  updateGeneral();

  return percent;
};

export const buyItem = (id: ItemId, gift = false) => {
  if (!gift) {
    const { price } = itemData[id];

    if (price > state.gold) {
      return false;
    }

    state.gold -= price;
  }

  state.items.push(id);

  updateGeneral();

  return true;
};

export const ITEM_SHOP_SELL_MULTIPLIER = 0.5;

export const sellItem = (i: number) => {
  const id = state.items[i];
  const { price } = itemData[id];

  state.gold += price * ITEM_SHOP_SELL_MULTIPLIER;
  state.items.splice(i, 1);

  updateGeneral();

  return true;
};

// cost in the original game is economy / 20 + 5
export const CREW_COST = 40;

export const recruitCrew = (amount: number) => {
  let remaining = amount;

  const ships = getPlayerFleet();

  for (let i = 0; i < ships.length; i += 1) {
    if (!remaining) {
      return;
    }

    let assign = shipData[ships[i].id].minimumCrew - ships[i].crew;

    if (assign > remaining) {
      assign = remaining;
    }

    ships[i].crew += assign;
    remaining -= assign;
  }

  state.gold -= amount * CREW_COST;

  updateGeneral();
};

// ─── Market / Trade Goods ────────────────────────────────────────────────────

const getPortSupply = (portId: string, goodId: GoodId): number => {
  if (!state.portSupply[portId]) state.portSupply[portId] = {};
  return state.portSupply[portId][goodId] ?? 100;
};

const setPortSupply = (portId: string, goodId: GoodId, value: number) => {
  if (!state.portSupply[portId]) state.portSupply[portId] = {};
  state.portSupply[portId][goodId] = Math.max(0, Math.min(100, value));
};

export const getMarketBuyPrice = (goodId: GoodId): number => {
  if (!state.portId) return 0;
  const port = getPortData(state.portId);
  if (port.isSupplyPort) return 0;
  const base = getBuyPrice(goodId, port.marketId);
  if (base === 0) return 0;
  const supply = getPortSupply(state.portId, goodId);
  return Math.max(1, Math.round(base * supplyModifier(supply)));
};

export const getMarketSellPrice = (goodId: GoodId): number => {
  if (!state.portId) return 0;
  const port = getPortData(state.portId);
  if (port.isSupplyPort) return 0;
  const base = getSellPrice(goodId, port.marketId);
  const supply = getPortSupply(state.portId, goodId);
  return Math.max(1, Math.round(base * (2 - supplyModifier(supply))));
};

// Returns false if not enough gold or space
export const buyGood = (goodId: GoodId, quantity: number): boolean => {
  if (!state.portId) return false;
  const price = getMarketBuyPrice(goodId);
  if (price === 0) return false;

  const totalCost = price * quantity;
  if (state.gold < totalCost) return false;
  if (getTotalFreeCapacity() < quantity) return false;

  // Load onto the flagship; overflow to next ships
  const ships = getPlayerFleet();
  let remaining = quantity;
  for (let i = 0; i < ships.length && remaining > 0; i += 1) {
    const { capacity, minimumCrew } = shipData[ships[i].id];
    const used = ships[i].cargo.reduce((s, c) => s + c.quantity, 0);
    const space = capacity - minimumCrew - used;
    const load = Math.min(remaining, space);
    if (load <= 0) continue;

    const key = `good_${goodId}`;
    const existing = ships[i].cargo.find((c) => c.type === key);
    if (existing) {
      existing.quantity += load;
    } else {
      ships[i].cargo.push({ type: key, quantity: load });
    }
    remaining -= load;
  }

  state.gold -= totalCost;
  // Buying reduces supply (each 10 units bought drops supply by 5)
  const drop = Math.floor(quantity / 10) * 5;
  setPortSupply(state.portId, goodId, getPortSupply(state.portId, goodId) - drop);

  updateGeneral();
  saveGame();
  return true;
};

// Returns false if player doesn't hold that good
export const sellGood = (goodId: GoodId, quantity: number): boolean => {
  if (!state.portId) return false;
  const held = getGoodQuantity(goodId);
  if (held < quantity) return false;

  const price = getMarketSellPrice(goodId);
  const total = price * quantity;

  // Remove from ships in reverse order
  const ships = getPlayerFleet();
  let remaining = quantity;
  for (let i = ships.length - 1; i >= 0 && remaining > 0; i -= 1) {
    const key = `good_${goodId}`;
    const item = ships[i].cargo.find((c) => c.type === key);
    if (!item) continue;
    const take = Math.min(item.quantity, remaining);
    item.quantity -= take;
    remaining -= take;
    if (item.quantity === 0) {
      ships[i].cargo = ships[i].cargo.filter((c) => c.type !== key);
    }
  }

  state.gold += total;
  // Selling increases supply
  const rise = Math.floor(quantity / 10) * 5;
  setPortSupply(state.portId, goodId, getPortSupply(state.portId, goodId) + rise);

  updateGeneral();
  saveGame();
  return true;
};

// Restore supply levels slightly each time player arrives at a port
export const restorePortSupply = (portId: string) => {
  if (!state.portSupply[portId]) return;
  const goods = Object.keys(state.portSupply[portId]) as GoodId[];
  goods.forEach((goodId) => {
    setPortSupply(portId, goodId, getPortSupply(portId, goodId) + 10);
  });
};

// ─── Save / Load ─────────────────────────────────────────────────────────────

// Fields that are safe to serialise (exclude live canvas/game-loop objects)
const PERSIST_KEYS: (keyof typeof state)[] = [
  'portId', 'timePassed', 'fleets', 'dayAtSea', 'gold',
  'quests', 'usedShipsAtPort', 'savings', 'debt', 'items',
  'mates', 'portSupply', 'fame', 'gameStarted', 'captainId',
  'discoveries', 'discoveredIds',
];

export const saveGame = () => {
  const snapshot: Record<string, unknown> = {};
  PERSIST_KEYS.forEach((k) => { snapshot[k] = state[k]; });
  try {
    window.localStorage.setItem(SAVED_STATE_KEY, JSON.stringify(snapshot));
  } catch {
    // storage full or unavailable — silently skip
  }
};

export const clearSave = () => {
  window.localStorage.removeItem(SAVED_STATE_KEY);
};
