/* Enhanced Responsive JavaScript for Thara Website */

document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Navigation Toggle
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    
    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            nav.classList.toggle('active');
            
            // Change hamburger icon
            const icon = hamburger.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
                nav.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.className = 'fas fa-bars';
            }
        });
        
        // Close menu when clicking on menu items
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.className = 'fas fa-bars';
            });
        });
    }
    
    // Responsive Image Loading
    function handleResponsiveImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.complete) {
                img.addEventListener('load', function() {
                    this.style.opacity = '1';
                });
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
            }
        });
    }
    
    // Search Functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const cards = document.querySelectorAll('.card');
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;
        
        cards.forEach(card => {
            const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.card-description')?.textContent.toLowerCase() || '';
            
            if (title.includes(searchTerm) || description.includes(searchTerm) || searchTerm === '') {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update results count
        const resultsCount = document.querySelector('.results-count');
        if (resultsCount) {
            resultsCount.textContent = visibleCount;
        }
    }
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Real-time search
        searchInput.addEventListener('input', performSearch);
    }
    
    // Sort Functionality
    const sortButtons = document.querySelectorAll('.sort-btn');
    
    sortButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            sortButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const sortType = this.getAttribute('data-sort');
            sortCards(sortType);
        });
    });
    
    function sortCards(sortType) {
        const cardsContainer = document.querySelector('.cards-container');
        const cardsArray = Array.from(cards);
        
        cardsArray.sort((a, b) => {
            switch (sortType) {
                case 'views':
                    const viewsA = parseInt(a.querySelector('.stat .fas.fa-eye + span')?.textContent || '0');
                    const viewsB = parseInt(b.querySelector('.stat .fas.fa-eye + span')?.textContent || '0');
                    return viewsB - viewsA;
                    
                case 'likes':
                    const likesA = parseInt(a.querySelector('.stat .fas.fa-heart + span')?.textContent || '0');
                    const likesB = parseInt(b.querySelector('.stat .fas.fa-heart + span')?.textContent || '0');
                    return likesB - likesA;
                    
                case 'favorites':
                    const favA = parseInt(a.querySelector('.stat .fas.fa-star + span')?.textContent || '0');
                    const favB = parseInt(b.querySelector('.stat .fas.fa-star + span')?.textContent || '0');
                    return favB - favA;
                    
                case 'recent':
                    const dateA = new Date(a.querySelector('.meta-item .fas.fa-calendar-alt + span')?.textContent || '2025-01-01');
                    const dateB = new Date(b.querySelector('.meta-item .fas.fa-calendar-alt + span')?.textContent || '2025-01-01');
                    return dateB - dateA;
                    
                default:
                    return 0;
            }
        });
        
        // Re-append sorted cards
        cardsArray.forEach(card => {
            cardsContainer.appendChild(card);
        });
    }
    
    // Category Filter
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            const selectedCategory = this.value;
            let visibleCount = 0;
            
            cards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Update results count
            const resultsCount = document.querySelector('.results-count');
            if (resultsCount) {
                resultsCount.textContent = visibleCount;
            }
        });
    }
    
    // Smooth Scrolling for Internal Links
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe cards and sections
    const elementsToAnimate = document.querySelectorAll('.card, .step-item, .category-item');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
    
    // Responsive Breakpoint Detection
    function handleBreakpointChange() {
        const width = window.innerWidth;
        
        // Handle navigation visibility based on screen size
        if (width >= 992) {
            nav.style.display = 'flex';
            nav.classList.remove('active');
            hamburger.style.display = 'none';
        } else {
            nav.style.display = 'none';
            hamburger.style.display = 'block';
        }
        
        // Handle slider layout
        const sliderSlides = document.querySelectorAll('.slider-slide');
        sliderSlides.forEach(slide => {
            if (width < 768) {
                slide.style.flexDirection = 'column';
            } else {
                slide.style.flexDirection = 'row';
            }
        });
    }
    
    // Initial breakpoint check
    handleBreakpointChange();
    
    // Listen for window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleBreakpointChange, 250);
    });
    
    // Touch Support for Mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - could trigger next slide or close menu
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    const icon = hamburger.querySelector('i');
                    icon.className = 'fas fa-bars';
                }
            } else {
                // Swipe right - could trigger previous slide or open menu
                // Add functionality as needed
            }
        }
    }
    
    // Lazy Loading for Images
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Initialize lazy loading
    lazyLoadImages();
    
    // Handle responsive images
    handleResponsiveImages();
    
    // Performance optimization - debounce scroll events
    let scrollTimer;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function() {
            // Add scroll-based functionality here if needed
        }, 100);
    });
    
    // Accessibility improvements
    function improveAccessibility() {
        // Add ARIA labels to interactive elements
        const buttons = document.querySelectorAll('button:not([aria-label])');
        buttons.forEach(btn => {
            if (btn.textContent.trim()) {
                btn.setAttribute('aria-label', btn.textContent.trim());
            }
        });
        
        // Add focus indicators
        const focusableElements = document.querySelectorAll('a, button, input, select, textarea');
        focusableElements.forEach(el => {
            el.addEventListener('focus', function() {
                this.style.outline = '2px solid #667eea';
                this.style.outlineOffset = '2px';
            });
            
            el.addEventListener('blur', function() {
                this.style.outline = '';
                this.style.outlineOffset = '';
            });
        });
    }
    
    // Initialize accessibility improvements
    improveAccessibility();
    
    console.log('Enhanced responsive JavaScript loaded successfully');
});

