// ========== SISTEMA COMPLETO E OTIMIZADO PARA ARTIGOS ==========
class NeuroPulseArticles {
  constructor() {
    this.header = document.querySelector('header');
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
    this.initializeFilters();
    this.initializeArticleActions();
    this.initializeScrollEffects();
    this.initializeFAQ();
    this.initializeAnimations();
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

  // ========== SISTEMA DE FILTROS OTIMIZADO ==========
  initializeFilters() {
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.articleCards = document.querySelectorAll('.article-card');

    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.handleFilterClick(e.target);
      });

      // Keyboard navigation for filters
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleFilterClick(e.target);
        }
      });
    });
  }

  handleFilterClick(button) {
    // Remove active class from all buttons
    this.filterButtons.forEach(b => b.classList.remove('active'));
    
    // Add active class to clicked button with animation
    button.classList.add('active');
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 150);
    
    const filter = button.getAttribute('data-filter');
    this.filterArticles(filter);
  }

  filterArticles(filter) {
    this.articleCards.forEach(card => {
      const shouldShow = filter === 'all' || card.getAttribute('data-category') === filter;
      
      if (shouldShow) {
        card.style.display = 'block';
        // Add entrance animation
        card.style.animation = 'fadeInUp 0.6s ease-out';
      } else {
        card.style.display = 'none';
      }
    });

    // Show notification for filter change
    if (filter !== 'all') {
      this.showNotification(`Filtro aplicado: ${this.getFilterLabel(filter)}`, 'info');
    }
  }

  getFilterLabel(filter) {
    const labels = {
      'neurociencia': 'Neurociência',
      'psicologia': 'Psicologia',
      'medicina': 'Medicina',
      'tecnologia': 'Tecnologia'
    };
    return labels[filter] || filter;
  }

  // ========== AÇÕES DOS ARTIGOS MELHORADAS ==========
  initializeArticleActions() {
    this.initializePrimaryActions();
    this.initializeSecondaryActions();
  }

  initializePrimaryActions() {
    const primaryButtons = document.querySelectorAll('.action-btn.primary');
    
    primaryButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const articleCard = e.target.closest('.article-card');
        const articleTitle = articleCard.querySelector('.article-title').textContent;
        
        this.showNotification(`📖 Abrindo artigo: "${articleTitle}"`, 'info');
        this.trackArticleView(articleTitle);
        
        // Add loading state to button
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';
        btn.disabled = true;
        
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.disabled = false;
          // In a real app, you would navigate to the article page here
          // window.location.href = btn.href;
        }, 1500);
      });
    });
  }

  initializeSecondaryActions() {
    const secondaryButtons = document.querySelectorAll('.action-btn:not(.primary)');
    
    secondaryButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const articleCard = e.target.closest('.article-card');
        const articleTitle = articleCard.querySelector('.article-title').textContent;
        const iconClass = btn.querySelector('i').className;
        
        if (iconClass.includes('fa-download')) {
          this.handleDownload(articleTitle, btn);
        } else if (iconClass.includes('fa-share')) {
          this.handleShare(articleTitle, btn);
        }
      });
    });
  }

  handleDownload(articleTitle, button) {
    this.showNotification(`📥 Iniciando download: "${articleTitle}"`, 'success');
    
    // Simulate download progress
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Baixando...';
    button.disabled = true;
    
    setTimeout(() => {
      button.innerHTML = '<i class="fas fa-download"></i> PDF';
      button.disabled = false;
      this.trackDownload(articleTitle);
    }, 2000);
  }

  handleShare(articleTitle, button) {
    if (navigator.share) {
      navigator.share({
        title: articleTitle,
        text: 'Confira este artigo interessante do NeuroPulse',
        url: window.location.href,
      })
      .then(() => this.showNotification('✅ Artigo compartilhado com sucesso!', 'success'))
      .catch(() => this.showNotification('❌ Compartilhamento cancelado', 'error'));
    } else {
      this.showNotification('📤 Copiando link para área de transferência...', 'info');
      
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.showNotification('✅ Link copiado para área de transferência!', 'success');
      }).catch(() => {
        this.showNotification('❌ Erro ao copiar link', 'error');
      });
    }
    
    this.trackShare(articleTitle);
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

    // Parallax effect for page header
    const pageHeader = document.querySelector('.page-header');
    if (pageHeader && currentScrollY < 500) {
      const scrolled = currentScrollY / 1000;
      pageHeader.style.transform = `translateY(${scrolled * 50}px)`;
      pageHeader.style.opacity = `${1 - scrolled}`;
    }
  }

  handleScrollAnimation() {
    this.handleScrollEffects();
    this.rafId = requestAnimationFrame(() => this.handleScrollAnimation());
  }

  // ========== SISTEMA FAQ INTERATIVO ==========
  initializeFAQ() {
    this.faqQuestions = document.querySelectorAll('.faq-question');
    
    this.faqQuestions.forEach((question, index) => {
      question.setAttribute('data-faq-index', index);
      
      question.addEventListener('click', (e) => {
        this.toggleFAQ(e.currentTarget);
      });
      
      question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleFAQ(e.currentTarget);
        }
        
        // Keyboard navigation between FAQ items
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          this.navigateFAQ(e.currentTarget, e.key);
        }
      });
    });
  }

  toggleFAQ(question) {
    const isExpanded = question.getAttribute('aria-expanded') === 'true';
    
    // Close all other FAQs
    this.faqQuestions.forEach(q => {
      if (q !== question) {
        q.setAttribute('aria-expanded', 'false');
        q.nextElementSibling.style.maxHeight = null;
      }
    });
    
    // Toggle current FAQ
    question.setAttribute('aria-expanded', !isExpanded);
    const answer = question.nextElementSibling;
    
    if (!isExpanded) {
      answer.style.maxHeight = answer.scrollHeight + 'px';
      // Add subtle animation
      question.style.background = 'rgba(139, 92, 246, 0.05)';
    } else {
      answer.style.maxHeight = null;
      question.style.background = '';
    }
    
    // Track FAQ interactions
    this.trackFAQInteraction(question.textContent.trim(), !isExpanded);
  }

  navigateFAQ(currentQuestion, direction) {
    const currentIndex = parseInt(currentQuestion.getAttribute('data-faq-index'));
    let nextIndex;
    
    if (direction === 'ArrowDown') {
      nextIndex = Math.min(currentIndex + 1, this.faqQuestions.length - 1);
    } else {
      nextIndex = Math.max(currentIndex - 1, 0);
    }
    
    if (nextIndex !== currentIndex) {
      this.faqQuestions[nextIndex].focus();
      this.toggleFAQ(this.faqQuestions[nextIndex]);
    }
  }

  // ========== ANIMAÇÕES E EFEITOS VISUAIS ==========
  initializeAnimations() {
    this.initializeScrollAnimations();
    this.initializeHoverEffects();
    this.initializeLoadingStates();
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
    document.querySelectorAll('.info-card, .article-card, .stat-card').forEach(el => {
      observer.observe(el);
    });
  }

  initializeHoverEffects() {
    // Add magnetic hover effect to cards
    document.querySelectorAll('.info-card, .article-card').forEach(card => {
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

  initializeLoadingStates() {
    // Add loading animation to images
    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('load', () => {
        img.style.opacity = '1';
      });
      
      img.addEventListener('error', () => {
        console.warn('Erro ao carregar imagem:', img.src);
        img.style.opacity = '0.5';
      });
    });
  }

  // ========== SISTEMA DE NOTIFICAÇÕES AVANÇADO ==========
  showNotification(message, type = 'info', duration = 4000) {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(notification => {
      notification.remove();
    });

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${this.getNotificationIcon(type)}"></i>
        <span>${message}</span>
      </div>
      <button class="notification-close" aria-label="Fechar notificação">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 2rem;
      padding: 1rem 1.5rem;
      background: var(--panel);
      color: var(--text-light);
      border-radius: 12px;
      z-index: 10000;
      animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: var(--shadow-xl);
      border-left: 4px solid ${this.getNotificationColor(type)};
      border: 1px solid var(--border-light);
      backdrop-filter: blur(20px);
      display: flex;
      align-items: center;
      gap: 1rem;
      max-width: 400px;
    `;

    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      this.hideNotification(notification);
    });

    // Auto-hide
    const timeout = setTimeout(() => {
      this.hideNotification(notification);
    }, duration);

    // Pause timeout on hover
    notification.addEventListener('mouseenter', () => {
      clearTimeout(timeout);
    });

    notification.addEventListener('mouseleave', () => {
      setTimeout(() => {
        this.hideNotification(notification);
      }, 1000);
    });

    document.body.appendChild(notification);

    // Track notification
    this.trackNotification(message, type);
  }

  hideNotification(notification) {
    notification.style.animation = 'slideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  getNotificationIcon(type) {
    const icons = {
      'info': 'info-circle',
      'success': 'check-circle',
      'error': 'exclamation-circle'
    };
    return icons[type] || 'info-circle';
  }

  getNotificationColor(type) {
    const colors = {
      'info': '#8b5cf6',
      'success': '#10b981',
      'error': '#ef4444'
    };
    return colors[type] || '#8b5cf6';
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

  // ========== ANALYTICS E TELEMETRIA (OPCIONAL) ==========
  trackArticleView(articleTitle) {
    console.log('📊 Artigo visualizado:', articleTitle);
    // Integrate with analytics service here
  }

  trackDownload(articleTitle) {
    console.log('📊 Download realizado:', articleTitle);
    // Integrate with analytics service here
  }

  trackShare(articleTitle) {
    console.log('📊 Artigo compartilhado:', articleTitle);
    // Integrate with analytics service here
  }

  trackFAQInteraction(question, expanded) {
    console.log('📊 FAQ interagido:', question, expanded ? 'expandido' : 'recolhido');
    // Integrate with analytics service here
  }

  trackNotification(message, type) {
    console.log('📊 Notificação exibida:', type, message);
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
const neuroPulseArticles = new NeuroPulseArticles();

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NeuroPulseArticles;
}

console.log('🚀 NeuroPulse Articles - Sistema avançado inicializado!');