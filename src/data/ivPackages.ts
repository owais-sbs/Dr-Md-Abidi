export interface IvPackage {
  name: string;
  price: number;
  totalValue?: number;
  badge?: string;
  image: string;
  description: string;
  includes: string[];
  slug: string;
  category?: string;
}

export interface IvAddOn {
  name: string;
  price: string;
  description: string;
}

export interface IvPackageDeal {
  title: string;
  packages: string;
  dealPrice: string;
  pricePerUnit?: string;
  description: string;
}

export const IV_ADD_ONS: IvAddOn[] = [
  {
    name: 'Glutathione Add-On',
    price: '$50',
    description: 'A powerful antioxidant that boosts immunity, improves skin health, and protects cells from oxidative stress.',
  },
  {
    name: 'NAD Add-On',
    price: '$1/MG',
    description: 'Revolutionary coenzyme that supports cellular energy, brain function, anti-aging, and circadian regulation.',
  },
];

export const IV_PACKAGE_DEALS: IvPackageDeal[] = [
  {
    title: 'Immunify & Power-Up Package',
    packages: 'Immunify & Power-Up',
    dealPrice: '3 for $900',
    pricePerUnit: '$300 per infusion',
    description: 'Special 3-session bundle for Immunify or Power-Up infusions.',
  },
  {
    title: 'FOY & Go With The Flow Package',
    packages: 'FOY & Go With The Flow',
    dealPrice: '3 for $975',
    pricePerUnit: '$325 per infusion',
    description: 'Special 3-session bundle for Fountain Of Youth or Go With The Flow infusions.',
  },
];

export const IV_PACKAGES: IvPackage[] = [
  {
    name: 'Power-Up',
    price: 325,
    badge: 'Energy',
    image: '/power-up.jpg',
    description:
      'Formulated to boost energy and support metabolic health, the Power-Up infusion is designed to help you feel more alert, focused, restores energy and fights fatigue making you physically ready for the day ahead.',
    includes: [
      'Arginine',
      'Carnitine',
      'Lysine',
      'Proline',
      'Thiamine (B1)',
      'Niacinamide (B3)',
      'Riboflavin 5 phosphate (B2)',
      'Dexpanthenol (B5)',
      'Pyridoxine (B6)',
    ],
    slug: 'power-up',
    category: 'Energy',
  },
  {
    name: 'Immunify',
    price: 325,
    badge: 'Immunity',
    image: '/immunify.jpg',
    description:
      'Designed to help your immune system, reduce the risk of illnesses and make you feel better faster after getting sick, this infusion can help improve immunity and promote optimal wellness.',
    includes: [
      'Thiamine (B1)',
      'Niacinamide (B3)',
      'Riboflavin 5 phosphate (B2)',
      'Dexpanthenol (B5)',
      'Pyridoxine (B6)',
      'Ascorbic acid (Vitamin C)',
      'Zinc',
    ],
    slug: 'immunify',
    category: 'Immunity',
  },
  {
    name: 'Go With The Flow',
    price: 350,
    badge: 'PMS Relief',
    image: '/go with the flow.png',
    description:
      'Formulated to help ease the discomfort of PMS, this infusion is designed to reduce bloating, irritability and cramping. Packed with high-quality nutrients that supports mood, hydration and muscle relaxation, providing a well-rounded approach to symptom relief.',
    includes: [
      'Calcium chloride',
      'Hydroxocobalamin (B12)',
      'Magnesium chloride',
      'Thiamine hydrochloride (B1)',
      'Niacinamide (B3)',
      'Riboflavin 5 phosphate (B2)',
      'Dexpanthenol (B5)',
      'Pyridoxine hydrochloride (B6)',
    ],
    slug: 'go-with-the-flow',
    category: 'PMS Relief',
  },
  {
    name: 'Fountain Of Youth',
    price: 350,
    badge: 'Anti-Aging',
    image: '/fountain-of-youth.jpg',
    description:
      'This infusion is designed to support healthy mitochondrial functioning and is intended for helping decrease the signs of aging while giving your skin a bright and hydrated glow.',
    includes: [
      'Thiamine (B1)',
      'Niacinamide (B3)',
      'Riboflavin 5 phosphate (B2)',
      'Dexpanthenol (B5)',
      'Pyridoxine (B6)',
      'Magnesium chloride',
      'Hydroxocobalamin (B12)',
      'Acetylcysteine',
    ],
    slug: 'fountain-of-youth',
    category: 'Anti-Aging',
  },
  {
    name: 'Myers Cocktail',
    price: 375,
    badge: 'Overall Wellness',
    image: '/Mysers.png',
    description:
      'Myers’ Cocktail IV therapy supports energy levels and help replenish nutrients tied to immune health, stress response and overall wellness.',
    includes: [
      'Ascorbic acid (Vitamin C)',
      'Magnesium chloride',
      'Dexpanthenol (B5)',
      'Riboflavin-5′-phosphate (B2)',
      'Niacinamide (B3)',
      'Pyridoxine (B6)',
      'Thiamine (B1)',
      'Calcium chloride',
    ],
    slug: 'myers-cocktail',
    category: 'Overall Wellness',
  },
  {
    name: '1,000 cc Saline Hydration',
    price: 200,
    image: '/saline.png',
    description:
      'Fast, effective hydration delivered directly to you with our premium saline solution. The foundation of recovery - pure, simple, effective.',
    includes: [
      '1,000 cc Normal Saline (or Lactated Ringers)',
      'IV administration by a registered nurse',
      'Mobile delivery to your location',
    ],
    slug: 'saline',
    category: 'Hydration',
  },
  {
    name: 'MTO',
    price: 160,
    totalValue: 165,
    image: '/MTO.png',
    description:
      'The MTO is a fully customizable package designed to fit your exact needs. Choose 2 add-ons of your choice to create the perfect combination.',
    includes: [
      '1L IV fluid base',
      'Choose any 2 add-ons from our menu',
      'Personalized to your wellness goals',
      'Nurse-administered at your location',
    ],
    slug: 'mto',
  },
  {
    name: 'The After Party',
    price: 175,
    image: '/The after party.png',
    description:
      'Detox, rehydrate, and feel revived with The After Party. Replenish vital nutrients lost from alcohol consumption and eliminate that headache and nausea fast.',
    includes: [
      '1L IV fluid',
      'Anti-nausea medication',
      'Anti-inflammatory medication',
      'B-Complex vitamins',
      'Vitamin B12',
    ],
    slug: 'the-after-party',
  },
  {
    name: 'The Migraine Minimizer',
    price: 225,
    totalValue: 250,
    image: '/migranine minimizer.png',
    description:
      'If you suffer from headaches or migraines, this package was designed for you. Instant relief with our specially formulated migraine cocktail.',
    includes: [
      '1L IV fluid',
      'Magnesium',
      'Anti-nausea medication',
      'Anti-inflammatory / pain relief medication',
      'B-Complex vitamins',
    ],
    slug: 'the-migraine-minimizer',
  },
  {
    name: 'The Defensive Line',
    price: 300,
    totalValue: 165,
    image: '/The Defnsive line.png',
    description:
      'Myers cocktail with revolutionary NAD+ for optimum performance. Supports brain health, improves insulin resistance, decreases inflammation, and regulates circadian rhythm.',
    includes: [
      '1L IV fluid',
      'Full Myers cocktail',
      'NAD+ (high-dose)',
      'Glutathione',
      'B-Complex & B12',
    ],
    slug: 'the-defensive-line',
  },
  {
    name: 'The Kitchen Sink',
    price: 400,
    image: '/The kitchen sink.png',
    description:
      'If you need an even bigger immune boost than The Defensive Line has to offer, The Kitchen Sink has you covered. Maximum dose Vitamin C, Glutathione, and Zinc.',
    includes: [
      '1L IV fluid base',
      'High-dose Vitamin C',
      'Glutathione (High dose)',
      'Zinc (High dose)',
      'Maximum Immune Support',
    ],
    slug: 'the-kitchen-sink',
  },
  {
    name: 'The greNADe',
    price: 450,
    image: '/The grenade.png',
    description:
      'Myers cocktail with revolutionary NAD+ for optimum performance. Supports brain health, improves insulin resistance, decreases inflammation, and regulates circadian rhythm.',
    includes: [
      'Everything in the Myers cocktail',
      '250mg NAD+',
      'Glutathione (400mg)',
      'Ultimate Cellular Bioenergetics',
    ],
    slug: 'the-grenade',
  },
];

