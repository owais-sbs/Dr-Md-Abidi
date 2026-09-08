import { IVPackageDetail } from '@/components/iv/IVPackageDetail';

const related = [
  { name: 'Power-Up', price: 325, image: '/power-up.jpg', description: 'Energy and metabolic support infusion.', href: '/iv-packages/power-up/' },
  { name: 'Myers Cocktail', price: 375, image: '/Mysers.png', description: 'Classic wellness and immunity support.', href: '/iv-packages/myers-cocktail/' },
  { name: '1,000 cc Saline Hydration', price: 200, image: '/saline.png', description: 'Essential hydration delivered directly to you.', href: '/iv-packages/saline/' },
];

export function Immunify() {
  return (
    <IVPackageDetail
      slug="immunify"
      name="Immunify"
      price={325}
      badge="Immunity"
      image="/immunify.jpg"
      heroSubtitle="Optimal Immune System Support"
      tagline="Designed to help your immune system, reduce the risk of illnesses and make you feel better faster."
      description="Designed to help your immune system, reduce the risk of illnesses and make you feel better faster after getting sick, this infusion can help improve immunity and promote optimal wellness."
      dosages="Thiamine (B1), Niacinamide (B3), Riboflavin 5 phosphate (B2), Dexpanthenol (B5), Pyridoxine (B6), Ascorbic acid (Vitamin C), Zinc"
      bestFor={['Immune Support', 'Illness Recovery', 'Seasonal Protection', 'Optimal Wellness', 'Cellular Health']}
      ingredients={[
        { abbr: 'B1', name: 'Thiamine (B1)', description: 'Supports nerve health and efficient cellular energy production.' },
        { abbr: 'B3', name: 'Niacinamide (B3)', description: 'Supports cellular health and skin barrier defense.' },
        { abbr: 'B2', name: 'Riboflavin 5 phosphate (B2)', description: 'Essential cofactor for cellular metabolism and antioxidant recycling.' },
        { abbr: 'B5', name: 'Dexpanthenol (B5)', description: 'Supports adrenal function and antibody production.' },
        { abbr: 'B6', name: 'Pyridoxine (B6)', description: 'Vital nutrient for immune cell formation and metabolic processing.' },
        { abbr: 'VIT C', name: 'Ascorbic acid (Vitamin C)', description: 'Potent antioxidant that stimulates immune cell function and neutralizes free radicals.' },
        { abbr: 'ZN', name: 'Zinc', description: 'Essential trace mineral that helps regulate immune response and accelerates recovery.' },
      ]}
      addOns={[
        { name: 'Glutathione Add-On', price: '$50', description: 'A powerful antioxidant that boosts immunity, improves skin health, and protects cells from oxidative stress.' },
        { name: 'NAD Add-On', price: '$1/MG', description: 'Revolutionary coenzyme that supports cellular energy, brain function, anti-aging, and circadian regulation.' },
      ]}
      related={related}
    />
  );
}
