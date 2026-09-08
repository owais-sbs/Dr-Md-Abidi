import { IVPackageDetail } from '@/components/iv/IVPackageDetail';

const related = [
  { name: 'Immunify', price: 325, image: '/immunify.jpg', description: 'Immune system support and wellness boost.', href: '/iv-packages/immunify/' },
  { name: 'Myers Cocktail', price: 375, image: '/Mysers.png', description: 'Classic wellness and energy infusion.', href: '/iv-packages/myers-cocktail/' },
  { name: '1,000 cc Saline Hydration', price: 200, image: '/saline.png', description: 'Pure, essential hydration.', href: '/iv-packages/saline/' },
];

export function PowerUp() {
  return (
    <IVPackageDetail
      slug="power-up"
      name="Power-Up"
      price={325}
      badge="Energy"
      image="/power-up.jpg"
      heroSubtitle="Boost Energy & Support Metabolic Health"
      tagline="Formulated to boost energy and support metabolic health, help you feel alert, focused, and ready for the day ahead."
      description="Formulated to boost energy and support metabolic health, the Power-Up infusion is designed to help you feel more alert, focused, restores energy and fights fatigue making you physically ready for the day ahead."
      dosages="Arginine, Carnitine, Lysine, Proline, Thiamine (B1), Niacinamide (B3), Riboflavin 5 phosphate (B2), Dexpanthenol (B5), Pyridoxine (B6)"
      bestFor={['Energy Boost', 'Fatigue Relief', 'Focus & Mental Clarity', 'Metabolic Health', 'Physical Stamina']}
      ingredients={[
        { abbr: 'ARG', name: 'Arginine', description: 'Supports circulation, nitric oxide production, and nutrient transport.' },
        { abbr: 'CAR', name: 'Carnitine', description: 'Essential compound that helps convert fatty acids into cellular energy.' },
        { abbr: 'LYS', name: 'Lysine', description: 'Essential amino acid supporting tissue growth, repair, and immune function.' },
        { abbr: 'PRO', name: 'Proline', description: 'Supports collagen production, joint health, and structural tissue repair.' },
        { abbr: 'B1', name: 'Thiamine (B1)', description: 'Crucial cofactor for carbohydrate metabolism and cellular energy synthesis.' },
        { abbr: 'B3', name: 'Niacinamide (B3)', description: 'Supports cellular respiration, DNA repair, and skin vitality.' },
        { abbr: 'B2', name: 'Riboflavin 5 phosphate (B2)', description: 'Promotes cellular energy release and maintains healthy antioxidant status.' },
        { abbr: 'B5', name: 'Dexpanthenol (B5)', description: 'Supports adrenal function, fatty acid breakdown, and metabolic stamina.' },
        { abbr: 'B6', name: 'Pyridoxine (B6)', description: 'Key nutrient for neurotransmitter synthesis and energy metabolism.' },
      ]}
      addOns={[
        { name: 'Glutathione Add-On', price: '$50', description: 'A powerful antioxidant that boosts immunity, improves skin health, and protects cells from oxidative stress.' },
        { name: 'NAD Add-On', price: '$1/MG', description: 'Revolutionary coenzyme that supports cellular energy, brain function, anti-aging, and circadian regulation.' },
      ]}
      related={related}
    />
  );
}
