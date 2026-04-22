// ============================================================
// SISTEMA PRINCIPAL DA PÁGINA IDADE - TEMA CLARO CORRIGIDO
// ============================================================

class AgeTimelinePage {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeHeader();
            this.initializeTimeline();
            this.initializeThemeSystem();
            this.initializeProfileSystem();
            this.initializeAccessibility();
            this.initializePerformance();
            this.initializeSmoothScrolling();
        });
    }

    // Inicializar header e scroll
    initializeHeader() {
        const header = document.querySelector('.main-header');
        let scrollTimeout;
        let lastScrollY = window.scrollY;

        if (header) {
            const updateHeader = () => {
                const scrolled = window.scrollY > 50;
                header.classList.toggle('scrolled', scrolled);
                
                // Efeito de hide/show no scroll
                const currentScrollY = window.scrollY;
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
                lastScrollY = currentScrollY;
            };

            // Debounce para performance
            window.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(updateHeader, 10);
            });

            // Atualizar inicialmente
            updateHeader();
        }
    }

    // Inicializar timeline com animações
    initializeTimeline() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -20% 0px',
            threshold: 0.1
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Animação principal
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0) scale(1)';
                    
                    // Efeito de stagger para elementos filhos
                    this.animateChildElements(element);
                    
                    // Adicionar classe para trigger CSS
                    element.classList.add('animated-in');
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        
        // Observar elementos animáveis
        const animatedElements = document.querySelectorAll(
            '.timeline-content, .research-card, .conclusion'
        );
        
        animatedElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px) scale(0.95)';
            element.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s, 
                                      transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`;
            observer.observe(element);
        });

        // Melhorar navegação da timeline
        this.enhanceTimelineNavigation();
        
        // Adicionar efeitos de hover dinâmicos
        this.enhanceHoverEffects();
    }

    // Animar elementos filhos com stagger
    animateChildElements(parentElement) {
        const children = Array.from(parentElement.children);
        children.forEach((child, index) => {
            child.style.animationDelay = `${index * 0.15}s`;
            child.classList.add('fade-in-up');
        });
    }

    // Melhorar navegação da timeline
    enhanceTimelineNavigation() {
        const timelineContainer = document.querySelector('.timeline-container');
        if (!timelineContainer) return;

        // Navegação por teclado melhorada
        timelineContainer.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                const scrollAmount = 380;
                const currentScroll = timelineContainer.scrollLeft;
                const newScroll = e.key === 'ArrowLeft' 
                    ? currentScroll - scrollAmount 
                    : currentScroll + scrollAmount;
                
                timelineContainer.scrollTo({
                    left: newScroll,
                    behavior: 'smooth'
                });
            }
        });

        // Snap suave
        timelineContainer.addEventListener('scroll', () => {
            clearTimeout(timelineContainer.scrollTimeout);
            timelineContainer.scrollTimeout = setTimeout(() => {
                const items = timelineContainer.querySelectorAll('.timeline-item');
                const containerRect = timelineContainer.getBoundingClientRect();
                const containerCenter = containerRect.left + containerRect.width / 2;
                
                let closestItem = null;
                let closestDistance = Infinity;
                
                items.forEach(item => {
                    const itemRect = item.getBoundingClientRect();
                    const itemCenter = itemRect.left + itemRect.width / 2;
                    const distance = Math.abs(itemCenter - containerCenter);
                    
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestItem = item;
                    }
                });
                
                if (closestItem) {
                    items.forEach(item => item.classList.remove('active'));
                    closestItem.classList.add('active');
                }
            }, 150);
        });

        // Melhorar foco para acessibilidade
        const timelineCards = timelineContainer.querySelectorAll('.timeline-content');
        timelineCards.forEach((card, index) => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Fase ${index + 1} da linha do tempo`);
            
            card.addEventListener('focus', () => {
                card.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            });
        });
    }

    // Adicionar efeitos de hover dinâmicos
    enhanceHoverEffects() {
        const cards = document.querySelectorAll('.timeline-content, .music-card, .research-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                if (window.innerWidth < 768) return; // Desativar em mobile
                
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const angleY = (x - centerX) / 25;
                const angleX = (centerY - y) / 25;
                
                card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    // Sistema de tema completamente corrigido
    initializeThemeSystem() {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = document.getElementById('themeIcon');

        if (!themeToggle || !themeIcon) return;

        const applyTheme = (theme) => {
            const isLight = theme === 'light';
            
            console.log('Aplicando tema:', theme);
            
            // Aplicar classe ao body
            document.body.classList.toggle('light-theme', isLight);
            
            // Forçar atualização de todos os elementos
            this.forceThemeUpdate(isLight);
            
            // Atualizar ícone com animação
            themeIcon.style.transform = 'rotate(180deg) scale(0.8)';
            setTimeout(() => {
                themeIcon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
                themeIcon.style.transform = 'rotate(0deg) scale(1)';
            }, 250);
            
            // Salvar preferência
            localStorage.setItem('neuropulse_theme', theme);
            
            // Disparar evento para outros componentes
            window.dispatchEvent(new CustomEvent('themeChanged', { 
                detail: { theme } 
            }));
        };

        // Forçar atualização completa do tema
        this.forceThemeUpdate = (isLight) => {
            // Lista de todos os elementos que precisam ser atualizados
            const elementsToUpdate = [
                'body',
                '.main-content',
                '.page-header',
                '.timeline-section',
                '.research-section',
                '.conclusion-section',
                '.main-footer',
                '.main-header',
                '.timeline-content',
                '.research-card',
                '.conclusion',
                '.music-card',
                '.profile-dropdown'
            ];
            
            // Aplicar estilos forçados para garantir a mudança
            elementsToUpdate.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    // Forçar repaint
                    el.style.display = 'block';
                    
                    // Remover qualquer estilo inline que possa estar interferindo
                    if (el.style.background && el.style.background.includes('rgb(7, 5, 10)')) {
                        el.style.background = '';
                    }
                    if (el.style.background && el.style.background.includes('rgb(15, 15, 19)')) {
                        el.style.background = '';
                    }
                });
            });
            
            // Forçar repaint do body
            document.body.style.background = isLight ? '#f8fafc' : '#07050a';
            
            // Scrollbar colors
            const scrollbarStyles = document.createElement('style');
            scrollbarStyles.id = 'scrollbar-styles';
            scrollbarStyles.textContent = `
                .timeline-container::-webkit-scrollbar-track {
                    background: ${isLight ? '#e2e8f0' : '#0f0f13'} !important;
                }
            `;
            
            // Remover estilos antigos se existirem
            const oldStyles = document.getElementById('scrollbar-styles');
            if (oldStyles) oldStyles.remove();
            
            document.head.appendChild(scrollbarStyles);
        };

        // Detectar preferência do sistema
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('neuropulse_theme');
        
        // Aplicar tema inicial
        const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        console.log('Tema inicial:', initialTheme);
        
        // Pequeno delay para garantir que o DOM está pronto
        setTimeout(() => {
            applyTheme(initialTheme);
        }, 100);
        
        // Alternar tema
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            console.log('Alternando tema:', currentTheme, '->', newTheme);
            applyTheme(newTheme);
        });

        // Ouvir mudanças na preferência do sistema
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('neuropulse_theme')) {
                console.log('Mudança de preferência do sistema:', e.matches ? 'dark' : 'light');
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    // Sistema de perfil
    initializeProfileSystem() {
        this.profileManager = new ProfileIconManager();
        this.profileManager.init();
    }

    // Scroll suave aprimorado
    initializeSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const headerHeight = document.querySelector('.main-header').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Foco para acessibilidade
                    setTimeout(() => {
                        target.setAttribute('tabindex', '-1');
                        target.focus();
                    }, 1000);
                }
            });
        });
    }

    // Melhorias de acessibilidade
    initializeAccessibility() {
        // Indicador de foco visual melhorado
        this.enhanceFocusManagement();
        
        // Suporte a teclado
        this.enhanceKeyboardNavigation();
    }

    // Gerenciamento de foco avançado
    enhanceFocusManagement() {
        const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '3px solid var(--accent1)';
                element.style.outlineOffset = '3px';
                element.style.borderRadius = '8px';
            });

            element.addEventListener('blur', () => {
                element.style.outline = '';
                element.style.outlineOffset = '';
            });
        });
    }

    // Navegação por teclado
    enhanceKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Escape fecha modais e dropdowns
            if (e.key === 'Escape') {
                this.closeAllDropdowns();
            }
        });
    }

    // Fechar todos os dropdowns
    closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.profile-dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.style.display = 'none';
        });
        
        const profileIcons = document.querySelectorAll('.user-profile-icon');
        profileIcons.forEach(icon => {
            icon.setAttribute('aria-expanded', 'false');
        });
    }

    // Otimizações de performance
    initializePerformance() {
        // Lazy loading para imagens
        this.initializeLazyLoading();
        
        // Debounce para eventos de resize
        this.optimizeResizeEvents();
    }

    // Lazy loading
    initializeLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        
                        if (src) {
                            img.src = src;
                            img.classList.remove('lazy');
                            
                            // Adicionar transição suave
                            img.style.opacity = '0';
                            img.style.transition = 'opacity 0.5s ease';
                            
                            img.onload = () => {
                                img.style.opacity = '1';
                            };
                        }
                        
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Otimizar eventos de resize
    optimizeResizeEvents() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Recalcular layouts se necessário
            }, 250);
        });
    }
}

// ============================================================
// SISTEMA DO ÍCONE DE PERFIL
// ============================================================

class ProfileIconManager {
    constructor() {
        this.initialized = false;
        this.dropdownOpen = false;
    }

    init() {
        if (this.initialized) return;
        
        this.loadUserProfileIcon();
        this.initializeProfileDropdown();
        this.initialized = true;
    }

    // Carregar foto do perfil
    loadUserProfileIcon() {
        const profileIconImg = document.getElementById('profileIconImg');
        if (!profileIconImg) return;

        try {
            const userData = this.getUserData();
            
            if (userData) {
                if (userData.photo) {
                    profileIconImg.src = userData.photo;
                    profileIconImg.onerror = () => this.setDefaultAvatar(userData.name);
                } else {
                    this.setDefaultAvatar(userData.name);
                }
                
                profileIconImg.alt = `Foto de perfil de ${userData.name || 'Usuário'}`;
            } else {
                this.setDefaultAvatar('Visitante');
            }
        } catch (error) {
            console.error('❌ Erro ao carregar ícone do perfil:', error);
            this.setDefaultAvatar('Usuario');
        }
    }

    // Obter dados do usuário
    getUserData() {
        const STORAGE_KEYS = {
            USER_PROFILE: 'neuropulse_user_profile',
            CURRENT_USER: 'neuropulse_current_user'
        };

        let userProfile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE) || 
                         localStorage.getItem(STORAGE_KEYS.CURRENT_USER);

        return userProfile ? JSON.parse(userProfile) : null;
    }

    // Avatar padrão
    setDefaultAvatar(name = 'Usuario') {
        const profileIconImg = document.getElementById('profileIconImg');
        if (profileIconImg) {
            // Gerar cor baseada no nome para consistência
            const colors = [
                '8b5cf6', 'ec4899', '10b981', 'f59e0b', 'ef4444', 
                '3b82f6', '6366f1', '14b8a6', 'f97316', '8b5cf6'
            ];
            
            const nameHash = name.split('').reduce((a, b) => {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return a & a;
            }, 0);
            
            const colorIndex = Math.abs(nameHash) % colors.length;
            const color = colors[colorIndex];
            
            profileIconImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff&size=128&bold=true&font-size=0.5`;
            profileIconImg.alt = name;
        }
    }

    // Inicializar dropdown
    initializeProfileDropdown() {
        const profileIcon = document.getElementById('userProfileIcon');
        const dropdown = document.getElementById('profileDropdown');
        const logoutBtn = document.getElementById('headerLogoutBtn');

        if (profileIcon && dropdown) {
            // Toggle do dropdown
            profileIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown();
            });

            // Animações de entrada/saída
            dropdown.addEventListener('animationend', () => {
                if (!this.dropdownOpen) {
                    dropdown.style.display = 'none';
                }
            });

            // Fechar ao clicar fora
            document.addEventListener('click', (e) => {
                if (!profileIcon.contains(e.target) && !dropdown.contains(e.target)) {
                    this.closeDropdown();
                }
            });

            // Navegação por teclado
            profileIcon.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.toggleDropdown();
                    
                    // Focar no primeiro item do dropdown
                    if (this.dropdownOpen) {
                        setTimeout(() => {
                            const firstItem = dropdown.querySelector('.dropdown-item');
                            if (firstItem) firstItem.focus();
                        }, 100);
                    }
                }
                
                if (e.key === 'Escape') {
                    this.closeDropdown();
                }
            });

            // Navegação dentro do dropdown
            dropdown.addEventListener('keydown', (e) => {
                const items = dropdown.querySelectorAll('.dropdown-item');
                const currentIndex = Array.from(items).indexOf(document.activeElement);
                
                switch(e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        const nextIndex = (currentIndex + 1) % items.length;
                        items[nextIndex].focus();
                        break;
                        
                    case 'ArrowUp':
                        e.preventDefault();
                        const prevIndex = (currentIndex - 1 + items.length) % items.length;
                        items[prevIndex].focus();
                        break;
                        
                    case 'Escape':
                        e.preventDefault();
                        this.closeDropdown();
                        profileIcon.focus();
                        break;
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

    // Alternar dropdown com animação
    toggleDropdown() {
        const dropdown = document.getElementById('profileDropdown');
        const profileIcon = document.getElementById('userProfileIcon');
        
        if (dropdown && profileIcon) {
            this.dropdownOpen = !this.dropdownOpen;
            
            if (this.dropdownOpen) {
                dropdown.style.display = 'block';
                dropdown.style.animation = 'dropdownFadeIn 0.3s ease-out forwards';
            } else {
                dropdown.style.animation = 'dropdownFadeOut 0.2s ease-in forwards';
            }
            
            profileIcon.setAttribute('aria-expanded', this.dropdownOpen.toString());
        }
    }

    // Fechar dropdown
    closeDropdown() {
        const dropdown = document.getElementById('profileDropdown');
        const profileIcon = document.getElementById('userProfileIcon');
        
        if (dropdown && profileIcon) {
            this.dropdownOpen = false;
            dropdown.style.animation = 'dropdownFadeOut 0.2s ease-in forwards';
            profileIcon.setAttribute('aria-expanded', 'false');
        }
    }

    // Logout
    performLogout() {
        if (confirm('Tem certeza que deseja sair da sua conta?')) {
            // Limpar dados do usuário
            localStorage.removeItem('neuropulse_current_user');
            localStorage.removeItem('neuropulse_user_profile');
            
            // Redirecionar para login
            window.location.href = 'login.html';
        }
    }
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================

// Inicializar a página
const ageTimelinePage = new AgeTimelinePage();

// CSS para animações dinâmicas
const dynamicStyles = `
@keyframes dropdownFadeOut {
    from {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
    to {
        opacity: 0;
        transform: translateY(-10px) scale(0.95);
    }
}

.animated-in {
    animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.timeline-item.active .timeline-content {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(139, 92, 246, 0.25);
}

@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
`;

// Adicionar estilos dinâmicos
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);