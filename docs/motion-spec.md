# Motion & Animation Spec

## Philosophy
Everything moves like cream through coffee — slow, inevitable, beautiful.

## Key Behaviors

### 1. Parallax Scrolling
- Background elements: Move at 0.3x speed.
- Foreground glass elements: Move at 0.7x speed.
- Hero particles/cream swirl: Move at 1.1x speed.

### 2. General Transitions
- Duration: 300–600ms
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)` (ease-in-out)

### 3. Microinteractions
- **Button Hover**: Gold shimmer sweep left-to-right over 400ms.
- **Card Hover**: Subtle 4px lift with cream glow border.
- **Nav Link Hover**: Underline draws from center outward.
- **CTA Click**: Ripple effect in amber-gold.

### 4. Entrance Animations
- Fade-up with 60px offset.
- Staggered 80ms per element.
- Triggered by IntersectionObserver (via GSAP ScrollTrigger).

## Accessibility
- All animations respect `prefers-reduced-motion` to immediately display the final state or use simple crossfades.
