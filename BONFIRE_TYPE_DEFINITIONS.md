# Bonfire Animation System - Type Definitions

## Core Type Definitions

### BonfireLevel Type

```typescript
/**
 * Represents the four levels of bonfire intensity
 * Each level has distinct visual characteristics and performance implications
 */
type BonfireLevel = 'smoldering' | 'steady-flame' | 'roaring' | 'first-flame';
```

**Level Characteristics:**

| Level | Base Size | Particles/Frame | Ember Rate | Glow Intensity | Height Multiplier |
|-------|-----------|-----------------|------------|----------------|-------------------|
| smoldering | 80px | 15 | 0.30 | 0.6 | 1.2x |
| steady-flame | 95px | 18 | 0.45 | 0.75 | 1.3x |
| roaring | 110px | 23 | 0.55 | 0.95 | 1.4x |
| first-flame | 130px | 30 | 0.70 | 1.2 | 1.5x |

### BreathPhase Type

```typescript
/**
 * Represents the four phases of a breathing cycle
 * Used to synchronize flame behavior with breathing exercises
 */
type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'hold-empty';
```

**Phase Effects:**

| Phase | Scale | Intensity | Visual Description |
|-------|-------|-----------|-------------------|
| inhale | 1.4x | 1.3x | Flame grows larger and brighter |
| hold | 1.1x | 1.1x | Flame maintains elevated size |
| exhale | 0.7x | 0.8x | Flame shrinks and dims |
| hold-empty | 0.9x | 0.9x | Flame at minimal size |

### CovenantType Type

```typescript
/**
 * Represents different covenant themes that can affect flame appearance
 * Each covenant has its own color scheme and visual identity
 */
type CovenantType = 'respite' | 'focus' | 'vigor';
```

**Covenant Themes:**

| Covenant | Primary Color | Glow Color | Theme |
|----------|--------------|------------|-------|
| respite | Blue-tinted | Calm blue glow | Relaxation and rest |
| focus | Purple-tinted | Sharp purple glow | Concentration and clarity |
| vigor | Red-tinted | Intense red glow | Energy and vitality |

## Component Props Interfaces

### RealisticFlame Props

```typescript
interface RealisticFlameProps {
  /**
   * The current level of the bonfire
   * Determines size, particle count, and overall intensity
   * @required
   */
  level: BonfireLevel;

  /**
   * Optional covenant theme to apply color variations
   * @optional
   * @default undefined (uses default orange/yellow flame colors)
   */
  covenant?: CovenantType;

  /**
   * Whether the flame should respond to breathing phases
   * @optional
   * @default false
   */
  isBreathing?: boolean;

  /**
   * Current phase of the breathing cycle
   * Only used when isBreathing is true
   * @optional
   * @default 'hold'
   */
  breathPhase?: BreathPhase;
}
```

**Usage Example:**
```typescript
<RealisticFlame
  level="steady-flame"
  covenant="respite"
  isBreathing={true}
  breathPhase="inhale"
/>
```

### StarryBackground Props

```typescript
// StarryBackground has no props - it's fully self-contained
interface StarryBackgroundProps {
  // No props required
}
```

**Usage Example:**
```typescript
<StarryBackground />
```

## Internal Type Definitions

### FlameParticle Interface

```typescript
/**
 * Represents a single flame particle in the animation system
 * These particles make up the main body of the flame
 */
interface FlameParticle {
  /**
   * Current X position on canvas
   */
  x: number;

  /**
   * Current Y position on canvas
   */
  y: number;

  /**
   * Horizontal velocity (pixels per frame)
   */
  vx: number;

  /**
   * Vertical velocity (pixels per frame, negative = upward)
   */
  vy: number;

  /**
   * Current lifetime counter (frames)
   */
  life: number;

  /**
   * Maximum lifetime before particle dies (frames)
   * Typically 60-120 frames (1-2 seconds at 60fps)
   */
  maxLife: number;

  /**
   * Particle size in pixels
   * Typically 8-20 pixels
   */
  size: number;

  /**
   * Heat value (0-1) that determines particle color
   * 1.0 = white-hot, 0.0 = deep red/purple
   */
  heat: number;

  /**
   * Turbulence strength for movement variation
   * Higher values create more chaotic movement
   */
  turbulence: number;

  /**
   * Current rotation angle in radians
   */
  angle: number;

  /**
   * Rotation speed in radians per frame
   */
  angleVelocity: number;
}
```

### Ember Interface

```typescript
/**
 * Represents a glowing ember particle rising from the flame
 * Embers are smaller, slower particles that add atmosphere
 */
interface Ember {
  /**
   * Current X position on canvas
   */
  x: number;

  /**
   * Current Y position on canvas
   */
  y: number;

  /**
   * Horizontal velocity (pixels per frame)
   */
  vx: number;

  /**
   * Vertical velocity (pixels per frame, negative = upward)
   */
  vy: number;

  /**
   * Current lifetime counter (frames)
   */
  life: number;

  /**
   * Maximum lifetime before ember fades (frames)
   * Typically 120-200 frames (2-3.3 seconds at 60fps)
   */
  maxLife: number;

  /**
   * Ember size in pixels
   * Typically 1-3 pixels
   */
  size: number;

  /**
   * Base brightness value (0-1)
   * Determines how bright the ember glows
   */
  brightness: number;
}
```

### Star Interface

```typescript
/**
 * Represents a single star in the starry background
 * Stars are static but twinkle over time
 */
interface Star {
  /**
   * X position on canvas (static)
   */
  x: number;

  /**
   * Y position on canvas (static)
   */
  y: number;

  /**
   * Star size in pixels
   * Typically 0.5-2 pixels
   */
  size: number;

  /**
   * Base brightness value (0-1)
   * Determines the star's maximum brightness
   */
  brightness: number;

  /**
   * Speed of the twinkle animation
   * Higher values = faster twinkling
   */
  twinkleSpeed: number;

  /**
   * Phase offset for twinkle animation
   * Ensures stars don't all twinkle in sync
   */
  twinkleOffset: number;
}
```

## Utility Types

### Canvas Context Options

```typescript
/**
 * Configuration options for canvas context
 */
interface CanvasContextOptions {
  /**
   * Whether the canvas will be read frequently
   * Set to false for better performance when only writing
   */
  willReadFrequently: boolean;
}
```

### Animation Frame Reference

```typescript
/**
 * Type for requestAnimationFrame return value
 * Used for cleanup on component unmount
 */
type AnimationFrameId = number;
```

### Gradient Stop

```typescript
/**
 * Represents a color stop in a gradient
 */
interface GradientStop {
  /**
   * Position in gradient (0-1)
   */
  offset: number;

  /**
   * Color at this position (CSS color string)
   */
  color: string;
}
```

## Type Guards

### BonfireLevel Type Guard

```typescript
/**
 * Type guard to check if a value is a valid BonfireLevel
 */
function isBonfireLevel(value: unknown): value is BonfireLevel {
  return (
    typeof value === 'string' &&
    ['smoldering', 'steady-flame', 'roaring', 'first-flame'].includes(value)
  );
}
```

**Usage:**
```typescript
const level = getUserInput();
if (isBonfireLevel(level)) {
  // TypeScript now knows level is BonfireLevel
  <RealisticFlame level={level} />
}
```

### BreathPhase Type Guard

```typescript
/**
 * Type guard to check if a value is a valid BreathPhase
 */
function isBreathPhase(value: unknown): value is BreathPhase {
  return (
    typeof value === 'string' &&
    ['inhale', 'hold', 'exhale', 'hold-empty'].includes(value)
  );
}
```

### CovenantType Type Guard

```typescript
/**
 * Type guard to check if a value is a valid CovenantType
 */
function isCovenantType(value: unknown): value is CovenantType {
  return (
    typeof value === 'string' &&
    ['respite', 'focus', 'vigor'].includes(value)
  );
}
```

## Constant Definitions

### Bonfire Level Constants

```typescript
/**
 * Array of all valid bonfire levels in order of intensity
 */
const BONFIRE_LEVELS: readonly BonfireLevel[] = [
  'smoldering',
  'steady-flame',
  'roaring',
  'first-flame'
] as const;

/**
 * Get the next bonfire level
 */
function getNextLevel(current: BonfireLevel): BonfireLevel | null {
  const index = BONFIRE_LEVELS.indexOf(current);
  return index < BONFIRE_LEVELS.length - 1 ? BONFIRE_LEVELS[index + 1] : null;
}

/**
 * Get the previous bonfire level
 */
function getPreviousLevel(current: BonfireLevel): BonfireLevel | null {
  const index = BONFIRE_LEVELS.indexOf(current);
  return index > 0 ? BONFIRE_LEVELS[index - 1] : null;
}
```

### Breath Phase Constants

```typescript
/**
 * Array of breath phases in cycle order
 */
const BREATH_PHASES: readonly BreathPhase[] = [
  'inhale',
  'hold',
  'exhale',
  'hold-empty'
] as const;

/**
 * Default breathing cycle durations (milliseconds)
 */
const DEFAULT_BREATH_DURATIONS: Record<BreathPhase, number> = {
  inhale: 4000,
  hold: 7000,
  exhale: 8000,
  'hold-empty': 0
} as const;
```

### Covenant Constants

```typescript
/**
 * Array of all valid covenant types
 */
const COVENANT_TYPES: readonly CovenantType[] = [
  'respite',
  'focus',
  'vigor'
] as const;

/**
 * Covenant color schemes
 */
const COVENANT_COLORS: Record<CovenantType, string> = {
  respite: 'rgba(100, 150, 255, 0.5)',
  focus: 'rgba(200, 100, 255, 0.5)',
  vigor: 'rgba(255, 100, 100, 0.5)'
} as const;
```

## Type Conversion Utilities

### Level to Number

```typescript
/**
 * Convert BonfireLevel to numeric value (0-3)
 */
function levelToNumber(level: BonfireLevel): number {
  return BONFIRE_LEVELS.indexOf(level);
}
```

### Number to Level

```typescript
/**
 * Convert numeric value to BonfireLevel
 * Clamps to valid range
 */
function numberToLevel(value: number): BonfireLevel {
  const clamped = Math.max(0, Math.min(3, Math.floor(value)));
  return BONFIRE_LEVELS[clamped];
}
```

## React Hook Types

### UseFlameAnimation Hook

```typescript
/**
 * Custom hook for managing flame animation state
 */
interface UseFlameAnimationReturn {
  level: BonfireLevel;
  setLevel: (level: BonfireLevel) => void;
  upgradeLevel: () => void;
  downgradeLevel: () => void;
  canUpgrade: boolean;
  canDowngrade: boolean;
}

function useFlameAnimation(initialLevel: BonfireLevel = 'steady-flame'): UseFlameAnimationReturn {
  const [level, setLevel] = useState<BonfireLevel>(initialLevel);

  const upgradeLevel = useCallback(() => {
    const next = getNextLevel(level);
    if (next) setLevel(next);
  }, [level]);

  const downgradeLevel = useCallback(() => {
    const prev = getPreviousLevel(level);
    if (prev) setLevel(prev);
  }, [level]);

  return {
    level,
    setLevel,
    upgradeLevel,
    downgradeLevel,
    canUpgrade: getNextLevel(level) !== null,
    canDowngrade: getPreviousLevel(level) !== null
  };
}
```

### UseBreathingCycle Hook

```typescript
/**
 * Custom hook for managing breathing cycle
 */
interface UseBreathingCycleReturn {
  phase: BreathPhase;
  isActive: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

function useBreathingCycle(
  durations: Record<BreathPhase, number> = DEFAULT_BREATH_DURATIONS
): UseBreathingCycleReturn {
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const duration = durations[phase];
    if (duration === 0) return;

    const timer = setTimeout(() => {
      const currentIndex = BREATH_PHASES.indexOf(phase);
      const nextIndex = (currentIndex + 1) % BREATH_PHASES.length;
      setPhase(BREATH_PHASES[nextIndex]);
    }, duration);

    return () => clearTimeout(timer);
  }, [phase, isActive, durations]);

  return {
    phase,
    isActive,
    start: () => setIsActive(true),
    stop: () => setIsActive(false),
    reset: () => {
      setIsActive(false);
      setPhase('inhale');
    }
  };
}
```

## Export Statement

```typescript
// Export all types for use in other modules
export type {
  BonfireLevel,
  BreathPhase,
  CovenantType,
  RealisticFlameProps,
  StarryBackgroundProps,
  FlameParticle,
  Ember,
  Star,
  UseFlameAnimationReturn,
  UseBreathingCycleReturn
};

// Export constants
export {
  BONFIRE_LEVELS,
  BREATH_PHASES,
  COVENANT_TYPES,
  COVENANT_COLORS,
  DEFAULT_BREATH_DURATIONS
};

// Export utilities
export {
  isBonfireLevel,
  isBreathPhase,
  isCovenantType,
  levelToNumber,
  numberToLevel,
  getNextLevel,
  getPreviousLevel
};

// Export hooks
export {
  useFlameAnimation,
  useBreathingCycle
};
```

---

## Integration with Existing Types

If you already have a `types.ts` file in your project, you can extend it with these definitions:

```typescript
// types.ts
export type BonfireLevel = 'smoldering' | 'steady-flame' | 'roaring' | 'first-flame';
export type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'hold-empty';
export type CovenantType = 'respite' | 'focus' | 'vigor';

// ... rest of your existing types
```

Then import them in your components:

```typescript
import type { BonfireLevel, BreathPhase, CovenantType } from '../types';
```

This ensures type consistency across your entire application.