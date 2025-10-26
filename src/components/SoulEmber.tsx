import React, { useEffect, useRef } from 'react';
import type { BonfireLevel, CovenantType } from '../types';
import { COVENANTS } from '../data/covenants';

interface SoulEmberProps {
  level: BonfireLevel;
  covenant?: CovenantType;
  isBreathing?: boolean;
  breathPhase?: 'inhale' | 'hold' | 'exhale' | 'hold-empty';
}

export const SoulEmber: React.FC<SoulEmberProps> = ({ 
  level, 
  covenant, 
  isBreathing = false,
  breathPhase 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    const particles: Particle[] = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Get covenant color
    const covenantColor = covenant ? COVENANTS[covenant].glowColor : 'rgba(255, 200, 0, 0.5)';

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      color: string;

      constructor() {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.5 + 0.2;
        this.x = centerX;
        this.y = centerY;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - Math.random() * 1.5;
        this.life = 0;
        this.maxLife = Math.random() * 100 + 50;
        this.size = Math.random() * 3 + 1;
        
        // Color based on level
        if (level === 'first-flame') {
          this.color = Math.random() > 0.5 ? '#fff9e6' : '#ffd31a';
        } else if (level === 'roaring') {
          this.color = Math.random() > 0.5 ? '#ffc800' : '#ff9f00';
        } else if (level === 'steady-flame') {
          this.color = Math.random() > 0.5 ? '#ffb11a' : '#ffc800';
        } else {
          this.color = Math.random() > 0.5 ? '#ff9f00' : '#cc7f00';
        }
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;
        this.vy -= 0.02; // Gravity upward
      }

      draw(ctx: CanvasRenderingContext2D) {
        const alpha = 1 - this.life / this.maxLife;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      isDead() {
        return this.life >= this.maxLife;
      }
    }

    let animationId: number;
    let particleSpawnRate = 2;

    // Adjust spawn rate based on level
    if (level === 'first-flame') particleSpawnRate = 5;
    else if (level === 'roaring') particleSpawnRate = 4;
    else if (level === 'steady-flame') particleSpawnRate = 3;

    // Breathing effect
    let breathScale = 1;
    let breathTarget = 1;
    
    if (isBreathing) {
      if (breathPhase === 'inhale') breathTarget = 1.3;
      else if (breathPhase === 'exhale') breathTarget = 0.8;
      else breathTarget = 1;
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth breathing transition
      breathScale += (breathTarget - breathScale) * 0.05;

      // Spawn new particles
      for (let i = 0; i < particleSpawnRate; i++) {
        particles.push(new Particle());
      }

      // Update and draw particles
      ctx.globalAlpha = 1;
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw(ctx);
        if (particles[i].isDead()) {
          particles.splice(i, 1);
        }
      }

      // Draw core ember
      ctx.globalAlpha = 1;
      const coreSize = 30 * breathScale;
      
      // Outer glow
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreSize * 3);
      gradient.addColorStop(0, covenantColor);
      gradient.addColorStop(0.5, 'rgba(255, 159, 0, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreSize * 3, 0, Math.PI * 2);
      ctx.fill();

      // Core
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreSize);
      if (level === 'first-flame') {
        coreGradient.addColorStop(0, '#ffffff');
        coreGradient.addColorStop(0.5, '#fff9e6');
        coreGradient.addColorStop(1, '#ffd31a');
      } else if (level === 'roaring') {
        coreGradient.addColorStop(0, '#fff0b3');
        coreGradient.addColorStop(0.5, '#ffc800');
        coreGradient.addColorStop(1, '#ff9f00');
      } else if (level === 'steady-flame') {
        coreGradient.addColorStop(0, '#ffe680');
        coreGradient.addColorStop(0.5, '#ffc800');
        coreGradient.addColorStop(1, '#e6b400');
      } else {
        coreGradient.addColorStop(0, '#ffb11a');
        coreGradient.addColorStop(0.5, '#ff9f00');
        coreGradient.addColorStop(1, '#cc7f00');
      }
      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreSize, 0, Math.PI * 2);
      ctx.fill();

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [level, covenant, isBreathing, breathPhase]);

  return (
    <div className="flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        className="max-w-full h-auto"
        style={{ filter: 'blur(0.5px)' }}
      />
    </div>
  );
};