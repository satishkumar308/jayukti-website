document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('main-header');
    const heroTitle = document.getElementById('hero-title');
    const heroPara = document.getElementById('hero-para');
    const heroBtn = document.getElementById('hero-btn');

    // Hero Animations on Load
    setTimeout(() => {
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
    }, 300);

    setTimeout(() => {
        heroPara.style.opacity = '1';
        heroPara.style.transform = 'translateY(0)';
    }, 600);

    setTimeout(() => {
        heroBtn.style.opacity = '1';
        heroBtn.style.transform = 'translateY(0)';
    }, 900);

    // Header Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Reveal on Scroll
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        for (let i = 0; i < revealElements.length; i++) {
            const windowHeight = window.innerHeight;
            const revealTop = revealElements[i].getBoundingClientRect().top;
            const revealPoint = 150;

            if (revealTop < windowHeight - revealPoint) {
                revealElements[i].classList.add('active');
            }
        }
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // Smooth Scroll for Nav Links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return; // Skip modal triggers
            
            e.preventDefault();
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Leadership Modal Logic
    const modal = document.getElementById('leadership-modal');
    const navBtn = document.getElementById('nav-leadership-btn');
    const aboutBtn = document.getElementById('about-leadership-btn');
    const closeBtn = document.querySelector('.close-btn');

    function openModal(e) {
        if(e) e.preventDefault();
        modal.classList.add('show');
    }

    function closeModal() {
        modal.classList.remove('show');
    }

    if (navBtn) navBtn.addEventListener('click', openModal);
    if (aboutBtn) aboutBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});
