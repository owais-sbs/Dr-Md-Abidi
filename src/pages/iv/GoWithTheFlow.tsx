import { IVPackageDetail } from '@/components/iv/IVPackageDetail';

const related = [
  { name: 'The Migraine Minimizer', price: 225, totalValue: 250, image: '/migranine minimizer.png', description: 'Instant migraine and headache relief cocktail.', href: '/iv-packages/the-migraine-minimizer/' },
  { name: 'The After Party', price: 175, image: '/The after party.png', description: 'Detox and rehydrate after a long night out.', href: '/iv-packages/the-after-party/' },
  { name: 'Saline', price: 125, image: '/saline.png', description: 'Fast, effective hydration with our saline solution.', href: '/iv-packages/saline/' },
];

export function GoWithTheFlow() {
  return (
    <IVPackageDetail
      slug="go-with-the-flow"
      name="Go With The Flow"
      price={225}
      totalValue={275}
      image="/go with the flow.png"
      heroSubtitle="That Time Of The Month? Just Go With The Flow."
      tagline="It's that time of the month and you are feeling miserable. Life doesn't wait. Designed specifically with PMS symptoms in mind to get you feeling better, fast."
      description="We know that time of the month can make you feel awful and the truth is, we know that you don't have the time to feel bad. This package was designed with women in mind. Go with the Flow contains maximum dose Magnesium, B12, B Complex, Zinc, Toradol, and Zofran. These ingredients help combat those nasty PMS symptoms like headache, cramps, bloating, fatigue, and nausea to get you back to your busy life."
      dosages="1000mg Magnesium, 1ml Zinc, 1ml B Complex, 1ml B12, 30mg Toradol, 4mg Zofran"
      bestFor={['Menstrual Cramps', 'Headache', 'Bloating', 'Fatigue', 'Nausea']}
      ingredients={[
        { abbr: 'MG', name: 'Magnesium', dosage: '1000mg', description: 'Supports the circulatory system, keeps blood pressure normal, strengthens bones, regulates nerve function and relieves muscle cramps.' },
        { abbr: 'B12', name: 'Vitamin B12', dosage: '1ml', description: 'Maintains nerve and blood cell health. Reduces fatigue, improves brain function and regulates mood and metabolism.' },
        { abbr: 'B', name: 'Vitamin B Complex', dosage: '1ml', description: 'Includes riboflavin, folic acid, niacin and B6. Boosts energy, improves brain function and regulates metabolism and mood.' },
        { abbr: 'Z', name: 'Zinc', dosage: '1ml', description: 'Essential mineral that helps the body resist infection and aids in tissue repair. Improves skin and vision and regulates hormones.' },
        { abbr: 'T', name: 'Toradol', dosage: '30mg', description: 'Non-steroidal anti-inflammatory used to relieve pain, reduce inflammation and combat migraines. Not suitable during pregnancy.' },
        { abbr: 'Z', name: 'Zofran', dosage: '4mg', description: 'Relieves nausea and vomiting. Can be given during pregnancy (second and third trimester) for nausea symptoms.' },
      ]}
      addOns={[
        { name: 'Glutathione', price: '+$25', description: 'The liver detoxer antioxidant — boosts immunity, improves skin health and fights oxidative stress.' },
        { name: 'Intramuscular Shots', price: '+$30 each', description: 'IM injections: Vitamin B12, Toradol, or Vitamin D.' },
        { name: 'Magnesium', price: '+$25', description: 'Extra magnesium for additional muscle cramp relief and circulatory support.' },
        { name: 'NAD+', price: '+$1/mg', description: 'Fights chronic fatigue, brain fog and inflammation. Revolutionary cellular energy coenzyme.' },
        { name: 'Toradol', price: '+$25', description: 'Additional anti-inflammatory for enhanced pain relief.' },
        { name: 'Vitamin B Complex', price: '+$25', description: 'Extra B complex for energy and metabolism.' },
        { name: 'Vitamin B12', price: '+$25', description: 'Additional B12 to further combat fatigue.' },
        { name: 'Pepcid', price: '+$25', description: 'Prevents excess stomach acid for reflux or heartburn.' },
        { name: 'Benadryl', price: '+$25', description: 'Anti-histamine for allergy symptoms, insomnia and nausea.' },
      ]}
      related={related}
    />
  );
}
