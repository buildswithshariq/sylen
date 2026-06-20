"use client";

import { useState } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { CoachContext } from "@/types";
import CoachChat from "@/components/coach/CoachChat";
import { useCoach } from "@/hooks/useCoach";
import SproutIsland, { TreeTier } from "@/components/sprout/SproutIsland";

interface SproutCompanionProps {
  context: CoachContext | null;
}

export default function SproutCompanion({ context }: SproutCompanionProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Initialize coach logic here so history persists as long as Sprout is mounted
  const { messages, isLoading, error, sendMessage, initializeGreeting } =
    useCoach(context);

  const getTier = (): TreeTier => {
    if (!context) return "sapling";
    const score = context.score.score;
    if (score < 40) return "young";
    if (score < 70) return "growing";
    if (score < 90) return "thriving";
    return "champion";
  };

  // Hide on dashboard since the coach is already embedded there directly
  // Actually, wait, the requirements say "Visible on: Landing Page, Assessment Page, Dashboard Page"
  // So it shouldn't be hidden anywhere!
  // Except if the dashboard embeds it, it might be weird to have two.
  // The user said: "Sprout must always function as a real conversational assistant. When the user clicks Sprout: Open a floating chat window immediately."
  // So it shouldn't just scroll. We'll show the chat panel everywhere.

  // If the dashboard already has CoachChat embedded, the floating one might duplicate it.
  // But let's just make it a floating panel everywhere as requested.
  // We'll remove the scroll behavior and just open the chat.

  const handleClick = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      {/* Floating Chat Panel */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="w-[calc(100vw-3rem)] sm:w-[380px] h-[500px] max-h-[calc(100vh-8rem)] rounded-2xl glass-strong shadow-2xl overflow-hidden flex flex-col pointer-events-auto border border-white/40"
          >
            {/* Header */}
            <div className="bg-emerald-600/90 backdrop-blur-md px-4 py-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌱</span>
                <span className="text-white font-medium text-sm">
                  {context ? "Sprout Coach AI" : "Sprout"}
                </span>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                aria-label="Close chat"
                className="text-white/80 hover:text-white transition-colors w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20"
              >
                ✕
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-hidden bg-gradient-to-b from-stone-50/50 to-white/50 backdrop-blur-sm">
              <CoachChat
                messages={messages}
                isLoading={isLoading}
                error={error}
                onSendMessage={sendMessage}
                onInitialize={initializeGreeting}
                context={context}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip on hover */}
      <AnimatePresence>
        {isHovered && !isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="max-w-[280px] p-4 rounded-2xl glass-strong shadow-lg"
          >
            <div>
              <p className="text-sm font-semibold text-stone-800 mb-1">
                {context ? "Welcome back 🌱" : "Hi, I'm Sprout 🌱"}
              </p>
              <p className="text-xs text-stone-600 leading-relaxed mb-3">
                {context ? (
                  <>
                    Sustainability Score:{" "}
                    <strong>{context.score.score}/100</strong>
                    <br />
                    Eco Level: <strong>{context.ecoLevel.current.name}</strong>
                    <span className="block mt-2 text-emerald-700/80 italic text-[11px]">
                      {context.score.score >= 90
                        ? "Your island is fully grown! 🌳"
                        : "Improve your score to grow your island! 🪴"}
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      Your sustainability companion. Click to chat and learn
                      about your carbon footprint!
                    </span>
                    <span className="block mt-2 text-emerald-700/80 italic text-[11px]">
                      Take the assessment to watch Sprout grow! 🌱
                    </span>
                  </>
                )}
              </p>
              <p className="text-[10px] text-emerald-600 font-medium tracking-wide uppercase">
                Click to Chat
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sprout Island Button */}
      <motion.button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex items-center justify-center cursor-pointer pointer-events-auto group outline-none"
        animate={{
          y: isChatOpen ? 0 : [0, -6, 0],
        }}
        transition={{
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
        whileHover={{ y: -10, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Sprout AI Companion"
      >
        {/* Soft glow on hover */}
        <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* The Island SVG component */}
        <SproutIsland tier={getTier()} />
      </motion.button>
    </div>
  );
}
