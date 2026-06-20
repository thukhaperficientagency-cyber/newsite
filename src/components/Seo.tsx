import { useEffect } from "react";

interface SeoProps {
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article" | "profile";
  keywords?: string[];
  jsonLd?: Record<string, unknown>;
}

function setMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

export default function Seo({
  title,
  description,
  image,
  type = "website",
  keywords,
  jsonLd
}: SeoProps) {
  useEffect(() => {
    const canonicalUrl = window.location.href.split("#")[0];

    document.title = title;
    setMeta('meta[name="description"]', { name: "description", content: description });
    if (keywords?.length) {
      setMeta('meta[name="keywords"]', {
        name: "keywords",
        content: keywords.join(", ")
      });
    } else {
      document.head.querySelector('meta[name="keywords"]')?.remove();
    }
    setMeta('meta[property="og:title"]', { property: "og:title", content: title });
    setMeta('meta[property="og:description"]', { property: "og:description", content: description });
    setMeta('meta[property="og:type"]', { property: "og:type", content: type });
    setMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
    setMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: title
    });
    setMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description
    });
    setMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: image ? "summary_large_image" : "summary"
    });

    if (image) {
      setMeta('meta[property="og:image"]', { property: "og:image", content: image });
      setMeta('meta[property="og:image:secure_url"]', {
        property: "og:image:secure_url",
        content: image
      });
      setMeta('meta[property="og:image:width"]', {
        property: "og:image:width",
        content: "1200"
      });
      setMeta('meta[property="og:image:height"]', {
        property: "og:image:height",
        content: "630"
      });
      setMeta('meta[property="og:image:alt"]', {
        property: "og:image:alt",
        content: title
      });
      setMeta('meta[name="twitter:image"]', { name: "twitter:image", content: image });
      setMeta('meta[name="twitter:image:alt"]', {
        name: "twitter:image:alt",
        content: title
      });
    }

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    const scriptId = "page-json-ld";
    document.getElementById(scriptId)?.remove();

    if (jsonLd) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      document.getElementById(scriptId)?.remove();
    };
  }, [title, description, image, type, keywords, jsonLd]);

  return null;
}
