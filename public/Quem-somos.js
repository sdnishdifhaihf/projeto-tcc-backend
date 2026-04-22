document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initProfile();
    initRealImages();
    initModalSystem();
    initLogoMascoteAnimations();
    initAnimations();
});

// ================= TEMA (CLARO / ESCURO) =================
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;

    const savedTheme = localStorage.getItem('neuropulse_theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    updateIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('neuropulse_theme', newTheme);
        updateIcon(newTheme);
        
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: newTheme }));
    });

    function updateIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }
}

// ================= PERFIL DE USUÁRIO =================
function initProfile() {
    const profileImg = document.getElementById('profileIconImg');
    const logoutBtn = document.getElementById('headerLogoutBtn');
    
    const userProfile = localStorage.getItem('neuropulse_user_profile');
    
    if (userProfile) {
        try {
            const userData = JSON.parse(userProfile);
            if (userData.photo && userData.photo.trim() !== '') {
                profileImg.src = userData.photo;
                profileImg.onerror = () => {
                    setDefaultProfileImage(profileImg, userData.name);
                };
            } else {
                setDefaultProfileImage(profileImg, userData.name);
            }
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            setDefaultProfileImage(profileImg, 'User');
        }
    } else {
        setDefaultProfileImage(profileImg, 'N P');
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if(confirm("Deseja realmente sair?")) {
                localStorage.removeItem('neuropulse_user_profile');
                localStorage.removeItem('neuropulse_current_user');
                alert("Logout realizado!");
                window.location.href = 'login.html';
            }
        });
    }
    
    function setDefaultProfileImage(imgElement, name) {
        const defaultName = name || 'User';
        imgElement.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(defaultName)}&background=8b5cf6&color=fff&size=150`;
    }
}

// ================= GERENCIAMENTO DE IMAGENS REAIS =================
function initRealImages() {
    const realLogo = document.querySelector('.real-logo');
    const realMascote = document.querySelector('.real-mascote');
    const logoImg = document.querySelector('.logo-img');
    const modalLogo = document.querySelector('.modal-logo');
    const modalMascote = document.querySelector('.modal-mascote');
    
    const setupImageFallback = (imgElement, fallbackType, containerSelector) => {
        if (!imgElement) return;
        
        imgElement.onerror = function() {
            console.log(`Imagem ${fallbackType} não carregada, usando fallback`);
            this.style.display = 'none';
            
            const parent = this.parentElement;
            if (!parent) return;
            
            let fallbackHTML = '';
            if (fallbackType === 'logo') {
                fallbackHTML = `
                    <div class="logo-fallback">
                        <div class="fallback-symbol">NP</div>
                        <div class="fallback-pulse"></div>
                    </div>
                `;
            } else if (fallbackType === 'mascote') {
                fallbackHTML = `
                    <div class="mascote-fallback">
                        <div class="fallback-emoji">🎵</div>
                        <div class="fallback-waves">
                            <div class="wave"></div>
                            <div class="wave delay-1"></div>
                            <div class="wave delay-2"></div>
                        </div>
                    </div>
                `;
            }
            
            parent.insertAdjacentHTML('beforeend', fallbackHTML);
        };
        
        imgElement.onload = function() {
            console.log(`Imagem ${fallbackType} carregada com sucesso`);
            this.classList.add('loaded');
            
            this.style.opacity = '0';
            this.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                this.style.transition = 'all 0.5s ease';
                this.style.opacity = '1';
                this.style.transform = 'scale(1)';
            }, 100);
        };
        
        imgElement.loading = 'eager';
        imgElement.decoding = 'async';
    };
    
    if (realLogo) setupImageFallback(realLogo, 'logo', '.logo-image-container');
    if (realMascote) setupImageFallback(realMascote, 'mascote', '.mascote-image-container');
    if (logoImg) setupImageFallback(logoImg, 'logo', '.logo-image');
    if (modalLogo) setupImageFallback(modalLogo, 'logo', '.modal-image-container');
    if (modalMascote) setupImageFallback(modalMascote, 'mascote', '.modal-image-container');
    
    preloadImages();
    
    setTimeout(() => {
        document.body.classList.add('images-loaded');
    }, 1000);
}

function preloadImages() {
    const images = [
        'assets/logos/neuropulse-logo.png',
        'assets/mascotes/nexus-mascote.png'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = () => console.log(`Pré-carregada: ${src}`);
        img.onerror = () => console.warn(`Falha ao pré-carregar: ${src}`);
    });
}

// ================= SISTEMA DE MODAL =================
function initModalSystem() {
    const logoModal = document.getElementById('logoModal');
    const mascoteModal = document.getElementById('mascoteModal');
    const closeLogoModal = document.getElementById('closeLogoModal');
    const closeMascoteModal = document.getElementById('closeMascoteModal');
    const logoItem = document.getElementById('logoItem');
    const mascoteItem = document.getElementById('mascoteItem');
    const viewLogoBtn = document.getElementById('viewLogoBtn');
    const viewMascoteBtn = document.getElementById('viewMascoteBtn');
    const headerLogo = document.getElementById('headerLogo');
    
    // Abrir modal da logo
    const openLogoModal = () => {
        logoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.dispatchEvent(new CustomEvent('modalOpened', { detail: 'logo' }));
        
        // Efeito especial
        createModalEntranceEffect('logoModal');
    };
    
    // Abrir modal do mascote
    const openMascoteModal = () => {
        mascoteModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.dispatchEvent(new CustomEvent('modalOpened', { detail: 'mascote' }));
        
        // Efeito especial
        createModalEntranceEffect('mascoteModal');
    };
    
    // Fechar modais
    const closeLogoModalFunc = () => {
        logoModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        document.dispatchEvent(new CustomEvent('modalClosed', { detail: 'logo' }));
    };
    
    const closeMascoteModalFunc = () => {
        mascoteModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        document.dispatchEvent(new CustomEvent('modalClosed', { detail: 'mascote' }));
    };
    
    // Event listeners para abrir modais
    if (logoItem) {
        logoItem.addEventListener('click', openLogoModal);
    }
    
    if (mascoteItem) {
        mascoteItem.addEventListener('click', openMascoteModal);
    }
    
    if (viewLogoBtn) {
        viewLogoBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openLogoModal();
        });
    }
    
    if (viewMascoteBtn) {
        viewMascoteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openMascoteModal();
        });
    }
    
    if (headerLogo) {
        headerLogo.addEventListener('click', (e) => {
            e.preventDefault();
            openLogoModal();
        });
    }
    
    // Event listeners para fechar modais
    if (closeLogoModal) {
        closeLogoModal.addEventListener('click', closeLogoModalFunc);
    }
    
    if (closeMascoteModal) {
        closeMascoteModal.addEventListener('click', closeMascoteModalFunc);
    }
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', (e) => {
        if (logoModal.classList.contains('active') && e.target === logoModal) {
            closeLogoModalFunc();
        }
        if (mascoteModal.classList.contains('active') && e.target === mascoteModal) {
            closeMascoteModalFunc();
        }
    });
    
    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (logoModal.classList.contains('active')) {
                closeLogoModalFunc();
            } else if (mascoteModal.classList.contains('active')) {
                closeMascoteModalFunc();
            }
        }
    });
    
    // Efeito de entrada do modal
    function createModalEntranceEffect(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        const content = modal.querySelector('.modal-content');
        content.style.animation = 'none';
        
        setTimeout(() => {
            content.style.animation = 'modalSlideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        }, 10);
        
        // Efeito de partículas
        createModalParticles(modalId);
    }
    
    // Criar partículas para o modal
    function createModalParticles(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        const rect = modal.getBoundingClientRect();
        const particleCount = modalId === 'logoModal' ? 15 : 12;
        const color = modalId === 'logoModal' ? [139, 92, 246] : [236, 72, 153];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = '8px';
            particle.style.height = '8px';
            particle.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            particle.style.borderRadius = '50%';
            particle.style.left = `${rect.left + Math.random() * rect.width}px`;
            particle.style.top = `${rect.top + Math.random() * rect.height}px`;
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1999';
            particle.style.boxShadow = `0 0 15px rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            
            document.body.appendChild(particle);
            
            // Animação da partícula para o centro
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const startX = parseFloat(particle.style.left);
            const startY = parseFloat(particle.style.top);
            
            particle.animate([
                {
                    transform: `translate(0, 0) scale(1)`,
                    opacity: 1
                },
                {
                    transform: `translate(${centerX - startX}px, ${centerY - startY}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: 600 + Math.random() * 400,
                easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
            });
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 1000);
        }
    }
    
    // Eventos para animações do modal
    document.addEventListener('modalOpened', (e) => {
        console.log(`Modal ${e.detail} aberto`);
        
        // Pausar animações de fundo
        const backgroundElements = document.querySelectorAll('.real-logo, .real-mascote');
        backgroundElements.forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    });
    
    document.addEventListener('modalClosed', (e) => {
        console.log(`Modal ${e.detail} fechado`);
        
        // Retomar animações de fundo
        const backgroundElements = document.querySelectorAll('.real-logo, .real-mascote');
        backgroundElements.forEach(el => {
            el.style.animationPlayState = 'running';
        });
    });
}

// ================= ANIMAÇÕES DE LOGO E MASCOTE =================
function initLogoMascoteAnimations() {
    const logoItem = document.getElementById('logoItem');
    const mascoteItem = document.getElementById('mascoteItem');
    
    setTimeout(() => {
        if (logoItem) {
            logoItem.style.animation = 'slideInRight 0.8s ease forwards';
            
            logoItem.addEventListener('mouseenter', () => animateLogoReal(true));
            logoItem.addEventListener('mouseleave', () => animateLogoReal(false));
            
            // Tooltip já está no HTML
        }
    }, 500);
    
    setTimeout(() => {
        if (mascoteItem) {
            mascoteItem.style.animation = 'slideInRight 0.8s ease forwards';
            
            mascoteItem.addEventListener('mouseenter', () => animateMascoteReal(true));
            mascoteItem.addEventListener('mouseleave', () => animateMascoteReal(false));
        }
    }, 1500);
    
    function animateLogoReal(hover) {
        const logoImage = document.querySelector('.real-logo');
        const logoGlow = document.querySelector('.logo-glow');
        const logoContainer = document.querySelector('.logo-image-container');
        
        if (!logoImage) return;
        
        if (hover) {
            logoImage.style.transform = 'scale(1.15) rotate(5deg)';
            logoImage.style.filter = 'drop-shadow(0 0 25px rgba(139, 92, 246, 0.7))';
            if (logoGlow) logoGlow.style.opacity = '1';
            if (logoContainer) {
                logoContainer.style.boxShadow = '0 0 30px rgba(139, 92, 246, 0.3)';
                logoContainer.style.borderColor = 'var(--accent1)';
            }
        } else {
            logoImage.style.transform = 'scale(1) rotate(0)';
            logoImage.style.filter = 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))';
            if (logoGlow) logoGlow.style.opacity = '0';
            if (logoContainer) {
                logoContainer.style.boxShadow = 'none';
                logoContainer.style.borderColor = 'var(--border)';
            }
        }
    }
    
    function animateMascoteReal(hover) {
        const mascoteImage = document.querySelector('.real-mascote');
        const mascoteGlow = document.querySelector('.mascote-glow');
        const mascoteContainer = document.querySelector('.mascote-image-container');
        
        if (!mascoteImage) return;
        
        if (hover) {
            mascoteImage.style.transform = 'scale(1.15)';
            mascoteImage.style.filter = 'drop-shadow(0 0 25px rgba(236, 72, 153, 0.7))';
            if (mascoteGlow) mascoteGlow.style.opacity = '1';
            if (mascoteContainer) {
                mascoteContainer.style.boxShadow = '0 0 30px rgba(236, 72, 153, 0.3)';
                mascoteContainer.style.borderColor = 'var(--accent2)';
            }
        } else {
            mascoteImage.style.transform = 'scale(1)';
            mascoteImage.style.filter = 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))';
            if (mascoteGlow) mascoteGlow.style.opacity = '0';
            if (mascoteContainer) {
                mascoteContainer.style.boxShadow = 'none';
                mascoteContainer.style.borderColor = 'var(--border)';
            }
        }
    }
}

// ================= ANIMAÇÕES DE SCROLL =================
function initAnimations() {
    const header = document.querySelector('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 50) {
            header.style.padding = '10px 36px';
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        } else {
            header.style.padding = '15px 36px';
            header.style.boxShadow = 'none';
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('visible');
                
                if (entry.target.classList.contains('brand-showcase')) {
                    setTimeout(() => {
                        const logoItem = document.getElementById('logoItem');
                        const mascoteItem = document.getElementById('mascoteItem');
                        
                        if (logoItem && !logoItem.classList.contains('animated')) {
                            logoItem.style.animation = 'slideInRight 0.8s ease forwards';
                            logoItem.classList.add('animated');
                        }
                        
                        setTimeout(() => {
                            if (mascoteItem && !mascoteItem.classList.contains('animated')) {
                                mascoteItem.style.animation = 'slideInRight 0.8s ease forwards';
                                mascoteItem.classList.add('animated');
                            }
                        }, 1000);
                    }, 300);
                }
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    const elementsToAnimate = document.querySelectorAll(
        '.member-card, .text-block, .vision-banner, .value-card, .quote-container, .glass-card, .brand-showcase'
    );
    
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease-out';
        observer.observe(el);
    });
    
    document.addEventListener('themeChanged', () => {
        elementsToAnimate.forEach(el => {
            el.style.transition = 'all 0.5s ease';
        });
    });
}

// ================= INICIALIZAÇÃO GERAL =================
window.addEventListener('load', () => {
    setTimeout(() => {
        document.body.classList.add('page-loaded');
        
        const logoItem = document.getElementById('logoItem');
        const mascoteItem = document.getElementById('mascoteItem');
        
        if (logoItem && !logoItem.classList.contains('animated')) {
            logoItem.style.animation = 'slideInRight 0.8s ease forwards';
            logoItem.classList.add('animated');
        }
        
        if (mascoteItem && !mascoteItem.classList.contains('animated')) {
            setTimeout(() => {
                mascoteItem.style.animation = 'slideInRight 0.8s ease forwards';
                mascoteItem.classList.add('animated');
            }, 1000);
        }
    }, 100);
});

// ================= FUNÇÕES AUXILIARES =================
document.addEventListener('click', (e) => {
    const profileIcon = document.getElementById('userProfileIcon');
    const dropdown = document.querySelector('.profile-dropdown');
    
    if (profileIcon && dropdown && 
        !profileIcon.contains(e.target) && 
        !dropdown.contains(e.target)) {
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
        dropdown.style.transform = 'translateY(-10px)';
    }
});

// Sistema de loading screen
window.addEventListener('beforeunload', () => {
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loading-content">
            <div class="loading-logo">
                <div class="loading-pulse"></div>
            </div>
            <p>Carregando NeuroPulse...</p>
        </div>
    `;
    loadingScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--bg);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    `;
    document.body.appendChild(loadingScreen);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loadingScreen.parentNode) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => loadingScreen.remove(), 500);
            }
        }, 500);
    });
});