// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    document.addEventListener('click', function(event) {
        const isClickInside = navMenu.contains(event.target) || mobileMenuBtn.contains(event.target);
        if (!isClickInside && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const galleryImages = document.querySelectorAll('.gallery-image');
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    const closeLightbox = document.querySelector('.close-lightbox');

    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            lightboxImg.src = this.src;
            lightboxImg.alt = this.alt;
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    closeLightbox.addEventListener('click', function() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

function showToast(message, type) {
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
    closeButton.addEventListener('click', () => {
        container.removeChild(toast);
    });

    contentDiv.appendChild(iconSpan);
    contentDiv.appendChild(messageSpan);
    toast.appendChild(contentDiv);
    toast.appendChild(closeButton);
    container.appendChild(toast);

    toast.offsetHeight;
    toast.style.opacity = 1;

    setTimeout(() => {
        if (container.contains(toast)) {
            container.removeChild(toast);
        }
    }, 5300);
}

document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        const nameField = contactForm.name;
        const emailField = contactForm.email;
        const phoneField = contactForm.phone;

        // Validation patterns
        const nameRegex = /^[a-zA-Z\s'-]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d+$/;

        // Live validation function
        function validateField(field, regex, errorMsg) {
            field.addEventListener('input', () => {
                if (field.value && !regex.test(field.value.trim())) {
                    showToast(errorMsg, 'error');
                }
            });
        }

        validateField(nameField, nameRegex, 'Name can only contain letters, spaces, apostrophes, and hyphens.');
        validateField(emailField, emailRegex, 'Enter a valid email address.');
        validateField(phoneField, phoneRegex, 'Phone number must contain digits only.');

        // Final form submission validation
        contactForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const name = nameField.value.trim();
            const email = emailField.value.trim();
            const phone = phoneField.value.trim();
            const subject = contactForm.subject.value.trim();
            const message = contactForm.message.value.trim();

            if (!nameRegex.test(name)) {
                showToast('Name can only contain letters, spaces, apostrophes, and hyphens.', 'error');
                return;
            }

            if (!emailRegex.test(email)) {
                showToast('Please enter a valid email address.', 'error');
                return;
            }

            if (!phoneRegex.test(phone)) {
                showToast('Phone number can only contain digits.', 'error');
                return;
            }

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;

            const formData = { name, email, phone, subject, message };

            try {
                const res = await fetch('/api/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
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
