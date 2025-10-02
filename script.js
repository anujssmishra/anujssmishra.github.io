document.addEventListener('DOMContentLoaded', function () {
    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuButton.addEventListener('click', function () {
        mobileMenu.classList.toggle('hidden');
    });

    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // --- Dynamic Header on Scroll ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
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
                });
                const activeLink = document.querySelector(`#desktop-menu a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('nav-link-active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Typing Effect ---
    const typingElement = document.getElementById('typing-effect');
    const phrases = [
        "PhD Scholar",
        "Blockchain Researcher",
        "Cybersecurity Analyst",
        "Web 3.0 Enthusiast",
        "IT & Systems Expert"
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        if (!typingElement) return;
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 75 : 150;

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
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
                
                // Staggered list animation for achievements
                if (entry.target.id === 'achievements') {
                    const listItems = entry.target.querySelectorAll('ul li');
                    listItems.forEach((item, index) => {
                        item.style.transitionDelay = `${index * 150}ms`;
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    fadeInSections.forEach(section => {
        fadeInObserver.observe(section);
    });

    // --- 3D Tilt Effect on Cards ---
    const tiltElements = document.querySelectorAll('.timeline-item, .content-item');

    tiltElements.forEach(el => {
        const tiltable = el.classList.contains('timeline-item') ? el.querySelector('.timeline-content') : el;
        
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5; // Max rotation 5 degrees
            const rotateY = ((x - centerX) / centerX) * 5;  // Max rotation 5 degrees
            
            tiltable.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        el.addEventListener('mouseleave', () => {
            tiltable.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    });

});

