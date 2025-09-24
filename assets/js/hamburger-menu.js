// Hamburger Menu Functionality
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initializeHamburgerMenu();
    });

    function initializeHamburgerMenu() {
        const hamburger = document.getElementById('hamburger');
        const nav = document.getElementById('nav');

        if (hamburger && nav) {
            hamburger.addEventListener('click', function() {
                nav.classList.toggle('active');
                hamburger.classList.toggle('active');

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
                    hamburger.classList.remove('active');
                    const icon = hamburger.querySelector('i');
                    icon.className = 'fas fa-bars';
                }
            });

            // Close menu when clicking on a link
            const navLinks = nav.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    nav.classList.remove('active');
                    hamburger.classList.remove('active');
                    const icon = hamburger.querySelector('i');
                    icon.className = 'fas fa-bars';
                });
            });
        }
    }
})();