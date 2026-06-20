"use client";

import { m as motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";

export default function ResourcesPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-stone-800 tracking-tight mb-4">
          Sustainability <span className="text-emerald-600">Resources</span>
        </h1>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto">
          Explore educational materials and professional tools to deepen your
          understanding of carbon footprints and climate action.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-20"
      >
        {/* Section 1: Carbon Footprint Tools */}
        <section>
          <motion.h2
            variants={itemVariants}
            className="text-2xl font-bold text-stone-800 mb-8 flex items-center gap-2"
          >
            <span>🧮</span> Carbon Footprint Tools
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ResourceCard
              title="EPA Calculator"
              description="Official US Environmental Protection Agency household emissions calculator."
              link="https://www.epa.gov/ghgemissions/carbon-footprint-calculator"
            />
            <ResourceCard
              title="Global Footprint"
              description="Calculate your personal Earth Overshoot Day and ecological footprint."
              link="https://www.footprintcalculator.org"
            />
            <ResourceCard
              title="WWF Footprint"
              description="UK-focused footprint calculator measuring lifestyle impact."
              link="https://footprint.wwf.org.uk"
            />
            <ResourceCard
              title="Nature Conservancy"
              description="Detailed carbon calculator measuring travel, home, food, and shopping."
              link="https://www.nature.org/en-us/get-involved/how-to-help/carbon-footprint-calculator"
            />
          </div>
        </section>

        {/* Section 2: Learn Sustainability */}
        <section>
          <motion.h2
            variants={itemVariants}
            className="text-2xl font-bold text-stone-800 mb-8 flex items-center gap-2"
          >
            <span>📚</span> Learn Sustainability
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResourceCard
              title="GHG Protocol"
              description="The world's most widely used greenhouse gas accounting standards. Learn how corporate emissions are officially measured."
              link="https://ghgprotocol.org"
              featured
            />
            <ResourceCard
              title="Global Footprint Network"
              description="Research organization advancing the science of sustainability and driving the ecological footprint metric."
              link="https://www.footprintnetwork.org"
              featured
            />
          </div>
        </section>

        {/* Section 3: Why This Matters */}
        <section>
          <motion.h2
            variants={itemVariants}
            className="text-2xl font-bold text-stone-800 mb-8 flex items-center gap-2"
          >
            <span>🌍</span> Why This Matters
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={itemVariants}>
              <GlassCard className="h-full p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 text-4xl opacity-10">
                  🚗
                </div>
                <h3 className="text-xl font-semibold text-stone-800 mb-3">
                  Transportation
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  Transportation represents one of the largest sources of
                  greenhouse gas emissions globally. Shifting to public transit,
                  carpooling, or electric vehicles can drastically reduce
                  personal carbon footprints and improve urban air quality.
                </p>
              </GlassCard>
            </motion.div>
            <motion.div variants={itemVariants}>
              <GlassCard className="h-full p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 text-4xl opacity-10">
                  ⚡
                </div>
                <h3 className="text-xl font-semibold text-stone-800 mb-3">
                  Home Energy
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  Electricity and heating rely heavily on fossil fuels.
                  Improving home insulation, switching to LED lighting, and
                  using energy-efficient appliances lowers energy demand and
                  accelerates the transition to renewable energy grids.
                </p>
              </GlassCard>
            </motion.div>
            <motion.div variants={itemVariants}>
              <GlassCard className="h-full p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 text-4xl opacity-10">
                  🥗
                </div>
                <h3 className="text-xl font-semibold text-stone-800 mb-3">
                  Diet & Food
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  The agricultural sector, particularly meat and dairy
                  production, is resource-intensive. Reducing food waste and
                  incorporating more plant-based meals minimizes methane
                  emissions and reduces land and water degradation.
                </p>
              </GlassCard>
            </motion.div>
            <motion.div variants={itemVariants}>
              <GlassCard className="h-full p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 text-4xl opacity-10">
                  🛍️
                </div>
                <h3 className="text-xl font-semibold text-stone-800 mb-3">
                  Lifestyle & Waste
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  The manufacturing and disposal of consumer goods require
                  significant energy. Adopting a circular economy mindset—buying
                  less, choosing durable products, and recycling—reduces
                  industrial emissions and landfill waste.
                </p>
              </GlassCard>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}

function ResourceCard({
  title,
  description,
  link,
  featured = false,
}: Readonly<{
  title: string;
  description: string;
  link: string;
  featured?: boolean;
}>) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className="h-full"
    >
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full outline-none group"
      >
        <GlassCard
          className={`h-full p-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg ${featured ? "bg-emerald-50/50 border-emerald-100/50" : ""}`}
          hover
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-lg text-stone-800 group-hover:text-emerald-700 transition-colors">
                {title}
              </h3>
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-stone-500 group-hover:text-emerald-500 transition-colors transform group-hover:translate-x-1 group-hover:-translate-y-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </div>
            <p className="text-sm text-stone-600 flex-grow">{description}</p>
          </div>
        </GlassCard>
      </a>
    </motion.div>
  );
}
