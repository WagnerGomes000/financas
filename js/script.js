document.addEventListener('DOMContentLoaded', function() {
    setupNavigation();
    setupModals();
    carregarTransacoes();
    carregarCategorias();
    inicializarGraficos();
    carregarMetas();
    carregarDespesasRecorrentes();
});

// Gerenciamento de Modais
function setupModals() {
    const modals = document.querySelectorAll('.modal');
    
    // Configurar todos os botões de fechar
    document.querySelectorAll('.fechar').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').style.display = 'none';
        });
    });

    // Fechar modal clicando fora
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Gesture handling
        const content = modal.querySelector('.modal-content');
        let startY;
        let currentY;
        let isDragging = false;

        content.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            isDragging = true;
            content.style.transition = 'none';
        });

        content.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            currentY = e.touches[0].clientY;
            const deltaY = currentY - startY;
            
            if (deltaY > 0) { // Só permite arrastar para baixo
                content.style.transform = `translateY(${deltaY}px)`;
            }
        });

        content.addEventListener('touchend', () => {
            isDragging = false;
            content.style.transition = 'transform 0.3s ease-out';
            
            if (currentY && currentY - startY > 100) {
                // Fechar o modal se arrastou suficientemente para baixo
                modal.style.display = 'none';
                content.style.transform = '';
            } else {
                // Voltar à posição original
                content.style.transform = '';
            }
        });
    });
}

function abrirModal(tipo) {
    const modal = document.getElementById('modal');
    document.getElementById('tipo').value = tipo;
    document.getElementById('modal-titulo').textContent = tipo === 'entrada' ? 'Nova Entrada' : 'Nova Saída';
    modal.style.display = 'flex';
    carregarCategorias(tipo);
    
    // Limpar formulário
    document.getElementById('form-transacao').reset();
    
    // Definir data atual como padrão
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('data').value = hoje;
}

function abrirModalMeta() {
    const modal = document.getElementById('modal-meta');
    modal.style.display = 'flex';
    carregarCategorias('saida', 'categoria-meta');
    
    // Limpar e configurar formulário
    document.getElementById('form-meta').reset();
    const mesAtual = new Date().toISOString().slice(0, 7);
    document.getElementById('mes-referencia').value = mesAtual;
}

function abrirModalDespesa() {
    const modal = document.getElementById('modal-despesa');
    modal.style.display = 'flex';
    carregarCategorias('saida', 'categoria-despesa');
    
    // Limpar formulário
    document.getElementById('form-despesa').reset();
}

document.getElementById('form-transacao').onsubmit = function(e) {
    e.preventDefault();
    const dados = {
        descricao: document.getElementById('descricao').value,
        valor: document.getElementById('valor').value,
        data: document.getElementById('data').value,
        categoria_id: document.getElementById('categoria').value,
        tipo: document.getElementById('tipo').value
    };

    fetch('api/salvar_transacao.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
    .then(response => response.json())
    .then(data => {
        if(data.sucesso) {
            document.getElementById('modal').style.display = 'none';
            document.getElementById('form-transacao').reset();
            carregarTransacoes();
        } else {
            alert('Erro ao salvar transação');
        }
    });
};

function carregarTransacoes() {
    fetch('api/listar_transacoes.php')
    .then(response => response.json())
    .then(data => {
        atualizarResumo(data.resumo);
        atualizarListaTransacoes(data.transacoes);
        atualizarBarraExperiencia(data.transacoes); // Atualiza barra XP
    });
}

function carregarCategorias(tipo) {
    const select = document.getElementById('categoria');
    select.innerHTML = '<option value="">Carregando categorias...</option>';
    select.disabled = true;

    fetch(`api/listar_categorias.php?tipo=${tipo}`)
    .then(response => response.json())
    .then(categorias => {
        console.log('Categorias carregadas:', categorias); // Debug
        select.innerHTML = '<option value="">Selecione uma categoria</option>';
        
        if (categorias.length === 0) {
            select.innerHTML += '<option value="" disabled>Nenhuma categoria encontrada</option>';
        } else {
            categorias.forEach(cat => {
                select.innerHTML += `<option value="${cat.id}">${cat.nome}</option>`;
            });
        }
    })
    .catch(error => {
        console.error('Erro ao carregar categorias:', error);
        select.innerHTML = '<option value="">Erro ao carregar categorias</option>';
    })
    .finally(() => {
        select.disabled = false;
    });
}

function atualizarResumo(resumo) {
    document.getElementById('saldoTotal').textContent = formatarMoeda(resumo.saldo);
    document.getElementById('totalEntradas').textContent = formatarMoeda(resumo.entradas);
    document.getElementById('totalSaidas').textContent = formatarMoeda(resumo.saidas);
}

function atualizarListaTransacoes(transacoes) {
    const lista = document.getElementById('lista-transacoes');
    lista.innerHTML = '<h2>Últimas Transferências</h2>'; // Adiciona o título acima da lista

    transacoes.forEach(t => {
        lista.innerHTML += `
            <div class="transacao-item">
                <div>
                    <strong>${t.descricao}</strong>
                    <div>${t.data}</div>
                </div>
                <div style="color: ${t.tipo === 'entrada' ? '#27ae60' : '#c0392b'}">
                    ${t.tipo === 'entrada' ? '+' : '-'} ${formatarMoeda(t.valor)}
                </div>
            </div>
        `;
    });
}

function formatarMoeda(valor) {
    return 'R$ ' + Number(valor).toFixed(2).replace('.', ',');
}

function confirmarLimparDados() {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
        fetch('api/limpar_dados.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na resposta do servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data.sucesso) {
                // Limpar valores na tela
                document.getElementById('saldoTotal').textContent = 'R$ 0,00';
                document.getElementById('totalEntradas').textContent = 'R$ 0,00';
                document.getElementById('totalSaidas').textContent = 'R$ 0,00';
                document.getElementById('lista-transacoes').innerHTML = '';
                alert('Dados limpos com sucesso!');
                // Recarregar os dados
                carregarTransacoes();
            } else {
                console.error('Erro:', data.erro);
                alert('Erro ao limpar dados: ' + data.erro);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao limpar dados. Verifique o console para mais detalhes.');
        });
    }
}

// Função para calcular e atualizar a barra de experiência
function atualizarBarraExperiencia(transacoes) {
    // Agrupa entradas e saídas por data
    const economiaPorDia = {};
    transacoes.forEach(t => {
        const data = t.data;
        if (!economiaPorDia[data]) economiaPorDia[data] = 0;
        if (t.tipo === 'entrada') economiaPorDia[data] += Number(t.valor);
        if (t.tipo === 'saida') economiaPorDia[data] -= Number(t.valor);
    });
    // Considera apenas o dia atual
    const hoje = new Date().toISOString().slice(0, 10);
    const economiaHoje = economiaPorDia[hoje] || 0;
    // Para cada R$ 20 economizados, aumenta a barra
    let progresso = Math.min(100, Math.floor((economiaHoje / 20) * 20));
    if (progresso < 0) progresso = 0;
    // Atualiza barra
    const xpBar = document.getElementById('xp-bar-fill');
    const xpLabel = document.getElementById('xp-bar-label');
    if (xpBar && xpLabel) {
        xpBar.style.width = progresso + '%';
        xpLabel.textContent = progresso + '%';
    }
    // Exibe medalha se completou 100%
    const medal = document.getElementById('user-medal');
    if (medal) {
        if (progresso >= 100) {
            medal.style.display = 'inline-block';
        } else {
            medal.style.display = 'none';
        }
    }
}

// Função para atualizar a foto do usuário na NavBar
const userPhotoInput = document.getElementById('user-photo');
const userPhotoPreview = document.getElementById('user-photo-preview');
const userNameInput = document.getElementById('user-name');
let userNameSpan;

// Restaurar nome e imagem do localStorage
const savedName = localStorage.getItem('userName');
const savedPhoto = localStorage.getItem('userPhoto');
if (userNameInput) {
    // Cria o span para exibir o nome
    userNameSpan = document.createElement('span');
    userNameSpan.id = 'user-name-span';
    userNameSpan.style.display = 'none';
    userNameSpan.style.cursor = 'pointer';
    userNameInput.parentNode.appendChild(userNameSpan);

    if (savedName) {
        userNameInput.value = savedName;
        userNameSpan.textContent = savedName;
        userNameInput.style.display = 'none';
        userNameSpan.style.display = 'inline-block';
    }
}
if (userPhotoPreview && savedPhoto) {
    userPhotoPreview.src = savedPhoto;
}

if (userPhotoInput && userPhotoPreview) {
    userPhotoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                userPhotoPreview.src = evt.target.result;
                localStorage.setItem('userPhoto', evt.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
}

// Lógica para esconder a TextBox e mostrar o nome
if (userNameInput) {
    userNameInput.addEventListener('blur', function() {
        if (userNameInput.value.trim() !== '') {
            userNameSpan.textContent = userNameInput.value;
            userNameInput.style.display = 'none';
            userNameSpan.style.display = 'inline-block';
            localStorage.setItem('userName', userNameInput.value);
        }
    });
    userNameSpan && userNameSpan.addEventListener('click', function() {
        userNameSpan.style.display = 'none';
        userNameInput.style.display = 'inline-block';
        userNameInput.focus();
    });
}

// Variáveis para os gráficos
let graficoCategoria;
let graficoEvolucao;

function inicializarGraficos() {
    const ctxCategorias = document.getElementById('grafico-categorias').getContext('2d');
    const ctxEvolucao = document.getElementById('grafico-evolucao').getContext('2d');

    graficoCategoria = new Chart(ctxCategorias, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#2ecc71',
                    '#3498db',
                    '#9b59b6',
                    '#f1c40f',
                    '#e74c3c',
                    '#1abc9c'
                ]
            }]
        }
    });

    graficoEvolucao = new Chart(ctxEvolucao, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Saldo',
                data: [],
                borderColor: '#2ecc71',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function atualizarDashboard() {    fetch('api/dados_dashboard.php')
        .then(response => response.json())
        .then(data => {
            if (data.sucesso) {
                // Atualizar gráfico de categorias
                graficoCategoria.data.labels = data.gastosPorCategoria.map(item => item.nome);
                graficoCategoria.data.datasets[0].data = data.gastosPorCategoria.map(item => item.total);
                graficoCategoria.update();

                // Atualizar gráfico de evolução
                graficoEvolucao.data.labels = data.evolucaoSaldo.map(item => item.dia);
                graficoEvolucao.data.datasets[0].data = data.evolucaoSaldo.map(item => item.saldo_dia);
                graficoEvolucao.update();
            }
        });
}

document.getElementById('form-meta').onsubmit = function(e) {
    e.preventDefault();
    const dados = {
        categoria_id: document.getElementById('categoria-meta').value,
        valor_limite: document.getElementById('valor-limite').value,
        mes_referencia: document.getElementById('mes-referencia').value + '-01'
    };

    fetch('api/salvar_meta.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
    .then(response => response.json())
    .then(data => {
        if (data.sucesso) {
            document.getElementById('modal-meta').style.display = 'none';
            document.getElementById('form-meta').reset();
            carregarMetas();
        }
    });
};

document.getElementById('form-despesa').onsubmit = function(e) {
    e.preventDefault();
    const dados = {
        descricao: document.getElementById('descricao-despesa').value,
        valor: document.getElementById('valor-despesa').value,
        categoria_id: document.getElementById('categoria-despesa').value,
        dia_vencimento: document.getElementById('dia-vencimento').value
    };

    fetch('api/salvar_despesa_recorrente.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
    .then(response => response.json())
    .then(data => {
        if (data.sucesso) {
            document.getElementById('modal-despesa').style.display = 'none';
            document.getElementById('form-despesa').reset();
            carregarDespesasRecorrentes();
        }
    });
};

function carregarMetas() {
    fetch('api/listar_metas.php')
        .then(response => response.json())
        .then(data => {
            if (data.sucesso) {
                const listaMetas = document.getElementById('lista-metas');
                listaMetas.innerHTML = '';
                
                data.metas.forEach(meta => {
                    const progresso = meta.valor_atual ? (meta.valor_atual / meta.valor_limite * 100) : 0;
                    const progressoClass = progresso >= 80 ? 'progress-danger' : 
                                        progresso >= 60 ? 'progress-warning' : '';
                    
                    listaMetas.innerHTML += `
                        <div class="meta-item">
                            <div>
                                <strong>${meta.categoria_nome}</strong>
                                <div>Meta: ${formatarMoeda(meta.valor_limite)}</div>
                                <div>Atual: ${formatarMoeda(meta.valor_atual || 0)}</div>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill ${progressoClass}" 
                                     style="width: ${Math.min(progresso, 100)}%"></div>
                            </div>
                        </div>
                    `;
                });
            }
        });
}

function carregarDespesasRecorrentes() {
    fetch('api/listar_despesas_recorrentes.php')
        .then(response => response.json())
        .then(data => {
            if (data.sucesso) {
                const listaDespesas = document.getElementById('lista-despesas');
                listaDespesas.innerHTML = '';
                
                data.despesas.forEach(despesa => {
                    const dataVencimento = new Date();
                    dataVencimento.setDate(despesa.dia_vencimento);
                    const hoje = new Date();
                    const diasRestantes = dataVencimento.getDate() - hoje.getDate();
                    
                    let statusClass = '';
                    if (diasRestantes <= 3 && diasRestantes >= 0) {
                        statusClass = 'status-warning';
                    } else if (diasRestantes < 0) {
                        statusClass = 'status-danger';
                    }
                    
                    listaDespesas.innerHTML += `
                        <div class="despesa-item ${statusClass}">
                            <div>
                                <strong>${despesa.descricao}</strong>
                                <div>Categoria: ${despesa.categoria_nome}</div>
                                <div>Valor: ${formatarMoeda(despesa.valor)}</div>
                            </div>
                            <div>
                                <div class="vencimento">Dia ${despesa.dia_vencimento}</div>
                            </div>
                        </div>
                    `;
                });
            }
        });
}

// Navegação
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetPage = item.dataset.page;
            
            // Atualizar navegação
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Mostrar página correta
            pages.forEach(page => {
                if (page.dataset.page === targetPage) {
                    page.style.display = 'block';
                    if (targetPage === 'dashboard') {
                        atualizarDashboard();
                    }
                } else {
                    page.style.display = 'none';
                }
            });
        });
    });
}
