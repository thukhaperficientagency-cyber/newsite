import { collection, doc, getDocs, setDoc, query, limit } from "firebase/firestore";
import { db, handleFirestoreError } from "./lib/firebase";
import { OperationType, Settings, TeamMember, PortfolioProject, BlogPost } from "./types";

// Seed data
export const DEFAULT_SETTINGS: Settings = {
  id: "config",
  brandName: "Perficient Myanmar",
  logoText: "perficient.",
  logoUrl: "", // Empty means text logo falls back beautifully
  tagline: "Engineering Digital Dominance",
  email: "hello@perficient.agency",
  phone: "+95 9 789 456 123",
  address: "Level 14, Penthouse Office Tower, Yangon, Myanmar",
  facebookUrl: "https://facebook.com/perficient.agency",
  linkedinUrl: "https://linkedin.com/company/perficient-agency",
  githubUrl: "https://github.com/perficient-agency",
  heroTitle: "We Build Fast, SEO-Dominated Digital Ecosystems",
  heroSubtitle: "A premium Myanmar-based digital products and engineering agency. We sculpt blazing-fast software, premium brand identities, and high-converting marketing frameworks.",
  aboutText: "Founded with a mission to eliminate slow websites and generic layouts, Perficient is a team of certified product engineers, creative UI designers, and search algorithm experts. We deliver custom software that performs flawlessly under heavy traction and drives organic search growth.",
  clutchRating: "4.9 / 5.0 (64 Reviews)"
};

export const DEFAULT_TEAM: TeamMember[] = [
  {
    id: "member-1",
    name: "Thukha Aung",
    role: "Managing Director & Principal Consultant",
    photoUrl: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=400",
    bio: "Ex-Silicon Valley Software Engineer. Specializes in high-traffic cloud systems, full-stack React architectures, and search engine telemetry.",
    order: 1,
    socialLinkedin: "https://linkedin.com",
    socialGithub: "https://github.com"
  },
  {
    id: "member-2",
    name: "May Thet Htun",
    role: "Creative Director & UI/UX Specialist",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    bio: "Award-winning designer with 8+ years crafting fluid motion layouts, interactive user personas, and high-impact micro-interactions.",
    order: 2,
    socialLinkedin: "https://linkedin"
  },
  {
    id: "member-3",
    name: "Zayar Min",
    role: "Lead SEO Engineer & Growth Hacker",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    bio: "Cracks high-competition search rankings with programmatic crawling strategies, Core Web Vitals tune-ups, and data-backed targeting.",
    order: 3,
    socialGithub: "https://github"
  }
];

export const DEFAULT_PORTFOLIO: PortfolioProject[] = [
  {
    id: "project-1",
    title: "Global Logistics Cloud Console",
    category: "Web Engineering",
    description: "A high-performance global shipment tracking interface processing over 12,000 requests per minute with real-time map clustering.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    clientName: "LCL Global Inc.",
    tags: ["React", "Custom maps", "WebSockets"],
    date: "May 2026",
    projectUrl: "https://example.com"
  },
  {
    id: "project-2",
    title: "Luxury Apparel E-Commerce Experience",
    category: "Branding & Retail",
    description: "An ultra-premium apparel retail platform built around an interactive 3D product view, responsive sizing guides, and a 1-step layout.",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800",
    clientName: "Vogue Premium",
    tags: ["Three.js", "Tailwind CSS", "Apple Pay Integration"],
    date: "April 2026",
    projectUrl: "https://example.com"
  },
  {
    id: "project-3",
    title: "E-Learning Virtual Classroom Engine",
    category: "Product Design",
    description: "A scalable educational suite that delivers low-latency digital whiteboard broadcasts, homework validation pipelines, and offline progress features.",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
    clientName: "EduGlobal Tech",
    tags: ["WebRTC", "FastAPI", "Firestore"],
    date: "March 2026"
  }
];

export const DEFAULT_BLOGS: BlogPost[] = [
  {
    id: "post-1",
    title: "Ultimate Core Web Vitals Guide for Myanmar Websites",
    excerpt: "How to tune-up your site files, bundle compression, and script execution to score straight 100s in Lighthouse and conquer Google SEO.",
    content: `### Executive Summary

In modern web engineering, speed isn't just about technical pride—it is directly tied to search engine discovery and visitor retention. Google's Core Web Vitals evaluate websites on loading performance (Largest Contentful Paint), interactivity (Interaction to Next Paint), and visual stability (Cumulative Layout Shift).

For businesses in Myanmar, optimizing for low-bandwidth environments is extremely important. Here is our checklist for bulletproof SEO and instant load times.

---

### 1. Optimize Image Sizing & Formats
Never serve raw JPEGs or uncompressed PNGs. Always translate them into modern formats like WebP or AVIF. This drops image payload files by up to 75% without compromising visual clarity.

### 2. Eliminate Render-Blocking Scripts
Defer or async load non-essential JavaScript and style sheets. This permits your raw design to render for visitors instantly while interaction elements download quietly.

### 3. Deploy Statically & Utilize Edge Caching
By keeping your public website modular and serverless, and deploying on global edge networks (like Vercel), files are duplicated in cache nodes situated close to your viewers. This completely bypasses backend delays and makes your page transitions feel as light as air.`,
    slug: "core-web-vitals-myanmar-seo",
    category: "SEO & Growth",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=800",
    authorName: "Zayar Min",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=50",
    publishedAt: "2026-06-15",
    views: 245,
    status: "published"
  },
  {
    id: "post-2",
    title: "Why Decoupled Architectures are the Future of Digital Marketing",
    excerpt: "A critical comparative study between heavy legacy CMS systems and high-speed modular frontend stacks.",
    content: `### The Bloat of Legacy Web Design

Legacy CMS platforms bundle administrative tools, heavy themes, and visitor assets into singular page loads. While convenient, the resulting payload is riddled with generic wrapper scripts, inline styles, and unoptimized queries. This degrades your Core Web Vitals, triggering algorithmic demotions by search crawlers.

---

### Transitioning to Headless Architectures

Decoupled architectures isolate your administrative control console from your active user interface:

1. **Unbreakable Security**: Because the database and admin dashboard are entirely private, there is no public login portal for malicious bots to attack.
2. **Infinite Scalability**: Static files served on CDN edges cannot crash during sudden traffic spikes.
3. **Pristine Client Page Speed**: Only lightweight, pre-compiled static markup and hydration scripts are sent to the client, translating into straight-A performance indicators.`,
    slug: "future-decoupled-architectures",
    category: "Digital Strategy",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    authorName: "Thukha Aung",
    authorAvatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=50",
    publishedAt: "2026-06-10",
    views: 189,
    status: "published"
  }
];

// Seed function
export async function seedDatabaseIfEmpty(): Promise<boolean> {
  const pathToCheck = "settings";
  try {
    const q = query(collection(db, pathToCheck), limit(1));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log("Database is empty. Initiating professional seeding process...");
      
      // Seed settings
      await setDoc(doc(db, "settings", "config"), DEFAULT_SETTINGS);

      // Seed team members
      for (const m of DEFAULT_TEAM) {
        await setDoc(doc(db, "team", m.id), m);
      }

      // Seed portfolio projects
      for (const p of DEFAULT_PORTFOLIO) {
        await setDoc(doc(db, "portfolio", p.id), p);
      }

      // Seed blog posts
      for (const b of DEFAULT_BLOGS) {
        await setDoc(doc(db, "blog", b.id), b);
      }
      
      console.log("Database seeding completed successfully.");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Autoseeding skipped or unauthorized. This is expected if unauthenticated in strict firestore rules mode.", error);
    return false;
  }
}
