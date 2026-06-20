import { Linkedin, Github, Users } from "lucide-react";
import { TeamMember } from "../types";

interface TeamProps {
  members: TeamMember[];
}

export default function Team({ members }: TeamProps) {
  // Sort members by order
  const sortedMembers = [...members].sort((a, b) => (a.order || 99) - (b.order || 99));

  return (
    <section id="team" className="py-24 bg-[#0a0c10] border-t border-gray-950 relative">
      <div className="absolute bottom-1/4 left-1/3 w-[250px] h-[250px] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-semibold text-indigo-400 tracking-widest uppercase block mb-3">Our Squad</span>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white tracking-tight mb-3">
            Principal Product Sculptors
          </h2>
          <p className="text-gray-400 text-xs md:text-sm max-w-xl mx-auto">
            Our engineers and developers lead with deep technical rigor, crafting high-performance layouts that remain stable under any scale.
          </p>
        </div>

        {sortedMembers.length === 0 ? (
          <div className="p-16 rounded-2xl bg-[#090b0f] border border-gray-900 border-dashed text-center flex flex-col items-center">
            <Users className="text-gray-600 mb-4" size={36} />
            <p className="text-gray-400 text-sm font-medium">No team profiles loaded yet.</p>
            <p className="text-gray-600 text-xs mt-1">Manage profiles dynamically in the Control Panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedMembers.map((member) => (
              <div 
                key={member.id} 
                className="group bg-[#0e1118]/60 p-6 rounded-2xl border border-gray-900/60 hover:border-gray-800 hover:bg-[#121620]/70 transition-all flex flex-col"
              >
                {/* Photo */}
                <div className="relative aspect-square rounded-xl overflow-hidden mb-6 bg-gray-950">
                  <img
                    src={member.photoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=450"}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-102"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Social hover shortcuts */}
                  {(member.socialLinkedin || member.socialGithub) && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                      {member.socialLinkedin && (
                        <a 
                          href={member.socialLinkedin} 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-indigo-600 transition-all flex items-center justify-center"
                        >
                          <Linkedin size={18} />
                        </a>
                      )}
                      {member.socialGithub && (
                        <a 
                          href={member.socialGithub} 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#0d0f14] transition-all flex items-center justify-center"
                        >
                          <Github size={18} />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Profile Text */}
                <h3 className="text-lg font-bold font-display text-white group-hover:text-indigo-300 transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs font-mono text-indigo-400 mb-4">{member.role}</p>
                {member.bio && (
                  <p className="text-gray-400 text-xs md:text-sm line-clamp-4 leading-relaxed">
                    {member.bio}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
