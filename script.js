document.addEventListener('DOMContentLoaded', () => {
    // 1. Header Scroll Effect
    const header = document.querySelector('.main-header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // 2. Active Nav Link Tracking on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const trackActiveSection = () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 150; // offset for header height

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

    // 3. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Animates only once
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.01, // Trigger as soon as a tiny part of the element enters the margin
        rootMargin: '0px 0px 100px 0px' // Trigger 100px before the element enters the viewport
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // 4. Interactive Gallery Lightbox
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Create Lightbox Elements
    const lightbox = document.createElement('div');
    lightbox.className = 'gallery-lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-overlay"></div>
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img class="lightbox-img" src="" alt="Zoomed view">
            <div class="lightbox-caption">
                <h4 class="lightbox-title"></h4>
                <p class="lightbox-desc"></p>
            </div>
        </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');
    const lightboxDesc = lightbox.querySelector('.lightbox-desc');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxOverlay = lightbox.querySelector('.lightbox-overlay');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('.gallery-image');
            const title = item.querySelector('.overlay-content h4').textContent;
            const desc = item.querySelector('.overlay-content p').textContent;

            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxTitle.textContent = title;
            lightboxDesc.textContent = desc;

            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Stop background scrolling
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    // 5. Reservation Form Submit Notification (Interactive Toast)
    const reservationForm = document.getElementById('contact-form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent standard page reload / anchor jump
            
            // Get values for personalized message
            const nameInput = document.getElementById('form-name');
            const guestName = nameInput ? nameInput.value : 'Guest';
            
            // Create elegant Toast Notification
            const toast = document.createElement('div');
            toast.className = 'reservation-toast';
            toast.innerHTML = `
                <div class="toast-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <div class="toast-body">
                    <h4>Reservation Inquiry Sent!</h4>
                    <p>Thank you, <strong>${guestName}</strong>. Our host will contact you shortly to confirm your table.</p>
                </div>
            `;
            document.body.appendChild(toast);

            // Animate form clear
            reservationForm.reset();

            // Trigger Show Class after brief delay
            setTimeout(() => {
                toast.classList.add('show');
            }, 100);

            // Auto Remove after 5 seconds
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    toast.remove();
                }, 400);
            }, 5000);
        });
    }
});
