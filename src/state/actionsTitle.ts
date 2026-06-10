import state from './state';
import { captainData, captainInitialMates } from '../data/captainData';
import { START_TIME_PASSED } from '../constants';
import updateInterface from './updateInterface';
import { updateGeneral, saveGame, addShip } from './actionsPort';
import { setDockedFleetPositions } from './actionsWorld';
import { shipData } from '../data/shipData';
import type { PortSupply } from './state';

const USED_SHIP_DURABILITY = 0.85;

// Starting ship configuration for each captain except João (who receives his via quest).
const captainStartingShip: Record<string, { shipId: string; name: string; crew: number }> = {
  '2': { shipId: '8', name: 'Fortuna',    crew: 30 }, // Pietro  — Brigantine
  '3': { shipId: '7', name: 'Venganza',   crew: 20 }, // Catalina — Caravela Redonda
  '4': { shipId: '7', name: 'Discovery',  crew: 20 }, // Otto     — Caravela Redonda
  '5': { shipId: '3', name: 'Suleiman',   crew: 15 }, // Ali      — Dhow
  '6': { shipId: '8', name: 'Vrouw Maria', crew: 30 }, // Ernst    — Brigantine
};

export const startNewGame = (captainId: string) => {
  const captain = captainData[captainId];
  if (!captain) return;

  // Reset fleet — ships empty, position cleared
  state.fleets['1'].ships = [];
  state.fleets['1'].position = undefined;

  // Destroy live game objects so they are re-created fresh by the loop
  (state as any).port = undefined;
  (state as any).world = undefined;

  // Captain starting conditions
  state.captainId = captainId;
  state.portId = captain.startingPortId;
  state.gold = captain.startingGold;
  state.timePassed = START_TIME_PASSED;

  // Reset all other mutable state
  state.buildingId = null;
  state.dayAtSea = 0;
  state.quests = [];
  state.usedShipsAtPort = {};
  state.savings = 0;
  state.debt = 0;
  state.items = [];
  state.mates = captainInitialMates[captainId].map((sailorId) => ({
    sailorId,
    role: null as null,
  }));
  state.portSupply = {} as PortSupply;
  state.fame = 0;
  state.combat = null;
  state.gameStarted = true;

  // Give non-João captains their starting ship and provisions.
  const shipConfig = captainStartingShip[captainId];
  if (shipConfig) {
    const { durability } = shipData[shipConfig.shipId];
    const provisionQty = Math.ceil(shipConfig.crew / 10) * 14; // two weeks of food + water
    addShip({
      id: shipConfig.shipId,
      name: shipConfig.name,
      crew: shipConfig.crew,
      durability: Math.floor(durability * USED_SHIP_DURABILITY),
      cargo: [
        { type: 'food',  quantity: provisionQty },
        { type: 'water', quantity: provisionQty },
      ],
    });
  }

  // Set the fleet's world-map position adjacent to the starting port.
  setDockedFleetPositions();

  // Persist and update React
  saveGame();
  updateInterface.combat(null);
  updateInterface.titleScreen(false);
  updateGeneral();
};
