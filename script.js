document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const icon = mobileMenuBtn.querySelector('i');

    function closeMenu() {
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }

    function openMenu() {
        navMenu.classList.add('active');
        document.body.classList.add('menu-open');
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    }

    mobileMenuBtn.addEventListener('click', function () {
        if (navMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    document.addEventListener('click', function (event) {
        const isClickInside = navMenu.contains(event.target) || mobileMenuBtn.contains(event.target);
        if (!isClickInside && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Lightbox
    const galleryImages = document.querySelectorAll('.gallery-image');
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    const closeLightbox = document.querySelector('.close-lightbox');

    galleryImages.forEach(img => {
        img.addEventListener('click', function () {
            lightboxImg.src = this.src;
            lightboxImg.alt = this.alt;
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    function hideLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    if (closeLightbox) closeLightbox.addEventListener('click', hideLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) hideLightbox();
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lightbox && lightbox.style.display === 'flex') {
            hideLightbox();
        }
    });

    // Toast Notifications
    window.showToast = function (message, type) {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'toast-content';

        const iconSpan = document.createElement('span');
        iconSpan.className = 'toast-icon';
        iconSpan.innerHTML = type === 'success'
            ? '<i class="fas fa-check-circle"></i>'
            : '<i class="fas fa-exclamation-circle"></i>';

        const messageSpan = document.createElement('span');
        messageSpan.className = 'toast-message';
        messageSpan.textContent = message;

        const closeButton = document.createElement('span');
        closeButton.className = 'toast-close';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.addEventListener('click', () => container.removeChild(toast));

        contentDiv.appendChild(iconSpan);
        contentDiv.appendChild(messageSpan);
        toast.appendChild(contentDiv);
        toast.appendChild(closeButton);
        container.appendChild(toast);

        toast.offsetHeight; // Trigger animation
        toast.style.opacity = 1;

        setTimeout(() => {
            if (container.contains(toast)) container.removeChild(toast);
        }, 5300);
    };

    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const name = contactForm.name.value.trim();
            const email = contactForm.email.value.trim();
            const phone = contactForm.phone.value.trim();
            const subject = contactForm.subject.value.trim();
            const message = contactForm.message.value.trim();

            const nameHasNumbers = /\d/.test(name);
            const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            const phoneHasLetters = /[a-zA-Z]/.test(phone);

            if (nameHasNumbers) return showToast('Name cannot contain numbers.', 'error');
            if (!emailValid) return showToast('Please enter a valid email address.', 'error');
            if (phoneHasLetters) return showToast('Phone number cannot contain letters.', 'error');

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;

            try {
                const res = await fetch('/api/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, phone, subject, message })
                });

                const result = await res.json();

                if (res.ok) {
                    showToast('Your message was sent successfully!', 'success');
                    contactForm.reset();
                } else {
                    showToast('Failed to send message: ' + (result.error || 'Unknown error'), 'error');
                }
            } catch (err) {
                console.error('Error:', err);
                showToast('An unexpected error occurred. Please try again.', 'error');
            } finally {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        });
    }
});
