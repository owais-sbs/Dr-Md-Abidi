import { useParams, Navigate } from 'react-router-dom';
import { Seo } from '@/components/common/Seo';
import { BlogPost } from '@/components/blog/BlogPost';
import { CTASection } from '@/components/common/CTASection';
import { getPost } from '@/data/blogPosts';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPost(slug) : undefined;

  if (!post) return <Navigate to="/blog/" replace />;

  return (
    <>
      <Seo title={`${post.title} | MD Abidi Arthritis Institute`} description={post.excerpt} />
      <BlogPost post={post} />
      <CTASection
        eyebrow="Get Expert Care"
        title="Have Questions About Your Symptoms?"
        description="Schedule a consultation with our rheumatology team in Brick or Freehold, NJ."
      />
    </>
  );
}
