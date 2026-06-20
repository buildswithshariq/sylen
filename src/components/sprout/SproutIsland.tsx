"use client";

import { m as motion } from "framer-motion";

export type TreeTier =
  | "sapling"
  | "young"
  | "growing"
  | "thriving"
  | "champion";

interface SproutIslandProps {
  tier: TreeTier;
}

export default function SproutIsland({ tier }: Readonly<SproutIslandProps>) {
  // Deterministic particle generation to maintain React component purity
  const particles = Array.from({ length: 8 }).map((_, i) => {
    const r1 = (i * 137.5) % 1;
    const r2 = (i * 93.1) % 1;
    const r3 = (i * 21.3) % 1;

    return {
      id: i,
      x: 20 + r1 * 60,
      y: 40 + r2 * 40,
      scale: 0.5 + r3 * 0.8,
      delay: r1 * 2,
      duration: 2 + r2 * 2,
    };
  });

  // Helper to determine what parts of the tree to show
  const showTrunk = tier !== "sapling";
  let canopyLevel = 4;
  if (tier === "sapling") canopyLevel = 0;
  else if (tier === "young") canopyLevel = 1;
  else if (tier === "growing") canopyLevel = 2;
  else if (tier === "thriving") canopyLevel = 3;

  return (
    <div className="relative w-24 h-28 sm:w-32 sm:h-36 select-none pointer-events-none drop-shadow-xl transition-all duration-300">
      <svg
        aria-hidden="true"
        width="100%"
        height="100%"
        viewBox="0 0 112 128"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="grassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="glassBase" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
          </linearGradient>
          <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#92400E" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
          <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A7F3D0" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <linearGradient id="leafGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="leafGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <filter
            id="championGlow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- ISLAND BASE --- */}
        <g transform="translate(0, 10)">
          {/* Glass Base Depth */}
          <path
            d="M 16 95 C 16 108, 96 108, 96 95 L 96 102 C 96 115, 16 115, 16 102 Z"
            fill="url(#glassBase)"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1"
          />
          {/* Grass Top */}
          <ellipse
            cx="56"
            cy="95"
            rx="40"
            ry="14"
            fill="url(#grassGrad)"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.5"
          />
          {/* Grass details */}
          <path
            d="M 36 92 Q 40 88 44 92"
            stroke="#10B981"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M 76 96 Q 74 92 72 96"
            stroke="#047857"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
        </g>

        {/* --- TREE --- */}
        <motion.g
          style={{ transformOrigin: "56px 105px" }}
          animate={{ rotate: [-1, 1, -1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* SAPLING TIER */}
          {tier === "sapling" && (
            <g>
              <path
                d="M 56 105 Q 54 90 56 80"
                stroke="url(#grassGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <motion.path
                d="M 56 86 Q 48 82 50 76 Q 56 78 56 86 Z"
                fill="url(#leafGrad2)"
                animate={{ rotate: [-5, 5, -5] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ transformOrigin: "56px 86px" }}
              />
              <motion.path
                d="M 56 82 Q 64 78 62 72 Q 56 74 56 82 Z"
                fill="url(#leafGrad1)"
                animate={{ rotate: [5, -5, 5] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ transformOrigin: "56px 82px" }}
              />
            </g>
          )}

          {/* TRUNK for > Sapling */}
          {showTrunk && (
            <path
              d={`M 52 105 C 52 ${90 - canopyLevel * 5}, 54 ${70 - canopyLevel * 5}, 56 ${50 - canopyLevel * 5} C 58 ${70 - canopyLevel * 5}, 60 ${90 - canopyLevel * 5}, 60 105 Z`}
              fill="url(#trunkGrad)"
            />
          )}

          {/* CANOPIES */}
          {/* Level 1: Young Tree */}
          {canopyLevel >= 1 && (
            <motion.circle
              cx="56"
              cy="65"
              r="16"
              fill="url(#leafGrad3)"
              animate={{ scale: [0.98, 1.02, 0.98] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "56px 65px" }}
            />
          )}

          {/* Level 2: Growing Tree */}
          {canopyLevel >= 2 && (
            <g>
              <motion.circle
                cx="46"
                cy="55"
                r="14"
                fill="url(#leafGrad2)"
                animate={{ scale: [1.02, 0.98, 1.02] }}
                transition={{
                  duration: 4.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ transformOrigin: "46px 55px" }}
              />
              <motion.circle
                cx="66"
                cy="55"
                r="14"
                fill="url(#leafGrad1)"
                animate={{ scale: [0.97, 1.03, 0.97] }}
                transition={{
                  duration: 3.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ transformOrigin: "66px 55px" }}
              />
              <motion.circle
                cx="56"
                cy="45"
                r="18"
                fill="url(#leafGrad2)"
                animate={{ scale: [0.99, 1.01, 0.99] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ transformOrigin: "56px 45px" }}
              />
            </g>
          )}

          {/* Level 3: Thriving Tree */}
          {canopyLevel >= 3 && (
            <g>
              <motion.circle cx="38" cy="45" r="14" fill="url(#leafGrad3)" />
              <motion.circle cx="74" cy="45" r="14" fill="url(#leafGrad2)" />
              <motion.circle cx="56" cy="30" r="22" fill="url(#leafGrad1)" />
              <motion.circle cx="48" cy="38" r="16" fill="url(#leafGrad2)" />
              <motion.circle cx="64" cy="38" r="16" fill="url(#leafGrad3)" />
            </g>
          )}

          {/* Level 4: Champion Tree Details */}
          {canopyLevel >= 4 && (
            <g filter="url(#championGlow)">
              <motion.circle cx="32" cy="35" r="16" fill="url(#leafGrad1)" />
              <motion.circle cx="80" cy="35" r="16" fill="url(#leafGrad2)" />
              <motion.circle cx="56" cy="15" r="26" fill="url(#leafGrad1)" />
              <motion.circle cx="44" cy="25" r="20" fill="url(#leafGrad3)" />
              <motion.circle cx="68" cy="25" r="20" fill="url(#leafGrad2)" />
              {/* Extra Sparkles in Canopy */}
              <circle cx="50" cy="15" r="2" fill="#D1FAE5" opacity="0.8" />
              <circle cx="65" cy="20" r="1.5" fill="#D1FAE5" opacity="0.6" />
              <circle cx="40" cy="30" r="2" fill="#D1FAE5" opacity="0.9" />
              <circle cx="75" cy="35" r="1.5" fill="#D1FAE5" opacity="0.7" />
            </g>
          )}
        </motion.g>

        {/* --- CHAMPION PARTICLES --- */}
        {tier === "champion" && (
          <g>
            {particles.map((p) => (
              <motion.circle
                key={p.id}
                cx={p.x}
                cy={p.y}
                r={p.scale * 2}
                fill="#A7F3D0"
                filter="url(#championGlow)"
                initial={{ opacity: 0, y: 0 }}
                animate={{
                  opacity: [0, 0.8, 0],
                  y: -30,
                  x: p.x + (p.id % 2 === 0 ? 10 : -10),
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
