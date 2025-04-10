// blog-module/blog-modules/utils.js - Utility functions for blog functionality

/**
 * Determines the base path based on the current location
 * @returns {string} The base path for assets
 */
export function getBasePath() {
    // If we're on the root page (index.html), use relative paths
    if (window.location.pathname === '/' ||
        window.location.pathname === '/index.html' ||
        window.location.pathname.endsWith('/pages/') ||
        window.location.pathname.endsWith('/pages/index.html')) {
        return '';
    }
    // Otherwise, use absolute paths
    return '/';
}

/**
 * Processes image paths to handle both relative and absolute paths
 * @param {string} basePath - The base path
 * @param {string} imagePath - The image path to process
 * @returns {string} The processed image path
 */
export function processImagePath(basePath, imagePath) {
    // If imagePath is empty or undefined, return the default image
    if (!imagePath) {
        return basePath + 'blog-module/images/default-blog.jpg';
    }

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
        return imagePath;
    }

    // If it's an absolute path, make sure to handle it properly
    if (imagePath.startsWith('/')) {
        return basePath + imagePath.substring(1);
    }

    // If it's a relative path, just prepend the base path
    return basePath + imagePath;
}

/**
 * Extracts day and month from a display date
 * @param {string} displayDate - The display date in "Month Day" format
 * @returns {Object} An object with day and month properties
 */
export function extractDateParts(displayDate) {
    const dateMatch = displayDate.match(/([A-Za-z]+) (\d+)/);
    return {
        month: dateMatch ? dateMatch[1].substring(0, 3).toUpperCase() : 'JAN',
        day: dateMatch ? dateMatch[2] : '1'
    };
}

/**
 * Highlights text with the search term
 * @param {string} text - The text to highlight
 * @param {string} searchTerm - The search term to highlight
 * @returns {string} The text with search term highlighted
 */
export function highlightText(text, searchTerm) {
    if (!searchTerm) return text;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}