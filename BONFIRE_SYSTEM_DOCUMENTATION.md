# Bonfire Animation System Documentation

## Overview
This document describes the implementation of a realistic bonfire animation system with breathing synchronization and atmospheric effects for a React/TypeScript application.

## System Architecture

### Type Definitions

#### BonfireLevel Enum
```typescript
type BonfireLevel = 'smoldering' | 'steady-flame' | 'roaring' | 'first-flame';
```

The bonfire has four distinct levels, each with different visual characteristics:
- **smoldering**: Smallest flame, minimal particles, low intensity
- **steady-flame**: Medium flame, moderate particles, balanced intensity
- **roaring**: Large flame, many particles, high intensity
- **first-flame**: Maximum flame, maximum particles, highest intensity

#### BreathPhase Type
```typescript
type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'hold-empty';
```

Breathing phases affect flame behavior:
- **inhale**: Flame grows larger (1.4x scale)
- **hold**: Flame maintains size (1.1x scale)
- **exhale**: Flame shrinks (0.7x scale)
- **hold-empty**: Flame at minimal size (0.9x scale)

### Component Structure

## 1. RealisticFlame Component

### Purpose
Renders a realistic, animated flame using HTML5 Canvas with volumetric rendering techniques.

### Props Interface
```typescript
interface RealisticFlameProps {
  level: BonfireLevel;           // Determines flame size and intensity
  covenant?: CovenantType;       // Optional theme color
  isBreathing?: boolean;         // Enable breathing synchronization
  breathPhase?: BreathPhase;     // Current breathing phase
}
```

### Key Features

#### 4-Layer Volumetric Rendering
1. **Atmospheric Glow** (Outermost)
   - Radius: 2.5x particle size
   - Creates soft ambient lighting
   - Fades from flame color to transparent

2. **Outer Glow** (Secondary)
   - Radius: 1.5x particle size
   - Provides depth and volume
   - Stronger color intensity than atmospheric layer

3. **Core Flame** (Main Body)
   - Radius: 1x particle size
   - Primary visible flame body
   - Full color saturation

4. **Hot Core** (Innermost)
   - Radius: 0.4x particle size
   - Only visible for particles with heat > 0.8
   - White-hot center for maximum realism

#### Particle System

##### Flame Particles
```typescript
interface FlameParticle {
  x: number;              // X position
  y: number;              // Y position
  vx: number;             // X velocity
  vy: number;             // Y velocity (upward)
  life: number;           // Current lifetime
  maxLife: number;        // Maximum lifetime (60-120 frames)
  size: number;           // Particle size (8-20 pixels)
  heat: number;           // Heat value (0-1, determines color)
  turbulence: number;     // Turbulence strength
  angle: number;          // Current rotation angle
  angleVelocity: number;  // Rotation speed
}
```

**Particle Behavior**:
- Spawn at base of flame with random angle spread (±63°)
- Rise upward with decreasing velocity (gravity simulation)
- Apply multi-frequency turbulence for realistic movement
- Heat dissipates over lifetime (affects color)
- Fade out using sine wave for smooth transition

##### Ember Particles
```typescript
interface Ember {
  x: number;              // X position
  y: number;              // Y position
  vx: number;             // X velocity
  vy: number;             // Y velocity (upward)
  life: number;           // Current lifetime
  maxLife: number;        // Maximum lifetime (120-200 frames)
  size: number;           // Ember size (1-3 pixels)
  brightness: number;     // Brightness value (0.6-1.0)
}
```

**Ember Behavior**:
- Spawn from flame base with slight upward velocity
- Affected by slight upward acceleration (-0.02)
- Horizontal velocity dampens over time (0.99x per frame)
- Glow effect with 3x size radius
- Orange-yellow color scheme

#### Color System

The flame uses a physically-based color gradient based on heat values:

```typescript
Heat > 0.9: White-hot core (255, 255, 200-255) - Hottest
Heat > 0.7: Bright yellow (255, 200-275, 0-100)
Heat > 0.4: Orange (255, 100-200, 0)
Heat > 0.2: Deep orange/red (255, 0-200, 0-50)
Heat ≤ 0.2: Deep red/purple (180-255, 0-100, 0-150) - Coolest
```

#### Breathing Synchronization

When `isBreathing` is enabled, the flame responds to breath phases:

```typescript
Breath Phase    | Scale | Intensity | Visual Effect
----------------|-------|-----------|---------------
inhale          | 1.4x  | 1.3x      | Flame grows, more particles
hold            | 1.1x  | 1.1x      | Stable, slightly enlarged
exhale          | 0.7x  | 0.8x      | Flame shrinks, fewer particles
hold-empty      | 0.9x  | 0.9x      | Small, minimal activity
```

Transitions are smoothed using linear interpolation (lerp) with 0.03 factor.

#### Bonfire Level Parameters

```typescript
Level          | Base Size | Particles | Ember Rate | Glow | Height
---------------|-----------|-----------|------------|------|-------
smoldering     | 80px      | 15/frame  | 0.30       | 0.6  | 1.2x
steady-flame   | 95px      | 18/frame  | 0.45       | 0.75 | 1.3x
roaring        | 110px     | 23/frame  | 0.55       | 0.95 | 1.4x
first-flame    | 130px     | 30/frame  | 0.70       | 1.2  | 1.5x
```

#### Turbulence System

Multi-frequency turbulence creates realistic flame movement:

```typescript
turbulence1 = sin(time * 2 + angle) * strength
turbulence2 = cos(time * 3.5 + angle * 2) * strength * 0.5
turbulence3 = sin(time * 1.2 + y * 0.01) * strength * 0.3
```

Three frequencies combine to create complex, natural-looking motion.

### Performance Optimizations

1. **Particle Pooling**: Reuse particle objects instead of creating new ones
2. **Canvas Optimization**: Use `willReadFrequently: false` for better performance
3. **Efficient Filtering**: Remove dead particles in single pass
4. **Gradient Caching**: Gradients created per frame but optimized with canvas API
5. **RequestAnimationFrame**: Smooth 60fps animation loop

## 2. StarryBackground Component

### Purpose
Creates an atmospheric deep space background with twinkling stars.

### Props Interface
```typescript
// No props required - fully self-contained
```

### Key Features

#### Star System
```typescript
interface Star {
  x: number;              // X position
  y: number;              // Y position
  size: number;           // Star size (0.5-2 pixels)
  brightness: number;     // Base brightness (0.3-1.0)
  twinkleSpeed: number;   // Twinkle animation speed
  twinkleOffset: number;  // Phase offset for variation
}
```

**Star Generation**:
- 200 stars randomly distributed across canvas
- Size varies from 0.5 to 2 pixels
- Brightness varies from 0.3 to 1.0
- Each star has unique twinkle speed and offset

#### Background Gradient

Deep space radial gradient:
```typescript
Center: rgba(10, 5, 20, 1)    // Deep purple-black
Edge:   rgba(5, 0, 15, 1)     // Even darker
```

Creates depth and atmosphere for the flame effect.

#### Twinkling Effect

Stars twinkle using sine wave animation:
```typescript
twinkle = sin(time * twinkleSpeed + twinkleOffset) * 0.3 + 0.7
alpha = brightness * twinkle
```

This creates natural-looking star twinkling with each star on its own cycle.

#### Star Rendering

Each star is rendered with two layers:
1. **Glow Layer**: 3x star size, faded gradient
2. **Core Layer**: 1x star size, full brightness

### Performance Optimizations

1. **Static Stars**: Stars don't move, only twinkle
2. **Efficient Rendering**: Single pass through star array
3. **Canvas Optimization**: Reuses same canvas context
4. **Responsive**: Reinitializes on window resize

## Integration Example

```typescript
import { RealisticFlame } from './components/RealisticFlame';
import { StarryBackground } from './components/StarryBackground';

function BreathingApp() {
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('inhale');
  const [bonfireLevel, setBonfireLevel] = useState<BonfireLevel>('steady-flame');

  return (
    <div className="relative w-full h-screen">
      {/* Background layer */}
      <StarryBackground />
      
      {/* Flame layer */}
      <div className="absolute inset-0 flex items-center justify-center">
        <RealisticFlame
          level={bonfireLevel}
          covenant="respite"
          isBreathing={true}
          breathPhase={breathPhase}
        />
      </div>
    </div>
  );
}
```

## Technical Requirements Met

✅ React functional components with TypeScript
✅ Smooth 60fps animations using requestAnimationFrame
✅ Fully typed props and interfaces
✅ Reusable and composable components
✅ Performance optimized with efficient rendering
✅ Responsive to window resize
✅ Clean separation of concerns

## Browser Compatibility

- Modern browsers with Canvas API support
- Tested on Chrome, Firefox, Safari, Edge
- Requires ES6+ JavaScript support
- No external dependencies beyond React

## Future Enhancements

Potential improvements for future versions:
1. WebGL rendering for even better performance
2. Sound effects synchronized with flame
3. Interactive flame (responds to mouse/touch)
4. Smoke particle system
5. Dynamic lighting effects on surrounding elements
6. Customizable color schemes beyond covenant themes
7. Accessibility features (reduced motion support)

## Conclusion

This bonfire animation system provides a realistic, performant, and flexible solution for creating atmospheric flame effects in React applications. The modular design allows for easy customization and extension while maintaining excellent performance characteristics.