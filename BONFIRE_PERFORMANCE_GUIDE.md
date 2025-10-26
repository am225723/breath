# Bonfire Animation System - Performance Optimization Guide

## Table of Contents
1. [Performance Overview](#performance-overview)
2. [Optimization Techniques](#optimization-techniques)
3. [Device-Specific Recommendations](#device-specific-recommendations)
4. [Profiling and Monitoring](#profiling-and-monitoring)
5. [Common Performance Issues](#common-performance-issues)
6. [Advanced Optimizations](#advanced-optimizations)

## Performance Overview

### Target Performance Metrics

| Device Type | Target FPS | Recommended Level | Max Particles |
|-------------|-----------|-------------------|---------------|
| Desktop (High-end) | 60 FPS | first-flame | 30/frame |
| Desktop (Mid-range) | 60 FPS | roaring | 23/frame |
| Mobile (High-end) | 60 FPS | steady-flame | 18/frame |
| Mobile (Mid-range) | 30-60 FPS | smoldering | 15/frame |
| Mobile (Low-end) | 30 FPS | smoldering | 10/frame |

### Performance Characteristics

**RealisticFlame Component:**
- Canvas-based rendering (hardware accelerated)
- Particle system with dynamic spawning/despawning
- Multi-layer gradient rendering per particle
- Real-time turbulence calculations
- Breathing synchronization with smooth transitions

**StarryBackground Component:**
- Static star positions (no movement)
- Simple twinkle animation using sine waves
- Single gradient background
- Minimal computational overhead

## Optimization Techniques

### 1. Particle Count Management

#### Dynamic Particle Reduction

```typescript
import React, { useState, useEffect } from 'react';
import { RealisticFlame } from './components/RealisticFlame';
import type { BonfireLevel } from './types';

function AdaptiveFlame() {
  const [level, setLevel] = useState<BonfireLevel>('steady-flame');
  const [fps, setFps] = useState(60);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = currentTime;

        // Automatically reduce quality if FPS drops
        if (fps < 30 && level !== 'smoldering') {
          const levels: BonfireLevel[] = ['smoldering', 'steady-flame', 'roaring', 'first-flame'];
          const currentIndex = levels.indexOf(level);
          if (currentIndex > 0) {
            setLevel(levels[currentIndex - 1]);
          }
        }
      }

      requestAnimationFrame(measureFPS);
    };

    const rafId = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(rafId);
  }, [level, fps]);

  return (
    <div>
      <RealisticFlame level={level} />
      <div className="text-white">FPS: {fps}</div>
    </div>
  );
}
```

#### Manual Particle Control

```typescript
// Create a custom version with reduced particle count
interface OptimizedFlameProps {
  level: BonfireLevel;
  particleMultiplier?: number; // 0.5 = half particles, 1.0 = normal
}

function OptimizedFlame({ level, particleMultiplier = 1.0 }: OptimizedFlameProps) {
  // Modify particle density based on multiplier
  // Implementation would adjust particleDensity in the animation loop
  return <RealisticFlame level={level} />;
}
```

### 2. Canvas Optimization

#### Proper Canvas Context Configuration

```typescript
// In RealisticFlame component
const ctx = canvas.getContext('2d', {
  alpha: true,              // Enable transparency
  desynchronized: true,     // Reduce latency
  willReadFrequently: false // Optimize for write operations
});
```

#### Canvas Size Optimization

```typescript
function ResponsiveFlame() {
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 500 });

  useEffect(() => {
    const updateSize = () => {
      // Reduce canvas size on mobile
      if (window.innerWidth < 768) {
        setCanvasSize({ width: 300, height: 375 });
      } else {
        setCanvasSize({ width: 400, height: 500 });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return <RealisticFlame level="steady-flame" />;
}
```

### 3. React Component Optimization

#### Memoization

```typescript
import React, { memo, useMemo } from 'react';
import { RealisticFlame } from './components/RealisticFlame';

// Memoize the component to prevent unnecessary re-renders
const MemoizedFlame = memo(RealisticFlame, (prevProps, nextProps) => {
  return (
    prevProps.level === nextProps.level &&
    prevProps.covenant === nextProps.covenant &&
    prevProps.isBreathing === nextProps.isBreathing &&
    prevProps.breathPhase === nextProps.breathPhase
  );
});

function OptimizedApp() {
  const flameProps = useMemo(() => ({
    level: 'steady-flame' as const,
    covenant: 'respite' as const
  }), []);

  return <MemoizedFlame {...flameProps} />;
}
```

#### Lazy Loading

```typescript
import React, { lazy, Suspense } from 'react';

const RealisticFlame = lazy(() => 
  import('./components/RealisticFlame').then(m => ({ default: m.RealisticFlame }))
);

function LazyFlameApp() {
  return (
    <Suspense fallback={<div className="w-96 h-96 bg-gray-900 animate-pulse" />}>
      <RealisticFlame level="steady-flame" />
    </Suspense>
  );
}
```

### 4. Rendering Optimization

#### Reduce Gradient Complexity

```typescript
// Instead of creating gradients for every particle every frame,
// consider caching gradient patterns or reducing gradient stops

// Example: Simplified gradient with fewer stops
const simpleGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
simpleGradient.addColorStop(0, color1);
simpleGradient.addColorStop(1, color2);
// Instead of 3-4 stops, use only 2
```

#### Batch Operations

```typescript
// Group similar rendering operations together
// Draw all atmospheric glows first, then all cores, etc.
// This reduces context switching

// Example structure:
// 1. Draw all atmospheric layers
// 2. Draw all outer glows
// 3. Draw all cores
// 4. Draw all hot cores
```

### 5. Memory Management

#### Particle Pooling

```typescript
class ParticlePool {
  private pool: FlameParticle[] = [];
  private active: FlameParticle[] = [];

  acquire(): FlameParticle {
    return this.pool.pop() || this.createParticle();
  }

  release(particle: FlameParticle): void {
    this.pool.push(particle);
  }

  private createParticle(): FlameParticle {
    return {
      x: 0, y: 0, vx: 0, vy: 0,
      life: 0, maxLife: 0, size: 0,
      heat: 0, turbulence: 0,
      angle: 0, angleVelocity: 0
    };
  }
}

// Usage in component
const poolRef = useRef(new ParticlePool());
```

#### Limit Array Growth

```typescript
// Instead of letting arrays grow indefinitely
flameParticlesRef.current = flameParticlesRef.current.filter(/* ... */);

// Add a hard limit
const MAX_PARTICLES = 500;
if (flameParticlesRef.current.length > MAX_PARTICLES) {
  flameParticlesRef.current = flameParticlesRef.current.slice(-MAX_PARTICLES);
}
```

## Device-Specific Recommendations

### Desktop Optimization

```typescript
function DesktopFlame() {
  const isDesktop = window.innerWidth >= 1024;

  return (
    <RealisticFlame
      level={isDesktop ? 'first-flame' : 'steady-flame'}
      isBreathing={true}
      breathPhase="inhale"
    />
  );
}
```

### Mobile Optimization

```typescript
function MobileOptimizedFlame() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth < 768
      );
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <RealisticFlame
      level={isMobile ? 'smoldering' : 'steady-flame'}
      isBreathing={!isMobile} // Disable breathing on mobile for better performance
    />
  );
}
```

### Low-End Device Detection

```typescript
function AdaptiveQualityFlame() {
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');

  useEffect(() => {
    // Detect device capabilities
    const cores = navigator.hardwareConcurrency || 2;
    const memory = (navigator as any).deviceMemory || 4;

    if (cores <= 2 || memory <= 2) {
      setQuality('low');
    } else if (cores <= 4 || memory <= 4) {
      setQuality('medium');
    } else {
      setQuality('high');
    }
  }, []);

  const levelMap = {
    high: 'first-flame' as const,
    medium: 'steady-flame' as const,
    low: 'smoldering' as const
  };

  return <RealisticFlame level={levelMap[quality]} />;
}
```

## Profiling and Monitoring

### FPS Counter Component

```typescript
function FPSCounter() {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const measure = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measure);
    };

    const rafId = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-black/50 text-white px-4 py-2 rounded">
      FPS: {fps}
    </div>
  );
}
```

### Performance Monitoring Hook

```typescript
function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    fps: 0,
    frameTime: 0,
    memoryUsage: 0
  });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let frameTimes: number[] = [];

    const monitor = () => {
      const currentTime = performance.now();
      const frameTime = currentTime - lastTime;
      frameTimes.push(frameTime);
      frameCount++;

      if (currentTime >= lastTime + 1000) {
        const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
        
        setMetrics({
          fps: frameCount,
          frameTime: avgFrameTime,
          memoryUsage: (performance as any).memory?.usedJSHeapSize || 0
        });

        frameCount = 0;
        frameTimes = [];
        lastTime = currentTime;
      }

      requestAnimationFrame(monitor);
    };

    const rafId = requestAnimationFrame(monitor);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return metrics;
}
```

### React DevTools Profiler

```typescript
import { Profiler } from 'react';

function ProfiledFlame() {
  const onRenderCallback = (
    id: string,
    phase: 'mount' | 'update',
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number
  ) => {
    console.log(`${id} ${phase} took ${actualDuration}ms`);
  };

  return (
    <Profiler id="RealisticFlame" onRender={onRenderCallback}>
      <RealisticFlame level="steady-flame" />
    </Profiler>
  );
}
```

## Common Performance Issues

### Issue 1: Low FPS on Mobile

**Symptoms:**
- Frame rate drops below 30 FPS
- Choppy animation
- Device heating up

**Solutions:**
```typescript
// 1. Reduce bonfire level
<RealisticFlame level="smoldering" />

// 2. Disable breathing synchronization
<RealisticFlame level="steady-flame" isBreathing={false} />

// 3. Reduce canvas size
// Modify canvas dimensions in component to 300x375 instead of 400x500
```

### Issue 2: Memory Leaks

**Symptoms:**
- Memory usage increases over time
- Browser becomes sluggish
- Eventually crashes

**Solutions:**
```typescript
// Ensure proper cleanup in useEffect
useEffect(() => {
  // ... animation code ...

  return () => {
    // Cancel animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    // Clear particle arrays
    flameParticlesRef.current = [];
    embersRef.current = [];
  };
}, [dependencies]);
```

### Issue 3: Janky Animations

**Symptoms:**
- Inconsistent frame timing
- Stuttering during transitions
- Delayed response to prop changes

**Solutions:**
```typescript
// Use requestAnimationFrame consistently
const animate = () => {
  // Animation logic
  animationFrameRef.current = requestAnimationFrame(animate);
};

// Smooth transitions with lerp
breathScale += (breathTarget - breathScale) * 0.03;

// Avoid blocking operations in animation loop
// Move heavy calculations outside the loop or use Web Workers
```

### Issue 4: High CPU Usage

**Symptoms:**
- CPU usage above 50%
- Fan noise on laptops
- Battery drain on mobile

**Solutions:**
```typescript
// 1. Reduce particle count
const particleDensity = isMobile ? 10 : 15;

// 2. Simplify gradient calculations
// Use fewer gradient stops

// 3. Reduce update frequency
let frameSkip = 0;
const animate = () => {
  frameSkip++;
  if (frameSkip % 2 === 0) {
    // Update every other frame on low-end devices
    updateParticles();
  }
  render();
  requestAnimationFrame(animate);
};
```

## Advanced Optimizations

### 1. OffscreenCanvas (Experimental)

```typescript
// Use OffscreenCanvas for better performance
// Note: Browser support is limited
function OffscreenFlame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if ('OffscreenCanvas' in window) {
      const offscreen = canvas.transferControlToOffscreen();
      const worker = new Worker('flame-worker.js');
      worker.postMessage({ canvas: offscreen }, [offscreen]);
    } else {
      // Fallback to regular canvas
    }
  }, []);

  return <canvas ref={canvasRef} />;
}
```

### 2. WebGL Rendering (Future Enhancement)

```typescript
// For even better performance, consider WebGL
// This would require a complete rewrite but could handle
// 10x more particles at 60fps

// Example structure:
class WebGLFlameRenderer {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  
  constructor(canvas: HTMLCanvasElement) {
    this.gl = canvas.getContext('webgl')!;
    this.program = this.createShaderProgram();
  }
  
  render(particles: FlameParticle[]) {
    // Use vertex buffers and shaders for rendering
  }
}
```

### 3. Intersection Observer for Visibility

```typescript
function VisibilityOptimizedFlame() {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      {isVisible && <RealisticFlame level="steady-flame" />}
    </div>
  );
}
```

### 4. Reduced Motion Support

```typescript
function AccessibleFlame() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  if (prefersReducedMotion) {
    // Show static image or simplified animation
    return (
      <div className="w-96 h-96 flex items-center justify-center">
        <div className="text-9xl">🔥</div>
      </div>
    );
  }

  return <RealisticFlame level="steady-flame" />;
}
```

## Performance Checklist

Before deploying your bonfire animation:

- [ ] Test on target devices (desktop, mobile, tablet)
- [ ] Measure FPS under various conditions
- [ ] Check memory usage over time
- [ ] Verify CPU usage is reasonable
- [ ] Test with different bonfire levels
- [ ] Ensure smooth transitions between breath phases
- [ ] Verify cleanup on component unmount
- [ ] Test with multiple instances (if applicable)
- [ ] Check battery impact on mobile devices
- [ ] Verify accessibility features work correctly
- [ ] Test with reduced motion preferences
- [ ] Ensure responsive behavior on window resize
- [ ] Check performance with other animations running
- [ ] Verify no memory leaks after extended use
- [ ] Test on low-end devices

## Recommended Settings by Use Case

### Meditation App (Long Sessions)
```typescript
<RealisticFlame
  level="steady-flame"
  isBreathing={true}
  breathPhase={currentPhase}
/>
// Balanced performance for extended use
```

### Showcase/Demo (Short Duration)
```typescript
<RealisticFlame
  level="first-flame"
  isBreathing={true}
  breathPhase={currentPhase}
/>
// Maximum visual quality
```

### Background Ambiance
```typescript
<RealisticFlame
  level="smoldering"
  isBreathing={false}
/>
// Minimal resource usage
```

### Mobile App
```typescript
<RealisticFlame
  level="smoldering"
  isBreathing={false}
/>
// Optimized for battery life
```

---

For more information, refer to the main documentation in `BONFIRE_SYSTEM_DOCUMENTATION.md`.