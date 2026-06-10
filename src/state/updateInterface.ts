import type { State, ProvisionsType, CombatState } from './state';
import type { DiscoveryId } from '../data/discoveryData';

interface UpdateInterface {
  general: (
    general: Pick<State, 'portId' | 'buildingId' | 'timePassed' | 'gold'>,
  ) => void;
  dayAtSea: (dayAtSea: number) => void;
  provisions: (provisions: ProvisionsType) => void;
  indicators: (indicators: Pick<State, 'wind' | 'current'>) => void;
  playerFleetDirection: (direction: number) => void;
  playerFleetSpeed: (speed: number) => void;
  fade: (onComplete: () => void) => void;
  combat: (combat: CombatState | null) => void;
  titleScreen: (show: boolean) => void;
  // called when a discovery item is found at sea
  discovery: (discoveryId: DiscoveryId | null) => void;
}

const updateInterface = {} as UpdateInterface;

export default updateInterface;
