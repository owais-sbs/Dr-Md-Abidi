import { IVPackageDetail } from '@/components/iv/IVPackageDetail';

const related = [
  { name: 'The Myers', price: 200, image: '/Mysers.png', description: 'Classic vitamin cocktail to replenish vital nutrients.', href: '/iv-packages/the-myers/' },
  { name: 'MTO', price: 160, totalValue: 165, image: '/MTO.png', description: 'Fully customizable — choose 2 add-ons of your choice.', href: '/iv-packages/mto/' },
  { name: 'The After Party', price: 175, image: '/The after party.png', description: 'Detox and rehydrate after a long night.', href: '/iv-packages/the-after-party/' },
];

export function Saline() {
  return (
    <IVPackageDetail
      slug="saline"
      name="Saline"
      price={125}
      image="/saline.png"
      heroSubtitle="Why Choose A Saline IV Drip"
      tagline="Fast, effective hydration anywhere with our saline solution."
      description="Our saline solution provides fast and effective hydration for anyone. A saline IV drip provides hydration and replenishment of electrolytes, which helps balance fluid levels in the body and treat dehydration. While saline alone will rehydrate you, we recommend adding vitamins or medications to your bag for additional benefits."
      dosages="1L Normal Saline (or Lactated Ringers as an alternative)"
      bestFor={['Dehydration']}
      ingredients={[
        { abbr: 'S', name: 'Normal Saline', description: 'Hydrates, replenishes electrolytes, balances fluid levels, and treats dehydration.' },
      ]}
      addOns={[
        { name: 'Glutathione', price: '+$25', description: 'Known as the "liver detoxer," a strong antioxidant that boosts immunity, improves skin health and fights oxidative stress.' },
        { name: 'Magnesium', price: '+$25', description: 'Supports the circulatory system, keeps blood pressure normal, strengthens bones and regulates nerve function.' },
        { name: 'NAD+', price: '+$1/mg', description: 'Fights chronic fatigue, brain fog, and inflammation. Found in all living cells, decreases with age and stress.' },
        { name: 'Toradol', price: '+$25', description: 'Non-steroidal anti-inflammatory used to relieve pain, reduce inflammation and combat migraines.' },
        { name: 'Vitamin B Complex', price: '+$25', description: 'Includes riboflavin, folic acid, niacin and B6. Boosts energy, improves brain function and regulates metabolism.' },
        { name: 'Vitamin B12', price: '+$25', description: 'Maintains nerve and blood cell health, reduces fatigue, improves brain function and regulates mood.' },
        { name: 'Pepcid', price: '+$25', description: 'Helps prevent excess stomach acid. Great for sour stomach, reflux, or heartburn.' },
        { name: 'Benadryl', price: '+$25', description: 'Anti-histamine for allergy symptoms, insomnia, nausea and migraines.' },
      ]}
      related={related}
    />
  );
}
