import state from './state';
import { shipData } from '../data/shipData';
import { provisions } from '../game/world/fleets';
import type { GoodId } from '../data/marketData';

export const getPlayerFleet = () => state.fleets['1'].ships;

export const getPlayerFleetShip = (shipNumber: number) =>
  state.fleets['1'].ships[shipNumber];

export const getAvailableSpace = (shipNumber: number) => {
  const ship = state.fleets['1'].ships[shipNumber];
  const { capacity, minimumCrew } = shipData[ship.id];

  const cargo = ship.cargo.reduce((p, c) => p + c.quantity, 0);
  const availableSpace = capacity - minimumCrew;

  return availableSpace - cargo;
};

export const getLoadPercent = (shipNumber: number) => {
  const ship = state.fleets['1'].ships[shipNumber];
  const { capacity, minimumCrew } = shipData[ship.id];

  const cargo = ship.cargo.reduce((p, c) => p + c.quantity, 0);

  return ((cargo + minimumCrew) / capacity) * 100;
};

export const hasCrewAssigned = () =>
  state.fleets['1'].ships.every((ship) => ship.crew > 0);

export const getDaysProvisionsWillLast = () => {
  let totalCrew = 0;
  let totalWater = 0;
  let totalFood = 0;

  getPlayerFleet().forEach((ship) => {
    totalCrew += ship.crew;
    totalWater +=
      ship.cargo.find((items) => items.type === 'water')?.quantity || 0;
    totalFood +=
      ship.cargo.find((items) => items.type === 'food')?.quantity || 0;
  });

  return Math.floor(
    Math.min(totalWater / totalCrew, totalFood / totalCrew) * 10,
  );
};

export const getCrewNeeded = () => {
  let count = 0;

  getPlayerFleet().forEach((ship) => {
    count += shipData[ship.id].minimumCrew - ship.crew;
  });

  return count;
};

// Total cargo capacity across all player ships (minus minimum crew slots)
export const getTotalFleetCapacity = (): number =>
  getPlayerFleet().reduce((total, ship) => {
    const { capacity, minimumCrew } = shipData[ship.id];
    return total + capacity - minimumCrew;
  }, 0);

// Total units currently loaded (provisions + trade goods combined)
export const getTotalCargoUsed = (): number =>
  getPlayerFleet().reduce(
    (total, ship) =>
      total + ship.cargo.reduce((sum, item) => sum + item.quantity, 0),
    0,
  );

export const getTotalFreeCapacity = (): number =>
  getTotalFleetCapacity() - getTotalCargoUsed();

// Quantity of a specific trade good held across the whole fleet
export const getGoodQuantity = (goodId: GoodId): number =>
  getPlayerFleet().reduce((total, ship) => {
    const item = ship.cargo.find((c) => c.type === `good_${goodId}`);
    return total + (item?.quantity ?? 0);
  }, 0);

// All trade goods currently held, as { goodId, quantity } pairs
export const getAllGoods = (): { goodId: GoodId; quantity: number }[] => {
  const map: Partial<Record<GoodId, number>> = {};

  getPlayerFleet().forEach((ship) => {
    ship.cargo.forEach((item) => {
      if (!provisions.includes(item.type as any)) {
        const goodId = item.type.replace('good_', '') as GoodId;
        map[goodId] = (map[goodId] ?? 0) + item.quantity;
      }
    });
  });

  return Object.entries(map).map(([goodId, quantity]) => ({
    goodId: goodId as GoodId,
    quantity: quantity!,
  }));
};
