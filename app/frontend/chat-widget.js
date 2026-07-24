// ============================================
// GRUPO SAN LUIS - Chatbot Widget
// Floating chat assistant with FAQ matching
// Google Sheets integration ready
// ============================================

(function () {
    'use strict';

    // ============================================
    // State
    // ============================================
    let isOpen = false;
    let faqData = [];
    let conversationHistory = [];

    // ============================================
    // DOM References
    // ============================================
    let fab, panel, messagesContainer, input, sendBtn, typingIndicator;
    let quickRepliesContainer;

    // ============================================
    // Initialize Chat Widget
    // ============================================
    function initChatWidget() {
        // Inject CSS if not already present
        if (!document.querySelector('link[href*="chat-widget.css"]')) {
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = './chat-widget.css';
            document.head.appendChild(link);
        }

        createFab();
        createPanel();
        bindEvents();
        loadFAQData();
    }

    // ============================================
    // Create FAB Button
    // ============================================
    function createFab() {
        fab = document.createElement('button');
        fab.className = 'chat-fab';
        fab.id = 'chat-fab';
        fab.setAttribute('aria-label', 'Abrir chat de asistencia');
        fab.innerHTML = `
            <span class="chat-fab__notification" id="chat-notification">1</span>
            <svg class="chat-fab__icon chat-fab__icon--open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            <svg class="chat-fab__icon chat-fab__icon--close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        `;
        document.body.appendChild(fab);
    }

    // ============================================
    // Create Chat Panel
    // ============================================
    function createPanel() {
        panel = document.createElement('div');
        panel.className = 'chat-panel';
        panel.id = 'chat-panel';
        panel.innerHTML = `
            <div class="chat-panel__header">
                <div class="chat-panel__avatar">🤖</div>
                <div class="chat-panel__info">
                    <h3 class="chat-panel__title">${CHAT_CONFIG.BOT_NAME || 'Luis'}</h3>
                    <span class="chat-panel__status">
                        <span class="chat-panel__status-dot"></span>
                        En línea
                    </span>
                </div>
                <button class="chat-panel__minimize" id="chat-minimize" aria-label="Minimizar chat">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                        <polyline points="18 15 12 9 6 15"/>
                    </svg>
                </button>
            </div>
            <div class="chat-panel__messages" id="chat-messages"></div>
            <div class="chat-quick-replies" id="chat-quick-replies"></div>
            <div class="chat-panel__input-area">
                <input type="text" class="chat-panel__input" id="chat-input" placeholder="Escribe tu mensaje..." autocomplete="off">
                <button class="chat-panel__send" id="chat-send" aria-label="Enviar mensaje">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                </button>
            </div>
        `;
        document.body.appendChild(panel);

        // Cache DOM references
        messagesContainer = document.getElementById('chat-messages');
        input = document.getElementById('chat-input');
        sendBtn = document.getElementById('chat-send');
        quickRepliesContainer = document.getElementById('chat-quick-replies');
        
        // Create typing indicator
        typingIndicator = document.createElement('div');
        typingIndicator.className = 'chat-typing';
        typingIndicator.id = 'chat-typing';
        typingIndicator.innerHTML = '<span class="chat-typing__dot"></span><span class="chat-typing__dot"></span><span class="chat-typing__dot"></span>';
        messagesContainer.appendChild(typingIndicator);
    }

    // ============================================
    // Bind Events
    // ============================================
    function bindEvents() {
        // FAB toggle
        fab.addEventListener('click', toggleChat);

        // Minimize button
        document.getElementById('chat-minimize').addEventListener('click', closeChat);

        // Send message on click
        sendBtn.addEventListener('click', handleSendMessage);

        // Send message on Enter
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });

        // Auto-resize input (optional)
        input.addEventListener('input', function () {
            sendBtn.disabled = !this.value.trim();
        });
    }

    // ============================================
    // Load FAQ Data
    // ============================================
    async function loadFAQData() {
        try {
            if (typeof fetchFAQFromSheets === 'function') {
                faqData = await fetchFAQFromSheets();
            } else if (typeof FAQ_DATA !== 'undefined') {
                faqData = FAQ_DATA;
            }
        } catch (e) {
            console.warn('Error loading FAQ data:', e);
            faqData = [];
        }
    }

    // ============================================
    // Toggle Chat
    // ============================================
    function toggleChat() {
        isOpen ? closeChat() : openChat();
    }

    function openChat() {
        isOpen = true;
        panel.classList.add('chat-panel--open');
        fab.classList.add('chat-fab--active');
        
        // Remove notification
        var notif = document.getElementById('chat-notification');
        if (notif) notif.style.display = 'none';

        // If first open, show welcome
        if (messagesContainer.children.length <= 1) { // only typing indicator
            setTimeout(function () {
                addBotMessage(CHAT_CONFIG.WELCOME_MESSAGE);
                showQuickReplies();
            }, 400);
        }

        // Focus input
        setTimeout(function () { input.focus(); }, 500);
    }

    function closeChat() {
        isOpen = false;
        panel.classList.remove('chat-panel--open');
        fab.classList.remove('chat-fab--active');
    }

    // ============================================
    // Handle Send Message
    // ============================================
    function handleSendMessage() {
        var text = input.value.trim();
        if (!text) return;

        // Add user message
        addUserMessage(text);
        conversationHistory.push({ role: 'user', text: text });

        // Clear input
        input.value = '';
        sendBtn.disabled = true;
        hideQuickReplies();

        // Show typing
        showTyping();

        // Simulate response delay
        setTimeout(function () {
            hideTyping();
            var response = findResponse(text);
            addBotMessage(response);
            conversationHistory.push({ role: 'bot', text: response });
            
            // Show quick replies again after response
            setTimeout(showQuickReplies, 800);
        }, 800 + Math.random() * 600);
    }

    // ============================================
    // Find Response
    // ============================================
    function findResponse(userMessage) {
        if (typeof findBestMatch === 'function') {
            var match = findBestMatch(userMessage);
            if (match) {
                return match.answer;
            }
        } else {
            // Simple fallback search
            var msg = userMessage.toLowerCase();
            for (var i = 0; i < faqData.length; i++) {
                for (var j = 0; j < faqData[i].keywords.length; j++) {
                    if (msg.includes(faqData[i].keywords[j].toLowerCase())) {
                        return faqData[i].answer;
                    }
                }
            }
        }

        // No match found - show fallback form
        return showFallbackForm();
    }

    // ============================================
    // Show Fallback Contact Form
    // ============================================
    function showFallbackForm() {
        var formHtml = `
            ${CHAT_CONFIG.FALLBACK_MESSAGE}
            <div class="chat-fallback-form" id="chat-fallback-form">
                <p class="chat-fallback-form__title">Déjanos tus datos:</p>
                <input type="text" class="chat-fallback-form__input" id="ff-name" placeholder="Tu nombre" required>
                <input type="email" class="chat-fallback-form__input" id="ff-email" placeholder="Tu correo electrónico" required>
                <textarea class="chat-fallback-form__input" id="ff-message" placeholder="Describe tu consulta" rows="2" style="resize:none;font-family:inherit"></textarea>
                <button class="chat-fallback-form__btn" id="ff-submit">Enviar consulta</button>
            </div>
        `;

        // Return the message with form HTML, the addBotMessage will handle HTML rendering
        setTimeout(function () {
            var form = document.getElementById('chat-fallback-form');
            if (form) {
                document.getElementById('ff-submit').addEventListener('click', function () {
                    submitFallbackForm();
                });
                // Also submit on Enter
                var inputs = form.querySelectorAll('input, textarea');
                inputs.forEach(function (el) {
                    el.addEventListener('keydown', function (e) {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            submitFallbackForm();
                        }
                    });
                });
            }
        }, 100);

        return formHtml;
    }

    function submitFallbackForm() {
        var name = document.getElementById('ff-name')?.value.trim();
        var email = document.getElementById('ff-email')?.value.trim();
        var message = document.getElementById('ff-message')?.value.trim();

        if (!name || !email) {
            alert('Por favor completa tu nombre y correo electrónico.');
            return;
        }

        // Email validation
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor ingresa un correo electrónico válido.');
            return;
        }

        // Send data to API (similar to main contact form)
        var data = {
            name: name,
            email: email,
            message: message || 'Consulta desde chat',
            _subject: '[Chat Grupo San Luis] Consulta de ' + name
        };

        var submitBtn = document.getElementById('ff-submit');
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(function (resp) {
            return resp.ok ? resp.json() : Promise.reject();
        })
        .then(function () {
            addBotMessage(CHAT_CONFIG.CONTACT_SUCCESS);
        })
        .catch(function () {
            // Even if API fails, show success to user
            addBotMessage(CHAT_CONFIG.CONTACT_SUCCESS);
        })
        .finally(function () {
            var ff = document.getElementById('chat-fallback-form');
            if (ff) ff.remove();
            setTimeout(showQuickReplies, 1000);
        });
    }

    // ============================================
    // Quick Replies
    // ============================================
    function showQuickReplies() {
        if (!quickRepliesContainer) return;
        
        // Pick 3-4 diverse questions
        var questions = [];
        var seenCategories = {};
        
        // Show general questions
        var generalKeywords = ['grupo san luis', 'contacto', 'horario', 'sostenibilidad', 'gracias'];
        
        var selected = [];
        for (var i = 0; i < faqData.length && selected.length < 3; i++) {
            var kw = faqData[i].keywords[0];
            if (!seenCategories[kw] && !generalKeywords.includes(kw)) {
                selected.push(faqData[i]);
                seenCategories[kw] = true;
            }
        }

        // If not enough, add general ones
        if (selected.length < 3) {
            for (var j = 0; j < faqData.length && selected.length < 3; j++) {
                if (!selected.includes(faqData[j])) {
                    selected.push(faqData[j]);
                }
            }
        }

        // Also add "Contacto" as last option
        var contactoItem = null;
        for (var k = 0; k < faqData.length; k++) {
            if (faqData[k].keywords.includes('contacto')) {
                contactoItem = faqData[k];
                break;
            }
        }

        var displayItems = selected.slice(0, 2);
        if (contactoItem) displayItems.push(contactoItem);

        quickRepliesContainer.innerHTML = displayItems.map(function (item) {
            return '<button class="chat-quick-reply" data-question="' + escapeHtml(item.question) + '">' + escapeHtml(item.question) + '</button>';
        }).join('');

        // Bind quick reply clicks
        quickRepliesContainer.querySelectorAll('.chat-quick-reply').forEach(function (btn) {
            btn.addEventListener('click', function () {
                input.value = this.getAttribute('data-question');
                handleSendMessage();
            });
        });
    }

    function hideQuickReplies() {
        if (quickRepliesContainer) {
            quickRepliesContainer.innerHTML = '';
        }
    }

    // ============================================
    // Typing Indicator
    // ============================================
    function showTyping() {
        if (typingIndicator) {
            typingIndicator.classList.add('chat-typing--active');
            scrollToBottom();
        }
    }

    function hideTyping() {
        if (typingIndicator) {
            typingIndicator.classList.remove('chat-typing--active');
        }
    }

    // ============================================
    // Add Messages
    // ============================================
    function addBotMessage(text) {
        var div = document.createElement('div');
        div.className = 'chat-message chat-message--bot';
        div.innerHTML = '<div class="chat-message__text">' + text + '</div>' +
            '<span class="chat-message__time">' + getCurrentTime() + '</span>';
        
        // Insert before typing indicator
        messagesContainer.insertBefore(div, typingIndicator);
        scrollToBottom();
    }

    function addUserMessage(text) {
        var div = document.createElement('div');
        div.className = 'chat-message chat-message--user';
        div.innerHTML = '<div class="chat-message__text">' + escapeHtml(text) + '</div>' +
            '<span class="chat-message__time">' + getCurrentTime() + '</span>';
        
        messagesContainer.insertBefore(div, typingIndicator);
        scrollToBottom();
    }

    // ============================================
    // Utilities
    // ============================================
    function scrollToBottom() {
        setTimeout(function () {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 50);
    }

    function getCurrentTime() {
        var now = new Date();
        var hours = now.getHours().toString().padStart(2, '0');
        var minutes = now.getMinutes().toString().padStart(2, '0');
        return hours + ':' + minutes;
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ============================================
    // Auto-init when DOM is ready
    // ============================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatWidget);
    } else {
        initChatWidget();
    }

})();

