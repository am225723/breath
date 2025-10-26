import React, { useEffect, useRef } from 'react';
import type { BonfireLevel, CovenantType } from '../types';

interface RealisticFlameProps {
  level: BonfireLevel;
  covenant?: CovenantType;
  isBreathing?: boolean;
  breathPhase?: 'inhale' | 'hold' | 'exhale' | 'hold-empty';
}

// Particle for the main flame body (white/yellow/pink)
interface FlameParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  opacity: number;
  turbulence: number;
  angle: number;
  angleVelocity: number;
}

// Particle for the blue wisps at the top
interface WispParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  opacity: number;
  turbulence: number;
}

// Particle for the bright sparks
interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  brightness: number;
}

// Changed from 'export const' to just 'const'
const RealisticFlame: React.FC<RealisticFlameProps> = ({
  level,
  // covenant, // Covenant logic removed for this specific style
  isBreathing = false,
  breathPhase = 'hold'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flameParticlesRef = useRef<FlameParticle[]>([]);
  const wispParticlesRef = useRef<WispParticle[]>([]);
  const embersRef = useRef<Ember[]>([]);
  const timeRef = useRef(0);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 500;

    const centerX = canvas.width / 2;
    const baseY = canvas.height * 0.85; // Move base lower for more room

    // Breathing scale and intensity management
    let breathScale = 1;
    let breathTarget = 1;
    let breathIntensity = 1;

    if (isBreathing) {
      switch (breathPhase) {
        case 'inhale':
          breathTarget = 1.3;
          breathIntensity = 1.2;
          break;
        case 'hold':
          breathTarget = 1.1;
          breathIntensity = 1.0;
          break;
        case 'exhale':
          breathTarget = 0.8;
          breathIntensity = 0.8;
          break;
        case 'hold-empty':
          breathTarget = 0.9;
          breathIntensity = 0.9;
          break;
      }
    }

    // Bonfire level parameters
    let baseSize = 80;
    let particleDensity = 15;
    let emberRate = 0.3;
    let glowIntensity = 0.6;
    let flameHeight = 1.2;

    switch (level) {
      case 'first-flame':
        baseSize = 100;
        particleDensity = 25;
        emberRate = 0.7;
        glowIntensity = 1.0;
        flameHeight = 1.4;
        break;
      case 'roaring':
        baseSize = 90;
        particleDensity = 20;
        emberRate = 0.5;
        glowIntensity = 0.8;
        flameHeight = 1.3;
        break;
      case 'steady-flame':
        baseSize = 80;
        particleDensity = 15;
        emberRate = 0.3;
        glowIntensity = 0.6;
        flameHeight = 1.2;
        break;
      case 'smoldering':
        baseSize = 70;
        particleDensity = 10;
        emberRate = 0.2;
        glowIntensity = 0.4;
        flameHeight = 1.1;
        break;
    }

    /**
     * Color gradient for the main flame body, based on lifeRatio (0 = spawn, 1 = death)
     * This matches the white -> yellow -> red/pink progression
     */
    const getFlameColor = (lifeRatio: number, alpha: number): string => {
      if (lifeRatio < 0.2) {
        // 0.0 - 0.2: White-hot base
        return `rgba(255, 255, 230, ${alpha})`;
      } else if (lifeRatio < 0.5) {
        // 0.2 - 0.5: Transition to Yellow
        const progress = (lifeRatio - 0.2) / 0.3;
        const g = 255 - Math.floor(progress * 35); // 255 -> 220
        const b = 230 - Math.floor(progress * 130); // 230 -> 100
        return `rgba(255, ${g}, ${b}, ${alpha})`;
      } else if (lifeRatio < 0.8) {
        // 0.5 - 0.8: Transition to Reddish-Pink
        const progress = (lifeRatio - 0.5) / 0.3;
        const g = 220 - Math.floor(progress * 120); // 220 -> 100
        const b = 100 + Math.floor(progress * 20); // 100 -> 120
        return `rgba(255, ${g}, ${b}, ${alpha})`;
      } else {
        // 0.8 - 1.0: Fade out as pink
        return `rgba(255, 100, 120, ${alpha})`;
      }
    };

    /**
     * Color gradient for the wisps, based on lifeRatio
     * This matches the cyan/blue progression
     */
    const getWispColor = (lifeRatio: number, alpha: number): string => {
      if (lifeRatio < 0.3) {
        // 0.0 - 0.3: Transition from flame color (pink/white) to cyan
        const progress = lifeRatio / 0.3;
        const r = 255 - Math.floor(progress * 255); // 255 -> 0
        const g = 100 + Math.floor(progress * 120); // 100 -> 220
        const b = 120 + Math.floor(progress * 135); // 120 -> 255
        return `rgba(${r}, ${g}, ${b}, ${alpha * 0.7})`; // Start slightly faded
      } else {
        // 0.3 - 1.0: Bright Cyan
        return `rgba(0, 220, 255, ${alpha})`;
      }
    };

    /**
     * Create a new flame particle at the base
     */
    const createFlameParticle = (): FlameParticle => {
      const angle = (Math.random() - 0.5) * Math.PI * 0.5; // Narrower base
      const distance = Math.random() * baseSize * 0.3;
      const speed = 1.5 + Math.random() * 2;

      return {
        x: centerX + Math.cos(angle) * distance,
        y: baseY - Math.abs(Math.sin(angle)) * distance * 0.3,
        vx: Math.cos(angle) * speed * 0.3,
        vy: -speed * flameHeight,
        life: 0,
        maxLife: 40 + Math.random() * 40, // Shorter lifespan to force transition
        size: 10 + Math.random() * 15, // Slightly smaller, denser particles
        opacity: 0.8 + Math.random() * 0.2,
        turbulence: 3 + Math.random() * 4,
        angle: Math.random() * Math.PI * 2,
        angleVelocity: (Math.random() - 0.5) * 0.1
      };
    };

    /**
     * Create a new wisp particle, spawned from a flame particle
     */
    const createWispParticle = (x: number, y: number): WispParticle => {
      return {
        x: x + (Math.random() - 0.5) * 10,
        y: y,
        vx: (Math.random() - 0.5) * 0.5, // Less horizontal drift
        vy: -1.5 - Math.random() * 1, // Strong, steady upward velocity
        life: 0,
        maxLife: 60 + Math.random() * 60, // Longer lifespan
        size: 8 + Math.random() * 12,
        opacity: 0.6 + Math.random() * 0.3,
        turbulence: 1 + Math.random() * 1, // Much less turbulence
      };
    };

    /**
     * Create a new ember (spark)
     */
    const createEmber = (): Ember => {
      return {
        x: centerX + (Math.random() - 0.5) * baseSize * 0.5,
        y: baseY - Math.random() * baseSize * 0.5,
        vx: (Math.random() - 0.5) * 2, // More horizontal "spark" velocity
        vy: -(1 + Math.random() * 2), // Pop upwards
        life: 0,
        maxLife: 80 + Math.random() * 80,
        size: 1 + Math.random() * 2.5,
        brightness: 0.7 + Math.random() * 0.3
      };
    };

    /**
     * Main animation loop
     */
    const animate = () => {
      timeRef.current += 0.016; // ~60fps time step
      
      breathScale += (breathTarget - breathScale) * 0.03;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- Spawn new particles ---
      const spawnRate = particleDensity * breathIntensity;
      for (let i = 0; i < spawnRate; i++) {
        if (Math.random() < 0.5) { // Denser core
          flameParticlesRef.current.push(createFlameParticle());
        }
      }

      if (Math.random() < emberRate * breathIntensity) {
        embersRef.current.push(createEmber());
      }

      // --- Draw Base Glow (White/Yellow) ---
      const glowGradient = ctx.createRadialGradient(
        centerX, baseY - baseSize * breathScale * 0.2, 0,
        centerX, baseY - baseSize * breathScale * 0.2, baseSize * breathScale * 1.5
      );
      glowGradient.addColorStop(0, `rgba(255, 255, 220, ${0.25 * glowIntensity})`);
      glowGradient.addColorStop(0.3, `rgba(255, 200, 100, ${0.1 * glowIntensity})`);
      glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);


      // --- Update and Draw Flame Particles (White/Yellow/Pink) ---
      flameParticlesRef.current = flameParticlesRef.current.filter(particle => {
        particle.life++;
        const lifeRatio = particle.life / particle.maxLife;

        // Apply turbulence
        const turbulence1 = Math.sin(timeRef.current * 2 + particle.angle) * particle.turbulence;
        const turbulence2 = Math.cos(timeRef.current * 3.5 + particle.angle * 2) * particle.turbulence * 0.5;
        
        particle.x += particle.vx + turbulence1 + turbulence2;
        particle.y += particle.vy * breathScale;
        particle.angle += particle.angleVelocity;
        
        particle.vy *= 0.96; // Air resistance
        particle.vx *= 0.94;
        
        // --- Spawn Wisps ---
        // When particle is getting old (high up), spawn blue wisps
        if (lifeRatio > 0.7 && Math.random() < 0.1) {
          wispParticlesRef.current.push(createWispParticle(particle.x, particle.y));
        }
        
        const alpha = Math.sin(lifeRatio * Math.PI) * particle.opacity;
        
        if (alpha > 0.01) {
          const size = particle.size * breathScale * (1 - lifeRatio * 0.5);
          const color = getFlameColor(lifeRatio, alpha);
          
          // Render simple particle (core + glow)
          const coreGradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, size
          );
          coreGradient.addColorStop(0, color);
          coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.fillStyle = coreGradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        return particle.life < particle.maxLife;
      });

      // --- Update and Draw Wisp Particles (Blue/Cyan) ---
      wispParticlesRef.current = wispParticlesRef.current.filter(particle => {
        particle.life++;
        const lifeRatio = particle.life / particle.maxLife;

        // Apply *gentle* turbulence for smoky feel
        const turbulence = Math.sin(timeRef.current * 0.5 + particle.y * 0.02) * particle.turbulence;
        
        particle.x += particle.vx + turbulence;
        particle.y += particle.vy * breathScale; // Still affected by breath
        
        particle.vy *= 0.98; // Less slowdown
        particle.vx *= 0.96;
        
        const alpha = Math.sin(lifeRatio * Math.PI) * particle.opacity;
        
        if (alpha > 0.01) {
          const size = particle.size * (1 - lifeRatio * 0.3); // Wisps get thinner
          const color = getWispColor(lifeRatio, alpha);

          // Render wisp (softer glow)
          const wispGradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, size * 1.5 // Softer, larger glow
          );
          wispGradient.addColorStop(0, color);
          wispGradient.addColorStop(0.5, color.replace(/, [0-9\.]+\)/, `, ${alpha * 0.3})`));
          wispGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.fillStyle = wispGradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
        
        return particle.life < particle.maxLife;
      });

      // --- Draw Embers (Sparks) ---
      embersRef.current = embersRef.current.filter(ember => {
        ember.life++;
        ember.x += ember.vx;
        ember.y += ember.vy;
        ember.vy += 0.05; // Gravity
        
        const lifeRatio = ember.life / ember.maxLife;
        const alpha = (1 - lifeRatio) * ember.brightness;
        
        if (alpha > 0.01) {
          ctx.fillStyle = `rgba(255, 180, 50, ${alpha})`; // Bright orange
          ctx.beginPath();
          ctx.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        return particle.life < particle.maxLife;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [level, isBreathing, breathPhase]); // Removed covenant from deps

  return (
    <div className="flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto"
        style={{ 
          filter: 'blur(0.5px)',
          imageRendering: 'crisp-edges'
        }}
      />
    </div>
  );
};

// Added default export
export default RealisticFlame;

