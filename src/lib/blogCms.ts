import type { BlogPost } from '@/data/blogPosts';
import type { CmsBlogPost } from '@/data/cms';

/** Parse admin blog content (paragraphs, ## headings, - lists) into BlogPost blocks. */
export function parseBlogContent(raw: string): BlogPost['content'] {
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const blocks: BlogPost['content'] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];

  function flushParagraph() {
    const text = paragraph.join(' ').trim();
    if (text) blocks.push({ type: 'paragraph', text });
    paragraph = [];
  }
  function flushList() {
    if (listItems.length) blocks.push({ type: 'list', items: [...listItems] });
    listItems = [];
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      flushParagraph();
      continue;
    }
    if (trimmed.startsWith('## ')) {
      flushList();
      flushParagraph();
      blocks.push({ type: 'heading', text: trimmed.slice(3).trim() });
      continue;
    }
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      flushParagraph();
      listItems.push(trimmed.slice(2).trim());
      continue;
    }
    flushList();
    paragraph.push(trimmed);
  }
  flushList();
  flushParagraph();
  return blocks;
}

export function cmsBlogToPost(p: CmsBlogPost): BlogPost {
  const dateRaw = p.publishedAt || p.createdAt || '';
  let date = dateRaw;
  const parsed = Date.parse(dateRaw);
  if (!Number.isNaN(parsed)) {
    date = new Date(parsed).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
  return {
    slug: p.slug,
    title: p.title,
    date,
    author: p.author || 'MD Abidi Arthritis Institute',
    excerpt: p.excerpt,
    featuredImage: p.featuredImage || 'https://images.pexels.com/photos/8460095/pexels-photo-8460095.jpeg?auto=compress&cs=tinysrgb&h=700&w=1200',
    content: parseBlogContent(p.content || p.excerpt || ''),
  };
}
