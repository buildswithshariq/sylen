"use client";

import { m as motion } from "framer-motion";
import TransitionLink from "@/components/ui/TransitionLink";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

// Premium 2D Hero Illustration replacing the 3D globe
function HeroIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-[1000px]">
      {/* Central glow */}
      <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-[100px] animate-pulse-soft" />

      {/* Main floating card */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute z-20 w-80 glass-strong rounded-3xl p-6 shadow-2xl border border-white/60"
        style={{ rotateX: 5, rotateY: -10 }}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-sm font-semibold text-stone-500">
              Sustainability Score
            </p>
            <h3 className="text-4xl font-bold text-stone-900 mt-1">
              85<span className="text-xl text-stone-500 font-medium">/100</span>
            </h3>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
            Excellent
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-stone-500">Transport</span>
              <span className="text-emerald-600 font-medium">-15%</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full w-[40%]" />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-stone-500">Energy</span>
              <span className="text-emerald-600 font-medium">-25%</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2">
              <div className="bg-emerald-400 h-2 rounded-full w-[65%]" />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-stone-500">Food</span>
              <span className="text-emerald-600 font-medium">-40%</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2">
              <div className="bg-emerald-300 h-2 rounded-full w-[85%]" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating element Top Right */}
      <motion.div
        animate={{ y: [5, -15, 5] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute z-30 top-[15%] right-[5%] w-48 glass rounded-2xl p-4 shadow-xl border border-white/50 backdrop-blur-xl"
        style={{ rotateX: -5, rotateY: -15, translateZ: 50 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-xl">
            ✈️
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">Flight Impact</p>
            <p className="text-sm font-bold text-stone-800">Neutralized</p>
          </div>
        </div>
      </motion.div>

      {/* Floating element Bottom Left */}
      <motion.div
        animate={{ y: [-5, 15, -5] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="absolute z-30 bottom-[15%] left-[5%] w-56 glass rounded-2xl p-4 shadow-xl border border-white/50 backdrop-blur-xl"
        style={{ rotateX: 10, rotateY: 5, translateZ: 80 }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-forest flex items-center justify-center text-white text-xl shadow-inner">
            🌱
          </div>
          <div>
            <p className="text-xl font-bold text-stone-900">-2.4t</p>
            <p className="text-xs text-stone-500 font-medium">
              CO₂e Reduced this year
            </p>
          </div>
        </div>
      </motion.div>

      {/* Subtle connecting lines / tech visualizer background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none flex items-center justify-center">
        <svg
          aria-hidden="true"
          viewBox="0 0 400 400"
          className="w-full h-full animate-spin-slow"
        >
          <circle
            cx="200"
            cy="200"
            r="150"
            fill="none"
            stroke="#059669"
            strokeWidth="1"
            strokeDasharray="4 8"
          />
          <circle
            cx="200"
            cy="200"
            r="100"
            fill="none"
            stroke="#0EA5E9"
            strokeWidth="1"
            strokeDasharray="2 6"
          />
        </svg>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-off-white">
      {/* ============ Hero Section ============ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-100/20 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen pt-20">
            {/* Left — Copy */}
            <div className="space-y-8">
              <div className="animate-fade-in-up delay-0">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-sm font-medium shadow-sm">
                  <span className="text-emerald-600">🌿</span>{" "}
                  <span>Environmental Intelligence Platform</span>
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-stone-900 leading-[1.1] animate-fade-in-up delay-150">
                <span className="text-forest">Understand.</span>
                <br />
                Track.
                <br />
                <span className="text-emerald-700">Reduce.</span>
              </h1>

              <p className="text-lg sm:text-xl text-stone-600 max-w-lg leading-relaxed animate-fade-in-up delay-300">
                Your complete carbon reduction platform. Get actionable
                insights, simulate lifestyle changes, and build sustainable
                habits — one step at a time.
              </p>

              <div className="flex flex-wrap gap-4 animate-fade-in-up delay-450">
                <TransitionLink
                  href="/assessment"
                  className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold 
                    text-white bg-emerald-600 rounded-2xl hover:bg-emerald-700 
                    transition-all shadow-lg shadow-emerald-600/20 hover:shadow-xl 
                    hover:shadow-emerald-600/30 active:scale-[0.98]"
                >
                  Start Assessment
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </TransitionLink>
                <TransitionLink
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium 
                    text-stone-700 bg-white/60 backdrop-blur-sm rounded-2xl 
                    border border-white/40 hover:bg-white/80 transition-all"
                >
                  Learn More
                </TransitionLink>
              </div>

              <div className="flex items-center gap-8 pt-4 animate-fade-in-up delay-600">
                <div>
                  <p className="text-2xl font-bold text-stone-800">5+</p>
                  <p className="text-xs text-stone-500">Impact Categories</p>
                </div>
                <div className="w-px h-10 bg-stone-200" />
                <div>
                  <p className="text-2xl font-bold text-stone-800">AI</p>
                  <p className="text-xs text-stone-500">Personalized Coach</p>
                </div>
                <div className="w-px h-10 bg-stone-200" />
                <div>
                  <p className="text-2xl font-bold text-stone-800">∞</p>
                  <p className="text-xs text-stone-500">What-If Scenarios</p>
                </div>
              </div>
            </div>

            {/* Right — 2D Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="relative h-[500px] lg:h-[600px] hidden md:block"
            >
              <HeroIllustration />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ Why It Matters ============ */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-dots" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
              Why Your Carbon Footprint Matters
            </h2>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto">
              The average person emits 16 tonnes of CO₂e per year. Small changes
              in daily habits can reduce this by up to 30%.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🌡️",
                title: "1.5°C Target",
                description:
                  "We need to halve global emissions by 2030 to stay within safe limits. Individual action matters.",
              },
              {
                icon: "🏭",
                title: "73% From Energy",
                description:
                  "Energy use in homes, transport, and food production drives the majority of personal emissions.",
              },
              {
                icon: "🌱",
                title: "30% Reducible",
                description:
                  "Studies show individuals can cut up to 30% of their footprint through informed lifestyle changes.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="glass rounded-2xl p-8 hover:shadow-lg transition-shadow"
              >
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="text-xl font-semibold text-stone-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-stone-500 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ How It Works ============ */}
      <section
        id="how-it-works"
        className="py-24 bg-gradient-to-b from-transparent to-emerald-50/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
              How Sylen Works
            </h2>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto">
              Four simple steps to understanding and reducing your environmental
              impact.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Take Assessment",
                description:
                  "Answer simple questions about your transport, energy use, diet, and lifestyle.",
                icon: "📋",
              },
              {
                step: "02",
                title: "Analyze Footprint",
                description:
                  "Our engine calculates your exact carbon footprint using EPA emission factors.",
                icon: "🔍",
              },
              {
                step: "03",
                title: "Receive Personalized Insights",
                description:
                  "Get custom recommendations and a tailored 4-week roadmap to start your journey.",
                icon: "💡",
              },
              {
                step: "04",
                title: "Reduce Environmental Impact",
                description:
                  "Track your progress, level up your Eco Status, and see your carbon savings grow.",
                icon: "🌍",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="relative h-full"
              >
                <div className="glass-strong rounded-2xl p-6 h-full flex flex-col hover:-translate-y-1 transition-transform duration-300">
                  <span className="text-5xl font-bold text-emerald-100/50 absolute top-4 right-4">
                    {item.step}
                  </span>
                  <span className="text-4xl mb-4 block">{item.icon}</span>
                  <h3 className="text-lg font-semibold text-stone-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-stone-500 leading-relaxed text-sm flex-grow">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Features Bento ============ */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto">
              Everything you need to understand, track, and reduce your carbon
              footprint.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Carbon Intelligence Engine",
                description:
                  "Real emission factors from EPA and DEFRA data. Accurate, reproducible calculations for transport, energy, food, and lifestyle.",
                icon: "⚡",
                span: "lg:col-span-2",
              },
              {
                title: "AI Sustainability Coach",
                description:
                  "Explains your results, personalizes recommendations, and answers your sustainability questions.",
                icon: "🤖",
                span: "",
              },
              {
                title: "What-If Simulator",
                description:
                  "Test hypothetical changes before committing. See exactly how switching to transit or going vegetarian would impact your score.",
                icon: "🔮",
                span: "",
              },
              {
                title: "Eco Level System",
                description:
                  "Gamified progression from High Impact to Earth Guardian. Track your level, earn badges, and see your progress.",
                icon: "🏆",
                span: "",
              },
              {
                title: "4-Week Roadmap",
                description:
                  "Personalized action plan starting with quick wins and building up to lasting habits. Estimated CO₂e savings for each week.",
                icon: "🗺️",
                span: "",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`glass rounded-2xl p-8 hover:shadow-lg transition-all group ${feature.span}`}
              >
                <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform">
                  {feature.icon}
                </span>
                <h3 className="text-lg font-semibold text-stone-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-stone-500 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA Section ============ */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-strong rounded-3xl p-12 sm:p-16"
          >
            <span className="text-5xl mb-6 block">🌍</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
              Start Your Sustainability Journey
            </h2>
            <p className="text-lg text-stone-500 max-w-xl mx-auto mb-8">
              It takes less than 2 minutes. Understand your impact. Get a
              personalized plan. Start making a difference today.
            </p>
            <TransitionLink
              href="/assessment"
              className="inline-flex items-center gap-2 px-10 py-4 text-lg font-semibold 
                text-white bg-emerald-600 rounded-2xl hover:bg-emerald-700 
                transition-all shadow-lg shadow-emerald-600/20 hover:shadow-xl 
                hover:shadow-emerald-600/30 active:scale-[0.98]"
            >
              Start Free Assessment
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </TransitionLink>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
