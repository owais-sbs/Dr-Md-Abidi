import { IVPackageDetail } from '@/components/iv/IVPackageDetail';

const related = [
  { name: 'The Migraine Minimizer', price: 225, totalValue: 250, image: '/migranine minimizer.png', description: 'Instant relief with our specially designed migraine cocktail.', href: '/iv-packages/the-migraine-minimizer/' },
  { name: 'Go With The Flow', price: 225, totalValue: 275, image: '/go with the flow.png', description: 'Designed specifically for PMS symptoms — get back to life fast.', href: '/iv-packages/go-with-the-flow/' },
  { name: 'Saline', price: 125, image: '/saline.png', description: 'Fast, effective hydration anywhere with our saline solution.', href: '/iv-packages/saline/' },
];

export function TheAfterParty() {
  return (
    <IVPackageDetail
      slug="the-after-party"
      name="The After Party"
      price={175}
      image="/The after party.png"
      heroSubtitle="The Hangover Recovery IV Package"
      tagline="Detox, rehydrate and feel revived. Replenish vital nutrients lost from alcohol consumption and get rid of that headache and nausea fast."
      description="Great for the night after you partied a little too hard. This package contains vitamins that alcohol consumption destroys — B12 and B Complex. Toradol addresses your headache and Zofran handles your nausea. You will be back on your feet in no time."
      dosages="4mg Zofran, 30mg Toradol, 1ml B Complex, 2000mcg B12"
      bestFor={['Hangover', 'Headache', 'Nausea', 'Dehydration', 'Fatigue', 'Stress', 'Mood Boost', 'Jet Lag']}
      ingredients={[
        { abbr: 'Z', name: 'Zofran', dosage: '4mg', description: 'Relieves nausea and vomiting. Can be given during pregnancy (second and third trimester) for nausea symptoms.' },
        { abbr: 'T', name: 'Toradol', dosage: '30mg', description: 'A non-steroidal anti-inflammatory used to relieve pain, reduce inflammation and combat migraines. Not suitable if pregnant.' },
        { abbr: 'B', name: 'Vitamin B Complex', dosage: '1ml', description: 'Includes riboflavin, folic acid, niacin and B6. Boosts energy, improves brain function and regulates metabolism and mood.' },
        { abbr: 'B12', name: 'Vitamin B12', dosage: '2000mcg', description: 'Maintains nerve and blood cell health. Reduces feelings of fatigue, improves brain function and regulates mood.' },
      ]}
      addOns={[
        { name: 'Glutathione', price: '+$25', description: 'Known as the liver detoxer — boosts immunity, improves skin health and fights oxidative stress and inflammation.' },
        { name: 'Intramuscular Shots', price: '+$30 each', description: 'IM injections include Vitamin B12, Toradol, or Vitamin D.' },
        { name: 'Magnesium', price: '+$25', description: 'Supports the circulatory system, keeps blood pressure normal and can relieve muscle cramps.' },
        { name: 'NAD+', price: '+$1/mg', description: 'Fights chronic fatigue, brain fog, and inflammation. A vitamin B3 derivative found in every cell of the body.' },
        { name: 'Toradol', price: '+$25', description: 'Additional anti-inflammatory for pain relief and migraine combat.' },
        { name: 'Vitamin B Complex', price: '+$25', description: 'Extra B complex boost for energy and metabolism support.' },
        { name: 'Vitamin B12', price: '+$25', description: 'Additional B12 to further reduce fatigue and improve brain function.' },
        { name: 'Pepcid', price: '+$25', description: 'Prevents excess stomach acid — ideal for sour stomach, reflux or heartburn.' },
        { name: 'Benadryl', price: '+$25', description: 'Anti-histamine useful for allergy symptoms, insomnia, nausea and migraines.' },
      ]}
      related={related}
    />
  );
}
