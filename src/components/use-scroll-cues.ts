"use client";

import { useCallback, useEffect, useRef } from "react";

export type Cue = {
  /** Video time (seconds) at which this one-shot fires while scrubbing down. */
  atS: number;
  /** Public path to the clip audio. */
  src: string;
  /** Peak volume for this cue (0..1). */
  volume?: number;
};

export type ScrollCues = {
  /** Assigns the <audio> element for cue index `i`. */
  setRef: (i: number) => (el: HTMLAudioElement | null) => void;
  /** Prime/unlock playback from inside a user-gesture handler. Fires start cues. */
  unlock: () => void;
  /** Drive the one-shots from the scrubbed video time (seconds). */
  update: (videoSeconds: number) => void;
  /** Master mute for the whole SFX layer. */
  setMuted: (muted: boolean) => void;
};

// Re-arm a cue only once the scrub is comfortably back above its trigger, so
// jitter right on the threshold can't machine-gun the same clip.
const REARM_S = 2;

/**
 * Fires looping-video clip audio as one-shots at scroll-scrubbed video times.
 * Each cue plays once at real-time 1x (never scrubbed, which would sound like
 * mush) when the scrub crosses its `atS` going down, and re-arms when the user
 * scrolls back up past it. Decoupled from the music bed; layers on top of it.
 */
export const useScrollCues = (cues: readonly Cue[]): ScrollCues => {
  const refs = useRef<(HTMLAudioElement | null)[]>([]);
  const firedRef = useRef<boolean[]>(cues.map(() => false));
  const mutedRef = useRef(false);
  const readyRef = useRef(false);

  const play = useCallback(
    (i: number): void => {
      const el = refs.current[i];
      if (!el) return;
      el.currentTime = 0;
      el.volume = mutedRef.current ? 0 : (cues[i]?.volume ?? 0.85);
      void el.play().catch(() => {});
    },
    [cues],
  );

  const unlock = useCallback((): void => {
    if (readyRef.current) return;
    readyRef.current = true;
    cues.forEach((cue, i) => {
      if (cue.atS <= 0) {
        // Start cue: play it now (we're inside the unlocking gesture).
        firedRef.current[i] = true;
        play(i);
        return;
      }
      // Later cues: prime muted so a programmatic play() works without a gesture.
      const el = refs.current[i];
      if (!el) return;
      const restore = el.volume;
      el.volume = 0;
      void el
        .play()
        .then(() => {
          el.pause();
          el.currentTime = 0;
          el.volume = restore;
        })
        .catch(() => {});
    });
  }, [cues, play]);

  const update = useCallback(
    (videoSeconds: number): void => {
      cues.forEach((cue, i) => {
        const fired = firedRef.current[i];
        if (!fired && videoSeconds >= cue.atS) {
          firedRef.current[i] = true;
          play(i);
        } else if (fired && videoSeconds < cue.atS - REARM_S) {
          firedRef.current[i] = false;
          const el = refs.current[i];
          if (el && !el.paused) {
            el.pause();
            el.currentTime = 0;
          }
        }
      });
    },
    [cues, play],
  );

  const setMuted = useCallback((muted: boolean): void => {
    mutedRef.current = muted;
    if (!muted) return;
    // Hard-silence anything currently sounding; played-from-mute stays muted.
    for (const el of refs.current) {
      if (el) el.volume = 0;
    }
  }, []);

  const setRef = useCallback(
    (i: number) =>
      (el: HTMLAudioElement | null): void => {
        refs.current[i] = el;
      },
    [],
  );

  useEffect(
    () => (): void => {
      for (const el of refs.current) el?.pause();
    },
    [],
  );

  return { setRef, unlock, update, setMuted } satisfies ScrollCues;
};
