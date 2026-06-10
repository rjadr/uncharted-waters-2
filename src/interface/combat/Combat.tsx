import React from 'react';

import MessageBox from '../common/MessageBox';
import BuildingMenu from '../common/BuildingMenu';
import ProgressBar from '../common/ProgressBar';
import {
  startFight,
  attackEnemy,
  boardEnemy,
  fleeFromCombat,
  dismissCombat,
} from '../../state/actionsCombat';
import { shipData } from '../../data/shipData';
import { getPlayerFleet } from '../../state/selectorsFleet';
import type { CombatState } from '../../state/state';

interface Props {
  combat: CombatState;
}

const playerDurabilityPercent = (current: number): number => {
  const fleet = getPlayerFleet();
  if (!fleet.length) return 0;
  const max = shipData[fleet[0].id]?.durability ?? 30;
  return Math.round((current / max) * 100);
};

export default function Combat({ combat }: Props) {
  const { phase, enemy, playerDurability, log } = combat;

  const playerFleet = getPlayerFleet();
  const playerShipName = playerFleet[0]?.name ?? 'Flagship';
  const enemyDurPct = Math.round(
    (enemy.durability / enemy.maxDurability) * 100,
  );
  const playerDurPct = playerDurabilityPercent(playerDurability);

  const isOver =
    phase === 'victory' || phase === 'defeat' || phase === 'fled';

  return (
    <div
      className="absolute inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0,0,0,0.85)' }}
    >
      <div className="w-[900px]">
        {/* Header */}
        <div className="text-center text-4xl mb-4" style={{ color: '#f3a200' }}>
          {phase === 'encounter' && 'ENEMY SIGHTED!'}
          {phase === 'fighting' && 'SEA BATTLE'}
          {phase === 'boarding' && 'BOARDING ACTION'}
          {phase === 'victory' && 'VICTORY!'}
          {phase === 'defeat' && 'DEFEAT!'}
          {phase === 'fled' && 'ESCAPED!'}
        </div>

        {/* Ship status bars */}
        <div className="flex gap-8 mb-4">
          <MessageBox>
            <div className="px-4 py-2 w-[380px]">
              <div className="text-green-400 text-2xl mb-1">{playerShipName}</div>
              <div className="text-2xl mb-1">Hull integrity</div>
              <ProgressBar percent={playerDurPct} />
              <div className="text-xl mt-1 text-right">{playerDurability} HP</div>
            </div>
          </MessageBox>
          <MessageBox>
            <div className="px-4 py-2 w-[380px]">
              <div className="text-[#d34100] text-2xl mb-1">{enemy.name}</div>
              <div className="text-2xl mb-1">Hull integrity</div>
              <ProgressBar percent={enemyDurPct} />
              <div className="text-xl mt-1 text-right">{enemy.durability} HP</div>
            </div>
          </MessageBox>
        </div>

        {/* Combat log */}
        <MessageBox>
          <div className="px-4 py-2 w-full min-h-[100px]">
            {log.map((line, i) => (
              <div key={i} className="text-2xl" style={{ color: i === log.length - 1 ? '#f3e3d3' : '#888' }}>
                {line}
              </div>
            ))}
          </div>
        </MessageBox>

        {/* Action menu */}
        <div className="mt-4 flex justify-center">
          {phase === 'encounter' && (
            <BuildingMenu
              options={[
                { label: 'Fight', value: 'fight' },
                { label: 'Flee', value: 'flee' },
              ]}
              onSelect={(v) => {
                if (v === 'fight') startFight();
                else fleeFromCombat();
              }}
              onCancel={() => {}}
            />
          )}

          {phase === 'fighting' && (
            <BuildingMenu
              options={[
                { label: 'Attack', value: 'attack' },
                { label: 'Board', value: 'board', disabled: enemy.durability > enemy.maxDurability * 0.5 },
                { label: 'Flee', value: 'flee' },
              ]}
              onSelect={(v) => {
                if (v === 'attack') attackEnemy();
                else if (v === 'board') boardEnemy();
                else fleeFromCombat();
              }}
              onCancel={() => {}}
            />
          )}

          {phase === 'boarding' && (
            <BuildingMenu
              options={[
                { label: 'Board!', value: 'board' },
                { label: 'Retreat', value: 'flee' },
              ]}
              onSelect={(v) => {
                if (v === 'board') boardEnemy();
                else fleeFromCombat();
              }}
              onCancel={() => {}}
            />
          )}

          {isOver && (
            <BuildingMenu
              options={[{ label: 'Continue', value: 'ok' }]}
              onSelect={() => dismissCombat()}
              onCancel={() => dismissCombat()}
            />
          )}
        </div>
      </div>
    </div>
  );
}
