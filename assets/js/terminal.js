/**
 * Seshu Portfolio - Interactive Terminal & Seshu AI Assistant
 */

class SeshuTerminal {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.output = this.container.querySelector('.terminal-output');
    this.input = this.container.querySelector('.terminal-input');
    this.history = [];
    this.historyIndex = -1;

    this.aiKnowledge = {
      name: "Seshu Kumar Yallapragada",
      title: "AI & Machine Learning Engineer | Full-Stack Developer",
      college: "SCSVMV University, Kancheepuram, Tamil Nadu (B.E. in CSE - AI & ML, 2023 - 2027)",
      cgpa: "7.5 / 10.0 (B.E. CSE AI & ML)",
      ssc: "600 / 600 (100% Perfect Score in Class X Board Examinations)",
      email: "seshukumaryallapragada@gmail.com",
      phone: "(+91) 9014391552",
      languages: ["Python", "Java", "C", "C++", "JavaScript (ES6+)"],
      ml_skills: ["Scikit-learn", "Pandas", "NumPy", "OpenCV", "Natural Language Processing (NLP)", "KNN", "Computer Vision"],
      web_skills: ["HTML5", "CSS3", "JavaScript", "Node.js", "Express.js", "REST APIs"],
      databases: ["MySQL", "MongoDB"],
      tools: ["Git", "GitHub", "VS Code", "Google's Antigravity", "Jupyter Notebook"],
      projects: [
        {
          name: "Life Link",
          type: "Location-Based Blood Donor Finder Web App (2026)",
          tech: "HTML5, CSS3, JavaScript, Node.js, Express.js, MongoDB",
          desc: "Real-time emergency blood donor matching platform with geolocation search, blood group compatibility filtering, donor registration, and secure real-time requests."
        },
        {
          name: "Attendance System Using Facial Recognition",
          type: "Computer Vision & Machine Learning (2025)",
          tech: "Python, OpenCV, Machine Learning, KNN Algorithm",
          desc: "Automated contactless attendance marking system capturing real-time facial landmarks, classifying with KNN, and recording timestamped logs directly to CSV."
        }
      ],
      certifications: [
        "OpenCV Bootcamp (Computer Vision & Image Processing)",
        "Python for Beginners Programming",
        "Java (NPTEL Certified)",
        "Database Programming with SQL"
      ],
      strengths: ["Quick Learner", "Problem Solving", "Team Collaboration", "Adaptability", "Effective Communication"],
      extracurricular: "Active cricket player with strong teamwork, leadership, strategic planning, and time management skills."
    };

    this.init();
  }

  init() {
    this.printWelcome();

    this.input.addEventListener('keydown', (e) => {
      if (window.soundEngine) window.soundEngine.key();

      if (e.key === 'Enter') {
        const cmd = this.input.value.trim();
        if (cmd) {
          this.history.push(cmd);
          this.historyIndex = this.history.length;
          this.execute(cmd);
          this.input.value = '';
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex] || '';
        } else {
          this.historyIndex = this.history.length;
          this.input.value = '';
        }
      }
    });

    // Quick Command Buttons
    document.querySelectorAll('[data-terminal-cmd]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cmd = btn.getAttribute('data-terminal-cmd');
        if (window.soundEngine) window.soundEngine.click();
        this.input.value = cmd;
        this.execute(cmd);
        this.input.value = '';
      });
    });
  }

  printWelcome() {
    this.println('<span class="term-cyan">SeshuOS [Version 2.4.0-ai-kernel]</span>');
    this.println('<span class="term-muted">Type <span class="term-highlight">help</span> to view commands, or ask any natural question like: <span class="term-yellow">"Tell me about Seshu\'s OpenCV project"</span></span>\n');
  }

  println(html, isRaw = false) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    if (isRaw) {
      line.textContent = html;
    } else {
      line.innerHTML = html;
    }
    this.output.appendChild(line);
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.output.scrollTop = this.output.scrollHeight;
  }

  execute(cmdStr) {
    this.println(`<span class="term-prompt">seshu@terminal:~$</span> <span class="term-cmd">${this.escapeHTML(cmdStr)}</span>`);
    
    const lower = cmdStr.toLowerCase().trim();
    const args = lower.split(' ');
    const root = args[0];

    switch (root) {
      case 'help':
        this.cmdHelp();
        break;
      case 'about':
      case 'whoami':
        this.cmdAbout();
        break;
      case 'skills':
      case 'stack':
        this.cmdSkills();
        break;
      case 'projects':
        this.cmdProjects();
        break;
      case 'education':
      case 'edu':
        this.cmdEducation();
        break;
      case 'certifications':
      case 'certs':
        this.cmdCertifications();
        break;
      case 'contact':
      case 'email':
      case 'phone':
        this.cmdContact();
        break;
      case 'hire':
        this.cmdHire();
        break;
      case 'cricket':
        this.cmdCricket();
        break;
      case 'clear':
      case 'cls':
        this.output.innerHTML = '';
        this.printWelcome();
        break;
      case 'theme':
        this.cmdTheme(args[1]);
        break;
      case 'matrix':
        this.cmdMatrix();
        break;
      case 'sudo':
        this.println('<span class="term-yellow">Permission granted: You are now browsing in Super-Recruiter mode! 🚀</span>');
        break;
      case 'cat':
        if (args[1] === 'resume' || args[1] === 'resume.pdf' || args[1] === 'resume.txt') {
          this.cmdResume();
        } else {
          this.println(`<span class="term-muted">cat: ${args[1] || 'file'}: Try typing <span class="term-highlight">cat resume</span></span>`);
        }
        break;
      case 'date':
        this.println(`<span class="term-green">${new Date().toLocaleString()}</span>`);
        break;
      case 'echo':
        this.println(this.escapeHTML(cmdStr.substring(5)));
        break;
      default:
        // Try AI Natural Language Assistant
        this.handleAIQuery(cmdStr);
        break;
    }
  }

  cmdHelp() {
    this.println(`
<div class="term-block">
  <div class="term-header">⚙️ AVAILABLE SYSTEM COMMANDS:</div>
  <div>  <span class="term-highlight">about</span>          - Developer profile & background</div>
  <div>  <span class="term-highlight">skills</span>         - Technical expertise & toolchains</div>
  <div>  <span class="term-highlight">projects</span>       - Academic & AI engineering projects</div>
  <div>  <span class="term-highlight">education</span>      - Degrees, SCSVMV university, and scores</div>
  <div>  <span class="term-highlight">certs</span>          - Verified certifications & credentials</div>
  <div>  <span class="term-highlight">cat resume</span>     - Quick summary of resume contents</div>
  <div>  <span class="term-highlight">contact</span>        - Email, phone, and direct links</div>
  <div>  <span class="term-highlight">hire</span>           - Availability & role matchmaking</div>
  <div>  <span class="term-highlight">cricket</span>        - Extracurricular leadership & mini-game</div>
  <div>  <span class="term-highlight">theme &lt;name&gt;</span>    - Switch theme: cyber | emerald | solar | nebula</div>
  <div>  <span class="term-highlight">matrix</span>         - Trigger matrix visual cascade</div>
  <div>  <span class="term-highlight">clear</span>          - Clear terminal display</div>
  <div class="term-muted mt-1">💡 You can also ask natural questions (e.g. "What is his CGPA?", "Explain his face recognition project")</div>
</div>`);
  }

  cmdAbout() {
    this.println(`
<div class="term-block">
  <div class="term-cyan font-bold">👤 ${this.aiKnowledge.name}</div>
  <div class="term-muted">${this.aiKnowledge.title}</div>
  <div class="mt-1">Final-year Computer Science Engineering undergraduate specializing in Artificial Intelligence & Machine Learning at SCSVMV University. Passionate about building intelligent systems, computer vision applications, and full-stack web solutions.</div>
  <div class="mt-1"><span class="term-green">Strengths:</span> ${this.aiKnowledge.strengths.join(' • ')}</div>
</div>`);
  }

  cmdSkills() {
    this.println(`
<div class="term-block">
  <div class="term-header">🛠️ TECHNICAL ARSENAL:</div>
  <div><span class="term-yellow">Programming:</span> ${this.aiKnowledge.languages.join(', ')}</div>
  <div><span class="term-cyan">Machine Learning & AI:</span> ${this.aiKnowledge.ml_skills.join(', ')}</div>
  <div><span class="term-green">Web Technologies:</span> ${this.aiKnowledge.web_skills.join(', ')}</div>
  <div><span class="term-pink">Databases:</span> ${this.aiKnowledge.databases.join(', ')}</div>
  <div><span class="term-purple">Developer Tools:</span> ${this.aiKnowledge.tools.join(', ')}</div>
</div>`);
  }

  cmdProjects() {
    let html = '<div class="term-block"><div class="term-header">🚀 FLAGSHIP ACADEMIC PROJECTS:</div>';
    this.aiKnowledge.projects.forEach((p, idx) => {
      html += `
<div class="mt-1">
  <div class="term-cyan font-bold">${idx + 1}. ${p.name} [${p.type}]</div>
  <div class="term-muted"><span class="term-yellow">Tech:</span> ${p.tech}</div>
  <div class="term-text">${p.desc}</div>
</div>`;
    });
    html += '</div>';
    this.println(html);
  }

  cmdEducation() {
    this.println(`
<div class="term-block">
  <div class="term-header">🎓 ACADEMIC BACKGROUND:</div>
  <div>• <span class="term-cyan font-bold">B.E. in Computer Science & Engineering (AI & ML)</span></div>
    <div class="term-muted">  SCSVMV University, Kancheepuram, Tamil Nadu (2023 - 2027)</div>
    <div class="term-green">  Current CGPA: 7.5 / 10.0</div>
  <div class="mt-1">• <span class="term-yellow font-bold">Class XII (MPC)</span>: Grade B</div>
  <div class="mt-1">• <span class="term-pink font-bold">Class X (SSC)</span>: <span class="term-green font-bold">600 / 600 (100% Top Scorer!)</span></div>
</div>`);
  }

  cmdCertifications() {
    this.println(`
<div class="term-block">
  <div class="term-header">📜 VERIFIED CERTIFICATIONS:</div>
  ${this.aiKnowledge.certifications.map(c => `<div>  ✔ <span class="term-green">${c}</span></div>`).join('')}
</div>`);
  }

  cmdContact() {
    this.println(`
<div class="term-block">
  <div class="term-header">📬 CONNECT DIRECTLY:</div>
  <div>📧 Email: <a href="mailto:${this.aiKnowledge.email}" class="term-link">${this.aiKnowledge.email}</a></div>
  <div>📱 Phone: <a href="tel:+919014391552" class="term-link">${this.aiKnowledge.phone}</a></div>
  <div>📍 Location: Kancheepuram, Tamil Nadu / Andhra Pradesh (Open to relocate & remote)</div>
</div>`);
  }

  cmdHire() {
    this.println(`
<div class="term-block">
  <div class="term-green font-bold">💼 CANDIDATE STATUS: READY FOR IMPACT</div>
  <div class="mt-1">Looking for: <span class="term-cyan">AI / ML Engineer, Full-Stack Developer, or Software Engineer Internships / Full-Time</span></div>
  <div>Key Advantage: Strong algorithmic foundations + practical experience building OpenCV computer vision and full-stack Node.js/MongoDB platforms.</div>
  <div class="mt-1">Reach out directly via <span class="term-highlight">contact</span> or email <span class="term-yellow">${this.aiKnowledge.email}</span></div>
</div>`);
  }

  cmdCricket() {
    this.println(`
<div class="term-block">
  <div class="term-yellow font-bold">🏏 EXTRACURRICULARS & SPORTSMANSHIP:</div>
  <div class="mt-1">Active cricket player with a track record of strong teamwork, tactical leadership, lightning agility, and cool composure under pressure.</div>
  <div class="term-muted">Scroll down to the "Sportsmanship" section on this page to play the interactive Batting Challenge mini-game!</div>
</div>`);
  }

  cmdResume() {
    this.println(`
<div class="term-block">
  <div class="term-header">📄 RESUME SUMMARY (11239A103_RESUME.pdf):</div>
  <div>Name: ${this.aiKnowledge.name}</div>
  <div>Degree: B.E. CSE (AI & ML), SCSVMV Univ (CGPA: 7.5) | SSC: 100% (600/600)</div>
  <div>Core Skills: Python, Java, OpenCV, ML, Scikit-learn, Node.js, MongoDB, SQL</div>
  <div>Projects: Life Link (Blood Donor Finder) & Facial Recognition Attendance System</div>
  <div class="mt-1"><a href="11239A103_RESUME.pdf" download class="term-link">📥 Click here to download original PDF resume</a></div>
</div>`);
  }

  cmdTheme(themeName) {
    const valid = ['cyber', 'emerald', 'solar', 'nebula'];
    if (valid.includes(themeName)) {
      if (window.setPortfolioTheme) {
        window.setPortfolioTheme(themeName);
        this.println(`<span class="term-green">✓ Theme switched to <strong>${themeName}</strong></span>`);
      }
    } else {
      this.println(`<span class="term-yellow">Invalid theme. Choose from: <span class="term-highlight">cyber</span>, <span class="term-highlight">emerald</span>, <span class="term-highlight">solar</span>, <span class="term-highlight">nebula</span></span>`);
    }
  }

  cmdMatrix() {
    this.println('<span class="term-green">Initializing Matrix Rain stream... [Press clear to reset]</span>');
    const matrixChars = "01SESHUAI0101KNNOPENCV1010PYTHON101";
    let count = 0;
    const interval = setInterval(() => {
      let str = "";
      for (let i = 0; i < 40; i++) {
        str += matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
      }
      this.println(`<span class="term-green">${str}</span>`);
      count++;
      if (count > 8) clearInterval(interval);
    }, 80);
  }

  handleAIQuery(query) {
    const q = query.toLowerCase();

    let response = "";

    if (q.includes('cgpa') || q.includes('gpa') || q.includes('score') || q.includes('marks') || q.includes('10th') || q.includes('12th')) {
      response = `Seshu holds a <strong>7.5 / 10.0 CGPA</strong> in B.E. CSE (AI & ML) at SCSVMV University, Grade B in Class XII MPC, and an outstanding <strong>100% (600 / 600)</strong> in his Class X (SSC) Board exams!`;
    } else if (q.includes('face') || q.includes('opencv') || q.includes('attendance') || q.includes('vision') || q.includes('knn')) {
      response = `Seshu built an <strong>Attendance System Using Facial Recognition (2025)</strong> using Python, OpenCV, and K-Nearest Neighbors (KNN). It captures real-time video frames, detects facial landmarks, matches identity embeddings against a dataset, and auto-records timestamped logs to CSV.`;
    } else if (q.includes('blood') || q.includes('donor') || q.includes('lifelink') || q.includes('life link') || q.includes('web app')) {
      response = `Seshu developed <strong>Life Link (2026)</strong>, a full-stack location-based blood donor finder built with HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB. It connects blood donors with emergency recipients in real-time with GPS distance filtering and blood compatibility mapping.`;
    } else if (q.includes('skill') || q.includes('tech') || q.includes('language') || q.includes('python') || q.includes('java')) {
      response = `Seshu's technical stack includes <strong>Python, Java, C, C++, JavaScript (ES6+), Node.js, Express.js, MongoDB, MySQL</strong>, alongside Machine Learning frameworks like <strong>OpenCV, Scikit-learn, Pandas, NumPy, and NLP</strong>.`;
    } else if (q.includes('certif') || q.includes('nptel') || q.includes('course')) {
      response = `Seshu's certifications include: <strong>OpenCV Bootcamp</strong> (Computer Vision), <strong>Python for Beginners Programming</strong>, <strong>Java (NPTEL)</strong>, and <strong>Database Programming with SQL</strong>.`;
    } else if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('phone') || q.includes('call')) {
      response = `You can reach Seshu directly at <a href="mailto:seshukumaryallapragada@gmail.com" class="term-link">seshukumaryallapragada@gmail.com</a> or call <a href="tel:+919014391552" class="term-link">+91 9014391552</a>. He is actively available for AI and Software Engineering opportunities!`;
    } else if (q.includes('cricket') || q.includes('sport') || q.includes('hobby')) {
      response = `Seshu is an active cricket player! He attributes his agile decision-making, strategic focus, and high-pressure team leadership skills to his sports background.`;
    } else if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      response = `Hello there! I am <strong>Seshu AI</strong>, your interactive portfolio co-pilot. Ask me anything about Seshu's projects, technical skills, certifications, or academic background!`;
    } else {
      response = `Seshu is a final-year AI & ML Engineer at SCSVMV University, proficient in Python, OpenCV, Machine Learning (KNN, Scikit-learn), Full-Stack JavaScript (Node.js/Express/MongoDB), and SQL. Type <span class="term-highlight">help</span> to explore all commands.`;
    }

    this.println(`
<div class="term-ai-response">
  <div class="term-cyan font-bold">🤖 Seshu AI Assistant:</div>
  <div>${response}</div>
</div>`);
  }

  escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.seshuTerminal = new SeshuTerminal('seshu-terminal');
});
