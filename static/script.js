const ENABLE_PAGE_SLIDES = true; // turn on the full-page slide UX

// ============================================
// EXPERIENCE INDIA - INTERACTIVE FEATURES
// ============================================

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initScrollAnimations();
  initBackToTop();
  initNavigation();
  initLoadMore();
  initModals();
  initParticles();
  initFullPageSlides();
});

// ===== THEME TOGGLE =====
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  const themeIcon = themeToggle.querySelector('.theme-icon');
  
  // Load saved theme
  const savedTheme = localStorage.getItem('experience-india-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme, themeIcon);
  
  // Toggle theme
  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('experience-india-theme', newTheme);
    updateThemeIcon(newTheme, themeIcon);
    
    // Add a fun animation
    themeToggle.style.transform = 'rotate(360deg) scale(1.2)';
    setTimeout(() => {
      themeToggle.style.transform = '';
    }, 400);
  });
}

function updateThemeIcon(theme, iconElement) {
  iconElement.textContent = theme === 'dark' ? '🌙' : '☀️';
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        
        // Stagger children animations
        const children = entry.target.querySelectorAll('.reveal-up');
        children.forEach((child, index) => {
          setTimeout(() => {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          }, index * 100);
        });
      }
    });
  }, observerOptions);
  
  // Observe all grid items
  document.querySelectorAll('.grid-item').forEach(item => observer.observe(item));
  document.querySelectorAll('.section-header').forEach(header => observer.observe(header));
}

// ===== BACK TO TOP BUTTON =====
function initBackToTop() {
  const backToTop = document.getElementById('backToTop');
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });
  
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ===== NAVIGATION =====
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  
  // Smooth scroll for nav links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const target = document.getElementById(targetId);
        
        if (target) {
          const navHeight = document.querySelector('.glass-nav').offsetHeight;
          const targetPosition = target.offsetTop - navHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          const navCollapse = document.getElementById('navContent');
          if (navCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navCollapse);
            bsCollapse.hide();
          }
        }
      }
    });
  });
  
  // Highlight active section
  function highlightActiveSection() {
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  window.addEventListener('scroll', highlightActiveSection);
  highlightActiveSection();
}

// ===== LOAD MORE FUNCTIONALITY =====
function initLoadMore() {
  const loadMoreButtons = document.querySelectorAll('.btn-load-more');
  const showLessButtons = document.querySelectorAll('.btn-show-less');
  
  loadMoreButtons.forEach(button => {
    button.addEventListener('click', () => {
      const section = button.dataset.section;
      const grid = document.querySelector(`.content-grid[data-section="${section}"]`);
      const hiddenItems = grid.querySelectorAll('.grid-item.d-none');
      const chunk = parseInt(grid.dataset.chunk) || 6;
      
      // Show next chunk
      Array.from(hiddenItems).slice(0, chunk).forEach(item => {
        item.classList.remove('d-none');
        // Trigger animation
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 50);
      });
      
      // Check if all items are shown
      const remainingHidden = grid.querySelectorAll('.grid-item.d-none');
      if (remainingHidden.length === 0) {
        button.classList.add('d-none');
      }
      
      // Show "Show Less" button
      const showLessBtn = document.querySelector(`.btn-show-less[data-section="${section}"]`);
      if (showLessBtn) {
        showLessBtn.classList.remove('d-none');
      }
    });
  });
  
  showLessButtons.forEach(button => {
    button.addEventListener('click', () => {
      const section = button.dataset.section;
      const grid = document.querySelector(`.content-grid[data-section="${section}"]`);
      const items = grid.querySelectorAll('.grid-item');
      const chunk = parseInt(grid.dataset.chunk) || 6;
      
      // Hide items beyond chunk
      items.forEach((item, index) => {
        if (index >= chunk) {
          item.classList.add('d-none');
        }
      });
      
      // Show "Load More" button
      const loadMoreBtn = document.querySelector(`.btn-load-more[data-section="${section}"]`);
      if (loadMoreBtn) {
        loadMoreBtn.classList.remove('d-none');
      }
      
      // Hide "Show Less" button
      button.classList.add('d-none');
      
      // Scroll to section
      const sectionElement = document.getElementById(section);
      if (sectionElement) {
        const navHeight = document.querySelector('.glass-nav').offsetHeight;
        const targetPosition = sectionElement.offsetTop - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ===== MODAL HANDLING =====
function initModals() {
  const detailModal = document.getElementById('detailModal');
  const detailModalContent = document.getElementById('detailModalContent');
  
  // Create modal instance
  const bsModal = new bootstrap.Modal(detailModal);
  
  // Global function for showing card modals
  window.showCardModal = function(cardId) {
    const template = document.getElementById(`${cardId}-data`);
    if (template) {
      detailModalContent.innerHTML = template.innerHTML;
      bsModal.show();
    }
  };
}

// ===== PARTICLE EFFECTS =====
function initParticles() {
  const particlesBg = document.getElementById('particlesBg');
  
  // Create subtle floating particles
  const particleCount = 30;
  
  for (let i = 0; i < particleCount; i++) {
    createParticle(particlesBg);
  }
}

function createParticle(container) {
  const particle = document.createElement('div');
  
  // Random properties
  const size = Math.random() * 4 + 2;
  const startX = Math.random() * 100;
  const startY = Math.random() * 100;
  const duration = Math.random() * 20 + 20;
  const delay = Math.random() * 5;
  
  // Particle styles
  particle.style.position = 'absolute';
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.borderRadius = '50%';
  particle.style.background = `rgba(${Math.random() > 0.5 ? '147, 51, 234' : '249, 115, 22'}, 0.3)`;
  particle.style.left = `${startX}%`;
  particle.style.top = `${startY}%`;
  particle.style.animation = `particleFloat ${duration}s ease-in-out ${delay}s infinite`;
  particle.style.filter = 'blur(2px)';
  particle.style.pointerEvents = 'none';
  
  container.appendChild(particle);
}

// Add particle animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes particleFloat {
    0%, 100% {
      transform: translate(0, 0) scale(1);
      opacity: 0;
    }
    10% {
      opacity: 0.6;
    }
    90% {
      opacity: 0.6;
    }
    25% {
      transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.2);
    }
    50% {
      transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0.8);
    }
    75% {
      transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.1);
    }
  }
`;
document.head.appendChild(style);

// ===== PERFORMANCE OPTIMIZATIONS =====

// Debounce function for scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Lazy load images
function initLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
}

// Initialize lazy loading
initLazyLoading();

// ===== EASTER EGGS =====

// Konami code easter egg
let konamiCode = [];
const konamiSequence = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a'
];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);
  
  if (konamiCode.join(',') === konamiSequence.join(',')) {
    activateEasterEgg();
  }
});

function activateEasterEgg() {
  // Fun celebration effect
  document.body.style.animation = 'rainbow 2s ease infinite';
  
  const celebration = document.createElement('div');
  celebration.innerHTML = '🎉 Namaste! You found the secret! 🪔';
  celebration.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #9333ea, #d946ef);
    color: white;
    padding: 2rem 3rem;
    border-radius: 16px;
    font-size: 1.5rem;
    font-weight: bold;
    z-index: 9999;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    animation: bounceIn 0.6s ease;
  `;
  
  document.body.appendChild(celebration);
  
  setTimeout(() => {
    celebration.style.animation = 'bounceOut 0.6s ease';
    setTimeout(() => {
      celebration.remove();
      document.body.style.animation = '';
    }, 600);
  }, 3000);
}

// Add animation keyframes
const easterEggStyle = document.createElement('style');
easterEggStyle.textContent = `
  @keyframes rainbow {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }
  
  @keyframes bounceIn {
    0% { transform: translate(-50%, -50%) scale(0); }
    50% { transform: translate(-50%, -50%) scale(1.1); }
    100% { transform: translate(-50%, -50%) scale(1); }
  }
  
  @keyframes bounceOut {
    0% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -50%) scale(1.1); }
    100% { transform: translate(-50%, -50%) scale(0); }
  }
`;
document.head.appendChild(easterEggStyle);

// ===== CONSOLE MESSAGE =====
console.log('%c✨ Experience India ✨', 'color: #9333ea; font-size: 24px; font-weight: bold;');
console.log('%cBuilt with 🤍 for culture, cuisine, and cinema', 'color: #d946ef; font-size: 14px;');
console.log('%cTry the Konami Code for a surprise! ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA', 'color: #f97316; font-size: 12px;');

// ===== FULL-PAGE SLIDES (Deck-style) =====
function initFullPageSlides() {
  if (!ENABLE_PAGE_SLIDES) return;

  // Collect your main sections IN ORDER (adjust if your IDs differ):
  const orderedIds = ['home','news','bollywood','restaurants','recipes','resources','events','comingsoon','about'];
  const sections = orderedIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if (sections.length === 0) return;

  // Create the slide stage and insert it right after your navbar
  const stage = document.createElement('div');
  stage.id = 'slides';

  // Try to locate your navbar; change selector if your nav has a different id/class
  const navEl = document.getElementById('mainNav') || document.querySelector('.glass-nav') || document.querySelector('header');
  const insertAfter = (ref, node) => ref.parentNode.insertBefore(node, ref.nextSibling);
  insertAfter(navEl, stage);

  // Move each section into the stage and mark as slide
  sections.forEach(sec => {
    sec.classList.add('slide-section');
    stage.appendChild(sec);
  });

  // Lock normal scroll
  document.documentElement.classList.add('fullpage-active');

  let index = 0;                 // current slide index
  let animating = false;         // lock during transitions
  let touchStartY = null;        // for touch swipe
  let touchStartTime = 0;

  function layoutSlides() {
    sections.forEach((sec, i) => {
      sec.classList.remove('is-current','is-above','is-below','moving');
      if (i < index) sec.classList.add('is-above');
      else if (i > index) sec.classList.add('is-below');
      else sec.classList.add('is-current');
    });
  }
  layoutSlides();

  function syncActiveNav(targetId) {
    document.querySelectorAll('.nav-link').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${targetId}`);
    });
  }

  function slideTo(newIndex) {
    if (animating || newIndex === index || newIndex < 0 || newIndex >= sections.length) return;
    animating = true;

    const dir = newIndex > index ? 1 : -1; // 1=down, -1=up
    const current = sections[index];
    const next = sections[newIndex];

    [current, next].forEach(s => s.classList.add('moving'));

    // Position next slide on correct side first
    next.classList.remove('is-above','is-below','is-current');
    next.classList.add(dir > 0 ? 'is-below' : 'is-above');

    // Force reflow so the browser picks up initial state
    // eslint-disable-next-line no-unused-expressions
    next.offsetHeight;

    // Animate current out and next in
    current.classList.remove('is-current');
    current.classList.add(dir > 0 ? 'is-above' : 'is-below');
    next.classList.remove('is-above','is-below');
    next.classList.add('is-current');

    setTimeout(() => {
      [current, next].forEach(s => s.classList.remove('moving'));
      index = newIndex;
      animating = false;
      syncActiveNav(sections[index].id);
    }, 750); // should be >= CSS --slide-duration
  }

  // Mouse wheel
  function onWheel(e) {
    if (animating) return;
    const delta = e.deltaY;
    if (Math.abs(delta) < 10) return;
    if (delta > 0) slideTo(index + 1);
    else slideTo(index - 1);
  }

  // Touch swipe
  function onTouchStart(e) {
    if (animating) return;
    touchStartY = e.touches[0].clientY;
    touchStartTime = performance.now();
  }
  function onTouchMove(e) {
    if (touchStartY == null || animating) return;
    const dy = e.touches[0].clientY - touchStartY;
    const dt = performance.now() - touchStartTime;
    if ((dt < 600 && Math.abs(dy) > 60) || Math.abs(dy) > 120) {
      if (dy < 0) slideTo(index + 1); else slideTo(index - 1);
      touchStartY = null;
    }
  }
  function onTouchEnd() { touchStartY = null; }

  // Stage events (wheel/touch)
  stage.addEventListener('wheel', onWheel, {passive: true});
  stage.addEventListener('touchstart', onTouchStart, {passive: true});
  stage.addEventListener('touchmove', onTouchMove, {passive: true});
  stage.addEventListener('touchend', onTouchEnd, {passive: true});

  // Hook navbar links (require class="nav-link" and href="#sectionId")
  document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      if (!ENABLE_PAGE_SLIDES) return;
      e.preventDefault();
      const id = link.getAttribute('href').slice(1);
      const i = sections.findIndex(s => s.id === id);
      if (i !== -1) slideTo(i);
    });
  });

  // Initial active nav
  syncActiveNav(sections[index].id);
}
