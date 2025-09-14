// Wait for components to be loaded before initializing tracking
document.addEventListener('componentsLoaded', function() {
    function handleResponse(data) {
      if (data.status === "success") {
        console.log("Visit logged successfully:", data);
      } else {
        console.error("Logging failed:", data.message);
      }
    }

    // Main logging function
    async function logVisit() {
      // Prepare data
        const ip = await getip();
        console.log(ip);
      const params = new URLSearchParams({
         
        timestamp: new Date().toISOString(),
        referrer: document.referrer,
        language: navigator.language,
        platform: navigator.platform,
        screen: `${screen.width}x${screen.height}`,
        url: window.location.href,
        callback: "handleResponse"  // Must match function name
      });
     params.append('ip', ip);
    console.log(params.toString());
        
      // Create script element
      const script = document.createElement('script');
      script.src = `https://script.google.com/macros/s/AKfycbwI1oCu3CV3O_lxv_eg5ocvwv3amVEnk8qhLtom-vv5tT8Iw_bv1fcG6oLBLzMYiGGsuQ/exec?${params.toString()}`;
      
      // Add error handling
      script.onerror = () => {
        console.error("Failed to load tracking script");
        handleResponse({status: "error", message: "Script load failed"});
      };
      
      // Add to DOM
      document.body.appendChild(script);
    }

    function getip() {
      return new Promise((resolve) => {
        fetch('https://api.ipify.org?format=json')
          .then(response => response.json())
          .then(data => resolve(data.ip))
          .catch(error => {
            console.error('Error fetching IP:', error);
            resolve('Unknown');
          });
      });
    }

    // Initiate logging
    window.addEventListener('DOMContentLoaded', logVisit);

    // Track internal link clicks with delegation for dynamically loaded elements
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.href && link.href.includes(window.location.hostname)) {
          trackClick({
            element: link.innerText.trim() || link.getAttribute('aria-label') || link.href,
            url: link.href,
            x: e.clientX,
            y: e.clientY
          });
        }
    });

    // Track chatbot interactions
    document.addEventListener('click', function(e) {
        // Chatbot toggle button
        if (e.target.closest('#chatbot-toggle')) {
            trackClick({
                element: 'Chatbot Toggle',
                url: window.location.href,
                x: e.clientX,
                y: e.clientY
            });
        }
        
        // Chatbot close button
        if (e.target.closest('#chatbot-close')) {
            trackClick({
                element: 'Chatbot Close',
                url: window.location.href,
                x: e.clientX,
                y: e.clientY
            });
        }
        
        // Chatbot send button
        if (e.target.closest('#chatbot-send')) {
            const input = document.getElementById('chatbot-input');
            trackClick({
                element: 'Chatbot Send Message',
                url: window.location.href,
                x: e.clientX,
                y: e.clientY,
                message: input ? input.value.trim() : ''
            });
        }
    });

    async function trackClick(data) {
      try {
        const myip = await getip();
        const params = new URLSearchParams({
          action: 'click',
          ip: myip,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          callback: "handleResponse",
          ...data
        });

        sendToGoogleScript(params);
      } catch (error) {
        console.error('Click tracking failed:', error);
      }
    }

    // Modify your contact form submission
    document.addEventListener('submit', function(e) {
        if (e.target.classList.contains('contact-form')) {
            e.preventDefault();
            const formData = new FormData(e.target);
            trackContactForm(formData);
        }
    });

    async function trackContactForm(formData) {
        const myip = await getip();
        
        const params = new URLSearchParams({
            action: 'contact',
            ip: myip,
            callback: "handleResponse"
        });
        
        formData.forEach((value, key) => {
            params.append(key, value);
        });

        try {
            const response = await sendToGoogleScript(params, true);
            if (response.status === "success") {
                alert('Thank you for your message!');
                document.querySelector('.contact-form')?.reset();
            }
        } catch (error) {
            alert('There was an error sending your message. Please try again.');
        }
    }

    // Shared function for sending data
    function sendToGoogleScript(params, useFetch = false) {
      const url = `https://script.google.com/macros/s/AKfycbwI1oCu3CV3O_lxv_eg5ocvwv3amVEnk8qhLtom-vv5tT8Iw_bv1fcG6oLBLzMYiGGsuQ/exec?${params.toString()}`;
      
      if (useFetch) {
        return fetch(url, { mode: 'no-cors' })
          .then(() => ({ status: "success" }))
          .catch(() => ({ status: "error" }));
      } else {
        const script = document.createElement('script');
        script.src = url;
        document.body.appendChild(script);
      }
    }
});