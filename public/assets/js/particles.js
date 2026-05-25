/**
 * NEXUS Particle Network — Animated background canvas
 * Floating nodes connected by glowing lines, theme-aware
 */
const particleCanvas = (() => {
    let canvas, ctx, particles = [], animId, w, h;
    const PARTICLE_COUNT = 80;
    const CONNECT_DIST = 140;
    const MOUSE_RADIUS = 180;
    let mouse = { x: -1000, y: -1000 };

    function getAccentColor() {
        const body = document.body;
        if (body.classList.contains('theme-red')) return { r: 255, g: 0, b: 60 };
        if (body.classList.contains('theme-green')) return { r: 0, g: 255, b: 102 };
        return { r: 0, g: 243, b: 255 }; // cyan default
    }

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() * 2 + 1;
            this.pulse = Math.random() * Math.PI * 2;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.pulse += 0.02;
            if (this.x < 0 || this.x > w) this.vx *= -1;
            if (this.y < 0 || this.y > h) this.vy *= -1;

            // Gentle mouse repulsion
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MOUSE_RADIUS) {
                const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.02;
                this.vx += dx / dist * force;
                this.vy += dy / dist * force;
            }

            // Speed limit
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > 1.2) { this.vx *= 0.98; this.vy *= 0.98; }
        }
        draw(accent) {
            const glow = 0.5 + Math.sin(this.pulse) * 0.3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${accent.r},${accent.g},${accent.b},${glow})`;
            ctx.shadowColor = `rgba(${accent.r},${accent.g},${accent.b},0.6)`;
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function drawConnections(accent) {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECT_DIST) {
                    const alpha = (1 - dist / CONNECT_DIST) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${accent.r},${accent.g},${accent.b},${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        const accent = getAccentColor();
        particles.forEach(p => { p.update(); p.draw(accent); });
        drawConnections(accent);
        animId = requestAnimationFrame(animate);
    }

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    function init() {
        canvas = document.getElementById('particle-canvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        resize();
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
        window.addEventListener('resize', () => {
            resize();
            particles.forEach(p => {
                if (p.x > w) p.x = w - 10;
                if (p.y > h) p.y = h - 10;
            });
        });
        document.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
        document.addEventListener('mouseleave', () => { mouse.x = -1000; mouse.y = -1000; });
        animate();
    }

    return { init };
})();

document.addEventListener('DOMContentLoaded', () => particleCanvas.init());
