// ========== SISTEMA COMPLETO E OTIMIZADO PARA DOPAMINA ==========
class NeuroPulseDopamine {
  constructor() {
    this.header = document.querySelector('header');
    this.lastScrollY = window.scrollY;
    this.scrollDirection = 0;
    this.rafId = null;
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.initializeAll();
      this.setupGlobalEventListeners();
    });
  }

  // ========== INICIALIZAR TODOS OS SISTEMAS ==========
  initializeAll() {
    this.setActivePage();
    this.updateBodyPadding();
    this.initializeTheme();
    this.initializeProfile();
    this.initializeAnimations();
    this.createParticles();
    this.initializeScrollEffects();
    this.initializeTypingEffect();
    this.initializeSmoothScroll();
    this.initializeHoverEffects();
    this.initializeInfoSection();
  }

  // ========== CONFIGURAR EVENT LISTENERS GLOBAIS ==========
  setupGlobalEventListeners() {
    // Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.updateBodyPadding();
        this.handleResponsiveLayout();
      }, 100);
    });

    // Performance optimization: passive listeners for scroll
    window.addEventListener('scroll', () => {
      this.handleScrollEffects();
    }, { passive: true });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));

    // Page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.handlePageFocus();
      }
    });
  }

  // ========== PÁGINA ATIVA NO MENU ==========
  setActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'menu.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
      const linkPage = link.getAttribute('href');
      if (linkPage === currentPage) {
        link.classList.add('active');
        // Add subtle animation to active page indicator
        link.style.animation = 'pulse 2s infinite';
      } else {
        link.classList.remove('active');
        link.style.animation = '';
      }
    });
  }

  // ========== PADDING DINÂMICO DO HEADER ==========
  updateBodyPadding() {
    if (this.header) {
      const headerHeight = this.header.offsetHeight;
      document.body.style.paddingTop = `${headerHeight}px`;
    }
  }

  // ========== SISTEMA DE TEMA AVANÇADO ==========
  initializeTheme() {
    this.themeToggle = document.getElementById('themeToggle');
    this.themeIcon = document.getElementById('themeIcon');

    if (this.themeToggle && this.themeIcon) {
      // Carregar tema salvo ou detectar preferência do sistema
      const savedTheme = localStorage.getItem('neuropulse_theme') || 
                        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      
      this.applyTheme(savedTheme);

      this.themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });

      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('neuropulse_theme')) {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('neuropulse_theme', theme);
    this.updateThemeIcon(theme);
    
    // Trigger custom event for theme change
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
  }

  toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }

  updateThemeIcon(theme) {
    if (this.themeIcon) {
      this.themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      
      // Add rotation animation
      this.themeIcon.style.transform = 'rotate(360deg)';
      setTimeout(() => {
        this.themeIcon.style.transform = 'rotate(0deg)';
      }, 300);
    }
  }

  // ========== SISTEMA DE PERFIL OTIMIZADO ==========
  initializeProfile() {
    this.loadUserProfileIcon();
    this.initializeProfileDropdown();
  }

  loadUserProfileIcon() {
    const profileIconImg = document.getElementById('profileIconImg');
    if (!profileIconImg) return;

    try {
      const userProfile = localStorage.getItem('neuropulse_user_profile') || 
                         localStorage.getItem('neuropulse_current_user');

      if (userProfile) {
        const userData = JSON.parse(userProfile);
        this.updateProfileImage(profileIconImg, userData);
      } else {
        this.setDefaultProfileImage(profileIconImg);
      }
    } catch (error) {
      console.error('Erro ao carregar ícone do perfil:', error);
      this.setDefaultProfileImage(profileIconImg);
    }
  }

  updateProfileImage(imgElement, userData) {
    if (userData.photo) {
      imgElement.src = userData.photo;
      // Add loading state
      imgElement.style.opacity = '0';
      setTimeout(() => {
        imgElement.style.opacity = '1';
      }, 200);
    } else {
      const name = userData.name || 'Usuário';
      imgElement.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4361ee&color=fff&size=80&bold=true`;
    }
    imgElement.alt = `Foto de ${userData.name || 'Usuário'}`;
  }

  setDefaultProfileImage(imgElement) {
    imgElement.src = 'https://ui-avatars.com/api/?name=Usuario&background=6b7280&color=fff&size=80';
    imgElement.alt = 'Usuário';
  }

  initializeProfileDropdown() {
    const profileIcon = document.getElementById('userProfileIcon');
    const logoutBtn = document.getElementById('headerLogoutBtn');

    if (profileIcon) {
      profileIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        profileIcon.classList.toggle('show');
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!profileIcon.contains(e.target)) {
          profileIcon.classList.remove('show');
        }
      });

      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          profileIcon.classList.remove('show');
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.performLogout();
      });
    }
  }

  performLogout() {
    if (confirm('Tem certeza que deseja sair?')) {
      // Add logout animation
      document.body.style.opacity = '0.7';
      document.body.style.transition = 'opacity 0.3s ease';
      
      setTimeout(() => {
        localStorage.removeItem('neuropulse_current_user');
        localStorage.removeItem('neuropulse_user_profile');
        window.location.href = 'login.html';
      }, 300);
    }
  }

  // ========== ANIMAÇÕES E EFEITOS VISUAIS ==========
  initializeAnimations() {
    this.initializeScrollAnimations();
    this.initializeRevealAnimations();
    this.initializeNeuroAnimations();
  }

  initializeScrollAnimations() {
    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all animatable elements
    document.querySelectorAll('.nt-card, .reward-step, .disease-card, .balance-card, .hero-content').forEach(el => {
      observer.observe(el);
    });
  }

  initializeRevealAnimations() {
    // Add reveal class to elements
    document.querySelectorAll('.nt-card, .reward-step, .disease-card, .balance-card, .hero-content, .page-header').forEach(el => {
      el.classList.add('reveal');
    });
    
    // Sequential animation for cards
    this.animateCardsSequentially();
  }

  animateCardsSequentially() {
    const cards = document.querySelectorAll('.nt-card, .reward-step, .disease-card, .balance-card');
    
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
    });
  }

  initializeNeuroAnimations() {
    // Special animations for neuro-themed elements
    document.querySelectorAll('.nt-icon').forEach(icon => {
      icon.addEventListener('mouseenter', () => {
        icon.style.animation = 'neuroPulse 0.6s ease';
      });
      
      icon.addEventListener('animationend', () => {
        icon.style.animation = '';
      });
    });
  }

  // ========== PARTÍCULAS INTERATIVAS ==========
  createParticles() {
    // Remove existing particles
    const existingParticles = document.querySelector('.particles-container');
    if (existingParticles) {
      existingParticles.remove();
    }

    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
    `;
    document.body.appendChild(particlesContainer);
    
    const particleCount = 25;
    const colors = ['var(--accent1)', 'var(--accent2)', 'var(--dopamine)', 'var(--serotonin)', 'var(--noradrenaline)'];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      const size = 2 + Math.random() * 5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        opacity: ${Math.random() * 0.4};
        animation: float ${15 + Math.random() * 25}s infinite ease-in-out;
        animation-delay: ${Math.random() * 10}s;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        filter: blur(${Math.random() * 2}px);
      `;
      particlesContainer.appendChild(particle);
    }
  }

  // ========== EFEITO DE DIGITAÇÃO ==========
  initializeTypingEffect() {
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle && !pageTitle.classList.contains('typed')) {
      const originalText = pageTitle.textContent;
      this.typeWriter(pageTitle, originalText, 70);
      pageTitle.classList.add('typed');
    }
  }

  typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    element.style.borderRight = '2px solid var(--accent1)';
    
    const type = () => {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        setTimeout(() => {
          element.style.borderRight = '2px solid transparent';
        }, 1000);
      }
    };
    type();
  }

  // ========== MOSTRAR SEÇÕES DE INFORMAÇÃO ==========
  initializeInfoSection() {
    const showButton = document.getElementById('show-info-btn');
    const moreInfoSection = document.getElementById('more-info');

    if (showButton && moreInfoSection) {
      showButton.addEventListener('click', () => {
        this.revealMoreInfo(showButton, moreInfoSection);
      });

      // Also allow keyboard activation
      showButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.revealMoreInfo(showButton, moreInfoSection);
        }
      });
    }
  }

  revealMoreInfo(showButton, moreInfoSection) {
    moreInfoSection.classList.add('info-visible');
    moreInfoSection.classList.remove('info-hidden');
    showButton.classList.add('cta-hidden');
    
    // Animate elements inside the revealed section
    setTimeout(() => {
      const elementsToReveal = moreInfoSection.querySelectorAll('.reveal');
      elementsToReveal.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('active');
        }, index * 100);
      });
    }, 300);
    
    // Smooth scroll to the first section
    setTimeout(() => {
      const firstSection = document.getElementById('dopamina');
      if (firstSection) {
        const headerOffset = this.header.offsetHeight;
        const targetPosition = firstSection.getBoundingClientRect().top + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);

    // Track user interaction
    this.trackUserAction('info_section_revealed');
  }

  // ========== EFEITOS DE SCROLL AVANÇADOS ==========
  initializeScrollEffects() {
    this.lastScrollY = window.scrollY;
    this.scrollDirection = 0;
    
    // Use requestAnimationFrame for smoother scroll handling
    this.rafId = requestAnimationFrame(() => this.handleScrollAnimation());
  }

  handleScrollEffects() {
    const currentScrollY = window.scrollY;
    this.scrollDirection = currentScrollY > this.lastScrollY ? 1 : -1;
    this.lastScrollY = currentScrollY;

    // Header scroll effect
    if (this.header) {
      this.header.classList.toggle('scrolled', currentScrollY > 100);
      
      // Hide header on scroll down, show on scroll up
      if (currentScrollY > 100) {
        this.header.style.transform = this.scrollDirection > 0 ? 'translateY(-100%)' : 'translateY(0)';
      } else {
        this.header.style.transform = 'translateY(0)';
      }
    }

    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection && currentScrollY < 500) {
      const scrolled = currentScrollY / 1000;
      heroSection.style.transform = `translateY(${scrolled * 30}px)`;
    }

    // Fade in elements on scroll
    this.handleScrollAnimations();
  }

  handleScrollAnimation() {
    this.handleScrollEffects();
    this.rafId = requestAnimationFrame(() => this.handleScrollAnimation());
  }

  handleScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    
    reveals.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < windowHeight - elementVisible) {
        element.classList.add('active');
      }
    });
  }

  // ========== SMOOTH SCROLL PARA ÂNCORAS ==========
  initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
          const headerOffset = this.header.offsetHeight;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ========== EFEITOS DE HOVER DINÂMICOS ==========
  initializeHoverEffects() {
    this.initializeCardHoverEffects();
    this.initializeIconHoverEffects();
  }

  initializeCardHoverEffects() {
    // Add magnetic hover effect to cards
    document.querySelectorAll('.nt-card, .reward-step, .disease-card, .balance-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        if (window.innerWidth > 768) { // Only on desktop
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          const rotateX = (y - centerY) / 25;
          const rotateY = (centerX - x) / 25;
          
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        }
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      });
    });
  }

  initializeIconHoverEffects() {
    // Special hover effects for neuro icons
    document.querySelectorAll('.nt-icon, .step-icon, .balance-icon').forEach(icon => {
      icon.addEventListener('mouseenter', () => {
        icon.style.filter = 'brightness(1.2)';
      });
      
      icon.addEventListener('mouseleave', () => {
        icon.style.filter = 'brightness(1)';
      });
    });
  }

  // ========== MANIPULAÇÃO DE LAYOUT RESPONSIVO ==========
  handleResponsiveLayout() {
    const width = window.innerWidth;
    
    if (width < 768) {
      this.enableMobileLayout();
    } else {
      this.enableDesktopLayout();
    }
  }

  enableMobileLayout() {
    document.body.classList.add('mobile-layout');
    // Adjust any mobile-specific layout changes
  }

  enableDesktopLayout() {
    document.body.classList.remove('mobile-layout');
    // Adjust any desktop-specific layout changes
  }

  // ========== NAVEGAÇÃO POR TECLADO ==========
  handleKeyboardNavigation(e) {
    // Escape key closes modals and dropdowns
    if (e.key === 'Escape') {
      document.querySelectorAll('.profile-dropdown.show').forEach(dropdown => {
        dropdown.parentElement.classList.remove('show');
      });
    }
    
    // Tab key management for better accessibility
    if (e.key === 'Tab') {
      this.handleTabNavigation(e);
    }
  }

  handleTabNavigation(e) {
    // Ensure focus remains within modal when open
    const openDropdown = document.querySelector('.profile-dropdown.show');
    if (openDropdown && !openDropdown.contains(e.target)) {
      e.preventDefault();
      openDropdown.querySelector('a, button').focus();
    }
  }

  // ========== HANDLE PAGE FOCUS ==========
  handlePageFocus() {
    // Restart animations when page gains focus
    document.querySelectorAll('.reveal').forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.8) {
        el.classList.add('active');
      }
    });
  }

  // ========== ANALYTICS E TELEMETRIA (OPCIONAL) ==========
  trackUserAction(action) {
    console.log('📊 User action:', action);
    // Integrate with analytics service here
  }

  // ========== CLEANUP ==========
  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    
    // Remove all event listeners
    document.removeEventListener('keydown', this.handleKeyboardNavigation);
    window.removeEventListener('resize', this.handleResize);
  }
}

// ========== INICIALIZAÇÃO DA APLICAÇÃO ==========
const neuroPulseDopamine = new NeuroPulseDopamine();

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NeuroPulseDopamine;
}

console.log('🧠 NeuroPulse Dopamine - Sistema avançado inicializado!');