// profissionais.js - Funcionalidades da página de Profissionais

document.addEventListener('DOMContentLoaded', function() {
    // ========== VARIÁVEIS E ELEMENTOS ==========
    const state = {
        filters: {
            text: '',
            type: '',
            category: 'all'
        },
        sortBy: 'rating',
        itemsPerPage: 6,
        currentPage: 1
    };

    const elements = {
        grid: document.getElementById('professionalsGrid'),
        searchInput: document.getElementById('searchInput'),
        filterSpecialty: document.getElementById('filterSpecialty'),
        searchBtn: document.getElementById('searchBtn'),
        sortSelect: document.getElementById('sortSelect'),
        loadMoreBtn: document.getElementById('loadMoreBtn'),
        totalProfessionals: document.getElementById('totalProfessionals'),
        themeToggle: document.getElementById('themeToggle'),
        themeIcon: document.getElementById('themeIcon'),
        profileIconImg: document.getElementById('profileIconImg'),
        profileDropdown: document.getElementById('profileDropdown'),
        userProfileIcon: document.getElementById('userProfileIcon'),
        headerLogoutBtn: document.getElementById('headerLogoutBtn'),
        header: document.querySelector('header')
    };

    // ========== DADOS DOS PROFISSIONAIS ==========
    const professionalsData = [
        {
            id: 1,
            name: "Dra. Ana Silva",
            specialty: "Psicóloga Clínica",
            rating: 4.9,
            ratingCount: 127,
            bio: "Especialista em TCC (Terapia Cognitivo-Comportamental) e Ansiedade. Mais de 8 anos de experiência clínica com foco em transtornos de ansiedade e depressão. Utilizo abordagens baseadas em evidências científicas.",
            specialties: ["TCC", "Ansiedade", "Depressão", "Mindfulness"],
            verified: true,
            online: true,
            presencial: true,
            availableToday: true,
            avatar: "https://images.unsplash.com/photo-1594824434340-7e7dfc37cabb?w=400&h=400&fit=crop&crop=face",
            type: "psicologo",
            years: 8,
            contact: {
                email: "ana.silva@psicologia.com.br",
                phone: "(11) 98765-4321",
                whatsapp: "+5511987654321",
                crp: "06/123456",
                address: "Av. Paulista, 1000 - São Paulo/SP",
                officeHours: "Segunda a Sexta: 8h às 18h",
                approaches: ["TCC", "Mindfulness", "ACT"],
                languages: ["Português", "Inglês"],
                acceptsInsurance: true
            }
        },
        {
            id: 2,
            name: "Dr. Carlos Mendes",
            specialty: "Psiquiatra",
            rating: 4.8,
            ratingCount: 89,
            bio: "Psiquiatra com especialização em transtornos do humor e neurodesenvolvimento. Abordagem integrativa combinando medicação quando necessário com psicoterapia. Foco em TDAH e transtornos de humor.",
            specialties: ["TDAH", "Transtornos de Humor", "Medicação"],
            verified: true,
            online: true,
            presencial: false,
            availableToday: true,
            avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
            type: "psiquiatra",
            years: 12,
            contact: {
                email: "carlos.mendes@psiquiatria.com",
                phone: "(21) 99876-5432",
                whatsapp: "+5521998765432",
                crm: "RJ-123456",
                address: "Rua Voluntários da Pátria, 500 - Rio de Janeiro/RJ",
                officeHours: "Terça a Quinta: 9h às 17h",
                approaches: ["Farmacoterapia", "Psicoeducação"],
                languages: ["Português"],
                acceptsInsurance: true
            }
        },
        {
            id: 3,
            name: "Mariana Costa",
            specialty: "Terapeuta Ocupacional",
            rating: 4.7,
            ratingCount: 64,
            bio: "Especialista em TEA (Transtorno do Espectro Autista) e desenvolvimento infantil. Utilizo abordagens sensoriais e técnicas de integração para melhorar a qualidade de vida e desenvolvimento.",
            specialties: ["TEA", "Desenvolvimento Infantil", "Integração Sensorial"],
            verified: false,
            online: false,
            presencial: true,
            availableToday: false,
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
            type: "terapeuta",
            years: 5,
            contact: {
                email: "mariana.costa@terapiaocupacional.com",
                phone: "(31) 91234-5678",
                whatsapp: "+5531912345678",
                registro: "TER-789012",
                address: "Av. Afonso Pena, 3000 - Belo Horizonte/MG",
                officeHours: "Segunda a Sexta: 10h às 19h",
                approaches: ["Integração Sensorial", "TEACCH", "PECS"],
                languages: ["Português"],
                acceptsInsurance: false
            }
        },
        {
            id: 4,
            name: "Ricardo Alves",
            specialty: "Musicoterapeuta",
            rating: 4.9,
            ratingCount: 42,
            bio: "Musicoterapeuta especializado em intervenções com música para autismo e saúde mental. Utilizo técnicas de improvisação musical e ritmo para facilitar comunicação e expressão emocional.",
            specialties: ["Musicoterapia", "Autismo", "Expressão Emocional"],
            verified: true,
            online: true,
            presencial: true,
            availableToday: true,
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
            type: "musicoterapeuta",
            years: 6,
            contact: {
                email: "ricardo.alves@musicoterapia.com.br",
                phone: "(41) 97654-3210",
                whatsapp: "+5541976543210",
                certificacao: "MT-456789",
                address: "Rua XV de Novembro, 200 - Curitiba/PR",
                officeHours: "Segunda a Sexta: 7h às 20h",
                approaches: ["Improvisação Musical", "Técnicas de Ritmo", "Composição"],
                languages: ["Português", "Inglês"],
                acceptsInsurance: true
            }
        },
        {
            id: 5,
            name: "Dra. Juliana Santos",
            specialty: "Neuropsicóloga",
            rating: 5.0,
            ratingCount: 56,
            bio: "Especialista em avaliação neuropsicológica e reabilitação cognitiva para idosos e adultos. Atendo casos de TDAH, dislexia, e comprometimentos cognitivos com abordagem neurocientífica.",
            specialties: ["Neuropsicologia", "TDAH", "Reabilitação Cognitiva"],
            verified: true,
            online: false,
            presencial: true,
            availableToday: false,
            avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
            type: "neuropsicologo",
            years: 10,
            contact: {
                email: "juliana.santos@neuropsi.com.br",
                phone: "(51) 93456-7890",
                whatsapp: "+5551934567890",
                crp: "07/654321",
                address: "Av. Ipiranga, 1500 - Porto Alegre/RS",
                officeHours: "Quarta a Sexta: 8h às 16h",
                approaches: ["Avaliação Neuropsicológica", "Reabilitação Cognitiva"],
                languages: ["Português", "Espanhol"],
                acceptsInsurance: true
            }
        },
        {
            id: 6,
            name: "Dr. Pedro Oliveira",
            specialty: "Psicanalista",
            rating: 4.6,
            ratingCount: 34,
            bio: "Psicanalista com formação em psicanálise lacaniana. Atendimento de adultos com foco em questões existenciais, traumas e autoconhecimento profundo. Análise do inconsciente e seus desdobramentos.",
            specialties: ["Psicanálise", "Traumas", "Autoconhecimento"],
            verified: false,
            online: true,
            presencial: true,
            availableToday: true,
            avatar: "https://images.unsplash.com/photo-1537511446984-935f663eb1f4?w=400&h=400&fit=crop&crop=face",
            type: "psicanalista",
            years: 15,
            contact: {
                email: "pedro.oliveira@psicanalise.com.br",
                phone: "(19) 94567-8901",
                whatsapp: "+5519945678901",
                registro: "PSI-123789",
                address: "Rua Barão de Jaguara, 800 - Campinas/SP",
                officeHours: "Segunda, Quarta e Sexta: 14h às 21h",
                approaches: ["Psicanálise Lacaniana", "Associação Livre"],
                languages: ["Português", "Francês"],
                acceptsInsurance: false
            }
        },
        {
            id: 7,
            name: "Dra. Fernanda Lima",
            specialty: "Psicóloga Infantil",
            rating: 4.8,
            ratingCount: 78,
            bio: "Especializada em psicologia infantil e ludoterapia. Trabalho com crianças com TEA, TDAH e dificuldades emocionais. Utilizo brincadeiras e atividades lúdicas para facilitar expressão emocional.",
            specialties: ["Psicologia Infantil", "Ludoterapia", "TEA Infantil"],
            verified: true,
            online: false,
            presencial: true,
            availableToday: true,
            avatar: "https://images.unsplash.com/photo-1551836026-d5c2c5af78e4?w=400&h=400&fit=crop&crop=face",
            type: "psicologo",
            years: 7,
            contact: {
                email: "fernanda.lima@psicologiainfantil.com.br",
                phone: "(11) 92345-6789",
                whatsapp: "+5511923456789",
                crp: "06/789012",
                address: "Rua Augusta, 1500 - São Paulo/SP",
                officeHours: "Segunda a Quinta: 9h às 17h",
                approaches: ["Ludoterapia", "Terapia do Brincar", "Terapia Familiar"],
                languages: ["Português"],
                acceptsInsurance: true
            }
        },
        {
            id: 8,
            name: "Dr. Rafael Souza",
            specialty: "Terapeuta de Casal",
            rating: 4.5,
            ratingCount: 45,
            bio: "Terapeuta especializado em terapia de casal e familiar. Trabalho com comunicação, resolução de conflitos e reconstrução de vínculos afetivos. Abordagem sistêmica e focada em soluções.",
            specialties: ["Terapia de Casal", "Terapia Familiar", "Mediação"],
            verified: true,
            online: true,
            presencial: true,
            availableToday: false,
            avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
            type: "terapeuta",
            years: 9,
            contact: {
                email: "rafael.souza@terapiacasal.com.br",
                phone: "(21) 93456-7890",
                whatsapp: "+5521934567890",
                registro: "TER-345678",
                address: "Rua da Quitanda, 50 - Rio de Janeiro/RJ",
                approaches: ["Terapia Sistêmica", "Comunicação Não-Violenta"],
                languages: ["Português", "Inglês"],
                acceptsInsurance: false
            }
        }
    ];

    // ========== INICIALIZAÇÃO ==========
 
    init();
    
    function init() {
        initTheme();
        initProfile();
        initEventListeners();
        render();
        highlightCurrentPage();
        
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100);
    }

    // ========== FUNÇÃO PARA CARREGAR DO BACKEND ==========
async function carregarTerapeutasBackend() {
    try {
        console.log('🔄 Carregando terapeutas do backend...');
        const response = await fetch('http://localhost:5000/api/terapeutas');
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📦 Resposta do backend:', data);
        
        if (data.success && data.terapeutas && data.terapeutas.length > 0) {
            console.log(`✅ ${data.terapeutas.length} terapeutas encontrados no banco`);
            
            // Converte formato do backend para frontend
            return data.terapeutas.map(t => ({
                id: t.id || Date.now() + Math.random(),
                name: t.nome || 'Profissional',
                specialty: t.profissao || 'Terapeuta',
                rating: t.avaliacao || 4.5,
                ratingCount: t.total_avaliacoes || 10,
                bio: t.bio || t.descricao || `${t.profissao || 'Profissional'} cadastrado no sistema.`,
                specialties: t.especialidades || [],
                verified: true,
                online: true,
                presencial: true,
                availableToday: true,
                avatar: t.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.nome || 'P')}&background=667eea&color=fff&size=400`,
                type: 'terapeuta',
                years: t.anos_experiencia || 0,
                contact: {
                    email: t.email_profissional || 'email@profissional.com',
                    phone: t.telefone || '(11) 99999-9999',
                    whatsapp: t.telefone ? t.telefone.replace(/\D/g, '') : '5511999999999',
                    price: 'R$ 150-300',
                    address: 'Endereço a confirmar',
                    officeHours: 'Segunda a Sexta: 9h às 18h',
                    approaches: ['Avaliação individualizada'],
                    languages: ['Português'],
                    acceptsInsurance: true
                }
            }));
        } else {
            console.log('ℹ️ Nenhum terapeuta no banco ou resposta vazia');
            return [];
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar terapeutas:', error);
        return [];
    }
}
    
    // ========== FUNCIONALIDADE DO TEMA ==========
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        applyTheme(savedTheme);

        if (elements.themeToggle) {
            elements.themeToggle.addEventListener('click', () => {
                const isLightTheme = document.body.classList.contains('light-theme');
                const newTheme = isLightTheme ? 'dark' : 'light';
                applyTheme(newTheme);
                localStorage.setItem('theme', newTheme);
            });
        }
    }

    function applyTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
            if (elements.themeIcon) {
                elements.themeIcon.classList.remove('fa-moon');
                elements.themeIcon.classList.add('fa-sun');
            }
        } else {
            document.body.classList.remove('light-theme');
            if (elements.themeIcon) {
                elements.themeIcon.classList.remove('fa-sun');
                elements.themeIcon.classList.add('fa-moon');
            }
        }
    }

    // ========== FUNCIONALIDADE DO PERFIL ==========
    function initProfile() {
        // Carregar foto de perfil
        loadProfilePicture();
        
        // Dropdown do perfil
        if (elements.userProfileIcon && elements.profileDropdown) {
            elements.profileDropdown.style.display = 'none';
            
            elements.userProfileIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                const isVisible = elements.profileDropdown.style.display === 'block';
                elements.profileDropdown.style.display = isVisible ? 'none' : 'block';
            });
            
            document.addEventListener('click', () => {
                elements.profileDropdown.style.display = 'none';
            });
            
            elements.profileDropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
        
        // Logout
        if (elements.headerLogoutBtn) {
            elements.headerLogoutBtn.addEventListener('click', () => {
                if (confirm('Tem certeza que deseja sair?')) {
                    localStorage.removeItem('userToken');
                    localStorage.removeItem('profilePicture');
                    window.location.href = 'index.html';
                }
            });
        }
    }

    function loadProfilePicture() {
        const savedProfilePic = localStorage.getItem('profilePicture');
        const defaultProfileSVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM4QjVDRjYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+CjxwYXRoIGQ9Ik0yMCAxOEMyMi4yMDkxIDE4IDI0IDE2LjIwOTEgMjQgMTRDMjQgMTEuNzkwOSAyMi4yMDkxIDEwIDIwIDEwQzE3Ljc5MDkgMTAgMTYgMTEuNzkwOSAxNiAxNEMxNiAxNi4yMDkxIDE3Ljc5MDkgMTggMjAgMThaIiBmaWxsPSIjOEI1Q0Y2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEMxNi42ODYzIDIwIDE0IDIyLjY4NjMgMTQgMjZWMjhIMjZWMjZDMjYgMjIuNjg2MyAyMy4zMTM3IDIwIDIwIDIwWiIgZmlsbD0iIzhCNUNGNiIvPgo8L3N2Zz4K';
        
        if (elements.profileIconImg) {
            if (savedProfilePic) {
                elements.profileIconImg.src = savedProfilePic;
            } else {
                elements.profileIconImg.src = defaultProfileSVG;
            }
            
            elements.profileIconImg.onerror = function() {
                this.src = defaultProfileSVG;
            };
        }
    }

    // ========== EVENT LISTENERS ==========
    function initEventListeners() {
        // Busca
        if (elements.searchInput) {
            elements.searchInput.addEventListener('input', (e) => {
                state.filters.text = e.target.value.toLowerCase();
                state.currentPage = 1;
                render();
            });
        }

        // Filtro de especialidade
        if (elements.filterSpecialty) {
            elements.filterSpecialty.addEventListener('change', (e) => {
                state.filters.type = e.target.value;
                state.currentPage = 1;
                render();
            });
        }

        // Botão de busca
        if (elements.searchBtn) {
            elements.searchBtn.addEventListener('click', () => {
                state.currentPage = 1;
                render();
            });
        }

        // Filtros pills
        document.querySelectorAll('.pill-filter').forEach(pill => {
            pill.addEventListener('click', () => {
                document.querySelectorAll('.pill-filter').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                state.filters.category = pill.dataset.filter;
                state.currentPage = 1;
                render();
            });
        });

        // Ordenação
        if (elements.sortSelect) {
            elements.sortSelect.addEventListener('change', (e) => {
                state.sortBy = e.target.value;
                render();
            });
        }

        // Carregar mais
        if (elements.loadMoreBtn) {
            elements.loadMoreBtn.addEventListener('click', () => {
                state.itemsPerPage += 6;
                render();
            });
        }

        // Scroll do header
        window.addEventListener('scroll', () => {
            if (elements.header && window.scrollY > 100) {
                elements.header.classList.add('header-scrolled');
            } else if (elements.header) {
                elements.header.classList.remove('header-scrolled');
            }
        });

        // Fechar modais
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeAllModals();
            }
        });
    }

    // ========== LÓGICA DE FILTRAGEM E ORDENAÇÃO ==========
    function getFilteredProfessionals() {
        let results = professionalsData.filter(pro => {
            // Filtro por texto
            const matchText = !state.filters.text || 
                pro.name.toLowerCase().includes(state.filters.text) || 
                pro.specialty.toLowerCase().includes(state.filters.text) ||
                pro.bio.toLowerCase().includes(state.filters.text) ||
                pro.specialties.some(s => s.toLowerCase().includes(state.filters.text));
            
            // Filtro por tipo
            const matchType = !state.filters.type || pro.type === state.filters.type;

            // Filtro por categoria
            let matchCategory = true;
            if (state.filters.category === 'online') matchCategory = pro.online;
            if (state.filters.category === 'presencial') matchCategory = pro.presencial;
            if (state.filters.category === 'verified') matchCategory = pro.verified;
            if (state.filters.category === 'tea') {
                matchCategory = pro.specialties.some(s => 
                    s.toLowerCase().includes('tea') || 
                    s.toLowerCase().includes('autismo') ||
                    pro.bio.toLowerCase().includes('tea') ||
                    pro.bio.toLowerCase().includes('autismo')
                );
            }

            return matchText && matchType && matchCategory;
        });

        // Ordenação
        results.sort((a, b) => {
            if (state.sortBy === 'rating') return b.rating - a.rating;
            if (state.sortBy === 'experience') return b.years - a.years;
            if (state.sortBy === 'name') return a.name.localeCompare(b.name);
            if (state.sortBy === 'price') {
                const priceA = parseInt(a.contact.price.replace(/\D/g, ''));
                const priceB = parseInt(b.contact.price.replace(/\D/g, ''));
                return priceA - priceB;
            }
            return 0;
        });

        return results;
    }

    // ========== RENDERIZAÇÃO ==========
    function render() {
        const filtered = getFilteredProfessionals();
        const displayed = filtered.slice(0, state.itemsPerPage);
        
        // Atualizar contador
        if (elements.totalProfessionals) {
            elements.totalProfessionals.textContent = `${filtered.length} profissionais`;
        }

        // Limpar grid
        if (elements.grid) {
            elements.grid.innerHTML = '';

            // Estado vazio
            if (filtered.length === 0) {
                elements.grid.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-search"></i>
                        <h3>Nenhum profissional encontrado</h3>
                        <p>Tente ajustar seus filtros ou buscar por outro termo.</p>
                        <button class="cta secondary" onclick="clearFilters()">
                            <i class="fas fa-filter"></i> Limpar Filtros
                        </button>
                    </div>
                `;
                
                if (elements.loadMoreBtn) {
                    elements.loadMoreBtn.style.display = 'none';
                }
                return;
            }

            // Adicionar cards
            displayed.forEach((pro, index) => {
                const card = createCard(pro, index);
                elements.grid.appendChild(card);
            });

            // Botão "Carregar Mais"
            if (elements.loadMoreBtn) {
                if (filtered.length > state.itemsPerPage) {
                    elements.loadMoreBtn.style.display = 'flex';
                } else {
                    elements.loadMoreBtn.style.display = 'none';
                }
            }
        }
    }

    function createCard(pro, index) {
        const card = document.createElement('div');
        card.className = 'pro-card';
        
        const statusIndicator = pro.availableToday ? 
            '<div class="status-indicator" title="Disponível hoje"></div>' : '';
        
        const verifiedBadge = pro.verified ? 
            '<i class="fas fa-check-circle" style="color: var(--accent1); font-size: 0.9rem;"></i>' : '';
        
        const specialtyTags = pro.specialties.slice(0, 3).map(tag => 
            `<span class="specialty-tag">${tag}</span>`
        ).join('');

        // Adicionar badges de modalidade
        const modalityBadges = [];
        if (pro.online) modalityBadges.push('<span class="specialty-tag" style="font-size: 0.7rem;"><i class="fas fa-video"></i> Online</span>');
        if (pro.presencial) modalityBadges.push('<span class="specialty-tag" style="font-size: 0.7rem;"><i class="fas fa-map-marker-alt"></i> Presencial</span>');

        card.innerHTML = `
            ${statusIndicator}
            <div class="card-header">
                <img src="${pro.avatar}" alt="${pro.name}" class="card-avatar" loading="lazy">
                <div class="card-info">
                    <h3>${pro.name} ${verifiedBadge}</h3>
                    <span class="card-specialty">${pro.specialty}</span>
                    <div style="display: flex; gap: 5px; margin-bottom: 5px;">
                        ${modalityBadges.join('')}
                    </div>
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <span>${pro.rating}</span>
                        <span class="rating-count">(${pro.ratingCount} avaliações)</span>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <p class="bio">${pro.bio}</p>
                <div class="specialties">
                    ${specialtyTags}
                    ${pro.years ? `<span class="specialty-tag">${pro.years} anos</span>` : ''}
                    <span class="specialty-tag">${pro.contact.price}</span>
                </div>
            </div>
            <div class="card-footer">
                <button class="cta secondary" onclick="openProfileModal(${pro.id})">
                    <i class="fas fa-user"></i> Perfil
                </button>
                <button class="cta" onclick="openScheduleModal(${pro.id})">
                    <i class="fas fa-calendar-check"></i> Agendar
                </button>
            </div>
        `;

        return card;
    }

    // ========== MODAIS ==========
    window.openProfileModal = function(id) {
        const pro = professionalsData.find(p => p.id === id);
        if (!pro) return;

        const modalContent = document.getElementById('professionalModalContent');
        if (!modalContent) return;

        // Determinar registro profissional
        let registroProfissional = '';
        let registroLabel = '';
        
        if (pro.type === 'psicologo' || pro.type === 'neuropsicologo') {
            registroProfissional = pro.contact.crp;
            registroLabel = 'CRP';
        } else if (pro.type === 'psiquiatra') {
            registroProfissional = pro.contact.crm;
            registroLabel = 'CRM';
        } else if (pro.contact.registro) {
            registroProfissional = pro.contact.registro;
            registroLabel = 'Registro';
        } else if (pro.contact.certificacao) {
            registroProfissional = pro.contact.certificacao;
            registroLabel = 'Certificação';
        }

        modalContent.innerHTML = `
            <button class="modal-close" onclick="closeModal('professionalModal')">
                <i class="fas fa-times"></i>
            </button>
            <div class="modal-header">
                <img src="${pro.avatar}" alt="${pro.name}" class="modal-avatar">
                <h2>${pro.name}</h2>
                <p>${pro.specialty}</p>
            </div>
            <div class="modal-body">
                <div class="modal-stats">
                    <div class="stat-item">
                        <div class="stat-value">${pro.years}</div>
                        <div class="stat-label">Anos de Experiência</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${pro.rating}</div>
                        <div class="stat-label">Avaliação</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${pro.ratingCount}+</div>
                        <div class="stat-label">Pacientes Atendidos</div>
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3><i class="fas fa-user-md"></i> Sobre</h3>
                    <p>${pro.bio}</p>
                </div>
                
                <div class="modal-section">
                    <h3><i class="fas fa-tags"></i> Especialidades</h3>
                    <div class="specialties">
                        ${pro.specialties.map(tag => `<span class="specialty-tag">${tag}</span>`).join('')}
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3><i class="fas fa-graduation-cap"></i> Formação e Abordagens</h3>
                    <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                        <p><strong>Formação:</strong> ${pro.specialty}</p>
                        <p><strong>Abordagens:</strong> ${pro.contact.approaches ? pro.contact.approaches.join(', ') : 'Não informado'}</p>
                        <p><strong>Idiomas:</strong> ${pro.contact.languages ? pro.contact.languages.join(', ') : 'Português'}</p>
                        ${registroProfissional ? `<p><strong>${registroLabel}:</strong> ${registroProfissional}</p>` : ''}
                        <p><strong>Aceita Convênios:</strong> ${pro.contact.acceptsInsurance ? 'Sim' : 'Não'}</p>
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3><i class="fas fa-calendar-check"></i> Modalidades de Atendimento</h3>
                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                        ${pro.online ? '<span class="specialty-tag"><i class="fas fa-video"></i> Atendimento Online</span>' : ''}
                        ${pro.presencial ? '<span class="specialty-tag"><i class="fas fa-map-marker-alt"></i> Atendimento Presencial</span>' : ''}
                    </div>
                </div>
                
                <button class="cta" style="width: 100%; margin-top: 20px;" onclick="openScheduleModal(${pro.id})">
                    <i class="fas fa-calendar-check"></i> Agendar Consulta
                </button>
            </div>
        `;

        openModal('professionalModal');
    };

    window.openScheduleModal = function(id) {
        const pro = professionalsData.find(p => p.id === id);
        if (!pro) return;

        const modalContent = document.getElementById('scheduleModalContent');
        if (!modalContent) return;

        // Determinar registro profissional
        let registroProfissional = '';
        let registroLabel = '';
        
        if (pro.type === 'psicologo' || pro.type === 'neuropsicologo') {
            registroProfissional = pro.contact.crp;
            registroLabel = 'CRP';
        } else if (pro.type === 'psiquiatra') {
            registroProfissional = pro.contact.crm;
            registroLabel = 'CRM';
        } else if (pro.contact.registro) {
            registroProfissional = pro.contact.registro;
            registroLabel = 'Registro';
        } else if (pro.contact.certificacao) {
            registroProfissional = pro.contact.certificacao;
            registroLabel = 'Certificação';
        }

        modalContent.innerHTML = `
            <button class="modal-close" onclick="closeModal('scheduleModal')">
                <i class="fas fa-times"></i>
            </button>
            <div class="modal-header">
                <img src="${pro.avatar}" alt="${pro.name}" class="modal-avatar">
                <h2>Agendar com ${pro.name}</h2>
                <p>${pro.specialty}</p>
            </div>
            <div class="modal-body">
                <div class="modal-section">
                    <h3><i class="fas fa-address-card"></i> Informações de Contato</h3>
                    <p>Entre em contato diretamente com o profissional para agendar sua consulta:</p>
                    
                    <div class="contact-cards">
                        <div class="contact-card">
                            <i class="fas fa-envelope"></i>
                            <div class="contact-label">E-mail</div>
                            <div class="contact-value">
                                <a href="mailto:${pro.contact.email}">${pro.contact.email}</a>
                            </div>
                            <button class="btn-copy" onclick="copyToClipboard('${pro.contact.email}', 'E-mail copiado!')">
                                <i class="fas fa-copy"></i> Copiar
                            </button>
                        </div>
                        
                        <div class="contact-card">
                            <i class="fas fa-phone"></i>
                            <div class="contact-label">Telefone</div>
                            <div class="contact-value">
                                <a href="tel:${pro.contact.phone.replace(/\D/g, '')}">${pro.contact.phone}</a>
                            </div>
                            <button class="btn-copy" onclick="copyToClipboard('${pro.contact.phone}', 'Telefone copiado!')">
                                <i class="fas fa-copy"></i> Copiar
                            </button>
                        </div>
                        
                        <div class="contact-card">
                            <i class="fab fa-whatsapp"></i>
                            <div class="contact-label">WhatsApp</div>
                            <div class="contact-value">
                                <a href="https://wa.me/${pro.contact.whatsapp}" target="_blank">Enviar Mensagem</a>
                            </div>
                            <button class="btn-copy" onclick="copyToClipboard('${pro.contact.whatsapp}', 'Número copiado!')">
                                <i class="fas fa-copy"></i> Copiar
                            </button>
                        </div>
                    </div>
                </div>

                <div class="modal-section">
                    <h3><i class="fas fa-id-badge"></i> Informações Profissionais</h3>
                    <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                        <div style="display: grid; grid-template-columns: auto 1fr; gap: 15px; margin-bottom: 10px;">
                            <span style="color: var(--muted);">Nome:</span>
                            <span style="font-weight: 600;">${pro.name}</span>
                        </div>
                        <div style="display: grid; grid-template-columns: auto 1fr; gap: 15px; margin-bottom: 10px;">
                            <span style="color: var(--muted);">Especialidade:</span>
                            <span style="font-weight: 600;">${pro.specialty}</span>
                        </div>
                        ${registroProfissional ? `
                        <div style="display: grid; grid-template-columns: auto 1fr; gap: 15px; margin-bottom: 10px;">
                            <span style="color: var(--muted);">${registroLabel}:</span>
                            <span style="font-weight: 600; color: var(--accent1);">${registroProfissional}</span>
                        </div>
                        ` : ''}
                        <div style="display: grid; grid-template-columns: auto 1fr; gap: 15px; margin-bottom: 10px;">
                            <span style="color: var(--muted);">Experiência:</span>
                            <span style="font-weight: 600;">${pro.years} anos</span>
                        </div>
                        <div style="display: grid; grid-template-columns: auto 1fr; gap: 15px; margin-bottom: 10px;">
                            <span style="color: var(--muted);">Valor da Consulta:</span>
                            <span style="font-weight: 600; color: var(--accent1);">${pro.contact.price}</span>
                        </div>
                        <div style="display: grid; grid-template-columns: auto 1fr; gap: 15px;">
                            <span style="color: var(--muted);">Local:</span>
                            <span style="font-weight: 600;">${pro.contact.address}</span>
                        </div>
                    </div>
                </div>

                <div class="modal-section">
                    <h3><i class="fas fa-clock"></i> Horários de Atendimento</h3>
                    <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                        <p style="color: var(--muted); margin: 0;">${pro.contact.officeHours}</p>
                    </div>
                </div>

                <div style="margin-top: 30px; display: flex; gap: 15px; flex-wrap: wrap;">
                    <button class="cta secondary" style="flex: 1;" onclick="closeModal('scheduleModal')">
                        <i class="fas fa-times"></i> Fechar
                    </button>
                    <button class="cta" style="flex: 2;" onclick="sendWhatsAppMessage(${pro.id})">
                        <i class="fab fa-whatsapp"></i> Agendar via WhatsApp
                    </button>
                </div>
                
                <p style="text-align: center; color: var(--muted); font-size: 0.9rem; margin-top: 20px;">
                    <i class="fas fa-info-circle"></i> Entre em contato para verificar disponibilidade de horários.
                </p>
            </div>
        `;

        openModal('scheduleModal');
    };

    window.openContactModal = function() {
        openModal('contactModal');
    };

    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };

    window.closeAllModals = function() {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = 'auto';
    };

    // ========== FUNÇÕES UTILITÁRIAS ==========
    window.clearFilters = function() {
        if (elements.searchInput) elements.searchInput.value = '';
        if (elements.filterSpecialty) elements.filterSpecialty.value = '';
        
        document.querySelectorAll('.pill-filter').forEach(p => p.classList.remove('active'));
        document.querySelector('.pill-filter[data-filter="all"]').classList.add('active');
        
        state.filters = { text: '', type: '', category: 'all' };
        state.itemsPerPage = 6;
        render();
    };

    window.copyToClipboard = function(text, message) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(message);
        }).catch(err => {
            console.error('Erro ao copiar:', err);
            showToast('Erro ao copiar. Tente novamente.');
        });
    };

    window.sendWhatsAppMessage = function(id) {
        const pro = professionalsData.find(p => p.id === id);
        if (!pro || !pro.contact.whatsapp) return;
        
        const message = `Olá ${pro.name.split(' ')[0]}, vi seu perfil na NeuroPulse e gostaria de agendar uma consulta. Pode me informar os horários disponíveis?`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${pro.contact.whatsapp}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    };

    function showToast(message) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    function highlightCurrentPage() {
        const currentPage = window.location.pathname.split('/').pop() || 'tela.profissionais.html';
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || 
                (currentPage === 'tela.profissionais.html' && linkHref === 'tela.profissionais.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // ========== INICIALIZAR ACESSIBILIDADE ==========
    function initAccessibility() {
        // Navegação por teclado
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    // Inicializar acessibilidade
    initAccessibility();
});