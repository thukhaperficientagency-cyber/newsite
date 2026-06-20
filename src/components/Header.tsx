import { FormEvent, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  X,
  ShieldAlert,
  LogOut,
  CheckCircle
} from "lucide-react";
import { User } from "firebase/auth";
import { Settings } from "../types";
import {
  checkIsAdmin,
  loginWithEmail,
  logoutUser
} from "../lib/firebase";

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
  const [showLogin, setShowLogin] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();

    setAuthError("");
    setIsLoggingIn(true);

    try {
      const user = await loginWithEmail(
        loginEmail,
        loginPassword
      );

      const hasAdminAccess = await checkIsAdmin(user.uid);

      if (!hasAdminAccess) {
        await logoutUser();
        setAuthError("ဒီ account မှာ administrator access မရှိပါ။");
        return;
      }

      setShowLogin(false);
      setLoginPassword("");
      setShowStatus(true);

      setTimeout(() => {
        setShowStatus(false);
        setShowAdmin(true);
      }, 1000);
    } catch (error: any) {
      const errorCode = error?.code;

      if (
        errorCode === "auth/invalid-credential" ||
        errorCode === "auth/wrong-password" ||
        errorCode === "auth/user-not-found"
      ) {
        setAuthError("Email သို့မဟုတ် password မှားနေပါတယ်။");
      } else if (errorCode === "auth/too-many-requests") {
        setAuthError(
          "Login အကြိမ်များလွန်းနေပါတယ်။ ခဏနားပြီး ပြန်စမ်းပါ။"
        );
      } else {
        setAuthError(error?.message || "Login မအောင်မြင်ပါ။");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setShowAdmin(false);
    setIsOpen(false);
  };

  const navItems = [
    { name: "Services", href: "#services" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Team", href: "#team" },
    { name: "Blog", href: "#blog" },
    { name: "Contact", href: "#contact" }
  ];

  return (
    <header
      id="site_header"
      className="sticky top-0 z-40 bg-[#0d0f14]/85 backdrop-blur-md border-b border-gray-800/60"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
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
            <div
              id="header_logo_text"
              className="text-xl md:text-2xl font-bold font-display tracking-tight text-white flex items-center"
            >
              <span className="text-white">
                {settings.logoText.split(".")[0]}
              </span>

              {settings.logoText.includes(".") && (
                <span className="text-indigo-500 font-extrabold font-mono">
                  .
                </span>
              )}
            </div>
          )}
        </a>

        <nav className="hidden md:flex items-center gap-10">
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

        <div className="hidden md:flex items-center gap-4">
          {adminUser && isAdminVerifiedLocal ? (
            <div className="flex items-center gap-3 bg-[#131720] border border-gray-800 rounded-full py-1 pl-3 pr-2">
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                {adminUser.email?.charAt(0).toUpperCase() || "A"}
              </div>

              <span className="text-xs text-gray-300 max-w-[140px] truncate">
                Admin Console
              </span>

              <button
                onClick={() => setShowAdmin(!showAdmin)}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
                  showAdmin
                    ? "bg-red-500/20 text-red-400"
                    : "bg-indigo-500 text-white"
                }`}
              >
                {showAdmin ? "Close Panel" : "Open Panel"}
              </button>

              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-1 hover:text-red-400 text-gray-400"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              id="admin_sign_in_btn"
              onClick={() => {
                setAuthError("");
                setShowLogin(true);
              }}
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-300 hover:text-white bg-[#131720]/80 hover:bg-indigo-600 border border-gray-800 hover:border-indigo-500 rounded-full px-4 py-2 transition-all"
            >
              <ShieldAlert size={14} className="text-indigo-400" />
              <span>Control Panel</span>
            </button>
          )}
        </div>

        <div className="flex md:hidden items-center gap-3">
          {adminUser && isAdminVerifiedLocal && (
            <button
              onClick={() => {
                setShowAdmin(!showAdmin);
                setIsOpen(false);
              }}
              className="text-xs px-2.5 py-1.5 rounded-full bg-indigo-500 text-white"
            >
              {showAdmin ? "Exit Panel" : "Dashboard"}
            </button>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-400 hover:text-white p-1"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.form
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleLogin}
              className="w-full max-w-sm bg-[#121620] border border-gray-800 rounded-2xl p-7 shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-5">
                <ShieldAlert size={24} />
              </div>

              <h2 className="text-xl font-bold text-white mb-1">
                Admin Login
              </h2>

              <p className="text-xs text-gray-400 mb-6">
                Control Panel ဝင်ရန် email နှင့် password ထည့်ပါ။
              </p>

              <label className="block text-xs text-gray-400 mb-2">
                Email address
              </label>

              <input
                type="email"
                value={loginEmail}
                onChange={(event) =>
                  setLoginEmail(event.target.value)
                }
                placeholder="admin@example.com"
                autoComplete="email"
                required
                className="w-full mb-4 rounded-xl bg-[#090b0f] border border-gray-800 focus:border-indigo-500 outline-none p-3 text-sm text-white"
              />

              <label className="block text-xs text-gray-400 mb-2">
                Password
              </label>

              <input
                type="password"
                value={loginPassword}
                onChange={(event) =>
                  setLoginPassword(event.target.value)
                }
                placeholder="Enter password"
                autoComplete="current-password"
                required
                className="w-full mb-4 rounded-xl bg-[#090b0f] border border-gray-800 focus:border-indigo-500 outline-none p-3 text-sm text-white"
              />

              {authError && (
                <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-800/50 text-red-300 text-xs">
                  {authError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowLogin(false);
                    setAuthError("");
                    setLoginPassword("");
                  }}
                  className="flex-1 rounded-xl border border-gray-700 p-3 text-sm text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 p-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {isLoggingIn ? "Signing in..." : "Login"}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}

        {showStatus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          >
            <div className="bg-[#121620] border border-green-500/30 p-8 rounded-2xl max-w-sm w-full text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 mb-4">
                <CheckCircle size={32} />
              </div>

              <h3 className="text-lg font-bold text-white mb-1">
                Admin Verified
              </h3>

              <p className="text-gray-400 text-xs">
                Firebase မှ administrator permission စစ်ဆေးပြီးပါပြီ။
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                  className="text-gray-300 hover:text-white font-medium"
                >
                  {item.name}
                </a>
              ))}

              <hr className="border-gray-800 my-2" />

              {adminUser && isAdminVerifiedLocal ? (
                <div className="flex flex-col gap-3">
                  <div className="text-sm text-white">
                    Administrator
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 bg-red-950/40 text-red-400 border border-red-900/40 py-2 rounded-xl"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setAuthError("");
                    setShowLogin(true);
                  }}
                  className="w-full py-3 rounded-xl bg-indigo-600 text-white text-sm flex items-center justify-center gap-2"
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
