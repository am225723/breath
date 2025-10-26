import React, { useEffect, useRef } from 'react';

interface DynamicBackgroundProps {
  breathPhase?: 'inhale' | 'hold' | 'exhale' | 'hold-empty';
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ breathPhase }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let opacity = 0.1;
    let targetOpacity = 0.1;

    // Adjust opacity based on breath phase
    if (breathPhase === 'inhale') {
      targetOpacity = 0.3;
    } else if (breathPhase === 'exhale') {
      targetOpacity = 0.05;
    } else {
      targetOpacity = 0.15;
    }

    const particles: BackgroundParticle[] = [];
    const particleCount = 50;

    class BackgroundParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;

      constructor() {
        this.x = canvas ? Math.random() * canvas.width : 0;
        this.y = canvas ? Math.random() * canvas.height : 0;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.size = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (canvas && (this.x < 0 || this.x > canvas.width)) this.vx *= -1;
        if (canvas && (this.y < 0 || this.y > canvas.height)) this.vy *= -1;
      }

      draw(ctx: CanvasRenderingContext2D, alpha: number) {
        ctx.fillStyle = `rgba(255, 200, 0, ${alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new BackgroundParticle());
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth opacity transition
      opacity += (targetOpacity - opacity) * 0.02;

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx, opacity);
      });

      // Draw connections between nearby particles
      ctx.strokeStyle = `rgba(255, 200, 0, ${opacity * 0.3})`;
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [breathPhase]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};