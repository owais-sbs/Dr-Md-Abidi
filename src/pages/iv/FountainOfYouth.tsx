import { IVPackageDetail } from '@/components/iv/IVPackageDetail';

const related = [
  { name: 'Go With The Flow', price: 350, image: '/go with the flow.png', description: 'PMS relief and nutrient hydration.', href: '/iv-packages/go-with-the-flow/' },
  { name: 'Myers Cocktail', price: 375, image: '/Mysers.png', description: 'Overall wellness and energy infusion.', href: '/iv-packages/myers-cocktail/' },
  { name: 'Power-Up', price: 325, image: '/power-up.jpg', description: 'Energy and metabolic support infusion.', href: '/iv-packages/power-up/' },
];

export function FountainOfYouth() {
  return (
    <IVPackageDetail
      slug="fountain-of-youth"
      name="Fountain Of Youth"
      price={350}
      badge="Anti-Aging"
      image="/fountain-of-youth.jpg"
      heroSubtitle="Anti-Aging & Mitochondrial Support"
      tagline="Designed to support healthy mitochondrial functioning and give your skin a bright and hydrated glow."
      description="This infusion is designed to support healthy mitochondrial functioning and is intended for helping decrease the signs of aging while giving your skin a bright and hydrated glow."
      dosages="Thiamine (B1), Niacinamide (B3), Riboflavin 5 phosphate (B2), Dexpanthenol (B5), Pyridoxine (B6), Magnesium chloride, Hydroxocobalamin (B12), Acetylcysteine"
      bestFor={['Anti-Aging Support', 'Mitochondrial Health', 'Skin Hydration & Glow', 'Cellular Renewal', 'Vitality Boost']}
      ingredients={[
        { abbr: 'B1', name: 'Thiamine (B1)', description: 'Supports carbohydrate metabolism and cellular energy.' },
        { abbr: 'B3', name: 'Niacinamide (B3)', description: 'Promotes cellular repair and skin hydration.' },
        { abbr: 'B2', name: 'Riboflavin 5 phosphate (B2)', description: 'Key enzyme cofactor for cellular bioenergetics.' },
        { abbr: 'B5', name: 'Dexpanthenol (B5)', description: 'Nourishes skin tissue and supports adrenal vitality.' },
        { abbr: 'B6', name: 'Pyridoxine (B6)', description: 'Aids neurotransmitter synthesis and amino acid metabolism.' },
        { abbr: 'MG', name: 'Magnesium chloride', description: 'Supports cellular function, muscle relaxation, and blood flow.' },
        { abbr: 'B12', name: 'Hydroxocobalamin (B12)', description: 'Sustained-release B12 for nerve health and cellular longevity.' },
        { abbr: 'NAC', name: 'Acetylcysteine', description: 'Potent precursor to glutathione that enhances mitochondrial detox and combats signs of aging.' },
      ]}
      addOns={[
        { name: 'Glutathione Add-On', price: '$50', description: 'A powerful antioxidant that boosts immunity, improves skin health, and protects cells from oxidative stress.' },
        { name: 'NAD Add-On', price: '$1/MG', description: 'Revolutionary coenzyme that supports cellular energy, brain function, anti-aging, and circadian regulation.' },
      ]}
      related={related}
    />
  );
}
