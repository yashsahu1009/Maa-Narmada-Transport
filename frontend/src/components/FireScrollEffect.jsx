import React, { useEffect, useRef, useState } from 'react';

export default function FireScrollEffect() {
  const canvasRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Array of glowing fire ember particles
    const particles = [];
    const maxParticles = 60;

    // Fiery color palette
    const colors = [
      { r: 255, g: 69, b: 0 },    // #ff4500 Flame Orange
      { r: 255, g: 140, b: 0 },   // #ff8c00 Amber Gold
      { r: 255, g: 215, b: 0 },   // #ffd700 Golden Yellow
      { r: 255, g: 34, b: 0 },    // #ff2200 Crimson Flame
      { r: 255, g: 234, b: 0 }    // #ffea00 Bright Fire Tip
    ];

    const createParticle = (x, y, isTouch = false) => {
      const colorObj = colors[Math.floor(Math.random() * colors.length)];
      return {
        x: x ?? (window.innerWidth - 12 + (Math.random() * 8 - 4)),
        y: y ?? (Math.random() * window.innerHeight),
        vx: (Math.random() - 0.5) * (isTouch ? 2.5 : 1.2),
        vy: -(Math.random() * 2 + 1), // Rise upward like fire smoke/embers
        size: Math.random() * (isTouch ? 3.5 : 2.5) + 1,
        alpha: 1,
        decay: Math.random() * 0.03 + 0.015,
        color: colorObj,
        flicker: Math.random() * 0.2
      };
    };

    const spawnEmbers = (x, y, count = 3, isTouch = false) => {
      for (let i = 0; i < count; i++) {
        if (particles.length < maxParticles) {
          particles.push(createParticle(x, y, isTouch));
        }
      }
    };

    // Scroll progress calculator & ember trigger
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(currentProgress);
      }

      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 800);

      // Spawn fiery embers along the right scrollbar edge and current scroll position
      const scrollY = window.scrollY;
      const viewH = window.innerHeight;
      const scrollRatio = totalHeight > 0 ? scrollY / totalHeight : 0;
      const scrollThumbY = scrollRatio * (viewH - 60) + 30;

      // Embers at scrollbar thumb position
      spawnEmbers(window.innerWidth - 10, scrollThumbY, 4, false);
    };

    // Touch Move / Touch Start listener for mobile scroll fire effect
    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const touch = e.touches[0];
        spawnEmbers(touch.clientX, touch.clientY, 3, true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });

    // Render loop for fire ember canvas
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y < 0) {
          particles.splice(i, 1);
          continue;
        }

        // Draw fiery glowing ember particle
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        const currentAlpha = Math.max(0, p.alpha + (Math.random() * p.flicker - p.flicker / 2));
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentAlpha})`;
        ctx.shadowColor = `rgb(${p.color.r}, ${p.color.g}, ${p.color.b})`;
        ctx.shadowBlur = p.size * 4;

        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Fiery Scroll Progress Bar at top of screen */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 pointer-events-none bg-slate-900/30">
        <div
          className="h-full bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400 shadow-[0_0_12px_#ff4500,0_0_20px_#ffd700] transition-all duration-150 ease-out relative"
          style={{ width: `${scrollProgress}%` }}
        >
          {/* Flame tip light */}
          {scrollProgress > 0 && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-yellow-300 shadow-[0_0_15px_#ff4500,0_0_25px_#ffd700] animate-pulse" />
          )}
        </div>
      </div>

      {/* Interactive Fire Embers Floating Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      />
    </>
  );
}
