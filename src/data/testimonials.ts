export interface Testimonial {
  name: string;
  location: string;
  image: string;
  quote: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    name: 'Sarah Williams',
    location: 'Brick, NJ',
    image:
      'https://images.pexels.com/photos/3936894/pexels-photo-3936894.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
    quote:
      'After years of joint pain and stiffness, Dr. Abidi and his team finally gave me a clear diagnosis and a treatment plan that works. I can move again without fear of pain. The care I received was compassionate and thorough from the very first visit.',
    rating: 5,
  },
  {
    name: 'James Anderson',
    location: 'Freehold, NJ',
    image:
      'https://images.pexels.com/photos/35490803/pexels-photo-35490803.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
    quote:
      'I was nervous about seeing a rheumatologist, but the team made me feel comfortable right away. My rheumatoid arthritis is finally under control, and I have my energy back. I cannot thank them enough for the difference they have made in my life.',
    rating: 5,
  },
  {
    name: 'Emily Turner',
    location: 'Brick, NJ',
    image:
      'https://images.pexels.com/photos/16869444/pexels-photo-16869444.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
    quote:
      'The staff is friendly, the office is welcoming, and Dr. Abidi truly listens. My psoriatic arthritis symptoms have improved dramatically, and I finally feel like someone understands what I am going through. Highly recommend this practice.',
    rating: 5,
  },
];
