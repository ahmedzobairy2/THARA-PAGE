/* Ultra Responsive JavaScript for Thara Website */

(function() {
    'use strict';

    // Global variables
    let isMenuOpen = false;
    let currentSlide = 0;
    let slideInterval;
    let resizeTimeout;
    let scrollTimeout;

    // DOM Elements
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const navMenu = document.getElementById('nav-menu');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const sortButtons = document.querySelectorAll('.sort-btn');
    const categoryFilter = document.getElementById('categoryFilter');
    const cards = document.querySelectorAll('.card');
    const sliderTrack = document.getElementById('sliderTrack');
    const sliderDots = document.querySelectorAll('.dot');

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializeResponsiveFeatures();
        initializeNavigation();
        initializeSearch();
        initializeSlider();
        initializeAnimations();
        initializeAccessibility();
        initializeTouchSupport();
        initializePerformanceOptimizations();
    });

    // Initialize responsive features
    function initializeResponsiveFeatures() {
        // Viewport height fix for mobile browsers
        function setVH() {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }
        
        setVH();
        window.addEventListener('resize', debounce(setVH, 100));

        // Dynamic font size adjustment
        adjustFontSizes();
        window.addEventListener('resize', debounce(adjustFontSizes, 200));

        // Responsive image loading
        initializeLazyLoading();

        // Touch device detection
        detectTouchDevice();
    }

    // Initialize navigation
    function initializeNavigation() {
        if (hamburger && nav) {
            hamburger.addEventListener('click', toggleMobileMenu);
            
            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (isMenuOpen && !nav.contains(e.target) && !hamburger.contains(e.target)) {
                    closeMobileMenu();
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && isMenuOpen) {
                    closeMobileMenu();
                }
            });

            // Handle window resize
            window.addEventListener('resize', debounce(function() {
                if (window.innerWidth > 991) {
                    closeMobileMenu();
                }
            }, 100));
        }

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Active navigation highlighting
        highlightActiveNavigation();
        window.addEventListener('scroll', debounce(highlightActiveNavigation, 100));
    }

    // Toggle mobile menu
    function toggleMobileMenu() {
        if (isMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    // Open mobile menu
    function openMobileMenu() {
        nav.classList.add('active');
        hamburger.classList.add('active');
        hamburger.innerHTML = '<i class="fas fa-times"></i>';
        document.body.style.overflow = 'hidden';
        isMenuOpen = true;

        // Animate menu items
        const menuItems = navMenu.querySelectorAll('li');
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Close mobile menu
    function closeMobileMenu() {
        nav.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.style.overflow = '';
        isMenuOpen = false;

        // Reset menu items animation
        const menuItems = navMenu.querySelectorAll('li');
        menuItems.forEach(item => {
            item.style.transition = '';
            item.style.opacity = '';
            item.style.transform = '';
        });
    }

    // Initialize search functionality
    function initializeSearch() {
        if (searchInput && searchBtn) {
            searchBtn.addEventListener('click', performSearch);
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });

            // Real-time search
            searchInput.addEventListener('input', debounce(function() {
                if (this.value.length > 2) {
                    performSearch();
                } else if (this.value.length === 0) {
                    showAllCards();
                }
            }, 300));
        }

        // Sort buttons
        sortButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                sortButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                sortCards(this.dataset.sort);
            });
        });

        // Category filter
        if (categoryFilter) {
            categoryFilter.addEventListener('change', function() {
                filterByCategory(this.value);
            });
        }
    }

    // Perform search
    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        cards.forEach(card => {
            const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.card-description')?.textContent.toLowerCase() || '';
            const category = card.dataset.category || '';

            if (title.includes(query) || description.includes(query) || category.includes(query)) {
                showCard(card);
                visibleCount++;
            } else {
                hideCard(card);
            }
        });

        updateResultsCount(visibleCount);
        animateSearchResults();
    }

    // Show all cards
    function showAllCards() {
        cards.forEach(card => showCard(card));
        updateResultsCount(cards.length);
    }

    // Show card with animation
    function showCard(card) {
        card.style.display = 'block';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 50);
    }

    // Hide card with animation
    function hideCard(card) {
        card.style.transition = 'all 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            card.style.display = 'none';
        }, 300);
    }

    // Sort cards
    function sortCards(sortType) {
        const cardsArray = Array.from(cards);
        const container = document.querySelector('.cards-container');

        cardsArray.sort((a, b) => {
            switch (sortType) {
                case 'views':
                    return getStatValue(b, 'eye') - getStatValue(a, 'eye');
                case 'likes':
                    return getStatValue(b, 'heart') - getStatValue(a, 'heart');
                case 'favorites':
                    return getStatValue(b, 'star') - getStatValue(a, 'star');
                case 'recent':
                    return new Date(getDateValue(b)) - new Date(getDateValue(a));
                default:
                    return 0;
            }
        });

        // Animate sorting
        cardsArray.forEach((card, index) => {
            card.style.order = index;
            card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s both`;
        });
    }

    // Get stat value from card
    function getStatValue(card, iconClass) {
        const stat = card.querySelector(`.stat .fa-${iconClass}`)?.parentElement;
        return parseInt(stat?.querySelector('span')?.textContent) || 0;
    }

    // Get date value from card
    function getDateValue(card) {
        const dateElement = card.querySelector('.fa-calendar-alt')?.parentElement;
        return dateElement?.textContent.trim() || '';
    }

    // Filter by category
    function filterByCategory(category) {
        let visibleCount = 0;

        cards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                showCard(card);
                visibleCount++;
            } else {
                hideCard(card);
            }
        });

        updateResultsCount(visibleCount);
    }

    // Update results count
    function updateResultsCount(count) {
        const resultsCount = document.querySelector('.results-count');
        if (resultsCount) {
            resultsCount.textContent = count;
        }
    }

    // Initialize slider
    function initializeSlider() {
        if (sliderTrack && sliderDots.length > 0) {
            // Auto-play slider
            startSlideShow();

            // Dot navigation
            sliderDots.forEach((dot, index) => {
                dot.addEventListener('click', () => goToSlide(index));
            });

            // Pause on hover
            const sliderSection = document.querySelector('.slider-section');
            if (sliderSection) {
                sliderSection.addEventListener('mouseenter', pauseSlideShow);
                sliderSection.addEventListener('mouseleave', startSlideShow);
            }

            // Touch/swipe support
            initializeSliderTouch();
        }
    }

    // Start slideshow
    function startSlideShow() {
        clearInterval(slideInterval);
        slideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % sliderDots.length;
            goToSlide(currentSlide);
        }, 5000);
    }

    // Pause slideshow
    function pauseSlideShow() {
        clearInterval(slideInterval);
    }

    // Go to specific slide
    function goToSlide(index) {
        currentSlide = index;
        
        // Update dots
        sliderDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        // Update slide content (if multiple slides exist)
        // This would be implemented based on actual slide content
    }

    // Initialize slider touch support
    function initializeSliderTouch() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        const sliderWrapper = document.querySelector('.slider-wrapper');
        if (!sliderWrapper) return;

        sliderWrapper.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        sliderWrapper.addEventListener('touchend', function(e) {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const deltaX = endX - startX;
            const deltaY = endY - startY;

            // Only handle horizontal swipes
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    // Swipe right - previous slide
                    currentSlide = currentSlide > 0 ? currentSlide - 1 : sliderDots.length - 1;
                } else {
                    // Swipe left - next slide
                    currentSlide = (currentSlide + 1) % sliderDots.length;
                }
                goToSlide(currentSlide);
            }
        }
    }

    // Initialize animations
    function initializeAnimations() {
        // Intersection Observer for scroll animations
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

        // Observe elements for animation
        document.querySelectorAll('.card, .feature-item, .category-card').forEach(el => {
            observer.observe(el);
        });

        // Parallax effect for hero section
        initializeParallax();

        // Smooth hover effects
        initializeHoverEffects();
    }

    // Initialize parallax effects
    function initializeParallax() {
        const parallaxElements = document.querySelectorAll('.slider-section');
        
        window.addEventListener('scroll', debounce(function() {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const rate = scrolled * -0.5;
                element.style.transform = `translateY(${rate}px)`;
            });
        }, 10));
    }

    // Initialize hover effects
    function initializeHoverEffects() {
        // Card hover effects
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Button hover effects
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });

            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    // Initialize accessibility features
    function initializeAccessibility() {
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            // Tab navigation enhancement
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-navigation');
        });

        // Focus management for modal
        const modal = document.getElementById('ajaxModal');
        if (modal) {
            modal.addEventListener('show', function() {
                const focusableElements = modal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (focusableElements.length > 0) {
                    focusableElements[0].focus();
                }
            });
        }

        // ARIA labels for interactive elements
        addAriaLabels();
    }

    // Add ARIA labels
    function addAriaLabels() {
        // Search button
        if (searchBtn) {
            searchBtn.setAttribute('aria-label', 'البحث في التراث اليمني');
        }

        // Hamburger menu
        if (hamburger) {
            hamburger.setAttribute('aria-label', 'فتح القائمة');
            hamburger.setAttribute('aria-expanded', 'false');
        }

        // Sort buttons
        sortButtons.forEach(btn => {
            btn.setAttribute('aria-label', `ترتيب حسب ${btn.textContent}`);
        });

        // Cards
        cards.forEach((card, index) => {
            card.setAttribute('aria-label', `عنصر تراثي ${index + 1}`);
        });
    }

    // Initialize touch support
    function initializeTouchSupport() {
        // Add touch class to body
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
        }

        // Enhanced touch interactions for cards
        cards.forEach(card => {
            let touchStartTime = 0;

            card.addEventListener('touchstart', function() {
                touchStartTime = Date.now();
                this.classList.add('touch-active');
            }, { passive: true });

            card.addEventListener('touchend', function() {
                const touchDuration = Date.now() - touchStartTime;
                this.classList.remove('touch-active');

                // Long press detection (500ms)
                if (touchDuration > 500) {
                    this.classList.add('long-press');
                    setTimeout(() => {
                        this.classList.remove('long-press');
                    }, 200);
                }
            }, { passive: true });
        });

        // Prevent zoom on double tap for buttons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('touchend', function(e) {
                e.preventDefault();
                this.click();
            });
        });
    }

    // Initialize performance optimizations
    function initializePerformanceOptimizations() {
        // Lazy loading for images
        initializeLazyLoading();

        // Preload critical resources
        preloadCriticalResources();

        // Optimize scroll performance
        optimizeScrollPerformance();

        // Memory cleanup
        initializeMemoryCleanup();
    }

    // Lazy loading for images
    function initializeLazyLoading() {
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

        images.forEach(img => imageObserver.observe(img));
    }

    // Preload critical resources
    function preloadCriticalResources() {
        // Preload fonts
        const fontLinks = [
            'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap'
        ];

        fontLinks.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            document.head.appendChild(link);
        });
    }

    // Optimize scroll performance
    function optimizeScrollPerformance() {
        let ticking = false;

        function updateScrollEffects() {
            // Update scroll-based animations here
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        }, { passive: true });
    }

    // Memory cleanup
    function initializeMemoryCleanup() {
        // Clean up event listeners on page unload
        window.addEventListener('beforeunload', function() {
            clearInterval(slideInterval);
            
            // Remove event listeners
            document.removeEventListener('click', toggleMobileMenu);
            window.removeEventListener('resize', setVH);
            window.removeEventListener('scroll', highlightActiveNavigation);
        });
    }

    // Utility functions
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Adjust font sizes based on screen size
    function adjustFontSizes() {
        const screenWidth = window.innerWidth;
        const root = document.documentElement;

        if (screenWidth < 576) {
            root.style.fontSize = '14px';
        } else if (screenWidth < 768) {
            root.style.fontSize = '15px';
        } else if (screenWidth < 992) {
            root.style.fontSize = '16px';
        } else {
            root.style.fontSize = '16px';
        }
    }

    // Detect touch device
    function detectTouchDevice() {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            document.body.classList.add('touch-device');
        } else {
            document.body.classList.add('no-touch');
        }
    }

    // Highlight active navigation
    function highlightActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('#nav-menu a[href^="#"]');

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Animate search results
    function animateSearchResults() {
        const visibleCards = document.querySelectorAll('.card[style*="opacity: 1"]');
        visibleCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in-up');
        });
    }

    // Export functions for global access
    window.TharaResponsive = {
        toggleMobileMenu,
        performSearch,
        goToSlide,
        showCard,
        hideCard,
        sortCards,
        filterByCategory
    };

})();

