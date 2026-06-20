"use client";

import { useState, useRef, useEffect } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { CoachMessage, CoachContext } from "@/types";
import PriorityActions from "@/components/dashboard/PriorityActions";
import EmissionBreakdown from "@/components/dashboard/EmissionBreakdown";

interface CoachChatProps {
  messages: CoachMessage[];
  isLoading: boolean;
  error: string | null;
  onSendMessage: (message: string) => void;
  onInitialize: () => void;
  context?: CoachContext | null;
}

const quickActions = [
  {
    label: "🎯 Explain my score",
    message: "Explain my sustainability score and what it means.",
  },
  {
    label: "📈 How can I improve?",
    message: "What are the most impactful things I can do to improve my score?",
  },
  {
    label: "🗺️ Create action plan",
    message:
      "Create a personalized action plan for me to reduce my carbon footprint.",
  },
  {
    label: "🌍 Compare to average",
    message:
      "How does my carbon footprint compare to the national and global average?",
  },
];

export default function CoachChat({
  messages,
  isLoading,
  error,
  onSendMessage,
  onInitialize,
  context,
}: CoachChatProps) {
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // Initialize greeting on mount
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      onInitialize();
    }
  }, [onInitialize]);

  // Auto-scroll to bottom (isolated to chat container)
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput("");
  };

  const handleQuickAction = (message: string) => {
    if (isLoading) return;
    onSendMessage(message);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-emerald-600 text-white rounded-br-sm"
                    : "bg-white/70 backdrop-blur-sm border border-white/30 text-stone-800 rounded-bl-sm"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-sm">🌿</span>
                    <span className="text-xs font-medium text-emerald-700">
                      Sprout Coach AI 🌱
                    </span>
                  </div>
                )}
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content
                    .split("**")
                    .map((part, i) =>
                      i % 2 === 1 ? (
                        <strong key={`${msg.id}-b-${part.slice(0, 20)}`}>
                          {part}
                        </strong>
                      ) : (
                        <span key={`${msg.id}-t-${i}-${part.slice(0, 12)}`}>
                          {part}
                        </span>
                      ),
                    )}
                </div>

                {/* Generative UI Cards */}
                <AnimatePresence>
                  {!msg.isStreaming && msg.uiCard === "priority" && context && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                      className="pt-4 border-t border-emerald-100/50 overflow-hidden"
                    >
                      <PriorityActions
                        recommendations={context.recommendations.slice(0, 3)}
                        compact={true}
                      />
                    </motion.div>
                  )}
                  {!msg.isStreaming &&
                    msg.uiCard === "breakdown" &&
                    context && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                        className="pt-4 border-t border-emerald-100/50 overflow-hidden"
                      >
                        <EmissionBreakdown
                          contributions={context.score?.contributions || []}
                          compact={true}
                        />
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-sm">🌿</span>
                <span className="text-xs font-medium text-emerald-700">
                  Sprout Coach AI 🌱
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div
                  className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center text-sm text-red-500 py-2">{error}</div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Actions — only show when few messages */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => handleQuickAction(action.message)}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 
                  hover:bg-emerald-100 transition-colors disabled:opacity-50 border border-emerald-100"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-4 pt-2 border-t border-white/20"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your carbon footprint..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/60 backdrop-blur-sm 
              border border-white/30 text-sm text-stone-800 placeholder:text-stone-500
              focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300
              disabled:opacity-50 transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium
              hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600
              transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
