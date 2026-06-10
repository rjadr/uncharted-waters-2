import type { Position } from '../../types';

export const provisions = ['water', 'food', 'lumber', 'shot'] as const;
export type Provisions = typeof provisions[number];

interface Cargo {
  type: Provisions | string; // Provisions strings or good IDs like 'good_1'
  quantity: number;
}

export interface Ship {
  id: string;
  name: string;
  crew: number;
  cargo: Cargo[];
  durability: number;
}

interface Fleet {
  position: Position | undefined;
  ships: Ship[];
}

export interface Fleets {
  [key: string]: Fleet;
}

export const fleets: Fleets = {
  '1': {
    position: undefined,
    ships: [],
  },
};
