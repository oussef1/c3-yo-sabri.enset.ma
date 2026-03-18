/* ============================================
   LUMIÈRE STUDIO — Main JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ===== NAV SCROLL EFFECT =====
  const nav = document.querySelector('.nav');
  const handleScroll = () => {
    nav?.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // ===== ACTIVE NAV LINK =====
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === 'index.html' && href === '../index.html') || href?.endsWith(path)) {
      link.classList.add('active');
    }
  });

  // ===== MOBILE NAV =====
  const burger = document.querySelector('.nav__burger');
  const mobileNav = document.querySelector('.nav__mobile');
  const mobileClose = document.querySelector('.nav__mobile-close');

  burger?.addEventListener('click', () => mobileNav?.classList.add('open'));
  mobileClose?.addEventListener('click', () => mobileNav?.classList.remove('open'));

  // ===== INTERSECTION OBSERVER — reveal on scroll =====
  const revealItems = document.querySelectorAll('[data-reveal]');
  if (revealItems.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealItems.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = `opacity 0.7s ease ${i * 0.08}s, transform 0.7s ease ${i * 0.08}s`;
      observer.observe(el);
    });
  }

  // ===== COUNTER ANIMATION =====
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = +el.dataset.count;
          const suffix = el.dataset.suffix || '';
          let current = 0;
          const step = target / 60;
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              el.textContent = target + suffix;
              clearInterval(timer);
            } else {
              el.textContent = Math.floor(current) + suffix;
            }
          }, 20);
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => countObserver.observe(c));
  }

  // ===== TESTIMONIAL SLIDER =====
  const slider = document.querySelector('.testimonials__slider');
  if (slider) {
    const slides = slider.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.slider-dot');
    let current = 0;
    let autoSlide;

    const goTo = (n) => {
      slides[current].classList.remove('active');
      dots[current]?.classList.remove('active');
      current = (n + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current]?.classList.add('active');
    };

    const startAuto = () => {
      autoSlide = setInterval(() => goTo(current + 1), 5000);
    };

    document.querySelector('.slider-prev')?.addEventListener('click', () => {
      clearInterval(autoSlide);
      goTo(current - 1);
      startAuto();
    });

    document.querySelector('.slider-next')?.addEventListener('click', () => {
      clearInterval(autoSlide);
      goTo(current + 1);
      startAuto();
    });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { clearInterval(autoSlide); goTo(i); startAuto(); });
    });

    if (slides.length) { slides[0].classList.add('active'); dots[0]?.classList.add('active'); startAuto(); }
  }

  // ===== GALLERY LIGHTBOX =====
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length) {
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lb-img');
    const lbCaption = document.getElementById('lb-caption');
    const lbClose = document.getElementById('lb-close');

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        lbImg.src = img.src;
        lbCaption.textContent = img.alt;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLb = () => {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    };

    lbClose?.addEventListener('click', closeLb);
    lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLb(); });
  }

  // ===== RANGE INPUT DISPLAY =====
  document.querySelectorAll('input[type="range"]').forEach(range => {
    const display = document.getElementById(range.id + '-val');
    if (display) {
      const update = () => display.textContent = range.value + (range.dataset.unit || '');
      range.addEventListener('input', update);
      update();
    }
  });

  // ===== FORM VALIDATION =====
  const contactForm = document.getElementById('contact-form');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Envoi en cours…';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = '✓ Message envoyé !';
      btn.style.background = '#2a6a2a';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.disabled = false;
        contactForm.reset();
      }, 3000);
    }, 1500);
  });

  // ===== SMOOTH scroll for anchor links =====
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
