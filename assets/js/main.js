/**
 * Seshu Portfolio - Clean & Lightweight Controller
 * Smooth typewriter, skill filtering, copy actions, modals & counters.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initTypewriter();
  initStatCounters();
  initSkillTabs();
  initCopyActions();
  initContactForm();
  initResumeModal();
});

/* 1. Header background on scroll */
function initNavbarScroll() {
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });
}

/* 2. Clean Typewriter Effect */
function initTypewriter() {
  const el = document.querySelector('.typewriter-target');
  if (!el) return;

  const roles = [
    'AI & Machine Learning Engineer',
    'Computer Vision Developer (OpenCV)',
    'Full-Stack Web Architect (Node.js & MongoDB)',
    'Data Science & Python Specialist'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function loop() {
    const current = roles[roleIdx];

    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    let speed = isDeleting ? 35 : 75;

    if (!isDeleting && charIdx === current.length) {
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      speed = 350;
    }

    setTimeout(loop, speed);
  }

  loop();
}

/* 3. Stat Counter Animations */
function initStatCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-counter'));
        const suffix = el.getAttribute('data-suffix') || '';
        const isFloat = target % 1 !== 0;

        let start = 0;
        const duration = 1400;
        const startTime = performance.now();

        const step = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          const val = ease * target;

          el.textContent = `${isFloat ? val.toFixed(1) : Math.floor(val)}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = `${isFloat ? target.toFixed(1) : target}${suffix}`;
          }
        };

        requestAnimationFrame(step);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(c => observer.observe(c));
}

/* 4. Filterable Skills Tabs */
function initSkillTabs() {
  const tabBtns = document.querySelectorAll('.skill-tab-btn');
  const cards = document.querySelectorAll('.simple-skill-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-category');

      cards.forEach(card => {
        const cardCat = card.getAttribute('data-cat');
        if (cat === 'all' || cardCat === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* 5. Copy Actions with Toast */
function initCopyActions() {
  document.querySelectorAll('[data-copy-text]').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy-text');
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied to clipboard: ${text}`);
      });
    });
  });
}

function showToast(msg) {
  let toast = document.querySelector('.simple-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'simple-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

/* 6. Active Contact Form with Direct Email Forwarding */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');
  const btnText = document.getElementById('submit-btn-text');
  const statusAlert = document.getElementById('form-status-alert');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]')?.value.trim() || '';
    const email = form.querySelector('[name="email"]')?.value.trim() || '';
    const subject = form.querySelector('[name="subject"]')?.value.trim() || `Portfolio Inquiry from ${name}`;
    const message = form.querySelector('[name="message"]')?.value.trim() || '';

    if (!name || !email || !message) {
      showToast('Please fill in all required fields.');
      return;
    }

    // UI Loading State
    if (submitBtn) submitBtn.disabled = true;
    if (btnText) btnText.innerHTML = '⏳ Dispatching Message...';
    if (statusAlert) statusAlert.innerHTML = '';

    const mailtoFallback = () => {
      const mailtoUrl = `mailto:seshukumaryallapragada@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
      window.location.href = mailtoUrl;
    };

    try {
      const response = await fetch("https://formsubmit.co/ajax/seshukumaryallapragada@gmail.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          _subject: subject,
          message: message,
          _captcha: "false"
        })
      });

      if (response.ok) {
        if (statusAlert) {
          statusAlert.innerHTML = `
            <div class="alert-box success">
              <div class="font-bold text-success text-sm">✔ Message Dispatched Successfully!</div>
              <div class="text-xs text-muted mt-1">Your message has been delivered to <strong>seshukumaryallapragada@gmail.com</strong>. Seshu will reply to <strong>${email}</strong> shortly.</div>
            </div>
          `;
        }
        form.reset();
        showToast(`✔ Message sent directly to seshukumaryallapragada@gmail.com!`);
      } else {
        throw new Error('Endpoint response error');
      }
    } catch (err) {
      // Graceful automatic fallback to user email client
      if (statusAlert) {
        statusAlert.innerHTML = `
          <div class="alert-box success">
            <div class="font-bold text-success text-sm">Opening Your Email Client...</div>
            <div class="text-xs text-muted mt-1">Connecting to default mail app to send your message to <strong>seshukumaryallapragada@gmail.com</strong>.</div>
          </div>
        `;
      }
      setTimeout(mailtoFallback, 600);
      showToast('Opening your default mail app...');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (btnText) btnText.innerHTML = '🚀 Send Message';
    }
  });
}

/* 7. Resume Modal */
function initResumeModal() {
  const openBtns = document.querySelectorAll('.open-resume-btn');
  const modal = document.getElementById('resume-modal');
  const closeBtn = document.getElementById('close-modal-btn');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });
}
