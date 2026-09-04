export interface IvPackage {
  name: string;
  price: number;
  totalValue?: number;
  badge?: string;
  image: string;
  description: string;
  includes: string[];
  slug: string;
}

export const IV_PACKAGES: IvPackage[] = [
  {
    name: 'Saline',
    price: 125,
    image: '/saline.png',
    description:
      'Fast, effective hydration delivered directly to you with our premium saline solution. The foundation of recovery - pure, simple, effective.',
    includes: [
      '1L Normal Saline (or Lactated Ringers)',
      'IV administration by a registered nurse',
      'Mobile delivery to your location',
    ],
    slug: 'saline',
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
    name: 'The Myers',
    price: 200,
    badge: 'Most Popular',
    image: '/Mysers.png',
    description:
      'This classic cocktail developed by Dr. John Myers is tailored to replenish vital nutrients and help your body feel its absolute best - revive from illness, stress, or fatigue.',
    includes: [
      '1L IV fluid',
      'Magnesium',
      'B-Complex vitamins',
      'Vitamin B12',
      'Vitamin C',
      'Calcium gluconate',
    ],
    slug: 'the-myers',
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
    name: 'Go With The Flow',
    price: 225,
    totalValue: 275,
    image: '/go with the flow.png',
    description:
      "It's that time of the month and you're feeling miserable. Life doesn't wait. This package is designed specifically with PMS symptoms in mind to get you feeling better, fast.",
    includes: [
      '1L IV fluid',
      'Magnesium',
      'Anti-nausea medication',
      'Anti-inflammatory medication',
      'B-Complex vitamins',
      'Vitamin B12',
    ],
    slug: 'go-with-the-flow',
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
];
