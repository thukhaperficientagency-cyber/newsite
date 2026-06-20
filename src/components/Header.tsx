import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ShieldAlert, LogOut, CheckCircle } from "lucide-react";
import { Settings } from "../types";
import { User } from "firebase/auth";
import { loginWithEmail, logoutUser } from "../lib/firebase";

interface HeaderProps {
  settings: Settings;
  adminUser: User | null;
  showAdmin: boolean;
  setShowAdmin: (show: boolean) => void;
  isAdminVerifiedLocal: boolean;
}

export default function Header({ 
  settings, 
  adminUser, 
  showAdmin, 
  setShowAdmin, 
  isAdminVerifiedLocal 
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showStatus, setShowStatus] = useState(false);

  const handleLogin = async () => {
    setAuthError("");
    try {
      const user = await loginWithGoogle();
      // If user logs in but isn't the config admin, notify them the site is read-only
      if (user.email !== "thukhaaung542981@gmail.com") {
        setAuthError("Logged in, but you hold public view privilege only. Full content management requires admin credentials.");
        setTimeout(() => setAuthError(""), 8000);
      } else {
        setShowStatus(true);
        setTimeout(() => {
          setShowStatus(false);
          setShowAdmin(true);
        }, 2000);
      }
    } catch (e: any) {
      setAuthError("Failed to initiate secure pop-up login. " + (e.message || ""));
    }
  };

  const navItems = [
    { name: "Services", href: "#services" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Team", href: "#team" },
    { name: "Blog", href: "#blog" },
    { name: "Contact", href: "#contact" }
  ];

  return (
    <header id="site_header" className="sticky top-0 z-40 bg-[#0d0f14]/85 backdrop-blur-md border-b border-gray-800/60">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Dynamic Logo */}
        <a href="#" className="flex items-center gap-3">
          {settings.logoUrl ? (
            <img 
              id="header_logo_img"
              src={settings.logoUrl} 
              alt={settings.brandName} 
              className="h-9 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div id="header_logo_text" className="text-xl md:text-2xl font-bold font-display tracking-tight text-white flex items-center">
              <span className="text-white">{settings.logoText.split(".")[0]}</span>
              {settings.logoText.includes(".") && (
                <span className="text-indigo-500 font-extrabold font-mono font-display">.</span>
              )}
            </div>
          )}
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <a 
              key={item.name} 
              href={item.href} 
              className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-medium tracking-wide"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Administration Controller */}
        <div className="hidden md:flex items-center gap-4">
          {adminUser ? (
            <div className="flex items-center gap-3 bg-[#131720] border border-gray-800 rounded-full py-1 pl-3 pr-2">
              <img 
                src={adminUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"} 
                alt="user" 
                className="w-6 h-6 rounded-full border border-gray-600"
              />
              <span className="text-xs text-gray-300 max-w-[120px] truncate font-medium">
                {isAdminVerifiedLocal ? "Admin Console" : "Public Viewer"}
              </span>
              <button 
                onClick={() => setShowAdmin(!showAdmin)}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
                  showAdmin 
                    ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" 
                    : "bg-indigo-500 text-white hover:bg-indigo-600 shadow-md shadow-indigo-500/10"
                }`}
              >
                {showAdmin ? "Close Panel" : "Open Panel"}
              </button>
              <button 
                onClick={logoutUser}
                title="Sign out"
                className="p-1 hover:text-red-400 text-gray-400 transition-colors"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button 
              id="admin_sign_in_btn"
              onClick={handleLogin}
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-300 hover:text-white bg-[#131720]/80 hover:bg-indigo-600 border border-gray-800 hover:border-indigo-500 rounded-full px-4 py-2 transition-all cursor-pointer"
            >
              <ShieldAlert size={14} className="text-indigo-400 group-hover:text-white" />
              <span>Control Panel</span>
            </button>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-3">
          {adminUser && (
            <button 
              onClick={() => {
                setShowAdmin(!showAdmin);
                setIsOpen(false);
              }}
              className="text-xs px-2.5 py-1.5 rounded-full bg-indigo-500 text-white font-medium text-center"
            >
              {showAdmin ? "Exit Panel" : "Dashboard"}
            </button>
          )}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-400 hover:text-white p-1 cursor-pointer"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Dynamic Popups for login statuses */}
      <AnimatePresence>
        {authError && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute left-6 right-6 top-22 p-4 rounded-xl bg-orange-950/90 border border-orange-500/40 text-orange-200 text-xs shadow-lg z-50 flex items-center gap-2"
          >
            <ShieldAlert size={16} className="text-orange-400 shrink-0" />
            <p>{authError}</p>
          </motion.div>
        )}

        {showStatus && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          >
            <div className="bg-[#121620] border border-green-500/30 p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-lg font-bold text-white font-display mb-1">Admin Verified</h3>
              <p className="text-gray-400 text-xs">Accessing control panel variables securely from Firebase...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-gray-800 bg-[#0d0f14] overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navItems.map((item) => (
                <a 
                  key={item.name} 
                  href={item.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-300 hover:text-white font-medium text-base tracking-wide"
                >
                  {item.name}
                </a>
              ))}
              <hr className="border-gray-800/80 my-2" />
              {adminUser ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={adminUser.photoURL || ""} 
                      alt="avatar" 
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="text-sm font-semibold text-white">{adminUser.displayName || "User"}</div>
                      <div className="text-xs text-gray-400">{isAdminVerifiedLocal ? "Authorized Administrator" : "Public Profile Viewer"}</div>
                    </div>
                  </div>
                  <button 
                    onClick={async () => {
                      await logoutUser();
                      setIsOpen(false);
                      setShowAdmin(false);
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-red-950/40 text-red-400 border border-red-900/40 py-2 rounded-xl text-sm font-medium hover:bg-red-900/20"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    handleLogin();
                    setIsOpen(false);
                  }}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm flex items-center justify-center gap-2"
                >
                  <ShieldAlert size={14} />
                  <span>Control Panel Access</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
