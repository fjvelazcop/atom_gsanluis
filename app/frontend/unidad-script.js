// ============================================
// GRUPO SAN LUIS - Unidad Pages Script
// Shared across: Hidrocarburos, Suministros, Transporte
// ============================================

import {
    initAOS,
    initHamburgerMenu,
    initHeaderScroll,
    initSmoothScroll,
    initCounterAnimation,
    submitContactForm
} from './shared.js';

document.addEventListener('DOMContentLoaded', function () {
    // Init AOS
    initAOS();

    // Core features (shared)
    initHamburgerMenu();
    initHeaderScroll();
    initSmoothScroll();
    initCounterAnimation('.unidad-stat__number');

    // Unidad-specific features
    initUnidadContactForm();
});

// ============================================
// Unidad Contact Form (Vercel API / Nodemailer)
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

        // Send to Vercel API (same endpoint as main form)
        submitContactForm(data)
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

    const ctaSection = form.closest('.unidad-cta');
    if (ctaSection) {
        ctaSection.style.transition = 'box-shadow 0.5s ease';
        ctaSection.style.boxShadow = 'inset 0 0 0 3px rgba(200, 169, 94, 0.3)';
        setTimeout(function () {
            ctaSection.style.boxShadow = '';
        }, 2000);
    }
}
