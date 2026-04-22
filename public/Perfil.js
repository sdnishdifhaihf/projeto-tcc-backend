// ═══════════════════════════════════════════════════════════
//  🔄 FUNÇÃO CORRIGIDA: Buscar perfil do Flask API
// ═══════════════════════════════════════════════════════════
async function fetchUserProfileFromFlask() {
    try {
        console.log('🔗 Buscando perfil do Flask API...');
        
        // Pega o email do usuário logado (salvo pelo login)
        const userData = JSON.parse(localStorage.getItem('neuropulse_user') || '{}');
        const userEmail = userData.email;
        
        if (!userEmail) {
            console.log('❌ Nenhum email encontrado no localStorage');
            return null;
        }
        
        // CHAMADA CORRETA: endpoint com email como parâmetro
        const response = await fetch(`http://localhost:5000/api/usuario/perfil?email=${encodeURIComponent(userEmail)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('📡 Status da resposta:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Dados recebidos do Flask:', data);
            
            if (data.success) {
                return data;  // Retorna o objeto completo
            }
        } else {
            const errorData = await response.json();
            console.log('❌ Erro na resposta do Flask:', errorData);
        }
        
        return null;
        
    } catch (error) {
        console.log('❌ Erro ao buscar perfil do Flask:', error);
        return null;
    }
}

// Nova função: Converter dados Flask para formato do Perfil
function formatFlaskToProfile(flaskUser) {
    console.log('🔄 Convertendo dados do Flask para formato do Perfil:', flaskUser);
    
    // Calcula idade a partir da data de nascimento
    let age = null;
    if (flaskUser.data_nascimento) {
        const birthDate = new Date(flaskUser.data_nascimento);
        const today = new Date();
        age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
    }
    
    // Formata condição de saúde
    let condition = flaskUser.condicao_saude || 'Não informado';
    let therapy = 'Não';
    
    if (flaskUser.acompanhamento_terapeutico !== undefined) {
        therapy = flaskUser.acompanhamento_terapeutico ? 'Sim' : 'Não';
    }
    
    // Formata gênero
    let gender = flaskUser.genero || 'Não informado';
    const genderMap = {
        'masculino': 'Masculino',
        'feminino': 'Feminino',
        'outro': 'Outro',
        'prefiro_nao_informar': 'Prefiro não informar'
    };
    gender = genderMap[gender] || gender;
    
    // Retorna no formato esperado pelo perfil
    return {
        id: flaskUser.id,
        name: flaskUser.nome_completo || flaskUser.nome || 'Usuário',
        email: flaskUser.email || 'Email não informado',
        age: age || flaskUser.idade || null,
        gender: gender,
        health: {
            condition: condition,
            therapy: therapy
        },
        stats: {
            playlists: 0,
            songs: 0,
            sessions: 0,
            totalListeningTime: 0,
            articlesRead: 0
        },
        plan: 'Premium',
        photo: flaskUser.foto_perfil || `https://ui-avatars.com/api/?name=${encodeURIComponent(flaskUser.nome_completo || 'Usuário')}&background=8b5cf6&color=fff&size=120`
    };
}

// ============================================================
//  📊 CARREGAR DADOS DO USUÁRIO (SIMPLIFICADA)
// ============================================================
const loadUserData = async () => {
    console.log('🔍 Carregando dados do usuário...');
    
    // PRIMEIRO: Tenta buscar dados ATUALIZADOS do Flask
    try {
        const flaskResponse = await fetchUserProfileFromFlask();
        
        if (flaskResponse && flaskResponse.success) {
            console.log('✅ Dados recebidos do Flask:', flaskResponse);
            
            // Formata os dados para o perfil
            const formattedUser = formatFlaskToProfile(flaskResponse);
            
            // Salva em todas as chaves para compatibilidade
            localStorage.setItem('neuropulse_current_user', JSON.stringify(formattedUser));
            localStorage.setItem('neuropulse_user_profile', JSON.stringify(formattedUser));
            
            // Também salva os dados crus do Flask
            localStorage.setItem('neuropulse_user', JSON.stringify(flaskResponse));
            
            console.log('💾 Dados do Flask salvos localmente');
            return formattedUser;
        }
    } catch (error) {
        console.log('⚠️ Não conseguiu buscar do Flask, usando dados locais:', error);
    }
    
    // SEGUNDO: Se o Flask falhou, usa dados locais
    const sources = [
        'neuropulse_current_user',
        'neuropulse_user_profile',
        'neuropulse_user',  // Dados do login Flask
        'neuropulse_logged_user',
        'neuropulse_last_registered'
    ];
    
    for (const source of sources) {
        const data = localStorage.getItem(source);
        if (data) {
            try {
                const parsed = JSON.parse(data);
                console.log(`✅ Dados encontrados em ${source}:`, parsed);
                
                // Se for dados do Flask (neuropulse_user), converte
                if (source === 'neuropulse_user') {
                    return formatFlaskToProfile(parsed);
                }
                return parsed;
            } catch (e) {
                console.error(`❌ Erro ao parsear ${source}:`, e);
            }
        }
    }
    
    console.log('❌ Nenhum dado encontrado em nenhuma fonte');
    return null;
};

// ═══════════════════════════════════════════════════════════
//  🖼️ PREENCHER PERFIL COM OS DADOS (ATUALIZADA)
// ═══════════════════════════════════════════════════════════

const fillProfileData = (userData) => {
    if (!userData) {
        console.error('❌ Nenhum dado de usuário encontrado!');
        showNotification('Erro ao carregar perfil. Faça login novamente.', 'error');
        
        // NOVO: Tenta buscar do Flask se tiver token
        const token = localStorage.getItem('neuropulse_token');
        if (token) {
            setTimeout(async () => {
                const flaskData = await fetchUserProfileFromFlask();
                if (flaskData) {
                    const formattedUser = formatFlaskToProfile(flaskData);
                    fillProfileData(formattedUser);
                    showNotification('Perfil carregado com sucesso!', 'success');
                }
            }, 1000);
        }
        
        return;
    }
    
    console.log('🖼️ Preenchendo perfil com:', userData);
    
    // Informações básicas (SEU CÓDIGO ORIGINAL - NÃO MUDOU)
    if (userData.name) {
        document.getElementById('profileName').textContent = userData.name;
        document.getElementById('infoName').textContent = userData.name;
    }
    
    if (userData.email) {
        document.getElementById('profileEmail').textContent = userData.email;
        document.getElementById('infoEmail').textContent = userData.email;
    }
    
    if (userData.age) {
        document.getElementById('infoAge').textContent = `${userData.age} anos`;
    }
    
    if (userData.gender) {
        // Converte valor para texto legível
        const genderMap = {
            'masculino': 'Masculino',
            'feminino': 'Feminino',
            'outro': 'Outro',
            'prefiro_nao_informar': 'Prefiro não informar'
        };
        document.getElementById('infoGender').textContent = genderMap[userData.gender] || userData.gender;
    }
    
    // Informações de saúde (SEU CÓDIGO ORIGINAL - NÃO MUDOU)
    if (userData.health) {
        if (userData.health.condition) {
            const condition = userData.health.condition;
            const conditionMap = {
                'tea': 'TEA (Transtorno do Espectro Autista)',
                'tdah': 'TDAH (Transtorno de Déficit de Atenção)',
                'ansiedade': 'Transtorno de Ansiedade',
                'depressao': 'Depressão',
                'toc': 'TOC (Transtorno Obsessivo Compulsivo)',
                'outro': userData.health.otherCondition || 'Outro'
            };
            document.getElementById('infoCondition').textContent = conditionMap[condition] || condition;
        }
        
        if (userData.health.therapy) {
            const therapyMap = {
                'sim_psicologo': 'Sim, com psicólogo',
                'sim_psiquiatra': 'Sim, com psiquiatra',
                'sim_ambos': 'Sim, com psicólogo e psiquiatra',
                'nao': 'Não',
                'prefiro_nao_informar': 'Prefiro não informar'
            };
            document.getElementById('infoTherapy').textContent = therapyMap[userData.health.therapy] || userData.health.therapy;
        }
    }
    
    // Estatísticas (SEU CÓDIGO ORIGINAL - NÃO MUDOU)
    if (userData.stats) {
        document.getElementById('statPlaylists').textContent = userData.stats.playlists || '0';
        document.getElementById('statSongs').textContent = userData.stats.songs || '0';
        document.getElementById('statSessions').textContent = userData.stats.sessions || '0';
    }
    
    // Foto de perfil (SEU CÓDIGO ORIGINAL - NÃO MUDOU)
    if (userData.photo) {
        const profileAvatar = document.getElementById('profileAvatar');
        if (profileAvatar) {
            profileAvatar.src = userData.photo;
        }
    }
    
    // Badge/Plano (SEU CÓDIGO ORIGINAL - NÃO MUDOU)
    if (userData.plan) {
        document.getElementById('profileBadge').textContent = userData.plan === 'Premium' ? 'Ouvinte Premium' : 'Ouvinte Básico';
    }
    
    console.log('✅ Perfil preenchido com sucesso!');
};

// ═══════════════════════════════════════════════════════════
//  🚀 INICIALIZAR PERFIL (ATUALIZADA)
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando carregamento do perfil...');
    
    // NOVO: Verifica token primeiro
    const token = localStorage.getItem('neuropulse_token');
    if (!token) {
        console.error('❌ Nenhum token encontrado! Usuário não está logado.');
        showNotification('Você precisa fazer login primeiro', 'error');
        
        setTimeout(() => {
            window.location.href = 'Login.html';
        }, 2000);
        return;
    }
    
    console.log('✅ Token encontrado, prosseguindo...');
    
    // Carrega dados do usuário
    const userData = loadUserData();
    
    if (userData) {
        // Preenche os dados
        fillProfileData(userData);
        
        // Mostra mensagem de sucesso
        setTimeout(() => {
            showNotification(`Bem-vindo, ${userData.name || 'Usuário'}!`, 'success');
        }, 500);
    } else {
        // Nenhum usuário encontrado, mas tem token - tenta buscar do Flask
        console.log('🔄 Token encontrado mas sem dados. Buscando do Flask...');
        
        showNotification('Carregando seus dados...', 'info');
        
        setTimeout(async () => {
            const flaskData = await fetchUserProfileFromFlask();
            if (flaskData) {
                const formattedUser = formatFlaskToProfile(flaskData);
                fillProfileData(formattedUser);
                showNotification(`Bem-vindo, ${formattedUser.name || 'Usuário'}!`, 'success');
            } else {
                // Se não conseguir buscar do Flask, mostra erro
                showNotification('Erro ao carregar perfil. Faça login novamente.', 'error');
                
                setTimeout(() => {
                    window.location.href = 'Login.html';
                }, 3000);
            }
        }, 1000);
    }
    
    // ... resto do seu código Perfil.js ...
});

// ═══════════════════════════════════════════════════════════
//  🧠 CLASSE NeuroPulseProfile (ATUALIZADA)
// ═══════════════════════════════════════════════════════════

class NeuroPulseProfile {
    constructor() {
        this.currentUser = null;
        this.isInitialized = false;
        this.storageKeys = {
            CURRENT_USER: 'neuropulse_current_user',
            USER_PROFILE: 'neuropulse_user_profile',
            THEME: 'neuropulse_theme',
            ACHIEVEMENTS: 'neuropulse_achievements',
            PLAYLISTS: 'neuropulse_playlists',
            ACTIVITIES: 'neuropulse_activities',
            // NOVO: Adicionei estas duas chaves para compatibilidade com Flask
            FLASK_USER: 'neuropulse_user',    // Chave usada pelo Login.js do Flask
            FLASK_TOKEN: 'neuropulse_token'   // Token do Flask
        };
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        document.addEventListener('DOMContentLoaded', () => {
            console.log('🚀 Inicializando NeuroPulse Profile...');
            
            this.migrateStorageKeys();
            
            if (!this.checkUserAuthentication()) {
                this.redirectToLogin();
                return;
            }
            
            this.loadTheme();
            this.loadUserData();
            this.initializeComponents();
            this.initializeNavigation();
            this.initializeHeaderEffects();
            this.setupEventListeners();
            this.initializeAnimations();
            
            this.isInitialized = true;
            console.log('✅ NeuroPulse Profile inicializado com sucesso!');
        });
    }

    migrateStorageKeys() {
        // Migra de chaves antigas para novas se necessário
        const migrationMap = {
            'currentUser': this.storageKeys.CURRENT_USER,
            'users': 'neuropulse_users',
            'theme': this.storageKeys.THEME,
            'userProfile': this.storageKeys.USER_PROFILE
        };

        Object.keys(migrationMap).forEach(oldKey => {
            const oldValue = localStorage.getItem(oldKey);
            const newKey = migrationMap[oldKey];
            
            if (oldValue && !localStorage.getItem(newKey)) {
                try {
                    localStorage.setItem(newKey, oldValue);
                    console.log(`✅ Migrado: ${oldKey} -> ${newKey}`);
                } catch (error) {
                    console.error(`❌ Erro na migração de ${oldKey}:`, error);
                }
            }
        });
    }

    loadTheme() {
        try {
            const savedTheme = localStorage.getItem(this.storageKeys.THEME) || 'dark';
            document.body.setAttribute('data-theme', savedTheme);
            this.updateThemeIcon(savedTheme);
        } catch (error) {
            console.error('❌ Erro ao carregar tema:', error);
        }
    }

    updateThemeIcon(theme) {
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            themeIcon.setAttribute('title', theme === 'dark' ? 'Modo Claro' : 'Modo Escuro');
        }
    }

    toggleTheme() {
        try {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem(this.storageKeys.THEME, newTheme);
            this.updateThemeIcon(newTheme);
            
            this.showNotification(`Tema ${newTheme === 'dark' ? 'escuro' : 'claro'} ativado`, 'success');
        } catch (error) {
            console.error('❌ Erro ao alternar tema:', error);
            this.showNotification('Erro ao alterar tema', 'error');
        }
    }

    initializeHeaderEffects() {
        const header = document.querySelector('header');
        if (!header) return;

        const updateHeader = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', updateHeader, { passive: true });
        this.updateMainContentPadding();
        window.addEventListener('resize', () => this.updateMainContentPadding());
    }

    updateMainContentPadding() {
        const header = document.querySelector('header');
        const mainContent = document.querySelector('.main-content');
        
        if (header && mainContent) {
            const headerHeight = header.offsetHeight;
            mainContent.style.paddingTop = (headerHeight + 20) + 'px';
        }
    }

    // NOVO: Método atualizado para verificar autenticação
    checkUserAuthentication() {
        try {
            // Primeiro verifica pelo token Flask (mais confiável)
            const flaskToken = localStorage.getItem(this.storageKeys.FLASK_TOKEN);
            if (flaskToken) {
                console.log('✅ Token Flask encontrado:', flaskToken.substring(0, 20) + '...');
                return true;
            }
            
            // Fallback: verifica dados locais
            const currentUser = localStorage.getItem(this.storageKeys.CURRENT_USER);
            const userProfile = localStorage.getItem(this.storageKeys.USER_PROFILE);
            
            return !!(currentUser || userProfile);
        } catch (error) {
            console.error('❌ Erro na verificação de autenticação:', error);
            return false;
        }
    }

    redirectToLogin() {
        console.log('❌ Nenhum usuário autenticado encontrado');
        this.showNotification('Por favor, faça login para acessar seu perfil', 'warning');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }

    // NOVO: Método atualizado para obter perfil
    getUserProfile() {
        try {
            // PRIORIDADE 1: Dados do Flask (neuropulse_user)
            let flaskUser = localStorage.getItem(this.storageKeys.FLASK_USER);
            if (flaskUser) {
                flaskUser = JSON.parse(flaskUser);
                console.log('📁 Perfil carregado do Flask (neuropulse_user):', flaskUser);
                
                // Converte para formato do perfil
                const formattedUser = formatFlaskToProfile(flaskUser);
                return formattedUser;
            }
            
            // PRIORIDADE 2: USER_PROFILE
            let userProfile = localStorage.getItem(this.storageKeys.USER_PROFILE);
            if (userProfile) {
                userProfile = JSON.parse(userProfile);
                console.log('📁 Perfil carregado de USER_PROFILE');
                return userProfile;
            }
            
            // PRIORIDADE 3: CURRENT_USER
            const currentUser = localStorage.getItem(this.storageKeys.CURRENT_USER);
            if (currentUser) {
                userProfile = JSON.parse(currentUser);
                console.log('📁 Perfil carregado de CURRENT_USER');
                return userProfile;
            }
            
            console.log('❌ Nenhum perfil encontrado');
            return null;
            
        } catch (error) {
            console.error('❌ Erro ao obter perfil:', error);
            this.showNotification('Erro ao carregar perfil', 'error');
            return null;
        }
    }

    saveUserProfile(updatedProfile) {
        try {
            // Salva em ambas as chaves para compatibilidade
            localStorage.setItem(this.storageKeys.CURRENT_USER, JSON.stringify(updatedProfile));
            localStorage.setItem(this.storageKeys.USER_PROFILE, JSON.stringify(updatedProfile));
            
            // NOVO: Também salva na chave do Flask para compatibilidade
            localStorage.setItem(this.storageKeys.FLASK_USER, JSON.stringify(updatedProfile));
            
            this.currentUser = updatedProfile;
            console.log('💾 Perfil salvo com sucesso');
            return true;
        } catch (error) {
            console.error('❌ Erro ao salvar perfil:', error);
            this.showNotification('Erro ao salvar perfil', 'error');
            return false;
        }
    }

    loadUserData() {
        const userProfile = this.getUserProfile();
        if (!userProfile) {
            this.showNotification('Não foi possível carregar os dados do perfil', 'error');
            this.generateDemoData();
            return;
        }

        this.currentUser = userProfile;
        console.log('👤 Dados do usuário carregados:', userProfile);

        // Atualizar interface
        this.updateBasicInfo(userProfile);
        this.updateHealthInfo(userProfile);
        this.updateStatistics(userProfile);
        this.updateUserAvatar(userProfile);
        this.updateProgress(userProfile);
        this.updateRecentActivities(userProfile);
        this.updateDetailedStats(userProfile);

        // Inicializar componentes específicos
        this.initializeFAQ();
        this.initializePlaylists();
        this.initializeHistory();
    }

    updateBasicInfo(userProfile) {
        this.updateElementText('profileName', userProfile.name || 'Usuário NeuroPulse');
        this.updateElementText('profileEmail', userProfile.email || 'Email não informado');
        this.updateElementText('infoName', userProfile.name || 'Não informado');
        this.updateElementText('infoEmail', userProfile.email || 'Não informado');
        this.updateElementText('infoAge', userProfile.age ? `${userProfile.age} anos` : 'Não informado');
    }

    updateElementText(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
        }
    }

    updateHealthInfo(userProfile) {
        const genderText = this.formatGender(userProfile.gender);
        const conditionText = this.formatCondition(userProfile.health?.condition, userProfile.health?.otherCondition);
        const therapyText = this.formatTherapy(userProfile.health?.therapy);

        this.updateElementText('infoGender', genderText);
        this.updateElementText('infoCondition', conditionText);
        this.updateElementText('infoTherapy', therapyText);
    }

    formatGender(gender) {
        const genderMap = {
            'masculino': 'Masculino',
            'feminino': 'Feminino',
            'outro': 'Outro',
            'prefiro_nao_informar': 'Prefiro não informar',
            'male': 'Masculino',
            'female': 'Feminino',
            'other': 'Outro'
        };
        return genderMap[gender] || 'Não informado';
    }

    formatCondition(condition, otherCondition) {
        if (!condition) return 'Não informado';
        
        const conditionMap = {
            'tea': 'TEA (Transtorno do Espectro Autista)',
            'tdah': 'TDAH (Transtorno de Déficit de Atenção)',
            'ansiedade': 'Transtorno de Ansiedade',
            'depressao': 'Depressão',
            'toc': 'TOC (Transtorno Obsessivo Compulsivo)',
            'outro': 'Outro'
        };
        
        return condition === 'outro' ? 
            (otherCondition || 'Outro') : 
            (conditionMap[condition] || condition);
    }

    formatTherapy(therapy) {
        if (!therapy) return 'Não informado';
        
        const therapyMap = {
            'sim_psicologo': 'Sim, com psicólogo',
            'sim_psiquiatra': 'Sim, com psiquiatra',
            'sim_ambos': 'Sim, com ambos',
            'nao': 'Não',
            'prefiro_nao_informar': 'Prefiro não informar'
        };
        
        return therapyMap[therapy] || therapy;
    }

    updateStatistics(userProfile) {
        const stats = userProfile.stats || { 
            playlists: 0, 
            songs: 0, 
            sessions: 0,
            totalListeningTime: 0,
            articlesRead: 0
        };
        
        this.updateElementText('statPlaylists', stats.playlists || 0);
        this.updateElementText('statSongs', stats.songs || 0);
        this.updateElementText('statSessions', stats.sessions || 0);
    }

    updateDetailedStats(userProfile) {
        const stats = userProfile.stats || {};
        
        // Tempo de escuta
        const totalMinutes = stats.totalListeningTime || 0;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        this.updateElementText('listeningTime', `${hours}h ${minutes}min`);
        
        // Sessões completadas
        this.updateElementText('sessionsCompleted', stats.sessions || 0);
        
        // Artigos lidos
        this.updateElementText('articlesRead', stats.articlesRead || 0);
    }

    updateUserAvatar(userProfile) {
        const avatarElement = document.getElementById('profileAvatar');
        if (!avatarElement) return;

        if (userProfile.photo) {
            avatarElement.src = userProfile.photo;
        } else {
            const name = userProfile.name || 'Usuário';
            avatarElement.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=8b5cf6&color=fff&size=120&bold=true`;
        }
        avatarElement.alt = `Avatar de ${userProfile.name || 'Usuário'}`;
    }

    updateProgress(userProfile) {
        const stats = userProfile.stats || {};
        
        // Progresso das sessões (0-20)
        const sessions = stats.sessions || 0;
        const sessionsProgress = Math.min(sessions, 20);
        this.updateProgressBar('therapy', sessionsProgress, 20);
        
        // Progresso dos artigos (0-15)
        const articles = stats.articlesRead || 0;
        const articlesProgress = Math.min(articles, 15);
        this.updateProgressBar('articles', articlesProgress, 15);
    }

    updateProgressBar(type, current, total) {
        const percentage = Math.min((current / total) * 100, 100);
        const valueElement = document.getElementById(`${type}ProgressValue`);
        const fillElement = document.getElementById(`${type}ProgressFill`);
        
        if (valueElement) {
            valueElement.textContent = `${current}/${total}`;
        }
        
        if (fillElement) {
            fillElement.style.width = `${percentage}%`;
            
            // Cor baseada no progresso
            if (percentage >= 80) {
                fillElement.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
            } else if (percentage >= 50) {
                fillElement.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
            } else {
                fillElement.style.background = 'linear-gradient(90deg, #ef4444, #f87171)';
            }
        }
    }

    updateRecentActivities(userProfile) {
        const activitiesGrid = document.getElementById('activitiesGrid');
        if (!activitiesGrid) return;

        const activities = this.generateActivities(userProfile);
        activitiesGrid.innerHTML = activities.map(activity => `
            <div class="activity-card fade-in" data-type="${activity.type}">
                <div class="activity-icon">
                    <i class="fas fa-${activity.icon}"></i>
                </div>
                <h3 class="activity-title">${activity.title}</h3>
                <p class="activity-description">${activity.description}</p>
                <div class="activity-meta">
                    <span>${activity.time}</span>
                    <span>${activity.duration || activity.songs || ''}</span>
                </div>
            </div>
        `).join('');
    }

    generateActivities(userProfile) {
        const stats = userProfile.stats || {};
        return [
            {
                type: 'session',
                title: 'Sessão de Relaxamento',
                description: 'Você completou uma sessão de musicoterapia para redução de estresse.',
                time: 'Hoje, 10:30',
                duration: '25 min',
                icon: 'headphones'
            },
            {
                type: 'playlist',
                title: 'Playlist Criada',
                description: `Você criou a playlist "${stats.playlists ? 'Foco e Concentração' : 'Minhas Favoridas'}".`,
                time: 'Ontem, 15:45',
                songs: `${stats.songs || 12} músicas`,
                icon: 'plus-circle'
            },
            {
                type: 'achievement',
                title: 'Conquista Desbloqueada',
                description: 'Você desbloqueou a conquista "Primeiros Passos"!',
                time: '2 dias atrás',
                icon: 'trophy'
            }
        ];
    }

    initializeComponents() {
        this.initializeModal();
        this.initializeForm();
        this.initializeLogout();
        this.initializeTimeFilters();
    }

    initializeModal() {
        const editProfileBtn = document.getElementById('editProfileBtn');
        const editProfileModal = document.getElementById('editProfileModal');
        
        if (editProfileBtn && editProfileModal) {
            editProfileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openEditModal();
            });
        }

        this.setupModalEvents('editProfileModal');
        this.setupModalEvents('logoutModal');
    }

    setupModalEvents(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        const closeBtn = modal.querySelector('.close-modal');
        const cancelBtn = modal.querySelector('#cancelEdit, #cancelLogout');

        const closeModal = () => {
            modal.style.display = 'none';
            if (modalId === 'editProfileModal') {
                document.getElementById('editProfileForm').reset();
            }
        };

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

        // Fechar ao clicar fora
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });

        // Fechar com ESC
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.style.display === 'flex') {
                closeModal();
            }
        });
    }

    openEditModal() {
        const editProfileModal = document.getElementById('editProfileModal');
        const user = this.currentUser;
        
        if (user && editProfileModal) {
            // Preencher formulário com dados atuais
            document.getElementById('editName').value = user.name || '';
            document.getElementById('editEmail').value = user.email || '';
            document.getElementById('editAge').value = user.age || '';
            document.getElementById('editGender').value = user.gender || '';
            document.getElementById('editCondition').value = user.health?.condition || '';
            
            editProfileModal.style.display = 'flex';
            
            // Focar no primeiro campo
            setTimeout(() => {
                document.getElementById('editName').focus();
            }, 100);
        }
    }

    initializeForm() {
        const editProfileForm = document.getElementById('editProfileForm');
        if (editProfileForm) {
            editProfileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProfileChanges();
            });
        }
    }

    saveProfileChanges() {
        const formData = this.getFormData();
        
        if (!this.validateFormData(formData)) {
            return;
        }

        const updatedProfile = this.createUpdatedProfile(formData);
        
        if (this.saveUserProfile(updatedProfile)) {
            this.loadUserData();
            document.getElementById('editProfileModal').style.display = 'none';
            this.showNotification('Perfil atualizado com sucesso! 🎉', 'success');
        }
    }

    getFormData() {
        return {
            name: document.getElementById('editName').value.trim(),
            email: document.getElementById('editEmail').value.trim(),
            age: parseInt(document.getElementById('editAge').value),
            gender: document.getElementById('editGender').value,
            condition: document.getElementById('editCondition').value,
            password: document.getElementById('editPassword').value,
            confirmPassword: document.getElementById('editConfirmPassword').value
        };
    }

    validateFormData(data) {
        if (!data.name || !data.email) {
            this.showNotification('Nome e e-mail são obrigatórios!', 'error');
            return false;
        }

        if (!this.isValidEmail(data.email)) {
            this.showNotification('Por favor, insira um e-mail válido!', 'error');
            return false;
        }

        if (data.password && data.password !== data.confirmPassword) {
            this.showNotification('As senhas não coincidem!', 'error');
            return false;
        }

        if (data.password && data.password.length < 6) {
            this.showNotification('A senha deve ter pelo menos 6 caracteres!', 'error');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    createUpdatedProfile(formData) {
        return {
            ...this.currentUser,
            name: formData.name,
            email: formData.email,
            age: isNaN(formData.age) ? this.currentUser.age : formData.age,
            gender: formData.gender,
            health: {
                ...this.currentUser.health,
                condition: formData.condition || this.currentUser.health?.condition
            },
            password: formData.password || this.currentUser.password,
            updatedAt: new Date().toISOString()
        };
    }

    initializeLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        const confirmLogout = document.getElementById('confirmLogout');

        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('logoutModal').style.display = 'flex';
            });
        }

        if (confirmLogout) {
            confirmLogout.addEventListener('click', () => {
                this.performLogout();
            });
        }
    }

    // NOVO: Método atualizado para logout
    performLogout() {
        // Remove todas as chaves de sessão
        localStorage.removeItem(this.storageKeys.CURRENT_USER);
        localStorage.removeItem(this.storageKeys.USER_PROFILE);
        localStorage.removeItem(this.storageKeys.FLASK_USER);
        localStorage.removeItem(this.storageKeys.FLASK_TOKEN);
        
        this.showNotification('Logout realizado com sucesso!', 'success');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }

    initializeNavigation() {
        const menuItems = document.querySelectorAll('.profile-menu a[data-section]');
        
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleMenuClick(item, menuItems);
            });
        });

        // Botões de ação
        this.initializeActionButtons();
    }

    handleMenuClick(clickedItem, allItems) {
        const targetSection = clickedItem.getAttribute('data-section');
        
        // Atualizar menu ativo
        allItems.forEach(item => item.classList.remove('active'));
        clickedItem.classList.add('active');
        
        // Mudar seção
        this.switchSection(targetSection);
    }

    initializeActionButtons() {
        // Ver todas as atividades
        const viewAllActivities = document.getElementById('viewAllActivities');
        if (viewAllActivities) {
            viewAllActivities.addEventListener('click', () => {
                this.switchToSection('history');
            });
        }

        // Criar playlist
        const createPlaylistBtn = document.getElementById('createPlaylistBtn');
        if (createPlaylistBtn) {
            createPlaylistBtn.addEventListener('click', () => {
                this.showNotification('Funcionalidade de criar playlist em desenvolvimento! 🎵', 'info');
            });
        }

        // Limpar histórico
        const clearHistoryBtn = document.getElementById('clearHistoryBtn');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => {
                if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
                    this.showNotification('Histórico limpo com sucesso!', 'success');
                }
            });
        }
    }

    switchToSection(sectionName) {
        const menuItems = document.querySelectorAll('.profile-menu a[data-section]');
        const targetItem = Array.from(menuItems).find(item => 
            item.getAttribute('data-section') === sectionName
        );
        
        if (targetItem) {
            menuItems.forEach(item => item.classList.remove('active'));
            targetItem.classList.add('active');
            this.switchSection(sectionName);
        }
    }

    switchSection(sectionName) {
        // Esconder todas as seções
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.classList.remove('active-section');
        });
        
        // Mostrar seção alvo
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active-section');
            
            // Scroll suave para a seção
            setTimeout(() => {
                targetSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 100);
        }
    }

    initializeTimeFilters() {
        const filters = document.querySelectorAll('.btn-filter');
        filters.forEach(filter => {
            filter.addEventListener('click', () => {
                filters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');
                
                const period = filter.getAttribute('data-period');
                this.updateStatisticsByPeriod(period);
            });
        });
    }

    updateStatisticsByPeriod(period) {
        const stats = this.currentUser?.stats || {};
        console.log(`Atualizando estatísticas para o período: ${period}`);
        
        // Simulação de dados por período
        const multipliers = { week: 0.25, month: 1, year: 12 };
        const multiplier = multipliers[period] || 1;
        
        this.updatePeriodStats(stats, multiplier);
    }

    updatePeriodStats(stats, multiplier) {
        const listeningTime = document.getElementById('listeningTime');
        const sessionsCompleted = document.getElementById('sessionsCompleted');
        const articlesRead = document.getElementById('articlesRead');
        
        if (listeningTime) {
            const periodMinutes = Math.floor((stats.totalListeningTime || 0) * multiplier);
            const hours = Math.floor(periodMinutes / 60);
            const minutes = periodMinutes % 60;
            listeningTime.textContent = `${hours}h ${minutes}min`;
        }
        
        if (sessionsCompleted) {
            sessionsCompleted.textContent = Math.floor((stats.sessions || 0) * multiplier);
        }
        
        if (articlesRead) {
            articlesRead.textContent = Math.floor((stats.articlesRead || 0) * multiplier);
        }
    }

    initializeFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // Fechar outros itens
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Alternar item atual
                item.classList.toggle('active');
            });
        });
    }

    initializePlaylists() {
        const playlistsGrid = document.getElementById('playlistsGrid');
        if (!playlistsGrid) return;

        const playlists = this.getUserPlaylists();
        playlistsGrid.innerHTML = playlists.map(playlist => `
            <div class="activity-card">
                <div class="activity-icon" style="background: ${playlist.color}">
                    <i class="fas fa-${playlist.icon}"></i>
                </div>
                <h3 class="activity-title">${playlist.name}</h3>
                <p class="activity-description">${playlist.description}</p>
                <div class="activity-meta">
                    <span>${playlist.songs} músicas</span>
                    <span>${playlist.duration}</span>
                </div>
            </div>
        `).join('');
    }

    getUserPlaylists() {
        try {
            const savedPlaylists = localStorage.getItem(this.storageKeys.PLAYLISTS);
            if (savedPlaylists) {
                return JSON.parse(savedPlaylists);
            }
        } catch (error) {
            console.error('Erro ao carregar playlists:', error);
        }

        // Playlists padrão
        return [
            {
                name: 'Foco e Concentração',
                description: 'Músicas para melhorar a concentração durante estudos e trabalho.',
                songs: 15,
                duration: '1h 20min',
                icon: 'brain',
                color: 'linear-gradient(135deg, #8b5cf6, #3b82f6)'
            },
            {
                name: 'Relaxamento e Meditação',
                description: 'Sons calmantes para reduzir o estresse e ansiedade.',
                songs: 12,
                duration: '1h 5min',
                icon: 'spa',
                color: 'linear-gradient(135deg, #10b981, #059669)'
            },
            {
                name: 'Energia e Motivação',
                description: 'Ritmos energéticos para começar o dia com disposição.',
                songs: 18,
                duration: '1h 30min',
                icon: 'bolt',
                color: 'linear-gradient(135deg, #f59e0b, #ea580c)'
            }
        ];
    }

    initializeHistory() {
        const historyList = document.getElementById('historyList');
        if (!historyList) return;

        const activities = this.getUserActivities();
        historyList.innerHTML = activities.map(activity => `
            <div class="activity-card">
                <div class="activity-icon">
                    <i class="fas fa-${activity.icon}"></i>
                </div>
                <h3 class="activity-title">${activity.title}</h3>
                <p class="activity-description">${activity.description}</p>
                <div class="activity-meta">
                    <span>${activity.time}</span>
                    <span>${activity.duration || ''}</span>
                </div>
            </div>
        `).join('');
    }

    getUserActivities() {
        try {
            const savedActivities = localStorage.getItem(this.storageKeys.ACTIVITIES);
            if (savedActivities) {
                return JSON.parse(savedActivities);
            }
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
        }

        // Atividades padrão
        return [
            {
                title: 'Sessão de Musicoterapia',
                description: 'Sessão completa de relaxamento com foco em redução de ansiedade.',
                time: 'Hoje, 14:30',
                duration: '30 min',
                icon: 'headphones'
            },
            {
                title: 'Playlist Ouvida',
                description: 'Você ouviu a playlist "Foco e Concentração" completa.',
                time: 'Ontem, 10:15',
                duration: '1h 20min',
                icon: 'play-circle'
            },
            {
                title: 'Artigo Lido',
                description: 'Você leu o artigo "Os benefícios da musicoterapia para a saúde mental".',
                time: '2 dias atrás',
                icon: 'newspaper'
            }
        ];
    }

    initializeAnimations() {
        // Animação de entrada para cards
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const animatedElements = document.querySelectorAll('.activity-card, .stat-card, .info-item');
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.4s ease';
            observer.observe(element);
        });
    }

    setupEventListeners() {
        // Botão de tema
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Menu do usuário
        const userMenuBtn = document.getElementById('userMenuBtn');
        if (userMenuBtn) {
            userMenuBtn.addEventListener('click', () => {
                window.location.href = 'perfil.html';
            });
        }
    }

    // ============================================================
    // 💫 SISTEMA DE NOTIFICAÇÕES (MANTIDO IGUAL)
    // ============================================================
    showNotification(message, type = 'info') {
        // Remove notificação existente
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" aria-label="Fechar notificação">&times;</button>
        `;

        document.body.appendChild(notification);

        // Botão fechar
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.removeNotification(notification);
        });

        // Auto-remover após 5 segundos
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    removeNotification(notification) {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }

    // ============================================================
    // 🎵 DADOS DE DEMONSTRAÇÃO (MANTIDO IGUAL)
    // ============================================================
    generateDemoData() {
        if (!this.currentUser) {
            const demoUser = {
                name: "João Silva",
                email: "joao.silva@neuropulse.com",
                age: 28,
                gender: "masculino",
                health: {
                    condition: "ansiedade",
                    therapy: "sim_psicologo"
                },
                stats: {
                    playlists: 3,
                    songs: 42,
                    sessions: 8,
                    totalListeningTime: 325,
                    articlesRead: 4
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            this.saveUserProfile(demoUser);
            this.loadUserData();
            this.showNotification('Dados de demonstração carregados!', 'info');
        }
    }
}

// Adicionar estilos de animação (MANTIDO IGUAL)
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .fade-in {
        animation: fadeInUp 0.6s ease;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ═══════════════════════════════════════════════════════════
//  🚀 SISTEMA ÚNICO DE INICIALIZAÇÃO (VERSÃO FINAL CORRIGIDA)
// ═══════════════════════════════════════════════════════════

let sistemaInicializado = false;

// Inicializa quando a página carrega (APENAS ESTE)
document.addEventListener('DOMContentLoaded', async () => {
    // Evita múltiplas inicializações
    if (sistemaInicializado) {
        console.log('⚠️ Sistema já inicializado, ignorando...');
        return;
    }
    sistemaInicializado = true;
    
    console.log('🚀 Iniciando sistema NeuroPulse Profile...');
    
    // 1. Verifica autenticação
    const token = localStorage.getItem('neuropulse_token');
    if (!token) {
        console.error('❌ Nenhum token encontrado! Redirecionando para login...');
        showNotification('Você precisa fazer login primeiro', 'error');
        
        setTimeout(() => {
            window.location.href = 'Login.html';
        }, 2000);
        return;
    }
    
    console.log('✅ Token encontrado:', token.substring(0, 20) + '...');
    
    // 2. Tenta carregar dados do Flask primeiro
    let userData = null;
    try {
        console.log('🔄 Buscando dados do Flask...');
        const flaskData = await fetchUserProfileFromFlask();
        
        if (flaskData && flaskData.success) {
            console.log('✅ Dados recebidos do Flask:', flaskData);
            
            // Converte para formato do perfil
            userData = formatFlaskToProfile(flaskData);
            
            // Salva localmente
            localStorage.setItem('neuropulse_current_user', JSON.stringify(userData));
            localStorage.setItem('neuropulse_user_profile', JSON.stringify(userData));
            localStorage.setItem('neuropulse_user', JSON.stringify(flaskData));
            
            console.log('💾 Dados do Flask salvos localmente');
        } else {
            console.log('⚠️ Flask não retornou dados válidos, usando dados locais');
        }
    } catch (error) {
        console.log('⚠️ Erro ao buscar do Flask, usando dados locais:', error);
    }
    
    // 3. Se não conseguiu do Flask, tenta dados locais
    if (!userData) {
        userData = await loadUserData();
    }
    
    // 4. Se ainda não tem dados, mostra erro
    if (!userData) {
        console.error('❌ Nenhum dado de usuário encontrado!');
        showNotification('Erro ao carregar perfil. Faça login novamente.', 'error');
        
        setTimeout(() => {
            window.location.href = 'Login.html';
        }, 3000);
        return;
    }
    
    // 5. Preenche o perfil
    console.log('🖼️ Preenchendo perfil com dados:', userData);
    fillProfileData(userData);
    
    // 6. Inicializa a classe NeuroPulseProfile (APENAS PARA FUNCIONALIDADES EXTRAS)
    try {
        // Cria instância mas NÃO deixa ela se auto-inicializar
        const neuroApp = new NeuroPulseProfile();
        
        // Desativa o auto-init da classe
        neuroApp.isInitialized = true;
        
        // Carrega dados na classe
        neuroApp.currentUser = userData;
        
        // Inicializa componentes específicos da classe
        neuroApp.initializeComponents();
        neuroApp.initializeNavigation();
        neuroApp.initializeHeaderEffects();
        neuroApp.setupEventListeners();
        neuroApp.initializeAnimations();
        
        window.neuroPulseApp = neuroApp;
        console.log('✅ Classe NeuroPulseProfile integrada com sucesso');
    } catch (error) {
        console.log('⚠️ Erro ao inicializar classe:', error);
    }
    
    // 7. Mostra mensagem de boas-vindas
    setTimeout(() => {
        showNotification(`Bem-vindo, ${userData.name || 'Usuário'}!`, 'success');
    }, 500);
    
    console.log('✅ Sistema NeuroPulse inicializado com sucesso!');
});
    
    // 2. AGORA inicializa o NeuroPulseProfile
    console.log('🚀 Inicializando NeuroPulseProfile...');
    window.NeuroPulseProfile = new NeuroPulseProfile();


// Inicia o sistema quando a página carrega
document.addEventListener('DOMContentLoaded', inicializarSistemaCompleto);

// Inicializar a aplicação
const neuroPulseProfile = new NeuroPulseProfile();

// Exportar para uso global
window.NeuroPulseProfile = neuroPulseProfile;