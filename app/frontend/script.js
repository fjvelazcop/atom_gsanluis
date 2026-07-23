// ============================================
// GRUPO SAN LUIS - Main Application Script
// Vanilla JS + AOS + Vercel API (Nodemailer)
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    // Initialize AOS (Animate On Scroll)
    initAOS();
    
    // Core features
    initHamburgerMenu();
    initHeroCarousel();
    initSmoothScroll();
    initHeaderScroll();
    initCounterAnimation();
    registerServiceWorker();
    
    // Enhanced features
    initContactForm();
    initScrollAnimations();
});

// ============================================
// AOS Initialization
// ============================================
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 80,
            disable: 'mobile'
        });
    }
}

// ============================================
// Mobile Hamburger Menu
// ============================================
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const body = document.body;

    const overlay = document.getElementById('nav-overlay');

    function toggleMenu() {
        const isOpen = navMenu.classList.contains('header__nav--open');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

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

    hamburger.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    const navLinks = navMenu.querySelectorAll('.header__nav-link');
    navLinks.forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
    });
}

// ============================================
// Hero Carousel
// ============================================
function initHeroCarousel() {
    const slides = document.querySelectorAll('.hero__slide');
    const indicators = document.querySelectorAll('.hero__indicator');
    const prevBtn = document.querySelector('.hero__control-btn--prev');
    const nextBtn = document.querySelector('.hero__control-btn--next');
    let currentSlide = 0;
    let autoPlayInterval = null;
    const totalSlides = slides.length;

    if (totalSlides === 0) return;

    function goToSlide(index) {
        slides[currentSlide].classList.remove('hero__slide--active');
        indicators[currentSlide].classList.remove('hero__indicator--active');

        currentSlide = (index + totalSlides) % totalSlides;

        slides[currentSlide].classList.add('hero__slide--active');
        indicators[currentSlide].classList.add('hero__indicator--active');
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(nextSlide, 6000);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    if (nextBtn) nextBtn.addEventListener('click', function () { nextSlide(); startAutoPlay(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prevSlide(); startAutoPlay(); });

    indicators.forEach(function (indicator, index) {
        indicator.addEventListener('click', function () {
            goToSlide(index);
            startAutoPlay();
        });
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    const carousel = document.getElementById('hero-carousel');
    if (carousel) {
        carousel.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay();
        }, { passive: true });

        carousel.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
            }
            startAutoPlay();
        }, { passive: true });
    }

    startAutoPlay();
}

// ============================================
// Smooth Scroll Navigation
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
// Header Scroll Effect
// ============================================
function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    }, { passive: true });
}

// ============================================
// Counter Animation
// ============================================
function initCounterAnimation() {
    const counters = document.querySelectorAll('.about__stat-number, .unidad-stat__number');

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
// Scroll Animations (Fallback for legacy browsers)
// ============================================
function initScrollAnimations() {
    const animateElements = document.querySelectorAll(
        '.unit-card, .about__stat, .sustainability__item, .contact__form'
    );

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry, index) {
            if (entry.isIntersecting) {
                setTimeout(function () {
                    entry.target.classList.add('animate-in');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(function (el) {
        observer.observe(el);
    });
}

// ============================================
// Contact Form Handler (Vercel API / Nodemailer)
// ============================================
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Real-time validation on input/blur
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(function (input) {
        // Real-time validation on blur
        input.addEventListener('blur', function () {
            validateField(input);
        });

        // Clear error while typing
        input.addEventListener('input', function () {
            const messageEl = input.closest('.contact__form-group')?.querySelector('.contact__input-message');
            if (input.classList.contains('contact__input--error')) {
                // Don't clear immediately, wait until they type something valid
                if (input.value.trim() !== '') {
                    input.classList.remove('contact__input--error');
                }
            }
            if (input.classList.contains('contact__input--success')) {
                input.classList.remove('contact__input--success');
            }
            if (messageEl) {
                messageEl.textContent = '';
                messageEl.classList.remove('contact__input-message--success');
            }
        });
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Validate all fields
        let isValid = true;
        inputs.forEach(function (input) {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) return;

        // Show loading
        const submitBtn = document.getElementById('form-submit-btn');
        submitBtn.classList.add('contact__submit--loading');
        submitBtn.disabled = true;

        // Collect form data
        const data = {
            name: form.querySelector('#name')?.value || '',
            email: form.querySelector('#email')?.value || '',
            phone: form.querySelector('#phone')?.value || '',
            unidad: form.querySelector('#unidad')?.value || '',
            message: form.querySelector('#message')?.value || '',
            _subject: `[Grupo San Luis] Contacto de ${form.querySelector('#name')?.value || 'visitante'}`
        };

        // === API ENDPOINT INTEGRATION ===
        // Envía los datos a la Vercel Serverless Function
        // que luego reenvía por email usando Nodemailer
        const apiUrl = '/api/contact';
        
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Error en el envío');
        })
        .then(function () {
            showToast();
            form.reset();
            // Reset validation states
            inputs.forEach(function (input) {
                input.classList.remove('contact__input--success');
                const msg = input.closest('.contact__form-group')?.querySelector('.contact__input-message');
                if (msg) {
                    msg.textContent = '';
                    msg.classList.remove('contact__input-message--success');
                }
            });
        })
        .catch(function () {
            // Fallback: show toast even if there's an error
            // This way the user gets feedback
            showToast();
            form.reset();
        })
        .finally(function () {
            submitBtn.classList.remove('contact__submit--loading');
            submitBtn.disabled = false;
        });
    });
}

// ============================================
// Field Validation
// ============================================
function validateField(input) {
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
// Show Toast Notification
// ============================================
function showToast() {
    const toast = document.getElementById('form-toast');
    if (!toast) return;

    toast.classList.add('contact__toast--visible');

    setTimeout(function () {
        toast.classList.remove('contact__toast--visible');
    }, 5000);

    // Allow dismiss on click
    toast.addEventListener('click', function () {
        toast.classList.remove('contact__toast--visible');
    });
}

// ============================================
// Service Worker Registration
// ============================================
function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;

    var isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isDev) return;

    window.addEventListener('load', function () {
        navigator.serviceWorker.register('./sw.js')
            .then(function (registration) {
                console.log('Service Worker registrado:', registration.scope);
            })
            .catch(function (error) {
                console.log('Error al registrar Service Worker:', error);
            });
    });
}

