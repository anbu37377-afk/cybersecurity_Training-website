// ==================== MAIN JAVASCRIPT FILE ====================

// Global error handler to prevent debugger pauses
window.addEventListener('error', function (event) {
    console.warn('JavaScript error caught:', event.error);
    event.preventDefault();
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', function (event) {
    console.warn('Unhandled promise rejection caught:', event.reason);
    event.preventDefault();
});

document.addEventListener('DOMContentLoaded', function () {
    // ==================== THEME TOGGLE FUNCTIONALITY ====================

    // Initialize all theme toggle buttons on the page
    function initializeThemeToggles() {
        const themeToggles = document.querySelectorAll('.theme-toggle');
        const html = document.documentElement;

        // Check for saved theme preference or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        html.setAttribute('data-theme', savedTheme);

        // Update all theme toggle buttons and tooltips
        updateAllThemeToggles(savedTheme);

        // Add click event listeners to all theme toggle buttons
        themeToggles.forEach(toggle => {
            toggle.addEventListener('click', function () {
                const currentTheme = html.getAttribute('data-theme');
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';

                // Update theme
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);

                // Update all toggle buttons and tooltips
                updateAllThemeToggles(newTheme);

                // Reinitialize charts for color updates (only on dashboard)
                if (typeof initializeCharts === 'function' && document.querySelector('.dashboard')) {
                    setTimeout(() => {
                        try {
                            initializeCharts();
                        } catch (error) {
                            console.warn('Chart initialization failed:', error);
                        }
                    }, 100);
                }

                // Add smooth transition effect
                document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
            });
        });
    }

    // Update all theme toggle buttons and their tooltips
    function updateAllThemeToggles(theme) {
        const themeToggles = document.querySelectorAll('.theme-toggle');

        themeToggles.forEach(toggle => {
            const icon = toggle.querySelector('i');
            if (icon) {
                // Update icon
                icon.className = theme === 'light' ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
            }

            // Update tooltip
            updateTooltip(toggle, theme);
        });
    }

    // Update tooltip for theme toggle button
    function updateTooltip(element, theme) {
        try {
            // Remove existing tooltip if any
            const existingTooltip = bootstrap.Tooltip.getInstance(element);
            if (existingTooltip) {
                existingTooltip.dispose();
            }

            // Set new tooltip text based on current theme
            const tooltipText = theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode';
            element.setAttribute('title', tooltipText);
            element.setAttribute('data-bs-toggle', 'tooltip');
            element.setAttribute('data-bs-placement', 'bottom');

            // Initialize new tooltip
            new bootstrap.Tooltip(element);
        } catch (error) {
            console.warn('Tooltip initialization failed:', error);
        }
    }

    // Initialize theme toggles on page load
    initializeThemeToggles();

    // Back to Top Button
    const backToTop = document.getElementById('backToTop');

    if (backToTop) {
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });

        backToTop.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Scroll Animations
    try {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll('.animate-fadeInUp, .animate-fadeInLeft, .animate-fadeInRight, .animate-zoomIn');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    } catch (error) {
        console.warn('Scroll animations initialization failed:', error);
    }

    // Counter Animation
    try {
        const counters = document.querySelectorAll('.counter-number');
        const counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;

                    const updateCounter = () => {
                        current += increment;
                        const suffix = counter.getAttribute('data-suffix') || '';
                        if (current < target) {
                            counter.textContent = Math.floor(current) + suffix;
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target + suffix;
                        }
                    };

                    updateCounter();
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    } catch (error) {
        console.warn('Counter animation initialization failed:', error);
    }

    // Navbar Scroll Behavior
    try {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            let lastScrollTop = 0;

            window.addEventListener('scroll', function () {
                try {
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                    if (scrollTop > lastScrollTop && scrollTop > 100) {
                        // Scrolling down
                        navbar.style.transform = 'translateY(-100%)';
                    } else {
                        // Scrolling up
                        navbar.style.transform = 'translateY(0)';
                    }

                    lastScrollTop = scrollTop;
                } catch (error) {
                    console.warn('Navbar scroll behavior failed:', error);
                }
            });
        }
    } catch (error) {
        console.warn('Navbar initialization failed:', error);
    }

    // Service Filter (for services.html)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceItems = document.querySelectorAll('.service-item');

    if (filterButtons.length > 0 && serviceItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function () {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                const filter = this.getAttribute('data-filter');

                serviceItems.forEach(item => {
                    if (filter === 'all') {
                        item.style.display = 'block';
                    } else {
                        const categories = item.getAttribute('data-category').split(' ');
                        if (categories.includes(filter)) {
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
                    }
                });
            });
        });
    }

    // Blog Category Filter (for blog.html)
    const categoryButtons = document.querySelectorAll('.category-btn');
    const blogItems = document.querySelectorAll('.blog-item');

    if (categoryButtons.length > 0 && blogItems.length > 0) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', function () {
                // Remove active class from all buttons
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                const category = this.getAttribute('data-category');

                blogItems.forEach(item => {
                    if (category === 'all') {
                        item.style.display = 'block';
                    } else {
                        const categories = item.getAttribute('data-category').split(' ');
                        if (categories.includes(category)) {
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
                    }
                });
            });
        });
    }

    // Pricing Toggle (for pricing.html)
    const monthlyBtn = document.getElementById('monthlyBtn');
    const annualBtn = document.getElementById('annualBtn');
    const monthlyPrices = document.querySelectorAll('.monthly-price');
    const annualPrices = document.querySelectorAll('.annual-price');

    if (monthlyBtn && annualBtn) {
        monthlyBtn.addEventListener('click', function () {
            monthlyBtn.classList.add('active');
            annualBtn.classList.remove('active');

            monthlyPrices.forEach(price => price.classList.remove('d-none'));
            annualPrices.forEach(price => price.classList.add('d-none'));
        });

        annualBtn.addEventListener('click', function () {
            annualBtn.classList.add('active');
            monthlyBtn.classList.remove('active');

            monthlyPrices.forEach(price => price.classList.add('d-none'));
            annualPrices.forEach(price => price.classList.remove('d-none'));
        });
    }

    // Form Validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });

    // Smooth Scroll for Anchor Links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Loading Animation
    window.addEventListener('load', function () {
        document.body.classList.add('loaded');
    });

    // Initialize Tooltips
    try {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            try {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            } catch (error) {
                console.warn('Tooltip initialization failed for element:', tooltipTriggerEl, error);
                return null;
            }
        });
    } catch (error) {
        console.warn('Tooltip initialization failed:', error);
    }

    // Initialize Popovers
    try {
        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        const popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
            try {
                return new bootstrap.Popover(popoverTriggerEl);
            } catch (error) {
                console.warn('Popover initialization failed for element:', popoverTriggerEl, error);
                return null;
            }
        });
    } catch (error) {
        console.warn('Popover initialization failed:', error);
    }

    // Auto-hide alerts after 5 seconds
    try {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => {
            setTimeout(() => {
                try {
                    const bsAlert = new bootstrap.Alert(alert);
                    bsAlert.close();
                } catch (error) {
                    console.warn('Alert closing failed:', error);
                }
            }, 5000);
        });
    } catch (error) {
        console.warn('Alert initialization failed:', error);
    }

    // Copy to Clipboard functionality
    const copyButtons = document.querySelectorAll('[data-copy]');
    copyButtons.forEach(button => {
        button.addEventListener('click', function () {
            const textToCopy = this.getAttribute('data-copy');
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="bi bi-check"></i> Copied!';
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            });
        });
    });

    // Print functionality
    const printButtons = document.querySelectorAll('[data-print]');
    printButtons.forEach(button => {
        button.addEventListener('click', function () {
            window.print();
        });
    });

    // Lazy loading for images
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });

    // ==================== NAVBAR ACTIVE STATE ====================
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (!linkPath || linkPath === '#') return;

            link.classList.remove('active');

            // Get just the filename from path
            const filename = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

            // Exact match for the filename
            if (filename === linkPath) {
                link.classList.add('active');
            }
            // Handle home page variations
            else if ((filename === 'index.html' || filename === '') && linkPath === 'index.html') {
                link.classList.add('active');
            }
            // Handle sub-pages (e.g., blog-details.html should highlight Blog)
            else if (linkPath !== 'index.html' && filename.startsWith(linkPath.replace('.html', ''))) {
                link.classList.add('active');
            }
        });
    }

    setActiveNavLink();
});

// ==================== UTILITY FUNCTIONS ====================

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

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Format date
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Generate random ID
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Console welcome message
console.log('%c🛡️ CyberSecure Academy', 'font-size: 20px; font-weight: bold; color: #007bff;');
console.log('%cWelcome to the future of cybersecurity training!', 'font-size: 14px; color: #00ff88;');
console.log('%cBuilt with passion for cybersecurity education 🚀', 'font-size: 12px; color: #666;');
