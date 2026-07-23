# AgriMadeEazy - Agricultural Tools E-Commerce Platform

A production-ready full-stack agricultural e-commerce platform built with the MERN-inspired stack (React + Vite frontend). Modern, premium SaaS design with green, white, and earthy color palette.

## Tech Stack

- **Frontend**: React.js (Vite), TypeScript, Tailwind CSS, React Router, Context API
- **UI**: Lucide React icons, custom animations, glassmorphism, dark mode
- **State**: Context API (Auth, Cart, Wishlist, Theme, Toast)
- **Auth**: JWT-style local auth with bcrypt-style password handling (demo)
- **Payments**: UPI (with QR code & UTR verification) and Cash on Delivery (COD)

## Features

### Customer-Facing
- Home page with hero banner, categories, featured products, best sellers
- Product listing with search, filters (category, price, brand, rating), sorting
- Product details with image gallery, specifications, reviews, related products
- Shopping cart with quantity management
- Wishlist
- Multi-step checkout (address → payment → review)
- Order tracking with status timeline
- Customer reviews and farmer testimonials
- Newsletter subscription
- About, Contact, FAQ, Blog pages
- "Learn How to Use AgriMadeEazy" video tutorials (English, Telugu, Hindi)
- Responsive footer with full navigation
- Dark mode toggle
- Toast notifications
- Loading skeletons

### Authentication
- Register / Login / Logout
- Protected routes
- User profile with edit capability
- Change password
- Admin role detection

### Admin Dashboard
- Dashboard with KPIs, recent orders, low stock alerts
- Product management (CRUD)
- Category management (CRUD)
- User management with status toggle
- Order management with status updates
- Payment tracking
- Analytics with charts (revenue, category breakdown, top products)

## Demo Accounts

- **User**: user@agrimadeeazy.com / user123
- **Admin**: admin@agrimadeeazy.com / admin123

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── admin/         # Admin-specific layout
├── context/           # Context API providers
├── data/              # Sample data (products, categories, reviews)
├── pages/             # Page components
│   └── admin/         # Admin dashboard pages
├── utils/             # Helper functions
```

## Sample Data

- 20 Agricultural Tools across 5 categories
- 5 Categories with images
- 20 Users
- 8 Reviews
- 6 Testimonials
- 6 Blog posts

## Video Tutorials

Place video files in `public/videos/`:
- `english.mp4`
- `telugu.mp4`
- `hindi.mp4`

## License

MIT
