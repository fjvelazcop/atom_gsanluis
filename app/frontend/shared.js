// ============================================
// GRUPO SAN LUIS - Shared Utilities
// Common functions used across all pages
// ============================================

// ============================================
// AOS Initialization
// ============================================
export function initAOS(options = {}) {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 80,
            ...options
        });
    }
}

// ============================================
// Mobile Hamburger Menu
// ============================================
export function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const body = document.body;
    const overlay = document.getElementById('nav-overlay');

    if (!hamburger || !navMenu) return;

    function openMenu() {
        navMenu.classList.add('header__nav--open');
        hamburger.classList.add('header__hamburger--active');
        if (overlay) overlay.classList.add('nav-overlay--active');
        body.style.overflow = 'hidden';
    }

    function closeMenu() {
        navMenu.classList.remove('header__nav--open');
        hamburger.classList.remove('header__hamburger--active');
        if (overlay) overlay.classList.remove('nav-overlay--active');
        body.style.overflow = '';
    }

    hamburger.addEventListener('click', function () {
        const isOpen = navMenu.classList.contains('header__nav--open');
        isOpen ? closeMenu() : openMenu();
    });

    if (overlay) overlay.addEventListener('click', closeMenu);

    navMenu.querySelectorAll('.header__nav-link').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
    });
}

// ============================================
// Header Scroll Effect
// ============================================
export function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', function () {
        header.classList.toggle('header--scrolled', window.pageYOffset > 50);
    }, { passive: true });
}

// ============================================
// Smooth Scroll Navigation
// ============================================
export function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(function (link) {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                document.querySelectorAll('.header__nav-link').forEach(function (navLink) {
                    navLink.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
}

// ============================================
// Counter Animation
// ============================================
export function initCounterAnimation(selector = '.about__stat-number, .unidad-stat__number') {
    const counters = document.querySelectorAll(selector);

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    counters.forEach(function (counter) {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    const duration = 2000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(updateCounter);
}

// ============================================
// Contact Form Validation
// ============================================
export function validateField(input) {
    const container = input.closest('.contact__form-group');
    const messageEl = container?.querySelector('.contact__input-message');
    let isValid = true;
    let message = '';

    const value = input.value.trim();

    if (input.hasAttribute('required') && !value) {
        isValid = false;
        message = 'Este campo es requerido';
    } else if (input.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            message = 'Correo electrónico inválido';
        }
    } else if (input.type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]{7,20}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            message = 'Teléfono inválido (solo números)';
        }
    }

    if (messageEl) {
        messageEl.textContent = message;
        if (isValid && value) {
            messageEl.classList.add('contact__input-message--success');
            messageEl.textContent = '✓';
        } else {
            messageEl.classList.remove('contact__input-message--success');
        }
    }

    input.classList.remove('contact__input--error', 'contact__input--success');
    if (isValid && value) {
        input.classList.add('contact__input--success');
    } else if (!isValid) {
        input.classList.add('contact__input--error');
    }

    return isValid;
}

// ============================================
// Submit Contact Form to Vercel API
// ============================================
export function submitContactForm(formData) {
    return fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(function (response) {
        if (response.ok) return response.json();
        throw new Error('Error en el envío');
    });
}

