/* =============================================
   Best TV Repair Centre — Main JavaScript
   Royal Premium Theme
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ----- Sticky Header ----- */
  const header = document.querySelector('.header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----- Mobile Menu ----- */
  const hamburger = document.getElementById('hamburgerBtn');
  const navLinks  = document.querySelector('.nav-links');
  const navOverlay = document.querySelector('.nav-overlay');
  const navAnchors = navLinks ? navLinks.querySelectorAll('a') : [];

  const openMenu = () => {
    hamburger.classList.add('active');
    navLinks.classList.add('active');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  };

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.contains('active') ? closeMenu() : openMenu();
    });
  }

  if (navOverlay) navOverlay.addEventListener('click', closeMenu);
  navAnchors.forEach(a => a.addEventListener('click', closeMenu));

  /* ----- Scroll Reveal (Intersection Observer) ----- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger');

  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    revealEls.forEach(el => revealObs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('active'));
  }

  /* ----- Animated Counters ----- */
  const counters = document.querySelectorAll('[data-counter]');

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.counter, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2200;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
      el.textContent = Math.floor(eased * target) + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target + suffix;
      }
    };

    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObs.observe(el));
  } else {
    counters.forEach(el => animateCounter(el));
  }

  /* ----- Active Nav Highlight ----- */
  const sections = document.querySelectorAll('section[id]');

  const highlightNav = () => {
    const scrollY = window.scrollY + 150;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.classList.add('active-link');
        } else {
          link.classList.remove('active-link');
        }
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  /* ----- Smooth Scroll for Anchor Links ----- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const pos = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: pos, behavior: 'smooth' });
      }
    });
  });

  /* ----- Contact Form → WhatsApp Redirect ----- */
  const form = document.getElementById('contactForm');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = document.getElementById('fName').value.trim();
      const mobile  = document.getElementById('fMobile').value.trim();
      const brand   = document.getElementById('fBrand').value;
      const problem = document.getElementById('fProblem').value;
      const address = document.getElementById('fAddress').value.trim();
      const message = document.getElementById('fMessage').value.trim();

      // Validation
      if (!name) {
        showToast('Please enter your name.', 'error');
        document.getElementById('fName').focus();
        return;
      }

      if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
        showToast('Please enter a valid 10-digit mobile number.', 'error');
        document.getElementById('fMobile').focus();
        return;
      }

      // Build WhatsApp message
      let msg = `*🔧 TV Repair Service Request*\n`;
      msg += `━━━━━━━━━━━━━━━━━━\n`;
      msg += `*Name:* ${name}\n`;
      msg += `*Mobile:* ${mobile}\n`;
      if (brand)   msg += `*TV Brand:* ${brand}\n`;
      if (problem) msg += `*Problem:* ${problem}\n`;
      if (address) msg += `*Address:* ${address}\n`;
      if (message) msg += `*Message:* ${message}\n`;
      msg += `━━━━━━━━━━━━━━━━━━\n`;
      msg += `Please arrange a TV repair visit.\nThank you! 🙏`;

      const waUrl = `https://wa.me/919616366122?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');

      showToast('Opening WhatsApp...', 'success');
      form.reset();
    });
  }

  /* ----- Toast Notification ----- */
  function showToast(message, type = 'success') {
    const old = document.querySelector('.toast-msg');
    if (old) old.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = `
      <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
      <span>${message}</span>
    `;

    Object.assign(toast.style, {
      position: 'fixed',
      top: '96px',
      right: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '14px 24px',
      borderRadius: '14px',
      fontSize: '0.88rem',
      fontWeight: '600',
      fontFamily: "'Poppins', sans-serif",
      zIndex: '10000',
      color: '#fff',
      boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
      animation: 'fadeSlideDown 0.4s ease',
      background: type === 'success'
        ? 'linear-gradient(135deg, #25d366, #128c7e)'
        : 'linear-gradient(135deg, #ff4757, #c0392b)',
    });

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
      toast.style.transition = 'all 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  /* ----- Year in footer ----- */
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
