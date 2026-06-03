/* ============================================================
   Green Haven — Main JavaScript
   ============================================================ */

/* ---------- Navbar: scroll shadow + active link ---------- */
(function () {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileMenu = document.querySelector('.navbar__mobile');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
      toggleScrollTop();
    });
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
    });

    // close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // mark active page
  const links = document.querySelectorAll('.navbar__links a, .navbar__mobile a');
  links.forEach(a => {
    if (a.href === window.location.href ||
        a.pathname === window.location.pathname) {
      a.classList.add('active');
    }
  });
})();

/* ---------- Scroll-to-top button ---------- */
const scrollTopBtn = document.querySelector('.scroll-top');

function toggleScrollTop() {
  if (!scrollTopBtn) return;
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
}

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- Intersection Observer helpers ---------- */
function observe(selector, callback, options = {}) {
  const els = document.querySelectorAll(selector);
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, ...options });

  els.forEach(el => io.observe(el));
}

/* ---------- Fade-up / fade-in / scale-in animations ---------- */
observe('.fade-up, .fade-in, .scale-in', el => {
  el.classList.add('visible');
});

/* ---------- Stagger children animation ---------- */
document.querySelectorAll('.stagger').forEach(parent => {
  parent.querySelectorAll(':scope > *').forEach((child, i) => {
    child.style.setProperty('--i', i);
    child.classList.add('fade-up');
  });
});

observe('.stagger > *', el => el.classList.add('visible'));

/* ---------- Counter animation ---------- */
function animateCounter(el) {
  const target = +el.dataset.target;
  const suffix = el.querySelector('.suffix');
  const suffixText = suffix ? suffix.textContent : '';
  const duration = 1800;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(ease * target);

    if (suffix) {
      el.textContent = current.toLocaleString();
      el.appendChild(suffix);
    } else {
      el.textContent = current.toLocaleString();
    }

    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

observe('.stats__number', el => animateCounter(el));

/* ---------- Progress bars ---------- */
observe('.progress-fill', el => {
  const pct = el.dataset.pct;
  el.style.width = pct + '%';
});

/* ---------- Form handling (estimate & contact) ---------- */
function handleForm(formId, successId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = form.querySelector('[type="submit"]');
    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Sending…';
    btn.style.opacity = '.75';

    // Simulate network delay
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = originalText;
      btn.style.opacity = '';
      form.reset();

      const success = document.getElementById(successId);
      if (success) {
        success.classList.add('show');
        setTimeout(() => success.classList.remove('show'), 5000);
      }
    }, 1400);
  });
}

handleForm('estimate-form', 'estimate-success');
handleForm('contact-form',  'contact-success');

/* ---------- Smooth anchor links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ---------- Spinner keyframe (inline) ---------- */
const style = document.createElement('style');
style.textContent = '.spin { animation: spin .8s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(style);
