# Standalone Scroll-Driven Canvas Animation Package

This package contains the fully optimized, progressive lazy-loading **Scroll-Driven Canvas Image Sequence** hero component and all its 178 uncompressed high-fidelity JPEG frames. It is designed to be easily integrated into any Next.js or React website.

---

## 📁 Package Directory Structure

```
scroll-animation-package/
├── ScrollAnimationHero.tsx  <-- Reusable Next.js/React Client Component
├── README.md                <-- Setup & Integration Guide (this file)
└── frames/                  <-- 178 uncompressed high-fidelity JPEGs
    ├── ezgif-frame-001.jpg
    ├── ezgif-frame-002.jpg
    └── ... (up to 178)
```

---

## 🚀 4-Step Quick Integration Guide

### Step 1: Install Dependencies
Install the required packages in your target web application:
```bash
npm install gsap lucide-react
```

### Step 2: Copy Assets (Frames)
Move the entire `frames` folder into the `public` directory of your Next.js or React project so that the browser can serve them under `/frames/` pathing:
```
your-project-root/
└── public/
    └── frames/
        ├── ezgif-frame-001.jpg
        ├── ezgif-frame-002.jpg
        └── ...
```

### Step 3: Copy the React Component
Copy `ScrollAnimationHero.tsx` into your components folder (e.g. `src/components/ScrollAnimationHero.tsx`).

### Step 4: Include Below Your Navigation Bar
Import and render the component inside any page layout file:

```tsx
import Navigation from "@/components/Navigation";
import ScrollAnimationHero from "@/components/ScrollAnimationHero";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      {/* 1. Header Navigation */}
      <Navigation />
      
      {/* 2. Fullscreen Scroll-driven canvas animation plays here */}
      <ScrollAnimationHero />
      
      {/* 3. Rest of your web content */}
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <h2 className="text-3xl text-white font-light">Next Content Section</h2>
      </div>
    </main>
  );
}
```

---

## 🎨 Global CSS Variables & Styling
The canvas utilizes standard dark luxury variables and smooth scaling bounds. If you want the exact *Noir & Cream* premium vibe, add these variables to your global CSS (e.g. `globals.css` or `styles.css`):

```css
:root {
  --obsidian: #0A0A0A;
  --aged-cream: #F5ECD7;
  --amber-gold: #C8A96E;
  --condensation-white: rgba(255, 255, 255, 0.06);
}

/* Cinematic dark radial shading over the canvas */
.cinematic-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, transparent 20%, rgba(0, 0, 0, 0.4) 60%, rgba(0, 0, 0, 0.95) 100%);
  pointer-events: none;
  z-index: 1;
}
```

---

## ⚡ Under the Hood Performance Tuning
* **Progressive Loading**: The component loads Frame 1 instantly on startup to guarantee 0 layout shift. The remaining 177 frames are queued and loaded in the background using `requestIdleCallback` batches, ensuring that critical page loading metrics are unaffected.
* **Sub-Pixel Lerp Math**: Maps ScrollTrigger progression dynamically inside a `requestAnimationFrame` loop using Linear Interpolation (LERP) easing (`0.12`). This smooths out mouse scroll wheel ticks and trackpad notches into a liquid, video-like flow.
* **Aspect ratio scaling**: Programmatically calculates the display size using a `fitFactor` of `0.9`, ensuring that the frames stay 100% sharp and crisp on large and ultra-wide displays without pixel scaling blur.
