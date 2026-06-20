export interface Settings {
  id: string;
  brandName: string;
  logoUrl?: string;
  logoText: string;
  tagline?: string;
  email?: string;
  phone?: string;
  address?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  aboutText?: string;
  clutchRating?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
  bio?: string;
  order?: number;
  socialLinkedin?: string;
  socialGithub?: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  galleryUrls?: string[];
  clientName?: string;
  tags?: string[];
  date?: string;
  projectUrl?: string;
}

export type BlogContentBlock =
  | {
      id: string;
      type: "heading" | "paragraph";
      text: string;
    }
  | {
      id: string;
      type: "image";
      url: string;
      alt?: string;
      caption?: string;
    };

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  contentBlocks?: BlogContentBlock[];
  slug: string;
  category: string;
  imageUrl?: string;
  authorName?: string;
  authorAvatar?: string;
  publishedAt: string;
  views?: number;
  status: "published" | "draft";
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}
