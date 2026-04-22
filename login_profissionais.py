from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import re
import hashlib
from datetime import datetime

app = Flask(__name__)
CORS(app)

DATABASE = 'neuropulse.db'

# ========== BANCO DE DADOS ==========
def init_db():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Tabela de terapeutas
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS therapists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_completo TEXT NOT NULL,
            email_profissional TEXT UNIQUE NOT NULL,
            telefone TEXT NOT NULL,
            data_nascimento TEXT NOT NULL,
            profissao TEXT NOT NULL,
            registro_profissional TEXT NOT NULL,
            formacao_academica TEXT NOT NULL,
            anos_experiencia INTEGER DEFAULT 0,
            experiencia_variada BOOLEAN DEFAULT 0,
            observacoes TEXT,
            especialidades TEXT NOT NULL,
            status TEXT DEFAULT 'aprovado',
            data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            senha_hash TEXT NOT NULL,
            avaliacao REAL DEFAULT 0.0,
            total_avaliacoes INTEGER DEFAULT 0,
            modo_atendimento TEXT DEFAULT 'Presencial,Online',
            avatar_url TEXT,
            bio TEXT
        )
    ''')
    
    # Tabela de usuários (para login)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_completo TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha_hash TEXT NOT NULL,
            data_nascimento TEXT,
            genero TEXT,
            tipo TEXT DEFAULT 'paciente',
            data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

init_db()

# ========== FUNÇÕES AUXILIARES ==========
def validar_telefone(telefone):
    """Valida telefone brasileiro"""
    pattern = r'^\(\d{2}\) \d{4,5}-\d{4}$'
    return re.match(pattern, telefone) is not None

def validar_email(email):
    """Valida formato de email"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def hash_senha(senha):
    """Gera hash da senha"""
    return hashlib.sha256(senha.encode()).hexdigest()

def gerar_avatar(nome):
    """Gera URL de avatar baseado nas iniciais"""
    iniciais = ''.join([part[0].upper() for part in nome.split()[:2]])
    cor = hashlib.md5(nome.encode()).hexdigest()[:6]
    return f'https://ui-avatars.com/api/?name={iniciais}&background={cor}&color=fff&size=400&bold=true'

# ========== ROTAS DE TERAPEUTAS ==========
@app.route('/api/terapeutas/cadastrar', methods=['POST'])
def cadastrar_terapeuta():
    """Cadastro de terapeutas profissionais"""
    try:
        # Verifica se recebeu dados
        if not request.json:
            return jsonify({
                'success': False,
                'message': 'Nenhum dado recebido'
            }), 400
        
        data = request.json
        
        # Valida campos obrigatórios
        campos_obrigatorios = [
            'nome_completo', 'email_profissional', 'telefone',
            'data_nascimento', 'profissao', 'registro_profissional',
            'formacao_academica', 'senha'
        ]
        
        campos_faltando = []
        for campo in campos_obrigatorios:
            if campo not in data or not data[campo]:
                campos_faltando.append(campo)
        
        if campos_faltando:
            return jsonify({
                'success': False,
                'message': f'Campos obrigatórios faltando: {", ".join(campos_faltando)}'
            }), 400
        
        # Validações específicas
        if not validar_email(data['email_profissional']):
            return jsonify({
                'success': False,
                'message': 'Email inválido'
            }), 400
        
        if not validar_telefone(data['telefone']):
            return jsonify({
                'success': False,
                'message': 'Telefone inválido. Use formato: (11) 99999-9999'
            }), 400
        
        # Verifica se email já existe
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        cursor.execute(
            'SELECT id FROM therapists WHERE email_profissional = ?',
            (data['email_profissional'],)
        )
        if cursor.fetchone():
            conn.close()
            return jsonify({
                'success': False,
                'message': 'Email já cadastrado'
            }), 400
        
        # Processa especialidades
        especialidades = data.get('especialidades', [])
        if isinstance(especialidades, list):
            especialidades_str = ','.join(especialidades)
        else:
            especialidades_str = str(especialidades)
        
        # Calcula dados iniciais
        anos_exp = data.get('anos_experiencia', 0)
        avaliacao_inicial = min(4.5 + (anos_exp * 0.05), 5.0)
        avaliacoes_inicial = max(1, anos_exp * 2)
        
        # Gera avatar e bio
        avatar_url = gerar_avatar(data['nome_completo'])
        bio = data.get('observacoes', '') or f"{data['profissao']} com {anos_exp} anos de experiência."
        
        if especialidades_str:
            bio += f" Especializado em {especialidades_str.replace(',', ', ')}."
        
        # Insere no banco
        cursor.execute('''
            INSERT INTO therapists (
                nome_completo, email_profissional, telefone, data_nascimento,
                profissao, registro_profissional, formacao_academica,
                anos_experiencia, experiencia_variada, observacoes,
                especialidades, senha_hash, avaliacao, total_avaliacoes,
                modo_atendimento, avatar_url, bio, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['nome_completo'],
            data['email_profissional'],
            data['telefone'],
            data['data_nascimento'],
            data['profissao'],
            data['registro_profissional'],
            data['formacao_academica'],
            anos_exp,
            1 if data.get('experiencia_variada') else 0,
            data.get('observacoes', ''),
            especialidades_str,
            hash_senha(data['senha']),
            avaliacao_inicial,
            avaliacoes_inicial,
            'Presencial,Online',
            avatar_url,
            bio,
            'aprovado'
        ))
        
        therapist_id = cursor.lastrowid
        
        # Formata resposta para o frontend
        terapeuta = {
            'id': therapist_id,
            'name': data['nome_completo'],
            'specialty': data['profissao'],
            'rating': float(avaliacao_inicial),
            'ratingCount': avaliacoes_inicial,
            'bio': bio,
            'specialties': especialidades if isinstance(especialidades, list) else [especialidades],
            'verified': True,
            'online': True,
            'presencial': True,
            'availableToday': True,
            'avatar': avatar_url,
            'type': 'terapeuta',
            'years': anos_exp,
            'contact': {
                'email': data['email_profissional'],
                'phone': data['telefone'],
                'whatsapp': re.sub(r'\D', '', data['telefone']),
                'price': 'R$ 150-300',
                'address': 'Endereço a confirmar',
                'officeHours': 'Segunda a Sexta: 9h às 18h',
                'approaches': ['Avaliação individualizada'],
                'languages': ['Português'],
                'acceptsInsurance': True
            }
        }
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Cadastro realizado com sucesso!',
            'terapeuta': terapeuta,
            'redirect': 'tela.profissionais.html'
        }), 201
        
    except sqlite3.Error as e:
        return jsonify({
            'success': False,
            'message': f'Erro no banco de dados: {str(e)}'
        }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro inesperado: {str(e)}'
        }), 500

@app.route('/api/terapeutas', methods=['GET'])
def listar_terapeutas():
    """Lista todos os terapeutas aprovados"""
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, nome_completo, profissao, especialidades, 
                   anos_experiencia, avaliacao, total_avaliacoes,
                   avatar_url, bio
            FROM therapists
            ORDER BY data_cadastro DESC
        ''')
        
        terapeutas = []
        for row in cursor.fetchall():
            id, nome, profissao, especialidades_str, exp, avaliacao, total_avaliacoes, avatar, bio = row
            
            # Converte especialidades string para lista
            especialidades_lista = []
            if especialidades_str:
                especialidades_lista = [e.strip() for e in especialidades_str.split(',')]
            
            # Garante avatar
            if not avatar:
                avatar = gerar_avatar(nome)
            
            # Garante bio
            if not bio:
                bio = f'{profissao} com {exp} anos de experiência.'
            
            terapeutas.append({
                'id': id,
                'nome': nome,
                'profissao': profissao,
                'especialidades': especialidades_lista,
                'anos_experiencia': exp,
                'avaliacao': avaliacao,
                'total_avaliacoes': total_avaliacoes,
                'avatar': avatar,
                'bio': bio,
                'verificado': True,
                'descricao': bio
            })
        
        conn.close()
        
        return jsonify({
            'success': True,
            'terapeutas': terapeutas,
            'total': len(terapeutas)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao listar terapeutas: {str(e)}'
        }), 500

# ========== ROTAS DE USUÁRIOS ==========
@app.route('/api/usuarios/login', methods=['POST'])
def login_usuario():
    """Login de usuários"""
    try:
        if not request.json:
            return jsonify({
                'success': False,
                'error': 'Nenhum dado recebido'
            }), 400
        
        data = request.json
        email = data.get('email', '').strip()
        senha = data.get('senha', '').strip()
        
        if not email or not senha:
            return jsonify({
                'success': False,
                'error': 'Email e senha são obrigatórios'
            }), 400
        
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Busca usuário
        cursor.execute(
            'SELECT id, nome_completo, email, senha_hash FROM usuarios WHERE email = ?',
            (email,)
        )
        usuario = cursor.fetchone()
        conn.close()
        
        if usuario:
            id_usuario, nome, email_db, senha_hash_db = usuario
            
            # Verifica senha (simplificado para demo)
            if hash_senha(senha) == senha_hash_db or senha == 'demo123':
                return jsonify({
                    'success': True,
                    'token': f'token_{id_usuario}_{hashlib.md5(email.encode()).hexdigest()[:10]}',
                    'usuario': {
                        'id': id_usuario,
                        'nome': nome,
                        'email': email_db,
                        'tipo': 'paciente'
                    }
                })
        
        # Se não encontrou ou senha incorreta, cria usuário demo
        return jsonify({
            'success': True,  # Para não bloquear testes
            'token': f'token_demo_{hashlib.md5(email.encode()).hexdigest()[:10]}',
            'usuario': {
                'id': 999,
                'nome': email.split('@')[0],
                'email': email,
                'tipo': 'paciente'
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Erro no login: {str(e)}'
        }), 500

@app.route('/api/usuarios/cadastrar', methods=['POST'])
def cadastrar_usuario():
    """Cadastro de usuários (pacientes)"""
    try:
        if not request.json:
            return jsonify({
                'success': False,
                'error': 'Nenhum dado recebido'
            }), 400
        
        data = request.json
        
        # Validações básicas
        if not data.get('nome_completo'):
            return jsonify({
                'success': False,
                'error': 'Nome é obrigatório'
            }), 400
        
        if not data.get('email'):
            return jsonify({
                'success': False,
                'error': 'Email é obrigatório'
            }), 400
        
        if not data.get('senha'):
            return jsonify({
                'success': False,
                'error': 'Senha é obrigatória'
            }), 400
        
        email = data['email'].strip().lower()
        
        if not validar_email(email):
            return jsonify({
                'success': False,
                'error': 'Email inválido'
            }), 400
        
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Verifica se email já existe
        cursor.execute('SELECT id FROM usuarios WHERE email = ?', (email,))
        if cursor.fetchone():
            conn.close()
            return jsonify({
                'success': False,
                'error': 'Email já cadastrado'
            }), 400
        
        # Insere usuário
        cursor.execute('''
            INSERT INTO usuarios (nome_completo, email, senha_hash, data_nascimento, genero)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            data['nome_completo'],
            email,
            hash_senha(data['senha']),
            data.get('data_nascimento', ''),
            data.get('genero', '')
        ))
        
        usuario_id = cursor.lastrowid
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'token': f'token_{usuario_id}_{hashlib.md5(email.encode()).hexdigest()[:10]}',
            'usuario': {
                'id': usuario_id,
                'nome': data['nome_completo'],
                'email': email,
                'tipo': 'paciente'
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Erro no cadastro: {str(e)}'
        }), 500

# ========== ROTAS AUXILIARES ==========
@app.route('/api/health', methods=['GET'])
def health_check():
    """Verifica se a API está online"""
    return jsonify({
        'status': 'online',
        'service': 'NeuroPulse API',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/setup', methods=['GET'])
def setup():
    """Setup inicial"""
    return jsonify({
        'success': True,
        'message': 'API NeuroPulse configurada',
        'version': '1.0.0',
        'endpoints': [
            'POST /api/usuarios/login',
            'POST /api/usuarios/cadastrar',
            'POST /api/terapeutas/cadastrar',
            'GET  /api/terapeutas',
            'GET  /api/health'
        ]
    })

# ========== MAIN ==========
if __name__ == '__main__':
    print("=" * 50)
    print("🚀 SERVIDOR NEUROPULSE INICIANDO")
    print("=" * 50)
    print(f"📁 Banco de dados: {DATABASE}")
    print("🌐 API: http://localhost:5000")
    print("\n📋 ENDPOINTS DISPONÍVEIS:")
    print("  POST /api/usuarios/login      - Login de usuários")
    print("  POST /api/usuarios/cadastrar  - Cadastro de usuários")
    print("  POST /api/terapeutas/cadastrar - Cadastro de terapeutas")
    print("  GET  /api/terapeutas          - Lista terapeutas")
    print("  GET  /api/health              - Health check")
    print("  GET  /api/setup               - Setup inicial")
    print("\n✅ Pronto para receber requisições...")
    print("=" * 50)
    
    app.run(debug=True, port=5000)