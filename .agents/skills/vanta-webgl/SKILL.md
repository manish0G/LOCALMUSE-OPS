---
name: vanta-webgl
description: Guide for integrating Vanta.js (tengbao/vanta) interactive 3D WebGL background effects (Globe, Waves, Birds, Clouds, Net, Dots, Rings) in React, Next.js, and vanilla web pages.
---

# Vanta.js 3D WebGL Background Effects Skill

Vanta.js provides animated 3D WebGL background effects powered by Three.js (r121+). Used in high-end tech landing pages (such as Nominal AI in the Suraksha project).

## 1. Supported Effects
- **GLOBE**: Interactive rotating wireframe Earth with points and connections.
- **WAVES**: Fluid oscillating geometry waves.
- **NET**: Geometric node graph with cursor repulsion.
- **BIRDS**: 3D flocking boids simulation.
- **CLOUDS**: Volumetric moving cloudscape.
- **DOTS**: Pulsing grid point array.
- **RINGS**: Concentric oscillating geometric rings.

## 2. Installation / CDN Loading

```bash
npm install three vanta
```

Or via CDN script tags (compatible with React `useEffect` or vanilla HTML):

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js"></script>
```

## 3. Vanta Globe Configuration (Exact Suraksha Project Preset)

```javascript
import * as THREE from 'three';
import GLOBE from 'vanta/dist/vanta.globe.min';

const vantaEffect = GLOBE({
  el: '#vanta-globe-container',
  THREE: THREE,
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200.0,
  minWidth: 200.0,
  scale: 1.0,
  scaleMobile: 1.0,
  color: 0x6366f1,          // Indigo primary accent
  color2: 0xa855f7,         // Purple secondary accent
  size: 1.2,
  backgroundColor: 0x09090b // Dark zinc background
});

// Always destroy on unmount to prevent WebGL context memory leaks!
vantaEffect.destroy();
```

## 4. React / Next.js Client Component Implementation

In Next.js App Router, render as dynamic client component to avoid SSR window errors:

```tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';

export function VantaGlobeBackground({ children }: { children?: React.ReactNode }) {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  useEffect(() => {
    let effect: any = null;

    const loadVanta = async () => {
      const THREE = await import('three');
      // @ts-ignore
      const GLOBE = (await import('vanta/dist/vanta.globe.min')).default;

      if (!effect && vantaRef.current) {
        effect = GLOBE({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          scale: 1.0,
          scaleMobile: 0.8,
          color: 0x4f46e5,
          color2: 0x818cf8,
          backgroundColor: 0x09090b,
          size: 1.1
        });
        setVantaEffect(effect);
      }
    };

    loadVanta();

    return () => {
      if (effect) effect.destroy();
    };
  }, []);

  return (
    <div ref={vantaRef} className="relative w-full h-full min-h-screen overflow-hidden">
      <div className="relative z-10">{children}</div>
    </div>
  );
}
```

## 5. Performance Best Practices
1. Set `scaleMobile: 0.7` to prevent GPU throttling on mobile devices.
2. Ensure container is `position: relative` or `position: absolute` with a defined height.
3. Always invoke `vantaEffect.destroy()` in component cleanup to prevent WebGL `CONTEXT_LOST` errors.
