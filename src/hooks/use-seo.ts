import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

export function useSEO({
  title,
  description,
  keywords,
  ogImage,
  canonical,
}: SEOProps = {}) {
  useEffect(() => {
    // Update title
    if (title) {
      document.title = title;

      // Update Open Graph title
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute("content", title);
      }

      // Update Twitter title
      const twitterTitle = document.querySelector(
        'meta[property="twitter:title"]'
      );
      if (twitterTitle) {
        twitterTitle.setAttribute("content", title);
      }
    }

    // Update description
    if (description) {
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute("content", description);
      }

      // Update Open Graph description
      const ogDescription = document.querySelector(
        'meta[property="og:description"]'
      );
      if (ogDescription) {
        ogDescription.setAttribute("content", description);
      }

      // Update Twitter description
      const twitterDescription = document.querySelector(
        'meta[property="twitter:description"]'
      );
      if (twitterDescription) {
        twitterDescription.setAttribute("content", description);
      }
    }

    // Update keywords
    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute("content", keywords);
      }
    }

    // Update Open Graph image
    if (ogImage) {
      const ogImageMeta = document.querySelector('meta[property="og:image"]');
      if (ogImageMeta) {
        ogImageMeta.setAttribute("content", ogImage);
      }

      const twitterImageMeta = document.querySelector(
        'meta[property="twitter:image"]'
      );
      if (twitterImageMeta) {
        twitterImageMeta.setAttribute("content", ogImage);
      }
    }

    // Update canonical URL
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement("link");
        canonicalLink.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute("href", canonical);
    }
  }, [title, description, keywords, ogImage, canonical]);
}
