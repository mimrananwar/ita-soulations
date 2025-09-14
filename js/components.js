// Function to load HTML components
function loadComponent(componentName, elementId) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `components/${componentName}.html`, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    document.getElementById(elementId).innerHTML = xhr.responseText;
                    resolve();
                } else {
                    console.error(`Failed to load component: ${componentName}`);
                    reject();
                }
            }
        };
        xhr.send();
    });
}

// Load all components when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Load navbar
        await loadComponent('navbar', 'navbar-container');
        
        // Load sections
        await loadComponent('hero', 'hero-container');
        await loadComponent('services', 'services-container');
        await loadComponent('why-us', 'why-us-container');
        await loadComponent('process', 'process-container');
        await loadComponent('team', 'team-container');
        await loadComponent('contact', 'contact-container');
        
        // Load footer
        await loadComponent('footer', 'footer-container');
        
        // Load chatbot (outside of main structure)
        await loadComponent('chatbot', 'chatbot-container');
        
        // Dispatch a custom event to notify that components are loaded
        document.dispatchEvent(new CustomEvent('componentsLoaded'));
    } catch (error) {
        console.error('Error loading components:', error);
    }
});