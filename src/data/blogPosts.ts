export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  featuredImage: string;
  content: { type: 'paragraph' | 'heading' | 'list'; text?: string; items?: string[] }[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'living-with-psoriatic-arthritis-how-to-manage-symptoms',
    title: 'Living with Psoriatic Arthritis: How to Manage Symptoms',
    date: 'May 9, 2025',
    author: 'MD Abidi Arthritis Institute',
    excerpt:
      'Psoriatic arthritis is a chronic autoimmune condition that affects both the skin and joints. Managing this condition requires a comprehensive approach, combining medical treatment with',
    featuredImage:
      'https://images.pexels.com/photos/7446660/pexels-photo-7446660.jpeg?auto=compress&cs=tinysrgb&h=700&w=1200',
    content: [
      {
        type: 'paragraph',
        text: 'Psoriatic arthritis is a chronic autoimmune condition that affects both the skin and joints. Managing this condition requires a comprehensive approach, combining medical treatment with healthy lifestyle habits and ongoing care from a rheumatology specialist.',
      },
      { type: 'heading', text: 'Understanding Psoriatic Arthritis' },
      {
        type: 'paragraph',
        text: 'Psoriatic arthritis develops in some people who have psoriasis, a skin condition that causes red, scaly patches. It causes joint pain, stiffness, and swelling, and can affect any joint in the body, including the fingers, toes, knees, and spine.',
      },
      { type: 'heading', text: 'Key Strategies for Managing Symptoms' },
      {
        type: 'list',
        items: [
          'Follow your prescribed treatment plan, including medications and regular follow-up visits',
          'Stay active with gentle, joint-friendly exercise such as swimming or walking',
          'Maintain a healthy weight to reduce stress on weight-bearing joints',
          'Manage stress, which can trigger flare-ups of both skin and joint symptoms',
          'Protect your joints during daily activities and use assistive devices when needed',
        ],
      },
      { type: 'heading', text: 'Working With a Rheumatologist' },
      {
        type: 'paragraph',
        text: 'A rheumatologist can tailor a treatment plan to your specific symptoms, monitor disease activity, and adjust therapy over time. Combining medical care with healthy habits gives you the best chance of staying active and comfortable.',
      },
      {
        type: 'paragraph',
        text: 'If you are experiencing joint pain along with skin changes, schedule a consultation with our rheumatology team at MD Abidi Arthritis Institute in Brick and Freehold, NJ. Early, expert care can protect your joints and improve your quality of life.',
      },
    ],
  },
  {
    slug: 'why-early-intervention-matters-in-treating-autoimmune-diseases',
    title: 'Why Early Intervention Matters in Treating Autoimmune Diseases',
    date: 'May 9, 2025',
    author: 'MD Abidi Arthritis Institute',
    excerpt:
      'Autoimmune diseases like rheumatoid arthritis, lupus, and psoriatic arthritis can cause serious damage to your body if not treated properly. Early diagnosis and intervention are',
    featuredImage:
      'https://images.pexels.com/photos/5214994/pexels-photo-5214994.jpeg?auto=compress&cs=tinysrgb&h=700&w=1200',
    content: [
      {
        type: 'paragraph',
        text: 'Autoimmune diseases like rheumatoid arthritis, lupus, and psoriatic arthritis can cause serious damage to your body if not treated properly. Early diagnosis and intervention are essential to preventing long-term complications and preserving your quality of life.',
      },
      { type: 'heading', text: 'The Importance of Early Treatment' },
      {
        type: 'paragraph',
        text: 'When an autoimmune disease is left untreated, ongoing inflammation can damage joints, organs, and other tissues. Early treatment helps quiet the immune system, relieve symptoms, and prevent irreversible damage before it occurs.',
      },
      { type: 'heading', text: 'Signs That Warrant Evaluation' },
      {
        type: 'list',
        items: [
          'Joint pain, swelling, or stiffness, especially in the morning',
          'Persistent fatigue or unexplained fever',
          'Skin rashes or changes in the nails',
          'Dry eyes or dry mouth',
          'Muscle weakness or difficulty with daily activities',
        ],
      },
      { type: 'heading', text: 'Partnering With a Specialist' },
      {
        type: 'paragraph',
        text: 'A rheumatologist can confirm a diagnosis, start targeted therapy, and monitor your condition over time. The earlier this partnership begins, the better your long-term outcomes are likely to be.',
      },
      {
        type: 'paragraph',
        text: 'If you are experiencing symptoms of an autoimmune disease, do not wait. Schedule a consultation with our rheumatology team at MD Abidi Arthritis Institute in Brick and Freehold, NJ to begin a personalized care plan.',
      },
    ],
  },
  {
    slug: 'managing-rheumatoid-arthritis-tips-for-a-better-life',
    title: 'Managing Rheumatoid Arthritis: Tips for a Better Life',
    date: 'May 9, 2025',
    author: 'MD Abidi Arthritis Institute',
    excerpt:
      'Living with rheumatoid arthritis (RA) can be challenging, but with the right approach, you can manage the condition and maintain an active life. At the',
    featuredImage:
      'https://images.pexels.com/photos/8460095/pexels-photo-8460095.jpeg?auto=compress&cs=tinysrgb&h=700&w=1200',
    content: [
      {
        type: 'paragraph',
        text: 'Living with rheumatoid arthritis (RA) can be challenging, but with the right approach, you can manage the condition and maintain an active life. At the MD Abidi Arthritis Institute, we help patients develop personalized strategies to reduce pain, protect their joints, and stay engaged in the activities they love.',
      },
      { type: 'heading', text: 'Practical Tips for Everyday Life' },
      {
        type: 'list',
        items: [
          'Take your medications exactly as prescribed and attend regular follow-up appointments',
          'Balance activity with rest, and pace yourself during flare-ups',
          'Incorporate low-impact exercise such as walking, swimming, or yoga to keep joints mobile',
          'Eat a balanced, anti-inflammatory diet rich in fruits, vegetables, and healthy fats',
          'Use heat and cold therapy to ease stiffness and soothe aching joints',
          'Prioritize sleep and stress management to support overall well-being',
        ],
      },
      { type: 'heading', text: 'Building a Care Team' },
      {
        type: 'paragraph',
        text: 'Effective rheumatoid arthritis care is a team effort. Your rheumatologist coordinates medical therapy, while physical therapy and healthy lifestyle habits help you stay strong and flexible.',
      },
      {
        type: 'paragraph',
        text: 'If you are living with rheumatoid arthritis, schedule a consultation with our rheumatology team at MD Abidi Arthritis Institute in Brick and Freehold, NJ. Together, we can build a plan that helps you live better every day.',
      },
    ],
  },
];

export const getPost = (slug: string) => blogPosts.find((p) => p.slug === slug);
