import { useEffect, useRef } from 'react';

export default function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    const particleCount = 250;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
      x: number = 0;
      y: number = 0;
      z: number = 0;
      size: number = 0;
      opacity: number = 0;
      color: string = '';
      speedX: number = 0;
      speedY: number = 0;

      constructor() {
        this.init();
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
      }

      init() {
        this.z = Math.random() * 2 + 0.1; // Parallax depth
        this.size = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;
        
        // Mix of white, light blue, and light gold stars
        const colors = ['255, 255, 255', '200, 220, 255', '255, 240, 200', '242, 208, 107'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      draw(offsetX: number, offsetY: number, time: number) {
        this.x += this.speedX;
        this.y += this.speedY;

        // Add slow drift based on time
        const driftX = Math.sin(time * 0.0005 + this.z) * 10;
        const driftY = Math.cos(time * 0.0005 + this.z) * 10;

        const px = this.x + offsetX * this.z * 0.05 + driftX;
        const py = this.y + offsetY * this.z * 0.05 + driftY;

        const wrappedX = (px % canvas!.width + canvas!.width) % canvas!.width;
        const wrappedY = (py % canvas!.height + canvas!.height) % canvas!.height;

        // Twinkle effect
        const currentOpacity = this.opacity * (0.5 + 0.5 * Math.sin(time * 0.002 + this.x));

        ctx!.fillStyle = `rgba(${this.color}, ${currentOpacity})`;
        ctx!.beginPath();
        ctx!.arc(wrappedX, wrappedY, this.size, 0, Math.PI * 2);
        ctx!.fill();
        
        if (this.size > 1.5) {
          ctx!.shadowBlur = 10;
          ctx!.shadowColor = `rgba(${this.color}, 0.8)`;
        } else {
          ctx!.shadowBlur = 0;
        }
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX - canvas!.width / 2;
      targetMouseY = e.clientY - canvas!.height / 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    const animate = (time: number) => {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      particles.forEach(p => {
        p.draw(currentMouseX, currentMouseY, time);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#050508]">
      {/* Galaxy gradient overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(242,208,107,0.15)_0%,_transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(200,220,255,0.1)_0%,_transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_0%,_transparent_60%)]"></div>
      <canvas ref={canvasRef} className="w-full h-full opacity-100" />
    </div>
  );
}
