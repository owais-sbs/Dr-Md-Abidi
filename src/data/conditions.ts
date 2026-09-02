export interface Condition {
  slug: string;
  title: string;
  href: string;
  shortDescription: string;
  heroEyebrow: string;
  heroImage: string;
  heroImageAlt: string;
  cardImage: string;
  overview: string[];
  sections: { heading: string; body: string[] }[];
  symptoms?: string[];
  treatmentIntro: string;
  ctaHeading: string;
  ctaBody: string;
  metaTitle: string;
  metaDescription: string;
}

export const conditions: Condition[] = [
  {
    slug: 'carpal-tunnel-syndrome',
    title: 'Carpal Tunnel Syndrome',
    href: '/carpal-tunnel-syndrome/',
    shortDescription:
      'Numbness, tingling, and weakness in the hand caused by compression of the median nerve at the wrist.',
    heroEyebrow: 'Hand & Wrist Condition',
    heroImage: '/Carpal Tunnel Syndrome.jpeg',
    heroImageAlt: 'Person holding wrist in pain, representing carpal tunnel syndrome',
    cardImage: '/Carpal Tunnel Syndrome.jpeg',
    overview: [
      'Carpal tunnel syndrome is a common nerve condition that occurs when the median nerve, which runs from the forearm into the palm, becomes pressed or squeezed at the wrist. The carpal tunnel is a narrow passageway of ligament and bones at the base of the hand that houses the median nerve and tendons.',
      'Patients with carpal tunnel syndrome often feel numbness, tingling, and weakness in the hand and fingers. Symptoms frequently worsen at night and can interfere with daily activities such as gripping objects, typing, or buttoning a shirt.',
    ],
    sections: [
      {
        heading: 'Causes & Risk Factors',
        body: [
          'Carpal tunnel syndrome can result from repetitive hand movements, wrist anatomy, and underlying health conditions such as diabetes, thyroid imbalance, and rheumatoid arthritis. Pregnancy and inflammatory forms of arthritis can also increase pressure within the carpal tunnel.',
          'Because rheumatoid arthritis and other autoimmune diseases cause joint inflammation, patients with these conditions have a higher risk of developing carpal tunnel syndrome. Our rheumatology team evaluates the underlying cause to guide the most effective treatment plan.',
        ],
      },
      {
        heading: 'Diagnosis',
        body: [
          'A thorough evaluation includes a review of symptoms, a physical examination of the hand and wrist, and diagnostic tests such as nerve conduction studies. Identifying whether an inflammatory or autoimmune condition is contributing to the nerve compression helps us tailor care.',
        ],
      },
    ],
    symptoms: [
      'Numbness or tingling in the thumb, index, and middle fingers',
      'Hand weakness or difficulty gripping objects',
      'Pain or discomfort that may extend up the forearm',
      'Symptoms that worsen at night or with repetitive use',
    ],
    treatmentIntro:
      'Treatment for carpal tunnel syndrome ranges from conservative measures such as wrist splinting and activity modification to corticosteroid injections and, in severe cases, surgical release. When an underlying rheumatologic condition is present, treating the inflammation is an essential part of relieving nerve pressure.',
    ctaHeading:
      'Get Expert Evaluation for Carpal Tunnel Syndrome in Brick & Freehold, NJ',
    ctaBody:
      'If hand numbness or weakness is interfering with your daily life, our rheumatology team can help identify the cause and build a personalized treatment plan.',
    metaTitle: 'Carpal Tunnel Syndrome Treatment | MD Abidi Arthritis Institute',
    metaDescription:
      'Expert carpal tunnel syndrome evaluation and treatment in Brick and Freehold, NJ. Comprehensive rheumatology care for nerve compression and hand pain.',
  },
  {
    slug: 'rheumatoid-arthritis',
    title: 'Rheumatoid Arthritis',
    href: '/rheumatoid-arthritis/',
    shortDescription:
      'A chronic autoimmune disease that causes joint inflammation, pain, and potential joint damage throughout the body.',
    heroEyebrow: 'Autoimmune Joint Disease',
    heroImage: '/Rheumatoid Arthritis.jpeg',
    heroImageAlt: 'Healthcare workers reviewing X-ray images for rheumatoid arthritis diagnosis',
    cardImage: '/Rheumatoid Arthritis.jpeg',
    overview: [
      'Rheumatoid arthritis is a chronic autoimmune disease in which the immune system mistakenly attacks the lining of the joints, causing inflammation, pain, and swelling. Unlike wear-and-tear arthritis, rheumatoid arthritis can affect joints on both sides of the body and may also involve other organs.',
      'Without proper treatment, ongoing inflammation can damage cartilage and bone, leading to joint deformity and loss of function. Early diagnosis and advanced treatment have dramatically improved outcomes for people living with rheumatoid arthritis.',
    ],
    sections: [
      {
        heading: 'Symptoms',
        body: [
          'Rheumatoid arthritis typically causes tender, swollen, and warm joints, most often in the hands, wrists, and feet. Many patients experience stiffness in the morning that lasts longer than 30 minutes, along with fatigue and a general feeling of being unwell.',
          'Because it is a systemic disease, rheumatoid arthritis can also affect the skin, eyes, lungs, and blood vessels. A comprehensive evaluation helps identify the full scope of involvement.',
        ],
      },
      {
        heading: 'Diagnosis',
        body: [
          'Diagnosis combines a detailed history and physical examination with blood tests for inflammatory markers and autoantibodies, as well as imaging such as X-rays and ultrasound. Our team uses these tools to confirm the diagnosis and monitor disease activity over time.',
        ],
      },
    ],
    symptoms: [
      'Joint pain, swelling, and warmth, often in the hands and wrists',
      'Morning stiffness lasting more than 30 minutes',
      'Fatigue and low-grade fever',
      'Symmetric joint involvement on both sides of the body',
    ],
    treatmentIntro:
      'Treatment for rheumatoid arthritis focuses on quieting the immune system, relieving pain, and preventing joint damage. Options include disease-modifying antirheumatic drugs (DMARDs), biologic therapies, corticosteroids, and supportive care such as physical therapy and joint injections.',
    ctaHeading: 'Specialist Rheumatoid Arthritis Care in Brick & Freehold, NJ',
    ctaBody:
      'Early, expert treatment can protect your joints and improve your quality of life. Schedule a consultation with our rheumatology team to begin a personalized plan.',
    metaTitle: 'Rheumatoid Arthritis Treatment | MD Abidi Arthritis Institute',
    metaDescription:
      'Expert rheumatoid arthritis diagnosis and treatment in Brick and Freehold, NJ. Advanced rheumatology care to protect joints and improve quality of life.',
  },
  {
    slug: 'psoriatic-arthritis',
    title: 'Psoriatic Arthritis',
    href: '/psoriatic-arthritis/',
    shortDescription:
      'An inflammatory arthritis associated with psoriasis that can affect the skin, joints, and nails.',
    heroEyebrow: 'Skin & Joint Inflammation',
    heroImage: '/Psoriatic arthritis.jpeg',
    heroImageAlt: 'Dermatologist examining a patient’s skin for psoriatic arthritis',
    cardImage: '/Psoriatic arthritis.jpeg',
    overview: [
      'Psoriatic arthritis is a form of inflammatory arthritis that affects some people who have psoriasis, a chronic skin condition. It can develop at any age and may cause joint pain, stiffness, and swelling along with skin and nail changes.',
      'The disease can affect any joint, including the fingers, toes, knees, and spine, and often involves the entheses — the sites where tendons and ligaments attach to bone. Because it affects both skin and joints, coordinated care is important.',
    ],
    sections: [
      {
        heading: 'Symptoms',
        body: [
          'Psoriatic arthritis may cause joint pain, swelling, and stiffness, particularly in the fingers and toes. Nail changes such as pitting, discoloration, and separation from the nail bed are common. Some patients also experience lower back pain and fatigue.',
        ],
      },
      {
        heading: 'Diagnosis',
        body: [
          'Diagnosis is based on a combination of skin and joint findings, a review of medical history, blood tests to rule out other forms of arthritis, and imaging. Identifying the pattern of joint and skin involvement helps guide the right therapy.',
        ],
      },
    ],
    symptoms: [
      'Joint pain and swelling, often in the fingers and toes',
      'Nail changes such as pitting or separation',
      'Red, scaly skin patches associated with psoriasis',
      'Lower back pain and morning stiffness',
    ],
    treatmentIntro:
      'Treatment for psoriatic arthritis aims to control inflammation in both the skin and joints, relieve symptoms, and prevent joint damage. Options include NSAIDs, DMARDs, biologic therapies, corticosteroid injections, and coordinated dermatologic care.',
    ctaHeading: 'Comprehensive Psoriatic Arthritis Care in Brick & Freehold, NJ',
    ctaBody:
      'If you have psoriasis and joint pain, a thorough evaluation can identify psoriatic arthritis early and protect your joints. Schedule a consultation today.',
    metaTitle: 'Psoriatic Arthritis Treatment | MD Abidi Arthritis Institute',
    metaDescription:
      'Expert psoriatic arthritis care in Brick and Freehold, NJ. Coordinated treatment for skin and joint inflammation to protect mobility and quality of life.',
  },
  {
    slug: 'lupus',
    title: 'Lupus',
    href: '/lupus/',
    shortDescription:
      'A chronic autoimmune disease that can affect the skin, joints, kidneys, and other organs.',
    heroEyebrow: 'Systemic Autoimmune Disease',
    heroImage: '/lupus.jpeg',
    heroImageAlt: 'Doctor in consultation with patient discussing lupus treatment options',
    cardImage: '/lupus.jpeg',
    overview: [
      'Lupus is a chronic autoimmune disease in which the immune system attacks healthy tissue, causing inflammation that can affect the skin, joints, kidneys, heart, and other organs. The most common form is systemic lupus erythematosus.',
      'Lupus symptoms can vary widely from person to person and may come and go in episodes called flares. Because it can affect many parts of the body, ongoing rheumatologic care is essential to managing the disease and preventing complications.',
    ],
    sections: [
      {
        heading: 'Symptoms',
        body: [
          'Common symptoms include joint pain and swelling, fatigue, a butterfly-shaped rash on the face, sensitivity to sunlight, and fever. Some patients experience chest pain, dry eyes, and swollen lymph nodes. The wide range of possible symptoms makes expert evaluation important.',
        ],
      },
      {
        heading: 'Diagnosis',
        body: [
          'Diagnosing lupus requires a detailed medical history, physical examination, blood and urine tests for autoantibodies and organ function, and sometimes imaging. Because symptoms overlap with other conditions, a rheumatologist plays a central role in confirming the diagnosis.',
        ],
      },
    ],
    symptoms: [
      'Joint pain and swelling',
      'Fatigue and fever',
      'Skin rash, often across the cheeks and nose',
      'Sensitivity to sunlight',
    ],
    treatmentIntro:
      'Treatment for lupus is tailored to the organs involved and the severity of the disease. Options include antimalarial medications, corticosteroids, immunosuppressants, and biologic therapies, along with regular monitoring to protect the kidneys and other organs.',
    ctaHeading: 'Expert Lupus Care in Brick & Freehold, NJ',
    ctaBody:
      'Ongoing, coordinated care can help control lupus flares and protect your organs. Schedule a consultation with our rheumatology team for a personalized plan.',
    metaTitle: 'Lupus Treatment | MD Abidi Arthritis Institute',
    metaDescription:
      'Comprehensive lupus care in Brick and Freehold, NJ. Expert rheumatology treatment to control flares and protect organs in systemic lupus.',
  },
  {
    slug: 'sjogrens-syndrome',
    title: "Sjogren's Syndrome",
    href: '/sjogrens-syndrome/',
    shortDescription:
      'A chronic autoimmune disorder that attacks moisture-producing glands, causing dry eyes and dry mouth.',
    heroEyebrow: 'Autoimmune Dryness',
    heroImage: "/Sjogrens-Syndrome.jpeg",
    heroImageAlt: "Patient consulting doctor about dry eye and mouth symptoms of Sjogren's syndrome",
    cardImage: "/Sjogrens-Syndrome.jpeg",
    overview: [
      "Sjogren's syndrome is a chronic autoimmune disease in which the immune system attacks the glands that make moisture, leading to dry eyes and dry mouth. It can occur on its own or alongside other autoimmune diseases such as rheumatoid arthritis or lupus.",
      "Beyond dryness, Sjogren's syndrome can cause joint pain, fatigue, and organ involvement. Because symptoms may be mild at first, a careful rheumatologic evaluation helps identify the condition and prevent complications.",
    ],
    sections: [
      {
        heading: 'Symptoms',
        body: [
          'The hallmark symptoms are dry eyes and dry mouth, but patients may also experience joint pain, swelling, fatigue, and dry skin. Some people develop dental decay, oral infections, or inflammation in other organs.',
        ],
      },
      {
        heading: 'Diagnosis',
        body: [
          "Diagnosis combines a review of symptoms with blood tests for autoantibodies, eye tests to measure tear production, and sometimes a biopsy of the salivary glands. Identifying whether Sjogren's is primary or linked to another autoimmune disease guides treatment.",
        ],
      },
    ],
    symptoms: [
      'Dry, gritty, or burning eyes',
      'Persistent dry mouth and difficulty swallowing',
      'Joint pain and fatigue',
      'Increased dental decay or oral infections',
    ],
    treatmentIntro:
      "Treatment for Sjogren's syndrome focuses on relieving dryness, controlling inflammation, and monitoring for organ involvement. Options include artificial tears and saliva stimulants, immunomodulatory medications, and supportive care tailored to each patient's symptoms.",
    ctaHeading: "Specialist Sjogren's Syndrome Care in Brick & Freehold, NJ",
    ctaBody:
      'If dry eyes and dry mouth are affecting your comfort and daily life, our rheumatology team can evaluate you and build a personalized treatment plan.',
    metaTitle: "Sjogren's Syndrome Treatment | MD Abidi Arthritis Institute",
    metaDescription:
      "Expert Sjogren's syndrome care in Brick and Freehold, NJ. Rheumatology treatment for dry eyes, dry mouth, and autoimmune inflammation.",
  },
  {
    slug: 'polymyositis-and-dermatomyositis',
    title: 'Polymyositis And Dermatomyositis',
    href: '/polymyositis-and-dermatomyositis/',
    shortDescription:
      'Inflammatory muscle diseases that cause muscle weakness and, in dermatomyositis, a characteristic skin rash.',
    heroEyebrow: 'Inflammatory Muscle Disease',
    heroImage: '/Polymyositis and Dermatomyositis.jpeg',
    heroImageAlt: 'Doctor examining patient for muscle weakness and myositis',
    cardImage: '/Polymyositis and Dermatomyositis.jpeg',
    overview: [
      'Polymyositis and dermatomyositis are rare inflammatory diseases of the muscle that cause progressive muscle weakness. In dermatomyositis, muscle inflammation is accompanied by a distinctive skin rash.',
      'These conditions are autoimmune in nature and can affect adults and children. Weakness typically develops slowly and affects the muscles closest to the trunk, such as the hips, thighs, shoulders, and neck.',
    ],
    sections: [
      {
        heading: 'Symptoms',
        body: [
          'Patients often notice gradual weakness in the hips, thighs, shoulders, or arms, making it difficult to climb stairs, rise from a chair, or lift objects. Dermatomyositis also causes skin changes such as a reddish rash on the face, knuckles, or chest.',
        ],
      },
      {
        heading: 'Diagnosis',
        body: [
          'Diagnosis involves a neurological and rheumatological exam, blood tests for muscle enzymes and autoantibodies, electromyography (EMG), and sometimes muscle biopsy or MRI. Early diagnosis helps prevent permanent muscle damage.',
        ],
      },
    ],
    symptoms: [
      'Progressive muscle weakness in the hips, thighs, or shoulders',
      'Difficulty climbing stairs or rising from a seated position',
      'Skin rash (in dermatomyositis)',
      'Fatigue and difficulty swallowing',
    ],
    treatmentIntro:
      'Treatment for polymyositis and dermatomyositis focuses on reducing muscle inflammation and restoring strength. Options include corticosteroids, immunosuppressant medications, intravenous immunoglobulin, and physical therapy to support recovery.',
    ctaHeading:
      'Expert Care for Myositis in Brick & Freehold, NJ',
    ctaBody:
      'If you are experiencing unexplained muscle weakness, a thorough rheumatologic evaluation can identify the cause and guide effective treatment.',
    metaTitle:
      'Polymyositis & Dermatomyositis Treatment | MD Abidi Arthritis Institute',
    metaDescription:
      'Expert care for polymyositis and dermatomyositis in Brick and Freehold, NJ. Rheumatology treatment for inflammatory muscle disease.',
  },
  {
    slug: 'vasculitis',
    title: 'Vasculitis',
    href: '/vasculitis/',
    shortDescription:
      'A group of autoimmune diseases that cause inflammation of the blood vessels, restricting blood flow and damaging organs.',
    heroEyebrow: 'Blood Vessel Inflammation',
    heroImage: '/VASCULITIS.jpeg',
    heroImageAlt: 'Blood samples in test tubes representing vasculitis diagnosis and lab testing',
    cardImage: '/VASCULITIS.jpeg',
    overview: [
      'Vasculitis refers to a group of rare autoimmune diseases that cause inflammation of the blood vessels. The inflammation can narrow or block vessels, reducing blood flow to organs and tissues and causing damage.',
      'There are many types of vasculitis, ranging from mild forms affecting the skin to serious forms that involve the kidneys, lungs, or nerves. Accurate diagnosis and ongoing rheumatologic care are essential.',
    ],
    sections: [
      {
        heading: 'Symptoms',
        body: [
          'Symptoms depend on which blood vessels and organs are involved and may include fatigue, fever, weight loss, muscle and joint pain, rashes, and nerve problems. Because symptoms vary widely, a careful evaluation is important.',
        ],
      },
      {
        heading: 'Diagnosis',
        body: [
          'Diagnosis combines a thorough history and physical exam with blood tests for inflammation and autoantibodies, imaging of the blood vessels, and sometimes a biopsy of affected tissue. Identifying the specific type of vasculitis guides treatment.',
        ],
      },
    ],
    symptoms: [
      'Fatigue, fever, and unexplained weight loss',
      'Muscle and joint pain',
      'Skin rashes or discoloration',
      'Nerve problems such as numbness or weakness',
    ],
    treatmentIntro:
      'Treatment for vasculitis aims to stop inflammation, prevent organ damage, and maintain remission. Options include corticosteroids, immunosuppressant medications, biologic therapies, and careful monitoring of organ function.',
    ctaHeading: 'Specialist Vasculitis Care in Brick & Freehold, NJ',
    ctaBody:
      'Vasculitis requires prompt, expert evaluation and ongoing care. Schedule a consultation with our rheumatology team for a personalized treatment plan.',
    metaTitle: 'Vasculitis Treatment | MD Abidi Arthritis Institute',
    metaDescription:
      'Expert vasculitis care in Brick and Freehold, NJ. Rheumatology treatment to control blood vessel inflammation and protect organ function.',
  },
  {
    slug: 'spondyloarthritis',
    title: 'Spondyloarthritis',
    href: '/spondyloarthritis/',
    shortDescription:
      'A family of inflammatory diseases that affect the spine, joints, and sites where tendons attach to bone.',
    heroEyebrow: 'Spine & Joint Inflammation',
    heroImage: '/Spondyloarthritis.jpeg',
    heroImageAlt: 'Person experiencing back and neck pain from spondyloarthritis',
    cardImage: '/Spondyloarthritis.jpeg',
    overview: [
      'Spondyloarthritis is a family of inflammatory rheumatic diseases that primarily affect the spine and the sacroiliac joints, though it can also involve other joints, the skin, and the eyes. Types include ankylosing spondylitis and psoriatic-related spondyloarthritis.',
      'Unlike mechanical back pain, inflammatory back pain is often worse with rest and improves with activity. Early diagnosis helps protect spinal mobility and prevent long-term complications.',
    ],
    sections: [
      {
        heading: 'Symptoms',
        body: [
          'Common symptoms include chronic lower back pain and stiffness, especially in the morning or after periods of rest. Some patients also experience joint pain in the legs, eye inflammation, or skin changes associated with psoriasis.',
        ],
      },
      {
        heading: 'Diagnosis',
        body: [
          'Diagnosis combines a detailed history, physical examination of the spine and joints, blood tests for inflammation and genetic markers, and imaging such as X-rays and MRI. Identifying the specific type of spondyloarthritis guides treatment.',
        ],
      },
    ],
    symptoms: [
      'Chronic lower back pain and stiffness',
      'Pain that improves with activity but worsens with rest',
      'Morning stiffness lasting more than 30 minutes',
      'Joint pain, eye inflammation, or skin changes',
    ],
    treatmentIntro:
      'Treatment for spondyloarthritis focuses on reducing inflammation, relieving pain, and preserving spinal mobility. Options include NSAIDs, DMARDs, biologic therapies, physical therapy, and regular monitoring of disease activity.',
    ctaHeading: 'Expert Spondyloarthritis Care in Brick & Freehold, NJ',
    ctaBody:
      'If inflammatory back pain is limiting your movement, our rheumatology team can identify the cause and build a personalized treatment plan.',
    metaTitle: 'Spondyloarthritis Treatment | MD Abidi Arthritis Institute',
    metaDescription:
      'Expert spondyloarthritis care in Brick and Freehold, NJ. Rheumatology treatment for inflammatory spine and joint disease.',
  },
  {
    slug: 'gout',
    title: 'Gout',
    href: '/gout/',
    shortDescription:
      'A form of inflammatory arthritis caused by uric acid crystals in the joints, often causing sudden, severe pain.',
    heroEyebrow: 'Crystal-Induced Arthritis',
    heroImage: '/gout.jpeg',
    heroImageAlt: 'Person holding knee in pain, representing gout attack in the joint',
    cardImage: '/gout.jpeg',
    overview: [
      'Gout is a common and treatable form of inflammatory arthritis that occurs when uric acid builds up in the blood and forms sharp crystals in the joints. It often affects the big toe but can involve the ankles, knees, hands, and other joints.',
      'Gout attacks typically come on suddenly, often at night, causing intense pain, redness, and swelling. Without treatment, repeated attacks can damage joints and lead to hard uric acid deposits called tophi.',
    ],
    sections: [
      {
        heading: 'Symptoms',
        body: [
          'A gout attack usually causes sudden, severe joint pain, redness, warmth, and swelling, most often in the big toe. Attacks can be triggered by certain foods, alcohol, dehydration, or stress. Some patients develop chronic gout with ongoing joint issues.',
        ],
      },
      {
        heading: 'Diagnosis',
        body: [
          'Diagnosis is based on the pattern of symptoms, a physical exam, blood tests for uric acid levels, and sometimes analysis of joint fluid to confirm the presence of uric acid crystals. Identifying triggers and underlying causes guides an effective treatment plan.',
        ],
      },
    ],
    symptoms: [
      'Sudden, intense joint pain, often in the big toe',
      'Redness, warmth, and swelling in the affected joint',
      'Attacks that often begin at night',
      'Reduced joint movement as the attack progresses',
    ],
    treatmentIntro:
      'Treatment for gout focuses on relieving acute attacks and lowering uric acid levels to prevent future episodes and joint damage. Options include anti-inflammatory medications, uric-acid-lowering therapy, lifestyle guidance, and monitoring of kidney function.',
    ctaHeading: 'Expert Gout Treatment in Brick & Freehold, NJ',
    ctaBody:
      'If sudden joint pain is disrupting your life, our rheumatology team can confirm gout and build a plan to prevent future attacks.',
    metaTitle: 'Gout Treatment | MD Abidi Arthritis Institute',
    metaDescription:
      'Expert gout treatment in Brick and Freehold, NJ. Rheumatology care to relieve attacks and lower uric acid for lasting joint health.',
  },
];

export const getCondition = (slug: string) =>
  conditions.find((c) => c.slug === slug);

export const getRelated = (slug: string, count = 3) =>
  conditions.filter((c) => c.slug !== slug).slice(0, count);
