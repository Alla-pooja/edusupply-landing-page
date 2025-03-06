// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const themeToggle = document.getElementById('themeToggle');
const testimonialCarousel = document.getElementById('testimonialCarousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicators = document.querySelectorAll('.indicator');
const body = document.body;

// Mobile Menu Toggle
if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        
        // Toggle icon
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
}

// Dark Mode Toggle
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        // Toggle icon
        const icon = themeToggle.querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');

        // Save preference to localStorage
        localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
    });

    // Check for saved theme preference
    if (localStorage.getItem('darkMode') === 'true') {
        body.classList.add('dark-mode');
        const icon = themeToggle.querySelector('i');
        icon.classList.replace('fa-moon', 'fa-sun');
    }
}

// Testimonial Carousel Functionality
let currentSlide = 0;
if (testimonialCarousel) {
    const slides = testimonialCarousel.querySelectorAll('.testimonial-slide');

    function goToSlide(slideIndex) {
        slides[currentSlide].classList.remove('active');
        currentSlide = (slideIndex + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        updateIndicators();
    }

    function updateIndicators() {
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
    }

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });

    let carouselInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);

    let restartTimeout;
    testimonialCarousel.addEventListener('mouseenter', () => clearInterval(carouselInterval));
    testimonialCarousel.addEventListener('mouseleave', () => {
        clearTimeout(restartTimeout);
        restartTimeout = setTimeout(() => {
            carouselInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
        }, 500);
    });

    goToSlide(0);
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        if (mobileMenu?.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
        }

        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
    });
});

// Intersection Observer for Fade-in Animations
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.product-card, .section-title, .section-description').forEach(element => {
    element.classList.add('fade-in');
    observer.observe(element);
});

// CSS for Fade-in Animations (Dynamically Added)
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }

    .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(styleSheet);
