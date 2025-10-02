document.addEventListener('DOMContentLoaded', function () {
    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuButton.addEventListener('click', function () {
        mobileMenu.classList.toggle('hidden');
    });

    // --- Close mobile menu when a link is clicked ---
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // --- Active Nav Link Highlighting on Scroll ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('#desktop-menu a.nav-link');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('nav-link-active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('nav-link-active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // --- Typing Effect for Hero Section ---
    const typingElement = document.getElementById('typing-effect');
    const phrases = [
        "PhD Scholar",
        "Blockchain Researcher",
        "Cybersecurity Specialist",
        "IT & Systems Expert"
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 100 : 150;

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pause before new phrase
        }

        setTimeout(type, typeSpeed);
    }

    type();

    // --- Fade-in Sections on Scroll ---
    const fadeInSections = document.querySelectorAll('.fade-in-section');
    
    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    }, { threshold: 0.15 });

    fadeInSections.forEach(section => {
        fadeInObserver.observe(section);
    });
});
