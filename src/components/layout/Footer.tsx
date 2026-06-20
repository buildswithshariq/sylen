"use client";

import Link from "next/link";
import { m as motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative bg-white pt-24 pb-12 overflow-hidden border-t border-stone-200/50">
      {/* Subtle Glowing Horizon Effect */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-24 bg-gradient-to-b from-emerald-400/10 to-transparent blur-2xl pointer-events-none" />

      {/* Floating subtle nature shape / abstract blur */}
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-50/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-sky-50/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-20">
          {/* Brand Area (Spans 5 cols) */}
          <div className="lg:col-span-5 space-y-8 pr-0 lg:pr-12">
            <div>
              <Link href="/" className="inline-flex items-center gap-2 group">
                <motion.span
                  className="text-3xl"
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  🌱
                </motion.span>
                <span className="font-extrabold text-3xl tracking-tight text-stone-900">
                  Sylen
                </span>
              </Link>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-stone-800 tracking-tight leading-snug">
                Know Your Impact.
                <br />
                Grow a Better Future.
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed max-w-[320px]">
                AI-powered sustainability intelligence platform helping people
                understand, track, and improve their environmental impact.
              </p>
            </div>
          </div>

          {/* Links Area (Spans 7 cols, grid of 3) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-8">
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-stone-900 mb-6 text-xs tracking-widest uppercase">
                Quick Links
              </h4>
              <ul className="space-y-4">
                {["Home", "Dashboard", "Assessment", "Resources"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                        className="group relative inline-flex text-stone-500 hover:text-stone-900 transition-colors text-sm font-medium"
                      >
                        {item}
                        <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-right group-hover:origin-left duration-300 ease-out rounded-full" />
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Learn */}
            <div>
              <h4 className="font-semibold text-stone-900 mb-6 text-xs tracking-widest uppercase">
                Learn
              </h4>
              <ul className="space-y-4">
                {[
                  {
                    name: "EPA Calculator",
                    url: "https://www.epa.gov/ghgemissions/carbon-footprint-calculator",
                  },
                  {
                    name: "WWF Calculator",
                    url: "https://footprint.wwf.org.uk",
                  },
                  { name: "GHG Protocol", url: "https://ghgprotocol.org" },
                  { name: "Sustainability Resources", url: "/resources" },
                ].map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.url}
                      target={item.url.startsWith("http") ? "_blank" : "_self"}
                      rel={
                        item.url.startsWith("http") ? "noopener noreferrer" : ""
                      }
                      className="group relative inline-flex text-stone-500 hover:text-stone-900 transition-colors text-sm font-medium"
                    >
                      {item.name}
                      <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-right group-hover:origin-left duration-300 ease-out rounded-full" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div className="col-span-2 sm:col-span-1">
              <h4 className="font-semibold text-stone-900 mb-6 text-xs tracking-widest uppercase">
                Connect
              </h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="https://github.com/buildswithshariq/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-stone-500 hover:text-stone-900 transition-colors text-sm font-medium"
                  >
                    <div className="p-2 rounded-xl bg-stone-50 border border-stone-200/60 group-hover:bg-white group-hover:border-stone-300 group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] group-hover:-translate-y-0.5 transition-all duration-300">
                      <svg
                        aria-hidden="true"
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span>GitHub</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/buildswithshariq/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-stone-500 hover:text-[#0a66c2] transition-colors text-sm font-medium"
                  >
                    <div className="p-2 rounded-xl bg-stone-50 border border-stone-200/60 group-hover:bg-white group-hover:border-blue-200 group-hover:shadow-[0_4px_12px_rgba(10,102,194,0.1)] group-hover:-translate-y-0.5 transition-all duration-300">
                      <svg
                        aria-hidden="true"
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </div>
                    <span>LinkedIn</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-stone-500 text-sm font-medium">
            <span>© 2026 Sylen</span>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-stone-300" />
            <span>Built for Hack2Skills Prompts Wars</span>
          </div>

          <p className="text-sm font-medium text-stone-500 flex items-center gap-1.5">
            Made with{" "}
            <motion.span
              whileHover={{ scale: 1.2, rotate: 10 }}
              className="inline-block cursor-default"
            >
              🌱
            </motion.span>{" "}
            for a more sustainable future
          </p>
        </div>
      </div>
    </footer>
  );
}
