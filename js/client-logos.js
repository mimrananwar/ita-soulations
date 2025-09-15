// Wait for components to be loaded before initializing client logos
document.addEventListener('componentsLoaded', function() {
    // Small delay to ensure DOM is fully updated
    setTimeout(function() {
        // Fetch and populate client data
        fetchClientData();
    }, 500); // Small delay to ensure components are fully loaded
});

// Fetch client data from JSON file
async function fetchClientData() {
    try {
        const response = await fetch('data/clients.json');
        const clients = await response.json();
        populateClientLogos(clients);
    } catch (error) {
        console.error('Error fetching client data:', error);
        // Fallback to static data
        const fallbackClients = [
            { name: "TechGlobal Inc.", logo: "https://placehold.co/150x80/0A3D62/FFFFFF?text=Client+1" },
            { name: "Innovate Solutions", logo: "https://placehold.co/150x80/0A3D62/FFFFFF?text=Client+2" },
            { name: "DataSystems Ltd.", logo: "https://placehold.co/150x80/0A3D62/FFFFFF?text=Client+3" },
            { name: "CloudEnterprises", logo: "https://placehold.co/150x80/0A3D62/FFFFFF?text=Client+4" },
            { name: "FutureTech Corp.", logo: "https://placehold.co/150x80/0A3D62/FFFFFF?text=Client+5" },
            { name: "DigitalPioneers", logo: "https://placehold.co/150x80/0A3D62/FFFFFF?text=Client+6" }
        ];
        populateClientLogos(fallbackClients);
    }
}

// Populate client logos
function populateClientLogos(clients) {
    const logosSlider = document.getElementById('clientLogosSlider');
    if (!logosSlider) return;
    
    let logosHTML = '';
    clients.forEach(client => {
        logosHTML += `
            <div class="client-logo-item">
                <div class="client-logo-wrapper">
                    <img src="${client.logo}" alt="${client.name}" class="client-logo">
                </div>
                <p class="client-name">${client.name}</p>
            </div>
        `;
    });
    
    logosSlider.innerHTML = logosHTML;
    
    // For continuous scrolling, we need at least 2 sets of logos
    if (clients.length > 0) {
        logosSlider.innerHTML = logosHTML + logosHTML;
    }
}