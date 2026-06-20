import { ArrowUpRight, Star, Disc, Cpu, Code, Search } from "lucide-react";
import { Settings } from "../types";

interface HeroProps {
  settings: Settings;
}

export default function Hero({ settings }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-20 pb-28 md:pt-28 md:pb-36 grain-bg">
      {/* Decorative gradient glowing spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full bg-indigo-500/10 blur-[80px] md:blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[200px] md:w-[300px] h-[200px] md:h-[300px] rounded-full bg-cyan-500/5 blur-[50px] md:blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        {/* Rating/Trust Badge */}
        {settings.clutchRating && (
          <div 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8"
          >
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} fill="currentColor" />
              ))}
            </div>
            <span className="text-xs font-mono font-medium tracking-wider text-indigo-300">
              CLUTCH: {settings.clutchRating}
            </span>
          </div>
        )}

        {/* Dynamic Main Heading */}
        <h1 
          className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight font-display text-white max-w-5xl mx-auto leading-[1.08] mb-6"
        >
          {settings.heroTitle || "We Build Fast, SEO-Dominated Digital Ecosystems"}
        </h1>

        {/* Subtitle */}
        <p 
          className="text-gray-400 text-base sm:text-lg md:text-xl font-normal max-w-3xl mx-auto leading-relaxed mb-10"
        >
          {settings.heroSubtitle || "A premium digital engineering agency. We sculpt blazing-fast software, premium brand identities, and high-converting marketing structures."}
        </p>

        {/* CTAs */}
        <div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <a 
            href="#portfolio" 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-[#0d0f14] hover:bg-gray-100 font-semibold text-sm tracking-wide transition-all duration-200 group"
          >
            <span>View Case Studies</span>
            <ArrowUpRight size={16} className="text-[#0d0f14] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a 
            href="#contact" 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#131720] text-gray-300 hover:text-white border border-gray-800 hover:border-gray-700 font-semibold text-sm tracking-wide transition-all duration-200"
          >
            <span>Book a Consultation</span>
          </a>
        </div>

        {/* Dynamic Floating Badges */}
        <div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-gray-800/80 pt-10"
        >
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
              <Cpu size={16} />
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-white">Fullstack Engineering</div>
              <div className="text-[10px] text-gray-500 font-mono">React / Node.js</div>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
              <Search size={16} />
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-white">Advanced SEO</div>
              <div className="text-[10px] text-gray-500 font-mono">100/100 Core Vitals</div>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 shrink-0">
              <Code size={16} />
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-white">No-CMS Headless</div>
              <div className="text-[10px] text-gray-500 font-mono">Serverless Vercel</div>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
              <Disc size={16} />
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-white">High-Speed Asset</div>
              <div className="text-[10px] text-gray-500 font-mono">Fully Managed Data</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
