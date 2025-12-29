document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const bar = document.querySelector('.bar');
  const navMenu = document.querySelector('nav ul');
  const navLinks = document.querySelectorAll('nav ul li a');

  /* MENU MOBILE */
  if (bar && navMenu) {
    bar.addEventListener('click', () => navMenu.classList.toggle('active'));
  }
  navLinks.forEach(link => {
    link.addEventListener('click', () => navMenu?.classList.remove('active'));
  });

  /* SMOOTH SCROLL (offset header) */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const headerH = header ? header.offsetHeight : 70;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerH;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* HEADER PREMIUM AU SCROLL */
  const onScrollHeader = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* SCROLLSPY CLEAN (active-link class) */
  const sections = Array.from(document.querySelectorAll('section'));
  const setActive = (id) => {
    navLinks.forEach(a => {
      const isActive = a.getAttribute('href') === `#${id}`;
      a.classList.toggle('active-link', isActive);
      if (isActive) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  };

  const scrollSpy = () => {
    let current = sections[0]?.id || '';
    const y = window.scrollY + 120;
    sections.forEach(sec => {
      if (y >= sec.offsetTop) current = sec.id;
    });
    setActive(current);
  };
  scrollSpy();
  window.addEventListener('scroll', scrollSpy, { passive: true });

  /* REVEAL + STAGGER */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // On tag les zones importantes sans modifier ton HTML
  const revealTargets = [
    '#presentation .texte',
    '#presentation img',
    '#about img',
    '#about .txt',
    '#competences .container > h1',
    '#competences .container > p',
    '.grid',
    '.grid2',
    '.grid3',
    '.grid4',
    '#contact .container > h1',
    '#contact .container > p',
    '#contact .ctc',
    '#contact .frm'
  ];

  revealTargets.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => el.classList.add('fx-reveal'));
  });

  // Les grilles en cascade
  document.querySelectorAll('.grid, .grid2, .grid3, .grid4').forEach(el => el.classList.add('fx-stagger'));

  if (!prefersReduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });

    document.querySelectorAll('.fx-reveal, .fx-stagger').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.fx-reveal, .fx-stagger').forEach(el => el.classList.add('is-visible'));
  }

  /* HOVER TILT 3D SUR CARTES (smooth et élégant) */
  const cards = document.querySelectorAll('.grid > div, .gridd, .griid, .griiid');
  cards.forEach(card => {
    card.classList.add('fx-card', 'fx-tilt');

    const move = (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const cx = r.width / 2;
      const cy = r.height / 2;

      // tilt doux (valeurs faibles)
      const ry = ((x - cx) / cx) * 6;   // -6deg à 6deg
      const rx = -((y - cy) / cy) * 6;  // -6deg à 6deg

      card.style.setProperty('--rx', `${rx}deg`);
      card.style.setProperty('--ry', `${ry}deg`);
    };

    const reset = () => {
      card.style.setProperty('--rx', `0deg`);
      card.style.setProperty('--ry', `0deg`);
    };

    card.addEventListener('mousemove', move);
    card.addEventListener('mouseleave', reset);
  });

  /* VALIDATION FORM (ton code, plus safe) */
  const submitBtn = document.getElementById('send');
  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      if (!nameInput?.value.trim()) { alert('Veuillez entrer votre nom'); nameInput?.focus(); return; }
      if (!emailInput?.value.trim()) { alert('Veuillez entrer votre email'); emailInput?.focus(); return; }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value)) { alert('Veuillez entrer un email valide'); emailInput.focus(); return; }

      if (!messageInput?.value.trim()) { alert('Veuillez entrer votre message'); messageInput?.focus(); return; }

      alert('Message envoyé avec succès! Merci de nous avoir contacté.');
      nameInput.value = '';
      emailInput.value = '';
      messageInput.value = '';
    });
  }

  /* ANIMATION CHIFFRES (sur .grid) */
  let numbersAnimated = false;

  function animateNumbers() {
    if (numbersAnimated) return;
    numbersAnimated = true;

    const items = document.querySelectorAll('.grid p');
    items.forEach(item => {
      const finalText = item.textContent.trim();
      const numMatch = finalText.match(/\d+/);
      if (!numMatch) return;

      const max = parseInt(numMatch[0], 10);
      const hasPlus = finalText.includes('+');

      let currentValue = 0;
      const duration = 1400;
      const steps = 55;
      const increment = max / steps;
      const stepDuration = duration / steps;

      const interval = setInterval(() => {
        currentValue += increment;
        if (currentValue >= max) {
          item.textContent = finalText;
          clearInterval(interval);
        } else {
          item.textContent = Math.floor(currentValue) + (hasPlus ? '+' : '');
        }
      }, stepDuration);
    });
  }

  const gridElement = document.querySelector('.grid');
  if (gridElement) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateNumbers();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(gridElement);
  }
});