import state from './state';
import updateInterface from './updateInterface';
import { discoveryData, type DiscoveryId } from '../data/discoveryData';
import { saveGame } from './actionsPort';

// Radius (in world-map pixels) within which the player can find a discovery.
const DISCOVERY_RADIUS = 40;

// Probability per world tick of finding a discovery when in range.
// ~72 ticks/day; with 0.03/tick a player camping a spot finds it within ~24 ticks (~8 hrs).
const DISCOVERY_CHANCE_PER_TICK = 0.03;

const distanceSq = (
  ax: number, ay: number,
  bx: number, by: number,
): number => (ax - bx) ** 2 + (ay - by) ** 2;

const radiusSq = DISCOVERY_RADIUS ** 2;

// Called every world tick while at sea.
export const checkForDiscoveries = () => {
  const position = state.fleets['1'].position;
  if (!position) return;

  const { x, y } = position;

  for (const [id, d] of Object.entries(discoveryData) as [DiscoveryId, typeof discoveryData[DiscoveryId]][]) {
    // Skip already found or already presented
    if (state.discoveries.includes(id)) continue;
    if (state.discoveredIds.includes(id)) continue;

    const { location } = d;
    if (distanceSq(x, y, location.x, location.y) > radiusSq) continue;

    // In range — roll for discovery
    if (Math.random() > DISCOVERY_CHANCE_PER_TICK) continue;

    // Found it!
    state.discoveries.push(id);
    saveGame();

    updateInterface.discovery(id);
    return; // only one discovery per tick
  }
};

// Dismiss the discovery popup.
export const dismissDiscovery = () => {
  updateInterface.discovery(null);
};

// Present a discovery to a researcher (called from the building interaction).
// Returns the adventure fame gained, or 0 if not held.
export const presentDiscovery = (id: DiscoveryId): number => {
  const idx = state.discoveries.indexOf(id);
  if (idx === -1) return 0;

  state.discoveries.splice(idx, 1);
  state.discoveredIds.push(id);

  // Base fame from the category — in the original game each discovery has a fixed value.
  // These category defaults approximate the relative values from the original.
  const category = discoveryData[id].categoryId;
  const fameByCat: Record<number, number> = {
    0: 30, // Cultural Artifact
    1: 40, // Monument
    2: 20, // Exotic Animal
    3: 15, // Plant
    4: 35, // Ruins
    5: 50, // Monster
    6: 25, // Natural Wonder
  };
  const fame = fameByCat[category] ?? 20;
  state.fame += fame;

  saveGame();
  return fame;
};
