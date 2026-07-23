export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  brand: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  stock: number;
  sold: number;
  image: string;
  images: string[];
  description: string;
  features: string[];
  specifications: { label: string; value: string }[];
  isFeatured: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  tags: string[];
}

const img = (id: string) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`;

export const products: Product[] = [
  {
    id: 'prod-1', name: 'Tractor - 50 HP', slug: 'tractor-50-hp', category: 'Farm Machinery', categorySlug: 'farm-machinery',
    brand: 'Mahindra', price: 595000, originalPrice: 650000, discount: 8, rating: 4.7, reviewCount: 124, stock: 15, sold: 340,
    image: img('2253413'), images: [img('2253413')],
    description: '50 HP tractor with power steering, oil immersed brakes, and 1500 kg lifting capacity. Designed for heavy-duty farming operations.',
    features: ['50 HP Engine', 'Power Steering', 'Oil Immersed Brakes', '1500 kg Lifting Capacity', 'Fuel Efficient'],
    specifications: [
      { label: 'Engine Power', value: '50 HP' }, { label: 'Cylinders', value: '4' }, { label: 'Gear Box', value: '8F + 2R' },
      { label: 'Hydraulic Lift', value: '1500 kg' }, { label: 'Warranty', value: '2 Years' },
    ],
    isFeatured: true, isBestSeller: true, isNew: false, tags: ['tractor', 'heavy-duty'],
  },
  {
    id: 'prod-2', name: 'Power Tiller - 7 HP Diesel', slug: 'power-tiller-7hp-diesel', category: 'Farm Machinery', categorySlug: 'farm-machinery',
    brand: 'Kisankraft', price: 45000, originalPrice: 52000, discount: 13, rating: 4.5, reviewCount: 134, stock: 25, sold: 280,
    image: img('11976325'), images: [img('11976325')],
    description: '7 HP diesel power tiller for soil preparation. Heavy duty, fuel efficient, and self-propelled for easy operation.',
    features: ['7 HP Diesel Engine', 'Adjustable Tilling Depth', 'Self Propelled', 'Multi-Use', 'Heavy Duty'],
    specifications: [
      { label: 'Engine Power', value: '7 HP' }, { label: 'Fuel', value: 'Diesel' }, { label: 'Tilling Width', value: '80 cm' },
      { label: 'Weight', value: '120 kg' }, { label: 'Warranty', value: '2 Years' },
    ],
    isFeatured: true, isBestSeller: true, isNew: false, tags: ['tiller', 'diesel'],
  },
  {
    id: 'prod-4', name: 'Cultivator - 9 Tine', slug: 'cultivator-9-tine', category: 'Farm Machinery', categorySlug: 'farm-machinery',
    brand: 'Sai Agro', price: 12500, originalPrice: 15000, discount: 17, rating: 4.3, reviewCount: 156, stock: 30, sold: 420,
    image: img('11996939'), images: [img('11996939')],
    description: '9-tine cultivator for inter-cultivation and weed control. Spring-loaded tines for smooth operation in all soil types.',
    features: ['9 Spring Loaded Tines', 'Adjustable Row Spacing', 'Tractor Mounted', 'Reversible Shovels', 'Powder Coated'],
    specifications: [
      { label: 'Tines', value: '9' }, { label: 'Working Width', value: '5 ft' }, { label: 'Mount Type', value: 'Tractor' },
      { label: 'Weight', value: '145 kg' }, { label: 'Warranty', value: '1 Year' },
    ],
    isFeatured: false, isBestSeller: true, isNew: false, tags: ['cultivator', 'weeding'],
  },
  {
    id: 'prod-5', name: 'Disc Harrow - 16 Disc', slug: 'disc-harrow-16-disc', category: 'Farm Machinery', categorySlug: 'farm-machinery',
    brand: 'Fieldking', price: 28500, originalPrice: 32000, discount: 11, rating: 4.4, reviewCount: 78, stock: 20, sold: 130,
    image: img('33557002'), images: [img('33557002')],
    description: '16-disc harrow for breaking clods and preparing seedbeds. Notched discs for better soil penetration.',
    features: ['16 Notched Discs', 'Adjustable Angle', 'Tractor Mounted', 'Heavy Duty Frame', 'Bearings'],
    specifications: [
      { label: 'Discs', value: '16' }, { label: 'Disc Size', value: '22 inch' }, { label: 'Working Width', value: '6 ft' },
      { label: 'Mount Type', value: 'Tractor' }, { label: 'Warranty', value: '2 Years' },
    ],
    isFeatured: false, isBestSeller: false, isNew: false, tags: ['harrow', 'soil-prep'],
  },
  {
    id: 'prod-6', name: 'Seed Drill - 9 Row', slug: 'seed-drill-9-row', category: 'Farm Machinery', categorySlug: 'farm-machinery',
    brand: 'Sai Agro', price: 32000, originalPrice: 38000, discount: 16, rating: 4.5, reviewCount: 92, stock: 15, sold: 110,
    image: img('16407472'), images: [img('16407472')],
    description: '9-row seed drill for precise seeding of wheat, maize, and other crops. Adjustable seed rate and depth control.',
    features: ['9 Rows', 'Adjustable Seed Rate', 'Depth Control', 'Tractor Mounted', 'Fertilizer Attachment'],
    specifications: [
      { label: 'Rows', value: '9' }, { label: 'Row Spacing', value: '22 cm' }, { label: 'Hopper Capacity', value: '45 kg' },
      { label: 'Mount Type', value: 'Tractor' }, { label: 'Warranty', value: '2 Years' },
    ],
    isFeatured: true, isBestSeller: false, isNew: true, tags: ['seed-drill', 'planting'],
  },
  {
    id: 'prod-7', name: 'Power Sprayer - 2 Stroke', slug: 'power-sprayer-2-stroke', category: 'Sprayers', categorySlug: 'sprayers',
    brand: 'Aspee', price: 8500, originalPrice: 10500, discount: 19, rating: 4.5, reviewCount: 234, stock: 40, sold: 560,
    image: img('19809409'), images: [img('19809409')],
    description: '2-stroke petrol power sprayer with high pressure output. Ideal for orchards and large area pest control.',
    features: ['2-Stroke Petrol Engine', 'High Pressure Pump', '20L Tank', 'Adjustable Nozzle', 'Long Hose'],
    specifications: [
      { label: 'Engine', value: '2-Stroke Petrol' }, { label: 'Tank', value: '20 L' }, { label: 'Pressure', value: '25 bar' },
      { label: 'Hose Length', value: '8 m' }, { label: 'Warranty', value: '1 Year' },
    ],
    isFeatured: true, isBestSeller: true, isNew: false, tags: ['power-sprayer', 'pest-control'],
  },
  {
    id: 'prod-8', name: 'Battery Sprayer 16L', slug: 'battery-sprayer-16l', category: 'Sprayers', categorySlug: 'sprayers',
    brand: 'Aspee', price: 6500, originalPrice: 8500, discount: 24, rating: 4.6, reviewCount: 178, stock: 50, sold: 450,
    image: img('9280745'), images: [img('9280745')],
    description: '16L battery operated sprayer with lithium battery. Effortless spraying with automatic pressure maintenance.',
    features: ['16L Capacity', 'Lithium Battery', 'Auto Pressure', 'USB Charging', '8hr Runtime'],
    specifications: [
      { label: 'Capacity', value: '16 L' }, { label: 'Battery', value: '12V 8Ah' }, { label: 'Runtime', value: '8 hours' },
      { label: 'Pressure', value: '0.2-0.4 MPa' }, { label: 'Warranty', value: '2 Years' },
    ],
    isFeatured: true, isBestSeller: true, isNew: true, tags: ['battery', 'automatic'],
  },
  {
    id: 'prod-9', name: 'Knapsack Sprayer 16L Manual', slug: 'knapsack-sprayer-16l-manual', category: 'Sprayers', categorySlug: 'sprayers',
    brand: 'Aspee', price: 1850, originalPrice: 2500, discount: 26, rating: 4.5, reviewCount: 345, stock: 100, sold: 1200,
    image: img('28299464'), images: [img('28299464')],
    description: '16 liter manual knapsack sprayer with brass pump. Durable HDPE tank with adjustable nozzle and shoulder straps.',
    features: ['16L Capacity', 'Brass Pump', 'Adjustable Nozzle', 'Shoulder Straps', 'Leak Proof'],
    specifications: [
      { label: 'Capacity', value: '16 L' }, { label: 'Pump', value: 'Brass' }, { label: 'Tank', value: 'HDPE' },
      { label: 'Wand', value: 'Stainless Steel' }, { label: 'Warranty', value: '1 Year' },
    ],
    isFeatured: false, isBestSeller: true, isNew: false, tags: ['knapsack', 'manual'],
  },
  {
    id: 'prod-10', name: 'Water Pump 5HP Diesel', slug: 'water-pump-5hp-diesel', category: 'Pumps', categorySlug: 'pumps',
    brand: 'Kisankraft', price: 22500, originalPrice: 26000, discount: 13, rating: 4.4, reviewCount: 178, stock: 35, sold: 390,
    image: img('34935520'), images: [img('34935520')],
    description: '5HP diesel water pump with high discharge capacity. Portable and fuel efficient, ideal for irrigation.',
    features: ['5 HP Diesel', 'High Discharge', 'Portable', 'Easy Start', 'Low Fuel Consumption'],
    specifications: [
      { label: 'Engine Power', value: '5 HP' }, { label: 'Fuel', value: 'Diesel' }, { label: 'Discharge', value: '800 LPM' },
      { label: 'Suction', value: '3 inch' }, { label: 'Warranty', value: '1 Year' },
    ],
    isFeatured: false, isBestSeller: true, isNew: false, tags: ['water-pump', 'diesel'],
  },
  {
    id: 'prod-11', name: 'Brush Cutter - 4 Stroke', slug: 'brush-cutter-4-stroke', category: 'Garden Tools', categorySlug: 'garden-tools',
    brand: 'Honda', price: 18500, originalPrice: 22000, discount: 16, rating: 4.6, reviewCount: 156, stock: 30, sold: 320,
    image: img('11400235'), images: [img('11400235')],
    description: '4-stroke brush cutter with 1.7 HP engine. Low noise, high efficiency, multi-blade design for grass and brush.',
    features: ['1.7 HP Engine', '4-Stroke', 'Low Noise', 'Multi-Blade', 'Shoulder Strap'],
    specifications: [
      { label: 'Engine Power', value: '1.7 HP' }, { label: 'Stroke', value: '4-Stroke' }, { label: 'Blade', value: 'Multi' },
      { label: 'Weight', value: '8.5 kg' }, { label: 'Warranty', value: '2 Years' },
    ],
    isFeatured: true, isBestSeller: true, isNew: false, tags: ['brush-cutter', '4-stroke'],
  },
  {
    id: 'prod-12', name: 'Chainsaw - Electric 2400W', slug: 'chainsaw-electric-2400w', category: 'Garden Tools', categorySlug: 'garden-tools',
    brand: 'Stanley', price: 12500, originalPrice: 15000, discount: 17, rating: 4.4, reviewCount: 89, stock: 25, sold: 180,
    image: img('8489859'), images: [img('8489859')],
    description: 'Electric chainsaw with 2400W motor. 18-inch bar with auto oiler and safety brake for tree pruning and felling.',
    features: ['2400W Motor', '18 inch Bar', 'Auto Oiler', 'Safety Brake', 'Light Weight'],
    specifications: [
      { label: 'Power', value: '2400W' }, { label: 'Bar Length', value: '18 inch' }, { label: 'Chain Speed', value: '15 m/s' },
      { label: 'Weight', value: '5.5 kg' }, { label: 'Warranty', value: '1 Year' },
    ],
    isFeatured: false, isBestSeller: false, isNew: false, tags: ['chainsaw', 'electric'],
  },
  {
    id: 'prod-13', name: 'Chaff Cutter - Electric', slug: 'chaff-cutter-electric', category: 'Farm Machinery', categorySlug: 'farm-machinery',
    brand: 'Kisankraft', price: 15500, originalPrice: 19000, discount: 18, rating: 4.3, reviewCount: 112, stock: 20, sold: 240,
    image: img('38247817'), images: [img('38247817')],
    description: 'Electric chaff cutter for fodder preparation. Cuts dry and green fodder efficiently for livestock feed.',
    features: ['Electric Motor', 'High Capacity', 'Blade System', 'Safety Guard', 'Low Maintenance'],
    specifications: [
      { label: 'Motor', value: '2 HP Electric' }, { label: 'Capacity', value: '400 kg/hr' }, { label: 'Blades', value: '2' },
      { label: 'Weight', value: '85 kg' }, { label: 'Warranty', value: '1 Year' },
    ],
    isFeatured: false, isBestSeller: true, isNew: false, tags: ['chaff-cutter', 'fodder'],
  },
  {
    id: 'prod-14', name: 'Mini Rice Mill', slug: 'mini-rice-mill', category: 'Farm Machinery', categorySlug: 'farm-machinery',
    brand: 'Kisankraft', price: 28500, originalPrice: 34000, discount: 16, rating: 4.4, reviewCount: 67, stock: 12, sold: 95,
    image: img('2496592'), images: [img('2496592')],
    description: 'Mini rice mill for small-scale rice processing. Removes husk and polishes rice grains efficiently.',
    features: ['Compact Design', 'High Output', 'Low Power', 'Easy Operation', 'Husk Separator'],
    specifications: [
      { label: 'Motor', value: '3 HP Electric' }, { label: 'Capacity', value: '150 kg/hr' }, { label: 'Power', value: 'Single Phase' },
      { label: 'Weight', value: '120 kg' }, { label: 'Warranty', value: '1 Year' },
    ],
    isFeatured: true, isBestSeller: false, isNew: true, tags: ['rice-mill', 'processing'],
  },
  {
    id: 'prod-15', name: 'Maize Sheller - Electric', slug: 'maize-sheller-electric', category: 'Farm Machinery', categorySlug: 'farm-machinery',
    brand: 'Kisankraft', price: 18500, originalPrice: 22000, discount: 16, rating: 4.3, reviewCount: 84, stock: 15, sold: 130,
    image: img('13002754'), images: [img('13002754')],
    description: 'Electric maize sheller for removing kernels from cobs. High throughput with minimal grain breakage.',
    features: ['Electric Motor', 'High Efficiency', 'Low Breakage', 'Easy Feed', 'Compact Design'],
    specifications: [
      { label: 'Motor', value: '2 HP Electric' }, { label: 'Capacity', value: '500 kg/hr' }, { label: 'Power', value: 'Single Phase' },
      { label: 'Weight', value: '95 kg' }, { label: 'Warranty', value: '1 Year' },
    ],
    isFeatured: false, isBestSeller: false, isNew: true, tags: ['maize-sheller', 'processing'],
  },
  {
    id: 'prod-16', name: 'Earth Auger - Petrol 68cc', slug: 'earth-auger-petrol-68cc', category: 'Garden Tools', categorySlug: 'garden-tools',
    brand: 'Kisankraft', price: 12500, originalPrice: 15000, discount: 17, rating: 4.4, reviewCount: 98, stock: 25, sold: 190,
    image: img('14840752'), images: [img('14840752')],
    description: '68cc petrol earth auger for drilling holes for fencing, planting, and construction. Quick start with multiple bit sizes.',
    features: ['68cc Petrol Engine', 'Multiple Bit Sizes', 'Quick Start', 'Ergonomic Handle', 'Heavy Duty'],
    specifications: [
      { label: 'Engine', value: '68cc Petrol' }, { label: 'Bit Sizes', value: '100/150/200 mm' }, { label: 'Power', value: '2.5 HP' },
      { label: 'Weight', value: '11 kg' }, { label: 'Warranty', value: '1 Year' },
    ],
    isFeatured: false, isBestSeller: false, isNew: false, tags: ['auger', 'drilling'],
  },
  {
    id: 'prod-17', name: 'Hedge Trimmer - Electric 600W', slug: 'hedge-trimmer-electric-600w', category: 'Garden Tools', categorySlug: 'garden-tools',
    brand: 'Stanley', price: 4500, originalPrice: 6000, discount: 25, rating: 4.3, reviewCount: 145, stock: 35, sold: 280,
    image: img('24595769'), images: [img('24595769')],
    description: '600W electric hedge trimmer with dual-action blade for clean cuts. Lightweight design for extended use.',
    features: ['600W Motor', 'Dual-Action Blade', 'Light Weight', 'Safety Switch', '600mm Blade'],
    specifications: [
      { label: 'Power', value: '600W' }, { label: 'Blade', value: '600 mm' }, { label: 'Stroke', value: '14 mm' },
      { label: 'Weight', value: '3.5 kg' }, { label: 'Warranty', value: '1 Year' },
    ],
    isFeatured: false, isBestSeller: true, isNew: false, tags: ['hedge-trimmer', 'electric'],
  },
  {
    id: 'prod-18', name: 'Manual Weeder - Long Handle', slug: 'manual-weeder-long-handle', category: 'Hand Tools', categorySlug: 'hand-tools',
    brand: 'Balwaan', price: 850, originalPrice: 1200, discount: 29, rating: 4.2, reviewCount: 256, stock: 200, sold: 890,
    image: img('25190741'), images: [img('25190741')],
    description: 'Long handle manual weeder with steel claw head. Removes weeds at root without bending. Stand-up operation.',
    features: ['Long Handle', 'Steel Claw', 'Stand-Up Use', 'Eco-Friendly', 'Light Weight'],
    specifications: [
      { label: 'Handle', value: '150 cm' }, { label: 'Claw', value: '4-Prong Steel' }, { label: 'Weight', value: '1.2 kg' },
      { label: 'Warranty', value: '1 Year' },
    ],
    isFeatured: false, isBestSeller: false, isNew: false, tags: ['weeder', 'manual'],
  },
  {
    id: 'prod-19', name: 'Pruning Shears - Professional', slug: 'pruning-shears-professional', category: 'Hand Tools', categorySlug: 'hand-tools',
    brand: 'Falcon', price: 650, originalPrice: 900, discount: 28, rating: 4.6, reviewCount: 428, stock: 300, sold: 1850,
    image: img('4751990'), images: [img('4751990')],
    description: 'Professional grade pruning shears with titanium coated blade. Clean cuts up to 25mm diameter with ergonomic grip.',
    features: ['Titanium Blade', 'Ergonomic Grip', 'Safety Lock', 'Spring Loaded', 'Cut Diameter 25mm'],
    specifications: [
      { label: 'Blade', value: 'Titanium Coated' }, { label: 'Cut Diameter', value: '25mm' }, { label: 'Handle', value: 'Anti-Slip' },
      { label: 'Weight', value: '280g' }, { label: 'Warranty', value: '2 Years' },
    ],
    isFeatured: true, isBestSeller: true, isNew: false, tags: ['pruning', 'professional'],
  },
  {
    id: 'prod-20', name: 'Lawn Mower - Petrol 4 Stroke', slug: 'lawn-mower-petrol-4-stroke', category: 'Garden Tools', categorySlug: 'garden-tools',
    brand: 'Honda', price: 28500, originalPrice: 34000, discount: 16, rating: 4.6, reviewCount: 178, stock: 20, sold: 310,
    image: img('6728919'), images: [img('6728919')],
    description: '4-stroke petrol lawn mower with 18-inch cutting deck. Adjustable cutting height and grass catcher included.',
    features: ['4-Stroke Engine', '18 Inch Deck', 'Adjustable Height', 'Grass Catcher', 'Easy Start'],
    specifications: [
      { label: 'Engine', value: '4-Stroke Petrol' }, { label: 'Cutting Width', value: '18 inch' }, { label: 'Height Adjust', value: '5 Levels' },
      { label: 'Grass Catcher', value: '50 L' }, { label: 'Warranty', value: '2 Years' },
    ],
    isFeatured: true, isBestSeller: true, isNew: false, tags: ['lawn-mower', 'petrol'],
  },
];

export const getFeaturedProducts = () => products.filter((p) => p.isFeatured);
export const getBestSellers = () => products.filter((p) => p.isBestSeller);
export const getNewArrivals = () => products.filter((p) => p.isNew);
export const getProductById = (id: string) => products.find((p) => p.id === id);
export const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);
export const getProductsByCategory = (categorySlug: string) => products.filter((p) => p.categorySlug === categorySlug);
export const searchProducts = (query: string) => {
  const q = query.toLowerCase();
  return products.filter(
    (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q))
  );
};
