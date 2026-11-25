from flask import Flask, render_template, jsonify

app = Flask(__name__)

ECOPONTOS_SUZANO = [
    {
        'id': 1,
        'nome': 'Ecoponto Central Suzano',
        'endereco': 'Av. Antônio Marques Figueira, 1500 - Centro, Suzano',
        'latitude': -23.5432,
        'longitude': -46.3108,
        'materiais': 'Plástico, Papel, Vidro, Metal',
        'horario': 'Seg a Sáb - 08h às 17h'
    },
    {
        'id': 2,
        'nome': 'Ecoponto Parque Max Feffer',
        'endereco': 'Av. Senador Roberto Simonsen, 90 - Jardim Imperador, Suzano',
        'latitude': -23.5519,
        'longitude': -46.3025,
        'materiais': 'Plástico, Metal, Eletrônicos',
        'horario': 'Todos os dias - 07h às 18h'
    },
    {
        'id': 3,
        'nome': 'Cooperativa Recicla Boa Vista',
        'endereco': 'Estrada Santa Mônica, 450 - Cidade Boa Vista, Suzano',
        'latitude': -23.5085,
        'longitude': -46.3190,
        'materiais': 'Papel, Papelão, Plástico, Vidro',
        'horario': 'Seg a Sex - 08h às 16h'
    }
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/ecopontos', methods=['GET'])
def listar_ecopontos():
    return jsonify(ECOPONTOS_SUZANO)

if __name__ == '__main__':
    app.run(debug=True, port=5000)