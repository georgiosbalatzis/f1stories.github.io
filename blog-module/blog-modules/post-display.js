// blog-module/blog-modules/post-display.js - Post display functionality

import { processImagePath } from './utils.js';
import { setupBlogCardInteractivity } from './card-interactivity.js';

/**
 * Sets up the featured post display
 * @param {Object} post - The post to feature
 */
export function setupFeaturedPost(post) {
    const state = window.blogState;
    const featuredPost = document.querySelector('.featured-post');
    if (!featuredPost || !post) return;

    // Extract day and month from display date
    const dateMatch = post.displayDate.match(/([A-Za-z]+) (\d+)/);
    const month = dateMatch ? dateMatch[1].substring(0, 3).toUpperCase() : 'JAN';
    const day = dateMatch ? dateMatch[2] : '1';

    // Use backgroundImage if available, otherwise use regular image
    let bgImage = post.backgroundImage || post.image;
    const processedImage = processImagePath(state.basePath, bgImage);
    const fallbackPath = state.basePath + 'blog-module/images/default-blog-bg.jpg';

    // Create the article URL
    const articleUrl = `${state.basePath}blog-module/blog-entries/${post.id}/article.html`;

    // Store the post ID as a data attribute
    featuredPost.setAttribute('data-id', post.id);
    // Store the article URL as data attribute for click handling
    featuredPost.setAttribute('data-article-url', articleUrl);

    // Create a rich featured post with more details
    featuredPost.innerHTML = `
        <img src="${processedImage}" alt="${post.title}" class="featured-post-img" onerror="this.src='${fallbackPath}'">
        <div class="featured-post-overlay">
            <div class="d-flex justify-content-between align-items-start mb-3">
                <span class="featured-tag">Featured</span>
                <div class="featured-date">
                    <span class="day">${day}</span>
                    <span class="month">${month}</span>
                </div>
            </div>
            <h2 class="featured-post-title">${post.title}</h2>
            <div class="blog-meta mb-3 text-light">
                <span><i class="fas fa-user"></i> ${post.author}</span>
                <span><i class="fas fa-calendar"></i> ${post.displayDate}</span>
                <span><i class="fas fa-tag"></i> ${post.tag || 'General'}</span>
                <span><i class="fas fa-folder"></i> ${post.category || 'Uncategorized'}</span>
            </div>
            <p class="featured-post-excerpt">${post.excerpt}</p>
            <div class="d-flex align-items-center justify-content-between">
                <a href="${articleUrl}" class="blog-read-more" onclick="event.stopPropagation();">Read Full Article <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    `;

    // Make the entire featured post clickable
    featuredPost.style.cursor = 'pointer';
    featuredPost.addEventListener('click', function(e) {
        // Don't trigger if they clicked on the read more link (it has its own destination)
        if (e.target.closest('.blog-read-more')) return;

        const articleUrl = this.getAttribute('data-article-url');
        if (articleUrl) {
            window.location.href = articleUrl;
        }
    });

    // Add hover effect to featured post
    featuredPost.addEventListener('mouseenter', function() {
        const img = this.querySelector('.featured-post-img');
        if (img) img.style.transform = 'scale(1.03)';

        const readMore = this.querySelector('.blog-read-more');
        if (readMore) readMore.style.color = '#00ffff';

        const arrow = this.querySelector('.blog-read-more i');
        if (arrow) arrow.style.transform = 'translateX(5px)';

        this.style.boxShadow = '0 15px 30px rgba(0,115,230,0.3)';
    });

    featuredPost.addEventListener('mouseleave', function() {
        const img = this.querySelector('.featured-post-img');
        if (img) img.style.transform = '';

        const readMore = this.querySelector('.blog-read-more');
        if (readMore) readMore.style.color = '';

        const arrow = this.querySelector('.blog-read-more i');
        if (arrow) arrow.style.transform = '';

        this.style.boxShadow = '';
    });

    // Hide this post in the main grid to avoid duplication
    const postInGrid = document.querySelector(`.blog-card-container[data-id="${post.id}"]`);
    if (postInGrid) {
        postInGrid.style.display = 'none';
    }
}

/**
 * Loads blog posts for the homepage
 */
export function loadHomepageBlogPosts() {
    const state = window.blogState;
    const blogSection = document.getElementById('blog');
    if (!blogSection) return;

    const blogPostsContainer = blogSection.querySelector('.blog-posts');
    if (!blogPostsContainer) return;

    // Add loading indicator
    blogPostsContainer.innerHTML = `
        <div class="col-12 text-center">
            <div class="spinner-border text-light" role="status">
                <span class="visually-hidden">Loading blog posts...</span>
            </div>
        </div>
    `;

    // Use a path that works with any base URL
    fetch(state.basePath + 'blog-module/blog-data.json')
        .then(response => {
            if (!response.ok) {
                // Try relative path as fallback
                return fetch('blog-module/blog-data.json');
            }
            return response;
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Sort posts by date (most recent first)
            const sortedPosts = data.posts.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });

            // Take the 3 most recent posts
            const recentPosts = sortedPosts.slice(0, 3);

            // Clear existing content
            blogPostsContainer.innerHTML = '';

            // Create the HTML for each post
            recentPosts.forEach(post => {
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
                    <div class="col-md-4">
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
                                    <span><i class="fas fa-comments"></i> ${post.comments}</span>
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

                blogPostsContainer.innerHTML += postHtml;
            });

            // Add hover effects and click functionality to blog cards
            setupBlogCardInteractivity();
        })
        .catch(error => {
            console.error('Error loading blog posts:', error);
            blogPostsContainer.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger">
                        Unable to load blog posts. Please try again later.
                    </div>
                </div>
            `;
        });
}

/**
 * Loads blog posts for the blog index page with pagination
 * @param {Function} setupPaginationFn - Function to set up pagination
 * @param {Function} displayPostsFn - Function to display posts
 * @param {Function} setupCategoriesFn - Function to set up categories
 */
export function loadBlogIndexPosts(setupPaginationFn, displayPostsFn, setupCategoriesFn) {
    const state = window.blogState;

    // Detect if we're on the blog index page by checking URL patterns
    const path = window.location.pathname;
    if (!path.includes('/blog/index.html') &&
        !path.includes('/blog-module/blog/index.html') &&
        !path.endsWith('/blog/') &&
        !path.endsWith('/blog-module/blog/')) {
        return;
    }

    const blogContainer = document.querySelector('.blog-posts');
    if (!blogContainer) return;

    // Add loading indicator
    blogContainer.innerHTML = `
        <div class="col-12 text-center">
            <div class="spinner-border text-light" role="status">
                <span class="visually-hidden">Loading blog posts...</span>
            </div>
        </div>
    `;

    // Try multiple path options for better compatibility
    fetch(state.basePath + 'blog-module/blog-data.json')
        .then(response => {
            if (!response.ok) {
                // Try relative path as fallback
                return fetch('../../blog-module/blog-data.json');
            }
            return response;
        })
        .then(response => {
            if (!response.ok) {
                // Try one more level up
                return fetch('../blog-data.json');
            }
            return response;
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Sort posts by date (most recent first)
            state.allPosts = data.posts.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });

            // Set up filteredPosts and pagination initially
            state.filteredPosts = [...state.allPosts];
            setupPaginationFn(state.filteredPosts);

            // Display first page of posts
            displayPostsFn(1);

            // Setup categories and tags for filtering
            setupCategoriesFn(state.allPosts);

            // Setup featured post (always use the most recent post)
            if (state.allPosts.length > 0) {
                setupFeaturedPost(state.allPosts[0]);
            }
        })
        .catch(error => {
            console.error('Error loading blog posts:', error);
            blogContainer.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger">
                        Unable to load blog posts. Please try again later.
                    </div>
                </div>
            `;
        });
}