"""
NEUROPULSE - BACKEND PARA USUÁRIOS
Sistema de autenticação e gerenciamento de usuários
"""
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import mysql.connector
import jwt
import datetime
from functools import wraps
import os
from dotenv import load_dotenv

# ============================================
# 1. CONFIGURAÇÃO INICIAL
# ============================================
load_dotenv()

app = Flask(__name__, static_folder='public')
CORS(app)  # Permite todas as origens para desenvolvimento

# Configurações de segurança
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'neuropulse_secret_key_2025')
app.config['JWT_EXPIRATION_HOURS'] = int(os.getenv('JWT_EXPIRATION_HOURS', 72))

bcrypt = Bcrypt(app)

# ============================================
# 2. CONEXÃO COM BANCO DE DADOS
# ============================================
def get_db_connection():
    """Conecta ao banco de dados MySQL"""
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            user=os.getenv('DB_USER', 'root'),
            password=os.getenv('DB_PASSWORD', 'Danielsep2007'),
            database=os.getenv('DB_NAME', 'neuropulse_db'),
            port=int(os.getenv('DB_PORT', 3306))
        )
        return connection
    except mysql.connector.Error as err:
        print(f"⚠️  Erro ao conectar ao MySQL: {err}")
        return None

# ============================================
# 3. MIDDLEWARE DE AUTENTICAÇÃO
# ============================================
def token_required(f):
    """Decorator que verifica token JWT"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Busca token no header Authorization
        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'error': 'Token de acesso necessário'}), 401
        
        try:  
            # Decodifica o token
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            user_id = data.get('user_id')
            
            if not user_id:
                return jsonify({'error': 'Token inválido'}), 401
            
            # Busca usuário no banco
            conn = get_db_connection()
            if not conn:
                return jsonify({'error': 'Erro no servidor'}), 500
                
            cursor = conn.cursor(dictionary=True)
            cursor.execute('''
                SELECT id, nome_completo, email, genero, data_nascimento, 
                       data_criacao, telefone, cidade, estado, ativo
                FROM usuarios 
                WHERE id = %s AND ativo = TRUE
            ''', (user_id,))
            
            user = cursor.fetchone()
            cursor.close()
            conn.close()
            
            if not user:
                return jsonify({'error': 'Usuário não encontrado ou inativo'}), 401
            
            # Adiciona usuário ao contexto da requisição
            request.current_user = user
            
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expirado. Faça login novamente.'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token inválido'}), 401
        except Exception as e:
            print(f"❌ Erro na autenticação: {e}")
            return jsonify({'error': 'Erro de autenticação'}), 500
        
        return f(*args, **kwargs)
    
    return decorated

# ============================================
# 4. FUNÇÕES AUXILIARES
# ============================================
def calcular_idade(data_nascimento_str):
    """Calcula idade a partir da data de nascimento (formato YYYY-MM-DD)"""
    try:
        if not data_nascimento_str:
            return None
        
        hoje = datetime.date.today()
        nascimento = datetime.datetime.strptime(data_nascimento_str, '%Y-%m-%d').date()
        
        idade = hoje.year - nascimento.year
        # Ajusta se ainda não fez aniversário este ano
        if (hoje.month, hoje.day) < (nascimento.month, nascimento.day):
            idade -= 1
            
        return idade
    except:
        return None

def validar_email(email):
    """Valida formato de email"""
    import re
    if not email or '@' not in email:
        return False
    return True

def validar_senha(senha):
    """Valida requisitos da senha"""
    if len(senha) < 8:
        return False, 'A senha deve ter no mínimo 8 caracteres'
    return True, ''

# ============================================
# 5. ROTAS DA API - USUÁRIOS
# ============================================

# ROTA 1: Status do sistema
@app.route('/api/health', methods=['GET'])
def health_check():
    """Verifica se a API está funcionando"""
    try:
        conn = get_db_connection()
        if conn:
            cursor = conn.cursor()
            cursor.execute('SELECT 1')
            cursor.close()
            conn.close()
            db_status = 'conectado'
        else:
            db_status = 'desconectado'
    except:
        db_status = 'desconectado'
    
    return jsonify({
        'status': 'online',
        'servico': 'NeuroPulse API - Usuários',
        'banco_dados': db_status,
        'timestamp': datetime.datetime.now().isoformat()
    })

# ROTA 2: Configurar banco de dados
@app.route('/api/setup', methods=['GET', 'POST'])
def setup_database():
    """Cria a tabela de usuários e insere usuário demo"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Não foi possível conectar ao MySQL'}), 500
        
        cursor = conn.cursor()
        
        # Cria tabela de usuários
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome_completo VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                data_nascimento DATE NOT NULL,
                genero VARCHAR(20),
                senha VARCHAR(255) NOT NULL,
                telefone VARCHAR(20),
                cidade VARCHAR(50),
                estado VARCHAR(2),
                condicao_saude VARCHAR(100),
                acompanhamento_terapeutico BOOLEAN DEFAULT FALSE,
                data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                ultimo_login TIMESTAMP NULL,
                ativo BOOLEAN DEFAULT TRUE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ''')
        
        # Verifica se usuário demo já existe
        cursor.execute('SELECT id FROM usuarios WHERE email = %s', ('demo@neuropulse.com',))
        demo_exists = cursor.fetchone()
        
        if not demo_exists:
            # Cria senha hash para demo
            senha_hash = bcrypt.generate_password_hash('demo123').decode('utf-8')
            
            cursor.execute('''
                INSERT INTO usuarios 
                (nome_completo, email, data_nascimento, genero, senha, ativo)
                VALUES (%s, %s, %s, %s, %s, %s)
            ''', (
                'Usuário Demonstração',
                'demo@neuropulse.com',
                '1995-05-15',
                'Não informado',
                senha_hash,
                True
            ))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': '✅ Banco de dados configurado com sucesso!',
            'demo_account': {
                'email': 'demo@neuropulse.com',
                'password': 'demo123',
                'note': 'Use estas credenciais para teste'
            }
        })
        
    except Exception as e:
        return jsonify({'error': f'Erro ao configurar banco: {str(e)}'}), 500

# ROTA 3: Cadastrar novo usuário
@app.route('/api/usuarios/cadastrar', methods=['POST'])
def cadastrar_usuario():
    """Cadastra um novo usuário no sistema"""
    try:
        # Obtém dados da requisição
        data = request.get_json()
        
        # Campos obrigatórios
        campos_obrigatorios = ['nome_completo', 'email', 'data_nascimento', 'senha']
        campos_faltantes = []
        
        for campo in campos_obrigatorios:
            if campo not in data or not str(data[campo]).strip():
                campos_faltantes.append(campo)
        
        if campos_faltantes:
            return jsonify({
                'error': 'Campos obrigatórios faltando',
                'campos': campos_faltantes
            }), 400
        
        # Validações
        nome = data['nome_completo'].strip()
        email = data['email'].strip().lower()
        data_nascimento = data['data_nascimento']
        senha = data['senha']
        
        # Valida email
        if not validar_email(email):
            return jsonify({'error': 'Email inválido'}), 400
        
        # Valida senha
        senha_valida, mensagem_erro = validar_senha(senha)
        if not senha_valida:
            return jsonify({'error': mensagem_erro}), 400
        
        # Conecta ao banco
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Erro de conexão com o banco'}), 500
        
        cursor = conn.cursor(dictionary=True)
        
        # Verifica se email já existe
        cursor.execute('SELECT id FROM usuarios WHERE email = %s', (email,))
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({'error': 'Este email já está cadastrado'}), 409
        
        # Cria hash da senha
        senha_hash = bcrypt.generate_password_hash(senha).decode('utf-8')
        
        # Insere novo usuário
        cursor.execute('''
            INSERT INTO usuarios 
            (nome_completo, email, data_nascimento, genero, senha, 
             telefone, cidade, estado, condicao_saude, acompanhamento_terapeutico)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''', (
            nome,
            email,
            data_nascimento,
            data.get('genero', ''),
            senha_hash,
            data.get('telefone', ''),
            data.get('cidade', ''),
            data.get('estado', ''),
            data.get('condicao_saude', ''),
            data.get('acompanhamento_terapeutico', False)
        ))
        
        # Obtém ID do novo usuário
        user_id = cursor.lastrowid
        
        # Gera token JWT
        token = jwt.encode({
            'user_id': user_id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=app.config['JWT_EXPIRATION_HOURS'])
        }, app.config['SECRET_KEY'])
        
        # Busca dados do usuário criado
        cursor.execute('''
            SELECT id, nome_completo, email, genero, data_nascimento, 
                   data_criacao, cidade, estado
            FROM usuarios WHERE id = %s
        ''', (user_id,))
        
        usuario = cursor.fetchone()
        
        conn.commit()
        cursor.close()
        conn.close()
        
        # Calcula idade
        idade = calcular_idade(usuario['data_nascimento'])
        
        # Retorna resposta de sucesso
        return jsonify({
            'success': True,
            'message': '🎉 Cadastro realizado com sucesso!',
            'token': token,
            'usuario': {
                'id': usuario['id'],
                'nome_completo': usuario['nome_completo'],
                'nome': usuario['nome_completo'].split()[0],  # Primeiro nome
                'email': usuario['email'],
                'genero': usuario['genero'],
                'data_nascimento': str(usuario['data_nascimento']),
                'idade': idade,
                'cidade': usuario['cidade'],
                'estado': usuario['estado'],
                'data_cadastro': str(usuario['data_criacao'])
            }
        }), 201
        
    except Exception as e:
        print(f"❌ Erro no cadastro: {e}")
        return jsonify({'error': 'Erro interno no servidor'}), 500

# ROTA 4: Login de usuário
@app.route('/api/usuarios/login', methods=['POST'])
def login_usuario():
    """Autentica usuário e retorna token"""
    try:
        data = request.get_json()
        
        # Validação básica
        if not data or 'email' not in data or 'senha' not in data:
            return jsonify({'error': 'Email e senha são obrigatórios'}), 400
        
        email = data['email'].strip().lower()
        senha = data['senha']
        
        # Conecta ao banco
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Erro de conexão com o banco'}), 500
        
        cursor = conn.cursor(dictionary=True)
        
        # Busca usuário pelo email
        cursor.execute('''
            SELECT id, nome_completo, email, genero, data_nascimento, 
                   senha, data_criacao, cidade, estado, ativo
            FROM usuarios 
            WHERE email = %s
        ''', (email,))
        
        usuario = cursor.fetchone()
        
        if not usuario:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Email ou senha incorretos'}), 401
        
        # Verifica se conta está ativa
        if not usuario['ativo']:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Conta desativada'}), 403
        
        # Verifica senha
        if not bcrypt.check_password_hash(usuario['senha'], senha):
            cursor.close()
            conn.close()
            return jsonify({'error': 'Email ou senha incorretos'}), 401
        
        # Atualiza último login
        cursor.execute('''
            UPDATE usuarios 
            SET ultimo_login = NOW() 
            WHERE id = %s
        ''', (usuario['id'],))
        
        # Gera token JWT
        token = jwt.encode({
            'user_id': usuario['id'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=app.config['JWT_EXPIRATION_HOURS'])
        }, app.config['SECRET_KEY'])
        
        conn.commit()
        cursor.close()
        conn.close()
        
        # Calcula idade
        idade = calcular_idade(str(usuario['data_nascimento']))
        
        # Retorna resposta de sucesso
        return jsonify({
            'success': True,
            'message': '🔓 Login realizado com sucesso!',
            'token': token,
            'usuario': {
                'id': usuario['id'],
                'nome_completo': usuario['nome_completo'],
                'nome': usuario['nome_completo'].split()[0],
                'email': usuario['email'],
                'genero': usuario['genero'],
                'data_nascimento': str(usuario['data_nascimento']),
                'idade': idade,
                'cidade': usuario['cidade'],
                'estado': usuario['estado'],
                'data_cadastro': str(usuario['data_criacao'])
            }
        }), 200
        
    except Exception as e:
        print(f"❌ Erro no login: {e}")
        return jsonify({'error': 'Erro interno no servidor'}), 500

# ROTA 5: Perfil do usuário (protegido)
@app.route('/api/usuarios/perfil', methods=['GET'])
@token_required
def obter_perfil():
    """Retorna dados do perfil do usuário autenticado"""
    try:
        usuario = request.current_user
        
        # Calcula idade
        idade = calcular_idade(str(usuario['data_nascimento']))
        
        return jsonify({
            'success': True,
            'usuario': {
                'id': usuario['id'],
                'nome_completo': usuario['nome_completo'],
                'email': usuario['email'],
                'genero': usuario['genero'],
                'data_nascimento': str(usuario['data_nascimento']),
                'idade': idade,
                'telefone': usuario['telefone'],
                'cidade': usuario['cidade'],
                'estado': usuario['estado'],
                'data_cadastro': str(usuario['data_criacao'])
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ROTA 6: Atualizar perfil (protegido)
@app.route('/api/usuarios/perfil', methods=['PUT'])
@token_required
def atualizar_perfil():
    """Atualiza dados do perfil do usuário"""
    try:
        data = request.get_json()
        user_id = request.current_user['id']
        
        # Campos permitidos para atualização
        campos_permitidos = ['nome_completo', 'telefone', 'cidade', 'estado', 'genero']
        campos_para_atualizar = {}
        
        for campo in campos_permitidos:
            if campo in data:
                valor = str(data[campo]).strip()
                if valor:  # Não atualiza com string vazia
                    campos_para_atualizar[campo] = valor
        
        if not campos_para_atualizar:
            return jsonify({'error': 'Nenhum campo válido para atualização'}), 400
        
        # Conecta ao banco
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Erro de conexão com o banco'}), 500
        
        cursor = conn.cursor()
        
        # Constrói query dinamicamente
        set_clause = ', '.join([f"{campo} = %s" for campo in campos_para_atualizar.keys()])
        valores = list(campos_para_atualizar.values()) + [user_id]
        
        cursor.execute(f'''
            UPDATE usuarios 
            SET {set_clause}
            WHERE id = %s
        ''', valores)
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Perfil atualizado com sucesso!'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ROTA 7: Verificar disponibilidade de email
@app.route('/api/usuarios/verificar-email/<email>', methods=['GET'])
def verificar_email(email):
    """Verifica se um email já está cadastrado"""
    try:
        if not email or '@' not in email:
            return jsonify({'error': 'Email inválido'}), 400
        
        email = email.strip().lower()
        
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Erro de conexão com o banco'}), 500
        
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT id FROM usuarios WHERE email = %s', (email,))
        
        existe = cursor.fetchone() is not None
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'email': email,
            'disponivel': not existe,
            'message': 'Email já cadastrado' if existe else 'Email disponível'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ROTA 8: Logout (simbólico)
@app.route('/api/usuarios/logout', methods=['POST'])
@token_required
def logout_usuario():
    """Registra logout do usuário (apenas simbólico, token é stateless)"""
    return jsonify({
        'success': True,
        'message': 'Logout realizado com sucesso'
    }), 200

# ============================================
# 6. ROTAS PARA FRONTEND
# ============================================
@app.route('/')
def serve_index():
    """Serve a página de login"""
    return send_from_directory('public', 'login.html')

@app.route('/<path:path>')
def serve_static(path):
    """Serve arquivos estáticos (CSS, JS, imagens)"""
    return send_from_directory('public', path)

# ============================================
# 7. ERRO 404
# ============================================
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Rota não encontrada'}), 404

# ============================================
# 8. INICIALIZAÇÃO DO SERVIDOR
# ============================================
if __name__ == '__main__':
    print("=" * 60)
    print("🧠 NEUROPULSE - BACKEND PARA USUÁRIOS")
    print("=" * 60)
    print("\n📡 Endpoints disponíveis:")
    print("   GET  /api/health                 - Status da API")
    print("   GET  /api/setup                  - Configurar banco")
    print("   POST /api/usuarios/cadastrar     - Cadastrar usuário")
    print("   POST /api/usuarios/login         - Login")
    print("   GET  /api/usuarios/perfil        - Perfil (token)")
    print("   PUT  /api/usuarios/perfil        - Atualizar perfil")
    print("   GET  /api/usuarios/verificar-email/<email>")
    print("\n🌐 Frontend:")
    print("   http://localhost:5000/")
    print("\n⚠️  Primeiro passo:")
    print("   Acesse: http://localhost:5000/api/setup")
    print("=" * 60)
    
    # Verifica se pasta public existe
    if not os.path.exists('public'):
        os.makedirs('public')
        print("📁 Pasta 'public' criada. Adicione seus arquivos HTML/CSS/JS lá.")
    
    app.run(debug=True, port=5000, host='127.0.0.1')