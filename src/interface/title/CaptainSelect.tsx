import React, { useState } from 'react';

import MessageBox from '../common/MessageBox';
import { captainData, type CaptainConfig } from '../../data/captainData';
import { clearSave } from '../../state/actionsPort';
import { startNewGame } from '../../state/actionsTitle';
import Assets from '../../assets';

const captainIds = Object.keys(captainData);

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
}

function StatBar({ label, value, max = 200 }: StatBarProps) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-2 text-xl mb-1">
      <span className="w-28" style={{ color: '#7a3800' }}>{label}</span>
      <div className="flex-1 h-3 relative" style={{ background: '#c8a87a', border: '1px solid #7a3800' }}>
        <div
          className="h-full"
          style={{ width: `${pct}%`, background: '#d34100' }}
        />
      </div>
      <span className="w-8 text-right" style={{ color: '#3a1800' }}>{value}</span>
    </div>
  );
}

const portNames: Record<string, string> = {
  '1': 'Lisbon', '2': 'Seville', '3': 'Istanbul',
  '9': 'Genoa', '30': 'London', '36': 'Hamburg',
};

export default function CaptainSelect() {
  const [selectedId, setSelectedId] = useState<string>('1');
  const [confirming, setConfirming] = useState(false);

  const captain: CaptainConfig = captainData[selectedId];

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center z-50"
      style={{ background: '#1a0e06' }}
    >
      {/* Title */}
      <div
        className="text-5xl mb-8 tracking-wide"
        style={{ color: '#f3a200', fontFamily: 'serif', textShadow: '2px 2px 4px #000' }}
      >
        Uncharted Waters: New Horizons
      </div>

      <div className="flex gap-6 w-[1100px]">
        {/* Captain list */}
        <MessageBox>
          <div className="px-4 py-3 w-[260px]">
            <div className="text-2xl text-center mb-3 pb-2" style={{ color: '#7a3800', borderBottom: '1px solid #d34100' }}>
              Choose Captain
            </div>
            {captainIds.map((id) => {
              const c = captainData[id];
              const isSelected = id === selectedId;
              return (
                <div
                  key={id}
                  className="flex items-center gap-2 py-1 px-2 cursor-pointer"
                  style={{
                    background: isSelected ? '#d34100' : 'transparent',
                    color: isSelected ? '#f3e3d3' : '#3a1800',
                  }}
                  onClick={() => { setSelectedId(id); setConfirming(false); }}
                >
                  <img
                    src={Assets.characters(c.sailorId)}
                    style={{ width: 32, height: 40, imageRendering: 'pixelated' }}
                    alt=""
                  />
                  <span className="text-2xl">{c.firstName} {c.lastName}</span>
                </div>
              );
            })}
          </div>
        </MessageBox>

        {/* Captain details */}
        <div className="flex-1 flex flex-col gap-4">
          <MessageBox>
            <div className="px-4 py-3 flex gap-4">
              <img
                src={Assets.characters(captain.sailorId)}
                style={{ width: 64, height: 80, imageRendering: 'pixelated', flexShrink: 0 }}
                alt=""
              />
              <div>
                <div className="text-3xl mb-1" style={{ color: '#3a1800' }}>
                  {captain.firstName} {captain.lastName}
                </div>
                <div className="text-xl mb-1" style={{ color: '#7a3800' }}>{captain.nationality}</div>
                <div className="text-xl mb-3" style={{ color: '#d34100' }}>{captain.goal}</div>
                <div className="text-xl" style={{ color: '#604030' }}>
                  {captain.description}
                </div>
              </div>
            </div>
          </MessageBox>

          <MessageBox>
            <div className="px-4 py-3">
              <div className="text-2xl mb-2 pb-1" style={{ color: '#7a3800', borderBottom: '1px solid #d34100' }}>
                Attributes
              </div>
              <StatBar label="Navigation" value={captain.stats.navigation} />
              <StatBar label="Combat"     value={captain.stats.combat} />
              <StatBar label="Intuition"  value={captain.stats.intuition} />
              <StatBar label="Endurance"  value={captain.stats.endurance} />
              <StatBar label="Rhetoric"   value={captain.stats.rhetoric} />
              <StatBar label="Sword"      value={captain.stats.sword} />
            </div>
          </MessageBox>

          <MessageBox>
            <div className="px-4 py-2 flex justify-between text-2xl" style={{ color: '#3a1800' }}>
              <span>Starting port: <span style={{ color: '#d34100' }}>
                {portNames[captain.startingPortId] ?? captain.startingPortId}
              </span></span>
              <span>Gold: <span style={{ color: '#d34100' }}>{captain.startingGold.toLocaleString()}</span></span>
            </div>
          </MessageBox>

          {/* Action buttons */}
          <div className="flex gap-4 justify-end">
            {!confirming ? (
              <button
                className="px-8 py-3 text-2xl"
                style={{
                  background: '#d34100',
                  color: '#f3e3d3',
                  border: '2px solid #7a3800',
                  cursor: 'pointer',
                }}
                onClick={() => setConfirming(true)}
              >
                Set Sail
              </button>
            ) : (
              <>
                <div className="text-2xl self-center" style={{ color: '#f3e3d3' }}>
                  Start new game as {captain.firstName}?
                </div>
                <button
                  className="px-6 py-3 text-2xl"
                  style={{
                    background: '#d34100',
                    color: '#f3e3d3',
                    border: '2px solid #7a3800',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    clearSave();
                    startNewGame(selectedId);
                  }}
                >
                  Yes
                </button>
                <button
                  className="px-6 py-3 text-2xl"
                  style={{
                    background: '#f3e3d3',
                    color: '#3a1800',
                    border: '2px solid #7a3800',
                    cursor: 'pointer',
                  }}
                  onClick={() => setConfirming(false)}
                >
                  No
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
