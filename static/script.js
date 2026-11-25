let map;
let markers = [];

const ECOPONTOS_SUZANO = [
    {
        nome: 'Ecoponto Central Suzano',
        endereco: 'Av. Antônio Marques Figueira, 1500 - Centro, Suzano',
        latitude: -23.5432,
        longitude: -46.3108,
        materiais: 'Plástico, Papel, Vidro, Metal',
        horario: 'Seg a Sáb - 08h às 17h'
    },
    {
        nome: 'Ecoponto Parque Max Feffer',
        endereco: 'Av. Senador Roberto Simonsen, 90 - Jardim Imperador, Suzano',
        latitude: -23.5519,
        longitude: -46.3025,
        materiais: 'Plástico, Metal, Eletrônicos',
        horario: 'Todos os dias - 07h às 18h'
    },
    {
        nome: 'Cooperativa Recicla Boa Vista',
        endereco: 'Estrada Santa Mônica, 450 - Cidade Boa Vista, Suzano',
        latitude: -23.5085,
        longitude: -46.3190,
        materiais: 'Papel, Papelão, Plástico, Vidro',
        horario: 'Seg a Sex - 08h às 16h'
    },
    {
        nome: 'Ecoponto Palmeiras',
        endereco: 'Rod. Índio Tibiriçá, km 58 - Palmeiras de São Paulo, Suzano',
        latitude: -23.6284,
        longitude: -46.3312,
        materiais: 'Plástico, Metal, Papel, Vidro, Eletrônico',
        horario: 'Seg a Sáb - 08h às 17h'
    },
    {
        nome: 'Ponto de Entrega Voluntária (PEV) Suzano Shopping',
        endereco: 'Rua Sete de Setembro, 555 - Parque Suzano, Suzano',
        latitude: -23.5358,
        longitude: -46.3119,
        materiais: 'Plástico, Metal, Eletrônico',
        horario: 'Todos os dias - 10h às 22h'
    }
];

const FATORES_IMPACTO = {
    'Plástico': {
        co2: 1.5,
        pesoUnitarioPadrao: 0.05,
        dica: '💡 Esvazie o líquido, amasse a garrafa e feche com a tampa para facilitar a triagem.'
    },
    'Metal': {
        co2: 9.0,
        pesoUnitarioPadrao: 0.015,
        dica: '💡 Amasse as latas de alumínio para reduzir o volume. O metal é 100% reciclável!'
    },
    'Papel': {
        co2: 1.2,
        pesoUnitarioPadrao: 0.25,
        dica: '💡 Desmonte caixas de papelão e mantenha o papel seco e sem gordura.'
    },
    'Vidro': {
        co2: 0.3,
        pesoUnitarioPadrao: 0.35,
        dica: '💡 Retire tampas metálicas ou plásticas e enxágue bem antes de entregar.'
    },
    'Eletrônico': {
        co2: 5.0,
        pesoUnitarioPadrao: 0.40,
        dica: '💡 Nunca descarte no lixo comum! Leve a um ecoponto especializado em REEE.'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    iniciarMapa();
    renderizarMarcadores('Todos');
    configurarSimulador();
    iniciarAnimacoesScroll();
});

function iniciarAnimacoesScroll() {
    const elementos = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    elementos.forEach(el => observer.observe(el));
}

function iniciarMapa() {
    map = L.map('map').setView([-23.5432, -46.3108], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);
}

function renderizarMarcadores(filtro) {
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    ECOPONTOS_SUZANO.forEach(p => {
        if (filtro === 'Todos' || p.materiais.includes(filtro)) {
            const marcador = L.marker([p.latitude, p.longitude])
                .addTo(map)
                .bindPopup(`<b>${p.nome}</b><br>${p.endereco}<br><small><b>Aceita:</b> ${p.materiais}<br><b>Horário:</b> ${p.horario}</small>`);
            markers.push(marcador);
        }
    });
}

const filtroSelect = document.getElementById('filtro-mapa');
if (filtroSelect) {
    filtroSelect.addEventListener('change', (e) => {
        renderizarMarcadores(e.target.value);
    });
}

function configurarSimulador() {
    const selMat = document.getElementById('sim-material');
    const inpQtd = document.getElementById('sim-qtd');
    const inpPesoUnit = document.getElementById('sim-peso-unit');
    const elCo2 = document.getElementById('sim-co2');

    if (!selMat || !inpQtd || !inpPesoUnit) return;

    function calcular() {
        const mat = selMat.value;
        const qtd = Math.max(0, parseFloat(inpQtd.value) || 0);
        const pesoUnit = Math.max(0, parseFloat(inpPesoUnit.value) || 0);
        const info = FATORES_IMPACTO[mat];

        const pesoTotal = qtd * pesoUnit;
        const totalCo2 = pesoTotal * info.co2;
        const kmCarro = Math.round(totalCo2 * 5);

        document.getElementById('sim-peso-total').textContent = `${pesoTotal.toFixed(2)} kg`;
        elCo2.textContent = `${totalCo2.toFixed(2)} kg de CO₂`;
        document.getElementById('sim-dica').textContent = info.dica;
        document.getElementById('sim-equivalente').textContent =
            `Equivale a aproximadamente ${kmCarro} km não rodados por um carro a combustão.`;

        elCo2.style.transform = 'scale(1.06)';
        setTimeout(() => {
            elCo2.style.transform = 'scale(1)';
        }, 160);
    }

    selMat.addEventListener('change', () => {
        const info = FATORES_IMPACTO[selMat.value];
        inpPesoUnit.value = info.pesoUnitarioPadrao;
        calcular();
    });

    inpQtd.addEventListener('input', calcular);
    inpPesoUnit.addEventListener('input', calcular);

    calcular();
}