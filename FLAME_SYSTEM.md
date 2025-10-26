# Realistic 3D Flame Animation System

## Overview

The Path of Embers now features a highly realistic, volumetric flame animation system that responds dynamically to breathing patterns. This system replaces the previous simple particle effect with a sophisticated multi-layered rendering approach.

## Visual Features

### 1. Volumetric Flame Rendering

The flame uses a multi-layered particle system to create depth and volume:

- **Atmospheric Layer**: Far outer glow that creates heat haze effect
- **Outer Glow Layer**: Soft diffuse light spreading from the flame
- **Core Layer**: Main flame body with rich color gradients
- **Hot Core**: Intense white-hot center for high-temperature particles

### 2. Realistic Color Palette

The flame uses physically-based color transitions:

- **White-Hot Core** (>90% heat): `rgba(255, 255, 200-255, alpha)` - Extreme heat
- **Bright Yellow** (70-90% heat): Intense yellow-white transition
- **Orange** (40-70% heat): Classic flame orange
- **Deep Orange to Red** (20-40% heat): Cooling flame edges
- **Deep Red with Purple** (<20% heat): Smoky, carbonized areas

### 3. Dynamic Turbulence

Multi-frequency turbulence simulation:

- **Primary Turbulence**: Main swirling motion (2 Hz)
- **Secondary Turbulence**: Smaller eddies (3.5 Hz)
- **Tertiary Turbulence**: Vertical flow variations (1.2 Hz)

### 4. Breathing Synchronization

The flame responds to breathing phases:

#### Inhale Phase
- Scale: 1.4x (40% larger)
- Intensity: 1.3x (30% brighter)
- Particle spawn rate: Increased
- Upward velocity: Enhanced

#### Hold Phase
- Scale: 1.1x (10% larger)
- Intensity: 1.1x (10% brighter)
- Stable, pulsing motion

#### Exhale Phase
- Scale: 0.7x (30% smaller)
- Intensity: 0.8x (20% dimmer)
- Particle spawn rate: Decreased
- Slower motion

#### Hold-Empty Phase
- Scale: 0.9x (10% smaller)
- Intensity: 0.9x (10% dimmer)
- Minimal motion

### 5. Ember System

Rising embers emerge from the flame top:

- **Origin**: Upper surface of main flame
- **Movement**: Rising upward with slight curve
- **Fading**: Gradual size and brightness reduction
- **Color**: Yellow-orange fading to deep orange-red
- **Glow**: Soft emissive halo around each ember

### 6. Bonfire Level Progression

The flame evolves with user progress:

#### Smoldering (Days 1-3)
- Base size: 80px
- Particle density: 15/frame
- Ember rate: 0.3
- Glow intensity: 0.6
- Flame height: 1.2x

#### Steady Flame (Days 4-7)
- Base size: 95px
- Particle density: 18/frame
- Ember rate: 0.45
- Glow intensity: 0.75
- Flame height: 1.3x

#### Roaring (Days 8-14)
- Base size: 110px
- Particle density: 23/frame
- Ember rate: 0.55
- Glow intensity: 0.95
- Flame height: 1.4x

#### First Flame (Days 15+)
- Base size: 130px
- Particle density: 30/frame
- Ember rate: 0.7
- Glow intensity: 1.2
- Flame height: 1.5x

## Technical Implementation

### Particle System

Each flame particle has:
- Position (x, y)
- Velocity (vx, vy)
- Life span and age
- Size
- Heat value (0-1)
- Turbulence factor
- Rotation angle and velocity

### Rendering Pipeline

1. **Clear canvas** with transparency
2. **Draw atmospheric glow** (radial gradient)
3. **Update particle physics**:
   - Apply multi-frequency turbulence
   - Update position with velocity
   - Apply drag/friction
   - Reduce heat over time
4. **Render particles** (back to front):
   - Atmospheric layer
   - Outer glow
   - Core flame
   - Hot core (for high-heat particles)
5. **Draw intense bloom** at flame base
6. **Update and render embers**

### Performance Optimization

- Particle pooling (reuse particles)
- Efficient gradient caching
- Conditional rendering (skip invisible particles)
- RequestAnimationFrame for smooth 60fps
- Canvas compositing for layered effects

## Covenant Integration

The flame adapts to covenant themes:

- **Respite (Blue)**: Cooler color tints in outer glow
- **Focus (Silver)**: Sharper, more defined edges
- **Vigor (Gold)**: Warmer, more energetic motion

## Starry Background

A cosmic starry sky complements the flame:

- **Deep space gradient**: Dark blue to black
- **Twinkling stars**: Sine wave brightness variation
- **Star density**: Responsive to screen size
- **Subtle glow**: Each star has soft halo
- **Performance**: Optimized for smooth animation

## Usage

```tsx
import { RealisticFlame } from './components/RealisticFlame';

<RealisticFlame 
  level="roaring"
  covenant="vigor"
  isBreathing={true}
  breathPhase="inhale"
/>
```

## Future Enhancements

Potential improvements:

1. **Smoke simulation**: Add rising smoke particles
2. **Heat distortion**: Screen-space distortion effect
3. **Spark system**: Additional bright sparks
4. **Sound integration**: Crackling fire sounds
5. **WebGL version**: Hardware-accelerated rendering
6. **Flame texture mapping**: Use actual flame textures
7. **Interactive flames**: Respond to mouse/touch
8. **Multiple flame types**: Different styles per covenant

## References

Based on:
- Real fire physics and fluid dynamics
- Volumetric rendering techniques
- Particle system best practices
- Dark Souls aesthetic inspiration
- Provided reference images showing desired look

---

*The flame is realistic. The immersion is complete.*