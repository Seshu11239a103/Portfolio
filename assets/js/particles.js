/**
 * Seshu Portfolio - AI / ML & Computer Science Neural Background Engine
 * Features:
 * 1. Multi-layer Neural Network graph with Synaptic Action Potential Pulses
 * 2. Floating AI/ML Math Tokens & CS Binary Symbols (ReLU, Softmax, ∇W, KNN, tensors)
 * 3. Self-Attention Cursor Mechanism (Q-K Attention Synapses)
 * 4. Computer Vision (OpenCV) Bounding Box Scanner HUD
 */

class NeuralAIMLBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.neurons = [];
    this.synapticPulses = [];
    this.csTokens = [];
    this.visionScanners = [];
    
    this.neuronCount = 45;
    this.synapseDistance = 140;
    this.mouse = { x: null, y: null, radius: 170 };
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    // AI & Computer Science Symbols to spawn
    this.tokenBank = [
      '01', '10', 'ReLU()', 'Softmax', 'KNN', '∇W', 'f(x)', 'λ', '∂L/∂w', 
      'tensor', 'y = σ(z)', 'OpenCV', 'weights', 'loss(θ)', 'θ_i', '[x,y,z]',
      'matrix', '0x1F', 'CNN', 'async/await', 'sigmoid', '{ }', 'argmax'
    ];

    this.colors = {
      neuron: { r: 99, g: 102, b: 241 },     // Indigo
      neuronAlt: { r: 56, g: 189, b: 248 },  // Cyan / Sky
      neuronActive: { r: 52, g: 211, b: 153 }, // Emerald
      synapse: 'rgba(99, 102, 241, 0.18)',
      pulse: 'rgba(56, 189, 248, 0.95)',
      token: 'rgba(148, 163, 184, 0.28)'
    };

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    this.createNeurons();
    this.createCSTokens();
    this.startPulseGenerator();
    this.startVisionScannerSpawner();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(this.dpr, this.dpr);

    if (this.width < 768) {
      this.neuronCount = 26;
      this.synapseDistance = 100;
    } else {
      this.neuronCount = 48;
      this.synapseDistance = 145;
    }
  }

  createNeurons() {
    this.neurons = [];
    for (let i = 0; i < this.neuronCount; i++) {
      const isInputOrOutput = Math.random() > 0.6;
      this.neurons.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2.2 + 1.5,
        isAlt: Math.random() > 0.5,
        activation: Math.random(),
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        layerTag: isInputOrOutput ? (Math.random() > 0.5 ? 'h₁' : 'h₂') : 'w'
      });
    }
  }

  createCSTokens() {
    this.csTokens = [];
    const count = this.width < 768 ? 12 : 22;
    for (let i = 0; i < count; i++) {
      this.csTokens.push({
        text: this.tokenBank[Math.floor(Math.random() * this.tokenBank.length)],
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vy: -(0.2 + Math.random() * 0.35),
        alpha: 0.12 + Math.random() * 0.18,
        size: Math.random() > 0.5 ? '11px' : '13px'
      });
    }
  }

  startPulseGenerator() {
    // Periodically send action potential pulses along neural pathways
    setInterval(() => {
      if (this.neurons.length < 2 || this.synapticPulses.length > 8) return;

      const idx1 = Math.floor(Math.random() * this.neurons.length);
      const n1 = this.neurons[idx1];

      // Find a nearby connected neuron
      for (let j = 0; j < this.neurons.length; j++) {
        if (j === idx1) continue;
        const n2 = this.neurons[j];
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.synapseDistance) {
          this.synapticPulses.push({
            startX: n1.x,
            startY: n1.y,
            endX: n2.x,
            endY: n2.y,
            progress: 0,
            speed: 0.025 + Math.random() * 0.02,
            color: n1.isAlt ? '#38bdf8' : '#34d399'
          });
          break;
        }
      }
    }, 1200);
  }

  startVisionScannerSpawner() {
    // Computer Vision Bounding Box Reticle Scanner
    setInterval(() => {
      if (this.visionScanners.length < 2 && Math.random() > 0.4) {
        const targetNeuron = this.neurons[Math.floor(Math.random() * this.neurons.length)];
        if (targetNeuron) {
          this.visionScanners.push({
            x: targetNeuron.x - 30,
            y: targetNeuron.y - 25,
            w: 60 + Math.random() * 20,
            h: 50 + Math.random() * 20,
            opacity: 1,
            label: `CV_BOX [${(0.92 + Math.random() * 0.07).toFixed(2)}]`
          });
        }
      }
    }, 4500);
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Floating CS & AI Math Tokens
    this.ctx.font = '500 11px "JetBrains Mono", monospace';
    for (let i = 0; i < this.csTokens.length; i++) {
      const tok = this.csTokens[i];
      tok.y += tok.vy;
      if (tok.y < -30) {
        tok.y = this.height + 20;
        tok.x = Math.random() * this.width;
        tok.text = this.tokenBank[Math.floor(Math.random() * this.tokenBank.length)];
      }
      this.ctx.fillStyle = `rgba(148, 163, 184, ${tok.alpha})`;
      this.ctx.fillText(tok.text, tok.x, tok.y);
    }

    // 2. Draw Synaptic Connections & Neurons
    for (let i = 0; i < this.neurons.length; i++) {
      const n1 = this.neurons[i];

      n1.x += n1.vx;
      n1.y += n1.vy;
      n1.pulsePhase += n1.pulseSpeed;

      if (n1.x < -20) n1.x = this.width + 20;
      if (n1.x > this.width + 20) n1.x = -20;
      if (n1.y < -20) n1.y = this.height + 20;
      if (n1.y > this.height + 20) n1.y = -20;

      // Mouse Attention Mechanism Interaction
      let mouseDist = Infinity;
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - n1.x;
        const dy = this.mouse.y - n1.y;
        mouseDist = Math.sqrt(dx * dx + dy * dy);

        if (mouseDist < this.mouse.radius) {
          const force = (this.mouse.radius - mouseDist) / this.mouse.radius;
          const angle = Math.atan2(dy, dx);
          n1.x -= Math.cos(angle) * force * 1.2;
          n1.y -= Math.sin(angle) * force * 1.2;
        }
      }

      // Draw Synapses to nearby neurons
      for (let j = i + 1; j < this.neurons.length; j++) {
        const n2 = this.neurons[j];
        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.synapseDistance) {
          const alpha = (1 - dist / this.synapseDistance) * 0.22;
          this.ctx.beginPath();
          this.ctx.moveTo(n1.x, n1.y);
          this.ctx.lineTo(n2.x, n2.y);
          this.ctx.strokeStyle = `rgba(${n1.isAlt ? this.colors.neuronAlt.r : this.colors.neuron.r}, ${n1.isAlt ? this.colors.neuronAlt.g : this.colors.neuron.g}, ${n1.isAlt ? this.colors.neuronAlt.b : this.colors.neuron.b}, ${alpha})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }

      // Mouse Query-Key Attention Beam
      if (mouseDist < this.mouse.radius) {
        const attentionWeight = (1 - mouseDist / this.mouse.radius);
        this.ctx.beginPath();
        this.ctx.moveTo(n1.x, n1.y);
        this.ctx.lineTo(this.mouse.x, this.mouse.y);
        this.ctx.strokeStyle = `rgba(56, 189, 248, ${attentionWeight * 0.4})`;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
      }

      // Draw Neuron Body
      const isActivated = mouseDist < this.mouse.radius;
      const radius = n1.radius + Math.sin(n1.pulsePhase) * 0.5;
      const baseCol = isActivated ? this.colors.neuronActive : (n1.isAlt ? this.colors.neuronAlt : this.colors.neuron);

      // Neuron Outer Glow Ring
      this.ctx.beginPath();
      this.ctx.arc(n1.x, n1.y, radius + (isActivated ? 3.5 : 1.5), 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(${baseCol.r}, ${baseCol.g}, ${baseCol.b}, ${isActivated ? 0.6 : 0.25})`;
      this.ctx.lineWidth = 0.8;
      this.ctx.stroke();

      // Neuron Core
      this.ctx.beginPath();
      this.ctx.arc(n1.x, n1.y, Math.max(0.8, radius), 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${baseCol.r}, ${baseCol.g}, ${baseCol.b}, ${isActivated ? 1 : 0.75})`;
      if (isActivated) {
        this.ctx.shadowBlur = 12;
        this.ctx.shadowColor = `rgba(${baseCol.r}, ${baseCol.g}, ${baseCol.b}, 0.8)`;
      }
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }

    // 3. Draw Synaptic Action Potential Pulses (Data Transmission)
    for (let i = this.synapticPulses.length - 1; i >= 0; i--) {
      const p = this.synapticPulses[i];
      p.progress += p.speed;

      if (p.progress >= 1) {
        this.synapticPulses.splice(i, 1);
        continue;
      }

      const currentX = p.startX + (p.endX - p.startX) * p.progress;
      const currentY = p.startY + (p.endY - p.startY) * p.progress;

      this.ctx.beginPath();
      this.ctx.arc(currentX, currentY, 2.4, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = p.color;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }

    // 4. Draw Computer Vision (OpenCV) Scanner HUDs
    for (let i = this.visionScanners.length - 1; i >= 0; i--) {
      const box = this.visionScanners[i];
      box.opacity -= 0.012;

      if (box.opacity <= 0) {
        this.visionScanners.splice(i, 1);
        continue;
      }

      this.ctx.strokeStyle = `rgba(52, 211, 153, ${box.opacity * 0.7})`;
      this.ctx.lineWidth = 1;

      // Draw corner brackets
      const len = 8;
      // TL
      this.ctx.beginPath();
      this.ctx.moveTo(box.x, box.y + len);
      this.ctx.lineTo(box.x, box.y);
      this.ctx.lineTo(box.x + len, box.y);
      this.ctx.stroke();
      // TR
      this.ctx.beginPath();
      this.ctx.moveTo(box.x + box.w - len, box.y);
      this.ctx.lineTo(box.x + box.w, box.y);
      this.ctx.lineTo(box.x + box.w, box.y + len);
      this.ctx.stroke();
      // BL
      this.ctx.beginPath();
      this.ctx.moveTo(box.x, box.y + box.h - len);
      this.ctx.lineTo(box.x, box.y + box.h);
      this.ctx.lineTo(box.x + len, box.y + box.h);
      this.ctx.stroke();
      // BR
      this.ctx.beginPath();
      this.ctx.moveTo(box.x + box.w - len, box.y + box.h);
      this.ctx.lineTo(box.x + box.w, box.y + box.h);
      this.ctx.lineTo(box.x + box.w, box.y + box.h - len);
      this.ctx.stroke();

      // Label
      this.ctx.font = '600 9px "JetBrains Mono", monospace';
      this.ctx.fillStyle = `rgba(52, 211, 153, ${box.opacity * 0.8})`;
      this.ctx.fillText(box.label, box.x, box.y - 4);
    }

    requestAnimationFrame(() => this.animate());
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new NeuralAIMLBackground('particle-canvas');
});
