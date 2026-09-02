import { IVPackageDetail } from '@/components/iv/IVPackageDetail';

const related = [
  { name: 'The Defensive Line', price: 300, image: '/The Defnsive line.png', description: 'Classic vitamin cocktail for energy and immune support.', href: '/iv-packages/the-myers/' },
];

export function TheKitchenSink() {
  return (
    <IVPackageDetail
      slug="the-kitchen-sink"
      name="The Kitchen Sink"
      price={400}
      image="/The kitchen sink.png"
      heroSubtitle="Maximum Immune Support"
      tagline="Maximum dose Vitamin C for when you are actively fighting an acute illness. Excellent for flu, COVID, viral illnesses, and stomach bugs."
      description="If you need an even bigger immune boost than The Defensive Line has to offer, The Kitchen Sink has you covered. This IV package contains the maximum dose of Vitamin C, Glutathione, and Zinc, providing your body with the ultimate immune support. These powerful antioxidants work together to boost your immune system and help fight off illness — making it a great choice for anyone looking to maintain or improve their overall health and well-being."
      dosages="Everything in The Defensive Line with 25g Vitamin C"
      bestFor={['Covid/Flu', 'Stomach Bug', 'Pre/Post Travel', 'Sinus Infection', 'Fatigue', 'Stress', 'Headache', 'Athletic Recovery', 'Jet Lag', 'Mood Boost', 'Muscle Cramps']}
      ingredients={[
        { abbr: 'C', name: 'Vitamin C (Maximum Dose)', dosage: '25g', description: 'Maximum-dose antioxidant that protects cells against free radicals. Vital for healing and the strongest immune system boost.' },
        { abbr: 'G', name: 'Glutathione', dosage: 'High dose', description: 'Powerful antioxidant protecting cells from oxidative stress and boosting immunity.' },
        { abbr: 'Z', name: 'Zinc', dosage: 'High dose', description: 'Essential for immune cell development, communication, tissue repair and hormone regulation.' },
        { abbr: 'Mg', name: 'Magnesium', dosage: '200mg', description: 'Fuels cellular energy production and reduces fatigue. Supports the circulatory and nervous systems.' },
        { abbr: 'B12', name: 'Vitamin B12', dosage: '2000mcg', description: 'Enhances mental clarity and helps combat fatigue. Maintains nerve and blood cell health.' },
        { abbr: 'B', name: 'Vitamin B Complex', dosage: '1ml', description: 'Fuels energy metabolism and maintains nervous system health.' },
      ]}
      addOns={[
        { name: 'Toradol', price: '+$25', description: 'Non-steroidal anti-inflammatory for pain and inflammation relief.' },
        { name: 'Zofran', price: '+$25', description: 'Relieves nausea and vomiting. Safe during second and third trimester of pregnancy.' },
        { name: 'Benadryl', price: '+$25', description: 'Anti-histamine for allergy symptoms, insomnia and nausea.' },
        { name: 'Pepcid', price: '+$25', description: 'Prevents excess stomach acid for sour stomach, reflux or heartburn.' },
      ]}
      related={related}
    />
  );
}
