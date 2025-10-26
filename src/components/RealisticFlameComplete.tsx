import React, { useEffect, useRef } from 'react';
import type { BonfireLevel, CovenantType } from '../types';

interface RealisticFlameProps {
  level: BonfireLevel;
  covenant?: CovenantType;
  isBreathing?: boolean;
  breathPhase?: 'inhale' | 'hold' | 'exhale' | 'hold-empty';
}

// Flame particle interface - represents individual flame particles
interface FlameParticle {
  x: number;              // X position
  y: number;              // Y position
  vx: number;             // X velocity
  vy: number;             // Y velocity (negative = upward)
  life: number;           // Current lifetime counter
  maxLife: number;        // Maximum lifetime before particle dies
  size: number;           // Particle size in pixels
  heat: number;           // Heat value (0-1) determines color
  turbulence: number;     // Turbulence strength for movement
  angle: number;          // Current rotation angle
  angleVelocity: number;  // Rotation speed
}

// Ember particle interface - represents glowing embers rising from flame
interface Ember {
  x: number;              // X position
  y: number;              // Y position
  vx: number;             // X velocity
  vy: number;             // Y velocity (negative = upward)
  life: number;           // Current lifetime counter
  maxLife: number;        // Maximum lifetime before ember fades
  size: number;           // Ember size in pixels
  brightness: number;     // Brightness value (0-1)
}

export const RealisticFlame: React.FC<RealisticFlameProps> = ({
  level,
  covenant,
  isBreathing = false,
  breathPhase = 'hold'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flameParticlesRef = useRef<FlameParticle[]>([]);
  const embersRef = useRef<Ember[]>([]);
  const timeRef = useRef(0);
  const animationFrameRef = useRef<number | undefined>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 500;

    const centerX = canvas.width / 2;
    const baseY = canvas.height * 0.75;

    // Breathing scale and intensity management
    let breathScale = 1;
    let breathTarget = 1;
    let breathIntensity = 1;

    // Update breathing parameters based on current phase
    if (isBreathing) {
      switch (breathPhase) {
        case 'inhale':
          breathTarget = 1.4;
          breathIntensity = 1.3;
          break;
        case 'hold':
          breathTarget = 1.1;
          breathIntensity = 1.1;
          break;
        case 'exhale':
          breathTarget = 0.7;
          breathIntensity = 0.8;
          break;
        case 'hold-empty':
          breathTarget = 0.9;
          breathIntensity = 0.9;
          break;
      }
    }

    // Bonfire level parameters - determines flame characteristics
    let baseSize = 80;
    let particleDensity = 15;
    let emberRate = 0.3;
    let glowIntensity = 0.6;
    let flameHeight = 1.2;

    switch (level) {
      case 'first-flame':
        baseSize = 130;
        particleDensity = 30;
        emberRate = 0.7;
        glowIntensity = 1.2;
        flameHeight = 1.5;
        break;
      case 'roaring':
        baseSize = 110;
        particleDensity = 23;
        emberRate = 0.55;
        glowIntensity = 0.95;
        flameHeight = 1.4;
        break;
      case 'steady-flame':
        baseSize = 95;
        particleDensity = 18;
        emberRate = 0.45;
        glowIntensity = 0.75;
        flameHeight = 1.3;
        break;
      case 'smoldering':
        baseSize = 80;
        particleDensity = 15;
        emberRate = 0.3;
        glowIntensity = 0.6;
        flameHeight = 1.2;
        break;
    }

    /**
     * Color gradient based on heat value (0 = cool, 1 = hot)
     * Physically-based color progression from deep red to white-hot
     */
    const getFlameColor = (heat: number, alpha: number = 1): string => {
      if (heat > 0.9) {
        // White-hot core - hottest part of flame
        return `rgba(255, 255, ${200 + Math.floor(heat * 55)}, ${alpha})`;
      } else if (heat > 0.7) {
        // Bright yellow - very hot
        const r = 255;
        const g = 200 + Math.floor((heat - 0.7) * 275);
        const b = Math.floor((1 - heat) * 100);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      } else if (heat > 0.4) {
        // Orange - hot
        const r = 255;
        const g = 100 + Math.floor(heat * 200);
        const b = 0;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      } else if (heat > 0.2) {
        // Deep orange to red - warm
        const r = 255;
        const g = Math.floor(heat * 200);
        const b = Math.floor(heat * 50);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      } else {
        // Deep red with purple hints - coolest visible flame
        const r = 180 + Math.floor(heat * 375);
        const g = Math.floor(heat * 100);
        const b = Math.floor(heat * 150);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
    };

    /**
     * Create a new flame particle at the base of the fire
     * Particles spawn with random angle and velocity
     */
    const createFlameParticle = (): FlameParticle => {
      const angle = (Math.random() - 0.5) * Math.PI * 0.7; // ±63 degrees
      const distance = Math.random() * baseSize * 0.4;
      const speed = 1.5 + Math.random() * 2;

      return {
        x: centerX + Math.cos(angle) * distance,
        y: baseY - Math.abs(Math.sin(angle)) * distance * 0.3,
        vx: Math.cos(angle) * speed * 0.3,
        vy: -speed * flameHeight,
        life: 0,
        maxLife: 60 + Math.random() * 60,
        size: 8 + Math.random() * 12,
        heat: 0.7 + Math.random() * 0.3,
        turbulence: 3 + Math.random() * 4,
        angle: Math.random() * Math.PI * 2,
        angleVelocity: (Math.random() - 0.5) * 0.1
      };
    };

    /**
     * Create a new ember particle
     * Embers are smaller, slower particles that rise from the flame
     */
    const createEmber = (): Ember => {
      const angle = (Math.random() - 0.5) * Math.PI * 0.4;
      return {
        x: centerX + Math.cos(angle) * baseSize * 0.3,
        y: baseY - 20,
        vx: Math.cos(angle) * (0.5 + Math.random() * 0.5),
        vy: -(0.5 + Math.random() * 1),
        life: 0,
        maxLife: 120 + Math.random() * 80,
        size: 1 + Math.random() * 2,
        brightness: 0.6 + Math.random() * 0.4
      };
    };

    /**
     * Main animation loop
     * Handles particle spawning, updating, and rendering
     */
    const animate = () => {
      timeRef.current += 0.016; // ~60fps time step
      
      // Smooth breathing transition using linear interpolation
      breathScale += (breathTarget - breathScale) * 0.03;

      // Clear canvas for new frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn flame particles based on density and breathing intensity
      const spawnRate = particleDensity * breathIntensity;
      for (let i = 0; i < spawnRate; i++) {
        if (Math.random() < 0.3) {
          flameParticlesRef.current.push(createFlameParticle());
        }
      }

      // Spawn embers based on ember rate and breathing intensity
      if (Math.random() < emberRate * breathIntensity) {
        embersRef.current.push(createEmber());
      }

      // Draw atmospheric glow - outermost layer for ambient lighting
      const glowGradient = ctx.createRadialGradient(
        centerX, baseY - baseSize * breathScale * 0.5, 0,
        centerX, baseY - baseSize * breathScale * 0.5, baseSize * breathScale * 2
      );
      glowGradient.addColorStop(0, `rgba(255, 150, 50, ${0.15 * glowIntensity})`);
      glowGradient.addColorStop(0.5, `rgba(255, 100, 0, ${0.05 * glowIntensity})`);
      glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      /**
       * Update and draw flame particles
       * Particles are rendered back-to-front for proper layering
       */
      flameParticlesRef.current = flameParticlesRef.current.filter(particle => {
        particle.life++;
        
        // Apply complex turbulence with multiple frequencies for realistic movement
        const turbulence1 = Math.sin(timeRef.current * 2 + particle.angle) * particle.turbulence;
        const turbulence2 = Math.cos(timeRef.current * 3.5 + particle.angle * 2) * particle.turbulence * 0.5;
        const turbulence3 = Math.sin(timeRef.current * 1.2 + particle.y * 0.01) * particle.turbulence * 0.3;
        
        particle.x += particle.vx + turbulence1 + turbulence2;
        particle.y += particle.vy * breathScale + turbulence3;
        particle.angle += particle.angleVelocity;
        
        // Simulate air resistance and buoyancy
        particle.vy *= 0.975; // Slow down vertical movement
        particle.vx *= 0.96;  // Dampen horizontal movement
        
        // Heat dissipation - slower at first, faster as particle ages
        const lifeRatio = particle.life / particle.maxLife;
        particle.heat *= (lifeRatio < 0.3) ? 0.995 : 0.98;
        
        // Calculate alpha for smooth fade out using sine wave
        const alpha = Math.sin(lifeRatio * Math.PI) * (1 - lifeRatio * 0.6);
        
        if (alpha > 0.01) {
          // Draw particle with 4-layer volumetric effect
          const size = particle.size * breathScale * (1 - lifeRatio * 0.4);
          
          // Layer 1: Far outer glow (atmospheric)
          const atmosphericGradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, size * 2.5
          );
          atmosphericGradient.addColorStop(0, getFlameColor(particle.heat, alpha * 0.3));
          atmosphericGradient.addColorStop(0.4, getFlameColor(particle.heat * 0.8, alpha * 0.15));
          atmosphericGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.fillStyle = atmosphericGradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, size * 2.5, 0, Math.PI * 2);
          ctx.fill();
          
          // Layer 2: Outer glow
          const outerGradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, size * 1.5
          );
          outerGradient.addColorStop(0, getFlameColor(particle.heat, alpha * 0.6));
          outerGradient.addColorStop(0.5, getFlameColor(particle.heat * 0.9, alpha * 0.3));
          outerGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.fillStyle = outerGradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, size * 1.5, 0, Math.PI * 2);
          ctx.fill();
          
          // Layer 3: Core
          const coreGradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, size
          );
          coreGradient.addColorStop(0, getFlameColor(particle.heat, alpha));
          coreGradient.addColorStop(0.6, getFlameColor(particle.heat * 0.95, alpha * 0.8));
          coreGradient.addColorStop(1, getFlameColor(particle.heat * 0.7, alpha * 0.3));
          
          ctx.fillStyle = coreGradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
          ctx.fill();
          
          // Layer 4: Hot core center (only for very hot particles)
          if (particle.heat > 0.8) {
            const hotCoreGradient = ctx.createRadialGradient(
              particle.x, particle.y, 0,
              particle.x, particle.y, size * 0.4
            );
            hotCoreGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
            hotCoreGradient.addColorStop(0.5, getFlameColor(1, alpha * 0.8));
            hotCoreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.fillStyle = hotCoreGradient;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, size * 0.4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        
        // Keep particle alive if it hasn't exceeded max lifetime
        return particle.life < particle.maxLife;
      });

      // Draw intense core bloom at flame base
      const bloomSize = baseSize * breathScale * 0.6;
      const bloomGradient = ctx.createRadialGradient(
        centerX, baseY - bloomSize * 0.3, 0,
        centerX, baseY - bloomSize * 0.3, bloomSize * 1.5
      );
      bloomGradient.addColorStop(0, `rgba(255, 255, 200, ${0.4 * glowIntensity})`);
      bloomGradient.addColorStop(0.3, `rgba(255, 200, 100, ${0.3 * glowIntensity})`);
      bloomGradient.addColorStop(0.6, `rgba(255, 150, 50, ${0.15 * glowIntensity})`);
      bloomGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = bloomGradient;
      ctx.beginPath();
      ctx.arc(centerX, baseY - bloomSize * 0.3, bloomSize * 1.5, 0, Math.PI * 2);
      ctx.fill();

      /**
       * Update and draw embers
       * Embers rise slowly and fade out over time
       */
      embersRef.current = embersRef.current.filter(ember => {
        ember.life++;
        ember.x += ember.vx;
        ember.y += ember.vy;
        ember.vy -= 0.02; // Slight upward acceleration
        ember.vx *= 0.99; // Dampen horizontal movement
        
        const lifeRatio = ember.life / ember.maxLife;
        const alpha = (1 - lifeRatio) * ember.brightness;
        const size = ember.size * (1 - lifeRatio * 0.5);
        
        if (alpha > 0.01) {
          // Ember glow
          const emberGradient = ctx.createRadialGradient(
            ember.x, ember.y, 0,
            ember.x, ember.y, size * 3
          );
          emberGradient.addColorStop(0, `rgba(255, 200, 100, ${alpha * 0.6})`);
          emberGradient.addColorStop(0.5, `rgba(255, 150, 50, ${alpha * 0.3})`);
          emberGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.fillStyle = emberGradient;
          ctx.beginPath();
          ctx.arc(ember.x, ember.y, size * 3, 0, Math.PI * 2);
          ctx.fill();
          
          // Ember core
          ctx.fillStyle = `rgba(255, 200, 100, ${alpha})`;
          ctx.beginPath();
          ctx.arc(ember.x, ember.y, size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        return ember.life < ember.maxLife;
      });

      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [level, covenant, isBreathing, breathPhase]);

  return (
    <div className="flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto"
        style={{ 
          filter: 'blur(0.5px)', // Slight blur for softer appearance
          imageRendering: 'crisp-edges' // Maintain sharpness
        }}
      />
    </div>
  );
};