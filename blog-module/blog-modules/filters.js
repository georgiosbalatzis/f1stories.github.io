// blog-module/blog-modules/filters.js - Filter functionality

import { setupPagination, displayPosts } from './pagination.js';

/**
 * Sets up category and tag filters
 * @param {Array} posts - The array of posts to filter
 */
export function setupCategories(posts) {
    const categoriesContainer = document.querySelector('.filter-categories');
    if (!categoriesContainer) return;

    // Extract unique categories and tags
    const allCategories = [...new Set(posts.map(post => post.category || 'Uncategorized'))];
    const allTags = [...new Set(posts.map(post => post.tag || 'General'))];

    // Count posts per category
    const categoryCounts = {};
    posts.forEach(post => {
        const category = post.category || 'Uncategorized';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    // Count posts per tag
    const tagCounts = {};
    posts.forEach(post => {
        const tag = post.tag || 'General';
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });

    // Create "All" button
    let categoryButtonsHtml = `
        <button class="filter-button active" data-filter="all">
            All <span class="category-count">${posts.length}</span>
        </button>
    `;

    // Create category buttons
    allCategories.forEach(category => {
        categoryButtonsHtml += `
            <button class="filter-button" data-filter="category" data-category="${category}">
                ${category} <span class="category-count">${categoryCounts[category]}</span>
            </button>
        `;
    });

    // Create tag buttons
    allTags.forEach(tag => {
        categoryButtonsHtml += `
            <button class="filter-button" data-filter="tag" data-tag="${tag}">
                # ${tag} <span class="category-count">${tagCounts[tag]}</span>
            </button>
        `;
    });

    categoriesContainer.innerHTML = categoryButtonsHtml;

    // Add event listeners to filter buttons
    document.querySelectorAll('.filter-button').forEach(button => {
        button.addEventListener('click', function() {
            const filterType = this.getAttribute('data-filter');
            const category = this.getAttribute('data-category');
            const tag = this.getAttribute('data-tag');

            // Remove active class from all buttons
            document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Filter posts
            filterPosts(filterType, category, tag);
        });
    });
}

/**
 * Filters posts by category or tag
 * @param {string} filterType - The type of filter (all, category, tag)
 * @param {string} category - The category to filter by (when filterType is 'category')
 * @param {string} tag - The tag to filter by (when filterType is 'tag')
 */
export function filterPosts(filterType, category, tag) {
    const state = window.blogState;

    // Reset search first
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput && searchInput.value) {
        searchInput.value = '';
        const clearButton = document.querySelector('.search-clear-btn');
        if (clearButton) clearButton.style.display = 'none';
    }

    // Remove search results message
    const resultsMsg = document.querySelector('.search-results-message');
    if (resultsMsg) resultsMsg.remove();

    // Store current filter settings
    state.currentFilter = filterType;
    state.currentFilterValue = filterType === 'category' ? category : (filterType === 'tag' ? tag : null);

    // Filter posts
    if (filterType === 'all') {
        state.filteredPosts = [...state.allPosts];
    } else if (filterType === 'category') {
        state.filteredPosts = state.allPosts.filter(post => (post.category || 'Uncategorized') === category);
    } else if (filterType === 'tag') {
        state.filteredPosts = state.allPosts.filter(post => (post.tag || 'General') === tag);
    }

    // Update pagination
    setupPagination(state.filteredPosts);

    // Display first page of filtered posts
    displayPosts(1);
}