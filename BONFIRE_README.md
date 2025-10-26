# 🔥 Bonfire Animation System

A realistic, performant bonfire animation system for React/TypeScript applications with breathing synchronization and atmospheric effects.

![Bonfire Animation](https://img.shields.io/badge/React-18+-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 🔥 **Realistic Flame Animation**: 4-layer volumetric rendering with physically-based colors
- 🌬️ **Breathing Synchronization**: Flame responds to breathing patterns (inhale, hold, exhale)
- ⭐ **Starry Background**: Atmospheric deep space background with twinkling stars
- 🎨 **Customizable Themes**: Support for covenant-based color variations
- 📊 **Four Intensity Levels**: From smoldering to first-flame
- 🚀 **Performance Optimized**: Efficient particle system with 60fps target
- 📱 **Responsive**: Works on desktop and mobile devices
- ♿ **Accessible**: Supports reduced motion preferences
- 📦 **Zero Dependencies**: Only requires React and TypeScript

## 🎬 Quick Start

### Installation

1. Copy the component files to your project:
```bash
src/components/RealisticFlame.tsx
src/components/StarryBackground.tsx
```

2. Add type definitions to your `types/index.ts`:
```typescript
export type BonfireLevel = 'smoldering' | 'steady-flame' | 'roaring' | 'first-flame';
export type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'hold-empty';
export type CovenantType = 'respite' | 'focus' | 'vigor';
```

### Basic Usage

```typescript
import { RealisticFlame } from './components/RealisticFlame';
import { StarryBackground } from './components/StarryBackground';

function App() {
  return (
    <div className="relative w-full h-screen">
      <StarryBackground />
      <div className="absolute inset-0 flex items-center justify-center">
        <RealisticFlame level="steady-flame" />
      </div>
    </div>
  );
}
```

### With Breathing Synchronization

```typescript
import { useState } from 'react';
import { RealisticFlame } from './components/RealisticFlame';

function BreathingApp() {
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('inhale');

  return (
    <RealisticFlame
      level="steady-flame"
      covenant="respite"
      isBreathing={true}
      breathPhase={breathPhase}
    />
  );
}
```

## 📚 Documentation

This system includes comprehensive documentation covering all aspects:

### 📖 Core Documentation

| Document | Description |
|----------|-------------|
| **[System Documentation](BONFIRE_SYSTEM_DOCUMENTATION.md)** | Complete system architecture, component specifications, and technical details |
| **[Type Definitions](BONFIRE_TYPE_DEFINITIONS.md)** | All TypeScript types, interfaces, utilities, and custom hooks |
| **[Usage Examples](BONFIRE_USAGE_EXAMPLES.md)** | Practical examples, patterns, and integration guides |
| **[Performance Guide](BONFIRE_PERFORMANCE_GUIDE.md)** | Optimization techniques, profiling, and device-specific recommendations |
| **[Implementation Summary](BONFIRE_IMPLEMENTATION_SUMMARY.md)** | Complete overview of deliverables and integration guide |

### 🎯 Quick Links

- **Getting Started**: See [Usage Examples](BONFIRE_USAGE_EXAMPLES.md#basic-usage)
- **API Reference**: See [Type Definitions](BONFIRE_TYPE_DEFINITIONS.md#component-props-interfaces)
- **Performance Tips**: See [Performance Guide](BONFIRE_PERFORMANCE_GUIDE.md#optimization-techniques)
- **Troubleshooting**: See [Usage Examples](BONFIRE_USAGE_EXAMPLES.md#troubleshooting)

## 🎨 Component API

### RealisticFlame

The main flame animation component with volumetric rendering.

```typescript
interface RealisticFlameProps {
  level: BonfireLevel;           // Required: 'smoldering' | 'steady-flame' | 'roaring' | 'first-flame'
  covenant?: CovenantType;       // Optional: 'respite' | 'focus' | 'vigor'
  isBreathing?: boolean;         // Optional: Enable breathing sync (default: false)
  breathPhase?: BreathPhase;     // Optional: 'inhale' | 'hold' | 'exhale' | 'hold-empty'
}
```

**Bonfire Levels:**

| Level | Size | Particles | Performance | Use Case |
|-------|------|-----------|-------------|----------|
| `smoldering` | Small | 15/frame | Low impact | Mobile, background |
| `steady-flame` | Medium | 18/frame | Balanced | General use |
| `roaring` | Large | 23/frame | High | Desktop showcase |
| `first-flame` | Largest | 30/frame | Very high | Premium experience |

**Breathing Phases:**

| Phase | Effect | Scale | Intensity |
|-------|--------|-------|-----------|
| `inhale` | Flame grows | 1.4x | 1.3x |
| `hold` | Stable, elevated | 1.1x | 1.1x |
| `exhale` | Flame shrinks | 0.7x | 0.8x |
| `hold-empty` | Minimal | 0.9x | 0.9x |

### StarryBackground

Atmospheric background with twinkling stars.

```typescript
// No props required - fully self-contained
<StarryBackground />
```

**Features:**
- 200 randomly distributed stars
- Deep space gradient background
- Smooth twinkle animation
- Responsive to window resize

## 🚀 Performance

### Target Metrics

| Device | Target FPS | Recommended Level |
|--------|-----------|-------------------|
| Desktop (High-end) | 60 FPS | first-flame |
| Desktop (Mid-range) | 60 FPS | roaring |
| Mobile (High-end) | 60 FPS | steady-flame |
| Mobile (Mid-range) | 30-60 FPS | smoldering |

### Optimization Tips

```typescript
// 1. Reduce level on mobile
const level = isMobile ? 'smoldering' : 'steady-flame';

// 2. Disable breathing on low-end devices
<RealisticFlame level="steady-flame" isBreathing={false} />

// 3. Use memoization
const MemoizedFlame = memo(RealisticFlame);

// 4. Lazy load components
const RealisticFlame = lazy(() => import('./components/RealisticFlame'));
```

See [Performance Guide](BONFIRE_PERFORMANCE_GUIDE.md) for detailed optimization techniques.

## 🎨 Customization

### Custom Colors

```typescript
// Modify the getFlameColor function in RealisticFlame.tsx
const getFlameColor = (heat: number, alpha: number = 1): string => {
  // Add your custom color logic
  if (covenant === 'custom') {
    return `rgba(100, 255, 100, ${alpha})`; // Green flame
  }
  // ... existing color logic
};
```

### Adjust Particle Count

```typescript
// In RealisticFlame.tsx, modify:
let particleDensity = 10; // Reduce from 15-30 for better performance
let emberRate = 0.2;      // Reduce from 0.3-0.7
```

### Custom Canvas Size

```typescript
// Modify canvas dimensions:
canvas.width = 300;  // Instead of 400
canvas.height = 375; // Instead of 500
```

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Requirements:**
- Canvas 2D API support
- ES6+ JavaScript
- React 18+
- TypeScript 5.0+ (for development)

## ♿ Accessibility

### Reduced Motion Support

```typescript
function AccessibleFlame() {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    return <div className="text-9xl">🔥</div>; // Static fallback
  }

  return <RealisticFlame level="steady-flame" />;
}
```

## 🧪 Testing

### Visual Testing Checklist
- [ ] All four bonfire levels render correctly
- [ ] Breathing synchronization works smoothly
- [ ] Covenant colors apply correctly
- [ ] Transitions are smooth
- [ ] Embers rise naturally

### Performance Testing Checklist
- [ ] FPS stays above 30 on target devices
- [ ] Memory usage is stable over time
- [ ] CPU usage is reasonable
- [ ] No memory leaks after extended use
- [ ] Battery impact is acceptable on mobile

## 🐛 Troubleshooting

### Flame not visible
```typescript
// Ensure parent has dimensions
<div className="w-full h-screen"> {/* ✓ Explicit dimensions */}
  <RealisticFlame level="steady-flame" />
</div>
```

### Poor performance
```typescript
// Reduce bonfire level
<RealisticFlame level="smoldering" />

// Disable breathing
<RealisticFlame level="steady-flame" isBreathing={false} />
```

### TypeScript errors
```typescript
// Import types correctly
import type { BonfireLevel } from './types';

// Use proper type
const level: BonfireLevel = 'steady-flame'; // ✓ Correct
```

See [Usage Examples](BONFIRE_USAGE_EXAMPLES.md#troubleshooting) for more solutions.

## 📊 Technical Details

### Rendering Pipeline

1. **Particle Spawning**: Dynamic based on level and breathing
2. **Particle Update**: Multi-frequency turbulence, physics simulation
3. **4-Layer Rendering**:
   - Atmospheric glow (2.5x size)
   - Outer glow (1.5x size)
   - Core flame (1x size)
   - Hot core (0.4x size, heat > 0.8)
4. **Ember System**: Separate rising particles
5. **Breathing Sync**: Smooth transitions with lerp

### Color System

Heat-based physically accurate colors:
- **0.9-1.0**: White-hot core
- **0.7-0.9**: Bright yellow
- **0.4-0.7**: Orange
- **0.2-0.4**: Deep orange/red
- **0.0-0.2**: Deep red/purple

See [System Documentation](BONFIRE_SYSTEM_DOCUMENTATION.md) for complete technical details.

## 🔮 Future Enhancements

Potential improvements for future versions:

- [ ] WebGL rendering for 10x performance
- [ ] Sound effects (crackling fire)
- [ ] Interactive flame (mouse/touch response)
- [ ] Smoke particle system
- [ ] Dynamic lighting effects
- [ ] Wind effects
- [ ] Particle trails (motion blur)
- [ ] Spark system
- [ ] Save/load states

## 📄 License

MIT License - feel free to use in your projects!

## 🤝 Contributing

Contributions are welcome! Please ensure:
- Code follows TypeScript best practices
- Performance is maintained
- Documentation is updated
- Examples are provided

## 📞 Support

For issues, questions, or suggestions:
1. Check the [Troubleshooting Guide](BONFIRE_USAGE_EXAMPLES.md#troubleshooting)
2. Review the [Performance Guide](BONFIRE_PERFORMANCE_GUIDE.md)
3. Consult the [System Documentation](BONFIRE_SYSTEM_DOCUMENTATION.md)

## 🙏 Acknowledgments

Built with:
- React 18+ for component architecture
- TypeScript 5.0+ for type safety
- HTML5 Canvas for rendering
- RequestAnimationFrame for smooth animations

---

**Made with 🔥 by NinjaTech AI**

*For complete documentation, see the individual documentation files listed above.*