import { IVPackageDetail } from '@/components/iv/IVPackageDetail';

const related = [
  { name: 'The Myers', price: 200, image: '/Mysers.png', description: 'Classic vitamin cocktail to replenish vital nutrients and boost energy.', href: '/iv-packages/the-myers/' },
  { name: 'The Migraine Minimizer', price: 225, totalValue: 250, image: '/migranine minimizer.png', description: 'Instant migraine and headache relief cocktail.', href: '/iv-packages/the-migraine-minimizer/' },
  { name: 'Saline', price: 125, image: '/saline.png', description: 'Fast, effective hydration with our saline solution.', href: '/iv-packages/saline/' },
];

export function MTO() {
  return (
    <IVPackageDetail
      slug="mto"
      name="MTO"
      price={160}
      totalValue={165}
      image="/MTO.png"
      heroSubtitle="Made To Order For Your Specific Needs"
      tagline="The MTO is a fully customizable package designed to fit your needs. Choose 2 add-ons of your choice to create the perfect combination."
      description="Our Made to Order package provides the perfect solution for individuals looking for personalized and targeted IV therapy. This package allows you to choose two items from our add-in menu to be administered with a liter of saline. Your nurse can assist you in building the best package to suit your needs. Does not include NAD+."
      dosages="1L Normal Saline + 2 add-ons of your choice"
      bestFor={['Headache', 'Nausea', 'Fatigue', 'Muscle Cramps', 'Dehydration']}
      ingredients={[
        { abbr: 'S', name: 'Normal Saline', description: 'Hydrates, replenishes electrolytes, balances fluid levels and treats dehydration — the foundation of every MTO.' },
      ]}
      addOns={[
        { name: 'Toradol', price: '+$25', description: 'Non-steroidal anti-inflammatory for pain relief, inflammation reduction and migraine combat.' },
        { name: 'Pepcid', price: '+$25', description: 'Prevents excess stomach acid. Great for sour stomach, reflux or heartburn.' },
        { name: 'Benadryl', price: '+$25', description: 'Anti-histamine for allergy symptoms, insomnia, nausea and migraines.' },
        { name: 'Vitamin C', price: '+$25', description: 'Powerful antioxidant that protects cells against free radicals and boosts immune system.' },
        { name: 'Vitamin B12', price: '+$25', description: 'Maintains nerve and blood cell health. Reduces fatigue and improves brain function.' },
        { name: 'Vitamin B Complex', price: '+$25', description: 'Includes riboflavin, folic acid, niacin and B6 for energy, brain function and metabolism.' },
        { name: 'Zofran', price: '+$25', description: 'Relieves nausea and vomiting. Safe during second and third trimester of pregnancy.' },
        { name: 'Magnesium', price: '+$25', description: 'Supports circulatory system, normalizes blood pressure and relieves muscle cramps.' },
      ]}
      related={related}
    />
  );
}
