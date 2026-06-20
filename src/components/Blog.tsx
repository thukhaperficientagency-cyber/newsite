import { BookOpen, Calendar, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { BlogPost } from "../types";

interface BlogProps {
  blogs: BlogPost[];
}

export default function Blog({ blogs }: BlogProps) {
  const publishedBlogs = blogs.filter((blog) => blog.status === "published");

  return (
    <section id="blog" className="py-24 bg-[#0d0f14] relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-semibold text-indigo-400 tracking-widest uppercase block mb-3">
            Insights & Pulses
          </span>
          <h1 className="text-3xl md:text-5xl font-bold font-display text-white tracking-tight mb-3">
            SEO Programmatic Intelligence
          </h1>
          <p className="text-gray-400 text-xs md:text-sm max-w-xl mx-auto">
            Technical reports, SEO guides, and product performance insights.
          </p>
        </div>

        {publishedBlogs.length === 0 ? (
          <div className="p-16 rounded-2xl bg-[#090b0f] border border-gray-900 border-dashed text-center flex flex-col items-center">
            <BookOpen className="text-gray-600 mb-4" size={36} />
            <p className="text-gray-400 text-sm font-medium">No blog publications yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {publishedBlogs.map((post) => (
              <article
                key={post.id}
                className="group bg-[#111420]/50 p-6 rounded-2xl border border-gray-900 hover:border-indigo-500/20 transition-all"
              >
                <Link to={`/blog/${encodeURIComponent(post.slug)}`} className="flex flex-col h-full">
                  {post.imageUrl && (
                    <div className="aspect-[21/9] rounded-xl overflow-hidden mb-6 bg-gray-950">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-[11px] font-mono text-gray-500 mb-3">
                    <span className="text-indigo-400">{post.category}</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {post.publishedAt}
                    </span>
                    {!!post.views && (
                      <span className="flex items-center gap-1">
                        <Eye size={11} />
                        {post.views}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold font-display text-white mb-3 group-hover:text-indigo-400">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 text-xs md:text-sm line-clamp-3 mb-6 leading-relaxed flex-grow">
                    {post.excerpt}
                  </p>
                  <span className="text-xs font-semibold text-indigo-400">
                    Read article →
                  </span>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
