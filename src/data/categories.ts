export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  description: string;
  productCount: number;
}

const img = (id: string) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600`;

export const categories: Category[] = [
  {
    id: 'cat-1',
    name: 'Farm Machinery',
    slug: 'farm-machinery',
    icon: 'Tractor',
    image: img('2253413'),
    description: 'Tractors, tillers, harvesters and more',
    productCount: 8,
  },
  {
    id: 'cat-2',
    name: 'Sprayers',
    slug: 'sprayers',
    icon: 'CloudRain',
    image: img('19809409'),
    description: 'Power, battery and knapsack sprayers',
    productCount: 3,
  },
  {
    id: 'cat-3',
    name: 'Pumps',
    slug: 'pumps',
    icon: 'Droplets',
    image: img('34935520'),
    description: 'Water pumps for irrigation',
    productCount: 1,
  },
  {
    id: 'cat-4',
    name: 'Garden Tools',
    slug: 'garden-tools',
    icon: 'Wrench',
    image: img('11400235'),
    description: 'Brush cutters, chainsaws, trimmers',
    productCount: 5,
  },
  {
    id: 'cat-5',
    name: 'Hand Tools',
    slug: 'hand-tools',
    icon: 'Wrench',
    image: img('4751990'),
    description: 'Weeders, shears and manual tools',
    productCount: 2,
  },
];
