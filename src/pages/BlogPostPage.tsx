import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Seo } from '@/components/common/Seo';
import { BlogPost as BlogPostView } from '@/components/blog/BlogPost';
import { CTASection } from '@/components/common/CTASection';
import { getPost, type BlogPost } from '@/data/blogPosts';
import { getCmsBlogPosts } from '@/data/cms';
import { cmsBlogToPost } from '@/lib/blogCms';
import { SITE_URL, absoluteUrl } from '@/lib/seo';
import { site } from '@/data/site';
import { Loader2 } from 'lucide-react';

function metaDescriptionForPost(excerpt: string, firstParagraph?: string): string {
  const cleaned = excerpt.trim();
  if (cleaned.length >= 120 && !cleaned.endsWith('with') && !cleaned.endsWith('and') && !cleaned.endsWith('the')) {
    return cleaned.slice(0, 160);
  }
  if (firstParagraph) {
    return firstParagraph.slice(0, 160).replace(/\s+\S*$/, '') + (firstParagraph.length > 160 ? '…' : '');
  }
  return cleaned.slice(0, 160);
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const staticPost = slug ? getPost(slug) : undefined;
  const [post, setPost] = useState<BlogPost | undefined>(staticPost);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    if (!slug) { setLoading(false); return; }
    getCmsBlogPosts()
      .then((cms) => {
        if (!alive) return;
        const match = cms.find((p) => p.slug === slug && p.enabled);
        if (match) setPost(cmsBlogToPost(match));
        else setPost(getPost(slug));
      })
      .catch(() => { if (alive) setPost(getPost(slug)); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 grid place-items-center text-ink-400">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!post) return <Navigate to="/blog/" replace />;

  const firstParagraph = post.content.find((b) => b.type === 'paragraph' && b.text)?.text;
  const description = metaDescriptionForPost(post.excerpt, firstParagraph);
  const path = `/blog/${post.slug}`;

  return (
    <>
      <Seo
        title={`${post.title} | MD Abidi Arthritis Institute`}
        description={description}
        path={path}
        image={post.featuredImage}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description,
          image: post.featuredImage,
          datePublished: post.date,
          author: {
            '@type': 'Organization',
            name: post.author || site.name,
          },
          publisher: {
            '@type': 'Organization',
            name: site.name,
            logo: {
              '@type': 'ImageObject',
              url: site.logo,
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': absoluteUrl(path),
          },
          isPartOf: { '@id': `${SITE_URL}/#website` },
        }}
      />
      <BlogPostView post={post} />
      <CTASection
        eyebrow="Get Expert Care"
        title="Have Questions About Your Symptoms?"
        description="Schedule a consultation with our rheumatology team in Brick or Freehold, NJ."
      />
    </>
  );
}
