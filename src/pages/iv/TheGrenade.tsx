import { IVPackageDetail } from '@/components/iv/IVPackageDetail';

const related = [
  { name: 'The Kitchen Sink', price: 400, image: '/The kitchen sink.png', description: 'Maximum dose Vitamin C for acute illness support.', href: '/iv-packages/the-kitchen-sink/' },
  { name: 'The Defensive Line', price: 300, image: '/The Defnsive line.png', description: 'Classic vitamin cocktail for energy and immune support.', href: '/iv-packages/the-myers/' },
];

export function TheGrenade() {
  return (
    <IVPackageDetail
      slug="the-grenade"
      name="The greNADe"
      price={450}
      image="/The grenade.png"
      heroSubtitle="Myers Cocktail and NAD+ For Optimum Performance"
      tagline="Myers cocktail with revolutionary NAD+ for optimum performance. Supports brain health, improves insulin resistance, decreases inflammation, and regulates circadian rhythm."
      description="The Myers Cocktail is a blend of essential vitamins and minerals, while NAD+ is a coenzyme involved in cellular energy production. The combination can help boost energy levels, support brain health and healthy aging. NAD+ IV treatment is on the cutting edge of anti-aging, detox, brain health, and longevity research. NAD+ is involved in two main chemical reactions: it helps convert nutrients into energy, and it functions as a helper molecule for proteins, acting as a regulator for many other biological processes in the body."
      dosages="Everything in the Myers plus 250mg NAD+"
      bestFor={['Athletic Performance', 'Chronic Illness', 'Covid/Flu', 'Decreased Inflammation', 'Energy Boost', 'Improved Cognition', 'Regulate Cardiac Rhythm']}
      ingredients={[
        { abbr: 'C', name: 'Vitamin C', dosage: '1000mg', description: 'Powerful antioxidant protecting cells against free radicals. Vital for healing and immune system support.' },
        { abbr: 'Gl', name: 'Glutathione', dosage: '400mg', description: 'Strong antioxidant that boosts immunity, improves skin health and fights oxidative stress and inflammation.' },
        { abbr: 'Z', name: 'Zinc', dosage: '10mg', description: 'Essential mineral for immune cell development, tissue repair and hormone regulation.' },
        { abbr: 'Mg', name: 'Magnesium', dosage: '200mg', description: 'Supports the circulatory system, keeps blood pressure normal, strengthens bones and regulates nerve function.' },
        { abbr: 'B12', name: 'Vitamin B12', dosage: '2000mcg', description: 'Maintains nerve and blood cell health. Reduces fatigue, improves brain function and regulates mood.' },
        { abbr: 'B', name: 'Vitamin B Complex', dosage: '1ml', description: 'Includes riboflavin, folic acid, niacin and B6. Boosts energy, improves brain function and regulates metabolism.' },
        { abbr: 'N', name: 'NAD+', dosage: '250mg', description: 'Nicotinamide adenine dinucleotide — a vitamin B3 derivative found in every cell. Supports brain health, reduces inflammation, regulates circadian rhythm, improves insulin resistance and supports healthy aging.' },
      ]}
      addOns={[
        { name: 'Toradol', price: '+$25', description: 'Non-steroidal anti-inflammatory for pain and inflammation relief.' },
        { name: 'Vitamin D', price: '+$25', description: 'Boosts bone and immune health, regulates mood and sleep.' },
        { name: 'Pepcid', price: '+$25', description: 'Prevents excess stomach acid. Great for sour stomach, reflux or heartburn.' },
        { name: 'Zofran', price: '+$25', description: 'Relieves nausea and vomiting. Safe during second and third trimester of pregnancy.' },
      ]}
      related={related}
    />
  );
}
