"use client";

import { type RefObject, useCallback, useEffect, useRef, useState } from "react";

type Options = {
  /** Video time (seconds) at which the track switches chill -> party. */
  atS: number;
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
  /** Drive the switch from the scrubbed video time (seconds). */
  update: (videoSeconds: number) => void;
  chillRef: RefObject<HTMLAudioElement | null>;
  partyRef: RefObject<HTMLAudioElement | null>;
};

const STORAGE_KEY = "beets-music-muted";
const MUTE_RAMP_MS = 220;
// A quick cut, not a crossfade: the two songs aren't beat-matched, so any real
// overlap turns to mush. Old track ducks out over the first ~55%, new fades in
// over the last ~50%, leaving only a sliver of overlap to mask the seam.
const CUT_MS = 480;
// Don't flip back to chill until a bit before the switch point, so wiggling the
// scroll right on the threshold can't strobe the two tracks.
const HYSTERESIS_S = 1;

const clamp01 = (x: number): number => Math.min(1, Math.max(0, x));

/**
 * Hard-cuts between two looping tracks at a single scroll-scrubbed video time,
 * with a user-toggleable master mute. The cut runs in real time (constant,
 * snappy) regardless of scroll speed, so the up-tempo track drops in cleanly
 * instead of smearing across a long volume crossfade. No Web Audio graph, so it
 * sidesteps the iOS MediaElementSource silence bug.
 */
export const useScrollMusic = ({ atS, maxVolume = 0.6 }: Options): ScrollMusic => {
  const chillRef = useRef<HTMLAudioElement | null>(null);
  const partyRef = useRef<HTMLAudioElement | null>(null);

  const masterRef = useRef(1); // 0 = muted, 1 = full
  const chillVolRef = useRef(1); // per-track gain 0..1 (pre-master)
  const partyVolRef = useRef(0);
  const targetRef = useRef(0); // 0 = chill active, 1 = party active
  const muteRafRef = useRef<number | null>(null);
  const cutRafRef = useRef<number | null>(null);
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
    chill.volume = level * chillVolRef.current;
    party.volume = level * partyVolRef.current;
  }, [maxVolume]);

  const cutTo = useCallback(
    (target: number): void => {
      if (cutRafRef.current !== null) cancelAnimationFrame(cutRafRef.current);
      const incoming = target === 1 ? partyVolRef : chillVolRef;
      const outgoing = target === 1 ? chillVolRef : partyVolRef;
      const fromOut = outgoing.current;
      const fromIn = incoming.current;
      const start = performance.now();
      const step = (now: number): void => {
        const k = clamp01((now - start) / CUT_MS);
        outgoing.current = fromOut * (1 - clamp01(k / 0.55));
        incoming.current = fromIn + (1 - fromIn) * clamp01((k - 0.45) / 0.55);
        apply();
        cutRafRef.current = k < 1 ? requestAnimationFrame(step) : null;
      };
      cutRafRef.current = requestAnimationFrame(step);
    },
    [apply],
  );

  const rampMaster = useCallback(
    (target: number): void => {
      if (muteRafRef.current !== null) cancelAnimationFrame(muteRafRef.current);
      const from = masterRef.current;
      const start = performance.now();
      const step = (now: number): void => {
        const k = clamp01((now - start) / MUTE_RAMP_MS);
        masterRef.current = from + (target - from) * k;
        apply();
        muteRafRef.current = k < 1 ? requestAnimationFrame(step) : null;
      };
      muteRafRef.current = requestAnimationFrame(step);
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
      const current = targetRef.current;
      let next = current;
      if (current === 0 && videoSeconds >= atS) next = 1;
      else if (current === 1 && videoSeconds < atS - HYSTERESIS_S) next = 0;
      if (next !== current) {
        targetRef.current = next;
        cutTo(next);
      }
    },
    [atS, cutTo],
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
      if (muteRafRef.current !== null) cancelAnimationFrame(muteRafRef.current);
      if (cutRafRef.current !== null) cancelAnimationFrame(cutRafRef.current);
    },
    [],
  );

  return { muted, ready, toggle, unlock, update, chillRef, partyRef };
};
