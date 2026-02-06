document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const reveals = document.querySelectorAll('.reveal');

    // Observer para Temas
    const themeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.body.setAttribute('data-theme', entry.target.dataset.sectionTheme);
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(s => themeObserver.observe(s));

    // Observer para Reveal
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });

    reveals.forEach(r => revealObserver.observe(r));

    // Scroll Suave
    document.querySelectorAll('nav a').forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if(target) target.scrollIntoView({ behavior: 'smooth' });
        };
    });
});