  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  heroImageUrl?: string;
  socialImageUrl?: string;
  benefits?: string[];
  process?: string[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  order?: number;
  status: "published" | "draft";
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
  socialImageUrl?: string;
  authorName?: string;
  authorAvatar?: string;
  publishedAt: string;
  views?: number;
  status: "published" | "draft";
  relatedServiceSlug?: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
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
