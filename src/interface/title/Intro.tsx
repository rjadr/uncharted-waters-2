/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useEffect, useRef, useState } from 'react';

import { audioState } from '../sound/audioState';

import introKoei from './assets/intro-koei.png';
import introHarborA from './assets/intro-harbor-a.png';
import introHarborB from './assets/intro-harbor-b.png';
import introTitle from './assets/intro-title.png';
import themeOfJoao from '../sound/assets/theme-of-joão.ogg';

/*
  Opening sequence reconstructed from the original DOS intro (OPGRAPH.LZW).
  The original plays a longer vector-composited cinematic; until that format
  is fully decoded, this shows its key frames: the KOEI logo, the harbor
  scene (two alternating animation frames) and the title card.
 */

interface Scene {
  image: string;
  duration: number;
  width: number;
}

const scenes: Scene[] = [
  { image: introKoei, duration: 3000, width: 416 },
  { image: introHarborA, duration: 7000, width: 1280 },
  { image: introTitle, duration: 5000, width: 800 },
];

const HARBOR_SCENE = 1;
const HARBOR_FRAME_INTERVAL = 700;

interface Props {
  onDone: () => void;
}

export default function Intro({ onDone }: Props) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [harborFrameB, setHarborFrameB] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(themeOfJoao);
    audio.volume = audioState.muted ? 0 : audioState.volume;
    // browsers may block autoplay until the first user gesture
    audio.play().catch(() => {});
    audioRef.current = audio;

    return () => {
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (sceneIndex >= scenes.length - 1) {
      const timeout = setTimeout(onDone, scenes[scenes.length - 1].duration);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(
      () => setSceneIndex(sceneIndex + 1),
      scenes[sceneIndex].duration,
    );
    return () => clearTimeout(timeout);
  }, [sceneIndex]);

  useEffect(() => {
    if (sceneIndex !== HARBOR_SCENE) {
      return undefined;
    }

    const interval = setInterval(
      () => setHarborFrameB((b) => !b),
      HARBOR_FRAME_INTERVAL,
    );
    return () => clearInterval(interval);
  }, [sceneIndex]);

  useEffect(() => {
    const skip = () => onDone();
    window.addEventListener('keydown', skip);
    return () => window.removeEventListener('keydown', skip);
  }, []);

  const scene = scenes[sceneIndex];
  const image =
    sceneIndex === HARBOR_SCENE && harborFrameB ? introHarborB : scene.image;

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black cursor-pointer"
      onClick={onDone}
    >
      <img
        key={sceneIndex}
        src={image}
        alt=""
        className="fade-in"
        style={{ width: scene.width, imageRendering: 'pixelated' }}
      />
      <div
        className="absolute bottom-6 w-full text-center text-base"
        style={{ color: 'rgba(255,255,255,0.4)' }}
      >
        Click or press any key to skip
      </div>
    </div>
  );
}
