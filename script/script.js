document.addEventListener('DOMContentLoaded', () => {
    const educationCards = document.querySelectorAll('.education-card');

    educationCards.forEach(card => {
        const textElement = card.querySelector('.text');
        const toggleElement = card.querySelector('.toggleRead');
        const fullText = textElement.textContent.trim();
        const truncatedText = fullText.substring(0, 100);

        // Initially truncate the text
        if (fullText.length > 100) {
            textElement.textContent = truncatedText;
            toggleElement.style.display = 'inline';
        } else {
            toggleElement.style.display = 'none';
        }

        toggleElement.addEventListener('click', () => {
            if (textElement.textContent === truncatedText) {
                textElement.textContent = fullText;
                toggleElement.textContent = ' Show less';
            } else {
                textElement.textContent = truncatedText;
                toggleElement.textContent = '... Read more';
            }
        });
    });
});

// Close menu when clicking outside
function closeMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('click', function (event) {
    const navLinks = document.getElementById('navLinks');
    const nav = document.querySelector('nav');

    if (!nav.contains(event.target) && navLinks.classList.contains('active')) {
        closeMenu();
    }
});

// Typing animation
const roles = ['Jerick Cataquiz', 'a Java Developer', 'a Software Engineer', 'a Senior Analyst', 'a Computer Engineer', 'a PUPian'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById('typingText');
const typingSpeed = 100;
const deletingSpeed = 50;
const delayBetweenWords = 2000;

function typeText() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
        speed = delayBetweenWords;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 500;
    }

    setTimeout(typeText, speed);
}

// Start typing animation
setTimeout(typeText, 1000);

// Theme toggle
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('.theme-toggle .icon');
    const themeLabel = document.querySelector('.theme-toggle .label');

    body.classList.toggle('light-mode');

    if (body.classList.contains('light-mode')) {
        themeIcon.textContent = '☀️';
        themeLabel.textContent = 'Light Mode';
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.textContent = '🌙';
        themeLabel.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'dark');
    }
}

// Load saved theme
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.querySelector('.theme-toggle .icon');
    const themeLabel = document.querySelector('.theme-toggle .label');

    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeIcon.textContent = '☀️';
        themeLabel.textContent = 'Light Mode';
    }
});

// Header scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Carousel auto-scroll every 5 seconds
let autoScrollIntervals = {};
let currentIndices = { featured: 0, recent: 0 };

function createIndicators(carouselId) {
    const carousel = document.getElementById(carouselId + '-carousel');
    const indicators = document.getElementById(carouselId + '-indicators');
    const cardCount = carousel.children.length;

    indicators.innerHTML = '';
    for (let i = 0; i < cardCount; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'indicator' + (i === 0 ? ' active' : '');
        indicator.onclick = () => scrollToIndex(carouselId, i);
        indicators.appendChild(indicator);
    }
}

function updateIndicators(carouselId) {
    const carousel = document.getElementById(carouselId + '-carousel');
    const indicators = document.getElementById(carouselId + '-indicators');
    const scrollLeft = carousel.scrollLeft;
    const cardWidth = carousel.clientWidth;
    const currentIndex = Math.round(scrollLeft / cardWidth);

    currentIndices[carouselId] = currentIndex;

    Array.from(indicators.children).forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
    });
}

function scrollToIndex(carouselId, index) {
    const carousel = document.getElementById(carouselId + '-carousel');
    const cardWidth = carousel.clientWidth;

    // Prevent overlapping scroll actions
    if (carousel.dataset.isScrolling === 'true') return;
    carousel.dataset.isScrolling = 'true';

    carousel.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
    });

    currentIndices[carouselId] = index;
    updateIndicators(carouselId);

    // Allow scrolling again after the animation completes
    setTimeout(() => {
        carousel.dataset.isScrolling = 'false';
    }, 500); // Adjust this duration to match the smooth scroll animation time
}

function startAutoScroll(carouselId) {
    const carousel = document.getElementById(carouselId + '-carousel');
    const cardCount = carousel.children.length;

    // Clear any existing interval to avoid overlapping
    stopAutoScroll(carouselId);

    autoScrollIntervals[carouselId] = setInterval(() => {
        const nextIndex = (currentIndices[carouselId] + 1) % cardCount;
        scrollToIndex(carouselId, nextIndex);
    }, 5000); // Ensure this matches the desired interval (5 seconds)
}

function stopAutoScroll(carouselId) {
    if (autoScrollIntervals[carouselId]) {
        clearInterval(autoScrollIntervals[carouselId]);
    }
}

// Initialize carousels
function initCarousels() {
    ['featured', 'recent'].forEach(carouselId => {
        const carousel = document.getElementById(carouselId + '-carousel');

        createIndicators(carouselId);
        startAutoScroll(carouselId);

        // Update indicators on scroll
        carousel.addEventListener('scroll', () => {
            updateIndicators(carouselId);
        });

        // Pause on hover
        carousel.addEventListener('mouseenter', () => stopAutoScroll(carouselId));
        carousel.addEventListener('mouseleave', () => startAutoScroll(carouselId));
    });
}

// Initialize after DOM load
window.addEventListener('DOMContentLoaded', initCarousels);

// Carousel scroll function with manual control
function scrollCarousel(carouselId, direction) {
    const carousel = document.getElementById(carouselId + '-carousel');
    const cardWidth = carousel.clientWidth;
    const cardCount = carousel.children.length;

    stopAutoScroll(carouselId);

    let newIndex = currentIndices[carouselId] + direction;
    if (newIndex < 0) newIndex = cardCount - 1;
    if (newIndex >= cardCount) newIndex = 0;

    carousel.scrollTo({
        left: newIndex * cardWidth,
        behavior: 'smooth'
    });

    currentIndices[carouselId] = newIndex;
    updateIndicators(carouselId);

    setTimeout(() => startAutoScroll(carouselId), 1000);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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