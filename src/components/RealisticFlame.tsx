import React, { useEffect, useRef } from 'react';
import type { BonfireLevel, CovenantType } from '../types';
import { COVENANTS } from '../data/covenants';

interface RealisticFlameProps {
  level: BonfireLevel;
  covenant?: CovenantType;
  isBreathing?: boolean;
  breathPhase?: 'inhale' | 'hold' | 'exhale' | 'hold-empty';
}

interface FlameParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  heat: number; // 0-1, determines color
  turbulence: number;
  angle: number;
  angleVelocity: number;
}

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

export const RealisticFlame: React.FC<RealisticFlameProps> = ({ 
  level, 
  covenant, 
  isBreathing = false,
  breathPhase 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flameParticlesRef = useRef<FlameParticle[]>([]);
  const embersRef = useRef<Ember[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    canvas.width = 500;
    canvas.height = 600;

    const centerX = canvas.width / 2;
    const baseY = canvas.height * 0.75;

    // Get covenant color
    const covenantColor = covenant ? COVENANTS[covenant].glowColor : 'rgba(255, 200, 0, 0.5)';

    // Breathing scale
    let breathScale = 1;
    let breathTarget = 1;
    let breathIntensity = 1;

    if (isBreathing) {
      if (breathPhase === 'inhale') {
        breathTarget = 1.4;
        breathIntensity = 1.3;
      } else if (breathPhase === 'exhale') {
        breathTarget = 0.7;
        breathIntensity = 0.8;
      } else if (breathPhase === 'hold') {
        breathTarget = 1.1;
        breathIntensity = 1.1;
      } else {
        breathTarget = 0.9;
        breathIntensity = 0.9;
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
    }

    // Color gradient based on heat (0 = cool, 1 = hot)
    const getFlameColor = (heat: number, alpha: number = 1): string => {
      if (heat > 0.9) {
        // White-hot core
        return `rgba(255, 255, ${200 + Math.floor(heat * 55)}, ${alpha})`;
      } else if (heat > 0.7) {
        // Bright yellow
        const r = 255;
        const g = 200 + Math.floor((heat - 0.7) * 275);
        const b = Math.floor((1 - heat) * 100);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      } else if (heat > 0.4) {
        // Orange
        const r = 255;
        const g = 100 + Math.floor(heat * 200);
        const b = 0;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      } else if (heat > 0.2) {
        // Deep orange to red
        const r = 255;
        const g = Math.floor(heat * 200);
        const b = Math.floor(heat * 50);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      } else {
        // Deep red with purple hints
        const r = 180 + Math.floor(heat * 375);
        const g = Math.floor(heat * 100);
        const b = Math.floor(heat * 150);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
    };

    // Create flame particle
    const createFlameParticle = (): FlameParticle => {
      const angle = (Math.random() - 0.5) * Math.PI * 0.7;
      const distance = Math.random() * baseSize * 0.4;
      const speed = 0.8 + Math.random() * 2;
      const heightVariation = Math.random() * 0.5;
      
      return {
        x: centerX + Math.cos(angle) * distance,
        y: baseY + Math.sin(angle) * distance * 0.2 - heightVariation * baseSize * 0.3,
        vx: Math.cos(angle) * speed * 0.4,
        vy: (-speed - Math.random() * 2.5) * flameHeight,
        life: 0,
        maxLife: 50 + Math.random() * 90,
        size: 18 + Math.random() * 40,
        heat: 0.4 + Math.random() * 0.6,
        turbulence: (Math.random() * 3 - 1.5) * breathIntensity,
        angle: Math.random() * Math.PI * 2,
        angleVelocity: (Math.random() - 0.5) * 0.15,
      };
    };

    // Create ember
    const createEmber = (): Ember => {
      const angle = (Math.random() - 0.5) * Math.PI * 0.4;
      return {
        x: centerX + (Math.random() - 0.5) * baseSize * 0.8,
        y: baseY - baseSize * breathScale * 0.8,
        vx: Math.sin(angle) * 0.5,
        vy: -1 - Math.random() * 2,
        life: 0,
        maxLife: 100 + Math.random() * 100,
        size: 2 + Math.random() * 4,
        brightness: 0.8 + Math.random() * 0.2,
      };
    };

    let animationId: number;

    const animate = () => {
      timeRef.current += 0.016;
      
      // Smooth breathing transition
      breathScale += (breathTarget - breathScale) * 0.03;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn flame particles
      const spawnRate = particleDensity * breathIntensity;
      for (let i = 0; i < spawnRate; i++) {
        if (Math.random() < 0.3) {
          flameParticlesRef.current.push(createFlameParticle());
        }
      }

      // Spawn embers
      if (Math.random() < emberRate * breathIntensity) {
        embersRef.current.push(createEmber());
      }

      // Draw atmospheric glow
      const glowGradient = ctx.createRadialGradient(
        centerX, baseY - baseSize * breathScale * 0.5, 0,
        centerX, baseY - baseSize * breathScale * 0.5, baseSize * breathScale * 2
      );
      glowGradient.addColorStop(0, `rgba(255, 150, 50, ${0.15 * glowIntensity * breathIntensity})`);
      glowGradient.addColorStop(0.5, `rgba(255, 100, 0, ${0.08 * glowIntensity * breathIntensity})`);
      glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw flame particles (back to front for proper layering)
      flameParticlesRef.current = flameParticlesRef.current.filter(particle => {
        particle.life++;
        
        // Apply complex turbulence with multiple frequencies
        const turbulence1 = Math.sin(timeRef.current * 2 + particle.angle) * particle.turbulence;
        const turbulence2 = Math.cos(timeRef.current * 3.5 + particle.angle * 2) * particle.turbulence * 0.5;
        const turbulence3 = Math.sin(timeRef.current * 1.2 + particle.y * 0.01) * particle.turbulence * 0.3;
        
        particle.x += particle.vx + turbulence1 + turbulence2;
        particle.y += particle.vy * breathScale + turbulence3;
        particle.angle += particle.angleVelocity;
        
        // Slow down as it rises with more realistic physics
        particle.vy *= 0.975;
        particle.vx *= 0.96;
        
        // Heat dissipation - slower at first, faster later
        const lifeRatio = particle.life / particle.maxLife;
        particle.heat *= (lifeRatio < 0.3) ? 0.995 : 0.98;
        
        const alpha = Math.sin(lifeRatio * Math.PI) * (1 - lifeRatio * 0.6);
        
        if (alpha > 0.01) {
          // Draw particle with multiple layers for volumetric effect
          const size = particle.size * breathScale * (1 - lifeRatio * 0.4);
          
          // Far outer glow (atmospheric)
          const atmosphericGradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, size * 2.5
          );
          atmosphericGradient.addColorStop(0, getFlameColor(particle.heat * 0.7, alpha * 0.15));
          atmosphericGradient.addColorStop(0.3, getFlameColor(particle.heat * 0.5, alpha * 0.08));
          atmosphericGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = atmosphericGradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, size * 2.5, 0, Math.PI * 2);
          ctx.fill();
          
          // Outer glow
          const outerGradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, size * 1.5
          );
          outerGradient.addColorStop(0, getFlameColor(particle.heat * 0.85, alpha * 0.4));
          outerGradient.addColorStop(0.5, getFlameColor(particle.heat * 0.65, alpha * 0.2));
          outerGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = outerGradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, size * 1.5, 0, Math.PI * 2);
          ctx.fill();
          
          // Core
          const coreGradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, size
          );
          coreGradient.addColorStop(0, getFlameColor(particle.heat, alpha * 0.95));
          coreGradient.addColorStop(0.3, getFlameColor(particle.heat * 0.95, alpha * 0.8));
          coreGradient.addColorStop(0.7, getFlameColor(particle.heat * 0.75, alpha * 0.4));
          coreGradient.addColorStop(1, getFlameColor(particle.heat * 0.6, alpha * 0.1));
          ctx.fillStyle = coreGradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
          ctx.fill();
          
          // Hot core center (for very hot particles)
          if (particle.heat > 0.8) {
            const hotCoreGradient = ctx.createRadialGradient(
              particle.x, particle.y, 0,
              particle.x, particle.y, size * 0.4
            );
            hotCoreGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.8})`);
            hotCoreGradient.addColorStop(0.5, getFlameColor(particle.heat, alpha * 0.6));
            hotCoreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = hotCoreGradient;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, size * 0.4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        
        return particle.life < particle.maxLife;
      });

      // Draw intense core bloom
      const bloomSize = baseSize * breathScale * 0.6;
      const bloomGradient = ctx.createRadialGradient(
        centerX, baseY - bloomSize * 0.3, 0,
        centerX, baseY - bloomSize * 0.3, bloomSize * 1.5
      );
      bloomGradient.addColorStop(0, `rgba(255, 255, 255, ${0.4 * glowIntensity * breathIntensity})`);
      bloomGradient.addColorStop(0.2, `rgba(255, 240, 200, ${0.3 * glowIntensity * breathIntensity})`);
      bloomGradient.addColorStop(0.5, `rgba(255, 180, 100, ${0.15 * glowIntensity * breathIntensity})`);
      bloomGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bloomGradient;
      ctx.beginPath();
      ctx.arc(centerX, baseY - bloomSize * 0.3, bloomSize * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Update and draw embers
      embersRef.current = embersRef.current.filter(ember => {
        ember.life++;
        ember.x += ember.vx;
        ember.y += ember.vy;
        ember.vy -= 0.02; // Slight upward acceleration
        ember.vx *= 0.99;
        
        const lifeRatio = ember.life / ember.maxLife;
        const alpha = (1 - lifeRatio) * ember.brightness;
        const size = ember.size * (1 - lifeRatio * 0.5);
        
        if (alpha > 0.01) {
          // Ember glow
          const emberGradient = ctx.createRadialGradient(
            ember.x, ember.y, 0,
            ember.x, ember.y, size * 3
          );
          emberGradient.addColorStop(0, `rgba(255, 220, 100, ${alpha * 0.8})`);
          emberGradient.addColorStop(0.5, `rgba(255, 150, 50, ${alpha * 0.4})`);
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

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      flameParticlesRef.current = [];
      embersRef.current = [];
    };
  }, [level, covenant, isBreathing, breathPhase]);

  return (
    <div className="flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        className="max-w-full h-auto"
        style={{ 
          filter: 'blur(0.5px)',
          imageRendering: 'high-quality'
        }}
      />
    </div>
  );
};