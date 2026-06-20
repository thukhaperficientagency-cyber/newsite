import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, X, Clock, Eye, Share2, Calendar } from "lucide-react";
import { BlogPost } from "../types";

interface BlogProps {
  blogs: BlogPost[];
}

export default function Blog({ blogs }: BlogProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Show only published blogs for public view
  const publishedBlogs = blogs.filter((b) => b.status === "published");

  return (
    <section id="blog" className="py-24 bg-[#0d0f14] relative">
      <div className="absolute top-1/4 left-1/4 w-[280px] h-[280px] bg-indigo-500/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-semibold text-indigo-400 tracking-widest uppercase block mb-3">Insights & Pulses</span>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white tracking-tight mb-3">
            SEO Programmatic Intelligence
          </h2>
          <p className="text-gray-400 text-xs md:text-sm max-w-xl mx-auto">
            Deep dive into technical reports, structural SEO guides, and headless decoupled performance analytics.
          </p>
        </div>

        {publishedBlogs.length === 0 ? (
          <div className="p-16 rounded-2xl bg-[#090b0f] border border-gray-900 border-dashed text-center flex flex-col items-center">
            <BookOpen className="text-gray-600 mb-4" size={36} />
            <p className="text-gray-400 text-sm font-medium">No blog publications yet.</p>
            <p className="text-gray-600 text-xs mt-1">Draft or publish posts dynamically in the Control Panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {publishedBlogs.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="group cursor-pointer bg-[#111420]/50 p-6 rounded-2xl border border-gray-900 hover:border-indigo-500/20 hover:bg-[#131828]/60 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Aspect Cover Image */}
                  {post.imageUrl && (
                    <div className="aspect-[21/9] rounded-xl overflow-hidden mb-6 bg-gray-950">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-[11px] font-mono text-gray-500 mb-3">
                    <span className="text-indigo-400 font-semibold">{post.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {post.publishedAt}
                    </span>
                    {post.views && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye size={11} />
                          {post.views} Views
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="text-xl font-bold font-display text-white mb-3 group-hover:text-indigo-400 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-xs md:text-sm line-clamp-3 mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                {/* Author profile */}
                <div className="flex items-center justify-between border-t border-gray-900/60 pt-4">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={post.authorAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=60"}
                      alt={post.authorName || "Author"}
                      className="w-7 h-7 rounded-full border border-gray-800"
                    />
                    <span className="text-xs font-semibold text-gray-300">
                      {post.authorName || "Principal Team"}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 inline-flex items-center gap-1.5 hover:underline">
                    <span>Read Article</span>
                    <BookOpen size={13} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Immersive Blog Reading overlay modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#07090d]/95 flex justify-end overflow-y-auto"
          >
            {/* Background Closer */}
            <div 
              className="absolute inset-0 cursor-crosshair" 
              onClick={() => setSelectedPost(null)} 
            />

            {/* Slide-out Document */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-[#090b0f] border-l border-gray-800 shadow-2xl overflow-y-auto h-full flex flex-col justify-between"
            >
              <div>
                {/* Header Actions line */}
                <div className="sticky top-0 z-10 bg-[#090b0f]/90 backdrop-blur-md border-b border-gray-900 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                    <span className="text-indigo-400 font-bold uppercase">{selectedPost.category}</span>
                    <span>/</span>
                    <span>Read Mode</span>
                  </div>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="p-1.5 rounded-full bg-gray-900 border border-gray-800 text-gray-400 hover:text-white transition-all hover:bg-gray-800 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Cover Hero */}
                {selectedPost.imageUrl && (
                  <div className="aspect-[21/10] bg-gray-950 overflow-hidden relative">
                    <img
                      src={selectedPost.imageUrl}
                      alt={selectedPost.title}
                      className="w-full h-full object-cover opacity-90"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Core content */}
                <div className="px-6 md:px-10 py-8">
                  <div className="flex items-center gap-4 text-xs font-mono text-gray-500 mb-4">
                    <span>{selectedPost.publishedAt}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Eye size={12} /> {selectedPost.views || 100} Reads</span>
                  </div>

                  <h1 className="text-2xl md:text-4xl font-extrabold font-display text-white mb-6 leading-tight">
                    {selectedPost.title}
                  </h1>

                  {/* Author profile line */}
                  <div className="flex items-center gap-3 bg-[#0d0f14] border border-gray-900 rounded-xl p-3 mb-8">
                    <img
                      src={selectedPost.authorAvatar || "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=100"}
                      alt={selectedPost.authorName}
                      className="w-10 h-10 rounded-full border border-gray-800"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">{selectedPost.authorName || "Principal Developer"}</div>
                      <div className="text-[10px] text-gray-500 font-mono">Product Engineering Specialist</div>
                    </div>
                  </div>

                  {/* Markdown-style reading section */}
                  <div className="whitespace-pre-wrap text-gray-300 text-sm md:text-base leading-relaxed space-y-4">
                    {selectedPost.content}
                  </div>
                </div>
              </div>

              {/* Reading Footer */}
              <div className="border-t border-gray-900 bg-[#0c0e14] px-8 py-6 text-center text-xs text-gray-500">
                <p>Perficient Digital Agency Insights. Sharing engineering knowledge with the Myanmar web ecosystem.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
