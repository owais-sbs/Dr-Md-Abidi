import { useEffect, useState } from 'react';
import { Seo } from '@/components/common/Seo';
import { PageHero } from '@/components/common/PageHero';
import { BlogCard } from '@/components/blog/BlogCard';
import { CTASection } from '@/components/common/CTASection';
import { blogPosts, type BlogPost } from '@/data/blogPosts';
import { getCmsBlogPosts } from '@/data/cms';
import { cmsBlogToPost } from '@/lib/blogCms';
import { motion } from 'framer-motion';
import { staggerContainer, viewport } from '@/animations/variants';

const heroImg = 'https://images.pexels.com/photos/8460095/pexels-photo-8460095.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';

export function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>(blogPosts);

  useEffect(() => {
    let alive = true;
    getCmsBlogPosts()
      .then((cms) => {
        if (!alive) return;
        const enabled = cms.filter((p) => p.enabled).map(cmsBlogToPost);
        const bySlug = new Map<string, BlogPost>();
        for (const p of blogPosts) bySlug.set(p.slug, p);
        for (const p of enabled) bySlug.set(p.slug, p);
        setPosts(Array.from(bySlug.values()).sort((a, b) => {
          const da = Date.parse(a.date) || 0;
          const db = Date.parse(b.date) || 0;
          return db - da;
        }));
      })
      .catch(() => { /* keep static posts */ });
    return () => { alive = false; };
  }, []);

  return (
    <>
      <Seo
        title="Blog | MD Abidi Arthritis Institute"
        description="Helpful insights on arthritis, rheumatology, and joint health from our team of specialists in Brick and Freehold, NJ."
      />
      <PageHero
        eyebrow="Now Reading"
        title="Our Blog Content"
        description="Helpful insights on arthritis, rheumatology, and joint health from our team of specialists."
        image={heroImg}
        crumbs={[{ label: 'Blog' }]}
      />

      <section className="bg-white">
        <div className="container-page py-16 sm:py-20">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {posts.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </motion.div>
        </div>
      </section>

      <CTASection
        eyebrow="Stay Informed"
        title="Have Questions About Arthritis or Joint Pain?"
        description="Our rheumatology team is here to help. Schedule a consultation in Brick or Freehold, NJ today."
      />
    </>
  );
}
