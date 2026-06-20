import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { PortfolioProject } from "../types";

interface PortfolioProps {
  projects: PortfolioProject[];
}

export default function Portfolio({ projects }: PortfolioProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];
  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <section id="portfolio" className="py-24 bg-[#0d0f14] grain-bg relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="text-center md:text-left">
            <span className="text-xs font-mono font-semibold text-indigo-400 tracking-widest uppercase block mb-3">
              Portfolio Cases
            </span>
            <h1 className="text-3xl md:text-5xl font-bold font-display text-white tracking-tight mb-2">
              Our Engineered Showcase
            </h1>
            <p className="text-gray-400 text-xs md:text-sm max-w-lg">
              Explore our product engineering, design, and growth case studies.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 bg-[#0a0c10] border border-gray-900 rounded-full p-1.5">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-4 py-2 rounded-full text-xs font-medium ${
                  activeFilter === category
                    ? "bg-indigo-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="p-16 rounded-2xl bg-[#090b0f] border border-gray-900 border-dashed text-center flex flex-col items-center">
            <Layers className="text-gray-600 mb-4" size={36} />
            <p className="text-gray-400 text-sm font-medium">No portfolio items loaded yet.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.article
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={project.id}
                  className="group bg-[#11141e]/50 border border-gray-900/80 rounded-2xl overflow-hidden hover:border-gray-800 transition-all"
                >
                  <Link to={`/case-studies/${encodeURIComponent(project.id)}`} className="flex flex-col h-full">
                    <div className="relative aspect-video overflow-hidden bg-gray-950">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <span className="text-[10px] uppercase font-mono text-indigo-400 mb-2">
                        {project.category}
                      </span>
                      <h2 className="text-lg font-bold font-display text-white mb-2 group-hover:text-indigo-400">
                        {project.title}
                      </h2>
                      <p className="text-gray-400 text-xs md:text-sm line-clamp-3 leading-relaxed flex-grow">
                        {project.description}
                      </p>
                      <span className="mt-6 text-xs font-semibold text-indigo-400">
                        View case study →
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
