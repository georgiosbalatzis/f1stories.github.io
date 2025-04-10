// nav-fixer.js - Dynamically fixes navigation links across all site pages
(function() {
    // Determine the base path based on the current page location
    function getBasePath() {
        const path = window.location.pathname;

        // Special cases for root pages
        if (path === '/' || path === '/index.html') {
            return '';
        }

        // Count the number of directory levels and create relative path
        const segments = path.split('/').filter(Boolean);
        return '../'.repeat(segments.length);
    }

    // Fix all navigation links once DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        const basePath = getBasePath();

        // Define the correct paths for each navigation item
        const navMap = {
            'Home': basePath + 'index.html',
            'Episodes': basePath + 'episodes/index.html',
            'About': basePath + 'index.html#about',
            'Guests': basePath + 'index.html#guests',
            'Blog': basePath + 'blog-module/blog/index.html',
            'Contact': basePath + 'index.html#contact'
        };

        // Fix all navbar links
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            const linkText = link.textContent.trim();
            if (navMap[linkText]) {
                link.href = navMap[linkText];
            }
        });

        // Fix the logo link
        const logoLink = document.querySelector('.navbar-brand');
        if (logoLink) {
            logoLink.href = basePath + 'index.html';

            // Also fix the logo image source
            const logoImg = logoLink.querySelector('img');
            if (logoImg) {
                logoImg.src = basePath + 'images/logo.png';
                // Update the error handler too
                logoImg.setAttribute('onerror', "this.src='" + basePath + "images/logo.png'");
            }
        }

        // Fix back to blog links if present
        const backToBlogLinks = document.querySelectorAll('a[href*="blog/index.html"]');
        backToBlogLinks.forEach(link => {
            link.href = basePath + 'blog-module/blog/index.html';
        });

        // Fix scripts and stylesheets with incorrect paths
        fixResourcePaths(basePath);
    });

    // Fix paths to scripts, stylesheets, and other resources
    function fixResourcePaths(basePath) {
        // Fix CSS links
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            const href = link.getAttribute('href');
            if (href && (href.startsWith('/') ||
                href.startsWith('./') ||
                href.startsWith('../'))) {

                // Extract filename for common resources
                const filename = href.split('/').pop();

                // Common CSS files
                if (filename === 'styles.css') {
                    link.href = basePath + 'styles.css';
                } else if (filename === 'blog-styles.css') {
                    link.href = basePath + 'blog-module/blog-styles.css';
                } else if (filename === 'article-styles.css') {
                    link.href = basePath + 'blog-module/blog/article-styles.css';
                }
            }
        });

        // Fix script tags
        document.querySelectorAll('script[src]').forEach(script => {
            const src = script.getAttribute('src');
            if (src && (src.startsWith('/') ||
                src.startsWith('./') ||
                src.startsWith('../'))) {

                // Extract filename for common resources
                const filename = src.split('/').pop();

                // Common JavaScript files
                if (filename === 'script.js') {
                    script.src = basePath + 'scripts/script.js';
                } else if (filename === 'blog-loader.js') {
                    script.src = basePath + 'blog-module/blog-loader.js';
                } else if (filename === 'article-script.js') {
                    script.src = basePath + 'blog-module/blog/article-script.js';
                } else if (filename === 'background-randomizer.js') {
                    script.src = basePath + 'scripts/background-randomizer.js';
                }
            }
        });
    }
})();