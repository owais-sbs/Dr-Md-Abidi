import { IVPackageDetail } from '@/components/iv/IVPackageDetail';

const related = [
  { name: 'The After Party', price: 175, image: '/The after party.png', description: 'Detox and rehydrate after a long night out.', href: '/iv-packages/the-after-party/' },
  { name: 'Go With The Flow', price: 225, totalValue: 275, image: '/go with the flow.png', description: 'Designed specifically for PMS symptoms.', href: '/iv-packages/go-with-the-flow/' },
  { name: 'Saline', price: 125, image: '/saline.png', description: 'Fast, effective hydration anywhere.', href: '/iv-packages/saline/' },
];

export function TheMigraineMinimizer() {
  return (
    <IVPackageDetail
      slug="the-migraine-minimizer"
      name="The Migraine Minimizer"
      price={225}
      totalValue={250}
      image="/migranine minimizer.png"
      heroSubtitle="Get Instant Relief With Our Specially Designed Migraine Cocktail"
      tagline="If you suffer from headaches or migraines, this package is designed for you. Instant relief with our specially formulated migraine cocktail."
      description="Having a headache or migraine can be debilitating. We've designed an IV cocktail to bring to your home for instant relief. This package includes Toradol, Benadryl, Magnesium, Zofran and B Complex. This combination has been highly successful in relieving stubborn headaches and migraines and associated nausea. Substitutions allowed per request."
      dosages="30mg Toradol, 50mg Benadryl, 4mg Zofran, 1ml B Complex, 1000mg Magnesium"
      bestFor={['Headache', 'Migraine']}
      ingredients={[
        { abbr: 'T', name: 'Toradol', dosage: '30mg', description: 'Non-steroidal anti-inflammatory used to relieve pain, reduce inflammation and combat migraines. Not suitable during pregnancy.' },
        { abbr: 'B', name: 'Benadryl', dosage: '50mg', description: 'Anti-histamine most commonly known for treating allergy symptoms. Also used for insomnia, nausea and migraines.' },
        { abbr: 'MG', name: 'Magnesium', dosage: '1000mg', description: 'Supports the circulatory system, keeps blood pressure normal, strengthens bones and regulates nerve function. Relieves muscle cramps.' },
        { abbr: 'Z', name: 'Zofran', dosage: '4mg', description: 'Relieves nausea and vomiting due to a variety of reasons. Safe during second and third trimester of pregnancy.' },
        { abbr: 'B', name: 'Vitamin B Complex', dosage: '1ml', description: 'Includes riboflavin, folic acid, niacin and B6. Boosts energy, improves brain function and regulates metabolism and mood.' },
      ]}
      addOns={[
        { name: 'Glutathione', price: '+$25', description: 'Strong antioxidant that boosts immunity, improves skin health and fights oxidative stress.' },
        { name: 'Intramuscular Shots', price: '+$30 each', description: 'IM injections: Vitamin B12, Toradol, or Vitamin D.' },
        { name: 'Magnesium', price: '+$25', description: 'Extra magnesium for additional muscle cramp relief and nerve support.' },
        { name: 'NAD+', price: '+$1/mg', description: 'Fights chronic fatigue, brain fog and inflammation. Found in every cell of the body.' },
        { name: 'Toradol', price: '+$25', description: 'Additional anti-inflammatory for enhanced pain and migraine relief.' },
        { name: 'Vitamin B Complex', price: '+$25', description: 'Extra B complex for energy, brain function and metabolism.' },
        { name: 'Vitamin B12', price: '+$25', description: 'Additional B12 to further reduce fatigue and improve mental clarity.' },
        { name: 'Pepcid', price: '+$25', description: 'Prevents excess stomach acid for reflux or heartburn relief.' },
        { name: 'Benadryl', price: '+$25', description: 'Additional anti-histamine for allergy symptoms or insomnia.' },
      ]}
      related={related}
    />
  );
}
