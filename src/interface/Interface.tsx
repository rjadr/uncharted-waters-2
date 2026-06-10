import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import Right from './Right';
import Left from './Left';
import PortInfo from './port/PortInfo';
import Provisions from './world/Provisions';
import Indicators from './world/Indicators';
import Camera from './Camera';
import updateInterface from '../state/updateInterface';
import Building from './port/Building';
import Combat from './combat/Combat';
import Discovery from './world/Discovery';
import CaptainSelect from './title/CaptainSelect';
import Intro from './title/Intro';
import { classNames } from './interfaceUtils';
import useFade from './port/hooks/useFade';
import type { CombatState } from '../state/state';
import type { DiscoveryId } from '../data/discoveryData';
import state from '../state/state';

import './global.css';

type Props = {
  /*
    The state of Interface is updated outside of React. This is made possible
    by assigning setStates to an outside object. Calls to that object’s methods
    are delayed until Interface has mounted.

    Using a shared Redux Store could be a solution, but changes don’t happen
    fast enough.
   */
  resolve: () => void;
};

function Interface({ resolve }: Props) {
  const [portId, setPortId] = useState<string | null>(null);
  const [buildingId, setBuildingId] = useState<string | null>(null);
  const [timePassed, setTimePassed] = useState(0);
  const [gold, setGold] = useState(0);
  const [combat, setCombat] = useState<CombatState | null>(null);
  const [pendingDiscovery, setPendingDiscovery] = useState<DiscoveryId | null>(null);
  const [showTitleScreen, setShowTitleScreen] = useState(!state.gameStarted);
  const [showIntro, setShowIntro] = useState(!state.gameStarted);

  useEffect(() => {
    resolve();
  }, []);

  updateInterface.general = (general) => {
    setPortId(general.portId);
    setBuildingId(general.buildingId);
    setTimePassed(general.timePassed);
    setGold(general.gold);
  };

  updateInterface.combat = setCombat;
  updateInterface.discovery = setPendingDiscovery;
  updateInterface.titleScreen = setShowTitleScreen;

  const { fade, onAnimationEnd } = useFade();

  const inPort = portId !== null;

  return (
    <div className="[image-rendering:pixelated]">
      <div className="flex items-stretch">
        <Left
          portId={portId}
          buildingId={buildingId}
          timePassed={timePassed}
          gold={gold}
        >
          <Provisions hidden={inPort} />
        </Left>
        <div
          className={classNames(
            'w-[1280px] h-[800px] relative select-none',
            fade ? 'fade-out' : '',
          )}
          onAnimationEnd={onAnimationEnd}
          onContextMenu={(e) => e.preventDefault()}
        >
          {buildingId !== null && <Building buildingId={buildingId} />}
          <div className={buildingId ? 'hidden' : ''}>
            <Camera />
          </div>
          {combat !== null && <Combat combat={combat} />}
          {pendingDiscovery !== null && <Discovery discoveryId={pendingDiscovery} />}
          {showTitleScreen && showIntro && (
            <Intro onDone={() => setShowIntro(false)} />
          )}
          {showTitleScreen && !showIntro && <CaptainSelect />}
        </div>
        <Right>
          {inPort && <PortInfo portId={portId} />}
          <Indicators hidden={inPort} />
        </Right>
      </div>
    </div>
  );
}

const renderInterface = () =>
  new Promise<void>((resolve) => {
    const container = document.getElementById('game');
    const root = createRoot(container!);
    root.render(
      <React.StrictMode>
        <Interface resolve={resolve} />
      </React.StrictMode>,
    );
  });

export default renderInterface;
