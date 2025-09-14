// Wait for components to be loaded before initializing chatbot
document.addEventListener('componentsLoaded', function() {
    // Chatbot elements
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');

    // Toggle chatbot window
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', function() {
            chatbotWindow.classList.toggle('active');
        });
    }

    // Close chatbot window
    if (chatbotClose) {
        chatbotClose.addEventListener('click', function() {
            chatbotWindow.classList.remove('active');
        });
    }

    // Send message function
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
            // Add user message
            addMessage(message, 'user');
            chatbotInput.value = '';

            // Simulate bot response after a short delay
            setTimeout(() => {
                const responses = [
                    "Thanks for your message. Our team will get back to you shortly.",
                    "I've noted your query. We'll contact you soon.",
                    "Great question! One of our specialists will reach out to you.",
                    "I understand your concern. We'll address this promptly.",
                    "Thank you for contacting ITA Solutions. We'll respond within 24 hours."
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessage(randomResponse, 'bot');
            }, 1000);
        }
    }

    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(sender + '-message');

        const messageTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageDiv.innerHTML = `
            <p>${text}</p>
            <span class="message-time">${messageTime}</span>
        `;

        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Send message on button click
    if (chatbotSend) {
        chatbotSend.addEventListener('click', function(e) {
            sendMessage();
        });
    }

    // Send message on Enter key
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Auto-open chatbot window when page is fully loaded
    // Add a small delay to ensure all components are loaded
    setTimeout(function() {
        if (chatbotWindow) {
            chatbotWindow.classList.add('active');
        }
    }, 3000);
});