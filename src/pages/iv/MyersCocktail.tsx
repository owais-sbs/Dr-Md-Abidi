import { IVPackageDetail } from '@/components/iv/IVPackageDetail';

const related = [
  { name: 'Power-Up', price: 325, image: '/power-up.jpg', description: 'Boost energy and metabolic health.', href: '/iv-packages/power-up/' },
  { name: 'Immunify', price: 325, image: '/immunify.jpg', description: 'Immunity and optimal wellness infusion.', href: '/iv-packages/immunify/' },
  { name: 'Fountain Of Youth', price: 350, image: '/fountain-of-youth.jpg', description: 'Anti-aging and skin hydration glow.', href: '/iv-packages/fountain-of-youth/' },
];

export function MyersCocktail() {
  return (
    <IVPackageDetail
      slug="myers-cocktail"
      name="Myers Cocktail"
      price={375}
      badge="Overall Wellness"
      image="/Mysers.png"
      heroSubtitle="Energy, Immunity & Overall Wellness"
      tagline="Myers’ Cocktail IV therapy supports energy levels and helps replenish nutrients tied to immune health, stress response and overall wellness."
      description="Myers’ Cocktail IV therapy supports energy levels and help replenish nutrients tied to immune health, stress response and overall wellness."
      dosages="Ascorbic acid (Vitamin C), Magnesium chloride, Dexpanthenol (B5), Riboflavin-5′-phosphate (B2), Niacinamide (B3), Pyridoxine (B6), Thiamine (B1), Calcium chloride"
      bestFor={['Overall Wellness', 'Energy Boost', 'Immune Health', 'Stress Response', 'Nutrient Replenishment', 'Fatigue Recovery']}
      ingredients={[
        { abbr: 'VIT C', name: 'Ascorbic acid (Vitamin C)', description: 'High-potency antioxidant supporting immune function and free-radical defense.' },
        { abbr: 'MG', name: 'Magnesium chloride', description: 'Supports cardiovascular system, bone strength, and neuromuscular relaxation.' },
        { abbr: 'B5', name: 'Dexpanthenol (B5)', description: 'Essential for fatty acid metabolism and adrenal support.' },
        { abbr: 'B2', name: 'Riboflavin-5′-phosphate (B2)', description: 'Supports energy metabolism and cellular respiration.' },
        { abbr: 'B3', name: 'Niacinamide (B3)', description: 'Aids metabolic energy conversion and DNA repair.' },
        { abbr: 'B6', name: 'Pyridoxine (B6)', description: 'Key nutrient for red blood cell synthesis and brain function.' },
        { abbr: 'B1', name: 'Thiamine (B1)', description: 'Crucial for carbohydrate metabolism and nerve health.' },
        { abbr: 'CA', name: 'Calcium chloride', description: 'Vital mineral supporting muscle contractions and bone health.' },
      ]}
      addOns={[
        { name: 'Glutathione Add-On', price: '$50', description: 'A powerful antioxidant that boosts immunity, improves skin health, and protects cells from oxidative stress.' },
        { name: 'NAD Add-On', price: '$1/MG', description: 'Revolutionary coenzyme that supports cellular energy, brain function, anti-aging, and circadian regulation.' },
      ]}
      related={related}
    />
  );
}
