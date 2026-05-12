"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import {
  Clock,
  Confetti as ConfettiIcon,
  DeviceMobile,
  MapPin,
  SunHorizon,
} from "@phosphor-icons/react";
import { EMOJIS, KIDS, type RsvpMap } from "@/lib/kids";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PARTY_DATE = new Date("2026-07-15T19:00:00");

const CONFETTI_COLORS = ["#FF6B6B", "#FFD93D", "#06D6A0", "#00B4D8", "#FF8C42", "#C77DFF"];

const useCountdown = (target: Date) => {
  const [left, setLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setLeft({
        d: Math.floor(diff / 86_400_000),
        h: Math.floor((diff / 3_600_000) % 24),
        m: Math.floor((diff / 60_000) % 60),
        s: Math.floor((diff / 1_000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, [target]);

  return left;
};

const RotateHint = () => {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const mq = window.matchMedia("(orientation: portrait) and (max-width: 932px)");
    const update = () => setShow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [dismissed]);

  if (!show || dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center gap-8 text-white px-8"
    >
      <motion.div
        animate={{ rotate: [0, -90, -90, 0, 0] }}
        transition={{
          duration: 3.2,
          times: [0, 0.35, 0.55, 0.9, 1],
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <DeviceMobile size={88} weight="duotone" />
      </motion.div>
      <p className="text-xl font-bold text-center" style={{ fontFamily: "var(--font-display)" }}>
        Draai je telefoon
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="text-xs uppercase tracking-widest opacity-50 underline cursor-pointer"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Toch verder
      </button>
    </motion.div>
  );
};

type EmojiPickerProps = {
  selected: string | null;
  onSelect: (emoji: string) => void;
};

const EmojiPicker = ({ selected, onSelect }: EmojiPickerProps) => (
  <div className="grid grid-cols-6 gap-2 mb-6">
    {EMOJIS.map((emoji) => (
      <motion.button
        key={emoji}
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={() => onSelect(emoji)}
        className={`aspect-square rounded-xl flex items-center justify-center text-2xl md:text-3xl transition-all ${
          selected === emoji
            ? "bg-[#3D2817] ring-2 ring-[#E5806A]"
            : "bg-[#F0E2C8] hover:bg-[#E8D6B0]"
        }`}
      >
        {emoji}
      </motion.button>
    ))}
  </div>
);

type SubmitButtonProps = {
  label: string;
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
};

const SubmitButton = ({ label, disabled, loading, onClick }: SubmitButtonProps) => (
  <motion.button
    type="button"
    whileHover={!disabled ? { scale: 1.01 } : {}}
    whileTap={!disabled ? { scale: 0.98 } : {}}
    onClick={onClick}
    disabled={disabled}
    className="w-full py-3.5 text-base font-semibold text-[#FFF8EC] rounded-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-[#3D2817] hover:bg-[#2B1B0E] transition-colors"
    style={{ fontFamily: "var(--font-body)", letterSpacing: "0.02em" }}
  >
    {loading ? "Even geduld..." : label}
  </motion.button>
);

const Confetti = () => (
  <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
    {Array.from({ length: 60 }, (_, i) => (
      <div
        key={i}
        className="absolute top-0 rounded-sm"
        style={{
          left: `${(i * 17 + 3) % 100}%`,
          width: 8 + (i % 4) * 4,
          height: (8 + (i % 4) * 4) * 0.6,
          backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          animation: `confetti-fall ${2 + (i % 5) * 0.4}s linear ${(i * 0.07) % 0.8}s forwards`,
        }}
      />
    ))}
  </div>
);

export const SummerBeach = () => {
  const scrubRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [scrubHeight, setScrubHeight] = useState(7200);
  const [myKid, setMyKid] = useState<string | null>(null);
  const [myCode, setMyCode] = useState<string | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [rsvps, setRsvps] = useState<RsvpMap>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { d, h, m, s } = useCountdown(PARTY_DATE);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) return;
    setMyCode(code);
    fetch(`/api/me?code=${encodeURIComponent(code)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { kid?: string } | null) => {
        if (data?.kid) setMyKid(data.kid);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/rsvps", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { rsvps: RsvpMap };
        setRsvps(data.rsvps ?? {});
      } catch {
        // ignore
      }
    };
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  const myRsvp = myKid ? rsvps[myKid] : null;
  const totalRsvpd = Object.keys(rsvps).length;

  const handleSubmit = async () => {
    if (!myCode || !selectedEmoji || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/rsvps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: myCode, emoji: selectedEmoji }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        rsvps?: RsvpMap;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Er ging iets mis");
      } else if (data.rsvps) {
        setRsvps(data.rsvps);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3500);
      }
    } catch {
      setError("Netwerkfout, probeer opnieuw");
    } finally {
      setSubmitting(false);
    }
  };

  useGSAP(() => {
    const video = videoRef.current;
    const scrub = scrubRef.current;
    if (!video || !scrub) return;

    const setup = () => {
      setScrubHeight(Math.round(video.duration * 120));
      // iOS Safari/Chrome: prime the decoder so currentTime updates render frames.
      // Without this the video stays on the first frame (black) during scrub.
      let primed = false;
      const prime = async () => {
        if (primed) return;
        try {
          await video.play();
          video.pause();
          video.currentTime = 0;
          primed = true;
        } catch {
          // ignore, will retry on first user interaction
        }
      };
      prime();
      const onFirst = () => {
        prime();
      };
      document.addEventListener("touchstart", onFirst, {
        passive: true,
        once: true,
      });
      document.addEventListener("click", onFirst, {
        passive: true,
        once: true,
      });

      gsap.to(video, {
        currentTime: video.duration,
        ease: "none",
        scrollTrigger: {
          trigger: scrub,
          start: "top top",
          end: "bottom top",
          scrub: 0.4,
        },
      });
    };

    if (video.readyState >= 2) setup();
    else video.addEventListener("loadeddata", setup, { once: true });
  });

  const countdown = [
    { value: d, label: "Dagen" },
    { value: h, label: "Uren" },
    { value: m, label: "Min" },
    { value: s, label: "Sec" },
  ];

  return (
    <main className="relative">
      <RotateHint />
      {showConfetti && <Confetti />}

      {/* ===== Fixed video backdrop (scroll-scrubbed, freezes at last frame) ===== */}
      <video
        ref={videoRef}
        src="/beach.mp4"
        muted
        playsInline
        preload="auto"
        className="fixed inset-0 w-full h-full object-cover -z-10 bg-black"
      />

      {/* ===== Subtle vignette for depth ===== */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none -z-[5]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(43,27,14,0.4) 100%)",
        }}
      />

      {/* ===== Scroll spacer that drives the video scrub ===== */}
      <div ref={scrubRef} style={{ height: scrubHeight }} />

      {/* ===== Hold buffer: video frozen on wood, content still below the fold ===== */}
      <div className="h-screen" aria-hidden="true" />

      {/* ===== Content sections, slide in from below once video is done ===== */}
      <div className="relative">
        {/* ===== Hero card: Save the date ===== */}
        <section className="relative pt-20 md:pt-28 pb-10 px-5">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            {/* Top half of card with notches on bottom corners */}
            <div
              className="bg-[#FFF8EC] rounded-t-[28px] text-center"
              style={{
                maskImage:
                  "radial-gradient(circle 22px at 0% 100%, transparent 21px, #000 22px), radial-gradient(circle 22px at 100% 100%, transparent 21px, #000 22px)",
                WebkitMaskImage:
                  "radial-gradient(circle 22px at 0% 100%, transparent 21px, #000 22px), radial-gradient(circle 22px at 100% 100%, transparent 21px, #000 22px)",
                maskComposite: "intersect",
                WebkitMaskComposite: "source-in",
                filter:
                  "drop-shadow(0 20px 50px rgba(0,0,0,0.5)) drop-shadow(0 8px 20px rgba(0,0,0,0.3))",
              }}
            >
              <div className="px-8 md:px-12 pt-10 md:pt-12 pb-10">
                <SunHorizon size={32} weight="duotone" className="mx-auto text-[#E5806A] mb-3" />
                <p
                  className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.36em] text-[#E5806A] mb-6"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Save the date
                </p>
                <p
                  className="text-xs md:text-sm font-semibold uppercase tracking-[0.32em] text-[#7A5C3E] mb-3"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Woensdag
                </p>
                <h1
                  className="text-6xl md:text-8xl tracking-tight text-[#3D2817] leading-none flex items-center justify-center gap-3 md:gap-4"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                >
                  <span>15</span>
                  <span className="text-[#E5806A]">·</span>
                  <span>07</span>
                  <span className="text-[#E5806A]">·</span>
                  <span>26</span>
                </h1>
                <div className="flex items-center justify-center gap-4 mt-7 text-[#7A5C3E]">
                  <span
                    className="flex items-center gap-1.5 text-sm md:text-base"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <MapPin size={16} weight="duotone" />
                    De Conckelaer
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#7A5C3E]/40" />
                  <span
                    className="flex items-center gap-1.5 text-sm md:text-base"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <Clock size={16} weight="duotone" />
                    Vanaf 19:00
                  </span>
                </div>
              </div>
            </div>

            {/* Dotted perforation line directly between halves, stops at notches */}
            <div className="border-t-[4px] border-dotted border-[#3D2817]/50 mx-[22px]" />

            {/* Bottom half of card with notches on top corners */}
            <div
              className="bg-[#FFF8EC] rounded-b-[28px]"
              style={{
                maskImage:
                  "radial-gradient(circle 22px at 0% 0%, transparent 21px, #000 22px), radial-gradient(circle 22px at 100% 0%, transparent 21px, #000 22px)",
                WebkitMaskImage:
                  "radial-gradient(circle 22px at 0% 0%, transparent 21px, #000 22px), radial-gradient(circle 22px at 100% 0%, transparent 21px, #000 22px)",
                maskComposite: "intersect",
                WebkitMaskComposite: "source-in",
                filter:
                  "drop-shadow(0 20px 50px rgba(0,0,0,0.5)) drop-shadow(0 8px 20px rgba(0,0,0,0.3))",
              }}
            >
              <div className="px-6 md:px-10 pt-10 pb-10 md:pb-12">
                <p
                  className="text-center text-[10px] md:text-xs font-semibold uppercase tracking-[0.28em] text-[#7A5C3E] mb-5"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Nog te gaan
                </p>
                <div className="grid grid-cols-4 gap-2 md:gap-4">
                  {countdown.map(({ value, label }, i) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                      className="flex flex-col items-center text-center"
                    >
                      <div
                        className="w-full aspect-square rounded-xl bg-[#F0E2C8] flex items-center justify-center text-3xl md:text-5xl text-[#3D2817]"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 600,
                        }}
                      >
                        {String(value).padStart(2, "0")}
                      </div>
                      <span
                        className="mt-2 text-[9px] md:text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7A5C3E]"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ===== RSVP card ===== */}
        <section className="relative pt-8 pb-24 px-5 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-2xl mx-auto bg-[#FFF8EC] rounded-[28px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] p-8 md:p-12"
          >
            <ConfettiIcon size={32} weight="duotone" className="mx-auto text-[#E5806A] mb-2" />
            <p
              className="text-center text-[10px] md:text-xs font-semibold uppercase tracking-[0.36em] text-[#E5806A] mb-3"
              style={{ fontFamily: "var(--font-body)" }}
            >
              RSVP
            </p>
            <h2
              className="text-3xl md:text-5xl tracking-tight text-center text-[#3D2817] mb-2"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              {myKid ? `Hoi ${myKid}!` : "Kom jij ook?"}
            </h2>

            {myKid ? (
              myRsvp ? (
                <>
                  <p
                    className="text-center text-base text-[#3D2817] mb-7"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Je bent aangemeld met {myRsvp.emoji}. Verander je emoji als je wil:
                  </p>
                  <EmojiPicker
                    selected={selectedEmoji ?? myRsvp.emoji}
                    onSelect={setSelectedEmoji}
                  />
                  <SubmitButton
                    label={
                      selectedEmoji && selectedEmoji !== myRsvp.emoji
                        ? `Verander naar ${selectedEmoji}`
                        : "Aangemeld"
                    }
                    disabled={!selectedEmoji || selectedEmoji === myRsvp.emoji || submitting}
                    onClick={handleSubmit}
                    loading={submitting}
                  />
                </>
              ) : (
                <>
                  <p
                    className="text-center text-sm md:text-base text-[#7A5C3E] mb-7"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Kies een emoji die bij jou past en meld je aan
                  </p>
                  <EmojiPicker selected={selectedEmoji} onSelect={setSelectedEmoji} />
                  <SubmitButton
                    label={`Aanmelden als ${myKid}`}
                    disabled={!selectedEmoji || submitting}
                    onClick={handleSubmit}
                    loading={submitting}
                  />
                </>
              )
            ) : (
              <p
                className="text-center text-sm md:text-base text-[#7A5C3E] mb-8 max-w-sm mx-auto"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Scan jouw eigen QR-code op het kaartje om je aan te melden
              </p>
            )}

            {error && (
              <p
                className="text-center text-sm text-red-600 mt-3"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {error}
              </p>
            )}

            {/* Divider */}
            <div className="my-8 border-t border-dashed border-[#3D2817]/15" />

            {/* Who's coming */}
            <div className="flex items-baseline justify-between mb-4">
              <p
                className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.28em] text-[#7A5C3E]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Wie komen er
              </p>
              <p className="text-xs text-[#7A5C3E]" style={{ fontFamily: "var(--font-body)" }}>
                {totalRsvpd} / {KIDS.length}
              </p>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {KIDS.map((kid) => {
                const rsvp = rsvps[kid];
                const isMe = kid === myKid;
                return (
                  <div
                    key={kid}
                    className={`relative px-2 py-2.5 rounded-lg text-center transition-all ${
                      rsvp ? "bg-[#3D2817] text-[#FFF8EC]" : "bg-[#F0E2C8] text-[#7A5C3E]"
                    } ${isMe ? "ring-2 ring-[#E5806A] ring-offset-2 ring-offset-[#FFF8EC]" : ""}`}
                  >
                    {rsvp && <span className="absolute -top-2 -right-1 text-xl">{rsvp.emoji}</span>}
                    <span
                      className="text-sm font-medium"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {kid}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
};
