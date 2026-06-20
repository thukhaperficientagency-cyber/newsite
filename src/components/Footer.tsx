import { 
  Facebook, 
  Linkedin, 
  Github, 
  ArrowUp, 
  Mail, 
  Phone, 
  MapPin, 
  Activity 
} from "lucide-react";
import { Settings } from "../types";

interface FooterProps {
  settings: Settings;
}

export default function Footer({ settings }: FooterProps) {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="contact" className="bg-[#080a0e] pt-20 pb-10 border-t border-gray-900 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-gray-900">
          {/* Brand block (dynamic logo textual/image) */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <a href="#" className="inline-flex items-center gap-3">
              {settings.logoUrl ? (
                <img 
                  src={settings.logoUrl} 
                  alt={settings.brandName} 
                  width="160"
                  height="32"
                  loading="lazy"
                  decoding="async"
                  className="h-8 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-xl md:text-2xl font-bold font-display tracking-tight text-white">
                  <span>{settings.logoText.split(".")[0]}</span>
                  {settings.logoText.includes(".") && <span className="text-indigo-500 font-extrabold font-mono font-display">.</span>}
                </div>
              )}
            </a>
            
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed max-w-sm">
              {settings.tagline || "Engineering digital dominance with modern, serverless stacks, straight-A Core Web Vitals, and responsive layouts."}
            </p>

            {/* Social paths */}
            <div className="flex items-center gap-4">
              {settings.facebookUrl && (
                <a 
                  href={settings.facebookUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  aria-label="Visit Perficient Agency on Facebook"
                  className="w-8 h-8 rounded-full bg-gray-900 hover:bg-indigo-600 hover:text-white text-gray-400 border border-gray-800 transition-all flex items-center justify-center cursor-pointer"
                >
                  <Facebook size={14} aria-hidden="true" />
                </a>
              )}
              {settings.linkedinUrl && (
                <a 
                  href={settings.linkedinUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  aria-label="Visit Perficient Agency on LinkedIn"
                  className="w-8 h-8 rounded-full bg-gray-900 hover:bg-indigo-600 hover:text-white text-gray-400 border border-gray-800 transition-all flex items-center justify-center cursor-pointer"
                >
                  <Linkedin size={14} aria-hidden="true" />
                </a>
              )}
              {settings.githubUrl && (
                <a 
                  href={settings.githubUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  aria-label="Visit Perficient Agency on GitHub"
                  className="w-8 h-8 rounded-full bg-gray-900 hover:bg-indigo-600 hover:text-white text-gray-400 border border-gray-800 transition-all flex items-center justify-center cursor-pointer"
                >
                  <Github size={14} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-gray-300">Quick Anchors</h4>
            <ul className="flex flex-col gap-2.5 text-xs md:text-sm text-gray-400">
              <li><a href="#services" className="hover:text-white transition-colors">Services Directory</a></li>
              <li><a href="#portfolio" className="hover:text-white transition-colors">Digital Case Studies</a></li>
              <li><a href="#team" className="hover:text-white transition-colors">Squad Members</a></li>
              <li><a href="#blog" className="hover:text-white transition-colors">Search Blog Insights</a></li>
            </ul>
          </div>

          {/* Contacts information */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-gray-300">Get in Touch</h4>
            <ul className="flex flex-col gap-4 text-xs md:text-sm text-gray-400">
              {settings.email && (
                <li className="flex items-center gap-3">
                  <Mail className="text-indigo-400 shrink-0" size={14} />
                  <a href={`mailto:${settings.email}`} className="hover:text-indigo-300 transition-colors truncate">{settings.email}</a>
                </li>
              )}
              {settings.phone && (
                <li className="flex items-center gap-3">
                  <Phone className="text-indigo-400 shrink-0" size={14} />
                  <a href={`tel:${settings.phone}`} className="hover:text-indigo-300 transition-colors whitespace-nowrap">{settings.phone}</a>
                </li>
              )}
              {settings.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="text-indigo-400 shrink-0 mt-0.5" size={14} />
                  <span className="leading-snug">{settings.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom micro-metrics line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[10px] text-gray-500 font-mono flex items-center gap-2">
            <Activity size={10} className="text-green-500 animate-pulse" />
            <span>© 2026 {settings.brandName}. All rights reserved under local compliance.</span>
          </div>

          <button 
            type="button"
            onClick={handleScrollTop}
            aria-label="Scroll back to top"
            className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 hover:border-indigo-500/30 text-gray-400 hover:text-white transition-all cursor-pointer"
            title="Scroll back to top"
          >
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
