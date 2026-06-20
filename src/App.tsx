import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { Route, Routes } from "react-router-dom";
import {
  auth,
  checkIsAdmin,
  db
} from "./lib/firebase";
import {
  Settings,
  TeamMember,
  PortfolioProject,
  BlogPost
} from "./types";
import {
  seedDatabaseIfEmpty,
  DEFAULT_SETTINGS,
  DEFAULT_TEAM,
  DEFAULT_PORTFOLIO,
  DEFAULT_BLOGS
} from "./utils";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Team from "./components/Team";
import Blog from "./components/Blog";
import Footer from "./components/Footer";
import AdminDashboard from "./components/AdminDashboard";
import Seo from "./components/Seo";
import {
  BlogDetailPage,
  BlogListPage,
  CaseStudyDetailPage,
  CaseStudyListPage,
  NotFoundPage,
  TeamDetailPage,
  TeamListPage
} from "./pages/ContentPages";

export default function App() {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const [settings, setSettings] =
    useState<Settings>(DEFAULT_SETTINGS);

  const [team, setTeam] =
    useState<TeamMember[]>(DEFAULT_TEAM);

  const [portfolio, setPortfolio] =
    useState<PortfolioProject[]>(DEFAULT_PORTFOLIO);

  const [blogs, setBlogs] =
    useState<BlogPost[]>(DEFAULT_BLOGS);

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (!active) return;

        setAdminUser(user);

        if (!user) {
          setIsAdminVerified(false);
          setShowAdmin(false);
          return;
        }

        let hasAdminAccess = false;

        try {
          hasAdminAccess = await checkIsAdmin(user.uid);
        } catch (error) {
          console.error("Admin verification failed:", error);
        }

        if (!active) return;

        setIsAdminVerified(hasAdminAccess);

        if (!hasAdminAccess) {
          setShowAdmin(false);
        }
      }
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    seedDatabaseIfEmpty().then((seeded) => {
      if (seeded) {
        console.log("Database initialized successfully.");
      }
    });

    const unsubscribeSettings = onSnapshot(
      doc(db, "settings", "config"),
      (snapshot) => {
        if (snapshot.exists()) {
          setSettings(snapshot.data() as Settings);
        }
      },
      (error) => {
        console.log("Using default settings:", error);
      }
    );

    const unsubscribeTeam = onSnapshot(
      collection(db, "team"),
      (snapshot) => {
        if (!snapshot.empty) {
          const members: TeamMember[] = [];

          snapshot.forEach((item) => {
            members.push(item.data() as TeamMember);
          });

          setTeam(members);
        }
      },
      (error) => {
        console.log("Using default team:", error);
      }
    );

    const unsubscribePortfolio = onSnapshot(
      collection(db, "portfolio"),
      (snapshot) => {
        if (!snapshot.empty) {
          const projects: PortfolioProject[] = [];

          snapshot.forEach((item) => {
            projects.push(
              item.data() as PortfolioProject
            );
          });

          setPortfolio(projects);
        }
      },
      (error) => {
        console.log("Using default portfolio:", error);
      }
    );

    let unsubscribeBlogs: () => void;

    if (isAdminVerified) {
      unsubscribeBlogs = onSnapshot(
        collection(db, "blog"),
        (snapshot) => {
          const posts: BlogPost[] = [];

          snapshot.forEach((item) => {
            posts.push(item.data() as BlogPost);
          });

          setBlogs(posts);
        },
        (error) => {
          console.error("Admin blog read failed:", error);
        }
      );
    } else {
      unsubscribeBlogs = onSnapshot(
        query(
          collection(db, "blog"),
          where("status", "==", "published")
        ),
        (snapshot) => {
          if (!snapshot.empty) {
            const posts: BlogPost[] = [];

            snapshot.forEach((item) => {
              posts.push(item.data() as BlogPost);
            });

            setBlogs(posts);
          }
        },
        (error) => {
          console.log("Using default blogs:", error);
        }
      );
    }

    return () => {
      unsubscribeSettings();
      unsubscribeTeam();
      unsubscribePortfolio();
      unsubscribeBlogs();
    };
  }, [isAdminVerified]);

  if (
    showAdmin &&
    adminUser &&
    isAdminVerified
  ) {
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

  return (
    <div className="min-h-screen bg-[#0d0f14] text-[#f3f4f6] relative flex flex-col justify-between">
      <Header
        settings={settings}
        adminUser={adminUser}
        showAdmin={showAdmin}
        setShowAdmin={setShowAdmin}
        isAdminVerifiedLocal={isAdminVerified}
      />

      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Seo
                  title={`${settings.brandName} | Digital Product Engineering`}
                  description={
                    settings.heroSubtitle ||
                    "Digital product engineering, design, SEO, and growth services."
                  }
                  image={settings.logoUrl}
                />
                <Hero settings={settings} />
                <Services />
                <Portfolio projects={portfolio} />
                <Team members={team} />
                <Blog blogs={blogs} />
              </>
            }
          />
          <Route
            path="/team"
            element={<TeamListPage members={team} settings={settings} />}
          />
          <Route
            path="/team/:id"
            element={<TeamDetailPage members={team} settings={settings} />}
          />
          <Route
            path="/case-studies"
            element={<CaseStudyListPage projects={portfolio} settings={settings} />}
          />
          <Route
            path="/case-studies/:id"
            element={<CaseStudyDetailPage projects={portfolio} settings={settings} />}
          />
          <Route
            path="/blog"
            element={<BlogListPage blogs={blogs} settings={settings} />}
          />
          <Route
            path="/blog/:slug"
            element={<BlogDetailPage blogs={blogs} settings={settings} />}
          />
          <Route path="*" element={<NotFoundPage settings={settings} />} />
        </Routes>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
