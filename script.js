document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const reveals = document.querySelectorAll('.reveal');
    const nav = document.querySelector('nav');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-links a');
    const scrollToTop = document.querySelector('.scroll-to-top');
    const scrollProgress = document.querySelector('.scroll-progress');
    
    // CURSOR muito foda (nem tanto, mas tá aí)
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (window.innerWidth > 900) {
        window.addEventListener('mousemove', (e) => {
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
            cursorOutline.animate({
                left: `${e.clientX}px`,
                top: `${e.clientY}px`
            }, { duration: 400, fill: 'forwards' });
        });
        
        document.querySelectorAll('a, button, .stat-card, .img-wrapper').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.style.transform = 'scale(1.8)';
                cursorOutline.style.transform = 'scale(1.4)';
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.style.transform = 'scale(1)';
                cursorOutline.style.transform = 'scale(1)';
            });
        });
    }
    
    // PARTICLES
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particlesArray = [];
    const numberOfParticles = 35;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.8;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * 0.4 - 0.2;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
            for (let j = i; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 80) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 - distance / 600})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    
    initParticles();
    animateParticles();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });
    
    // SCROLL PROGRESS
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + '%';
    });
    
    // THEME OBSERVER
    const themeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const theme = entry.target.dataset.sectionTheme;
                document.body.setAttribute('data-theme', theme);
                updateShapeColors(theme);
            }
        });
    }, { 
        threshold: 0.2,  
        rootMargin: '0px'  
    });
    
    sections.forEach(section => themeObserver.observe(section));
    
    // REVEAL
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                if (entry.target.classList.contains('stat-card')) {
                    animateNumber(entry.target);
                }
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    
    reveals.forEach(reveal => revealObserver.observe(reveal));
    
    // SMOOTH SCROLL
    navLinkItems.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
                const offset = 60;
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });
    
    // MENU MOBILE
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }
    
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !hamburger.contains(e.target)) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // NAVBAR SCROLL
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        if (currentScroll > 400) {
            scrollToTop.classList.add('visible');
        } else {
            scrollToTop.classList.remove('visible');
        }
    });
    
    // SCROLL TO TOP
    scrollToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // CORES - AUDI
    function updateShapeColors(theme) {
        const shapes = document.querySelectorAll('.geo-bg .shape');
        const colorMap = {
            'default': { tri: '#bbff00', circ: '#062fc5', squa: '#ffcc00' },
            'trident': { tri: '#3b82f6', circ: '#3b82f6', squa: '#dc2626' },
            'invicta': { tri: '#fbbf24', circ: '#fbbf24', squa: '#fbbf24' },
            'sauber': { tri: '#22c55e', circ: '#22c55e', squa: '#22c55e' },
            'audi': { tri: '#ef4444', circ: '#696d74', squa: '#ef4444' }
        };
        const colors = colorMap[theme] || colorMap['default'];
        shapes.forEach(shape => {
            if (shape.classList.contains('tri')) shape.style.background = colors.tri;
            else if (shape.classList.contains('circ')) shape.style.background = colors.circ;
            else if (shape.classList.contains('squa')) shape.style.background = colors.squa;
        });
    }
    
    // Inicializar cores
    updateShapeColors('default');
    
    // ANIMAR NÚMEROS
    function animateNumber(card) {
        const numberElement = card.querySelector('.stat-number');
        if (!numberElement || numberElement.dataset.animated) return;
        const targetValue = numberElement.dataset.target;
        if (!targetValue) return;
        const targetNumber = parseFloat(targetValue);
        if (isNaN(targetNumber)) return;
        numberElement.dataset.animated = 'true';
        const duration = 1600;
        const steps = 50;
        const increment = targetNumber / steps;
        let current = 0;
        let step = 0;
        const timer = setInterval(() => {
            current += increment;
            step++;
            if (step >= steps) {
                numberElement.textContent = targetValue;
                clearInterval(timer);
            } else {
                if (targetValue.includes('.')) {
                    numberElement.textContent = current.toFixed(1);
                } else {
                    numberElement.textContent = Math.floor(current);
                }
            }
        }, duration / steps);
    }
    
    // PARALLAX
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.geo-bg .shape');
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.25;
            const yPos = -(scrolled * speed * 0.08);
            shape.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    // CONSOLE
    console.log('%c🏎️ GABRIEL BORTOLETO - F1 DRIVER', 'color: #bbff00; font-size: 20px; font-weight: 900; text-shadow: 0 0 15px #bbff00; padding: 15px;');
    console.log('%c🇧🇷 ORGULHO BRASILEIRO NA FÓRMULA 1', 'color: #ffcc00; font-size: 13px; font-weight: 700; padding: 8px;');
    console.log('%c💻 @jotacazinho', 'color: #062fc5; font-size: 11px; padding: 8px;');
});

let resizeTimer;
window.addEventListener('resize', () => {
    document.body.classList.add('resize-animation-stopper');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.body.classList.remove('resize-animation-stopper');
    }, 300);
});

const style = document.createElement('style');
style.textContent = `.resize-animation-stopper * { animation: none !important; transition: none !important; }`;
document.head.appendChild(style);