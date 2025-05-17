// DOM Elements
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const mobileMenu = document.getElementById('mobile-menu');

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
  initMobileMenu();
  initMap();
});

// Mobile Menu Functionality
function initMobileMenu() {
  if (!mobileMenuButton || !mobileMenu) return;

  mobileMenuButton.addEventListener('click', toggleMobileMenu);
  
  // Close button for mobile menu
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
  }

  // Close mobile menu when clicking on a link
  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    if (mobileMenu.classList.contains('active') && 
        !mobileMenu.contains(event.target) && 
        event.target !== mobileMenuButton &&
        !mobileMenuButton.contains(event.target)) {
      closeMobileMenu();
    }
  });
}

function toggleMobileMenu() {
  mobileMenu.classList.toggle('active');
}

function closeMobileMenu() {
  mobileMenu.classList.remove('active');
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== "#") {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Offset for fixed header
            behavior: 'smooth'
          });
        }
      }
    });
  });
}