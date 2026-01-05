/* chatbot.js - Advanced Logic */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. INJECT UI
    const chatHTML = `
        <div id="void-chat-trigger">
            <i data-lucide="bot"></i>
        </div>
        
        <div id="void-chat-window">
            <div class="chat-header">
                <span class="chat-title"><span class="system-status-dot"></span> SYSTEM_AI_V3</span>
                <button class="chat-close"><i data-lucide="x"></i></button>
            </div>
            <div class="chat-messages" id="chat-messages">
                <div class="message bot">
                    SYSTEM ONLINE.<br>
                    I have full access to Avi's academic records, projects, and tech stack. What would you like to know?
                </div>
            </div>
            <div class="typing-indicator" id="typing-indicator">Analyzing Vector Space...</div>
            <div class="chat-input-area">
                <input type="text" id="chat-input" placeholder="Ask about projects, skills, etc..." autocomplete="off">
                <button id="chat-send" class="chat-send"><i data-lucide="send"></i></button>
            </div>
        </div>
    `;
    
    if(!document.getElementById('void-chat-window')) {
        document.body.insertAdjacentHTML('beforeend', chatHTML);
        lucide.createIcons();
    }

    const trigger = document.getElementById('void-chat-trigger');
    const windowEl = document.getElementById('void-chat-window');
    const closeBtn = document.querySelector('.chat-close');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    const messagesContainer = document.getElementById('chat-messages');
    const typingIndicator = document.getElementById('typing-indicator');

    // Toggle Logic
    let isOpen = false;
    function toggleChat() {
        isOpen = !isOpen;
        windowEl.classList.toggle('active', isOpen);
        if(isOpen) input.focus();
    }
    trigger.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    // SEND LOGIC
    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        input.value = '';
        typingIndicator.classList.add('active');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });
            const data = await response.json();

            setTimeout(() => {
                typingIndicator.classList.remove('active');
                // Pass action details to addMessage to render button
                addMessage(data.text, 'bot', data.action, data.label, data.target);
            }, 600);

        } catch (error) {
            console.error(error);
            typingIndicator.classList.remove('active');
            addMessage("Connection Error. Please check your network.", 'bot');
        }
    }

    // Function to Add Messages (Text + Optional Action Button)
    function addMessage(text, sender, actionType = null, actionLabel = null, actionTarget = null) {
        const div = document.createElement('div');
        div.className = `message ${sender}`;
        div.innerHTML = text;

        // If there is an actionable step, add a button
        if (sender === 'bot' && actionType && actionLabel && actionTarget) {
            const btn = document.createElement('button');
            btn.className = 'chat-inline-btn';
            btn.innerHTML = `${actionLabel.toUpperCase()} <i data-lucide="arrow-right" style="width:12px;"></i>`;
            
            // Attach the click handler
            btn.onclick = () => {
                executeAction(actionType, actionTarget);
                // Disable button after click to prevent spam
                btn.style.opacity = "0.5";
                btn.style.pointerEvents = "none";
                btn.innerHTML = `EXECUTING...`;
            };
            
            div.appendChild(btn);
            setTimeout(() => lucide.createIcons(), 50);
        }

        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // THE SMART ACTION HANDLER
    function executeAction(action, target) {
        if (!action || !target) return;

        // 1. SIMPLE SCROLL
        if (action === 'scroll_to') {
            const el = document.querySelector(target);
            if (el) {
                if(typeof lenis !== 'undefined') lenis.scrollTo(el, { duration: 1.5 });
                else el.scrollIntoView({ behavior: 'smooth' });
            }
        } 
        
        // 2. PROJECT NAVIGATION (Scroll -> Wait -> Open)
        else if (action === 'navigate_project') {
            // First, scroll to work section
            const workSection = document.getElementById('work');
            if(workSection) {
                if(typeof lenis !== 'undefined') lenis.scrollTo(workSection, { duration: 1.5 });
                else workSection.scrollIntoView({ behavior: 'smooth' });

                // Wait for scroll to finish, then trigger the card click
                setTimeout(() => {
                    // Find the card with the specific data-id
                    const card = document.querySelector(`.project-card[data-id="${target}"]`);
                    if(card) {
                        // Add a visual highlight effect before clicking
                        card.style.transform = "scale(1.05)";
                        card.style.borderColor = "var(--accent)";
                        
                        setTimeout(() => {
                            card.click(); // This triggers the transition logic in ui.js
                        }, 500);
                    }
                }, 1600); // 1.5s scroll + 100ms buffer
            }
        } 
        
        // 3. CONTACT / MODAL
        else if (action === 'offer_contact') {
            const el = document.getElementById(target); // 'open-contact-modal'
            if (el) el.click();
        }
        
        // 4. DIRECT REDIRECT (Fallback)
        else if (action === 'redirect') {
            window.location.href = target;
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});