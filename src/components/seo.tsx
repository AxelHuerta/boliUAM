import { useSEO } from "../hooks/use-seo";

interface SEOComponentProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

export function SEO({
  title,
  description,
  keywords,
  ogImage,
  canonical,
}: SEOComponentProps) {
  useSEO({ title, description, keywords, ogImage, canonical });
  return null;
}
