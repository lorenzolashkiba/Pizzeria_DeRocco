/**
 * Pizzeria Da Nino - Main JavaScript
 * Handles navigation, forms, QR code, animations and interactions
 * Inspired by Awwwards modern animation techniques
 */

document.addEventListener('DOMContentLoaded', function() {
    initPageLoader();
    initNavigation();
    initScrollReveal();
    initParallax();
    initCustomCursor();
    initScrollProgress();
    initMagneticButtons();
    initMenuTabs();
    initBookingForm();
    initQRCode();
    initDatePicker();
    initImageReveals();
});

/**
 * Page Loader Animation
 */
function initPageLoader() {
    const loader = document.querySelector('.page-loader');
    if (!loader) return;

    window.addEventListener('load', function() {
        setTimeout(() => {
            loader.classList.add('loaded');
            document.body.classList.add('loaded');
        }, 800);
    });
}

/**
 * Navigation
 */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Scroll effect for navbar
    if (navbar && !navbar.classList.contains('navbar-light')) {
        let lastScroll = 0;

        window.addEventListener('scroll', function() {
            const currentScroll = window.scrollY;

            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    }
}

/**
 * Scroll Reveal Animations
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children, ' +
        '.specialty-card, .info-card, .menu-item, .about-image, .about-content, ' +
        '.section-header, .menu-section-header, .booking-form-wrapper, .booking-info'
    );

    if (revealElements.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');

                // Add stagger delay for grid items
                if (entry.target.classList.contains('specialty-card') ||
                    entry.target.classList.contains('info-card') ||
                    entry.target.classList.contains('menu-item')) {
                    const siblings = entry.target.parentElement.children;
                    const index = Array.from(siblings).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }

                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        // Add reveal class if not already present
        if (!el.classList.contains('reveal') &&
            !el.classList.contains('reveal-left') &&
            !el.classList.contains('reveal-right') &&
            !el.classList.contains('reveal-scale') &&
            !el.classList.contains('stagger-children')) {
            el.classList.add('reveal');
        }
        revealObserver.observe(el);
    });
}

/**
 * Parallax Effect
 */
function initParallax() {
    const hero = document.querySelector('.hero');
    const parallaxElements = document.querySelectorAll('.parallax-bg');

    if (!hero && parallaxElements.length === 0) return;

    let ticking = false;

    function updateParallax() {
        const scrollY = window.scrollY;

        // Hero parallax
        if (hero) {
            const heroHeight = hero.offsetHeight;
            if (scrollY < heroHeight) {
                const yPos = scrollY * 0.5;
                hero.style.backgroundPositionY = `calc(50% + ${yPos}px)`;
            }
        }

        // Other parallax elements
        parallaxElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const speed = el.dataset.speed || 0.3;

            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yPos = (rect.top - window.innerHeight / 2) * speed;
                el.style.transform = `translateY(${yPos}px)`;
            }
        });

        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

/**
 * Custom Cursor (Desktop only)
 */
function initCustomCursor() {
    // Only on desktop with fine pointer
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Dot follows immediately
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    // Smooth cursor follow
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;

        cursorX += dx * 0.15;
        cursorY += dy * 0.15;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects
    const hoverTargets = document.querySelectorAll('a, button, .btn, .specialty-card, .menu-item');

    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });

        target.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });

    // Click effect
    document.addEventListener('mousedown', () => {
        cursor.classList.add('cursor-click');
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('cursor-click');
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorDot.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
    });
}

/**
 * Scroll Progress Indicator
 */
function initScrollProgress() {
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    document.body.appendChild(progress);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollTop / docHeight;

        progress.style.transform = `scaleX(${scrollPercent})`;
    });
}

/**
 * Magnetic Buttons
 */
function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.btn-primary, .btn-secondary');

    // Only on desktop
    if (window.matchMedia('(pointer: coarse)').matches) return;

    magneticButtons.forEach(btn => {
        btn.classList.add('btn-magnetic', 'btn-shine');

        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

/**
 * Image Reveal Animations
 */
function initImageReveals() {
    const images = document.querySelectorAll('.about-image, .specialty-image');

    images.forEach(img => {
        img.classList.add('img-reveal');
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                imgObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    images.forEach(img => {
        imgObserver.observe(img);
    });
}

/**
 * Menu Tabs (active state on scroll)
 */
function initMenuTabs() {
    const menuTabs = document.querySelectorAll('.menu-tabs a');
    const menuSections = document.querySelectorAll('.menu-section');

    if (menuTabs.length === 0 || menuSections.length === 0) return;

    // Smooth scroll to section on click
    menuTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const menuNavHeight = document.querySelector('.menu-nav-wrapper')?.offsetHeight || 0;
                const offset = navHeight + menuNavHeight + 20;

                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active tab on scroll
    function updateActiveTab() {
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const menuNavHeight = document.querySelector('.menu-nav-wrapper')?.offsetHeight || 0;
        const offset = navHeight + menuNavHeight + 50;

        let currentSection = '';

        menuSections.forEach(section => {
            const sectionTop = section.offsetTop - offset;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        menuTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('href') === `#${currentSection}`) {
                tab.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveTab);
    updateActiveTab();
}

/**
 * Booking Form
 */
function initBookingForm() {
    const form = document.getElementById('bookingForm');
    const formSuccess = document.getElementById('formSuccess');

    if (!form) return;

    // Add focus animations to inputs
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Simple validation
        if (!data.name || !data.phone || !data.date || !data.time || !data.guests) {
            showFormError('Per favore compila tutti i campi obbligatori.');
            return;
        }

        // Validate phone number
        const phoneRegex = /^[\d\s\+\-\(\)]{8,20}$/;
        if (!phoneRegex.test(data.phone)) {
            showFormError('Per favore inserisci un numero di telefono valido.');
            return;
        }

        // Validate date (must be in the future)
        const selectedDate = new Date(data.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            showFormError('Per favore seleziona una data futura.');
            return;
        }

        // Check if it's Monday (closed)
        if (selectedDate.getDay() === 1) {
            showFormError('Siamo chiusi il lunedì. Per favore scegli un altro giorno.');
            return;
        }

        // Simulate form submission with animation
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="btn-loading"></span> Invio in corso...';

        // Simulate API call
        setTimeout(() => {
            form.style.opacity = '0';
            form.style.transform = 'translateY(-20px)';

            setTimeout(() => {
                form.style.display = 'none';
                formSuccess.style.display = 'block';
                formSuccess.style.opacity = '0';
                formSuccess.style.transform = 'translateY(20px)';

                requestAnimationFrame(() => {
                    formSuccess.style.transition = 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)';
                    formSuccess.style.opacity = '1';
                    formSuccess.style.transform = 'translateY(0)';
                });
            }, 300);

            // Log data for demo purposes
            console.log('Prenotazione inviata:', data);
        }, 1500);
    });
}

function showFormError(message) {
    // Remove existing error
    const existingError = document.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }

    // Create error element with animation
    const error = document.createElement('div');
    error.className = 'form-error';
    error.style.cssText = `
        background-color: #FFEBEE;
        color: #C62828;
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 16px;
        font-size: 14px;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
    `;
    error.textContent = message;

    // Insert at top of form
    const form = document.getElementById('bookingForm');
    form.insertBefore(error, form.firstChild);

    // Animate in
    requestAnimationFrame(() => {
        error.style.opacity = '1';
        error.style.transform = 'translateY(0)';
    });

    // Remove after 5 seconds with animation
    setTimeout(() => {
        error.style.opacity = '0';
        error.style.transform = 'translateY(-10px)';
        setTimeout(() => error.remove(), 300);
    }, 5000);
}

function resetForm() {
    const form = document.getElementById('bookingForm');
    const formSuccess = document.getElementById('formSuccess');
    const submitBtn = form.querySelector('button[type="submit"]');

    formSuccess.style.opacity = '0';
    formSuccess.style.transform = 'translateY(20px)';

    setTimeout(() => {
        form.reset();
        formSuccess.style.display = 'none';
        form.style.display = 'flex';
        form.style.opacity = '0';
        form.style.transform = 'translateY(20px)';

        requestAnimationFrame(() => {
            form.style.transition = 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)';
            form.style.opacity = '1';
            form.style.transform = 'translateY(0)';
        });

        submitBtn.disabled = false;
        submitBtn.textContent = 'Invia Prenotazione';
    }, 300);
}

// Make resetForm available globally
window.resetForm = resetForm;

/**
 * Date Picker - Set minimum date to today
 */
function initDatePicker() {
    const dateInput = document.getElementById('date');
    if (!dateInput) return;

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    dateInput.min = `${year}-${month}-${day}`;

    // Set max date to 60 days from now
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 60);
    const maxYear = maxDate.getFullYear();
    const maxMonth = String(maxDate.getMonth() + 1).padStart(2, '0');
    const maxDay = String(maxDate.getDate()).padStart(2, '0');

    dateInput.max = `${maxYear}-${maxMonth}-${maxDay}`;
}

/**
 * QR Code Generator
 */
function initQRCode() {
    const qrToggle = document.getElementById('qrToggle');
    const qrPopup = document.getElementById('qrPopup');
    const qrClose = document.getElementById('qrClose');

    if (!qrToggle || !qrPopup) return;

    // Toggle popup (QR code image is already in HTML)
    qrToggle.addEventListener('click', function() {
        qrPopup.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    qrClose.addEventListener('click', function() {
        qrPopup.classList.remove('active');
        document.body.style.overflow = '';
    });

    qrPopup.addEventListener('click', function(e) {
        if (e.target === qrPopup) {
            qrPopup.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && qrPopup.classList.contains('active')) {
            qrPopup.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Generate QR Code using simple canvas
 */
function generateQRCode(container) {
    // Get the current menu page URL
    const menuUrl = window.location.origin + '/menu.html';

    // Create a simple QR code placeholder with the URL
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');

    // Draw QR code pattern (simplified visual representation)
    const size = 200;
    const moduleSize = 8;
    const modules = Math.floor(size / moduleSize);

    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    // Draw pattern
    ctx.fillStyle = '#2D2D2D';

    // Position patterns (corners)
    drawFinderPattern(ctx, 0, 0, moduleSize);
    drawFinderPattern(ctx, size - 7 * moduleSize, 0, moduleSize);
    drawFinderPattern(ctx, 0, size - 7 * moduleSize, moduleSize);

    // Generate pseudo-random pattern for data area
    const seed = hashString(menuUrl);
    for (let row = 0; row < modules; row++) {
        for (let col = 0; col < modules; col++) {
            // Skip finder pattern areas
            if (isInFinderPattern(row, col, modules)) continue;

            // Pseudo-random based on position and seed
            const isBlack = ((row * col + seed) % 3 === 0) ||
                           ((row + col + seed) % 5 === 0);

            if (isBlack) {
                ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize - 1, moduleSize - 1);
            }
        }
    }

    container.innerHTML = '';
    container.appendChild(canvas);

    // Add text below
    const urlText = document.createElement('p');
    urlText.style.cssText = 'font-size: 10px; color: #666; margin-top: 8px; word-break: break-all;';
    urlText.textContent = menuUrl;
    container.appendChild(urlText);
}

function drawFinderPattern(ctx, x, y, moduleSize) {
    // Outer square
    ctx.fillRect(x, y, 7 * moduleSize, moduleSize);
    ctx.fillRect(x, y + 6 * moduleSize, 7 * moduleSize, moduleSize);
    ctx.fillRect(x, y, moduleSize, 7 * moduleSize);
    ctx.fillRect(x + 6 * moduleSize, y, moduleSize, 7 * moduleSize);

    // Inner square
    ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize);
}

function isInFinderPattern(row, col, modules) {
    // Top-left
    if (row < 8 && col < 8) return true;
    // Top-right
    if (row < 8 && col >= modules - 8) return true;
    // Bottom-left
    if (row >= modules - 8 && col < 8) return true;
    return false;
}

function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

/**
 * Smooth Scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
            const menuNavHeight = document.querySelector('.menu-nav-wrapper')?.offsetHeight || 0;
            const offset = navHeight + menuNavHeight + 20;

            window.scrollTo({
                top: target.offsetTop - offset,
                behavior: 'smooth'
            });
        }
    });
});

/**
 * Click to Call tracking (for analytics)
 */
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', function() {
        // Track phone call clicks
        console.log('Phone click:', this.href);

        // If you have analytics:
        // gtag('event', 'click', { event_category: 'Contact', event_label: 'Phone Call' });
    });
});

/**
 * External link handler
 */
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    if (!link.hasAttribute('rel')) {
        link.setAttribute('rel', 'noopener noreferrer');
    }
});

/**
 * Lazy loading images with fade in
 */
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';

    img.addEventListener('load', function() {
        this.style.opacity = '1';
    });

    // If already loaded
    if (img.complete) {
        img.style.opacity = '1';
    }
});
