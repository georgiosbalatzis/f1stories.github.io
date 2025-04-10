// blog-module/blog-modules/search.js - Search functionality

import { setupPagination, displayPosts } from './pagination.js';
import { highlightText } from './utils.js';

/**
 * Sets up search functionality
 */
export function setupSearch() {
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');

    if (!searchInput || !searchButton) return;

    // Add clear button to search input
    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'search-wrapper position-relative';
    searchInput.parentNode.insertBefore(searchWrapper, searchInput);
    searchWrapper.appendChild(searchInput);

    const clearButton = document.createElement('button');
    clearButton.className = 'search-clear-btn';
    clearButton.innerHTML = '<i class="fas fa-times"></i>';
    clearButton.style.display = 'none';
    searchWrapper.appendChild(clearButton);

    // Show/hide clear button based on input content
    searchInput.addEventListener('input', function() {
        clearButton.style.display = this.value ? 'block' : 'none';
    });

    // Clear search when button is clicked
    clearButton.addEventListener('click', function() {
        searchInput.value = '';
        clearButton.style.display = 'none';
        resetSearch();
    });

    const performSearch = () => {
        const state = window.blogState;
        const searchTerm = searchInput.value.toLowerCase().trim();

        if (searchTerm === '') {
            resetSearch();
            return;
        }

        // Filter posts by search term
        state.filteredPosts = state.allPosts.filter(post => {
            const title = post.title.toLowerCase();
            const excerpt = post.excerpt.toLowerCase();
            const author = post.author.toLowerCase();
            const tag = (post.tag || 'General').toLowerCase();
            const category = (post.category || 'Uncategorized').toLowerCase();

            return title.includes(searchTerm) ||
                excerpt.includes(searchTerm) ||
                author.includes(searchTerm) ||
                tag.includes(searchTerm) ||
                category.includes(searchTerm);
        });

        // Reset category filters - remove 'active' class from all buttons
        document.querySelectorAll('.filter-button').forEach(btn => {
            btn.classList.remove('active');
        });

        // Update pagination for search results
        setupPagination(state.filteredPosts);

        // Display first page of search results
        displayPosts(1);

        // Show search results message
        updateSearchResultsMessage(searchTerm, state.filteredPosts.length);

        // Highlight matching text in visible posts
        setTimeout(() => {
            document.querySelectorAll('.blog-card-container').forEach(card => {
                if (card.style.display !== 'none') {
                    highlightMatchingText(card, searchTerm);
                }
            });
        }, 100);
    };

    function resetSearch() {
        const state = window.blogState;

        // Reset filtered posts to all posts
        state.filteredPosts = [...state.allPosts];

        // Update pagination
        setupPagination(state.filteredPosts);

        // Display first page
        displayPosts(1);

        // Remove search results message
        const resultsMsg = document.querySelector('.search-results-message');
        if (resultsMsg) resultsMsg.remove();

        // Remove highlights
        document.querySelectorAll('.highlight').forEach(el => {
            el.outerHTML = el.innerHTML;
        });

        // Reset category filters - set "All" as active
        document.querySelectorAll('.filter-button').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === 'all') {
                btn.classList.add('active');
            }
        });
    }

    function updateSearchResultsMessage(searchTerm, count) {
        // Remove existing message
        const existingMsg = document.querySelector('.search-results-message');
        if (existingMsg) existingMsg.remove();

        // Create new message
        const resultsMsg = document.createElement('div');
        resultsMsg.className = 'search-results-message mt-3 mb-4 text-center';
        resultsMsg.innerHTML = `
            <span>Found ${count} result${count !== 1 ? 's' : ''} for "${searchTerm}"</span>
            <button class="btn btn-sm btn-outline-info ms-3 clear-search">Clear</button>
        `;

        // Add to DOM
        const blogPosts = document.querySelector('.blog-posts');
        if (blogPosts) {
            blogPosts.parentNode.insertBefore(resultsMsg, blogPosts);
        }

        // Add clear search button functionality
        document.querySelector('.clear-search').addEventListener('click', () => {
            searchInput.value = '';
            clearButton.style.display = 'none';
            resetSearch();
        });
    }

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
            e.preventDefault();
        }
    });
}

/**
 * Highlights matching text in search results
 * @param {HTMLElement} card - The blog card element
 * @param {string} searchTerm - The search term to highlight
 */
export function highlightMatchingText(card, searchTerm) {
    // Remove existing highlights
    card.querySelectorAll('.highlight').forEach(el => {
        el.outerHTML = el.innerHTML;
    });

    // Highlight in title
    const title = card.querySelector('.blog-title');
    title.innerHTML = highlightText(title.textContent, searchTerm);

    // Highlight in excerpt
    const excerpt = card.querySelector('.blog-excerpt');
    excerpt.innerHTML = highlightText(excerpt.textContent, searchTerm);
}