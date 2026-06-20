import { lazy, Suspense, useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { Route, Routes, useNavigate } from "react-router-dom";
import {
  auth,
  checkIsAdmin,
  db
} from "./lib/firebase";
import {
  Settings,
  TeamMember,
  PortfolioProject,
  BlogPost,
  ServicePillar
} from "./types";
import {
  seedDatabaseIfEmpty,
  DEFAULT_SETTINGS,
  DEFAULT_TEAM,
  DEFAULT_PORTFOLIO,
  DEFAULT_BLOGS,
  DEFAULT_SERVICES,
  seedServicesIfEmpty
} from "./utils";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Team from "./components/Team";
import Blog from "./components/Blog";
import Footer from "./components/Footer";
import FloatingViber from "./components/FloatingViber";
import Seo from "./components/Seo";
import ContactForm from "./components/ContactForm";

const AdminDashboard = lazy(
  () => import("./components/AdminDashboard")
);

const AdminLoginPage = lazy(
  () => import("./pages/AdminLoginPage")
);

const contentPagesImport = () => import("./pages/ContentPages");

const BlogDetailPage = lazy(() =>
  contentPagesImport().then((module) => ({
    default: module.BlogDetailPage
  }))
);

const BlogListPage = lazy(() =>
  contentPagesImport().then((module) => ({
    default: module.BlogListPage
  }))
);

const CaseStudyDetailPage = lazy(() =>
  contentPagesImport().then((module) => ({
    default: module.CaseStudyDetailPage
  }))
);

const CaseStudyListPage = lazy(() =>
  contentPagesImport().then((module) => ({
    default: module.CaseStudyListPage
  }))
);

const NotFoundPage = lazy(() =>
  contentPagesImport().then((module) => ({
    default: module.NotFoundPage
  }))
);

const TeamDetailPage = lazy(() =>
  contentPagesImport().then((module) => ({
    default: module.TeamDetailPage
  }))
);

const TeamListPage = lazy(() =>
  contentPagesImport().then((module) => ({
    default: module.TeamListPage
  }))
);

const ServiceListPage = lazy(() =>
  contentPagesImport().then((module) => ({
    default: module.ServiceListPage
  }))
);

const ServiceDetailPage = lazy(() =>
  contentPagesImport().then((module) => ({
    default: module.ServiceDetailPage
  }))
);

export default function App() {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [isAdminVerified, setIsAdminVerified] = useState(false);

  const [settings, setSettings] =
    useState<Settings>(DEFAULT_SETTINGS);

  const [team, setTeam] =
    useState<TeamMember[]>(DEFAULT_TEAM);

  const [portfolio, setPortfolio] =
    useState<PortfolioProject[]>(DEFAULT_PORTFOLIO);

  const [blogs, setBlogs] =
    useState<BlogPost[]>(DEFAULT_BLOGS);

  const [services, setServices] =
    useState<ServicePillar[]>(DEFAULT_SERVICES);

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (!active) return;

        setAdminUser(user);

        if (!user) {
          setIsAdminVerified(false);
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

      }
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isAdminVerified) {
      seedServicesIfEmpty();
    }
  }, [isAdminVerified]);

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

    const servicesQuery = isAdminVerified
      ? collection(db, "services")
      : query(
          collection(db, "services"),
          where("status", "==", "published")
        );

    const unsubscribeServices = onSnapshot(
      servicesQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const serviceItems: ServicePillar[] = [];
          snapshot.forEach((item) => {
            serviceItems.push(item.data() as ServicePillar);
          });
          setServices(serviceItems);
        }
      },
      (error) => {
        console.log("Using default services:", error);
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
      unsubscribeServices();
      unsubscribeBlogs();
    };
  }, [isAdminVerified]);

  return (
    <div className="min-h-screen bg-[#0d0f14] text-[#f3f4f6] relative flex flex-col justify-between">
      <main className="flex-grow">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route
              path="/admin"
              element={
                adminUser && isAdminVerified ? (
                  <AdminDashboard
                    settings={settings}
                    setSettings={setSettings}
                    team={team}
                    setTeam={setTeam}
                    portfolio={portfolio}
                    setPortfolio={setPortfolio}
                    blogs={blogs}
                    setBlogs={setBlogs}
                    services={services}
                    setServices={setServices}
                    onClose={() => {
                      navigate("/");
                    }}
                  />
                ) : (
                  <AdminLoginPage onVerified={() => undefined} />
                )
              }
            />
            <Route
              path="/"
              element={
                <>
                  <Header settings={settings} />
                  <Seo
                    title={`${settings.brandName} | Digital Product Engineering`}
                    description={
                      settings.heroSubtitle ||
                      "Digital product engineering, design, SEO, and growth services."
                    }
                    image={settings.logoUrl}
                  />
                  <Hero settings={settings} />
                  <Services services={services} />
                  <Portfolio projects={portfolio} />
                  <Team members={team} />
                  <Blog blogs={blogs} />
                  <ContactForm services={services} settings={settings} />
                  <Footer settings={settings} />
                  <FloatingViber settings={settings} />
                </>
              }
            />
            <Route
              path="/services"
              element={
                <>
                  <Header settings={settings} />
                  <ServiceListPage services={services} settings={settings} />
                  <Footer settings={settings} />
                  <FloatingViber settings={settings} />
                </>
              }
            />
            <Route
              path="/services/:slug"
              element={
                <>
                  <Header settings={settings} />
                  <ServiceDetailPage
                    services={services}
                    blogs={blogs}
                    projects={portfolio}
                    settings={settings}
                  />
                  <Footer settings={settings} />
                  <FloatingViber settings={settings} />
                </>
              }
            />
            <Route
              path="/team"
              element={
                <>
                  <Header settings={settings} />
                  <TeamListPage members={team} settings={settings} />
                  <Footer settings={settings} />
                  <FloatingViber settings={settings} />
                </>
              }
            />
            <Route
              path="/team/:id"
              element={
                <>
                  <Header settings={settings} />
                  <TeamDetailPage members={team} settings={settings} />
                  <Footer settings={settings} />
                  <FloatingViber settings={settings} />
                </>
              }
            />
            <Route
              path="/case-studies"
              element={
                <>
                  <Header settings={settings} />
                  <CaseStudyListPage projects={portfolio} settings={settings} />
                  <Footer settings={settings} />
                  <FloatingViber settings={settings} />
                </>
              }
            />
            <Route
              path="/case-studies/:id"
              element={
                <>
                  <Header settings={settings} />
                  <CaseStudyDetailPage
                    projects={portfolio}
                    services={services}
                    settings={settings}
                  />
                  <Footer settings={settings} />
                  <FloatingViber settings={settings} />
                </>
              }
            />
            <Route
              path="/blog"
              element={
                <>
                  <Header settings={settings} />
                  <BlogListPage blogs={blogs} settings={settings} />
                  <Footer settings={settings} />
                  <FloatingViber settings={settings} />
                </>
              }
            />
            <Route
              path="/blog/:slug"
              element={
                <>
                  <Header settings={settings} />
                  <BlogDetailPage blogs={blogs} services={services} settings={settings} />
                  <Footer settings={settings} />
                  <FloatingViber settings={settings} />
                </>
              }
            />
            <Route
              path="*"
              element={
                <>
                  <Header settings={settings} />
                  <NotFoundPage settings={settings} />
                  <Footer settings={settings} />
                </>
              }
            />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

function PageFallback() {
  return (
    <div
      aria-label="Loading page"
      className="min-h-[60vh] flex items-center justify-center bg-[#0d0f14]"
    >
      <div className="w-8 h-8 border-2 border-gray-800 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );
}
