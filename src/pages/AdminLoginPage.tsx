import { FormEvent, useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import {
  checkIsAdmin,
  loginWithEmail,
  logoutUser
} from "../lib/firebase";

interface AdminLoginPageProps {
  onVerified: () => void;
}

export default function AdminLoginPage({
  onVerified
}: AdminLoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    document.title = "Administrator";

    let robotsMeta = document.head.querySelector<HTMLMetaElement>(
      'meta[name="robots"]'
    );

    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.name = "robots";
      document.head.appendChild(robotsMeta);
    }

    const previousContent = robotsMeta.content;
    robotsMeta.content = "noindex, nofollow, noarchive";

    return () => {
      robotsMeta.content = previousContent || "index, follow";
    };
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoggingIn(true);

    try {
      const user = await loginWithEmail(email, password);
      const isAdmin = await checkIsAdmin(user.uid);

      if (!isAdmin) {
        await logoutUser();
        setErrorMessage("ဒီ account မှာ administrator access မရှိပါ။");
        return;
      }

      setPassword("");
      onVerified();
    } catch (error: any) {
      const code = error?.code;

      if (
        code === "auth/invalid-credential" ||
        code === "auth/wrong-password" ||
        code === "auth/user-not-found"
      ) {
        setErrorMessage("Email သို့မဟုတ် password မှားနေပါတယ်။");
      } else if (code === "auth/too-many-requests") {
        setErrorMessage("Login အကြိမ်များလွန်းနေပါတယ်။ ခဏနားပြီး ပြန်စမ်းပါ။");
      } else {
        setErrorMessage(error?.message || "Login မအောင်မြင်ပါ။");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080a0e] flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-[#121620] border border-gray-800 rounded-2xl p-7 shadow-2xl"
      >
        <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-5">
          <ShieldAlert size={24} aria-hidden="true" />
        </div>

        <h1 className="text-xl font-bold text-white mb-1">Administrator</h1>
        <p className="text-xs text-gray-400 mb-6">
          Authorized access only.
        </p>

        <label htmlFor="admin-email" className="block text-xs text-gray-400 mb-2">
          Email address
        </label>
        <input
          id="admin-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
          className="w-full mb-4 rounded-xl bg-[#090b0f] border border-gray-800 focus:border-indigo-500 outline-none p-3 text-sm text-white"
        />

        <label htmlFor="admin-password" className="block text-xs text-gray-400 mb-2">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
          className="w-full mb-4 rounded-xl bg-[#090b0f] border border-gray-800 focus:border-indigo-500 outline-none p-3 text-sm text-white"
        />

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-800/50 text-red-300 text-xs">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoggingIn}
          className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 p-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isLoggingIn ? "Signing in..." : "Login"}
        </button>
      </form>
    </main>
  );
}
