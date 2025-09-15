// Wait for components to be loaded before initializing chatbot
document.addEventListener('componentsLoaded', function() {
    // Chatbot elements
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');
    
    // n8n webhook URL - REPLACE WITH YOUR ACTUAL n8n WEBHOOK URL
    // You can find this in your n8n instance under the webhook node settings
    // IMPORTANT: For GitHub Pages deployment, this MUST be an HTTPS URL
    // If your n8n instance doesn't support HTTPS, consider using a proxy service like ngrok or a reverse proxy
    const N8N_WEBHOOK_URL = 'https://129.80.27.150:5678/webhook/90f0993e-31ff-4523-8dbc-613465d12b64/chat';
    

    
    // Get or create session ID
    const sessionId = getOrCreateSessionId();
    
    // Session ID management
    function getOrCreateSessionId() {
        // Try to get existing session ID from cookie
        const sessionId = getCookie('chatbot_session_id');
        
        if (sessionId) {
            return sessionId;
        } else {
            // Create new session ID
            const newSessionId = generateSessionId();
            // Set cookie with 1 day expiry
            setCookie('chatbot_session_id', newSessionId, 1);
            return newSessionId;
        }
    }
    
    // Generate a unique session ID
    function generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Get cookie value by name
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }
    
    // Set cookie with expiry in days
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

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

            // Send message to n8n webhook
            sendToN8n(message);
        }
    }

    // Send message to n8n webhook
    async function sendToN8n(message) {
        try {
            // Show typing indicator
            const typingIndicator = addTypingIndicator();
            
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chatInput: message,
                    sessionId: sessionId,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    url: window.location.href
                })
            });
            
            // Remove typing indicator
            if (typingIndicator && typingIndicator.parentNode) {
                typingIndicator.parentNode.removeChild(typingIndicator);
            }
            
            if (response.ok) {
                const data = await response.json();
                console.log('n8n response:', data); // Debug log to see response structure
                
                // Handle different possible response formats from n8n
                let botResponse = "Thanks for your message. If you're seeing this default response, please check your n8n workflow configuration. It should return a JSON with a 'response' property.";
                
                // Check various possible response formats
                if (typeof data === 'string') {
                    botResponse = data;
                } else if (data.response) {
                    botResponse = data.response;
                } else if (data.message) {
                    botResponse = data.message;
                } else if (data.text) {
                    botResponse = data.text;
                } else if (data.output) {  // Handle "output" key (lowercase)
                    botResponse = data.output;
                } else if (data.Output) {  // Handle "Output" key (uppercase)
                    botResponse = data.Output;
                } else if (Object.keys(data).length > 0) {
                    // If response has keys but no recognized text field, stringify it
                    botResponse = JSON.stringify(data);
                }
                
                addMessage(botResponse, 'bot');
            } else {
                console.error('n8n response not OK:', response.status, response.statusText);
                addMessage("Sorry, I'm having trouble connecting. Please try again later.", 'bot');
            }
        } catch (error) {
            console.error('Error sending message to n8n:', error);
            // Remove typing indicator if it exists
            const typingIndicator = document.querySelector('.typing-indicator');
            if (typingIndicator && typingIndicator.parentNode) {
                typingIndicator.parentNode.removeChild(typingIndicator);
            }
            
            // Provide more specific error messages
            let errorMessage = "Sorry, I'm having trouble connecting. Please try again later.";
            
            if (error.message.includes('Failed to fetch')) {
                errorMessage += " This might be due to a mixed content issue (HTTP/HTTPS). Ensure your n8n webhook URL uses HTTPS when deploying to GitHub Pages.";
            } else {
                errorMessage += " Error: " + error.message;
            }
            
            addMessage(errorMessage, 'bot');
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
    
    // Add typing indicator
    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'bot-message', 'typing-indicator');
        typingDiv.innerHTML = `
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <span class="message-time">Just now</span>
        `;
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        return typingDiv;
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