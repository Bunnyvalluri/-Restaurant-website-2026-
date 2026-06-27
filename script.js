document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Header Scroll Glassmorphism Effect
    // ==========================================
    const header = document.getElementById('main-header');
    const handleScrollHeader = () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScrollHeader);
    handleScrollHeader(); // Initialize check


    // ==========================================
    // 2. Active Navigation Link Tracker
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const trackActiveSection = () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 180; // offset for height header + spacing

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', trackActiveSection);
    trackActiveSection();


    // ==========================================
    // 3. Scroll Reveal Animation (Intersection Observer)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal-on-scroll, [data-reveal]');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // If it's a specific custom reveal attribute
                const customReveal = entry.target.getAttribute('data-reveal');
                if (customReveal) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translate(0, 0)';
                }
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // triggers slightly before entering
    });

    revealElements.forEach(element => {
        // Initial style helper for custom slide data attributes
        const customReveal = element.getAttribute('data-reveal');
        if (customReveal) {
            element.style.opacity = '0';
            element.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            if (customReveal === 'fade-down') {
                element.style.transform = 'translateY(-20px)';
            } else if (customReveal === 'fade-up') {
                element.style.transform = 'translateY(30px)';
            }
        }
        revealObserver.observe(element);
    });


    // ==========================================
    // 4. Stats Counter Animation (Count-up)
    // ==========================================
    const statsSection = document.getElementById('stats');
    const statNumbers = document.querySelectorAll('.stat-number');
    let animatedStats = false;

    const startStatsCount = () => {
        statNumbers.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-count'));
            const suffix = stat.getAttribute('data-suffix') || '';
            const decimals = target % 1 !== 0 ? 1 : 0;
            let current = 0;
            const duration = 2000; // 2 seconds count duration
            const stepTime = 20; // 20ms steps
            const totalSteps = duration / stepTime;
            const increment = target / totalSteps;

            const updateCount = () => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target.toFixed(decimals) + suffix;
                } else {
                    stat.textContent = current.toFixed(decimals) + suffix;
                    setTimeout(updateCount, stepTime);
                }
            };
            updateCount();
        });
    };

    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animatedStats) {
                    animatedStats = true;
                    startStatsCount();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        statsObserver.observe(statsSection);
    }



    // ==========================================
    // 6. Upgraded Gallery Lightbox with Navigation
    // ==========================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxOverlay = document.getElementById('lightbox-overlay');

    let currentPhotoIndex = 0;
    const photosArray = [];

    // Populate photos list
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('.gallery-image');
        const title = img.getAttribute('data-title') || 'Gallery View';
        const desc = img.getAttribute('data-desc') || 'Flame & Fork Culinary Experience';
        photosArray.push({ src: img.src, alt: img.alt, title, desc });

        item.addEventListener('click', () => {
            currentPhotoIndex = index;
            openLightbox(currentPhotoIndex);
        });
    });

    const openLightbox = (index) => {
        if (!lightbox) return;
        const photo = photosArray[index];
        lightboxImg.src = photo.src;
        lightboxImg.alt = photo.alt;
        lightboxTitle.textContent = photo.title;
        lightboxDesc.textContent = photo.desc;
        lightboxCounter.textContent = `${index + 1} / ${photosArray.length}`;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // block scrolling
    };

    const closeLightbox = () => {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    const nextPhoto = () => {
        currentPhotoIndex = (currentPhotoIndex + 1) % photosArray.length;
        openLightbox(currentPhotoIndex);
    };

    const prevPhoto = () => {
        currentPhotoIndex = (currentPhotoIndex - 1 + photosArray.length) % photosArray.length;
        openLightbox(currentPhotoIndex);
    };

    if (lightbox) {
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxOverlay.addEventListener('click', closeLightbox);
        lightboxNext.addEventListener('click', nextPhoto);
        lightboxPrev.addEventListener('click', prevPhoto);

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextPhoto();
            if (e.key === 'ArrowLeft') prevPhoto();
        });
    }


    // ==========================================
    // 7. Scroll-to-Top Button
    // ==========================================
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    const handleScrollTopBtnVisibility = () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    };

    if (scrollTopBtn) {
        window.addEventListener('scroll', handleScrollTopBtnVisibility);
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    // ==========================================
    // 8. Custom Decorative Wishlist Heart Toggle
    // ==========================================
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid card actions trigger
            const isActive = btn.classList.toggle('active');
            const itemName = btn.closest('.menu-card').querySelector('.menu-item-name').textContent;
            
            if (isActive) {
                btn.textContent = '❤️';
                showToast('❤️ Added to Wishlist', `${itemName} saved to your favorites.`, 'info');
            } else {
                btn.textContent = '♡';
                showToast('💔 Removed from Wishlist', `${itemName} removed from favorites.`, 'info');
            }
        });
    });


    // ==========================================
    // 9. Toast Notification Generator System
    // ==========================================
    const toastContainer = document.getElementById('toast-container');

    window.showToast = (title, message, type = 'success') => {
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = 'toast';
        
        // Render tick or mail icon based on success status
        const isSuccess = type === 'success';
        const svgIcon = isSuccess 
            ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`
            : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

        toast.innerHTML = `
            <div class="toast-icon">
                ${svgIcon}
            </div>
            <div class="toast-text">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
        `;
        
        toastContainer.appendChild(toast);

        // Slide in
        setTimeout(() => {
            toast.classList.add('show');
        }, 50);

        // Slide out and remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 5000);
    };


    // ==========================================
    // 10. Reservation Form Toast submission Handler
    // ==========================================
    const reservationForm = document.getElementById('contact-form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop page reload/jump
            
            const name = document.getElementById('form-name').value;
            const guests = document.getElementById('form-guests').value;
            const date = document.getElementById('form-date').value;
            const time = document.getElementById('form-time').value;

            // Simple date formatter
            const formattedDate = new Date(date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });

            // Trigger beautiful Premium Toast
            showToast(
                '🎉 Table Requested!', 
                `Thank you, ${name}. Request for ${guests} guests on ${formattedDate} has been received.`, 
                'success'
            );
            
            reservationForm.reset();
        });
    }

    // ==========================================
    // 11. Auto close Hamburger navigation drawer on click
    // ==========================================
    const menuToggle = document.getElementById('menu-toggle');
    const drawerLinks = document.querySelectorAll('.nav-link');
    
    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuToggle && menuToggle.checked) {
                menuToggle.checked = false;
            }
        });
    });
});
