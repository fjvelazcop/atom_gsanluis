// ============================================
// GRUPO SAN LUIS - Unidad Pages Script
// Shared across: Hidrocarburos, Suministros, Transporte
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    // Init AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 80
        });
    }

    initHamburgerMenu();
    initHeaderScroll();
    initSmoothScroll();
    initCounterAnimation();
    initUnidadContactForm();
});

// ============================================
// Mobile Hamburger Menu
// ============================================
function initHamburgerMenu() {
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
function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', function () {
        header.classList.toggle('header--scrolled', window.pageYOffset > 50);
    }, { passive: true });
}

// ============================================
// Smooth Scroll
// ============================================
function initSmoothScroll() {
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
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });
}

// ============================================
// Counter Animation
// ============================================
function initCounterAnimation() {
    const counters = document.querySelectorAll('.unidad-stat__number');

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
// Unidad Contact Form (Formspree)
// ============================================
function initUnidadContactForm() {
    const form = document.getElementById('unidad-contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn = form.querySelector('.m3-button');
        submitBtn.classList.add('contact__submit--loading');
        submitBtn.disabled = true;

        const formData = new FormData(form);
        const data = {};
        formData.forEach(function (value, key) {
            data[key] = value;
        });

        data._subject = `[Grupo San Luis - ${data.unidad || 'Unidad'}] Cotización de ${data.name || 'visitante'}`;

        // === FORMSPREE INTEGRATION ===
        // Replace with your Formspree form ID
        const formspreeUrl = 'https://formspree.io/f/xjkgzdro';

        fetch(formspreeUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(function (response) {
            if (response.ok) return response.json();
            throw new Error('Error');
        })
        .then(function () {
            showFormSuccess(form);
        })
        .catch(function () {
            showFormSuccess(form);
        })
        .finally(function () {
            submitBtn.classList.remove('contact__submit--loading');
            submitBtn.disabled = false;
        });
    });
}

function showFormSuccess(form) {
    // Change button text temporarily
    const btn = form.querySelector('.m3-button');
    const btnText = btn.querySelector('.btn-text');
    const originalText = btnText.textContent;
    
    btnText.textContent = '✓ Enviado con éxito';
    btn.style.pointerEvents = 'none';
    
    setTimeout(function () {
        btnText.textContent = originalText;
        btn.style.pointerEvents = '';
        form.reset();
    }, 3000);

    // Scroll to top of the CTA section smoothly
    const ctaSection = form.closest('.unidad-cta');
    if (ctaSection) {
        ctaSection.style.transition = 'box-shadow 0.5s ease';
        ctaSection.style.boxShadow = 'inset 0 0 0 3px rgba(200, 169, 94, 0.3)';
        setTimeout(function () {
            ctaSection.style.boxShadow = '';
        }, 2000);
    }
}

