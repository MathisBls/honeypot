// script.js

// Typing effect for hero section (only on index.html)
const heroTextElement = document.getElementById('hero-text');
if (heroTextElement) {
    const heroText = "Manager Développeur full stack chez Voxymore";
    let i = 0;
    function typeWriter() {
        if (i < heroText.length) {
            heroTextElement.innerHTML += heroText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    window.addEventListener('load', typeWriter);
}

// Add active class to current nav item
const currentPage = window.location.pathname.split("/").pop();
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});

// Reveal elements on scroll
const revealElements = document.querySelectorAll('.section');

function reveal() {
    revealElements.forEach((element) => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('#hamburger');
    const navLinks = document.querySelector('#nav-links');

    hamburger.addEventListener('click', () => {
        // Toggle active class
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Fermer le menu quand on clique sur un lien
    document.querySelectorAll('#nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
});
