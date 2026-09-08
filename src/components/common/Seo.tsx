import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { site } from '@/data/site';
import {
  DEFAULT_OG_IMAGE,
  absoluteUrl,
  organizationGraph,
  removeJsonLd,
  upsertJsonLd,
  upsertLink,
  upsertMeta,
} from '@/lib/seo';

export interface SeoProps {
  title: string;
  description?: string;
  /** Override path used for canonical/og:url. Defaults to current location. */
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  /** Extra JSON-LD objects merged with (or instead of) the default org graph. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  /** When false, skip injecting the shared organization graph (default: true on public pages). */
  includeOrganization?: boolean;
}

export function Seo({
  title,
  description,
  path,
  image,
  type = 'website',
  noindex = false,
  jsonLd,
  includeOrganization = true,
}: SeoProps) {
  const { pathname, search } = useLocation();
  const canonicalPath = path ?? (`${pathname}${search}` || '/');
  const canonical = absoluteUrl(canonicalPath.split('?')[0] || '/');
  const desc =
    description ||
    `${site.tagline}. Rheumatology and arthritis care in Brick and Freehold, NJ.`;
  const ogImage = image || DEFAULT_OG_IMAGE;
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    document.title = title;
    document.documentElement.lang = 'en';

    upsertMeta('name', 'description', desc);
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
    upsertMeta('name', 'googlebot', noindex ? 'noindex, nofollow' : 'index, follow');
    upsertMeta('name', 'author', site.name);
    upsertMeta('name', 'theme-color', '#0c4a6e');

    upsertLink('canonical', canonical);

    upsertMeta('property', 'og:locale', 'en_US');
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:site_name', site.name);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', desc);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('property', 'og:image:alt', `${site.name}`);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', desc);
    upsertMeta('name', 'twitter:image', ogImage);

    if (includeOrganization && !noindex) {
      upsertJsonLd('seo-jsonld-organization', organizationGraph());
    } else {
      removeJsonLd('seo-jsonld-organization');
    }

    if (jsonLdKey) {
      const parsed = JSON.parse(jsonLdKey) as Record<string, unknown> | Record<string, unknown>[];
      upsertJsonLd('seo-jsonld-page', parsed);
    } else {
      removeJsonLd('seo-jsonld-page');
    }

    return () => {
      removeJsonLd('seo-jsonld-page');
    };
  }, [title, desc, canonical, ogImage, type, noindex, jsonLdKey, includeOrganization]);

  return null;
}
