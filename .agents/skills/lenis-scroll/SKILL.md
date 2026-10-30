---
name: lenis-scroll
description: Comprehensive guide for integrating Lenis smooth scrolling (darkroomengineering/lenis) into modern web apps, React, Next.js, and synchronizing with GSAP ScrollTrigger.
---

# Lenis Smooth Scroll Skill

Lenis is a lightweight, robust smooth scrolling library built by Darkroom Engineering. It standardizes scroll physics across all devices and platforms without breaking native browser accessibility.

## 1. Installation

```bash
npm install lenis
# or for React wrapper:
npm install lenis @studio-freight/react-lenis
```

## 2. Vanilla JS / Core Initialization

```javascript
import Lenis from 'lenis';

// Initialize Lenis with optimal defaults
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential ease-out
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
  infinite: false,
});

// Use requestAnimationFrame to continuously update scroll physics
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
```

## 3. Synchronizing with GSAP ScrollTrigger (Crucial!)

When using Lenis alongside GSAP ScrollTrigger, connect Lenis's scroll event to `ScrollTrigger.update()` so scroll positions stay in sync:

```javascript
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis();

// Update ScrollTrigger on every Lenis scroll tick
lenis.on('scroll', ScrollTrigger.update);

// Synchronize GSAP ticker with Lenis raf
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

// Disable GSAP ticker lag smoothing for seamless responsiveness
gsap.ticker.lagSmoothing(0);
```

## 4. Next.js App Router (Client Component Provider)

Create a client-side provider `SmoothScrollProvider.tsx`:

```tsx
'use client';

import { ReactNode, useEffect } from 'react';
import Lenis from 'lenis';

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

Wrap your root layout with `<SmoothScrollProvider>`.

## 5. Controlling Scroll Programmatically

```javascript
// Scroll to element or offset
lenis.scrollTo('#target-section', {
  offset: -60,
  duration: 1.5,
  immediate: false,
  lock: false,
  onComplete: () => console.log('Scrolled to target'),
});

// Stop / Start scroll (e.g. for modals or mobile drawers)
lenis.stop();
lenis.start();
```

## 6. CSS Requirements

Add standard CSS rules to ensure Lenis doesn't encounter conflicting native overflow:

```css
html.lenis, html.lenis body {
  height: auto;
}

.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}

.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}

.lenis.lenis-stopped {
  overflow: hidden;
}

.lenis.lenis-scrolling iframe {
  pointer-events: none;
}
```
