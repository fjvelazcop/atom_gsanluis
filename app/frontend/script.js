// ============================================
// GRUPO SAN LUIS - Main Application Script
// Vanilla JS + AOS + Vercel API (Nodemailer)
// ============================================

import {
    initAOS,
    initHamburgerMenu,
    initHeaderScroll,
    initSmoothScroll,
    initCounterAnimation,
    validateField,
    submitContactForm
} from './shared.js';

document.addEventListener('DOMContentLoaded', function () {
    // Initialize AOS (Animate On Scroll)
    initAOS({ disable: 'mobile' });

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

        // Send to Vercel API
        submitContactForm(data)
            .then(function () {
                showToast();
                form.reset();
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
// Show Toast Notification
// ============================================
function showToast() {
    const toast = document.getElementById('form-toast');
    if (!toast) return;

    toast.classList.add('contact__toast--visible');

    setTimeout(function () {
        toast.classList.remove('contact__toast--visible');
    }, 5000);

    toast.addEventListener('click', function () {
        toast.classList.remove('contact__toast--visible');
    });
}

// ============================================
// Service Worker Registration
// ============================================
function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;

    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
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

