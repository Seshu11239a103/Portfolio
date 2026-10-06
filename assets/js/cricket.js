/**
 * Seshu Portfolio - Interactive Cricket Batting Mini-Game
 * Demonstrates sportsmanship, quick reflexes, and teamwork spirit!
 */

class CricketGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.scoreElem = document.getElementById('cricket-score');
    this.highScoreElem = document.getElementById('cricket-high-score');
    this.feedbackElem = document.getElementById('cricket-feedback');
    this.bowlBtn = document.getElementById('cricket-bowl-btn');
    this.swingBtn = document.getElementById('cricket-swing-btn');

    this.score = 0;
    this.ballsBowled = 0;
    this.maxBalls = 6; // 1 Over challenge
    this.highScore = parseInt(localStorage.getItem('seshu_cricket_high') || '0', 10);
    if (this.highScoreElem) this.highScoreElem.innerText = this.highScore;

    this.state = 'IDLE'; // IDLE, BOWLING, HIT, MISSED, OVER_COMPLETE
    this.ball = { x: 0, y: 0, vx: 0, vy: 0, radius: 8, active: false };
    this.bat = { x: 380, y: 140, angle: 0, isSwinging: false };
    this.animId = null;

    this.init();
  }

  init() {
    this.canvas.width = 460;
    this.canvas.height = 200;

    if (this.bowlBtn) {
      this.bowlBtn.addEventListener('click', () => this.bowlBall());
    }
    if (this.swingBtn) {
      this.swingBtn.addEventListener('click', () => this.swingBat());
    }

    // Canvas click also swings bat
    this.canvas.addEventListener('click', () => {
      if (this.state === 'BOWLING') {
        this.swingBat();
      } else if (this.state === 'IDLE' || this.state === 'OVER_COMPLETE') {
        this.bowlBall();
      }
    });

    this.drawPitch();
  }

  drawPitch() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.ctx.clearRect(0, 0, w, h);

    // Green turf background
    this.ctx.fillStyle = '#0f241a';
    this.ctx.fillRect(0, 0, w, h);

    // Pitch strip
    this.ctx.fillStyle = '#223828';
    this.ctx.fillRect(30, 70, w - 60, 60);

    // Crease lines
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    this.ctx.lineWidth = 2;
    // Bowling crease
    this.ctx.beginPath();
    this.ctx.moveTo(60, 60);
    this.ctx.lineTo(60, 140);
    this.ctx.stroke();

    // Batting crease
    this.ctx.beginPath();
    this.ctx.moveTo(370, 60);
    this.ctx.lineTo(370, 140);
    this.ctx.stroke();

    // Stumps (Batting end)
    this.ctx.fillStyle = '#fbbf24';
    this.ctx.fillRect(385, 80, 4, 40);
    this.ctx.fillRect(389, 80, 4, 40);
    this.ctx.fillRect(393, 80, 4, 40);

    // Stumps (Bowling end)
    this.ctx.fillRect(45, 80, 4, 40);
    this.ctx.fillRect(49, 80, 4, 40);
    this.ctx.fillRect(53, 80, 4, 40);

    // Batsman indicator
    this.ctx.fillStyle = '#00f5d4';
    this.ctx.beginPath();
    this.ctx.arc(360, 75, 10, 0, Math.PI * 2);
    this.ctx.fill();

    // Bat
    this.ctx.save();
    this.ctx.translate(365, 85);
    this.ctx.rotate(this.bat.angle);
    this.ctx.fillStyle = '#d97706';
    this.ctx.fillRect(-3, -5, 6, 28);
    this.ctx.restore();

    // Ball if active
    if (this.ball.active) {
      this.ctx.beginPath();
      this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = '#ef4444';
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = '#ef4444';
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }
  }

  bowlBall() {
    if (this.state === 'BOWLING') return;

    if (this.ballsBowled >= this.maxBalls) {
      this.resetMatch();
    }

    this.state = 'BOWLING';
    this.ballsBowled++;
    this.ball = {
      x: 60,
      y: 100,
      vx: 4.5 + Math.random() * 2,
      vy: (Math.random() - 0.5) * 0.8,
      radius: 7,
      active: true
    };
    this.bat.angle = 0;
    this.bat.isSwinging = false;

    if (this.feedbackElem) {
      this.feedbackElem.innerText = `Ball ${this.ballsBowled}/${this.maxBalls}: Fast Yorker Incoming! TIMING IS EVERYTHING!`;
      this.feedbackElem.className = 'text-yellow';
    }

    this.runGameLoop();
  }

  swingBat() {
    if (this.bat.isSwinging) return;
    this.bat.isSwinging = true;
    this.bat.angle = -Math.PI / 3;

    if (window.soundEngine) window.soundEngine.click();

    if (this.state === 'BOWLING' && this.ball.active) {
      const dist = Math.abs(this.ball.x - 365);

      if (dist < 22) {
        // Perfect Timing -> 6
        this.hitBall(6, '💥 MAXIMUM! 6 RUNS! Out of the Stadium!');
      } else if (dist < 45) {
        // Great Timing -> 4
        this.hitBall(4, '⚡ CRACKING SHOT! 4 RUNS through the covers!');
      } else if (dist < 75) {
        // Decent Timing -> 2
        this.hitBall(2, '🏏 Good placement! Quick 2 runs taken.');
      } else {
        // Missed edge
        this.ball.vx = -1;
      }
    }

    setTimeout(() => {
      this.bat.angle = 0;
      this.bat.isSwinging = false;
    }, 200);
  }

  hitBall(runs, text) {
    this.state = 'HIT';
    if (window.soundEngine) {
      window.soundEngine.batHit();
      if (runs >= 4) window.soundEngine.success();
    }

    this.score += runs;
    if (this.scoreElem) this.scoreElem.innerText = `${this.score} (${this.ballsBowled}/${this.maxBalls} balls)`;

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('seshu_cricket_high', this.highScore.toString());
      if (this.highScoreElem) this.highScoreElem.innerText = this.highScore;
    }

    if (this.feedbackElem) {
      this.feedbackElem.innerText = text;
      this.feedbackElem.className = runs >= 6 ? 'text-cyan font-bold animate-pulse' : 'text-green font-bold';
    }

    // Ball shoots into the sky
    this.ball.vx = runs >= 6 ? 8 : 6;
    this.ball.vy = runs >= 6 ? -9 : -4;

    this.checkOverComplete();
  }

  runGameLoop() {
    if (this.state === 'IDLE' || this.state === 'OVER_COMPLETE') return;

    if (this.state === 'BOWLING') {
      this.ball.x += this.ball.vx;
      this.ball.y += this.ball.vy;

      // Ball missed and passed wickets
      if (this.ball.x > 410) {
        this.state = 'MISSED';
        this.ball.active = false;
        if (this.feedbackElem) {
          this.feedbackElem.innerText = '❌ Beaten for pace! Dot Ball.';
          this.feedbackElem.className = 'text-red';
        }
        this.checkOverComplete();
      }
    } else if (this.state === 'HIT') {
      this.ball.x += this.ball.vx;
      this.ball.y += this.ball.vy;
      this.ball.vy += 0.3; // Gravity

      if (this.ball.y > 220 || this.ball.x > 480) {
        this.ball.active = false;
      }
    }

    this.drawPitch();

    if (this.ball.active || this.bat.isSwinging) {
      this.animId = requestAnimationFrame(() => this.runGameLoop());
    }
  }

  checkOverComplete() {
    if (this.ballsBowled >= this.maxBalls) {
      this.state = 'OVER_COMPLETE';
      setTimeout(() => {
        if (this.feedbackElem) {
          this.feedbackElem.innerHTML = `🏆 <strong>Innings Complete!</strong> Final Score: <span class="text-cyan font-bold">${this.score} Runs</span> in 1 Over!`;
        }
        if (this.bowlBtn) this.bowlBtn.innerText = '🔄 Play Another Over';
      }, 1000);
    }
  }

  resetMatch() {
    this.score = 0;
    this.ballsBowled = 0;
    this.state = 'IDLE';
    if (this.scoreElem) this.scoreElem.innerText = `0 (0/${this.maxBalls} balls)`;
    if (this.bowlBtn) this.bowlBtn.innerText = '⚡ Bowl Next Ball';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.cricketGame = new CricketGame('cricket-canvas');
});
