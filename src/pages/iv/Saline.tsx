import { IVPackageDetail } from '@/components/iv/IVPackageDetail';

const related = [
  { name: 'Power-Up', price: 325, image: '/power-up.jpg', description: 'Energy and metabolic support infusion.', href: '/iv-packages/power-up/' },
  { name: 'Immunify', price: 325, image: '/immunify.jpg', description: 'Immunity and optimal wellness support.', href: '/iv-packages/immunify/' },
  { name: 'Myers Cocktail', price: 375, image: '/Mysers.png', description: 'Classic vitamin cocktail to replenish vital nutrients.', href: '/iv-packages/myers-cocktail/' },
];

export function Saline() {
  return (
    <IVPackageDetail
      slug="saline"
      name="1,000 cc Saline Hydration"
      price={200}
      image="/saline.png"
      heroSubtitle="Pure, Essential Hydration Delivered Directly To You"
      tagline="Fast, effective hydration delivered directly to you with our premium saline solution."
      description="Fast, effective hydration delivered directly to you with our premium saline solution. The foundation of recovery - pure, simple, effective. A saline IV drip provides hydration and replenishment of electrolytes, which helps balance fluid levels in the body and treat dehydration."
      dosages="1,000 cc Normal Saline (or Lactated Ringers as an alternative)"
      bestFor={['Dehydration', 'Electrolyte Balance', 'Fluid Replenishment', 'General Hydration']}
      ingredients={[
        { abbr: 'S', name: '1,000 cc Normal Saline', description: 'Hydrates, replenishes electrolytes, balances fluid levels, and treats dehydration.' },
      ]}
      addOns={[
        { name: 'Glutathione Add-On', price: '$50', description: 'A powerful antioxidant that boosts immunity, improves skin health, and protects cells from oxidative stress.' },
        { name: 'NAD Add-On', price: '$1/MG', description: 'Revolutionary coenzyme that supports cellular energy, brain function, anti-aging, and circadian regulation.' },
      ]}
      related={related}
    />
  );
}
