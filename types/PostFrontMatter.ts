export type PostFrontMatter = {
  title: string;
  date_published: string;
  tags: string[];
  date_updated?: string;
  draft?: boolean;
  summary?: string;
  images?: string[];
  authors?: string[];
  layout?: string;
  canonicalUrl?: string;
  slug: string;
  fileName: string;
};
