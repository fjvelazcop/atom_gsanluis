// ============================================
// EMPRESA SAN LUIS - Main Application Script
// Vanilla JS - No external dependencies
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    initHamburgerMenu();
    initHeroCarousel();
    initSmoothScroll();
    initHeaderScroll();
    initScrollAnimations();
    initContactForm();
    initCounterAnimation();
    registerServiceWorker();
});

// ============================================
// Mobile Hamburger Menu
// ============================================
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const body = document.body;

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    body.appendChild(overlay);

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
        overlay.classList.add('nav-overlay--active');
        body.style.overflow = 'hidden';
    }

    function closeMenu() {
        navMenu.classList.remove('header__nav--open');
        hamburger.classList.remove('header__hamburger--active');
        overlay.classList.remove('nav-overlay--active');
        body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);

    // Close menu on nav link click
    const navLinks = navMenu.querySelectorAll('.header__nav-link');
    navLinks.forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeMenu();
        }
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

    function goToSlide(index) {
        slides[currentSlide].classList.remove('hero__slide--active');
        indicators[currentSlide].classList.remove('hero__indicator--active');

        currentSlide = (index + totalSlides) % totalSlides;

        slides[currentSlide].classList.add('hero__slide--active');
        indicators[currentSlide].classList.add('hero__indicator--active');
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    nextBtn.addEventListener('click', function () {
        nextSlide();
        startAutoPlay();
    });

    prevBtn.addEventListener('click', function () {
        prevSlide();
        startAutoPlay();
    });

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

    carousel.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
    }, { passive: true });

    carousel.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        startAutoPlay();
    }, { passive: true });

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
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update active nav link
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
    let lastScroll = 0;

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

// ============================================
// Scroll Animations (Intersection Observer)
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
// Contact Form Handler
// ============================================
function initContactForm() {
    const form = document.getElementById('contact-form');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {};
        formData.forEach(function (value, key) {
            data[key] = value;
        });

        // Simulate form submission
        const submitBtn = form.querySelector('.contact__submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        setTimeout(function () {
            submitBtn.textContent = '¡Mensaje enviado!';
            submitBtn.style.backgroundColor = '#95c800';
            submitBtn.style.color = '#003366';

            setTimeout(function () {
                submitBtn.textContent = originalText;
                submitBtn.style.backgroundColor = '';
                submitBtn.style.color = '';
                submitBtn.disabled = false;
                form.reset();
            }, 3000);
        }, 1500);
    });
}

// ============================================
// Counter Animation
// ============================================
function initCounterAnimation() {
    const counters = document.querySelectorAll('.about__stat-number');

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(function (counter) {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 2000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
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
// Service Worker Registration
// ============================================
function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;

    // Evitamos interferencias del cache del Service Worker en desarrollo.
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
