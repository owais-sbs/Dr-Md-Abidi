import { IVPackageDetail } from '@/components/iv/IVPackageDetail';

const related = [
  { name: 'Fountain Of Youth', price: 350, image: '/fountain-of-youth.jpg', description: 'Anti-aging and mitochondrial support.', href: '/iv-packages/fountain-of-youth/' },
  { name: 'Myers Cocktail', price: 375, image: '/Mysers.png', description: 'Overall wellness and energy infusion.', href: '/iv-packages/myers-cocktail/' },
  { name: 'Power-Up', price: 325, image: '/power-up.jpg', description: 'Boost energy and metabolic health.', href: '/iv-packages/power-up/' },
];

export function GoWithTheFlow() {
  return (
    <IVPackageDetail
      slug="go-with-the-flow"
      name="Go With The Flow"
      price={350}
      badge="PMS Relief"
      image="/go with the flow.png"
      heroSubtitle="PMS Symptom Relief & Nutrient Hydration"
      tagline="Formulated to help ease the discomfort of PMS, reduce bloating, irritability and cramping."
      description="Formulated to help ease the discomfort of PMS, this infusion is designed to reduce bloating, irritability and cramping. Packed with high-quality nutrients that supports mood, hydration and muscle relaxation, providing a well-rounded approach to symptom relief."
      dosages="Calcium chloride, Hydroxocobalamin (B12), Magnesium chloride, Thiamine hydrochloride (B1), Niacinamide (B3), Riboflavin 5 phosphate (B2), Dexpanthenol (B5), Pyridoxine hydrochloride (B6)"
      bestFor={['PMS Relief', 'Cramping Relief', 'Bloating Reduction', 'Mood Support', 'Muscle Relaxation', 'Hydration']}
      ingredients={[
        { abbr: 'CA', name: 'Calcium chloride', description: 'Supports muscle contractions and nerve signaling to ease cramps.' },
        { abbr: 'B12', name: 'Hydroxocobalamin (B12)', description: 'Sustained-release B12 for energy, mood balance, and nerve support.' },
        { abbr: 'MG', name: 'Magnesium chloride', description: 'Promotes muscle relaxation, reduces cramping, and supports circulatory health.' },
        { abbr: 'B1', name: 'Thiamine hydrochloride (B1)', description: 'Supports nerve function and cellular energy synthesis.' },
        { abbr: 'B3', name: 'Niacinamide (B3)', description: 'Supports cellular health, skin vitality, and energy production.' },
        { abbr: 'B2', name: 'Riboflavin 5 phosphate (B2)', description: 'Promotes cellular energy and antioxidant balance.' },
        { abbr: 'B5', name: 'Dexpanthenol (B5)', description: 'Supports adrenal health, hormone balance, and energy metabolism.' },
        { abbr: 'B6', name: 'Pyridoxine hydrochloride (B6)', description: 'Helps regulate mood, water retention, and neurotransmitter balance.' },
      ]}
      addOns={[
        { name: 'Glutathione Add-On', price: '$50', description: 'A powerful antioxidant that boosts immunity, improves skin health, and protects cells from oxidative stress.' },
        { name: 'NAD Add-On', price: '$1/MG', description: 'Revolutionary coenzyme that supports cellular energy, brain function, anti-aging, and circadian regulation.' },
      ]}
      related={related}
    />
  );
}
