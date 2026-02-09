document.addEventListener('DOMContentLoaded', () => {
  /* ===== ELEMENTOS ===== */
  const body = document.body;
  const nav = document.querySelector('.nav');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTop = document.getElementById('backToTop');
  const progressBar = document.querySelector('.progress-bar');
  const sections = document.querySelectorAll('[data-theme]');
  
  /* ===== PROGRESS BAR ===== */
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = `${(window.scrollY / h) * 100}%`;
  });
  
  /* ===== NAV SCROLL ===== */
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 100);
  });
  
  /* ===== MENU MOBILE ===== */
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });
  
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      body.style.overflow = '';
      window.scrollTo({
        top: target.offsetTop - 100,
        behavior: 'smooth'
      });
    });
  });
  
  /* ===== BACK TO TOP ===== */
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 600);
  });
  
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  /* ===== TROCA DE TEMA SEM BUGS ===== */
  let currentTheme = 'default';
  let lastChangeTime = 0;
  const THEME_COOLDOWN = 300; // Cooldown de 300ms para evitar trocas rápidas
  
  // Mapa de seções para temas
  const sectionThemeMap = new Map();
  sections.forEach(section => {
    const theme = section.dataset.theme;
    if (theme) {
      sectionThemeMap.set(section, theme);
    }
  });
  
  const changeTheme = (newTheme) => {
    const now = Date.now();
    
    // Evita trocas muito rápidas
    if (newTheme === currentTheme || (now - lastChangeTime) < THEME_COOLDOWN) {
      return;
    }
    
    lastChangeTime = now;
    currentTheme = newTheme;
    
    // Muda o tema imediatamente (CSS faz a transição suave)
    body.setAttribute('data-theme', newTheme);
    
    console.log('✨ Tema mudou para:', newTheme);
  };
  
  // Observador de seções com configuração otimizada
  const themeObserver = new IntersectionObserver(entries => {
    // Encontra a seção mais visível
    let mostVisible = null;
    let maxRatio = 0;
    
    entries.forEach(entry => {
      if (entry.intersectionRatio > maxRatio) {
        maxRatio = entry.intersectionRatio;
        mostVisible = entry;
      }
    });
    
    // Só muda tema se a seção estiver suficientemente visível
    if (mostVisible && mostVisible.intersectionRatio > 0.3) {
      const theme = sectionThemeMap.get(mostVisible.target);
      if (theme) {
        changeTheme(theme);
      }
    }
  }, { 
    threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    rootMargin: '-15% 0px -15% 0px'
  });
  
  // Observa todas as seções
  sections.forEach(sec => themeObserver.observe(sec));
  
  // Define tema inicial baseado na primeira seção visível
  const checkInitialTheme = () => {
    const scrollY = window.scrollY + window.innerHeight / 2;
    
    for (let section of sections) {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const sectionBottom = sectionTop + rect.height;
      
      if (scrollY >= sectionTop && scrollY <= sectionBottom) {
        const theme = section.dataset.theme;
        if (theme && theme !== currentTheme) {
          body.setAttribute('data-theme', theme);
          currentTheme = theme;
          console.log('🎨 Tema inicial:', theme);
        }
        break;
      }
    }
  };
  
  checkInitialTheme();
  
  /* ===== FADE IN COM STAGGER ===== */
  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
  });
  
  document.querySelectorAll(
    '.hero-content, .hero-visual, .timeline-content, .timeline-visual, .stat-item, .info-box'
  ).forEach(el => fadeObserver.observe(el));
  
  /* ===== SMOOTH SCROLL PARA LINKS DE NAVEGAÇÃO ===== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 100;
        const targetPosition = target.offsetTop - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  /* ===== PARALLAX SUAVE NAS IMAGENS ===== */
  const images = document.querySelectorAll('.timeline-visual img, .hero-img-frame img');
  let ticking = false;
  
  const updateParallax = () => {
    images.forEach(img => {
      const rect = img.getBoundingClientRect();
      const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      
      if (scrollPercent >= -0.2 && scrollPercent <= 1.2) {
        const translateY = (scrollPercent - 0.5) * 15;
        img.style.transform = `translateY(${translateY}px)`;
      }
    });
    ticking = false;
  };
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });
  
  /* ===== CURSOR GLOW EFFECT ANIMADO (DESKTOP) ===== */
  if (window.innerWidth > 1024) {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
      position: fixed;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, var(--accent-glow) 0%, transparent 65%);
      pointer-events: none;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.5s ease, background 1.5s ease;
      mix-blend-mode: screen;
      will-change: transform;
    `;
    document.body.appendChild(cursor);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let isMoving = false;
    let moveTimeout;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.opacity = '0.12';
      
      isMoving = true;
      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        isMoving = false;
      }, 100);
    });
    
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
    });
    
    function animateCursor() {
      const ease = 0.08;
      cursorX += (mouseX - cursorX) * ease;
      cursorY += (mouseY - cursorY) * ease;
      cursor.style.transform = `translate(${cursorX - 200}px, ${cursorY - 200}px) scale(${isMoving ? 1.1 : 1})`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }
  
  /* ===== ANIMAÇÃO DE ENTRADA INICIAL ===== */
  setTimeout(() => {
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroContent) heroContent.classList.add('visible');
    
    setTimeout(() => {
      if (heroVisual) heroVisual.classList.add('visible');
    }, 150);
  }, 100);
  
  /* ===== PERFORMANCE: THROTTLE DE SCROLL ===== */
  let scrollTimeout;
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      lastScrollTop = window.scrollY;
    }, 50);
  }, { passive: true });
  
  console.log('🏎️ Site do Gabriel Bortoleto carregado!');
  console.log('✨ Sistema de temas otimizado ativado');
});