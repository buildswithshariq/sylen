import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-stone-50 border-t border-stone-200/60 pt-16 pb-8 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group inline-block">
              <span className="text-2xl">🌱</span>
              <span className="font-semibold text-xl tracking-tight text-stone-800">
                Eco<span className="text-emerald-600">Pilot</span>
              </span>
            </Link>
            <p className="text-stone-800 font-medium text-lg leading-tight">
              Understand.<br />
              Track.<br />
              Reduce.
            </p>
            <p className="text-stone-500 text-sm leading-relaxed max-w-xs pt-2">
              Helping individuals make smarter sustainability decisions through personalized carbon footprint insights.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-semibold text-stone-800 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-stone-500 hover:text-emerald-600 transition-colors text-sm">Home</Link></li>
              <li><Link href="/dashboard" className="text-stone-500 hover:text-emerald-600 transition-colors text-sm">Dashboard</Link></li>
              <li><Link href="/assessment" className="text-stone-500 hover:text-emerald-600 transition-colors text-sm">Assessment</Link></li>
              <li><Link href="/resources" className="text-stone-500 hover:text-emerald-600 transition-colors text-sm">Resources</Link></li>
            </ul>
          </div>

          {/* Column 3: Learning Resources */}
          <div>
            <h3 className="font-semibold text-stone-800 mb-4">Learning Resources</h3>
            <ul className="space-y-3">
              <li><a href="https://www.epa.gov/ghgemissions/carbon-footprint-calculator" target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-emerald-600 transition-colors text-sm">EPA Calculator</a></li>
              <li><a href="https://footprint.wwf.org.uk" target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-emerald-600 transition-colors text-sm">WWF Calculator</a></li>
              <li><a href="https://www.footprintcalculator.org" target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-emerald-600 transition-colors text-sm">Global Footprint Calculator</a></li>
              <li><a href="https://ghgprotocol.org" target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-emerald-600 transition-colors text-sm">GHG Protocol</a></li>
            </ul>
          </div>

          {/* Column 4: Developer */}
          <div>
            <h3 className="font-semibold text-stone-800 mb-4">Developer</h3>
            <ul className="space-y-3">
              <li><a href="https://github.com/buildswithshariq/" target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-emerald-600 transition-colors text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                GitHub
              </a></li>
              <li><a href="https://www.linkedin.com/in/buildswithshariq/" target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-emerald-600 transition-colors text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-stone-400 text-sm">
            © 2026 EcoPilot. All Rights Reserved.
          </p>
          <p className="text-emerald-600/80 font-medium text-sm flex items-center gap-1.5">
            <a href='https://hack2skill.com/event/promptwars'>Built for Hack2Skills Prompts Wars</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
