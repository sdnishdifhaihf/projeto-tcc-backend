// Musicas.js - Funcionalidades da página de Playlists

document.addEventListener('DOMContentLoaded', function() {
    // Elementos principais
    const moodBtns = document.querySelectorAll('.mood-btn');
    const playlistCards = document.querySelectorAll('.playlist-card');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const header = document.querySelector('header');
    const profileIconImg = document.getElementById('profileIconImg');
    const userProfileIcon = document.getElementById('userProfileIcon');
    const profileDropdown = document.getElementById('profileDropdown');
    const logoutBtn = document.getElementById('headerLogoutBtn');
    const playBtns = document.querySelectorAll('.play-btn');
    
    // SVG base64 para imagem de perfil padrão (CORRIGIDO)
    const defaultProfileSVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzhiNWNmNiIgZmlsbC1vcGFjaXR5PSIwLjEiLz48cGF0aCBkPSJNMjAgMTguMDAwMUMyMi4yMDkxIDE4LjAwMDEgMjQgMTYuMjA5MiAyNCAxNC4wMDAxQzI0IDExLjc5MSAyMi4yMDkxIDEwLjAwMDEgMjAgMTAuMDAwMUMxNy43OTA5IDEwLjAwMDEgMTYgMTEuNzkxIDE2IDE0LjAwMDFDMTYgMTYuMjA5MiAxNy43OTA5IDE4LjAwMDEgMjAgMTguMDAwMVoiIGZpbGw9IiM4YjVjZjYiLz48cGF0aCBkPSJNMjAgMjAuMDAwMUMxNi42ODYzIDIwLjAwMDEgMTQgMjIuNjg2NCAxNCAyNi4wMDAxVjI4LjAwMDFIMjZWMjYuMDAwMUMyNiAyMi42ODY0IDIzLjMxMzcgMjAuMDAwMSAyMCAyMC4wMDAxWiIgZmlsbD0iIzhiNWNmNiIvPjwvc3ZnPg==';
    
    // ========== CARREGAR FOTO DE PERFIL ==========
    function loadProfilePicture() {
        const savedProfilePic = localStorage.getItem('profilePicture');
        
        if (savedProfilePic) {
            profileIconImg.src = savedProfilePic;
        } else {
            profileIconImg.src = defaultProfileSVG;
        }
        
        profileIconImg.onerror = function() {
            this.src = defaultProfileSVG;
        };
    }
    
    // ========== FILTRAGEM POR MOOD ==========
    function initMoodFilter() {
        moodBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remover ativo de todos os botões
                moodBtns.forEach(b => b.classList.remove('active'));
                
                // Adicionar ativo ao botão clicado
                this.classList.add('active');
                
                // Efeito visual suave
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
                
                const mood = this.dataset.mood;
                filterPlaylists(mood);
            });
        });
    }
    
    function filterPlaylists(mood) {
        playlistCards.forEach(card => {
            const cardCategory = card.dataset.category;
            
            if (mood === 'all' || cardCategory === mood) {
                // Mostrar card com animação suave
                card.style.display = 'flex';
                setTimeout(() => {
                    card.classList.add('visible');
                }, 50);
            } else {
                // Esconder card com animação
                card.classList.remove('visible');
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
    
    // ========== FUNCIONALIDADE DE PLAY BUTTON ==========
    function initPlayButtons() {
        playBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const card = this.closest('.playlist-card');
                const title = card.querySelector('.card-title').textContent;
                
                // Efeito visual de play
                this.style.transform = 'scale(1.2)';
                const icon = this.querySelector('i');
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
                
                // Simular play por 3 segundos
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                    icon.classList.remove('fa-pause');
                    icon.classList.add('fa-play');
                }, 3000);
                
                // Feedback para usuário
                showNotification('Reproduzindo prévia da playlist...');
            });
        });
    }
    
    // ========== NOTIFICAÇÃO TEMPORÁRIA ==========
    function showNotification(message) {
        // Remover notificação anterior se existir
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
    
    // ========== FUNCIONALIDADE DE TEMA CLARO/ESCURO ==========
    function applyTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            document.body.classList.remove('light-theme');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }
    
    if (themeToggle && themeIcon) {
        // Verificar tema salvo primeiro
        const savedTheme = localStorage.getItem('theme') || 'dark';
        applyTheme(savedTheme);
        
        themeToggle.addEventListener('click', function() {
            const isLightTheme = document.body.classList.contains('light-theme');
            
            if (isLightTheme) {
                // Mudar para tema escuro
                applyTheme('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                // Mudar para tema claro
                applyTheme('light');
                localStorage.setItem('theme', 'light');
            }
            
            // Efeito visual
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }
    
    // ========== EFEITO DE SCROLL NO HEADER ==========
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
    
    // ========== DESTACAR PÁGINA ATUAL NA NAVEGAÇÃO ==========
    function highlightCurrentPage() {
        const currentPage = window.location.pathname.split('/').pop() || 'Musicas.html';
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // ========== FUNCIONALIDADE DO DROPDOWN DO PERFIL ==========
    if (userProfileIcon && profileDropdown) {
        // Esconder dropdown inicialmente
        profileDropdown.style.display = 'none';
        
        userProfileIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            const isVisible = profileDropdown.style.display === 'block';
            profileDropdown.style.display = isVisible ? 'none' : 'block';
        });
        
        // Fechar dropdown ao clicar fora
        document.addEventListener('click', function() {
            profileDropdown.style.display = 'none';
        });
        
        // Prevenir que cliques no dropdown fechem ele
        profileDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Fechar dropdown com tecla Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                profileDropdown.style.display = 'none';
            }
        });
        
        // Acessibilidade: fechar com Tab
        userProfileIcon.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const isVisible = profileDropdown.style.display === 'block';
                profileDropdown.style.display = isVisible ? 'none' : 'block';
            }
        });
    }
    
    // ========== FUNCIONALIDADE DE LOGOUT ==========
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Tem certeza que deseja sair?')) {
                localStorage.removeItem('userToken');
                localStorage.removeItem('profilePicture');
                localStorage.removeItem('theme');
                window.location.href = 'login.html';
            }
        });
    }
    
    // ========== ANIMAÇÃO DE ENTRADA DOS CARDS ==========
    function animateCardsOnScroll() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observar cards de playlist
        playlistCards.forEach(card => {
            observer.observe(card);
        });
        
        // Observar cards de guia
        document.querySelectorAll('.guide-card').forEach(card => {
            observer.observe(card);
        });
        
        // Observar cards de benefícios
        document.querySelectorAll('.benefit-card').forEach(card => {
            observer.observe(card);
        });
    }
    
    // ========== ATUALIZAR ANO NO COPYRIGHT ==========
    const copyright = document.querySelector('.copyright');
    if (copyright) {
        const currentYear = new Date().getFullYear();
        copyright.textContent = `© ${currentYear} NeuroPulse. Todos os direitos reservados.`;
    }
    
    // ========== TRACKING DE CLICKS NOS BOTÕES DE PLATAFORMA ==========
    function trackPlatformClicks() {
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const platform = this.classList.contains('spotify-btn') ? 'Spotify' : 'YouTube';
                const card = this.closest('.playlist-card');
                const title = card.querySelector('.card-title').textContent;
                
                // Incrementar contador de interações
                const interactions = parseInt(localStorage.getItem('playlist_interactions') || '0');
                localStorage.setItem('playlist_interactions', (interactions + 1).toString());
                
                // Log (pode ser removido em produção)
                console.log(`🎵 Acessando ${platform}: ${title} (Total: ${interactions + 1} interações)`);
            });
        });
    }
    
    // ========== ACESSIBILIDADE ==========
    function initAccessibility() {
        // Melhorar navegação por teclado
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-navigation');
        });
        
        // Adicionar foco visível para elementos
        const focusableElements = document.querySelectorAll('button, a, [tabindex]');
        focusableElements.forEach(el => {
            el.addEventListener('focus', function() {
                this.style.outline = '2px solid var(--accent1)';
                this.style.outlineOffset = '2px';
            });
            
            el.addEventListener('blur', function() {
                this.style.outline = 'none';
            });
        });
    }
    
    // ========== PREVENIR TREMORES ==========
    function preventShaking() {
        // Forçar hardware acceleration para animações suaves
        const elementsToOptimize = document.querySelectorAll('.playlist-card, .mood-btn, .theme-toggle, .profile-icon-img');
        elementsToOptimize.forEach(el => {
            el.style.transform = 'translateZ(0)';
            el.style.backfaceVisibility = 'hidden';
            el.style.perspective = '1000px';
        });
        
        // Otimizar transições
        document.body.style.willChange = 'auto';
    }
    
    // ========== INICIALIZAR TODAS AS FUNÇÕES ==========
    function init() {
        loadProfilePicture();
        initMoodFilter();
        initPlayButtons();
        highlightCurrentPage();
        animateCardsOnScroll();
        trackPlatformClicks();
        initAccessibility();
        preventShaking();
        
        // Adicionar classe de carregamento para transições suaves
        setTimeout(() => {
            document.body.classList.add('loaded');
            // Tornar todos os cards visíveis inicialmente
            playlistCards.forEach(card => {
                card.classList.add('visible');
            });
        }, 100);
    }
    
    init();
});

// Prevenir comportamento padrão de arrastar imagens
document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});