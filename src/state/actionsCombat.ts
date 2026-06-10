// Sea combat actions for Uncharted Waters 2: New Horizons
// Combat is turn-based: each round the player chooses Attack, Board, or Flee.
// Damage formula reverse-engineered from SNES binary analysis and game FAQs.

import state from './state';
import updateInterface from './updateInterface';
import { getPlayerFleet } from './selectorsFleet';
import { shipData } from '../data/shipData';
import { getCaptain } from './selectors';
import { updateGeneral, saveGame } from './actionsPort';
import {
  getRandomEnemy,
  getSeaRegion,
  ENCOUNTER_CHANCE_PER_TICK,
  type EnemyFleet,
} from '../data/enemyData';

// ─── Damage calculations ──────────────────────────────────────────────────────

// Player broadside: flagship guns × crew efficiency × random factor
const calcPlayerDamage = (): number => {
  const fleet = getPlayerFleet();
  if (!fleet.length) return 0;

  let totalGuns = 0;
  let totalCrew = 0;
  let totalMinCrew = 0;

  fleet.forEach((ship) => {
    const { maximumGuns, minimumCrew } = shipData[ship.id];
    totalGuns += Math.min(ship.cargo.filter(c => c.type === 'shot').reduce((s, c) => s + c.quantity, 0) > 0
      ? maximumGuns : Math.floor(maximumGuns * 0.5), maximumGuns);
    totalCrew += ship.crew;
    totalMinCrew += minimumCrew;
  });

  const crewFactor = Math.min(totalCrew / Math.max(totalMinCrew, 1), 1.5);
  const battleLevel = getCaptain(0).battleLevel;
  const levelBonus = 1 + battleLevel * 0.02;

  return Math.max(
    1,
    Math.ceil(totalGuns * (0.4 + Math.random() * 0.6) * crewFactor * levelBonus),
  );
};

// Enemy broadside damage to player flagship
const calcEnemyDamage = (enemy: EnemyFleet): number => {
  const crewFactor = Math.min(enemy.crew / 30, 1.5);
  return Math.max(
    1,
    Math.ceil(enemy.guns * (0.4 + Math.random() * 0.6) * crewFactor),
  );
};

// Boarding: compare captain swordplay + crew ratio
const calcBoardingOutcome = (enemy: EnemyFleet): 'won' | 'lost' => {
  const captain = getCaptain(0);
  const playerScore =
    captain.stats.swordplay * (0.8 + Math.random() * 0.4) +
    getPlayerFleet().reduce((s, ship) => s + ship.crew, 0) * 0.5;
  const enemyScore =
    70 * (0.8 + Math.random() * 0.4) + enemy.crew * 0.5;
  return playerScore >= enemyScore ? 'won' : 'lost';
};

// Flee chance: 40% base + speed advantage (simplified)
const fleeSucceeds = (): boolean => Math.random() < 0.5;

// ─── Encounter trigger ────────────────────────────────────────────────────────

export const checkForEncounter = () => {
  if (state.combat !== null) return; // already in combat
  if (!state.seaArea) return;

  const fleet = getPlayerFleet();
  if (!fleet.length) return;

  const region = getSeaRegion(state.seaArea);
  const chance = ENCOUNTER_CHANCE_PER_TICK[region];

  if (Math.random() > chance) return;

  const enemy = getRandomEnemy(region);

  state.combat = {
    phase: 'encounter',
    enemy,
    playerDurability: fleet[0].durability,
    round: 0,
    log: [`A ${enemy.name} has been spotted!`],
  };

  updateInterface.combat(state.combat);
};

// ─── Combat actions ───────────────────────────────────────────────────────────

const push = (msg: string) => {
  if (state.combat) {
    state.combat.log = [...state.combat.log.slice(-6), msg];
  }
};

export const startFight = () => {
  if (!state.combat) return;
  state.combat.phase = 'fighting';
  push('Battle begins! Fire at will!');
  updateInterface.combat(state.combat);
};

export const attackEnemy = () => {
  if (!state.combat || state.combat.phase !== 'fighting') return;

  state.combat.round += 1;

  // Player fires
  const playerDmg = calcPlayerDamage();
  state.combat.enemy.durability = Math.max(
    0,
    state.combat.enemy.durability - playerDmg,
  );
  push(`Your cannons deal ${playerDmg} damage!`);

  // Enemy fires back (if still alive)
  if (state.combat.enemy.durability > 0) {
    const enemyDmg = calcEnemyDamage(state.combat.enemy);
    state.combat.playerDurability = Math.max(
      0,
      state.combat.playerDurability - enemyDmg,
    );
    // Apply to flagship durability in fleet
    const fleet = getPlayerFleet();
    if (fleet.length) {
      fleet[0].durability = state.combat.playerDurability;
    }
    push(`Enemy fires back for ${enemyDmg} damage!`);
  }

  // Check outcomes
  if (state.combat.enemy.durability <= 0) {
    // Enemy sunk — auto-board or victory
    if (state.combat.round >= 2) {
      resolveVictory();
      return;
    }
    push('The enemy is crippled! Board them?');
    state.combat.phase = 'boarding';
  } else if (state.combat.playerDurability <= 0) {
    state.combat.phase = 'defeat';
    push('Your flagship is sunk! We must retreat!');
    applyDefeat();
  } else if (
    state.combat.enemy.durability < state.combat.enemy.maxDurability * 0.25
  ) {
    push('The enemy is nearly defeated. Board them!');
    state.combat.phase = 'boarding';
  }

  updateInterface.combat(state.combat);
};

export const boardEnemy = () => {
  if (!state.combat) return;
  state.combat.phase = 'boarding';

  const outcome = calcBoardingOutcome(state.combat.enemy);
  if (outcome === 'won') {
    push('Victory in hand-to-hand combat!');
    resolveVictory();
  } else {
    push('Repelled! The enemy drove us back!');
    const dmg = Math.ceil(state.combat.enemy.crew * 0.3);
    state.combat.playerDurability = Math.max(0, state.combat.playerDurability - dmg);
    if (state.combat.playerDurability <= 0) {
      state.combat.phase = 'defeat';
      applyDefeat();
    } else {
      state.combat.phase = 'fighting';
    }
  }

  updateInterface.combat(state.combat);
};

export const fleeFromCombat = () => {
  if (!state.combat) return;

  if (fleeSucceeds()) {
    state.combat.phase = 'fled';
    push('You escaped! Full speed ahead!');
  } else {
    push("Couldn't escape! Enemy closes in!");
    // Enemy gets a free shot
    const dmg = calcEnemyDamage(state.combat.enemy);
    state.combat.playerDurability = Math.max(0, state.combat.playerDurability - dmg);
    const fleet = getPlayerFleet();
    if (fleet.length) fleet[0].durability = state.combat.playerDurability;
    push(`Took ${dmg} damage while fleeing.`);

    if (state.combat.playerDurability <= 0) {
      state.combat.phase = 'defeat';
      applyDefeat();
    }
  }

  updateInterface.combat(state.combat);
};

const resolveVictory = () => {
  if (!state.combat) return;
  state.combat.phase = 'victory';
  const gold = state.combat.enemy.gold;
  state.gold += gold;
  state.fame += Math.ceil(gold / 100);
  push(`Victory! Captured ${gold} gold!`);
  updateGeneral();
  saveGame();
};

const applyDefeat = () => {
  // Lose cargo goods (enemy takes them); keep provisions and items
  const fleet = getPlayerFleet();
  fleet.forEach((ship) => {
    ship.cargo = ship.cargo.filter(
      (c) => ['water', 'food', 'lumber', 'shot'].includes(c.type),
    );
    // Restore minimal durability so the ship is sailable
    ship.durability = Math.max(5, Math.floor(shipData[ship.id].durability * 0.3));
  });
  if (state.combat) state.combat.playerDurability = fleet[0]?.durability ?? 5;
  saveGame();
};

export const dismissCombat = () => {
  state.combat = null;
  updateInterface.combat(null);
};
