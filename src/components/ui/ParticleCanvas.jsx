import React, { useEffect, useRef } from "react";

export const ParticleCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    let mouse = { x: null, y: null, radius: 125 };

    // Handle high DPI retina screens
    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      init();
    };

    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    const handleMouseMove = (e) => {
      if (isTouchDevice) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    // Listeners
    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Dynamic color fetching from document element styles
    const getColors = () => {
      const isDark = document.documentElement.classList.contains("dark");
      return {
        particle: isDark ? "rgba(59, 130, 246, 0.45)" : "rgba(37, 99, 235, 0.25)", // Blue accent
        line: isDark ? "rgba(139, 92, 246, 0.08)" : "rgba(99, 102, 241, 0.05)", // Indigo / Violet
      };
    };

    let colors = getColors();

    // Listen to theme mutations to update colors instantly
    const observer = new MutationObserver(() => {
      colors = getColors();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    class Particle {
      constructor(width, height) {
        this.width = width;
        this.height = height;
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.baseRadius = Math.random() * 1.5 + 1;
        this.radius = this.baseRadius;
      }

      update() {
        // Drift movement
        this.x += this.vx;
        this.y += this.vy;

        // Bounce boundaries
        if (this.x < 0 || this.x > this.width) this.vx *= -1;
        if (this.y < 0 || this.y > this.height) this.vy *= -1;

        // Mouse interaction (gentle repulsion)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            // Push away
            this.x += (dx / dist) * force * 1.25;
            this.y += (dy / dist) * force * 1.25;
            // Slightly grow particle size on cursor focus
            this.radius = this.baseRadius + force * 1.5;
          } else {
            // Smoothly return to base size
            if (this.radius > this.baseRadius) {
              this.radius -= 0.05;
            }
          }
        } else {
          if (this.radius > this.baseRadius) {
            this.radius -= 0.05;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = colors.particle;
        ctx.fill();
      }
    }

    const init = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      // Cap particle counts to protect performance on ultra-wide viewports
      const numParticles = Math.min(Math.floor((rect.width * rect.height) / 14000), 80);
      particles = [];
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(rect.width, rect.height));
      }
    };

    const drawLines = () => {
      const maxDistance = 115;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            // Draw connection line
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = colors.line;
            ctx.lineWidth = (1 - dist / maxDistance) * 0.8;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      if (!canvasRef.current) return;
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      drawLines();

      animationFrameId = requestAnimationFrame(animate);
    };

    // Initial setup
    handleResize();
    animate();

    // Cleanups
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto opacity-75 dark:opacity-40"
      aria-hidden="true"
    />
  );
};
