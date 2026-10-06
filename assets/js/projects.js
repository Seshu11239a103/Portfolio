/**
 * Seshu Portfolio - Flagship Projects Interactive Simulators
 * 1. LifeLink: Real-time Blood Matching & Emergency Dispatch Simulator
 * 2. FaceRecog AI: Biometric Landmark Scanner, KNN Distance Engine & CSV Logger
 */

// ==========================================
// 1. LifeLink Interactive Simulation
// ==========================================
class LifeLinkSimulator {
  constructor() {
    this.compatibilityData = {
      'O-': ['O-'],
      'O+': ['O-', 'O+'],
      'A-': ['O-', 'A-'],
      'A+': ['O-', 'O+', 'A-', 'A+'],
      'B-': ['O-', 'B-'],
      'B+': ['O-', 'O+', 'B-', 'B+'],
      'AB-': ['O-', 'A-', 'B-', 'AB-'],
      'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
    };

    this.mockDonors = [
      { name: "Rahul S.", blood: "O-", dist: "1.2 km", status: "Available", time: "Ready Now" },
      { name: "Priya V.", blood: "A+", dist: "2.4 km", status: "Available", time: "5 mins away" },
      { name: "Karthik M.", blood: "B+", dist: "3.1 km", status: "En Route", time: "10 mins away" },
      { name: "Ananya D.", blood: "O+", dist: "0.8 km", status: "Available", time: "Ready Now" },
      { name: "Vikram R.", blood: "AB+", dist: "4.5 km", status: "Available", time: "15 mins away" }
    ];

    this.selectedBlood = 'A+';
    this.init();
  }

  init() {
    const bloodPills = document.querySelectorAll('.blood-pill');
    bloodPills.forEach(pill => {
      pill.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.tab();
        bloodPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.selectedBlood = pill.getAttribute('data-blood');
        this.updateCompatibility();
      });
    });

    const broadcastBtn = document.getElementById('lifelink-broadcast-btn');
    if (broadcastBtn) {
      broadcastBtn.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.success();
        this.triggerEmergencyBroadcast();
      });
    }

    this.updateCompatibility();
  }

  updateCompatibility() {
    const compatibleList = this.compatibilityData[this.selectedBlood] || [];
    const donorBadges = document.querySelectorAll('.donor-type-badge');
    
    donorBadges.forEach(badge => {
      const type = badge.getAttribute('data-type');
      if (compatibleList.includes(type)) {
        badge.classList.add('compatible');
        badge.classList.remove('incompatible');
      } else {
        badge.classList.remove('compatible');
        badge.classList.add('incompatible');
      }
    });

    const infoElem = document.getElementById('lifelink-compat-info');
    if (infoElem) {
      infoElem.innerHTML = `Recipient <strong>${this.selectedBlood}</strong> can safely receive red blood cells from: <span class="text-cyan font-bold">${compatibleList.join(', ')}</span>`;
    }

    this.renderDonors(compatibleList);
  }

  renderDonors(compatibleList) {
    const listContainer = document.getElementById('lifelink-donor-list');
    if (!listContainer) return;

    const filtered = this.mockDonors.filter(d => compatibleList.includes(d.blood));
    
    if (filtered.length === 0) {
      listContainer.innerHTML = `<div class="p-3 text-muted text-center">Searching wider 10km GPS radius...</div>`;
      return;
    }

    listContainer.innerHTML = filtered.map(d => `
      <div class="donor-item-card flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="donor-blood-tag">${d.blood}</div>
          <div>
            <div class="font-bold text-white">${d.name}</div>
            <div class="text-xs text-muted">📍 ${d.dist} • ⏱️ ${d.time}</div>
          </div>
        </div>
        <button class="btn-micro-contact" onclick="window.soundEngine && window.soundEngine.click(); alert('Emergency SMS & Real-time Route Alert Dispatched to ${d.name} (${d.blood})!');">
          Ping Donor
        </button>
      </div>
    `).join('');
  }

  triggerEmergencyBroadcast() {
    const statusElem = document.getElementById('lifelink-broadcast-status');
    if (!statusElem) return;

    statusElem.innerHTML = `
      <div class="alert-broadcast">
        <div class="pulse-dot"></div>
        <div>
          <div class="font-bold text-cyan">⚡ EMERGENCY BROADCAST ACTIVE!</div>
          <div class="text-xs text-muted">Scanning 5km radius for ${this.selectedBlood} donors... 3 hospitals alerted.</div>
        </div>
      </div>
    `;

    setTimeout(() => {
      statusElem.innerHTML = `
        <div class="alert-broadcast-success">
          ✔ <strong>2 Donors Confirmed!</strong> Rahul S. (1.2km) and Priya V. (2.4km) are responding.
        </div>
      `;
    }, 2200);
  }
}

// ==========================================
// 2. FaceRecog AI Biometric & Attendance Engine
// ==========================================
class FaceRecogSimulator {
  constructor() {
    this.canvas = document.getElementById('face-recog-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.scanBtn = document.getElementById('face-scan-trigger-btn');
    this.exportBtn = document.getElementById('export-attendance-csv');
    this.cameraToggleBtn = document.getElementById('toggle-webcam-btn');
    this.videoElem = document.getElementById('face-recog-video');
    this.isScanning = false;
    this.isWebcamActive = false;
    this.stream = null;

    this.attendanceLogs = [
      { id: "SCSVMV-101", name: "Seshu Kumar", dept: "AI & ML", time: "09:00:14", match: "99.4%", status: "VERIFIED" },
      { id: "SCSVMV-102", name: "Aarav Sharma", dept: "CSE", time: "09:02:45", match: "98.1%", status: "VERIFIED" },
      { id: "SCSVMV-103", name: "Meera Patel", dept: "Data Science", time: "09:05:12", match: "97.8%", status: "VERIFIED" }
    ];

    this.mockCandidates = [
      { id: "SCSVMV-104", name: "Rohan Varma", dept: "AI & ML", match: "98.9%" },
      { id: "SCSVMV-105", name: "Sneha Reddy", dept: "Cyber Security", match: "99.2%" },
      { id: "SCSVMV-106", name: "Aditya Nair", dept: "AI & ML", match: "97.5%" },
      { id: "SCSVMV-107", name: "Seshu Kumar", dept: "AI & ML", match: "99.8%" }
    ];

    this.scanLineY = 0;
    this.scanDirection = 1;
    this.animId = null;

    this.init();
  }

  init() {
    if (this.scanBtn) {
      this.scanBtn.addEventListener('click', () => {
        if (window.soundEngine) {
          window.soundEngine.click();
          window.soundEngine.scan();
        }
        this.runBiometricScan();
      });
    }

    if (this.exportBtn) {
      this.exportBtn.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.success();
        this.downloadCSV();
      });
    }

    if (this.cameraToggleBtn) {
      this.cameraToggleBtn.addEventListener('click', () => {
        this.toggleWebcam();
      });
    }

    this.renderLogs();
    this.drawMeshAnimation();
  }

  toggleWebcam() {
    if (this.isWebcamActive) {
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
      }
      if (this.videoElem) this.videoElem.style.display = 'none';
      this.isWebcamActive = false;
      this.cameraToggleBtn.innerHTML = '📷 Enable Live Camera';
    } else {
      navigator.mediaDevices?.getUserMedia({ video: { width: 480, height: 360 } })
        .then(stream => {
          this.stream = stream;
          if (this.videoElem) {
            this.videoElem.srcObject = stream;
            this.videoElem.play();
            this.videoElem.style.display = 'block';
          }
          this.isWebcamActive = true;
          this.cameraToggleBtn.innerHTML = '🛑 Stop Live Camera';
        })
        .catch(err => {
          alert('Webcam access was denied or not supported. Using high-tech AI Synthetic Face Simulation mode!');
        });
    }
  }

  drawMeshAnimation() {
    if (!this.canvas || !this.ctx) return;
    const w = this.canvas.width = 440;
    const h = this.canvas.height = 300;

    const render = () => {
      this.ctx.clearRect(0, 0, w, h);

      // Draw futuristic cyber HUD grid
      this.ctx.strokeStyle = 'rgba(0, 245, 212, 0.15)';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(40, 30, w - 80, h - 60);

      // Corner brackets
      this.drawCornerBrackets(40, 30, w - 80, h - 60);

      // Face landmark points mesh simulation
      const cx = w / 2;
      const cy = h / 2 - 10;
      const landmarks = [
        // Face outline
        {x: cx - 60, y: cy - 40}, {x: cx - 75, y: cy}, {x: cx - 60, y: cy + 45}, {x: cx, y: cy + 75}, {x: cx + 60, y: cy + 45}, {x: cx + 75, y: cy}, {x: cx + 60, y: cy - 40},
        // Eyebrows & Eyes
        {x: cx - 35, y: cy - 25}, {x: cx - 15, y: cy - 25}, {x: cx + 15, y: cy - 25}, {x: cx + 35, y: cy - 25},
        {x: cx - 25, y: cy - 15}, {x: cx + 25, y: cy - 15},
        // Nose
        {x: cx, y: cy - 10}, {x: cx, y: cy + 5}, {x: cx - 10, y: cy + 15}, {x: cx + 10, y: cy + 15},
        // Mouth
        {x: cx - 25, y: cy + 35}, {x: cx, y: cy + 30}, {x: cx + 25, y: cy + 35}, {x: cx, y: cy + 45}
      ];

      // Draw mesh lines
      this.ctx.strokeStyle = this.isScanning ? 'rgba(0, 245, 212, 0.7)' : 'rgba(0, 245, 212, 0.35)';
      this.ctx.lineWidth = 1.2;
      this.ctx.beginPath();
      for (let i = 0; i < landmarks.length - 1; i++) {
        this.ctx.moveTo(landmarks[i].x, landmarks[i].y);
        this.ctx.lineTo(landmarks[i + 1].x, landmarks[i + 1].y);
      }
      this.ctx.stroke();

      // Draw points
      landmarks.forEach((p, index) => {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, this.isScanning ? 3.5 : 2.5, 0, Math.PI * 2);
        this.ctx.fillStyle = index % 2 === 0 ? '#00f5d4' : '#9b5de5';
        this.ctx.shadowBlur = this.isScanning ? 10 : 4;
        this.ctx.shadowColor = '#00f5d4';
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
      });

      // Animated Scanline when scanning
      if (this.isScanning) {
        this.scanLineY += 3 * this.scanDirection;
        if (this.scanLineY > h - 40 || this.scanLineY < 40) {
          this.scanDirection *= -1;
        }

        // Draw scan beam
        const grad = this.ctx.createLinearGradient(0, this.scanLineY - 20, 0, this.scanLineY + 20);
        grad.addColorStop(0, 'rgba(0, 245, 212, 0)');
        grad.addColorStop(0.5, 'rgba(0, 245, 212, 0.85)');
        grad.addColorStop(1, 'rgba(0, 245, 212, 0)');
        
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(40, this.scanLineY - 15, w - 80, 30);

        this.ctx.strokeStyle = '#00f5d4';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(40, this.scanLineY);
        this.ctx.lineTo(w - 40, this.scanLineY);
        this.ctx.stroke();
      }

      this.animId = requestAnimationFrame(render);
    };

    render();
  }

  drawCornerBrackets(x, y, w, h) {
    const len = 15;
    this.ctx.strokeStyle = '#00f5d4';
    this.ctx.lineWidth = 2.5;

    // Top Left
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + len);
    this.ctx.lineTo(x, y);
    this.ctx.lineTo(x + len, y);
    this.ctx.stroke();

    // Top Right
    this.ctx.beginPath();
    this.ctx.moveTo(x + w - len, y);
    this.ctx.lineTo(x + w, y);
    this.ctx.lineTo(x + w, y + len);
    this.ctx.stroke();

    // Bottom Left
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + h - len);
    this.ctx.lineTo(x, y + h);
    this.ctx.lineTo(x + len, y + h);
    this.ctx.stroke();

    // Bottom Right
    this.ctx.beginPath();
    this.ctx.moveTo(x + w - len, y + h);
    this.ctx.lineTo(x + w, y + h);
    this.ctx.lineTo(x + w, y + h - len);
    this.ctx.stroke();
  }

  runBiometricScan() {
    if (this.isScanning) return;
    this.isScanning = true;
    this.scanLineY = 45;

    const statusElem = document.getElementById('face-scan-status-pill');
    const knnDistElem = document.getElementById('face-knn-distance');
    const matchElem = document.getElementById('face-match-score');
    
    if (statusElem) statusElem.innerHTML = '<span class="status-scanning">SCANNING BIOMETRICS (KNN)...</span>';
    if (knnDistElem) knnDistElem.innerText = 'Calculating Euclidean Distance...';

    setTimeout(() => {
      this.isScanning = false;
      const candidate = this.mockCandidates[Math.floor(Math.random() * this.mockCandidates.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const dist = (0.08 + Math.random() * 0.12).toFixed(3);

      if (statusElem) statusElem.innerHTML = `<span class="status-verified">✔ IDENTIFIED: ${candidate.name}</span>`;
      if (knnDistElem) knnDistElem.innerText = `KNN Distance: ${dist} (Threshold < 0.25)`;
      if (matchElem) matchElem.innerText = candidate.match;

      // Add to attendance log
      this.attendanceLogs.unshift({
        id: candidate.id,
        name: candidate.name,
        dept: candidate.dept,
        time: timeStr,
        match: candidate.match,
        status: "VERIFIED"
      });

      this.renderLogs();
      if (window.soundEngine) window.soundEngine.success();
    }, 1800);
  }

  renderLogs() {
    const tableBody = document.getElementById('attendance-log-tbody');
    if (!tableBody) return;

    tableBody.innerHTML = this.attendanceLogs.map(log => `
      <tr class="log-row">
        <td><span class="code-tag">${log.id}</span></td>
        <td class="font-bold text-white">${log.name}</td>
        <td class="text-muted">${log.dept}</td>
        <td class="font-mono text-cyan">${log.time}</td>
        <td><span class="text-yellow font-bold">${log.match}</span></td>
        <td><span class="badge-verified">${log.status}</span></td>
      </tr>
    `).join('');
  }

  downloadCSV() {
    let csv = "ID,Name,Department,Timestamp,MatchConfidence,Status\n";
    this.attendanceLogs.forEach(row => {
      csv += `${row.id},"${row.name}","${row.dept}",${row.time},${row.match},${row.status}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `FaceRecog_Attendance_Log_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.lifeLinkSim = new LifeLinkSimulator();
  window.faceRecogSim = new FaceRecogSimulator();
});
