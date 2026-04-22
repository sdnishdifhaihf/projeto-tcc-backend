# visualizador_rapido.py
import mysql.connector

conn = mysql.connector.connect(
    host='127.0.0.1',
    user='root',
    password='Danielsep2007',
    database='neuropulse_db'
)

cursor = conn.cursor(dictionary=True)

print("="*60)
print("🎵 NEUROPULSE - VISUALIZAÇÃO RÁPIDA")
print("="*60)

# Mostrar tabelas
cursor.execute("SHOW TABLES")
tabelas = cursor.fetchall()

for tabela in tabelas:
    nome = tabela[f"Tables_in_neuropulse_db"]
    cursor.execute(f"SELECT COUNT(*) as total FROM {nome}")
    total = cursor.fetchone()['total']
    print(f"📋 {nome}: {total} registros")
    
    # Mostrar primeiros 3 registros
    cursor.execute(f"SELECT * FROM {nome} LIMIT 3")
    dados = cursor.fetchall()
    
    if dados and len(dados) > 0:
        for registro in dados:
            print(f"   • {registro}")
    print()

conn.close()