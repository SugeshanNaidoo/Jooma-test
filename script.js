// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get references to the menu button and navigation menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    // Toggle the 'active' class on the navigation menu when the menu button is clicked
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Change the icon based on the menu state
        const icon = mobileMenuBtn.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close the menu when clicking outside of it
    document.addEventListener('click', function(event) {
        const isClickInside = navMenu.contains(event.target) || mobileMenuBtn.contains(event.target);
        
        if (!isClickInside && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            
            // Reset the icon
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close the menu when a menu item is clicked
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            
            // Reset the icon
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
    
    // Close the menu when window is resized to desktop size
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            
            // Reset the icon
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});

// Add this to your script.js or create a new gallery.js file to include in gallery.html
document.addEventListener('DOMContentLoaded', function() {
    // Get all gallery images
    const galleryImages = document.querySelectorAll('.gallery-image');
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    const closeLightbox = document.querySelector('.close-lightbox');
    
    // Add click event to gallery images
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            lightboxImg.src = this.src;
            lightboxImg.alt = this.alt;
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
        });
    });
    
    // Close lightbox when clicking the close button
    closeLightbox.addEventListener('click', function() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    });
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    });
    
    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    });
});

// Toast notification system
function showToast(message, type) {
  // Create container if it doesn't exist
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // Create content
  const contentDiv = document.createElement('div');
  contentDiv.className = 'toast-content';
  
  // Create icon based on type
  const iconSpan = document.createElement('span');
  iconSpan.className = 'toast-icon';
  iconSpan.innerHTML = type === 'success' 
    ? '<i class="fas fa-check-circle"></i>' 
    : '<i class="fas fa-exclamation-circle"></i>';
  
  // Create message text
  const messageSpan = document.createElement('span');
  messageSpan.className = 'toast-message';
  messageSpan.textContent = message;
  
  // Create close button
  const closeButton = document.createElement('span');
  closeButton.className = 'toast-close';
  closeButton.innerHTML = '<i class="fas fa-times"></i>';
  closeButton.addEventListener('click', () => {
    container.removeChild(toast);
  });
  
  // Assemble the toast
  contentDiv.appendChild(iconSpan);
  contentDiv.appendChild(messageSpan);
  toast.appendChild(contentDiv);
  toast.appendChild(closeButton);
  
  // Add toast to container
  container.appendChild(toast);
  
  // Force reflow to trigger animation
  toast.offsetHeight;
  toast.style.opacity = 1;
  
  // Remove the toast after its animation completes
  setTimeout(() => {
    if (container.contains(toast)) {
      container.removeChild(toast);
    }
  }, 5300); // Animation takes 5s + 300ms extra
}

// Modify the contact form submission handler to use the toast notification
document.addEventListener('DOMContentLoaded', function () {
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitButton.disabled = true;

      const formData = {
        name: contactForm.name.value,
        email: contactForm.email.value,
        phone: contactForm.phone.value,
        subject: contactForm.subject.value,
        message: contactForm.message.value
      };

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