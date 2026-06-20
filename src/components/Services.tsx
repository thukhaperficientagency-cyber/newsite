import { 
  Terminal, 
  Layers, 
  Search, 
  Smartphone, 
  CloudLightning, 
  BarChart3 
} from "lucide-react";

export default function Services() {
  const servicesList = [
    {
      icon: <Layers className="text-indigo-400 group-hover:text-indigo-300" size={24} />,
      title: "Interactive Fullstack Engineering",
      desc: "Architecting high-performance single-page experiences and micro-apps using React, state dehydration hooks, and low-latency Firebase datastores."
    },
    {
      icon: <Search className="text-cyan-400 group-hover:text-cyan-300" size={24} />,
      title: "Structural SEO & Core Web Vitals",
      desc: "Reaching premium organic ranks. We configure correct search schema JSON-LD scripts, bundle payloads, and asset decompression schedules to guarantee straight A's."
    },
    {
      icon: <CloudLightning className="text-amber-400 group-hover:text-amber-300" size={24} />,
      title: "Headless Decoupled Deployments",
      desc: "Isolating database consoles from the public frontend. This makes your client page load instantly, guarantees bulletproof defense, and reduces server bills to zero."
    },
    {
      icon: <Terminal className="text-rose-400 group-hover:text-rose-300" size={24} />,
      title: "Interactive Content Management Systems",
      desc: "Creating tailored secure dashboards and controls. Easily change logo, contacts, teams, or write custom blog posts in full markdown without editing code."
    },
    {
      icon: <Smartphone className="text-purple-400 group-hover:text-purple-300" size={24} />,
      title: "Responsive Interface Personas",
      desc: "Ensuring 100% adaptive layouts across mobile, tablets, and wide screens with smooth micro-animations, fast touch-targets, and responsive font multipliers."
    },
    {
      icon: <BarChart3 className="text-emerald-400 group-hover:text-emerald-300" size={24} />,
      title: "Growth Metrics & Custom Funnels",
      desc: "Integrating lightweight, compliance-friendly tracking endpoints to analyze click streams, site heatmaps, and query conversions without slowing down loading."
    }
  ];

  return (
    <section id="services" className="py-24 bg-[#0a0c10] border-t border-gray-900 relative">
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[250px] h-[250px] bg-indigo-500/5 rounded-full blur-[90px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center md:text-left mb-16">
          <span className="text-xs font-mono font-semibold text-indigo-400 tracking-widest uppercase block mb-3">Our Core Solutions</span>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white tracking-tight mb-4">
            How We Command Search Authority
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl">
            We don't do templates. We engineer blazing-fast client applications tailored to pass raw quality checks and push your agency metrics to the maximum.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((srv, index) => (
            <div 
              key={index}
              className="group p-8 rounded-2xl bg-[#0e1118]/60 border border-gray-900/60 hover:border-gray-800 hover:bg-[#121620]/80 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-900/80 group-hover:bg-indigo-950/20 flex items-center justify-center mb-6 transition-all border border-gray-800/50 group-hover:border-indigo-500/20">
                {srv.icon}
              </div>
              <h3 className="text-lg font-bold text-white font-display mb-3 group-hover:text-indigo-300 transition-colors">
                {srv.title}
              </h3>
              <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                {srv.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
