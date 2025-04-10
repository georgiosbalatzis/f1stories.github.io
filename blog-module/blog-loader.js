// blog-module/blog-loader.js - Main entry point for blog functionality
document.addEventListener('DOMContentLoaded', function() {
    // Import modules
    import('./blog-modules/utils.js').then(utils => {
        const basePath = utils.getBasePath();

        // Import other modules
        Promise.all([
            import('./blog-modules/card-interactivity.js'),
            import('./blog-modules/pagination.js'),
            import('./blog-modules/search.js'),
            import('./blog-modules/filters.js'),
            import('./blog-modules/post-display.js')
        ]).then(([cardModule, paginationModule, searchModule, filtersModule, displayModule]) => {
            // Initialize global state
            window.blogState = {
                POSTS_PER_PAGE: 6,
                currentPage: 1,
                totalPages: 1,
                allPosts: [],
                filteredPosts: [],
                currentFilter: 'all',
                currentFilterValue: null,
                basePath: basePath
            };

            // Setup the card interactivity enhancements
            cardModule.addClickableBlogCardStyles();

            // Determine which page we're on and load the appropriate blog functionality
            const path = window.location.pathname;
            if (path.includes('/blog/index.html') ||
                path.includes('/blog-module/blog/index.html') ||
                path.endsWith('/blog/') ||
                path.endsWith('/blog-module/blog/')) {
                // We're on the blog index page
                displayModule.loadBlogIndexPosts(
                    paginationModule.setupPagination,
                    paginationModule.displayPosts,
                    filtersModule.setupCategories
                );
                searchModule.setupSearch();
            } else {
                // We're on the homepage or another page
                displayModule.loadHomepageBlogPosts();
            }
        }).catch(error => {
            console.error("Error loading blog modules:", error);
        });
    }).catch(error => {
        console.error("Error loading blog utils module:", error);
    });
});