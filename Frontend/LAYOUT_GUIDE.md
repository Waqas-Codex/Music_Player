# Chuchify - Premium Music Streaming Web App Layout

A modern, premium dark UI music streaming application inspired by Spotify with custom design enhancements. Built with React, Next.js, Tailwind CSS, and Framer Motion.

## 🎨 Design Features

### Color Theme
- **Primary Background**: `#0b0b0b` - Deep black
- **Secondary Background**: `#141414` - Charcoal
- **Tertiary Background**: `#1b1b1b` - Card backgrounds
- **Accent Red**: `#ff2b2b` - Primary interactive elements
- **Accent Red Dark**: `#d92626` - Hover states
- **Accent Red Light**: `#ff4d4d` - Highlights

### Visual Elements
- ✨ Glassmorphism effects with backdrop blur
- 🔴 Red neon glow effects
- 🎭 Smooth animations with Framer Motion
- 📱 Fully responsive design (mobile-first)
- ♿ Accessible UI components
- 🎯 Rounded corners and soft shadows

## 🏗️ Project Structure

```
Frontend/
├── components/
│   ├── layout/
│   │   ├── MainLayout.tsx      # Main layout wrapper
│   │   ├── Sidebar.tsx         # Fixed left sidebar
│   │   ├── Header.tsx          # Sticky top header
│   │   └── index.ts            # Layout exports
│   ├── sections/
│   │   ├── HeroSection.tsx      # Hero banner with album feature
│   │   ├── FeaturedSection.tsx  # Featured songs grid
│   │   ├── TrendingSection.tsx  # Trending songs list
│   │   ├── CategorySection.tsx  # Music categories
│   │   ├── SongCard.tsx         # Individual song card
│   │   └── index.ts             # Section exports
│   ├── ui/
│   │   ├── Button.tsx           # Reusable button component
│   │   ├── Input.tsx            # Reusable input component
│   │   └── index.ts             # UI exports
│   └── index.ts                 # Main components export
├── app/
│   ├── layout.tsx               # Root layout with MainLayout
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Global styles & theme
│   ├── login/
│   ├── register/
│   ├── songs/
│   ├── playlists/
│   └── upload/
├── lib/
│   └── axios.ts                 # HTTP client
├── services/
│   ├── auth.service.ts
│   ├── playlist.service.ts
│   └── song.service.ts
├── types/
│   └── index.ts
├── public/
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts           # Tailwind configuration
└── postcss.config.mjs
```

## 📦 Components Overview

### Layout Components

#### **Sidebar**
- Fixed left navigation panel (256px width on desktop)
- Collapsible on mobile with overlay
- Features:
  - Logo with brand name
  - Main navigation (Home, Search, Liked Songs)
  - Playlists library with create new option
  - Settings and logout
  - Active state indicators with red glow
  - Smooth hover transitions

#### **Header**
- Sticky top navigation bar
- Features:
  - Search bar with suggestions dropdown
  - Notification bell with pulse animation
  - Settings icon
  - User profile dropdown menu
  - Responsive mobile menu
  - Glassmorphism background

#### **MainLayout**
- Combines Sidebar and Header
- Manages responsive layout
- Provides main content area with proper padding
- Gradient background from black to charcoal

### Section Components

#### **HeroSection**
- Full-height hero banner
- Features:
  - Large album artwork with floating animation
  - Featured album information
  - Call-to-action buttons (Play, Add to Favorites)
  - Artist information with avatar
  - Animated background gradients
  - Scroll indicator
  - Floating stats badge

#### **CategorySection**
- 6-column grid of music categories
- Features:
  - Category cards with gradient backgrounds
  - Icons for each category
  - Hover animations and scale effects
  - Interactive navigation

#### **TrendingSection**
- Trending songs ranked list
- Features:
  - Numbered ranking display
  - Song image, title, and artist
  - Trend indicators (up/down/stable)
  - Play button on hover
  - Hover animations

#### **FeaturedSection**
- Grid layout of featured songs
- Features:
  - Play and like button overlays on hover
  - Song play count badges
  - Responsive grid (6 columns on XL, down to 1 on mobile)
  - Image hover effects
  - Smooth animations

#### **SongCard**
- Individual song card component
- Features:
  - Album artwork with hover overlay
  - Play/Pause button
  - Like/Heart button
  - More options menu
  - Play count badge
  - Song title and artist name
  - Responsive sizing

## 🎬 Animation Features

- **Framer Motion** for smooth, performant animations
- Entry animations for all sections
- Hover state animations on interactive elements
- Staggered animations for list items
- Floating animations for decorative elements
- Smooth transitions between states
- Spring-based animations for natural movement

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
  - Collapsible sidebar with overlay
  - Expanded mobile search
  - Single column layouts
  - Touch-friendly button sizes

- **Tablet**: 640px - 1024px
  - Sidebar visible
  - 2-3 column grids
  - Adjusted padding

- **Desktop**: > 1024px
  - Full sidebar (256px)
  - Full-featured header
  - Multi-column grids
  - Optimal spacing

## 🛠️ Technologies Used

- **React 19** - UI framework
- **Next.js 16** - React framework with SSR
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Axios** - HTTP client

## 🚀 Getting Started

### Installation

```bash
cd Frontend
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Build

```bash
npm run build
npm start
```

## 🎯 Key Features

✅ **Modern Dark Theme** - Premium black and charcoal aesthetic
✅ **Red Accent System** - Elegant red highlights with glow effects
✅ **Smooth Animations** - Framer Motion for seamless interactions
✅ **Fully Responsive** - Mobile, tablet, and desktop optimized
✅ **Accessible Design** - WCAG compliant with focus states
✅ **Clean Code** - Reusable components and organized structure
✅ **Mobile-First** - Progressive enhancement approach
✅ **Glassmorphism** - Modern blur effects and layered design
✅ **Professional Spacing** - Consistent padding and margins
✅ **Icon-Rich UI** - Lucide React icons throughout

## 🎨 Customization

### Colors
Edit CSS variables in `app/globals.css`:
```css
:root {
  --primary-bg: #0b0b0b;
  --accent-red: #ff2b2b;
  /* ... more variables */
}
```

### Animations
Modify animation configs in Framer Motion component props:
```tsx
animate={{ scale: [1, 1.1, 1] }}
transition={{ duration: 3, repeat: Infinity }}
```

### Spacing
Adjust paddings and margins using Tailwind classes:
```tsx
className="px-6 md:px-10 py-12"  // Responsive padding
```

## 📝 Best Practices

- Use the `MainLayout` component for all app pages
- Import components from index.ts files for cleaner imports
- Maintain consistent spacing using the padding utility classes
- Use motion.div for animated elements
- Keep components focused and single-responsibility
- Use TypeScript interfaces for all props

## 🔗 Component Usage Example

```tsx
import { HeroSection, FeaturedSection, TrendingSection, CategorySection } from '@/components/sections';
import { MainLayout } from '@/components/layout';

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <CategorySection />
      <TrendingSection />
      <FeaturedSection />
    </MainLayout>
  );
}
```

## 📚 Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Guide](https://www.framer.com/motion/)
- [Lucide React Icons](https://lucide.dev/)
- [Next.js Documentation](https://nextjs.org/docs)

## 📄 License

This is a custom design for the Chuchify music streaming application.

---

**Built with ❤️ for an amazing music streaming experience**
