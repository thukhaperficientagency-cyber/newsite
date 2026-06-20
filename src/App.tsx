import { useState, useEffect } from "react";
import { 
  collection, 
  doc, 
  onSnapshot, 
  query, 
  where 
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { db, auth, handleFirestoreError } from "./lib/firebase";
import { 
  Settings, 
  TeamMember, 
  PortfolioProject, 
  BlogPost, 
  OperationType 
} from "./types";
import { 
  seedDatabaseIfEmpty, 
  DEFAULT_SETTINGS, 
  DEFAULT_TEAM, 
  DEFAULT_PORTFOLIO, 
  DEFAULT_BLOGS 
} from "./utils";

// Component imports
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Team from "./components/Team";
import Blog from "./components/Blog";
import Footer from "./components/Footer";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);

  // Core Website State variables
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [team, setTeam] = useState<TeamMember[]>(DEFAULT_TEAM);
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>(DEFAULT_PORTFOLIO);
  const [blogs, setBlogs] = useState<BlogPost[]>(DEFAULT_BLOGS);

  // Authenticated Admin check helper
  const isAdminVerifiedLocal = adminUser !== null 
    && adminUser.email === "thukhaaung542981@gmail.com";

  // Bootstrap Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAdminUser(user);
    });
    return unsubscribe;
  }, []);

  // Bootstrap Database Seeding and Sync Listeners
  useEffect(() => {
    // Attempt auto-seeding if entirely empty
    seedDatabaseIfEmpty().then((seeded) => {
      if (seeded) {
        console.log("Database initialized with modern agency layout.");
      }
    });

    // 1. Sync global settings
    const unsubSettings = onSnapshot(
      doc(db, "settings", "config"),
      (docSnap) => {
        if (docSnap.exists()) {
          setSettings(docSnap.data() as Settings);
        }
      },
      (error) => {
        console.log("Using local default fallback settings because Firebase is syncing or requires auth.", error);
      }
    );

    // 2. Sync Team members profiles
    const unsubTeam = onSnapshot(
      collection(db, "team"),
      (snapshot) => {
        if (!snapshot.empty) {
          const membersList: TeamMember[] = [];
          snapshot.forEach((snap) => {
            membersList.push(snap.data() as TeamMember);
          });
          setTeam(membersList);
        }
      },
      (error) => {
        console.log("Using local default team members profiles.", error);
      }
    );

    // 3. Sync Case Studies Portfolio showcase
    const unsubPortfolio = onSnapshot(
      collection(db, "portfolio"),
      (snapshot) => {
        if (!snapshot.empty) {
          const projectList: PortfolioProject[] = [];
          snapshot.forEach((snap) => {
            projectList.push(snap.data() as PortfolioProject);
          });
          setPortfolio(projectList);
        }
      },
      (error) => {
        console.log("Using local default case studies.", error);
      }
    );

    // 4. Sync Blogs List (Conditional query based on Admin view status)
    // Secure listener: Public only sees "published", verified admin sees all (draft + published)
    let unsubBlog: () => void;

    if (isAdminVerifiedLocal) {
      unsubBlog = onSnapshot(
        collection(db, "blog"),
        (snapshot) => {
          if (!snapshot.empty) {
            const blogList: BlogPost[] = [];
            snapshot.forEach((snap) => {
              blogList.push(snap.data() as BlogPost);
            });
            setBlogs(blogList);
          }
        },
        (err) => {
          console.error("Private blog read rejected.", err);
        }
      );
    } else {
      unsubBlog = onSnapshot(
        query(collection(db, "blog"), where("status", "==", "published")),
        (snapshot) => {
          if (!snapshot.empty) {
            const blogList: BlogPost[] = [];
            snapshot.forEach((snap) => {
              blogList.push(snap.data() as BlogPost);
            });
            setBlogs(blogList);
          }
        },
        (err) => {
          console.log("Using fallback published blog articles.", err);
        }
      );
    }

    // Set loading off after core snapshot tries
    const timer = setTimeout(() => setLoading(false), 800);

    return () => {
      unsubSettings();
      unsubTeam();
      unsubPortfolio();
      unsubBlog();
      clearTimeout(timer);
    };
  }, [isAdminVerifiedLocal]);

  // Loading Splash Screen layout
  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090d] flex flex-col items-center justify-center text-center p-6 font-display">
        <div className="w-12 h-12 border-t-2 border-indigo-500 border-solid rounded-full animate-spin mb-4" />
        <h3 className="text-white text-sm font-semibold tracking-wider uppercase font-mono">Loading Agency Environment...</h3>
        <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-1 font-mono">Connecting with secure Firestore nodes</p>
      </div>
    );
  }

  // Active secure admin console rendering overlay
  if (showAdmin && isAdminVerifiedLocal) {
    return (
      <AdminDashboard 
        settings={settings}
        setSettings={setSettings}
        team={team}
        setTeam={setTeam}
        portfolio={portfolio}
        setPortfolio={setPortfolio}
        blogs={blogs}
        setBlogs={setBlogs}
        onClose={() => setShowAdmin(false)}
      />
    );
  }

  // Public visitor website landing page
  return (
    <div className="min-h-screen bg-[#0d0f14] text-[#f3f4f6] relative flex flex-col justify-between selection:bg-indigo-600 selection:text-white">
      {/* Header and top brand navigation */}
      <Header 
        settings={settings} 
        adminUser={adminUser}
        showAdmin={showAdmin}
        setShowAdmin={setShowAdmin}
        isAdminVerifiedLocal={isAdminVerifiedLocal}
      />

      {/* Main Agency Content */}
      <main className="flex-grow">
        {/* Dynamic Hero banner */}
        <Hero settings={settings} />

        {/* Modular services directory */}
        <Services />

        {/* Case Studies Portfolio */}
        <Portfolio projects={portfolio} />

        {/* Team profiles */}
        <Team members={team} />

        {/* Engineering blog Insights */}
        <Blog blogs={blogs} />
      </main>

      {/* dynamic brand Footer & social paths */}
      <Footer settings={settings} />
    </div>
  );
}
