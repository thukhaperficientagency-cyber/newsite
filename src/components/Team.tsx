import { Github, Linkedin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { TeamMember } from "../types";

interface TeamProps {
  members: TeamMember[];
}

export default function Team({ members }: TeamProps) {
  const sortedMembers = [...members].sort(
    (a, b) => (a.order || 99) - (b.order || 99)
  );

  return (
    <section id="team" className="deferred-section py-24 bg-[#0a0c10] border-t border-gray-950 relative">
      <div className="absolute bottom-1/4 left-1/3 w-[250px] h-[250px] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-semibold text-indigo-400 tracking-widest uppercase block mb-3">
            Our Squad
          </span>
          <h1 className="text-3xl md:text-5xl font-bold font-display text-white tracking-tight mb-3">
            Principal Product Sculptors
          </h1>
          <p className="text-gray-400 text-xs md:text-sm max-w-xl mx-auto">
            Our engineers and developers lead with deep technical rigor,
            crafting high-performance products that remain stable at scale.
          </p>
        </div>

        {sortedMembers.length === 0 ? (
          <div className="p-16 rounded-2xl bg-[#090b0f] border border-gray-900 border-dashed text-center flex flex-col items-center">
            <Users className="text-gray-600 mb-4" size={36} />
            <p className="text-gray-400 text-sm font-medium">No team profiles loaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedMembers.map((member) => (
              <article
                key={member.id}
                className="group bg-[#0e1118]/60 p-6 rounded-2xl border border-gray-900/60 hover:border-gray-800 hover:bg-[#121620]/70 transition-all flex flex-col"
              >
                <Link to={`/team/${encodeURIComponent(member.id)}`} className="block">
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-6 bg-gray-950">
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      width="450"
                      height="450"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                  <h2 className="text-lg font-bold font-display text-white group-hover:text-indigo-300 transition-colors">
                    {member.name}
                  </h2>
                  <p className="text-xs font-mono text-indigo-400 mb-4">{member.role}</p>
                  {member.bio && (
                    <p className="text-gray-400 text-xs md:text-sm line-clamp-4 leading-relaxed">
                      {member.bio}
                    </p>
                  )}
                  <span className="inline-block mt-5 text-xs font-semibold text-indigo-400">
                    View profile →
                  </span>
                </Link>

                {(member.socialLinkedin || member.socialGithub) && (
                  <div className="flex gap-3 mt-5 pt-5 border-t border-gray-900">
                    {member.socialLinkedin && (
                      <a href={member.socialLinkedin} target="_blank" rel="noreferrer" aria-label={`${member.name} on LinkedIn`}>
                        <Linkedin size={17} className="text-gray-500 hover:text-indigo-400" />
                      </a>
                    )}
                    {member.socialGithub && (
                      <a href={member.socialGithub} target="_blank" rel="noreferrer" aria-label={`${member.name} on GitHub`}>
                        <Github size={17} className="text-gray-500 hover:text-white" />
                      </a>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
