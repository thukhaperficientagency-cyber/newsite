import { ArrowLeft, ExternalLink, Github, Linkedin } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Blog from "../components/Blog";
import Portfolio from "../components/Portfolio";
import Seo from "../components/Seo";
import Services from "../components/Services";
import Team from "../components/Team";
import { BlogPost, PortfolioProject, ServicePillar, Settings, TeamMember } from "../types";

const fallbackDescription =
  "Digital product engineering, design, SEO, and growth expertise.";

function teamMemberSlug(member: TeamMember) {
  return (
    member.slug ||
    member.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
}

function Breadcrumbs({
  items
}: {
  items: { name: string; url: string }[];
}) {
  const baseUrl = "https://www.perficientagency.online";

  return (
    <>
      <nav aria-label="Breadcrumb" className="text-xs text-gray-500 mb-8">
        <ol className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <li key={item.url} className="flex gap-2">
              {index > 0 && <span>/</span>}
              {index === items.length - 1 ? (
                <span className="text-gray-300">{item.name}</span>
              ) : (
                <Link to={item.url} className="hover:text-white">{item.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: items.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.name,
              item: `${baseUrl}${item.url}`
            }))
          })
        }}
      />
    </>
  );
}

export function ServiceListPage({
  services,
  settings
}: {
  services: ServicePillar[];
  settings: Settings;
}) {
  return (
    <>
      <Seo
        title={`Services in Myanmar | ${settings.brandName}`}
        description="Explore digital marketing, website development, CRM, event management, and POSM services for Myanmar businesses."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: services
            .filter((service) => service.status === "published")
            .map((service, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `https://www.perficientagency.online/services/${service.slug}`,
              name: service.title
            }))
        }}
      />
      <Services services={services} />
    </>
  );
}

export function ServiceDetailPage({
  services,
  blogs,
  projects,
  settings
}: {
  services: ServicePillar[];
  blogs: BlogPost[];
  projects: PortfolioProject[];
  settings: Settings;
}) {
  const { slug } = useParams();
  const service = services.find(
    (item) => item.slug === slug && item.status === "published"
  );

  if (!service) return <NotFoundPage settings={settings} />;

  const relatedBlogs = blogs.filter(
    (post) =>
      post.status === "published" &&
      post.relatedServiceSlug === service.slug
  );
  const relatedProjects = projects.filter(
    (project) => project.relatedServiceSlug === service.slug
  );

  return (
    <>
      <Seo
        title={service.seoTitle || `${service.title} | ${settings.brandName}`}
        description={service.seoDescription || service.shortDescription}
        image={service.heroImageUrl}
        keywords={service.keywords}
        jsonLd={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              name: service.title,
              description: service.description,
              areaServed: {
                "@type": "Country",
                name: "Myanmar"
              },
              provider: {
                "@type": "Organization",
                name: settings.brandName,
                url: "https://www.perficientagency.online"
              }
            },
            ...(service.faqs?.length
              ? [{
                  "@type": "FAQPage",
                  mainEntity: service.faqs.map((faq) => ({
                    "@type": "Question",
                    name: faq.question,
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: faq.answer
                    }
                  }))
                }]
              : [])
          ]
        }}
      />
      <article className="max-w-6xl mx-auto px-6 py-20">
        <Breadcrumbs
          items={[
            { name: "Home", url: "/" },
            { name: "Services", url: "/services" },
            { name: service.title, url: `/services/${service.slug}` }
          ]}
        />
        <p className="text-xs uppercase tracking-widest font-mono text-indigo-400 mb-3">
          Service Pillar · Myanmar
        </p>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          {service.title}
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl leading-8 mb-12">
          {service.shortDescription}
        </p>

        {service.heroImageUrl && (
          <img
            src={service.heroImageUrl}
            alt={service.title}
            width="1200"
            height="675"
            className="w-full aspect-video object-cover rounded-3xl border border-gray-800 mb-12"
          />
        )}

        <div className="prose-section text-gray-300 whitespace-pre-wrap leading-8 max-w-4xl">
          {service.description}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-14">
          <section className="p-7 rounded-2xl bg-gray-950 border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-5">Key Benefits</h2>
            <ul className="space-y-3 text-gray-300">
              {service.benefits?.map((benefit) => <li key={benefit}>✓ {benefit}</li>)}
            </ul>
          </section>
          <section className="p-7 rounded-2xl bg-gray-950 border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-5">Our Process</h2>
            <ol className="space-y-3 text-gray-300">
              {service.process?.map((step, index) => <li key={step}>{index + 1}. {step}</li>)}
            </ol>
          </section>
        </div>

        {!!service.faqs?.length && (
          <section className="mt-14">
            <h2 className="text-3xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {service.faqs.map((faq) => (
                <details key={faq.question} className="p-5 rounded-xl bg-gray-950 border border-gray-800">
                  <summary className="font-semibold text-white cursor-pointer">{faq.question}</summary>
                  <p className="text-gray-400 mt-3 leading-7">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {!!relatedBlogs.length && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-6">Related Insights</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {relatedBlogs.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="p-6 rounded-2xl border border-gray-800 bg-gray-950 hover:border-indigo-500/40">
                  <p className="text-xs text-indigo-400 mb-2">{post.category}</p>
                  <h3 className="text-lg font-bold text-white">{post.title}</h3>
                  <p className="text-sm text-gray-400 mt-3 line-clamp-2">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {!!relatedProjects.length && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-6">Related Case Studies</h2>
            <div className="flex flex-wrap gap-4">
              {relatedProjects.map((project) => (
                <Link key={project.id} to={`/case-studies/${project.id}`} className="px-5 py-3 rounded-xl bg-indigo-600 text-white text-sm">
                  {project.title}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-16 p-8 rounded-3xl bg-indigo-600 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Start your project</h2>
          <p className="text-indigo-100 mb-6">Talk with our Myanmar team about your goals and timeline.</p>
          <a href="/#contact" className="inline-block px-6 py-3 bg-white text-indigo-700 rounded-xl font-semibold">
            Contact us
          </a>
        </section>
      </article>
    </>
  );
}

function ProjectGallery({
  images,
  title
}: {
  images: string[];
  title: string;
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!images.length) return null;

  return (
    <>
      <section className="mt-14">
        <h2 className="text-2xl font-bold text-white mb-6">Project Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelectedImage(image)}
              className="aspect-square overflow-hidden rounded-2xl border border-gray-800 bg-gray-950"
            >
              <img
                src={image}
                alt={`${title} gallery image ${index + 1}`}
                width="600"
                height="600"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </button>
          ))}
        </div>
      </section>

      {selectedImage && (
        <button
          type="button"
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 p-5 md:p-12 flex items-center justify-center"
          aria-label="Close gallery image"
        >
          <img
            src={selectedImage}
            alt={`${title} enlarged gallery view`}
            width="1200"
            height="900"
            className="max-w-full max-h-full object-contain rounded-xl"
          />
        </button>
      )}
    </>
  );
}

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
  const member = members.find(
    (item) => teamMemberSlug(item) === id || item.id === id
  );

  if (!member) return <NotFoundPage settings={settings} />;
  const slug = teamMemberSlug(member);

  if (id !== slug) {
    return <Navigate to={`/team/${slug}`} replace />;
  }

  return (
    <>
      <Seo
        title={member.seoTitle || `${member.name} — ${member.role} | ${settings.brandName}`}
        description={
          member.seoDescription ||
          member.bio ||
          `${member.name} is ${member.role} at ${settings.brandName}.`
        }
        image={member.photoUrl}
        type="profile"
        keywords={member.keywords}
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
        <Breadcrumbs
          items={[
            { name: "Home", url: "/" },
            { name: "Team", url: "/team" },
            { name: member.name, url: `/team/${slug}` }
          ]}
        />
        <Link to="/team" className="inline-flex items-center gap-2 text-sm text-indigo-400 mb-10">
          <ArrowLeft size={16} /> Back to team
        </Link>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <img
            src={member.photoUrl}
            alt={member.name}
            width="800"
            height="800"
            decoding="async"
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
  services,
  settings
}: {
  projects: PortfolioProject[];
  services: ServicePillar[];
  settings: Settings;
}) {
  const { id } = useParams();
  const project = projects.find((item) => item.id === id);

  if (!project) return <NotFoundPage settings={settings} />;
  const relatedService = services.find(
    (service) =>
      service.slug === project.relatedServiceSlug &&
      service.status === "published"
  );

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
        <Breadcrumbs
          items={[
            { name: "Home", url: "/" },
            { name: "Case Studies", url: "/case-studies" },
            { name: project.title, url: `/case-studies/${project.id}` }
          ]}
        />
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
          width="1200"
          height="675"
          decoding="async"
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
        {relatedService && (
          <aside className="mt-10 p-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/10">
            <p className="text-xs uppercase tracking-widest text-indigo-400 mb-2">
              Related Service
            </p>
            <Link
              to={`/services/${relatedService.slug}`}
              className="text-xl font-bold text-white hover:text-indigo-300"
            >
              {relatedService.title} →
            </Link>
          </aside>
        )}
        <ProjectGallery
          images={project.galleryUrls || []}
          title={project.title}
        />
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
  services,
  settings
}: {
  blogs: BlogPost[];
  services: ServicePillar[];
  settings: Settings;
}) {
  const { slug } = useParams();
  const post = blogs.find(
    (item) => item.slug === slug && item.status === "published"
  );

  if (!post) return <NotFoundPage settings={settings} />;
  const relatedService = services.find(
    (service) =>
      service.slug === post.relatedServiceSlug &&
      service.status === "published"
  );

  return (
    <>
      <Seo
        title={post.seoTitle || `${post.title} | ${settings.brandName}`}
        description={post.seoDescription || post.excerpt}
        image={post.imageUrl}
        type="article"
        keywords={post.keywords}
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
        <Breadcrumbs
          items={[
            { name: "Home", url: "/" },
            { name: "Blog", url: "/blog" },
            { name: post.title, url: `/blog/${post.slug}` }
          ]}
        />
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
            width="1200"
            height="675"
            decoding="async"
            className="w-full aspect-[16/9] object-cover rounded-3xl border border-gray-800 mb-12"
          />
        )}
        <div className="flex items-center gap-3 mb-10 pb-8 border-b border-gray-800">
          {post.authorAvatar && (
            <img
              src={post.authorAvatar}
              alt={post.authorName || "Author"}
              width="40"
              height="40"
              loading="lazy"
              decoding="async"
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <span className="text-sm text-gray-300">{post.authorName || settings.brandName}</span>
        </div>
        <div className="space-y-7">
          {post.contentBlocks?.length ? (
            post.contentBlocks.map((block) => {
              if (block.type === "heading") {
                return (
                  <h2 key={block.id} className="text-2xl md:text-3xl font-bold text-white pt-4">
                    {block.text}
                  </h2>
                );
              }

              if (block.type === "image") {
                return (
                  <figure key={block.id}>
                    <img
                      src={block.url}
                      alt={block.alt || post.title}
                      width="1200"
                      height="800"
                      loading="lazy"
                      decoding="async"
                      className="w-full rounded-2xl border border-gray-800"
                    />
                    {block.caption && (
                      <figcaption className="text-center text-xs text-gray-500 mt-3">
                        {block.caption}
                      </figcaption>
                    )}
                  </figure>
                );
              }

              return (
                <p key={block.id} className="text-gray-300 leading-8 whitespace-pre-wrap">
                  {block.text}
                </p>
              );
            })
          ) : (
            <div className="text-gray-300 leading-8 whitespace-pre-wrap">
              {post.content}
            </div>
          )}
        </div>
        {relatedService && (
          <aside className="mt-14 p-7 rounded-2xl border border-indigo-500/30 bg-indigo-500/10">
            <p className="text-xs uppercase tracking-widest text-indigo-400 mb-2">
              Related Service
            </p>
            <h2 className="text-2xl font-bold text-white mb-3">
              {relatedService.title}
            </h2>
            <p className="text-gray-400 mb-5">
              {relatedService.shortDescription}
            </p>
            <Link
              to={`/services/${relatedService.slug}`}
              className="inline-flex px-5 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold"
            >
              Explore this service →
            </Link>
          </aside>
        )}
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
