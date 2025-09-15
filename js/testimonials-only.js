// Wait for components to be loaded before initializing testimonials
document.addEventListener('componentsLoaded', function() {
    // Small delay to ensure DOM is fully updated
    setTimeout(function() {
        // Fetch and populate testimonial data
        fetchTestimonialData();
    }, 500); // Small delay to ensure components are fully loaded
});

// Fetch testimonial data from JSON file
async function fetchTestimonialData() {
    try {
        const response = await fetch('data/testimonials.json');
        const testimonials = await response.json();
        populateTestimonials(testimonials);
    } catch (error) {
        console.error('Error fetching testimonial data:', error);
        // Fallback to static data
        const fallbackTestimonials = [
            {
                name: "Robert Chen",
                title: "CFO, TechGlobal Inc.",
                testimonial: "ITA Solutions transformed our financial processes. Their expertise in NetSuite implementation saved us countless hours and improved our reporting accuracy significantly."
            },
            {
                name: "Sarah Williams",
                title: "Operations Director, Innovate Solutions",
                testimonial: "The business intelligence dashboards provided by ITA Solutions gave us insights we never had before. Our decision-making process has become much more data-driven and effective."
            },
            {
                name: "Michael Thompson",
                title: "CEO, DataSystems Ltd.",
                testimonial: "Working with ITA Solutions was a game-changer for our company. Their financial modeling helped us secure funding and plan for sustainable growth."
            },
            {
                name: "Jennifer Lopez",
                title: "COO, CloudEnterprises",
                testimonial: "The ERP optimization services provided by ITA Solutions streamlined our operations and reduced costs by 20%. Their team's expertise is unmatched in the industry."
            }
        ];
        populateTestimonials(fallbackTestimonials);
    }
}

// Populate testimonials
function populateTestimonials(testimonials) {
    const reviewSlider = document.getElementById('reviewSlider');
    if (!reviewSlider) return;
    
    let reviewsHTML = '';
    testimonials.forEach((testimonial, index) => {
        const activeClass = index === 0 ? 'active' : '';
        reviewsHTML += `
            <div class="review-item ${activeClass}">
                <div class="review-content">
                    <p class="review-text">"${testimonial.testimonial}"</p>
                    <div class="review-author">
                        <p class="author-name">${testimonial.name}</p>
                        <p class="author-title">${testimonial.title}</p>
                    </div>
                </div>
            </div>
        `;
    });
    
    reviewSlider.innerHTML = reviewsHTML;
    
    // Initialize rotation after populating
    initializeTestimonialRotation();
}

// Initialize testimonial rotation
function initializeTestimonialRotation() {
    const reviewItems = document.querySelectorAll('.review-item');
    let currentReviewIndex = 0;
    let reviewInterval;
    let isHovered = false;

    // Function to show next review
    function showNextReview() {
        if (isHovered) return; // Don't change if mouse is hovering
        
        // Hide current review
        reviewItems[currentReviewIndex].classList.remove('active');
        
        // Move to next review
        currentReviewIndex = (currentReviewIndex + 1) % reviewItems.length;
        
        // Show next review
        reviewItems[currentReviewIndex].classList.add('active');
    }

    // Start rotation interval
    function startReviewRotation() {
        reviewInterval = setInterval(showNextReview, 3000);
    }

    // Stop rotation interval
    function stopReviewRotation() {
        if (reviewInterval) {
            clearInterval(reviewInterval);
        }
    }

    // Check if review items exist
    if (reviewItems.length > 0) {
        // Start rotation
        startReviewRotation();
        
        // Add hover events to pause/resume rotation
        const reviewsContainer = document.querySelector('.client-reviews-container');
        if (reviewsContainer) {
            reviewsContainer.addEventListener('mouseenter', function() {
                isHovered = true;
                stopReviewRotation();
            });
            
            reviewsContainer.addEventListener('mouseleave', function() {
                isHovered = false;
                startReviewRotation();
            });
        }
    }
}