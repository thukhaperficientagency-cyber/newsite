import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, Layers, Terminal } from "lucide-react";
import { PortfolioProject } from "../types";

interface PortfolioProps {
  projects: PortfolioProject[];
}

export default function Portfolio({ projects }: PortfolioProps) {
  const [activeFilter, setActiveFilter] = useState("All");

  // Dynamically extract categories from current projects
  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = activeFilter === "All" 
    ? projects 
    : projects.filter((p) => p.category === activeFilter);

  return (
    <section id="portfolio" className="py-24 bg-[#0d0f14] grain-bg relative">
      <div className="absolute top-1/3 right-12 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="text-center md:text-left">
            <span className="text-xs font-mono font-semibold text-indigo-400 tracking-widest uppercase block mb-3">Portfolio Cases</span>
            <h2 className="text-3xl md:text-5xl font-bold font-display text-white tracking-tight mb-2">
              Our Engineered Showcase
            </h2>
            <p className="text-gray-400 text-xs md:text-sm max-w-lg">
              Each release represents hours of programmatic layout refinement, optimized caching layouts, and pristine visual styling rules.
            </p>
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap justify-center gap-2 self-center md:self-end bg-[#0a0c10] border border-gray-900 rounded-full p-1.5 max-w-full overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === cat
                    ? "bg-indigo-600 text-white font-semibold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Empty layout guard */}
        {projects.length === 0 ? (
          <div className="p-16 rounded-2xl bg-[#090b0f] border border-gray-900 border-dashed text-center flex flex-col items-center">
            <Layers className="text-gray-600 mb-4" size={36} />
            <p className="text-gray-400 text-sm font-medium">No portfolio items loaded yet.</p>
            <p className="text-gray-600 text-xs mt-1">Verify dynamic config in the Control Panel.</p>
          </div>
        ) : (
          /* Portfolio Grid */
          <motion.div 
            layout 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((proj) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={proj.id}
                  className="group bg-[#11141e]/50 border border-gray-900/80 rounded-2xl overflow-hidden hover:border-gray-800 transition-all flex flex-col"
                >
                  {/* Project Cover Image */}
                  <div className="relative aspect-video overflow-hidden bg-gray-950">
                    <img
                      src={proj.imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"}
                      alt={proj.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="mono-tag text-[9px] font-bold tracking-wider text-indigo-300 bg-indigo-950/80 border border-indigo-500/20 px-2.5 py-1 rounded-full uppercase">
                        {proj.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    {proj.clientName && (
                      <span className="text-[10px] uppercase tracking-wider font-mono text-gray-500 mb-1">
                        Client: {proj.clientName}
                      </span>
                    )}
                    <h3 className="text-lg font-bold font-display text-white mb-2 leading-tight group-hover:text-indigo-400 transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-gray-400 text-xs md:text-sm line-clamp-3 mb-6 leading-relaxed flex-grow">
                      {proj.description}
                    </p>

                    {/* Metadata Sub-sections */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {proj.tags?.map((tag) => (
                        <span 
                          key={tag} 
                          className="text-[10px] text-gray-400 bg-gray-900 border border-gray-800 px-2 py-0.5 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    {proj.projectUrl && (
                      <a
                        href={proj.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 hover:underline transition-all w-fit mt-auto"
                      >
                        <span>Launch Project Case</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
