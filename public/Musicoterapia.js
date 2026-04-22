// Musicoterapia.js - Funcionalidades da página de Musicoterapia

document.addEventListener('DOMContentLoaded', function() {
    // Elementos principais
    const showInfoBtn = document.getElementById('show-info-btn');
    const moreInfo = document.getElementById('more-info');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const header = document.querySelector('header');
    const profileIconImg = document.getElementById('profileIconImg');
    
    // ========== CARREGAR FOTO DE PERFIL ==========
    function loadProfilePicture() {
        const savedProfilePic = localStorage.getItem('profilePicture');
        const defaultProfileSVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM4QjVDRjYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+CjxwYXRoIGQ9Ik0yMCAxOEMyMi4yMDkxIDE4IDI0IDE2LjIwOTEgMjQgMTRDMjQgMTEuNzkwOSAyMi4yMDkxIDEwIDIwIDEwQzE3Ljc5MDkgMTAgMTYgMTEuNzkwOSAxNiAxNEMxNiAxNi4yMDkxIDE3Ljc5MDkgMTggMjAgMThaIiBmaWxsPSIjOEI1Q0Y2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEMxNi42ODYzIDIwIDE0IDIyLjY4NjMgMTQgMjZWMjhIMjZWMjZDMjYgMjIuNjg2MyAyMy4zMTM3IDIwIDIwIDIwWiIgZmlsbD0iIzhCNUNGNiIvPgo8L3N2Zz4K';
        
        if (savedProfilePic) {
            profileIconImg.src = savedProfilePic;
        } else {
            profileIconImg.src = defaultProfileSVG;
        }
        
        profileIconImg.onerror = function() {
            this.src = defaultProfileSVG;
        };
    }
    
    // ========== FUNCIONALIDADE DE MOSTRAR/OCULTAR INFORMAÇÕES ==========
    if (showInfoBtn && moreInfo) {
        showInfoBtn.addEventListener('click', function() {
            const isHidden = moreInfo.classList.contains('info-hidden');
            
            if (isHidden) {
                // Mostrar informações
                moreInfo.classList.remove('info-hidden');
                moreInfo.style.display = 'block';
                showInfoBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Menos Informações';
                showInfoBtn.setAttribute('aria-expanded', 'true');
                
                // Rolar suavemente para as informações
                setTimeout(() => {
                    moreInfo.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }, 100);
            } else {
                // Ocultar informações
                moreInfo.classList.add('info-hidden');
                moreInfo.style.display = 'none';
                showInfoBtn.innerHTML = '<i class="fas fa-heart"></i> Conhecer Benefícios';
                showInfoBtn.setAttribute('aria-expanded', 'false');
            }
        });
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
        const currentPage = window.location.pathname.split('/').pop() || 'Musicoterapia.html';
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || 
                (currentPage === 'Musicoterapia.html' && linkHref === 'Musicoterapia.html') ||
                (linkHref === 'Musicoterapia.html' && currentPage.includes('Musicoterapia'))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // ========== FUNCIONALIDADE DO DROPDOWN DO PERFIL ==========
    const userProfileIcon = document.getElementById('userProfileIcon');
    const profileDropdown = document.getElementById('profileDropdown');
    
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
    }
    
    // ========== FUNCIONALIDADE DE LOGOUT ==========
    const logoutBtn = document.getElementById('headerLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Tem certeza que deseja sair?')) {
                localStorage.removeItem('userToken');
                localStorage.removeItem('profilePicture');
                window.location.href = 'login.html';
            }
        });
    }
    
    // ========== SCROLL SUAVE PARA ÂNCORAS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // ========== ATUALIZAR ANO NO COPYRIGHT ==========
    const copyright = document.querySelector('.copyright');
    if (copyright) {
        const currentYear = new Date().getFullYear();
        copyright.textContent = `© ${currentYear} NeuroPulse. Todos os direitos reservados.`;
    }
    
    // ========== INICIALIZAR FUNÇÕES ==========
    loadProfilePicture();
    highlightCurrentPage();
    initAccessibility();
    
    // Adicionar classe de carregamento para transições suaves
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// ========== FUNCIONALIDADES DE ACESSIBILIDADE ==========
function initAccessibility() {
    // Adicionar labels para elementos interativos
    const interactiveElements = document.querySelectorAll('button, [tabindex]');
    interactiveElements.forEach(el => {
        if (!el.getAttribute('aria-label') && !el.textContent.trim()) {
            el.setAttribute('aria-label', 'Elemento interativo');
        }
    });
    
    // Melhorar navegação por teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
}