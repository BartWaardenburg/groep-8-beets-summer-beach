"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import {
  CalendarBlank,
  Clock,
  MapPin,
  PaperPlaneTilt,
} from "@phosphor-icons/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Constants ───────────────────────────────────────────────

const PARTY_DATE = new Date("2026-07-11T14:00:00");

const CONFETTI_COLORS = [
  "#FF6B6B",
  "#FFD93D",
  "#06D6A0",
  "#00B4D8",
  "#FF8C42",
  "#C77DFF",
];

// ─── Hooks ───────────────────────────────────────────────────

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

// ─── Small components ────────────────────────────────────────

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

// ─── Isometric Island SVG ────────────────────────────────────

const IslandScene = () => (
  <svg
    viewBox="0 0 800 520"
    preserveAspectRatio="xMidYMid meet"
    className="w-full h-full"
  >
    <defs>
      <linearGradient id="waterTop" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#8EDDD0" />
        <stop offset="100%" stopColor="#6CC4B4" />
      </linearGradient>
      <linearGradient id="sandTop" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFECD2" />
        <stop offset="100%" stopColor="#FFD9A8" />
      </linearGradient>
      <linearGradient id="trunk1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#C49A5C" />
        <stop offset="100%" stopColor="#8B6914" />
      </linearGradient>
      <linearGradient id="trunk2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#B8905A" />
        <stop offset="100%" stopColor="#7A5C12" />
      </linearGradient>
    </defs>

    {/* ===== WATER PLATFORM ===== */}
    <g className="el-water">
      {/* Top surface */}
      <path
        d="M400,105 L650,230 L400,355 L150,230 Z"
        fill="url(#waterTop)"
      />
      {/* Ripple highlights */}
      <line
        x1="230"
        y1="210"
        x2="310"
        y2="250"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{ animation: "shimmer 3s ease-in-out infinite" }}
      />
      <line
        x1="500"
        y1="190"
        x2="570"
        y2="225"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
        strokeLinecap="round"
        style={{
          animation: "shimmer 4s ease-in-out 1s infinite",
        }}
      />
      <line
        x1="350"
        y1="300"
        x2="430"
        y2="340"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1"
        strokeLinecap="round"
        style={{
          animation: "shimmer 3.5s ease-in-out 0.5s infinite",
        }}
      />
      {/* Right side */}
      <path d="M650,230 L400,355 L400,390 L650,265 Z" fill="#5AB8A5" />
      {/* Left side */}
      <path d="M150,230 L400,355 L400,390 L150,265 Z" fill="#4AAA96" />
    </g>

    {/* ===== ISLAND SAND ===== */}
    <g className="el-island">
      {/* Beach / shallow water ring */}
      <path
        d="M400,145 L560,230 L400,315 L240,230 Z"
        fill="#A8E6CF"
        opacity="0.5"
      />
      {/* Sand surface */}
      <path
        d="M400,155 L540,225 L400,295 L260,225 Z"
        fill="url(#sandTop)"
      />
      {/* Sand right side */}
      <path d="M540,225 L400,295 L400,308 L540,238 Z" fill="#F0C880" />
      {/* Sand left side */}
      <path d="M260,225 L400,295 L400,308 L260,238 Z" fill="#E0B870" />
      {/* Sand texture dots */}
      <circle cx="380" cy="230" r="1.5" fill="#E6C078" opacity="0.5" />
      <circle cx="420" cy="245" r="1" fill="#E6C078" opacity="0.4" />
      <circle cx="350" cy="250" r="1.2" fill="#E6C078" opacity="0.45" />
      {/* Small grass patches */}
      <ellipse cx="290" cy="225" rx="8" ry="4" fill="#81C784" opacity="0.6" />
      <ellipse cx="310" cy="218" rx="6" ry="3" fill="#66BB6A" opacity="0.5" />
      <ellipse cx="500" cy="230" rx="7" ry="3.5" fill="#81C784" opacity="0.5" />
    </g>

    {/* ===== PALM TREE 1 (back-left) ===== */}
    <g
      className="el-palm1"
      style={{
        transformOrigin: "320px 220px",
        transformBox: "view-box" as React.CSSProperties["transformBox"],
        animation: "palm-sway 5s ease-in-out infinite",
      }}
    >
      {/* Trunk */}
      <path
        d="M320,220 C318,200 322,180 318,155 C316,140 320,120 318,105"
        stroke="url(#trunk1)"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      {/* Trunk lines */}
      {[145, 160, 175, 190, 205].map((y) => (
        <line
          key={y}
          x1="314"
          y1={y}
          x2="324"
          y2={y}
          stroke="#7A5C12"
          strokeWidth="0.8"
          opacity="0.3"
        />
      ))}
      {/* Coconuts */}
      <circle cx="316" cy="108" r="4.5" fill="#8B6914" />
      <circle cx="323" cy="110" r="4" fill="#7A5C12" />
      {/* Fronds */}
      <path
        d="M318,105 C295,98 270,108 252,128"
        stroke="#2D6A4F"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M318,105 C295,98 270,108 252,128 C272,106 296,97 318,105"
        fill="#40916C"
        opacity="0.85"
      />
      <path
        d="M318,105 C296,88 274,75 255,68"
        stroke="#2D6A4F"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M318,105 C296,88 274,75 255,68 C276,73 298,86 318,105"
        fill="#52B788"
        opacity="0.75"
      />
      <path
        d="M318,105 C316,78 318,55 320,35"
        stroke="#40916C"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M318,105 C316,78 318,55 320,35 C322,57 320,80 318,105"
        fill="#66BB6A"
        opacity="0.65"
      />
      <path
        d="M318,105 C340,88 358,80 375,78"
        stroke="#2D6A4F"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M318,105 C340,88 358,80 375,78 C356,82 338,90 318,105"
        fill="#52B788"
        opacity="0.75"
      />
      <path
        d="M318,105 C338,100 358,108 372,120"
        stroke="#2D6A4F"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M318,105 C338,100 358,108 372,120 C356,106 336,100 318,105"
        fill="#40916C"
        opacity="0.85"
      />
      {/* Shadow on ground */}
      <ellipse
        cx="350"
        cy="228"
        rx="25"
        ry="8"
        fill="rgba(0,0,0,0.06)"
      />
    </g>

    {/* ===== PALM TREE 2 (back-right, smaller) ===== */}
    <g
      className="el-palm2"
      style={{
        transformOrigin: "485px 218px",
        transformBox: "view-box" as React.CSSProperties["transformBox"],
        animation: "palm-sway 7s ease-in-out 1s infinite",
      }}
    >
      <path
        d="M485,218 C483,200 487,182 484,162 C482,148 486,132 484,118"
        stroke="url(#trunk2)"
        strokeWidth="6.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="482" cy="121" r="3.8" fill="#8B6914" />
      <circle cx="488" cy="123" r="3.2" fill="#7A5C12" />
      {/* Fronds */}
      <path
        d="M484,118 C465,112 448,120 435,135 C450,118 467,112 484,118"
        fill="#40916C"
        opacity="0.8"
      />
      <path
        d="M484,118 C468,102 452,92 440,86 C454,90 470,100 484,118"
        fill="#52B788"
        opacity="0.7"
      />
      <path
        d="M484,118 C483,95 485,75 487,58 C489,77 487,97 484,118"
        fill="#66BB6A"
        opacity="0.6"
      />
      <path
        d="M484,118 C502,105 518,100 530,98 C516,102 500,108 484,118"
        fill="#52B788"
        opacity="0.7"
      />
      <path
        d="M484,118 C500,115 515,120 525,130 C513,118 498,114 484,118"
        fill="#40916C"
        opacity="0.8"
      />
      <ellipse
        cx="508"
        cy="224"
        rx="18"
        ry="6"
        fill="rgba(0,0,0,0.05)"
      />
    </g>

    {/* ===== BEACH UMBRELLA ===== */}
    <g className="el-umbrella">
      {/* Shadow */}
      <ellipse
        cx="415"
        cy="260"
        rx="28"
        ry="10"
        fill="rgba(0,0,0,0.06)"
      />
      {/* Pole */}
      <line
        x1="400"
        y1="255"
        x2="400"
        y2="178"
        stroke="#C49A5C"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Canopy */}
      <ellipse cx="400" cy="178" rx="38" ry="14" fill="#FF6B6B" />
      {/* Canopy stripes */}
      <path
        d="M362,178 A38,14 0 0 1 400,164"
        fill="#FF8A8A"
        opacity="0.8"
      />
      <path
        d="M400,164 A38,14 0 0 1 438,178"
        fill="#FF5252"
        opacity="0.6"
      />
      {/* Tip */}
      <circle cx="400" cy="175" r="2.5" fill="#FFD700" />
    </g>

    {/* ===== LOUNGE CHAIR + PERSON ===== */}
    <g className="el-lounge">
      {/* Chair shadow */}
      <ellipse
        cx="420"
        cy="252"
        rx="22"
        ry="7"
        fill="rgba(0,0,0,0.05)"
      />
      {/* Chair base (isometric) */}
      <path d="M390,248 L418,234 L440,244 L412,258 Z" fill="#5DADE2" />
      {/* Chair back */}
      <path
        d="M390,248 L390,240 L403,233 L418,234 L418,234"
        fill="#4A9BD9"
      />
      {/* Towel on chair */}
      <path
        d="M392,247 L416,235 L438,245 L414,257 Z"
        fill="#FFB7B2"
        opacity="0.7"
      />
      {/* Person - head */}
      <circle cx="410" cy="226" r="6.5" fill="#FFDAB9" />
      {/* Person - hair */}
      <path
        d="M404,224 C404,220 408,218 412,218 C416,218 418,221 416,224"
        fill="#8B5E3C"
      />
      {/* Person - body */}
      <path
        d="M405,232 L415,232 L417,244 L403,244 Z"
        fill="#FF6B6B"
        opacity="0.8"
      />
      {/* Person - arm */}
      <line
        x1="405"
        y1="236"
        x2="398"
        y2="240"
        stroke="#FFDAB9"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </g>

    {/* ===== SURFBOARD ===== */}
    <g className="el-surf">
      <path
        d="M332,218 Q335,168 338,218"
        fill="#FFD93D"
        stroke="#F0C030"
        strokeWidth="0.8"
      />
      <line
        x1="333"
        y1="200"
        x2="337"
        y2="200"
        stroke="#FF6B6B"
        strokeWidth="1.5"
      />
      <line
        x1="333.5"
        y1="190"
        x2="336.5"
        y2="190"
        stroke="#00B4D8"
        strokeWidth="1.5"
      />
    </g>

    {/* ===== BEACH TOWEL ===== */}
    <g className="el-towel">
      <path
        d="M355,262 L378,249 L398,259 L375,272 Z"
        fill="#C77DFF"
        opacity="0.75"
      />
      <line
        x1="362"
        y1="260"
        x2="383"
        y2="248"
        stroke="#A855F7"
        strokeWidth="0.8"
        opacity="0.4"
      />
      <line
        x1="365"
        y1="263"
        x2="386"
        y2="251"
        stroke="#A855F7"
        strokeWidth="0.8"
        opacity="0.3"
      />
    </g>

    {/* ===== BEACH BALL ===== */}
    <g className="el-ball">
      <circle cx="445" cy="265" r="10" fill="#FFD93D" />
      <path d="M435,265 A10,10 0 0 1 445,255" fill="#FF6B6B" />
      <path d="M445,255 A10,10 0 0 1 455,265" fill="#00B4D8" />
      <path d="M455,265 A10,10 0 0 1 445,275" fill="#FF6B6B" />
      <circle cx="442" cy="262" r="3" fill="white" opacity="0.35" />
    </g>

    {/* ===== FLOAT RING (in the water) ===== */}
    <g
      className="el-float"
      style={{ animation: "float 4s ease-in-out 0.5s infinite" }}
    >
      <ellipse
        cx="570"
        cy="270"
        rx="18"
        ry="9"
        fill="none"
        stroke="#FF6B6B"
        strokeWidth="6"
      />
      <ellipse
        cx="570"
        cy="270"
        rx="18"
        ry="9"
        fill="none"
        stroke="#FFD93D"
        strokeWidth="6"
        strokeDasharray="14 14"
      />
    </g>

    {/* ===== DRINK ===== */}
    <g className="el-drink">
      <rect
        x="375"
        y="265"
        width="6"
        height="10"
        rx="1.5"
        fill="#FF9FF3"
        opacity="0.9"
      />
      <rect
        x="375"
        y="265"
        width="6"
        height="3"
        rx="1"
        fill="#FFB7D5"
        opacity="0.6"
      />
      {/* Straw */}
      <line
        x1="380"
        y1="265"
        x2="384"
        y2="258"
        stroke="#4CAF50"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Umbrella decoration */}
      <path
        d="M384,258 L388,255 L384,256"
        fill="#FF6B6B"
        stroke="#FF6B6B"
        strokeWidth="0.5"
      />
    </g>

    {/* ===== SMALL FISH (in water) ===== */}
    <g className="el-fish">
      <ellipse cx="220" cy="260" rx="7" ry="3.5" fill="#FFB74D" opacity="0.6" />
      <path
        d="M213,260 L208,256 L208,264 Z"
        fill="#FFB74D"
        opacity="0.6"
      />
      <circle cx="225" cy="259" r="1" fill="#5D4037" opacity="0.5" />
    </g>
  </svg>
);

// ─── Main Component ──────────────────────────────────────────

export const SummerBeach = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { d, h, m, s } = useCountdown(PARTY_DATE);

  // Scroll-driven island build animation
  useGSAP(
    () => {
      if (!sceneRef.current) return;

      const elGroups = [
        ".el-island",
        ".el-palm1",
        ".el-palm2",
        ".el-umbrella",
        ".el-lounge",
        ".el-surf",
        ".el-towel",
        ".el-ball",
        ".el-float",
        ".el-drink",
        ".el-fish",
      ];

      // Initial states
      gsap.set(".el-water", { opacity: 0, scale: 0.85, transformOrigin: "center center" });
      elGroups.forEach((el) => gsap.set(el, { opacity: 0 }));
      gsap.set(".info-reveal", { opacity: 0, y: 25 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sceneRef.current,
          pin: true,
          start: "top top",
          end: "+=4000",
          scrub: 0.6,
        },
      });

      // Water platform rises in
      tl.to(".el-water", { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" }, 0);

      // Island emerges
      tl.fromTo(
        ".el-island",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" },
        0.8,
      );

      // Palm trees grow
      tl.fromTo(
        ".el-palm1",
        { opacity: 0, scaleY: 0, svgOrigin: "318 220" },
        { opacity: 1, scaleY: 1, duration: 1.2, ease: "back.out(1.5)" },
        2,
      );
      tl.fromTo(
        ".el-palm2",
        { opacity: 0, scaleY: 0, svgOrigin: "484 218" },
        { opacity: 1, scaleY: 1, duration: 1.2, ease: "back.out(1.5)" },
        2.6,
      );

      // Umbrella pops up
      tl.fromTo(
        ".el-umbrella",
        { opacity: 0, scale: 0, svgOrigin: "400 255" },
        { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(3)" },
        3.8,
      );

      // Lounge + person
      tl.fromTo(
        ".el-lounge",
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
        4.4,
      );

      // Beach items
      tl.fromTo(
        ".el-surf",
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        5,
      );
      tl.fromTo(
        ".el-towel",
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        5.3,
      );
      tl.fromTo(
        ".el-ball",
        { opacity: 0, scale: 0, svgOrigin: "445 265" },
        { opacity: 1, scale: 1, duration: 0.6, ease: "elastic.out(1,0.5)" },
        5.8,
      );
      tl.fromTo(
        ".el-float",
        { opacity: 0, scale: 0, svgOrigin: "570 270" },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(2)" },
        6.2,
      );
      tl.fromTo(
        ".el-drink",
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        6.6,
      );
      tl.fromTo(
        ".el-fish",
        { opacity: 0, x: -15 },
        { opacity: 1, x: 0, duration: 0.5 },
        6.8,
      );

      // Info text
      tl.to(".info-reveal", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
      }, 7.5);
    },
    { scope: sceneRef },
  );

  const handleSubmit = () => {
    if (!name.trim()) return;
    setSubmitted(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3500);
  };

  const countdown = [
    { value: d, label: "Dagen" },
    { value: h, label: "Uren" },
    { value: m, label: "Min" },
    { value: s, label: "Sec" },
  ];

  return (
    <main className="relative">
      {showConfetti && <Confetti />}

      {/* ===== Dreamy background (fixed) ===== */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(145deg, #D4EDDA 0%, #C8E6C9 20%, #B2DFDB 45%, #E0F2F1 65%, #F3E5F5 85%, #FCE4EC 100%)",
          }}
        />
        <div className="absolute top-[8%] -left-32 w-[500px] h-[500px] rounded-full bg-pink-200/25 blur-[120px]" />
        <div className="absolute bottom-[5%] right-[2%] w-[550px] h-[550px] rounded-full bg-teal-200/25 blur-[130px]" />
        <div className="absolute top-[35%] left-[25%] w-[400px] h-[400px] rounded-full bg-green-200/20 blur-[100px]" />
        <div className="absolute top-[12%] right-[18%] w-[300px] h-[300px] rounded-full bg-amber-200/15 blur-[90px]" />
      </div>

      {/* ===== Pinned scroll scene ===== */}
      <section
        ref={sceneRef}
        className="relative h-screen w-full overflow-hidden"
      >
        {/* Full-canvas island animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <IslandScene />
        </div>

        {/* Title overlay */}
        <motion.div
          className="absolute top-8 md:top-12 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none"
            style={{ fontFamily: "var(--font-fredoka)", color: "#2D6A4F" }}
          >
            Summer Beach
          </h1>
          <div className="flex items-center justify-center gap-3 mt-2">
            <div className="h-px w-8 bg-[#2D6A4F]/25" />
            <p
              className="text-sm md:text-base tracking-[0.3em] uppercase text-[#2D6A4F]/50"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Groep 8 &middot; Eindfeest
            </p>
            <div className="h-px w-8 bg-[#2D6A4F]/25" />
          </div>
        </motion.div>

        {/* Info pills overlay */}
        <div className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 z-10 w-full px-4">
          {[
            { Icon: CalendarBlank, text: "11 juli 2026" },
            { Icon: MapPin, text: "Het Strand, Den Haag" },
            { Icon: Clock, text: "14:00 \u2013 18:00" },
          ].map(({ Icon, text }) => (
            <div
              key={text}
              className="info-reveal flex items-center gap-2 bg-white/40 backdrop-blur-sm rounded-full px-5 py-2.5 border border-white/50"
            >
              <Icon size={20} weight="duotone" className="text-[#2D6A4F]" />
              <span
                className="text-sm md:text-base font-medium text-[#2D6A4F]/80"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {text}
              </span>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span
            className="text-[#2D6A4F]/35 text-[10px] tracking-[0.35em] uppercase"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Scroll
          </span>
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 text-[#2D6A4F]/35"
            style={{ animation: "bounce-gentle 2s ease-in-out infinite" }}
          >
            <path
              d="M12 5v10m0 0l-3-3m3 3l3-3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </motion.div>
      </section>

      {/* ===== Countdown ===== */}
      <section className="relative py-20 md:py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            className="text-4xl md:text-6xl font-bold mb-3"
            style={{ fontFamily: "var(--font-fredoka)", color: "#2D6A4F" }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            Nog even wachten...
          </motion.h2>
          <motion.p
            className="text-base md:text-lg text-[#2D6A4F]/50 mb-10"
            style={{ fontFamily: "var(--font-dm-sans)" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Het aftellen is begonnen!
          </motion.p>

          <div className="flex justify-center gap-3 md:gap-5">
            {countdown.map(({ value, label }, i) => (
              <motion.div
                key={label}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div
                  className="relative w-[68px] h-[68px] md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-2xl md:text-5xl font-bold text-white overflow-hidden"
                  style={{
                    fontFamily: "var(--font-fredoka)",
                    background: "linear-gradient(135deg, #66BB6A 0%, #26A69A 100%)",
                    boxShadow:
                      "0 6px 24px rgba(102,187,106,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10 rounded-t-2xl" />
                  <span className="relative z-10">
                    {String(value).padStart(2, "0")}
                  </span>
                </div>
                <span
                  className="mt-1.5 text-[10px] md:text-xs font-semibold uppercase tracking-widest text-[#2D6A4F]/50"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RSVP ===== */}
      <section className="relative py-20 md:py-28 px-6 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto text-center">
          {!submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2
                className="text-4xl md:text-6xl font-bold mb-2"
                style={{
                  fontFamily: "var(--font-fredoka)",
                  color: "#2D6A4F",
                }}
              >
                Kom jij ook?
              </h2>
              <p
                className="text-[#2D6A4F]/50 text-base mb-8"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Laat even weten of je erbij bent!
              </p>

              <div className="bg-white/50 backdrop-blur-xl rounded-[1.75rem] border border-white/50 p-7 shadow-lg">
                <input
                  type="text"
                  placeholder="Jouw naam..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full px-5 py-3.5 text-lg rounded-xl border-2 border-[#C8E6C9] bg-white/70 focus:border-[#66BB6A] focus:outline-none transition-colors text-[#2D6A4F] placeholder:text-[#2D6A4F]/30"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                />
                <motion.button
                  className="w-full mt-4 py-3.5 text-xl font-bold text-white rounded-xl cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    fontFamily: "var(--font-fredoka)",
                    background:
                      "linear-gradient(135deg, #66BB6A 0%, #26A69A 100%)",
                    boxShadow: "0 4px 20px rgba(102,187,106,0.35)",
                  }}
                  whileHover={name.trim() ? { scale: 1.02 } : {}}
                  whileTap={name.trim() ? { scale: 0.98 } : {}}
                  onClick={handleSubmit}
                  disabled={!name.trim()}
                >
                  <span>JA, IK KOM!</span>
                  <PaperPlaneTilt size={22} weight="fill" />
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring", damping: 15 }}
            >
              <h2
                className="text-5xl md:text-7xl font-bold mb-3"
                style={{
                  fontFamily: "var(--font-fredoka)",
                  color: "#2D6A4F",
                }}
              >
                Yeahhh!
              </h2>
              <p
                className="text-xl text-[#2D6A4F]/70"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                <strong>{name}</strong>, we zien je daar!
              </p>
              <p
                className="text-sm text-[#2D6A4F]/40 mt-2"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                11 juli 2026 &bull; 14:00 uur
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="relative py-8 text-center">
        <p
          className="text-[#2D6A4F]/25 text-xs tracking-wider"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Groep 8 &bull; Summer Beach Party 2026
        </p>
      </footer>
    </main>
  );
};
