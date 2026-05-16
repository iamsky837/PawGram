const fadeEls = document.querySelectorAll('.fade-up');

if (fadeEls.length) {
    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px', threshold: 0.08 });

    fadeEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('visible');
        } else {
            io.observe(el);
        }
    });
}

const progressBar = document.getElementById('scrollProgress');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;

    if (progressBar) {
        const width = total > 0 ? (scrolled / total * 100).toFixed(1) : 0;
        progressBar.style.width = width + '%';
    }

    if (scrollTopBtn) {
        scrollTopBtn.classList.toggle('visible', scrolled > 400);
    }
}, { passive: true });

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (navToggle && mobileMenu) {
    function closeMobileMenu() {
        navToggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    }

    navToggle.addEventListener('click', event => {
        event.stopPropagation();
        const isOpen = mobileMenu.classList.toggle('open');
        navToggle.classList.toggle('open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.querySelectorAll('.mob-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('click', event => {
        if (!navToggle.contains(event.target) && !mobileMenu.contains(event.target)) {
            closeMobileMenu();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeMobileMenu();
        }
    });
}
