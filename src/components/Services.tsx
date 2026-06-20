import { ArrowUpRight, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { ServicePillar } from "../types";

interface ServicesProps {
  services: ServicePillar[];
}

export default function Services({ services }: ServicesProps) {
  const publishedServices = [...services]
    .filter((service) => service.status === "published")
    .sort((a, b) => (a.order || 99) - (b.order || 99));

  return (
    <section id="services" className="deferred-section py-24 bg-[#0a0c10] border-t border-gray-900 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center md:text-left mb-16">
          <span className="text-xs font-mono font-semibold text-indigo-400 tracking-widest uppercase block mb-3">
            Our Core Solutions
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white tracking-tight mb-4">
            Services Built for Myanmar Businesses
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl">
            Explore our dedicated service pillars, related case studies, and practical insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedServices.map((service) => (
            <article
              key={service.id}
              className="group p-8 rounded-2xl bg-[#0e1118]/60 border border-gray-900/60 hover:border-indigo-500/30 hover:bg-[#121620]/80 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20">
                <Layers className="text-indigo-400" size={24} aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-white font-display mb-3 group-hover:text-indigo-300">
                {service.title}
              </h3>
              <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-6">
                {service.shortDescription}
              </p>
              <Link
                to={`/services/${service.slug}`}
                className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Explore service <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/services" className="text-sm text-gray-300 hover:text-white">
            View all services →
          </Link>
        </div>
      </div>
    </section>
  );
}
