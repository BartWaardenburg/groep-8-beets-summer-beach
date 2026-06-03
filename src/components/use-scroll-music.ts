"use client";

import { type RefObject, useCallback, useEffect, useRef, useState } from "react";

type Options = {
  /** Video time (seconds) where the crossfade starts. */
  startS: number;
  /** Video time (seconds) where the crossfade completes (full party). */
  endS: number;
  /** Peak volume of the active track (0..1). */
  maxVolume?: number;
};

export type ScrollMusic = {
  /** Whether the user has muted the music. */
  muted: boolean;
  /** Whether playback has been unlocked by a user gesture yet. */
  ready: boolean;
  /** Toggle mute. Unlocks playback on the first call (it is a user gesture). */
  toggle: () => void;
  /** Start playback. MUST be called from inside a user-gesture handler. */
  unlock: () => void;
  /** Drive the crossfade from the scrubbed video time (seconds). */
  update: (videoSeconds: number) => void;
  chillRef: RefObject<HTMLAudioElement | null>;
  partyRef: RefObject<HTMLAudioElement | null>;
};

const STORAGE_KEY = "beets-music-muted";
const RAMP_MS = 220;
const HALF_PI = Math.PI / 2;

/** Smoothstep: 0 below edge0, 1 above edge1, eased in between. */
const smoothstep = (edge0: number, edge1: number, x: number): number => {
  if (edge1 <= edge0) return x < edge1 ? 0 : 1;
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

/**
 * Crossfades two looping tracks based on the scroll-scrubbed video time, with a
 * user-toggleable master mute. Equal-power crossfade keeps perceived loudness
 * constant across the transition; no Web Audio graph, so it sidesteps the iOS
 * MediaElementSource silence bug.
 */
export const useScrollMusic = ({ startS, endS, maxVolume = 0.6 }: Options): ScrollMusic => {
  const chillRef = useRef<HTMLAudioElement | null>(null);
  const partyRef = useRef<HTMLAudioElement | null>(null);

  const masterRef = useRef(1); // 0 = muted, 1 = full
  const mixRef = useRef(0); // 0 = all chill, 1 = all party
  const rampRef = useRef<number | null>(null);
  const readyRef = useRef(false);

  const [ready, setReady] = useState(false);
  const [muted, setMuted] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  });

  const apply = useCallback((): void => {
    const chill = chillRef.current;
    const party = partyRef.current;
    if (!chill || !party) return;
    const level = masterRef.current * maxVolume;
    // Equal-power: cos/sin keep chill² + party² constant through the fade.
    chill.volume = level * Math.cos(mixRef.current * HALF_PI);
    party.volume = level * Math.sin(mixRef.current * HALF_PI);
  }, [maxVolume]);

  const rampMaster = useCallback(
    (target: number): void => {
      if (rampRef.current !== null) cancelAnimationFrame(rampRef.current);
      const from = masterRef.current;
      const start = performance.now();
      const step = (now: number): void => {
        const k = Math.min(1, (now - start) / RAMP_MS);
        masterRef.current = from + (target - from) * k;
        apply();
        rampRef.current = k < 1 ? requestAnimationFrame(step) : null;
      };
      rampRef.current = requestAnimationFrame(step);
    },
    [apply],
  );

  const unlock = useCallback((): void => {
    if (readyRef.current) return;
    readyRef.current = true;
    masterRef.current = muted ? 0 : 1;
    apply();
    void chillRef.current?.play().catch(() => {});
    void partyRef.current?.play().catch(() => {});
    setReady(true);
  }, [apply, muted]);

  const update = useCallback(
    (videoSeconds: number): void => {
      mixRef.current = smoothstep(startS, endS, videoSeconds);
      apply();
    },
    [apply, startS, endS],
  );

  const toggle = useCallback((): void => {
    unlock();
    setMuted((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      }
      rampMaster(next ? 0 : 1);
      return next;
    });
  }, [unlock, rampMaster]);

  useEffect(
    () => (): void => {
      if (rampRef.current !== null) cancelAnimationFrame(rampRef.current);
    },
    [],
  );

  return { muted, ready, toggle, unlock, update, chillRef, partyRef };
};
