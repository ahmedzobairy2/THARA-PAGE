/* Enhanced Mobile Menu JavaScript for Thara Website */

(function() {
    'use strict';

    // Global variables
    let isMenuOpen = false;
    let touchStartX = 0;
    let touchStartY = 0;

    // DOM Elements
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const navMenu = document.getElementById('nav-menu');
    const authButtons = document.querySelector('.auth-buttons');
    const body = document.body;
    const header = document.querySelector('header');

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializeMobileMenu();
        initializeSwipeGestures();
        initializeKeyboardNavigation();
        initializeAccessibility();
    });

    // Initialize mobile menu
    function initializeMobileMenu() {
        if (!hamburger || !nav) return;

        // Create mobile menu overlay
        createMobileOverlay();

        // Hamburger click event
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

        // Close menu when clicking on nav links
        if (navMenu) {
            navMenu.addEventListener('click', function(e) {
                if (e.target.tagName === 'A') {
                    setTimeout(() => closeMobileMenu(), 300);
                }
            });
        }
    }

    // Create mobile overlay
    function createMobileOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay';
        overlay.id = 'mobileOverlay';
        document.body.appendChild(overlay);

        overlay.addEventListener('click', closeMobileMenu);
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
        if (isMenuOpen) return;

        isMenuOpen = true;
        
        // Add classes
        nav.classList.add('active');
        hamburger.classList.add('active');
        body.classList.add('menu-open');
        
        // Show overlay
        const overlay = document.getElementById('mobileOverlay');
        if (overlay) {
            overlay.classList.add('active');
        }

        // Prevent body scroll
        body.style.overflow = 'hidden';
        
        // Show auth buttons in mobile
        if (authButtons) {
            setTimeout(() => {
                authButtons.classList.add('show');
            }, 200);
        }

        // Animate menu items
        animateMenuItems('in');

        // Update hamburger aria-label
        hamburger.setAttribute('aria-label', 'إغلاق القائمة');
        hamburger.setAttribute('aria-expanded', 'true');

        // Focus management
        setTimeout(() => {
            const firstMenuItem = navMenu?.querySelector('a');
            if (firstMenuItem) {
                firstMenuItem.focus();
            }
        }, 300);

        // Add haptic feedback on mobile devices
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    // Close mobile menu
    function closeMobileMenu() {
        if (!isMenuOpen) return;

        isMenuOpen = false;

        // Animate menu items out
        animateMenuItems('out');

        setTimeout(() => {
            // Remove classes
            nav.classList.remove('active');
            hamburger.classList.remove('active');
            body.classList.remove('menu-open');
            
            // Hide overlay
            const overlay = document.getElementById('mobileOverlay');
            if (overlay) {
                overlay.classList.remove('active');
            }

            // Restore body scroll
            body.style.overflow = '';
            
            // Hide auth buttons
            if (authButtons) {
                authButtons.classList.remove('show');
            }
        }, 200);

        // Update hamburger aria-label
        hamburger.setAttribute('aria-label', 'فتح القائمة');
        hamburger.setAttribute('aria-expanded', 'false');

        // Return focus to hamburger
        hamburger.focus();
    }

    // Animate menu items
    function animateMenuItems(direction) {
        if (!navMenu) return;

        const menuItems = navMenu.querySelectorAll('li');
        
        menuItems.forEach((item, index) => {
            if (direction === 'in') {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-50px)';
                
                setTimeout(() => {
                    item.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, index * 100);
            } else {
                item.style.transition = 'all 0.2s ease-out';
                item.style.opacity = '0';
                item.style.transform = 'translateX(-30px)';
                
                setTimeout(() => {
                    item.style.transition = '';
                    item.style.opacity = '';
                    item.style.transform = '';
                }, 200);
            }
        });
    }

    // Initialize swipe gestures
    function initializeSwipeGestures() {
        // Swipe to close menu
        nav.addEventListener('touchstart', handleTouchStart, { passive: true });
        nav.addEventListener('touchend', handleTouchEnd, { passive: true });

        // Swipe from edge to open menu
        document.addEventListener('touchstart', handleEdgeSwipeStart, { passive: true });
        document.addEventListener('touchend', handleEdgeSwipeEnd, { passive: true });
    }

    // Handle touch start
    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }

    // Handle touch end
    function handleTouchEnd(e) {
        if (!isMenuOpen) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Swipe left to close menu
        if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < -100) {
            closeMobileMenu();
        }
    }

    // Handle edge swipe start
    function handleEdgeSwipeStart(e) {
        if (isMenuOpen || window.innerWidth > 991) return;
        
        const touch = e.touches[0];
        if (touch.clientX < 20) { // Edge swipe area
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        }
    }

    // Handle edge swipe end
    function handleEdgeSwipeEnd(e) {
        if (isMenuOpen || window.innerWidth > 991) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Swipe right from edge to open menu
        if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 100 && touchStartX < 20) {
            openMobileMenu();
        }
    }

    // Initialize keyboard navigation
    function initializeKeyboardNavigation() {
        if (!navMenu) return;

        navMenu.addEventListener('keydown', function(e) {
            if (!isMenuOpen) return;

            const menuItems = Array.from(navMenu.querySelectorAll('a'));
            const currentIndex = menuItems.indexOf(document.activeElement);

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % menuItems.length;
                    menuItems[nextIndex].focus();
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
                    menuItems[prevIndex].focus();
                    break;
                    
                case 'Home':
                    e.preventDefault();
                    menuItems[0].focus();
                    break;
                    
                case 'End':
                    e.preventDefault();
                    menuItems[menuItems.length - 1].focus();
                    break;
            }
        });
    }

    // Initialize accessibility features
    function initializeAccessibility() {
        // Set initial ARIA attributes
        if (hamburger) {
            hamburger.setAttribute('aria-label', 'فتح القائمة');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-controls', 'nav-menu');
        }

        if (nav) {
            nav.setAttribute('aria-hidden', 'true');
        }

        if (navMenu) {
            navMenu.setAttribute('role', 'menu');
            
            // Set role for menu items
            const menuItems = navMenu.querySelectorAll('a');
            menuItems.forEach(item => {
                item.setAttribute('role', 'menuitem');
            });
        }

        // Update ARIA attributes when menu state changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const isActive = nav.classList.contains('active');
                    nav.setAttribute('aria-hidden', !isActive);
                }
            });
        });

        if (nav) {
            observer.observe(nav, { attributes: true });
        }
    }

    // Debounce function
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

    // Add CSS for menu-open state
    const style = document.createElement('style');
    style.textContent = `
        body.menu-open {
            overflow: hidden !important;
        }
        
        @media (max-width: 575.98px) {
            body.menu-open .auth-buttons.show {
                opacity: 1 !important;
                pointer-events: all !important;
            }
        }
        
        /* Smooth transitions for all menu elements */
        #nav, .hamburger, .mobile-menu-overlay {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Focus styles for better accessibility */
        #nav-menu a:focus {
            outline: 2px solid rgba(255, 255, 255, 0.8);
            outline-offset: 2px;
            background: rgba(255, 255, 255, 0.2);
        }
        
        .hamburger:focus {
            outline: 2px solid rgba(255, 255, 255, 0.8);
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);

})();

