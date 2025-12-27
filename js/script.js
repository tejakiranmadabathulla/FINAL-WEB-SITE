document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // CUSTOM CURSOR (ZERO DELAY)
    // =========================================
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    // Optimize for performance
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Direct update for zero delay
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;

        // Outline follows instantly too (as requested "without any delay")
        cursorOutline.style.left = `${mouseX}px`;
        cursorOutline.style.top = `${mouseY}px`;
    });

    // Hover effects
    const interactiveElements = document.querySelectorAll('a, button, .portfolio-item, .service-card, .skill-card, input, select, textarea');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering');
        });

        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering');
        });
    });

    // =========================================
    // STICKY HEADER
    // =========================================
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // =========================================
    // MOBILE MENU TOGGLE
    // =========================================
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');

        // Change icon
        const icon = mobileToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        });
    });

    // =========================================
    // SCROLL ANIMATIONS (REVEAL)
    // =========================================
    const revealElements = document.querySelectorAll('.reveal-text, .service-card, .portfolio-item, .about-content, .image-frame');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once revealed
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        el.classList.add('reveal-text'); // Ensure class exists
        revealObserver.observe(el);
    });

    // =========================================
    // NUMBER COUNTER ANIMATION
    // =========================================
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    const counterObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasCounted) {
            hasCounted = true;
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps

                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current) + "+";
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target + "+";
                    }
                };
                updateCounter();
            });
        }
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-banner');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }

    // =========================================
    // PORTFOLIO FILTERING
    // =========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // =========================================
    // LIGHTBOX FUNCTIONALITY
    // =========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxVideo = document.getElementById('lightbox-video');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeLightbox = document.querySelector('.close-lightbox');
    const playButtons = document.querySelectorAll('.play-btn');

    playButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent bubbling
            const item = btn.closest('.portfolio-item');
            const videoSrc = item.querySelector('source').src;
            const title = item.querySelector('h4').innerText;
            const category = item.querySelector('span').innerText;

            lightboxVideo.src = videoSrc;
            lightboxCaption.innerHTML = `<h3>${title}</h3><p>${category}</p>`;
            lightbox.classList.add('active');
            lightboxVideo.play();
        });
    });

    // Close Lightbox
    const closeBox = () => {
        lightbox.classList.remove('active');
        lightboxVideo.pause();
        lightboxVideo.currentTime = 0;
    };

    if (closeLightbox) {
        closeLightbox.addEventListener('click', closeBox);
    }

    // Close on click outside
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeBox();
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
            closeBox();
        }
    });

    // =========================================
    // SMOOTH SCROLLING FOR ANCHOR LINKS
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Update active nav link
                navLinks.forEach(link => link.classList.remove('active'));
                if (this.classList.contains('nav-link')) {
                    this.classList.add('active');
                }

                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for sticky header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Highlight nav links on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // =========================================
    // 3D TILT ANIMATION
    // =========================================
    const tiltElements = document.querySelectorAll('.service-card, .portfolio-item, .step-card, .testimonial-card, .feature-item');

    tiltElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.transition = 'transform 0.1s ease-out';
        });

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Multipliers for rotation (sensitivity)
            const rotateX = ((y - centerY) / centerY) * -10; // -10 deg max
            const rotateY = ((x - centerX) / centerX) * 10;  // 10 deg max

            // Apply transform
            // We include scale(1.02) to match/enhance the hover pop effect
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transition = 'transform 0.5s ease';
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';

            // Resume any existing float animations after the reset transition
            setTimeout(() => {
                el.style.transform = '';
                el.style.transition = '';
            }, 500);
        });
    });

    // =========================================
    // MUSIC CONTROL LOGIC
    // =========================================
    const music = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    let isPlaying = false;

    if (music && musicToggle) {
        // Set initial volume
        music.volume = 0.5;

        musicToggle.addEventListener('click', () => {
            if (isPlaying) {
                music.pause();
                musicToggle.classList.remove('playing');
                musicToggle.innerHTML = '<i class="fa-solid fa-music"></i>';
            } else {
                music.play().catch(e => console.log("Audio play prevented by browser. User interaction required."));
                musicToggle.classList.add('playing');
                musicToggle.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            }
            isPlaying = !isPlaying;
        });

        // Try to autoplay logic can be added here
    }
});
