import { IVPackageDetail } from '@/components/iv/IVPackageDetail';

const related = [
  { name: 'The Defensive Line', price: 300, image: '/The Defnsive line.png', description: 'Designed specifically for PMS symptoms — get back to life fast.', href: '/iv-packages/go-with-the-flow/' },
];

export function TheMyers() {
  return (
    <IVPackageDetail
      slug="the-myers"
      name="The Myers"
      price={200}
      badge="Most Popular"
      image="/Mysers.png"
      heroSubtitle="Myers Cocktail: The Perfect Blend of Vitamins"
      tagline="This classic cocktail developed by Dr. John Myers replenishes vital nutrients to help your body feel its absolute best."
      description="This well-known cocktail is popular for anyone seeking relief from illness or looking to boost their energy levels and immune system. Adequate vitamin levels are essential for optimal health. By receiving these intravenously, absorption rate is close to 100%, while oral vitamin absorption can be as low as 10%. Book your Myers Cocktail today and feel the difference."
      dosages="1000mg Vitamin C, 400mg Glutathione, 10mg Zinc, 200mg Magnesium, 1ml B Complex, 2000mcg B12"
      bestFor={['Fatigue', 'Stress', 'Headache', 'Athletic Recovery', 'Dehydration', 'Jet Lag', 'Mood Boost', 'Muscle Cramps']}
      ingredients={[
        { abbr: 'G', name: 'Glutathione', dosage: '400mg', description: 'A strong antioxidant that boosts immunity, improves skin health and fights oxidative stress and inflammation.' },
        { abbr: 'C', name: 'Vitamin C', dosage: '1000mg', description: 'A powerful antioxidant that protects cells against free radicals. Vital for healing and boosts the immune system.' },
        { abbr: 'Z', name: 'Zinc', dosage: '10mg', description: 'An essential mineral that helps your body resist infection and aids in tissue repair. Also improves skin and vision.' },
        { abbr: 'MG', name: 'Magnesium', dosage: '200mg', description: 'Supports the circulatory system, keeps blood pressure normal, strengthens bones and regulates nerve function.' },
        { abbr: 'B12', name: 'Vitamin B12', dosage: '2000mcg', description: 'Maintains nerve and blood cell health. Reduces feelings of fatigue, improves brain function and regulates mood.' },
        { abbr: 'B', name: 'Vitamin B Complex', dosage: '1ml', description: 'Includes riboflavin, folic acid, niacin and B6. Boosts energy, improves brain function and regulates metabolism.' },
      ]}
      addOns={[
        { name: 'Glutathione', price: '+$25', description: 'Extra dose of the liver detoxer antioxidant for enhanced immunity and skin health.' },
        { name: 'Intramuscular Shots', price: '+$30 each', description: 'IM injections include Vitamin B12, Toradol, or Vitamin D.' },
        { name: 'Magnesium', price: '+$25', description: 'Additional magnesium for muscle cramp relief and circulatory support.' },
        { name: 'NAD+', price: '+$1/mg', description: 'Fights chronic fatigue, brain fog, and inflammation. Revolutionary coenzyme for cellular energy.' },
        { name: 'Toradol', price: '+$25', description: 'Non-steroidal anti-inflammatory for pain and migraine relief.' },
        { name: 'Vitamin B Complex', price: '+$25', description: 'Extra B complex for energy, brain function and metabolism boost.' },
        { name: 'Vitamin B12', price: '+$25', description: 'Additional B12 for fatigue reduction and mental clarity.' },
        { name: 'Pepcid', price: '+$25', description: 'Prevents excess stomach acid — great for reflux or heartburn.' },
        { name: 'Benadryl', price: '+$25', description: 'Anti-histamine for allergy symptoms, insomnia, nausea and migraines.' },
      ]}
      related={related}
    />
  );
}
