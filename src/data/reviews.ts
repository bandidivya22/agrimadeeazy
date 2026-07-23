export interface Review {
  id: string;
  productId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export const reviews: Review[] = [
  {
    id: 'rev-1', productId: 'prod-1', userName: 'Rajesh Kumar', userAvatar: 'https://images.pexels.com/photos/5933416/pexels-photo-5933416.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5, date: '2024-08-15', title: 'Excellent tractor!',
    comment: 'The Mahindra 575 DI has been a workhorse on my farm. Fuel efficient and powerful.', verified: true,
  },
  {
    id: 'rev-2', productId: 'prod-1', userName: 'Suresh Patel', userAvatar: 'https://images.pexels.com/photos/36848859/pexels-photo-36848859.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 4, date: '2024-07-20', title: 'Good value for money',
    comment: 'Solid build quality. Service network could be better in rural areas.', verified: true,
  },
  {
    id: 'rev-3', productId: 'prod-2', userName: 'Lakshmi Devi', userAvatar: 'https://images.pexels.com/photos/31983759/pexels-photo-31983759.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5, date: '2024-09-01', title: 'Perfect for small farms',
    comment: 'Compact and easy to maneuver. My wife can also operate it comfortably.', verified: true,
  },
  {
    id: 'rev-4', productId: 'prod-3', userName: 'Mohammed Iqbal', userAvatar: 'https://images.pexels.com/photos/2382665/pexels-photo-2382665.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5, date: '2024-08-10', title: 'Powerful machine',
    comment: 'Handles heavy loads with ease. Great investment for our cooperative.', verified: true,
  },
  {
    id: 'rev-5', productId: 'prod-15', userName: 'Anita Sharma', userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5, date: '2024-09-15', title: 'Life saver for my garden',
    comment: 'Easy to install and works flawlessly. Water bill reduced significantly.', verified: true,
  },
  {
    id: 'rev-6', productId: 'prod-20', userName: 'Venkat Rao', userAvatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 4, date: '2024-07-05', title: 'Durable and sharp',
    comment: 'Good quality steel. Handle could be more comfortable.', verified: true,
  },
  {
    id: 'rev-7', productId: 'prod-25', userName: 'Priya Singh', userAvatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5, date: '2024-08-25', title: 'High germination rate',
    comment: 'Almost all seeds germinated. Very happy with the quality.', verified: true,
  },
  {
    id: 'rev-8', productId: 'prod-30', userName: 'Gurpreet Singh', userAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5, date: '2024-09-10', title: 'Organic and effective',
    comment: 'Switched to organic fertilizer and seeing great results in soil health.', verified: true,
  },
];

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  rating: number;
  quote: string;
  crop: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 'test-1', name: 'Ramesh Chandra', role: 'Wheat Farmer', location: 'Punjab',
    avatar: 'https://images.pexels.com/photos/5933416/pexels-photo-5933416.jpeg?auto=compress&cs=tinysrgb&w=300', rating: 5,
    quote: 'AgriMadeEazy transformed how I buy equipment. The quality and prices are unbeatable. My harvest yield increased by 30%.',
    crop: 'Wheat',
  },
  {
    id: 'test-2', name: 'Lakshmi Reddy', role: 'Organic Farmer', location: 'Andhra Pradesh',
    avatar: 'https://images.pexels.com/photos/36848859/pexels-photo-36848859.jpeg?auto=compress&cs=tinysrgb&w=300', rating: 5,
    quote: 'From seeds to tools, everything I need is in one place. The delivery to my village was surprisingly fast!',
    crop: 'Organic Vegetables',
  },
  {
    id: 'test-3', name: 'Arjun Mehta', role: 'Rice Farmer', location: 'West Bengal',
    avatar: 'https://images.pexels.com/photos/31983759/pexels-photo-31983759.jpeg?auto=compress&cs=tinysrgb&w=300', rating: 5,
    quote: 'The irrigation system I bought here saved 40% water. AgriMadeEazy\'s expert advice helped me choose the right one.',
    crop: 'Rice',
  },
  {
    id: 'test-4', name: 'Sunita Bai', role: 'Cotton Farmer', location: 'Maharashtra',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300', rating: 5,
    quote: 'As a woman farmer, I appreciate the easy-to-use tools and helpful guides. The video tutorial was perfect.',
    crop: 'Cotton',
  },
  {
    id: 'test-5', name: 'Karthik Naidu', role: 'Plantation Owner', location: 'Karnataka',
    avatar: 'https://images.pexels.com/photos/2382665/pexels-photo-2382665.jpeg?auto=compress&cs=tinysrgb&w=300', rating: 5,
    quote: 'Bulk orders on AgriMadeEazy saved me thousands. The customer support team is knowledgeable and responsive.',
    crop: 'Coffee',
  },
  {
    id: 'test-6', name: 'Fatima Begum', role: 'Vegetable Grower', location: 'Telangana',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=300', rating: 5,
    quote: 'The video guide helped me understand how to use modern tools. My small farm is now more productive.',
    crop: 'Tomatoes',
  },
];
