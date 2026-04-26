// Animated particles with blur effects
class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
    this.y = Math.random() * canvas.height;
    this.opacity = Math.random() * 0.5 + 0.3;
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = -20;
    this.size = Math.random() * 4 + 2;
    this.speedY = Math.random() * 1 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.3;
    this.hue = Math.random() * 60 + 180; // Blue-cyan range
    this.blur = Math.random() * 3 + 2;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    
    // Floating effect
    this.x += Math.sin(this.y * 0.01) * 0.3;
    
    if (this.y > this.canvas.height + 20 || this.x < -20 || this.x > this.canvas.width + 20) {
      this.reset();
    }
  }

  draw(ctx) {
    ctx.globalAlpha = this.opacity;
    ctx.shadowBlur = this.blur;
    ctx.shadowColor = `hsla(${this.hue}, 100%, 60%, 0.8)`;
    ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, 0.6)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

class FloatingShape {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
    this.y = Math.random() * canvas.height;
    this.angle = Math.random() * Math.PI * 2;
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.size = Math.random() * 60 + 30;
    this.speedY = Math.random() * 0.3 + 0.1;
    this.speedX = (Math.random() - 0.5) * 0.2;
    this.opacity = Math.random() * 0.15 + 0.05;
    this.hue = Math.random() * 60 + 180;
    this.blur = Math.random() * 20 + 30;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    this.angle = Math.random() * Math.PI * 2;
    this.shape = Math.floor(Math.random() * 3); // 0: circle, 1: square, 2: triangle
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.angle += this.rotationSpeed;
    
    // Smooth floating
    this.x += Math.sin(this.y * 0.005) * 0.5;
    this.y += Math.cos(this.x * 0.005) * 0.3;
    
    if (this.y > this.canvas.height + 100) {
      this.reset();
      this.y = -100;
    }
  }

  draw(ctx) {
    ctx.globalAlpha = this.opacity;
    ctx.shadowBlur = this.blur;
    ctx.shadowColor = `hsla(${this.hue}, 100%, 60%, 0.5)`;
    ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, 0.3)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

class ParticleSystem {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'particle-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '0';
    document.body.insertBefore(this.canvas, document.body.firstChild);
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.shapes = [];
    
    this.resize();
    this.init();
    
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    // Create particles - reduced count
    const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 20000);
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new Particle(this.canvas));
    }
    
    // Create floating shapes - reduced count
    const shapeCount = Math.floor((this.canvas.width * this.canvas.height) / 100000);
    for (let i = 0; i < shapeCount; i++) {
      this.shapes.push(new FloatingShape(this.canvas));
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw shapes first (background layer)
    this.shapes.forEach(shape => {
      shape.update();
      shape.draw(this.ctx);
    });
    
    // Draw particles on top
    this.particles.forEach(particle => {
      particle.update();
      particle.draw(this.ctx);
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize particle system when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const particleSystem = new ParticleSystem();
    particleSystem.animate();
  });
} else {
  const particleSystem = new ParticleSystem();
  particleSystem.animate();
}
