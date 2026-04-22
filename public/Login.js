// NeuroPulse - Sistema de Autenticação
document.addEventListener('DOMContentLoaded', function() {
    // =================== CONFIGURAÇÃO DA API ===================
    const API_BASE_URL = 'http://localhost:5000/api';
    const ENDPOINTS = {
        LOGIN: `${API_BASE_URL}/usuarios/login`,
        REGISTER: `${API_BASE_URL}/usuarios/cadastrar`,
        HEALTH: `${API_BASE_URL}/health`,
        SETUP: `${API_BASE_URL}/setup`,
        VERIFY_EMAIL: (email) => `${API_BASE_URL}/usuarios/verificar-email/${email}`
    };

    async function checkBackend() {
    try {
        const response = await fetch(ENDPOINTS.HEALTH);
        const data = await response.json();
        console.log('✅ Backend conectado:', data.status);
    } catch (error) {
        console.error('❌ Backend offline');
        showNotification('⚠️ Servidor backend não está rodando. Execute: python app.py', 'warning', 10000);
    }
}

    // Elementos principais
    const tabButtons = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const therapistForm = document.getElementById('therapist-form');
    
    // =================== TAB SYSTEM ===================
    function switchTab(tabName) {
        // Atualiza botões
        tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // Atualiza formulários
        authForms.forEach(form => {
            form.classList.toggle('active', form.id === `${tabName}-form`);
        });
    }
    
    // Event listeners para os botões das tabs
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.dataset.tab);
        });
    });
    
    // =================== TOGGLE PASSWORD VISIBILITY ===================
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // =================== PASSWORD STRENGTH METER ===================
    const passwordInput = document.getElementById('register-password');
    const therapistPasswordInput = document.getElementById('therapist-password');
    
    function updatePasswordStrength(inputElement, strengthBar) {
        if (!inputElement || !strengthBar) return;
        
        inputElement.addEventListener('input', function() {
            const password = this.value;
            let strength = 0;
            
            // Verifica critérios de força
            if (password.length >= 8) strength++;
            if (/[A-Z]/.test(password)) strength++;
            if (/[0-9]/.test(password)) strength++;
            if (/[^A-Za-z0-9]/.test(password)) strength++;
            
            // Atualiza barra de força
            const width = strength * 25;
            strengthBar.style.width = `${width}%`;
            
            // Atualiza cores da barra
            switch(strength) {
                case 1:
                    strengthBar.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
                    break;
                case 2:
                    strengthBar.style.background = 'linear-gradient(90deg, #f59e0b, #d97706)';
                    break;
                case 3:
                    strengthBar.style.background = 'linear-gradient(90deg, #3b82f6, #2563eb)';
                    break;
                case 4:
                    strengthBar.style.background = 'linear-gradient(90deg, #10b981, #059669)';
                    break;
                default:
                    strengthBar.style.background = 'linear-gradient(90deg, #6b7280, #4b5563)';
            }
        });
    }
    
    // Inicializa para ambos os formulários
    const registerStrengthFill = document.querySelector('#register-form .strength-fill');
    const therapistStrengthFill = document.querySelector('#therapist-form .strength-fill');
    
    if (passwordInput && registerStrengthFill) {
        updatePasswordStrength(passwordInput, registerStrengthFill);
    }
    
    if (therapistPasswordInput && therapistStrengthFill) {
        updatePasswordStrength(therapistPasswordInput, therapistStrengthFill);
    }
    
    // =================== TOGGLE BUTTONS ===================
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.parentElement;
            const value = this.dataset.value;
            
            // Remove active de todos os botões
            parent.querySelectorAll('.toggle-btn').forEach(b => {
                b.classList.remove('active');
            });
            
            // Adiciona active ao botão clicado
            this.classList.add('active');
        });
    });
    
    // =================== PROFESSION CARDS ===================
    document.querySelectorAll('.prof-card').forEach(card => {
        card.addEventListener('click', function() {
            const profession = this.dataset.profession;
            
            // Remove active de todos os cards
            document.querySelectorAll('.prof-card').forEach(c => {
                c.classList.remove('active');
            });
            
            // Adiciona active ao card clicado
            this.classList.add('active');
            
            // Mostra/oculta campo para especificar outra profissão
            const otherProfessionContainer = document.getElementById('other-profession-container');
            const otherProfessionInput = document.getElementById('other-profession');
            
            if (profession === 'outro') {
                otherProfessionContainer.style.display = 'block';
                otherProfessionInput.required = true;
            } else {
                otherProfessionContainer.style.display = 'none';
                otherProfessionInput.required = false;
                otherProfessionInput.value = '';
            }
        });
    });
    
    // =================== EXPERIENCE SLIDER ===================
    const experienceSlider = document.getElementById('experience-slider');
    const sliderValue = document.getElementById('slider-value');
    
    if (experienceSlider && sliderValue) {
        experienceSlider.addEventListener('input', function() {
            const value = this.value;
            sliderValue.textContent = `${value} anos de experiência`;
            
            // Efeito visual
            sliderValue.style.transform = 'scale(1.03)';
            setTimeout(() => {
                sliderValue.style.transform = 'scale(1)';
            }, 100);
        });
        
        // Inicializa com valor 0
        sliderValue.textContent = '0 anos de experiência';
    }
    
    // =================== VARIED EXPERIENCE CHECKBOX ===================
    const variedExperienceCheckbox = document.getElementById('varied-experience');
    if (variedExperienceCheckbox) {
        variedExperienceCheckbox.addEventListener('change', function() {
            if (this.checked) {
                // Desabilita o slider quando marcado
                experienceSlider.disabled = true;
                sliderValue.textContent = 'Experiência variada';
                sliderValue.style.color = '#ec4899';
                sliderValue.style.background = 'rgba(236, 72, 153, 0.1)';
            } else {
                // Reabilita o slider quando desmarcado
                experienceSlider.disabled = false;
                const value = experienceSlider.value;
                sliderValue.textContent = `${value} anos de experiência`;
                sliderValue.style.color = '';
                sliderValue.style.background = '';
            }
        });
    }
    
    // =================== CONTADOR DE CARACTERES PARA OBSERVAÇÕES ===================
    const observationsTextarea = document.getElementById('therapist-observations');
    const charCount = document.getElementById('char-count');
    
    if (observationsTextarea && charCount) {
        observationsTextarea.addEventListener('input', function() {
            const length = this.value.length;
            charCount.textContent = length;
            
            // Altera a cor conforme o número de caracteres
            if (length >= 900) {
                charCount.classList.add('danger');
                charCount.classList.remove('warning');
            } else if (length >= 700) {
                charCount.classList.add('warning');
                charCount.classList.remove('danger');
            } else {
                charCount.classList.remove('warning', 'danger');
            }
        });
        
        // Inicializa contador
        charCount.textContent = observationsTextarea.value.length;
    }
    
    // =================== FORMATAÇÃO DE TELEFONE ===================
    const phoneInput = document.getElementById('therapist-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 11) {
                value = value.substring(0, 11);
            }
            
            // Formatação: (XX) XXXXX-XXXX
            if (value.length > 10) {
                value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
            } else if (value.length > 6) {
                value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
            } else if (value.length > 2) {
                value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
            } else if (value.length > 0) {
                value = value.replace(/^(\d{0,2})$/, '($1');
            }
            
            e.target.value = value;
        });
    }
    
    // =================== NOTIFICATION SYSTEM ===================
    function showNotification(message, type = 'info') {
        // Remove notificação existente
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        // Ícone baseado no tipo
        let iconClass = 'info-circle';
        switch(type) {
            case 'success': iconClass = 'check-circle'; break;
            case 'error': iconClass = 'exclamation-circle'; break;
            case 'warning': iconClass = 'exclamation-triangle'; break;
        }
        
        // Cria nova notificação
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${iconClass}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Mostra notificação
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Fecha notificação após 5 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Botão para fechar
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
        
        return notification;
    }
    
    // =================== VALIDAÇÃO DE EMAIL ===================
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // =================== VALIDAÇÃO DE TELEFONE ===================
    function isValidPhone(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length === 10 || cleanPhone.length === 11;
    }
    
    // =================== FORM SUBMISSION ===================
    // Login Form - AGORA CONECTADO AO BACKEND
if (loginForm) {
    const loginSubmitBtn = document.getElementById('login-submit');
    
    if (loginSubmitBtn) {
        loginSubmitBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const rememberMe = document.getElementById('remember-me').checked;
            
            // Validação básica (MANTIDO)
            if (!email || !password) {
                showNotification('Por favor, preencha todos os campos.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Por favor, insira um email válido.', 'error');
                return;
            }
            
            // LOGIN REAL COM BACKEND (NOVO)
            const originalText = loginSubmitBtn.innerHTML;
            loginSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Autenticando...</span>';
            loginSubmitBtn.disabled = true;
            
            try {
                const response = await fetch(ENDPOINTS.LOGIN, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        senha: password  // Nome que o backend espera
                    })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || 'Erro no login');
                }
                
                // SALVA TOKEN E DADOS (NOVO)
                if (data.token) {
                    localStorage.setItem('neuropulse_token', data.token);
                    localStorage.setItem('neuropulse_user', JSON.stringify(data.usuario));
                    
                    // Remember me
                    if (rememberMe) {
                        localStorage.setItem('neuropulse_remember_email', email);
                    }
                }
                
                showNotification('✅ Login realizado com sucesso!', 'success');
                
                // REDIRECIONA PARA Musicoterapia.html (MANTIDO)
                setTimeout(() => {
                    window.location.href = 'Perfil.html';
                }, 1500);
                
            } catch (error) {
                // ERRO - Mostra notificação mais específica
                let errorMessage = 'Erro no login';
                
                if (error.message.includes('Failed to fetch')) {
                    errorMessage = 'Servidor offline. Execute o backend primeiro.';
                } else if (error.message.includes('401')) {
                    errorMessage = 'Email ou senha incorretos';
                } else {
                    errorMessage = error.message;
                }
                
                showNotification(`❌ ${errorMessage}`, 'error');
                
                // Restaura botão
                loginSubmitBtn.innerHTML = originalText;
                loginSubmitBtn.disabled = false;
            }
        });
    }
}
    // Register Form - AGORA CONECTADO AO BACKEND
if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Dados do formulário (MANTIDO)
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const birthDate = document.getElementById('register-birth').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm').value;
        
        // Validações (MANTIDO)
        if (!name || !email || !birthDate || !password || !confirmPassword) {
            showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Por favor, insira um email válido.', 'error');
            return;
        }
        
        // Verifica se as senhas coincidem (MANTIDO)
        if (password !== confirmPassword) {
            showNotification('As senhas não coincidem.', 'error');
            return;
        }
        
        // Verifica força da senha (MANTIDO)
        if (password.length < 8) {
            showNotification('A senha deve ter pelo menos 8 caracteres.', 'error');
            return;
        }
        
        // PREPARA DADOS PARA O BACKEND (NOVO)
        const userData = {
            nome_completo: name,
            email: email.toLowerCase(),
            data_nascimento: birthDate,
            genero: document.getElementById('register-gender').value,
            senha: password,  // Nome que o backend espera
            telefone: "",
            cidade: "",
            estado: "",
            condicao_saude: document.getElementById('health-condition').value,
            acompanhamento_terapeutico: document.querySelector('#register-form .toggle-btn.active')?.dataset.value === 'sim'
        };
        
        // CADASTRO REAL COM BACKEND (NOVO)
        const submitBtn = document.getElementById('register-submit');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Criando conta...</span>';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch(ENDPOINTS.REGISTER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Erro ao criar conta');
            }
            
            // SUCESSO (NOVO)
            showNotification('🎉 Conta criada com sucesso!', 'success');
            
            // SALVA TOKEN E DADOS (NOVO)
            if (data.token) {
                localStorage.setItem('neuropulse_token', data.token);
                localStorage.setItem('neuropulse_user', JSON.stringify(data.usuario));
            }
            
            // Limpa formulário (MANTIDO)
            this.reset();
            
            // Reseta barra de força (MANTIDO)
            if (registerStrengthFill) {
                registerStrengthFill.style.width = '0%';
            }
            
            // Muda para tab de login (MANTIDO)
            setTimeout(() => {
                switchTab('login');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Preenche email no login (NOVO - opcional)
                document.getElementById('login-email').value = email;
                
            }, 2000);
            
        } catch (error) {
            // ERRO (NOVO)
            showNotification(`❌ ${error.message}`, 'error');
            
            // Restaura botão
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}
    
   // Therapist Form - CONECTADO AO BACKEND
if (therapistForm) {
    therapistForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Coleta dados do formulário
        const dados = {
            nome_completo: document.getElementById('therapist-name').value,
            email_profissional: document.getElementById('therapist-email').value,
            telefone: document.getElementById('therapist-phone').value,
            data_nascimento: document.getElementById('therapist-birth').value,
            profissao: document.querySelector('.prof-card.active').dataset.profession === 'outro' 
                       ? document.getElementById('other-profession').value 
                       : document.querySelector('.prof-card.active').dataset.profession,
            registro_profissional: document.getElementById('therapist-register').value,
            formacao_academica: document.getElementById('therapist-education').value,
            anos_experiencia: parseInt(document.getElementById('experience-slider').value),
            experiencia_variada: document.getElementById('varied-experience').checked,
            observacoes: document.getElementById('therapist-observations').value,
            especialidades: Array.from(document.querySelectorAll('input[name="specialties"]:checked'))
                               .map(cb => cb.value),
            senha: document.getElementById('therapist-password').value
        };
        
        // Validações básicas
        if (!dados.nome_completo || !dados.email_profissional || !dados.telefone || 
            !dados.registro_profissional || !dados.formacao_academica || !dados.senha) {
            showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }
        
        if (dados.senha !== document.getElementById('therapist-confirm').value) {
            showNotification('As senhas não coincidem.', 'error');
            return;
        }
        
        if (dados.senha.length < 8) {
            showNotification('A senha deve ter pelo menos 8 caracteres.', 'error');
            return;
        }
        
        // Envia para o backend
        const submitBtn = document.getElementById('therapist-submit');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Enviando solicitação...</span>';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('http://localhost:5000/api/terapeutas/cadastrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados)
            });
            
            const resultado = await response.json();
            
            if (!resultado.success) {
                throw new Error(resultado.message || 'Erro ao cadastrar');
            }
            
            // SUCESSO
            showNotification('✅ Cadastro realizado! Você já aparece na lista de profissionais.', 'success');
            
            // Salva dados localmente para mostrar na próxima página
            localStorage.setItem('novo_terapeuta', JSON.stringify(resultado.terapeuta));
            
            // Redireciona para a página de profissionais
            setTimeout(() => {
                window.location.href = resultado.redirect || 'tela.profissionais.html';
            }, 2000);
            
        } catch (error) {
            showNotification(`❌ ${error.message}`, 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}
    
    // =================== DATE INPUT VALIDATION ===================
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const today = new Date();
            
            // Verifica se a data é no futuro
            if (selectedDate > today) {
                showNotification('A data de nascimento não pode ser no futuro.', 'error');
                this.value = '';
            }
            
            // Verifica se a idade é menor que 120 anos
            const age = today.getFullYear() - selectedDate.getFullYear();
            if (age > 120) {
                showNotification('Por favor, insira uma data de nascimento válida.', 'error');
                this.value = '';
            }
        });
    });
    
    // =================== INITIALIZE ===================
    // Inicializa o sistema de tabs
    switchTab('login');
    
    // Inicializa o campo de especificação de profissão
    document.getElementById('other-profession-container').style.display = 'block';
    
    // Efeito de entrada suave para todos os elementos
    const animateElements = () => {
        const elements = document.querySelectorAll('.brand-container, .auth-container, .form-section');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 50);
        });
    };
    
    // Aplica estilos iniciais
    document.querySelectorAll('.brand-container, .auth-container, .form-section').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(15px)';
        el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
    
    // Anima após um breve delay
    setTimeout(animateElements, 200);
    
    // Background elements interaction (opcional)
    const bgElements = document.querySelector('.bg-elements');
    if (bgElements) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 10;
            const y = (e.clientY / window.innerHeight) * 10;
            
            bgElements.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
        // =================== INICIALIZAÇÃO DO BACKEND ===================
    // Verifica conexão com backend após carregar
    setTimeout(checkBackend, 1000);
    
    // Preencre credenciais demo automático
    setTimeout(() => {
        const emailInput = document.getElementById('login-email');
        const passwordInput = document.getElementById('login-password');
        
        if (emailInput && !emailInput.value) {
            emailInput.value = 'demo@neuropulse.com';
            passwordInput.value = 'demo123';
            showNotification('📋 Credenciais demo preenchidas automaticamente!', 'info', 3000);
        }
    }, 1500);
    
    // Log de inicialização
    console.log('NeuroPulse Authentication System initialized with backend connection.');
});


