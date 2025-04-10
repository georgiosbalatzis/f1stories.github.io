// blog-module/blog-modules/pagination.js - Pagination functionality

import { setupBlogCardInteractivity } from './card-interactivity.js';
import { processImagePath } from './utils.js';

/**
 * Sets up pagination UI and events
 * @param {Array} posts - The array of posts to paginate
 */
export function setupPagination(posts) {
    const state = window.blogState;
    state.totalPages = Math.ceil(posts.length / state.POSTS_PER_PAGE);

    // Get pagination container
    const paginationList = document.querySelector('.pagination');
    if (!paginationList) return;

    // Generate page links
    let paginationHTML = `
        <li class="page-item ${state.currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" aria-label="Previous" id="pagination-prev">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
    `;

    // Determine which page numbers to show
    let startPage = Math.max(1, state.currentPage - 2);
    let endPage = Math.min(state.totalPages, startPage + 4);

    // Adjust if we're near the end
    if (endPage - startPage < 4 && startPage > 1) {
        startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <li class="page-item ${i === state.currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }

    paginationHTML += `
        <li class="page-item ${state.currentPage === state.totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" aria-label="Next" id="pagination-next">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    `;

    paginationList.innerHTML = paginationHTML;

    // Add event listeners to pagination links
    document.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Handle previous button
            if (this.id === 'pagination-prev') {
                if (state.currentPage > 1) {
                    changePage(state.currentPage - 1);
                }
                return;
            }

            // Handle next button
            if (this.id === 'pagination-next') {
                if (state.currentPage < state.totalPages) {
                    changePage(state.currentPage + 1);
                }
                return;
            }

            // Handle numbered page links
            const pageNum = parseInt(this.getAttribute('data-page'));
            if (!isNaN(pageNum)) {
                changePage(pageNum);
            }
        });
    });

    // Show/hide pagination based on number of pages
    const paginationContainer = document.querySelector('.pagination-container');
    if (paginationContainer) {
        paginationContainer.style.display = state.totalPages > 1 ? 'block' : 'none';
    }
}

/**
 * Updates pagination UI based on current page
 * @param {number} page - The current page
 */
export function updatePaginationUI(page) {
    const state = window.blogState;

    // Update current page
    state.currentPage = page;

    // Update active state for all page links
    document.querySelectorAll('.page-link[data-page]').forEach(link => {
        const pageNum = parseInt(link.getAttribute('data-page'));
        link.parentElement.classList.toggle('active', pageNum === state.currentPage);
    });

    // Update previous button state
    const prevButton = document.getElementById('pagination-prev');
    if (prevButton) {
        prevButton.parentElement.classList.toggle('disabled', state.currentPage === 1);
    }

    // Update next button state
    const nextButton = document.getElementById('pagination-next');
    if (nextButton) {
        nextButton.parentElement.classList.toggle('disabled', state.currentPage === state.totalPages);
    }
}

/**
 * Changes the current page
 * @param {number} page - The page to change to
 */
export function changePage(page) {
    const state = window.blogState;

    if (page < 1 || page > state.totalPages) return;

    state.currentPage = page;
    displayPosts(state.currentPage);

    // Scroll to top of posts section
    document.querySelector('.blog-posts').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Displays posts for a specific page
 * @param {number} page - The page number to display
 */
export function displayPosts(page) {
    const state = window.blogState;
    const blogContainer = document.querySelector('.blog-posts');
    if (!blogContainer) return;

    // Calculate which posts to show
    const startIndex = (page - 1) * state.POSTS_PER_PAGE;
    const endIndex = startIndex + state.POSTS_PER_PAGE;
    const postsToShow = state.filteredPosts.slice(startIndex, endIndex);

    // Clear existing content
    blogContainer.innerHTML = '';

    // If no posts to show
    if (postsToShow.length === 0) {
        blogContainer.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">
                    No posts found matching your criteria.
                </div>
            </div>
        `;
        return;
    }

    // Create the HTML for each post
    postsToShow.forEach(post => {
        // Extract day and month from display date
        const dateMatch = post.displayDate.match(/([A-Za-z]+) (\d+)/);
        const month = dateMatch ? dateMatch[1].substring(0, 3).toUpperCase() : 'JAN';
        const day = dateMatch ? dateMatch[2] : '1';

        // Fix image path to handle both relative and absolute paths
        const imagePath = processImagePath(state.basePath, post.image);
        const fallbackPath = state.basePath + 'blog-module/images/default-blog.jpg';

        // Create the article URL
        const articleUrl = `${state.basePath}blog-module/blog-entries/${post.id}/article.html`;

        const postHtml = `
            <div class="col-md-4 blog-card-container" data-id="${post.id}" data-tag="${post.tag || 'General'}" data-category="${post.category || 'Uncategorized'}">
                <div class="blog-card" data-article-url="${articleUrl}">
                    <div class="blog-img-container">
                        <img src="${imagePath}" alt="${post.title}" class="blog-img" onerror="this.src='${fallbackPath}'">
                        <div class="blog-date">
                            <span class="day">${day}</span>
                            <span class="month">${month}</span>
                        </div>
                    </div>
                    <div class="blog-content">
                        <h3 class="blog-title">${post.title}</h3>
                        <div class="blog-meta">
                            <span><i class="fas fa-user"></i> ${post.author}</span>
                            <span><i class="fas fa-calendar"></i> ${post.displayDate}</span>
                        </div>
                        <p class="blog-excerpt">${post.excerpt}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="post-info">
                                <span class="post-tag"><i class="fas fa-tag"></i> ${post.tag || 'General'}</span>
                                <span class="post-category ms-2"><i class="fas fa-folder"></i> ${post.category || 'Uncategorized'}</span>
                            </div>
                            <a href="${articleUrl}" class="blog-read-more" onclick="event.stopPropagation();">Read More <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        blogContainer.innerHTML += postHtml;
    });

    // Hide featured post in grid if it's included in this page
    const featuredPost = document.querySelector('.featured-post');
    const featuredPostId = featuredPost ? featuredPost.getAttribute('data-id') : null;

    if (featuredPostId) {
        const postInGrid = document.querySelector(`.blog-card-container[data-id="${featuredPostId}"]`);
        if (postInGrid) {
            postInGrid.style.display = 'none';
        }
    }

    // Add hover effects and click functionality to all blog cards
    setupBlogCardInteractivity();

    // Update pagination UI
    updatePaginationUI(page);

    // Update pagination summary
    const start = startIndex + 1;
    const end = Math.min(startIndex + postsToShow.length, state.filteredPosts.length);
    const total = state.filteredPosts.length;

    const paginationSummary = document.getElementById('pagination-summary');
    if (paginationSummary) {
        paginationSummary.textContent = `Showing ${start}-${end} of ${total} posts`;
    }
}