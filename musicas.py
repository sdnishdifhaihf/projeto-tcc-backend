from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Permitir todas as origens

# Configuração do banco de dados
def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            user=os.getenv('DB_USER', 'root'),
            password=os.getenv('DB_PASSWORD', 'etec'),
            database=os.getenv('DB_NAME', 'neuropulse_playlists'),
            port=os.getenv('DB_PORT', 3306)
        )
        return connection
    except Error as e:
        print(f"Erro ao conectar ao MySQL: {e}")
        return None

# ========== ROTAS DE CATEGORIAS ==========

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Obter todas as categorias (Foco, Relaxar, Sono, etc.)"""
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM categories ORDER BY id")
    categories = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return jsonify(categories)

@app.route('/api/categories/<data_mood>', methods=['GET'])
def get_category_by_mood(data_mood):
    """Obter categoria por mood (focus, relax, sleep, energy)"""
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM categories WHERE data_mood = %s", (data_mood,))
    category = cursor.fetchone()
    
    cursor.close()
    conn.close()
    
    if category:
        return jsonify(category)
    return jsonify({'error': 'Category not found'}), 404

# ========== ROTAS DE PLAYLISTS ==========

@app.route('/api/playlists', methods=['GET'])
def get_all_playlists():
    """Obter todas as playlists"""
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT p.*, c.name as category_name, c.data_mood, c.icon as category_icon
        FROM playlists p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.created_at DESC
    """)
    playlists = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return jsonify(playlists)

@app.route('/api/playlists/<int:playlist_id>', methods=['GET'])
def get_playlist(playlist_id):
    """Obter uma playlist específica pelo ID"""
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    # Obter playlist
    cursor.execute("""
        SELECT p.*, c.name as category_name, c.data_mood, c.icon as category_icon
        FROM playlists p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = %s
    """, (playlist_id,))
    playlist = cursor.fetchone()
    
    if playlist:
        # Obter músicas da playlist
        cursor.execute("""
            SELECT * FROM tracks 
            WHERE playlist_id = %s 
            ORDER BY order_in_playlist
        """, (playlist_id,))
        tracks = cursor.fetchall()
        playlist['tracks'] = tracks
    
    cursor.close()
    conn.close()
    
    if playlist:
        return jsonify(playlist)
    return jsonify({'error': 'Playlist not found'}), 404

@app.route('/api/playlists/category/<category_id>', methods=['GET'])
def get_playlists_by_category(category_id):
    """Obter playlists por categoria"""
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT p.*, c.name as category_name, c.data_mood, c.icon as category_icon
        FROM playlists p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.category_id = %s
        ORDER BY p.created_at DESC
    """, (category_id,))
    playlists = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return jsonify(playlists)

@app.route('/api/playlists/mood/<mood>', methods=['GET'])
def get_playlists_by_mood(mood):
    """Obter playlists por mood (focus, relax, sleep, energy)"""
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    if mood == 'all':
        cursor.execute("""
            SELECT p.*, c.name as category_name, c.data_mood, c.icon as category_icon
            FROM playlists p
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.created_at DESC
        """)
    else:
        cursor.execute("""
            SELECT p.*, c.name as category_name, c.data_mood, c.icon as category_icon
            FROM playlists p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE c.data_mood = %s
            ORDER BY p.created_at DESC
        """, (mood,))
    
    playlists = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return jsonify(playlists)

# ========== ROTAS DE MÚSICAS (TRACKS) ==========

@app.route('/api/tracks/playlist/<int:playlist_id>', methods=['GET'])
def get_tracks_by_playlist(playlist_id):
    """Obter todas as músicas de uma playlist"""
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT * FROM tracks 
        WHERE playlist_id = %s 
        ORDER BY order_in_playlist
    """, (playlist_id,))
    tracks = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return jsonify(tracks)

@app.route('/api/tracks/<int:track_id>', methods=['GET'])
def get_track(track_id):
    """Obter uma música específica"""
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM tracks WHERE id = %s", (track_id,))
    track = cursor.fetchone()
    
    cursor.close()
    conn.close()
    
    if track:
        return jsonify(track)
    return jsonify({'error': 'Track not found'}), 404

# ========== ROTAS DE ESTATÍSTICAS ==========

@app.route('/api/stats/click', methods=['POST'])
def track_playlist_click():
    """Registrar um clique em uma playlist (para Spotify/YouTube)"""
    data = request.json
    playlist_id = data.get('playlist_id')
    platform = data.get('platform')  # 'spotify' ou 'youtube'
    
    if not playlist_id or not platform:
        return jsonify({'error': 'Missing playlist_id or platform'}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    
    try:
        # Inserir ou atualizar estatística
        cursor.execute("""
            INSERT INTO playlist_stats (playlist_id, platform, clicks_count, last_clicked)
            VALUES (%s, %s, 1, NOW())
            ON DUPLICATE KEY UPDATE 
            clicks_count = clicks_count + 1,
            last_clicked = NOW()
        """, (playlist_id, platform))
        
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return jsonify({'message': 'Click tracked successfully'}), 200
        
    except Error as e:
        print(f"Error tracking click: {e}")
        return jsonify({'error': 'Failed to track click'}), 500

@app.route('/api/stats/popular', methods=['GET'])
def get_popular_playlists():
    """Obter playlists mais populares (baseado em cliques)"""
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT 
            p.*,
            c.name as category_name,
            c.data_mood,
            COALESCE(SUM(ps.clicks_count), 0) as total_clicks
        FROM playlists p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN playlist_stats ps ON p.id = ps.playlist_id
        GROUP BY p.id
        ORDER BY total_clicks DESC, p.created_at DESC
        LIMIT 10
    """)
    popular_playlists = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return jsonify(popular_playlists)

# ========== ROTAS DE PESQUISA ==========

@app.route('/api/search', methods=['GET'])
def search_playlists():
    """Pesquisar playlists por título ou descrição"""
    query = request.args.get('q', '')
    
    if not query or len(query) < 2:
        return jsonify([])
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    search_term = f"%{query}%"
    cursor.execute("""
        SELECT p.*, c.name as category_name, c.data_mood, c.icon as category_icon
        FROM playlists p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.title LIKE %s OR p.description LIKE %s
        ORDER BY p.created_at DESC
    """, (search_term, search_term))
    
    results = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return jsonify(results)

# ========== ROTA DE HEALTH CHECK ==========

@app.route('/api/health', methods=['GET'])
def health_check():
    """Verificar status do servidor e banco de dados"""
    db_status = 'healthy' if get_db_connection() else 'unhealthy'
    
    return jsonify({
        'status': 'running',
        'database': db_status,
        'service': 'neuropulse-music-api',
        'version': '1.0.0'
    })

# ========== CONFIGURAÇÃO DO SERVIDOR ==========

if __name__ == '__main__':
    # Criar pasta de uploads se não existir
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    
    print("🚀 NeuroPulse Music API iniciando...")
    print("📊 Banco de dados: neuropulse_playlists")
    print("🔗 Endpoints disponíveis:")
    print("   GET  /api/categories")
    print("   GET  /api/playlists")
    print("   GET  /api/playlists/mood/{mood}")
    print("   GET  /api/playlists/{id}")
    print("   GET  /api/tracks/playlist/{id}")
    print("   POST /api/stats/click")
    print("   GET  /api/search?q=termo")
    
    app.run(debug=True, port=5000, host='0.0.0.0')