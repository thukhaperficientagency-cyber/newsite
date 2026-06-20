import { ArrowLeft, ExternalLink, Github, Linkedin } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Blog from "../components/Blog";
import Portfolio from "../components/Portfolio";
import Seo from "../components/Seo";
import Team from "../components/Team";
import { BlogPost, PortfolioProject, Settings, TeamMember } from "../types";

const fallbackDescription =
  "Digital product engineering, design, SEO, and growth expertise.";

export function TeamListPage({
  members,
  settings
}: {
  members: TeamMember[];
  settings: Settings;
}) {
  return (
    <>
      <Seo
        title={`Our Team | ${settings.brandName}`}
        description="Meet the engineers, designers, and growth specialists behind our digital products."
      />
      <Team members={members} />
    </>
  );
}

export function TeamDetailPage({
  members,
  settings
}: {
  members: TeamMember[];
  settings: Settings;
}) {
  const { id } = useParams();
  const member = members.find((item) => item.id === id);

  if (!member) return <NotFoundPage settings={settings} />;

  return (
    <>
      <Seo
        title={`${member.name} — ${member.role} | ${settings.brandName}`}
        description={member.bio || `${member.name} is ${member.role} at ${settings.brandName}.`}
        image={member.photoUrl}
        type="profile"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: member.name,
          jobTitle: member.role,
          description: member.bio,
          image: member.photoUrl
        }}
      />
      <article className="max-w-5xl mx-auto px-6 py-20">
        <Link to="/team" className="inline-flex items-center gap-2 text-sm text-indigo-400 mb-10">
          <ArrowLeft size={16} /> Back to team
        </Link>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <img
            src={member.photoUrl}
            alt={member.name}
            className="w-full aspect-square rounded-3xl object-cover border border-gray-800"
          />
          <div>
            <p className="text-xs uppercase tracking-widest font-mono text-indigo-400 mb-3">
              {member.role}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold font-display text-white mb-8">
              {member.name}
            </h1>
            <p className="text-gray-300 leading-8 whitespace-pre-wrap">
              {member.bio || fallbackDescription}
            </p>
            <div className="flex gap-4 mt-10">
              {member.socialLinkedin && (
                <a href={member.socialLinkedin} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-gray-900 text-gray-300">
                  <Linkedin size={20} />
                </a>
              )}
              {member.socialGithub && (
                <a href={member.socialGithub} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-gray-900 text-gray-300">
                  <Github size={20} />
                </a>
              )}
            </div>
          </div>
        </div>
      </article>
    </>
  );
}

export function CaseStudyListPage({
  projects,
  settings
}: {
  projects: PortfolioProject[];
  settings: Settings;
}) {
  return (
    <>
      <Seo
        title={`Case Studies | ${settings.brandName}`}
        description="Explore our web engineering, product design, branding, and growth case studies."
      />
      <Portfolio projects={projects} />
    </>
  );
}

export function CaseStudyDetailPage({
  projects,
  settings
}: {
  projects: PortfolioProject[];
  settings: Settings;
}) {
  const { id } = useParams();
  const project = projects.find((item) => item.id === id);

  if (!project) return <NotFoundPage settings={settings} />;

  return (
    <>
      <Seo
        title={`${project.title} Case Study | ${settings.brandName}`}
        description={project.description}
        image={project.imageUrl}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.title,
          description: project.description,
          image: project.imageUrl,
          dateCreated: project.date,
          about: project.category
        }}
      />
      <article className="max-w-5xl mx-auto px-6 py-20">
        <Link to="/case-studies" className="inline-flex items-center gap-2 text-sm text-indigo-400 mb-10">
          <ArrowLeft size={16} /> Back to case studies
        </Link>
        <p className="text-xs uppercase tracking-widest font-mono text-indigo-400 mb-3">
          {project.category}
        </p>
        <h1 className="text-4xl md:text-6xl font-bold font-display text-white mb-6">
          {project.title}
        </h1>
        {project.clientName && (
          <p className="text-gray-500 mb-8">Client: {project.clientName}</p>
        )}
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full aspect-video object-cover rounded-3xl border border-gray-800 mb-12"
        />
        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags?.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full bg-gray-900 text-gray-400 text-xs">
              {tag}
            </span>
          ))}
        </div>
        <p className="text-gray-300 leading-8 whitespace-pre-wrap text-base md:text-lg">
          {project.description}
        </p>
        {project.projectUrl && (
          <a
            href={project.projectUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-10 px-5 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold"
          >
            Visit project <ExternalLink size={16} />
          </a>
        )}
      </article>
    </>
  );
}

export function BlogListPage({
  blogs,
  settings
}: {
  blogs: BlogPost[];
  settings: Settings;
}) {
  return (
    <>
      <Seo
        title={`Blog & Insights | ${settings.brandName}`}
        description="Read technical reports, SEO guides, product engineering insights, and growth strategies."
      />
      <Blog blogs={blogs} />
    </>
  );
}

export function BlogDetailPage({
  blogs,
  settings
}: {
  blogs: BlogPost[];
  settings: Settings;
}) {
  const { slug } = useParams();
  const post = blogs.find(
    (item) => item.slug === slug && item.status === "published"
  );

  if (!post) return <NotFoundPage settings={settings} />;

  return (
    <>
      <Seo
        title={`${post.title} | ${settings.brandName}`}
        description={post.excerpt}
        image={post.imageUrl}
        type="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          image: post.imageUrl,
          datePublished: post.publishedAt,
          author: {
            "@type": "Person",
            name: post.authorName || settings.brandName
          }
        }}
      />
      <article className="max-w-4xl mx-auto px-6 py-20">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-indigo-400 mb-10">
          <ArrowLeft size={16} /> Back to blog
        </Link>
        <p className="text-xs uppercase tracking-widest font-mono text-indigo-400 mb-3">
          {post.category} · {post.publishedAt}
        </p>
        <h1 className="text-4xl md:text-6xl font-bold font-display text-white leading-tight mb-6">
          {post.title}
        </h1>
        <p className="text-xl text-gray-400 leading-8 mb-10">{post.excerpt}</p>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full aspect-[16/9] object-cover rounded-3xl border border-gray-800 mb-12"
          />
        )}
        <div className="flex items-center gap-3 mb-10 pb-8 border-b border-gray-800">
          {post.authorAvatar && (
            <img src={post.authorAvatar} alt={post.authorName || "Author"} className="w-10 h-10 rounded-full object-cover" />
          )}
          <span className="text-sm text-gray-300">{post.authorName || settings.brandName}</span>
        </div>
        <div className="text-gray-300 leading-8 whitespace-pre-wrap">
          {post.content}
        </div>
      </article>
    </>
  );
}

export function NotFoundPage({ settings }: { settings: Settings }) {
  return (
    <>
      <Seo title={`Page Not Found | ${settings.brandName}`} description="The requested page could not be found." />
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <p className="text-indigo-400 font-mono mb-3">404</p>
        <h1 className="text-4xl font-bold text-white mb-4">Page not found</h1>
        <Link to="/" className="text-gray-300 hover:text-white">Return home →</Link>
      </div>
    </>
  );
}
