import { IVPackageDetail } from '@/components/iv/IVPackageDetail';

const related = [
  { name: 'The Kitchen Sink', price: 400, image: '/The kitchen sink.png', description: 'Maximum dose Vitamin C for acute illness support.', href: '/iv-packages/the-kitchen-sink/' },
  { name: 'The Myers', price: 200, image: '/Mysers.png', description: 'Classic vitamin cocktail for energy and immune support.', href: '/iv-packages/the-myers/' },
  { name: 'The greNADe', price: 450, image: '/The grenade.png', description: 'Myers cocktail with revolutionary NAD+ for peak performance.', href: '/iv-packages/the-grenade/' },
];

export function TheDefensiveLine() {
  return (
    <IVPackageDetail
      slug="the-defensive-line"
      name="The Defensive Line"
      price={300}
      image="/The Defnsive line.png"
      heroSubtitle="What's in The Defensive Line Immune Boost IV Therapy?"
      tagline="Our #1 choice for defending your immune system. A powerful blend combining the Myers Cocktail with high-dose Vitamin C and Glutathione."
      description="The Defensive Line is built on the Myers Cocktail, a trusted formulation designed to support immune function, energy levels and mental clarity. High-dose Vitamin C helps your body respond to seasonal threats. Glutathione protects cells from oxidative stress. Zinc is essential for immune cell development. Magnesium fuels cellular energy production. B Complex and B12 maintain nervous system health and combat fatigue. Designed for busy professionals, frequent travelers, and active individuals seeking convenient immune support."
      dosages="5000mg Vitamin C, 1000mg Glutathione, 20mg Zinc, 200mg Magnesium, 1ml B Complex, 2000mcg B12"
      bestFor={['Immune Support', 'Fatigue', 'Stress', 'Athletic Recovery', 'Pre/Post Travel', 'Seasonal Illness']}
      ingredients={[
        { abbr: 'G', name: 'Glutathione', dosage: '1000mg', description: 'A powerful antioxidant that protects cells from oxidative stress, boosts immunity and improves skin health.' },
        { abbr: 'C', name: 'Vitamin C', dosage: '5000mg', description: 'Helps your body respond to seasonal threats and supports immune cell function. Vital for healing.' },
        { abbr: 'Z', name: 'Zinc', dosage: '20mg', description: 'Essential for immune cell development and communication. Aids tissue repair and regulates hormones.' },
        { abbr: 'Mg', name: 'Magnesium', dosage: '200mg', description: 'Fuels cellular energy production and helps reduce fatigue. Supports circulatory system and nerve function.' },
        { abbr: 'B12', name: 'Vitamin B12', dosage: '2000mcg', description: 'Enhances mental clarity and helps combat fatigue. Maintains nerve and blood cell health.' },
        { abbr: 'B', name: 'Vitamin B Complex', dosage: '1ml', description: 'Fuels energy metabolism and maintains nervous system health. Includes riboflavin, folic acid, niacin and B6.' },
      ]}
      addOns={[
        { name: 'Glutathione', price: '+$25', description: 'Extra glutathione boost for enhanced antioxidant protection and immunity.' },
        { name: 'Intramuscular Shots', price: '+$30 each', description: 'IM injections: Vitamin B12, Toradol, or Vitamin D.' },
        { name: 'Magnesium', price: '+$25', description: 'Additional magnesium for muscle cramp relief and energy support.' },
        { name: 'NAD+', price: '+$1/mg', description: 'Revolutionary coenzyme for cellular energy, brain health and anti-aging.' },
        { name: 'Toradol', price: '+$25', description: 'Non-steroidal anti-inflammatory for pain and inflammation relief.' },
        { name: 'Vitamin B Complex', price: '+$25', description: 'Extra B complex for energy metabolism and brain function.' },
        { name: 'Vitamin B12', price: '+$25', description: 'Additional B12 to further enhance mental clarity and reduce fatigue.' },
        { name: 'Pepcid', price: '+$25', description: 'Prevents excess stomach acid for reflux or heartburn.' },
        { name: 'Benadryl', price: '+$25', description: 'Anti-histamine for allergy symptoms, insomnia and nausea.' },
      ]}
      related={related}
    />
  );
}
