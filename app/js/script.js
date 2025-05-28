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
    .then((data) => {
        atualizarResumo(data.resumo);
        atualizarListaTransacoes(data.transacoes);
        atualizarBarraExperiencia(data.transacoes); // Atualiza barra XP
    });
}

function carregarCategorias(tipo, selectId = 'categoria') {
    const select = document.getElementById(selectId);
    if (!select) return; // Se o elemento não existir, sai da função
    
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

function formatarData(data) {
    const dt = new Date(data);
    return dt.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function formatarDataMes(data) {
    const dt = new Date(data);
    return dt.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
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
async function atualizarBarraExperiencia(transacoes) {
    try {
        // Recupera o nível atual e XP do localStorage
        let nivel = parseInt(localStorage.getItem('userLevel')) || 1;
        let xpAcumulado = parseInt(localStorage.getItem('userXP')) || 0;
        
        // Verifica se é primeiro acesso (usuário novo)
        const xpInicial = localStorage.getItem('xpInicial');
        if (xpInicial && !localStorage.getItem('xpInicialAplicado')) {
            xpAcumulado = parseInt(xpInicial);
            localStorage.setItem('xpInicialAplicado', 'true');
        }
        
        // Agrupa transações por semana
        const economiaPorSemana = {};
        const hoje = new Date();
        transacoes.forEach(t => {
            const data = new Date(t.data);
            const semana = getWeekNumber(data);
            if (!economiaPorSemana[semana]) economiaPorSemana[semana] = 0;
            if (t.tipo === 'entrada') economiaPorSemana[semana] += Number(t.valor);
            if (t.tipo === 'saida') economiaPorSemana[semana] -= Number(t.valor);
        });
        
        // Verifica semanas consecutivas e XP semanal
        const semanaAtual = getWeekNumber(hoje);
        const economiaDestaSemana = economiaPorSemana[semanaAtual] || 0;
        const ultimaSemanaComEconomia = localStorage.getItem('ultimaSemanaEconomia');
        const semanasConsecutivas = parseInt(localStorage.getItem('semanasConsecutivas')) || 0;
        
        if (ultimaSemanaComEconomia) {
            const ultimaSemana = parseInt(ultimaSemanaComEconomia);
            if (ultimaSemana < semanaAtual - 1) {
                // Zera o XP e as semanas consecutivas se passou uma semana sem economizar
                xpAcumulado = 0;
                localStorage.setItem('semanasConsecutivas', '0');
                mostrarMensagemPenalidade();
            } else if (ultimaSemana === semanaAtual - 1 && economiaDestaSemana > 0) {
                // Incrementa semanas consecutivas se economizou na semana anterior e atual
                const novasSemanasConsecutivas = semanasConsecutivas + 1;
                localStorage.setItem('semanasConsecutivas', novasSemanasConsecutivas.toString());
            }
        }

        try {
            // Busca meta atual do usuário
            const response = await fetch('api/listar_metas.php');
            const data = await response.json();
            
            if (data.sucesso && data.metas.length > 0) {
                const metaAtual = data.metas[0];
                  if (economiaDestaSemana > 0) {
                    // 10% do valor economizado em relação à meta vira XP
                    const percentualMeta = (economiaDestaSemana / metaAtual.valor_economia) * 100;
                    const xpMeta = Math.floor(percentualMeta * 0.1 * 100);
                    
                    // Bônus semanal fixo por economizar
                    const xpSemanal = 50;
                    
                    // Adiciona XP total
                    xpAcumulado += (xpMeta + xpSemanal);
                    
                    // Atualiza última semana com economia
                    localStorage.setItem('ultimaSemanaEconomia', semanaAtual.toString());
                }
            }
            
            // XP necessário aumenta a cada nível
            const xpNecessario = 100 * Math.pow(1.5, nivel - 1);
            
            // Verifica se subiu de nível
            while (xpAcumulado >= xpNecessario) {
                xpAcumulado -= xpNecessario;
                nivel++;
                mostrarMensagemNivel(nivel);
            }
            
            // Calcula o progresso em porcentagem
            const progresso = Math.min(100, Math.floor((xpAcumulado / xpNecessario) * 100));
            
            // Atualiza barra
            const xpBar = document.getElementById('xp-bar-fill');
            const xpLabel = document.getElementById('xp-bar-label');
            if (xpBar && xpLabel) {
                xpBar.style.width = progresso + '%';
                xpLabel.textContent = `Nível ${nivel} - ${progresso}%`;
            }
            
            // Atualiza medalha com o nível atual
            const medal = document.getElementById('user-medal');
            if (medal) {
                medal.style.display = 'inline-block';
                medal.textContent = `🏆 ${nivel}`;
                medal.style.fontSize = '1.2em';
            }
            
            // Salva progresso
            localStorage.setItem('userLevel', nivel);
            localStorage.setItem('userXP', xpAcumulado);
            
        } catch (error) {
            console.error('Erro ao atualizar XP:', error);
        }
        
    } catch (error) {
        console.error('Erro ao processar barra de XP:', error);
    }
}

function mostrarMensagemNivel(nivel) {
    const mensagem = document.createElement('div');
    mensagem.className = 'level-up-message';
    mensagem.innerHTML = `
        <div class="level-up-content">
            <div class="level-up-icon">🎉</div>
            <div class="level-up-text">
                <h3>Nível ${nivel} Alcançado!</h3>
                <p>Continue economizando para subir mais níveis!</p>
            </div>
        </div>
    `;
    document.body.appendChild(mensagem);
    
    // Remove a mensagem após 3 segundos
    setTimeout(() => {
        mensagem.classList.add('level-up-hide');
        setTimeout(() => mensagem.remove(), 500);
    }, 3000);
}

const userNameInput = document.getElementById('user-name');
let userNameSpan;

// Configurar nome do usuário
if (userNameInput) {
    userNameSpan = document.createElement('span');
    userNameSpan.id = 'user-name-span';
    userNameSpan.style.display = 'none';
    userNameSpan.style.cursor = 'pointer';
    userNameInput.parentNode.appendChild(userNameSpan);

    const savedName = userNameInput.value;
    if (savedName) {
        userNameSpan.textContent = savedName;
        userNameInput.style.display = 'none';
        userNameSpan.style.display = 'inline-block';
    }
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
                const temDadosCategorias = data.gastosPorCategoria && data.gastosPorCategoria.length > 0;
                document.getElementById('no-data-categorias').style.display = temDadosCategorias ? 'none' : 'flex';
                document.getElementById('grafico-categorias').style.display = temDadosCategorias ? 'block' : 'none';
                
                if (temDadosCategorias) {
                    graficoCategoria.data.labels = data.gastosPorCategoria.map(item => item.nome);
                    graficoCategoria.data.datasets[0].data = data.gastosPorCategoria.map(item => item.total);
                    graficoCategoria.update();
                }

                // Atualizar gráfico de evolução
                const temDadosEvolucao = data.evolucaoSaldo && data.evolucaoSaldo.length > 0;
                document.getElementById('no-data-evolucao').style.display = temDadosEvolucao ? 'none' : 'flex';
                document.getElementById('grafico-evolucao').style.display = temDadosEvolucao ? 'block' : 'none';
                
                if (temDadosEvolucao) {
                    graficoEvolucao.data.labels = data.evolucaoSaldo.map(item => item.dia);
                    graficoEvolucao.data.datasets[0].data = data.evolucaoSaldo.map(item => item.saldo_dia);
                    graficoEvolucao.update();
                }
            }
        });
}

document.getElementById('form-meta').onsubmit = function(e) {
    e.preventDefault();
    
    // Validação dos campos
    const valorEconomia = document.getElementById('valor-economia').value;
    const objetivo = document.getElementById('objetivo-meta').value;
    const mesReferencia = document.getElementById('mes-referencia').value;
    
    if (!valorEconomia || valorEconomia <= 0) {
        alert('Por favor, insira um valor válido para a meta de economia');
        return;
    }
    
    if (!objetivo) {
        alert('Por favor, insira um objetivo para sua meta');
        return;
    }
    
    if (!mesReferencia) {
        alert('Por favor, selecione o mês de referência');
        return;
    }
    
    const dados = {
        valor_economia: valorEconomia,
        objetivo: objetivo,
        mes_referencia: mesReferencia + '-01'
    };

    console.log('Enviando dados da meta:', dados);

    fetch('api/salvar_meta.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na resposta do servidor');
        }
        return response.json();
    })
    .then(data => {
        console.log('Resposta do servidor:', data);
        if (data.sucesso) {
            document.getElementById('modal-meta').style.display = 'none';
            document.getElementById('form-meta').reset();
            carregarMetas();
            alert('Meta criada com sucesso!');
        } else {
            alert(data.erro || 'Erro ao salvar a meta. Tente novamente.');
        }
    })
    .catch(error => {
        console.error('Erro ao salvar meta:', error);
        alert('Erro ao salvar a meta. Verifique o console para mais detalhes.');
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
                
                if (data.metas.length === 0) {
                    listaMetas.innerHTML = `
                        <div class="no-metas-message">
                            <i class="fas fa-piggy-bank"></i>
                            <p>Você ainda não possui metas mensais...</p>
                            <p>Que tal criar uma meta de economia? Isso vai te ajudar a alcançar seus objetivos financeiros! 🎯</p>
                            <button onclick="abrirModalMeta()" class="btn-criar-meta">
                                Criar Minha Primeira Meta
                            </button>
                        </div>
                    `;
                    return;
                }
                
                data.metas.forEach(meta => {
                    const economiaMes = meta.valor_atual || 0;
                    const progresso = (economiaMes / meta.valor_economia) * 100;
                    
                    // Classes para o progresso baseadas na economia
                    let progressoClass, statusText;
                    if (progresso >= 100) {
                        progressoClass = 'progress-success';
                        statusText = 'Meta atingida! 🎉';
                    } else if (progresso >= 70) {
                        progressoClass = 'progress-warning';
                        statusText = 'Quase lá!';
                    } else {
                        progressoClass = '';
                        statusText = 'Em progresso';
                    }
                    
                    listaMetas.innerHTML += `
                        <div class="meta-item">
                            <div class="meta-header">
                                <strong>${meta.objetivo}</strong>
                                <span class="meta-status">${statusText}</span>
                            </div>
                            <div class="meta-info">
                                <div class="meta-mes">${formatarDataMes(meta.mes_referencia)}</div>
                                <div class="meta-valores">
                                    <div>Meta: ${formatarMoeda(meta.valor_economia)}</div>
                                    <div>Economizado: ${formatarMoeda(economiaMes)}</div>
                                </div>
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
                // Atualizar totais
                document.getElementById('totalDespesasRecorrentes').textContent = formatarMoeda(data.totalDespesasRecorrentes);
                document.getElementById('totalSaidasMes').textContent = formatarMoeda(data.totalSaidasMes);
                
                // Atualizar lista de despesas recorrentes
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
                        <div class="lista-item ${statusClass}">
                            <div class="detalhes">
                                <strong>${despesa.descricao}</strong>
                                <div>Categoria: ${despesa.categoria_nome}</div>
                                <div class="vencimento">Vencimento: Dia ${despesa.dia_vencimento}</div>
                            </div>
                            <div class="valor">${formatarMoeda(despesa.valor)}</div>
                        </div>
                    `;
                });
                
                // Atualizar lista de saídas
                const listaSaidas = document.getElementById('lista-saidas');
                listaSaidas.innerHTML = '';
                
                data.saidas.forEach(saida => {
                    listaSaidas.innerHTML += `
                        <div class="lista-item">
                            <div class="detalhes">
                                <strong>${saida.descricao}</strong>
                                <div>Categoria: ${saida.categoria_nome}</div>
                                <div class="data">${formatarData(saida.data)}</div>
                            </div>
                            <div class="valor">${formatarMoeda(saida.valor)}</div>
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
                        // Limpar os gráficos antes de atualizar
                        if (graficoCategoria) {
                            graficoCategoria.clear();
                        }
                        if (graficoEvolucao) {
                            graficoEvolucao.clear();
                        }
                        atualizarDashboard();
                    }
                } else {
                    page.style.display = 'none';
                }
            });
        });
    });
}

// Função para obter o número da semana de uma data
function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
}

// Função para mostrar mensagem de penalidade
function mostrarMensagemPenalidade() {
    const mensagem = document.createElement('div');
    mensagem.className = 'level-up-message penalty';
    mensagem.innerHTML = `
        <div class="level-up-content">
            <div class="level-up-icon">⚠️</div>
            <div class="level-up-text">
                <h3>Experiência Zerada!</h3>
                <p>Você ficou uma semana sem economizar. Continue economizando para recuperar seu progresso!</p>
            </div>
        </div>
    `;
    document.body.appendChild(mensagem);
    
    setTimeout(() => {
        mensagem.classList.add('level-up-hide');
        setTimeout(() => mensagem.remove(), 500);
    }, 3000);
}
