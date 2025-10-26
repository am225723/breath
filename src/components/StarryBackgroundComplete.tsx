import React, { useEffect, useRef } from 'react';

/**
 * StarryBackground Component
 * 
 * Creates an atmospheric deep space background with twinkling stars.
 * This component is fully self-contained and requires no props.
 * 
 * Features:
 * - 200 randomly distributed stars
 * - Twinkling animation using sine waves
 * - Deep space gradient background
 * - Responsive to window resize
 * - Performance optimized with static star positions
 */

interface Star {
  x: number;              // X position on canvas
  y: number;              // Y position on canvas
  size: number;           // Star size (0.5-2 pixels)
  brightness: number;     // Base brightness (0.3-1.0)
  twinkleSpeed: number;   // Speed of twinkle animation
  twinkleOffset: number;  // Phase offset for variation
}

export const StarryBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number | undefined>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) return;

    /**
     * Initialize canvas size to match window dimensions
     * This ensures the starry background covers the entire viewport
     */
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Reinitialize stars on resize if they haven't been created yet
      if (starsRef.current.length === 0) {
        initStars();
      }
    };

    /**
     * Initialize star positions and properties
     * Creates 200 stars with random positions and characteristics
     */
    const initStars = () => {
      starsRef.current = [];
      const starCount = 200;

      for (let i = 0; i < starCount; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 0.5 + Math.random() * 1.5,           // Stars vary from 0.5 to 2 pixels
          brightness: 0.3 + Math.random() * 0.7,     // Brightness varies from 0.3 to 1.0
          twinkleSpeed: 0.5 + Math.random() * 1.5,   // Different twinkle speeds for variation
          twinkleOffset: Math.random() * Math.PI * 2 // Random phase offset
        });
      }
    };

    // Set up canvas and initialize stars
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let time = 0;

    /**
     * Main animation loop
     * Renders the deep space background and twinkling stars
     */
    const animate = () => {
      time += 0.016; // ~60fps time step

      // Create deep space gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.8
      );
      gradient.addColorStop(0, 'rgba(10, 5, 20, 1)');   // Deep purple-black center
      gradient.addColorStop(1, 'rgba(5, 0, 15, 1)');    // Even darker edges
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars with twinkling effect
      starsRef.current.forEach(star => {
        // Calculate twinkle using sine wave
        // This creates a smooth pulsing effect for each star
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
        const alpha = star.brightness * twinkle;
        
        // Draw star glow (3x size for soft appearance)
        const glowGradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 3
        );
        glowGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.5})`);
        glowGradient.addColorStop(0.5, `rgba(200, 200, 255, ${alpha * 0.3})`);
        glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw star core (full brightness)
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ 
        zIndex: -1, // Ensure background stays behind other content
        pointerEvents: 'none' // Allow clicks to pass through
      }}
    />
  );
};