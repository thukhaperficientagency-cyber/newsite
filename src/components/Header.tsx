import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { Settings } from "../types";

interface HeaderProps {
  settings: Settings;
}

export default function Header({ settings }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Services", href: "/#services" },
    { name: "Portfolio", href: "/case-studies" },
    { name: "Team", href: "/team" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/#contact" }
  ];

  return (
    <header
      id="site_header"
      className="sticky top-0 z-40 bg-[#0d0f14]/95 border-b border-gray-800/60"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3" aria-label={`${settings.brandName} home`}>
          {settings.logoUrl ? (
            <img
              id="header_logo_img"
              src={settings.logoUrl}
              alt={settings.brandName}
              width="180"
              height="36"
              className="h-9 w-auto object-contain"
            />
          ) : (
            <div className="text-xl md:text-2xl font-bold font-display tracking-tight text-white">
              <span>{settings.logoText.split(".")[0]}</span>
              {settings.logoText.includes(".") && (
                <span className="text-indigo-500">.</span>
              )}
            </div>
          )}
        </a>

        <nav className="hidden md:flex items-center gap-10" aria-label="Main navigation">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium tracking-wide"
            >
              {item.name}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          className="md:hidden text-gray-400 hover:text-white p-2"
        >
          {isOpen ? (
            <X size={24} aria-hidden="true" />
          ) : (
            <Menu size={24} aria-hidden="true" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-gray-800 bg-[#0d0f14] overflow-hidden"
            aria-label="Mobile navigation"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-300 hover:text-white font-medium"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
