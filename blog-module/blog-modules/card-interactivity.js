// blog-module/blog-modules/card-interactivity.js - Card interactivity functionality

/**
 * Sets up hover effects for blog cards
 */
export function setupHoverEffects() {
    document.querySelectorAll('.blog-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 15px 30px rgba(0,115,230,0.2)';
            this.style.borderColor = 'rgba(0, 115, 230, 0.3)';

            const title = this.querySelector('.blog-title');
            if (title) title.style.color = '#00ffff';

            const readMore = this.querySelector('.blog-read-more');
            if (readMore) readMore.style.color = '#00ffff';

            const arrow = this.querySelector('.blog-read-more i');
            if (arrow) arrow.style.transform = 'translateX(5px)';

            const image = this.querySelector('.blog-img');
            if (image) image.style.transform = 'scale(1.1)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
            this.style.borderColor = '';

            const title = this.querySelector('.blog-title');
            if (title) title.style.color = '';

            const readMore = this.querySelector('.blog-read-more');
            if (readMore) readMore.style.color = '';

            const arrow = this.querySelector('.blog-read-more i');
            if (arrow) arrow.style.transform = '';

            const image = this.querySelector('.blog-img');
            if (image) image.style.transform = '';
        });
    });
}

/**
 * Creates a ripple effect when a card is clicked
 * @param {Event} event - The click event
 */
export function createRippleEffect(event) {
    const card = this;

    // Create ripple element
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    card.appendChild(ripple);

    // Set position
    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = event.clientX - rect.left - size/2 + 'px';
    ripple.style.top = event.clientY - rect.top - size/2 + 'px';

    // Remove after animation completes
    ripple.addEventListener('animationend', function() {
        ripple.remove();
    });
}

/**
 * Sets up blog card interactivity (hover effects and click)
 */
export function setupBlogCardInteractivity() {
    // 1. Add hover effects to blog cards
    setupHoverEffects();

    // 2. Make blog cards clickable
    document.querySelectorAll('.blog-card').forEach(card => {
        card.style.cursor = 'pointer'; // Change cursor to pointer to indicate clickable

        // Add click event listener to the entire card
        card.addEventListener('click', function(event) {
            // Create ripple effect for better visual feedback
            createRippleEffect.call(this, event);

            // Get the article URL and navigate to it
            const articleUrl = this.getAttribute('data-article-url');
            if (articleUrl) {
                window.location.href = articleUrl;
            }
        });

        // Prevent clicks on child links from triggering the card's click event
        card.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        });
    });
}

/**
 * Adds CSS styles for clickable blog cards
 */
export function addClickableBlogCardStyles() {
    // Create a style element if it doesn't exist
    if (!document.getElementById('clickable-blog-card-styles')) {
        const style = document.createElement('style');
        style.id = 'clickable-blog-card-styles';
        style.textContent = `
            .blog-card {
                position: relative;
                z-index: 1;
                transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
            }
            
            .blog-card::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 115, 230, 0.05);
                border-radius: 10px;
                opacity: 0;
                transition: opacity 0.3s ease;
                z-index: -1;
                pointer-events: none;
            }
            
            .blog-card:hover::after {
                opacity: 1;
            }
            
            .blog-card.active-card {
                transform: translateY(-10px) scale(1.02);
                box-shadow: 0 15px 30px rgba(0, 115, 230, 0.3);
                border-color: rgba(0, 115, 230, 0.5);
            }
            
            /* Add ripple effect for better click feedback */
            .blog-card .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(0, 255, 255, 0.1);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple {
                to {
                    transform: scale(2.5);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}