# Bonfire Animation System - Usage Examples & Best Practices

## Table of Contents
1. [Basic Usage](#basic-usage)
2. [Advanced Integration](#advanced-integration)
3. [Performance Optimization](#performance-optimization)
4. [Customization Examples](#customization-examples)
5. [Troubleshooting](#troubleshooting)

## Basic Usage

### Simple Flame Display

```typescript
import { RealisticFlame } from './components/RealisticFlame';

function SimpleFlameExample() {
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <RealisticFlame level="steady-flame" />
    </div>
  );
}
```

### With Starry Background

```typescript
import { RealisticFlame } from './components/RealisticFlame';
import { StarryBackground } from './components/StarryBackground';

function FlameWithBackgroundExample() {
  return (
    <div className="relative w-full h-screen">
      <StarryBackground />
      <div className="absolute inset-0 flex items-center justify-center">
        <RealisticFlame level="roaring" covenant="focus" />
      </div>
    </div>
  );
}
```

## Advanced Integration

### Breathing Synchronized Flame

```typescript
import React, { useState, useEffect } from 'react';
import { RealisticFlame } from './components/RealisticFlame';
import { StarryBackground } from './components/StarryBackground';
import type { BonfireLevel } from './types';

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'hold-empty';

function BreathingApp() {
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('inhale');
  const [bonfireLevel, setBonfireLevel] = useState<BonfireLevel>('steady-flame');
  const [isBreathing, setIsBreathing] = useState(true);

  // Breathing cycle timing (in milliseconds)
  const breathingCycle = {
    inhale: 4000,
    hold: 7000,
    exhale: 8000,
    'hold-empty': 0
  };

  useEffect(() => {
    if (!isBreathing) return;

    const phases: BreathPhase[] = ['inhale', 'hold', 'exhale'];
    let currentPhaseIndex = 0;

    const advancePhase = () => {
      currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
      setBreathPhase(phases[currentPhaseIndex]);
    };

    const duration = breathingCycle[breathPhase];
    const timer = setTimeout(advancePhase, duration);

    return () => clearTimeout(timer);
  }, [breathPhase, isBreathing]);

  return (
    <div className="relative w-full h-screen">
      <StarryBackground />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <RealisticFlame
          level={bonfireLevel}
          covenant="respite"
          isBreathing={isBreathing}
          breathPhase={breathPhase}
        />
        
        <div className="mt-8 text-white text-center">
          <p className="text-2xl capitalize">{breathPhase}</p>
          <button
            onClick={() => setIsBreathing(!isBreathing)}
            className="mt-4 px-6 py-2 bg-orange-600 rounded-lg hover:bg-orange-700"
          >
            {isBreathing ? 'Pause' : 'Start'} Breathing
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Progressive Bonfire Levels

```typescript
import React, { useState } from 'react';
import { RealisticFlame } from './components/RealisticFlame';
import type { BonfireLevel } from './types';

function ProgressiveBonfireExample() {
  const levels: BonfireLevel[] = ['smoldering', 'steady-flame', 'roaring', 'first-flame'];
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);

  const upgradeFlame = () => {
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1);
    }
  };

  const downgradeFlame = () => {
    if (currentLevelIndex > 0) {
      setCurrentLevelIndex(currentLevelIndex - 1);
    }
  };

  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center">
      <RealisticFlame level={levels[currentLevelIndex]} />
      
      <div className="mt-8 flex gap-4">
        <button
          onClick={downgradeFlame}
          disabled={currentLevelIndex === 0}
          className="px-6 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 disabled:opacity-50"
        >
          Downgrade
        </button>
        <span className="px-6 py-2 text-white capitalize">
          {levels[currentLevelIndex]}
        </span>
        <button
          onClick={upgradeFlame}
          disabled={currentLevelIndex === levels.length - 1}
          className="px-6 py-2 bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-50"
        >
          Upgrade
        </button>
      </div>
    </div>
  );
}
```

### Multiple Flames with Different Covenants

```typescript
import React from 'react';
import { RealisticFlame } from './components/RealisticFlame';
import { StarryBackground } from './components/StarryBackground';
import type { CovenantType } from './types';

function MultipleFlamesExample() {
  const covenants: CovenantType[] = ['respite', 'focus', 'vigor'];

  return (
    <div className="relative w-full h-screen">
      <StarryBackground />
      
      <div className="absolute inset-0 flex items-center justify-around p-8">
        {covenants.map((covenant) => (
          <div key={covenant} className="flex flex-col items-center">
            <RealisticFlame
              level="steady-flame"
              covenant={covenant}
            />
            <p className="mt-4 text-white capitalize">{covenant}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Performance Optimization

### 1. Memoization for Static Props

```typescript
import React, { useMemo } from 'react';
import { RealisticFlame } from './components/RealisticFlame';

function OptimizedFlameExample() {
  // Memoize static flame configuration
  const flameConfig = useMemo(() => ({
    level: 'steady-flame' as const,
    covenant: 'respite' as const
  }), []);

  return <RealisticFlame {...flameConfig} />;
}
```

### 2. Conditional Rendering

```typescript
import React, { useState } from 'react';
import { RealisticFlame } from './components/RealisticFlame';

function ConditionalFlameExample() {
  const [showFlame, setShowFlame] = useState(false);

  return (
    <div className="w-full h-screen bg-black">
      {showFlame && (
        <RealisticFlame level="steady-flame" />
      )}
      <button onClick={() => setShowFlame(!showFlame)}>
        Toggle Flame
      </button>
    </div>
  );
}
```

### 3. Reduced Motion Support

```typescript
import React, { useState, useEffect } from 'react';
import { RealisticFlame } from './components/RealisticFlame';

function AccessibleFlameExample() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  if (prefersReducedMotion) {
    // Show static flame image instead
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-orange-500 text-6xl">🔥</div>
      </div>
    );
  }

  return <RealisticFlame level="steady-flame" />;
}
```

### 4. Lazy Loading

```typescript
import React, { lazy, Suspense } from 'react';

const RealisticFlame = lazy(() => import('./components/RealisticFlame').then(m => ({ default: m.RealisticFlame })));
const StarryBackground = lazy(() => import('./components/StarryBackground').then(m => ({ default: m.StarryBackground })));

function LazyLoadedFlameExample() {
  return (
    <Suspense fallback={<div className="w-full h-screen bg-black" />}>
      <div className="relative w-full h-screen">
        <StarryBackground />
        <div className="absolute inset-0 flex items-center justify-center">
          <RealisticFlame level="steady-flame" />
        </div>
      </div>
    </Suspense>
  );
}
```

## Customization Examples

### Custom Breathing Pattern

```typescript
import React, { useState, useEffect } from 'react';
import { RealisticFlame } from './components/RealisticFlame';

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'hold-empty';

function CustomBreathingPattern() {
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('inhale');

  // Custom 4-7-8 breathing pattern
  const pattern = {
    inhale: 4000,    // 4 seconds
    hold: 7000,      // 7 seconds
    exhale: 8000,    // 8 seconds
    'hold-empty': 0
  };

  useEffect(() => {
    const phases: BreathPhase[] = ['inhale', 'hold', 'exhale'];
    let index = phases.indexOf(breathPhase);

    const timer = setTimeout(() => {
      index = (index + 1) % phases.length;
      setBreathPhase(phases[index]);
    }, pattern[breathPhase]);

    return () => clearTimeout(timer);
  }, [breathPhase]);

  return (
    <RealisticFlame
      level="steady-flame"
      isBreathing={true}
      breathPhase={breathPhase}
    />
  );
}
```

### Interactive Flame (Click to Upgrade)

```typescript
import React, { useState } from 'react';
import { RealisticFlame } from './components/RealisticFlame';
import type { BonfireLevel } from './types';

function InteractiveFlameExample() {
  const levels: BonfireLevel[] = ['smoldering', 'steady-flame', 'roaring', 'first-flame'];
  const [levelIndex, setLevelIndex] = useState(0);
  const [clicks, setClicks] = useState(0);

  const handleClick = () => {
    setClicks(clicks + 1);
    
    // Upgrade every 5 clicks
    if ((clicks + 1) % 5 === 0 && levelIndex < levels.length - 1) {
      setLevelIndex(levelIndex + 1);
    }
  };

  return (
    <div 
      className="w-full h-screen bg-black flex flex-col items-center justify-center cursor-pointer"
      onClick={handleClick}
    >
      <RealisticFlame level={levels[levelIndex]} />
      <p className="mt-8 text-white">
        Clicks: {clicks} | Level: {levels[levelIndex]}
      </p>
      <p className="text-gray-400 text-sm">
        Click to feed the flame (5 clicks per level)
      </p>
    </div>
  );
}
```

### Flame with Audio Sync

```typescript
import React, { useState, useEffect, useRef } from 'react';
import { RealisticFlame } from './components/RealisticFlame';
import type { BonfireLevel } from './types';

function AudioSyncFlameExample() {
  const [level, setLevel] = useState<BonfireLevel>('steady-flame');
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    // Initialize Web Audio API
    audioContextRef.current = new AudioContext();
    analyserRef.current = audioContextRef.current.createAnalyser();

    // Get microphone input
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const source = audioContextRef.current!.createMediaStreamSource(stream);
        source.connect(analyserRef.current!);
      });

    // Analyze audio and adjust flame
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateFlame = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;

      // Map audio level to bonfire level
      if (average > 150) setLevel('first-flame');
      else if (average > 100) setLevel('roaring');
      else if (average > 50) setLevel('steady-flame');
      else setLevel('smoldering');

      requestAnimationFrame(updateFlame);
    };

    updateFlame();

    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center">
      <RealisticFlame level={level} />
      <p className="mt-8 text-white">Speak or make noise to grow the flame!</p>
    </div>
  );
}
```

## Troubleshooting

### Issue: Flame appears choppy or laggy

**Solution**: Reduce particle density or use a lower bonfire level
```typescript
// Instead of 'first-flame', use 'steady-flame' for better performance
<RealisticFlame level="steady-flame" />
```

### Issue: Canvas not resizing properly

**Solution**: Ensure parent container has defined dimensions
```typescript
<div className="w-full h-screen"> {/* Explicit dimensions */}
  <RealisticFlame level="steady-flame" />
</div>
```

### Issue: Memory leak warnings

**Solution**: Ensure components are properly unmounted
```typescript
// The components handle cleanup automatically, but ensure
// you're not creating multiple instances unnecessarily
```

### Issue: Flame not visible on mobile

**Solution**: Check canvas size and ensure it's not too large
```typescript
// The canvas is set to 400x500 by default
// For mobile, you might want to scale it down
<div className="scale-75 md:scale-100">
  <RealisticFlame level="steady-flame" />
</div>
```

### Issue: TypeScript errors with BonfireLevel

**Solution**: Ensure you're importing the type correctly
```typescript
import type { BonfireLevel } from './types';

// Use the type, not a string
const level: BonfireLevel = 'steady-flame'; // ✓ Correct
const level = 'steady-flame'; // ✗ May cause type errors
```

## Best Practices Summary

1. **Use memoization** for static props to prevent unnecessary re-renders
2. **Implement lazy loading** for better initial page load performance
3. **Support reduced motion** preferences for accessibility
4. **Provide fallbacks** for browsers that don't support Canvas API
5. **Monitor performance** using React DevTools Profiler
6. **Test on mobile devices** to ensure smooth performance
7. **Use appropriate bonfire levels** based on device capabilities
8. **Clean up resources** properly when components unmount
9. **Provide visual feedback** for interactive elements
10. **Document custom implementations** for team collaboration

## Performance Metrics

Expected performance on modern devices:
- **Desktop**: 60fps with 'first-flame' level
- **Mobile**: 60fps with 'steady-flame' level
- **Low-end devices**: 30-60fps with 'smoldering' level

Monitor using:
```typescript
// Add FPS counter for debugging
let lastTime = performance.now();
let frames = 0;

const measureFPS = () => {
  frames++;
  const currentTime = performance.now();
  
  if (currentTime >= lastTime + 1000) {
    console.log(`FPS: ${frames}`);
    frames = 0;
    lastTime = currentTime;
  }
  
  requestAnimationFrame(measureFPS);
};

measureFPS();
```

---

For more information, refer to the main documentation in `BONFIRE_SYSTEM_DOCUMENTATION.md`.