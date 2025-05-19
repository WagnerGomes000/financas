<?php
require_once 'auth_check.php';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minhas Finanças</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="app-container">
        <!-- Cabeçalho com perfil -->
        <header class="app-header">            <div class="user-profile">
                <div class="user-info">
                    <input type="text" id="user-name" placeholder="Seu nome" value="<?php echo htmlspecialchars($_SESSION['usuario_nome']); ?>" />
                    <span id="user-name-span" style="display:none;"></span>
                    <span id="user-medal" style="display:none;">🏅</span>
                    <a href="logout.php" class="btn-logout" title="Sair">
                        <i class="fas fa-sign-out-alt"></i>
                    </a>
                </div>
            </div>
            <div class="xp-bar-container">
                <div class="xp-bar-bg">
                    <div class="xp-bar-fill" id="xp-bar-fill"></div>
                </div>
                <span id="xp-bar-label">0%</span>
            </div>
        </header>

        <!-- Área principal com conteúdo scrollável -->
        <main class="app-content" id="main-content">
            <!-- A div atual será mostrada/escondida baseada na navegação -->
            <div class="page" id="page-home" data-page="home">
                <div class="resumo">
                    <div class="card saldo">
                        <h3>Saldo Total</h3>
                        <p class="valor" id="saldoTotal">R$ 0,00</p>
                    </div>
                    <div class="card entrada">
                        <h3>Entradas</h3>
                        <p class="valor" id="totalEntradas">R$ 0,00</p>
                    </div>
                    <div class="card saida">
                        <h3>Saídas</h3>
                        <p class="valor" id="totalSaidas">R$ 0,00</p>
                    </div>
                </div>

                <div class="quick-actions">
                    <button onclick="abrirModal('entrada')" class="action-button entrada">
                        <i class="fas fa-plus"></i>
                        <span>Entrada</span>
                    </button>
                    <button onclick="abrirModal('saida')" class="action-button saida">
                        <i class="fas fa-minus"></i>
                        <span>Saída</span>
                    </button>
                </div>

                <div class="recent-transactions">
                    <h2>Últimas Transações</h2>
                    <div id="lista-transacoes"></div>
                </div>
            </div>

            <div class="page" id="page-dashboard" data-page="dashboard" style="display:none;">
                <div class="graficos">
                    <div class="grafico-card">
                        <h3>Gastos por Categoria</h3>
                        <div class="no-data-message" id="no-data-categorias" style="display: none;">
                            <i class="fas fa-chart-pie"></i>
                            <p>Nenhum gasto registrado nos últimos 30 dias</p>
                        </div>
                        <canvas id="grafico-categorias"></canvas>
                    </div>
                    <div class="grafico-card">
                        <h3>Evolução do Saldo</h3>
                        <div class="no-data-message" id="no-data-evolucao" style="display: none;">
                            <i class="fas fa-chart-line"></i>
                            <p>Nenhuma transação registrada nos últimos 30 dias</p>
                        </div>
                        <canvas id="grafico-evolucao"></canvas>
                    </div>
                </div>
            </div>

            <div class="page" id="page-goals" data-page="goals" style="display:none;">
                <div class="page-header">
                    <h2>Metas Mensais</h2>
                    <button onclick="abrirModalMeta()" class="fab-button">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div id="lista-metas"></div>
            </div>            <div class="page" id="page-recurring" data-page="recurring" style="display:none;">
                <div class="page-header">
                    <h2>Despesas Recorrentes</h2>
                    <button onclick="abrirModalDespesa()" class="fab-button">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="resumo-despesas">
                    <div class="card">
                        <h3>Total Despesas Recorrentes</h3>
                        <p class="valor" id="totalDespesasRecorrentes">R$ 0,00</p>
                    </div>
                    <div class="card">
                        <h3>Total Saídas do Mês</h3>
                        <p class="valor" id="totalSaidasMes">R$ 0,00</p>
                    </div>
                </div>
                <div class="secao-despesas">
                    <h3>Despesas Recorrentes</h3>
                    <div id="lista-despesas"></div>
                </div>
                <div class="secao-despesas">
                    <h3>Saídas do Mês</h3>
                    <div id="lista-saidas"></div>
                </div>
            </div>
        </main>

        <!-- Navegação inferior -->
        <nav class="bottom-nav">
            <button class="nav-item active" data-page="home">
                <i class="fas fa-home"></i>
                <span>Início</span>
            </button>
            <button class="nav-item" data-page="dashboard">
                <i class="fas fa-chart-pie"></i>
                <span>Análise</span>
            </button>
            <button class="nav-item" data-page="goals">
                <i class="fas fa-bullseye"></i>
                <span>Metas</span>
            </button>
            <button class="nav-item" data-page="recurring">
                <i class="fas fa-sync"></i>
                <span>Recorrentes</span>
            </button>
        </nav>

        <!-- Modal para nova transação -->
        <div id="modal" class="modal">
            <div class="modal-content">
                <div class="modal-drag-indicator"></div>
                <button class="fechar">&times;</button>
                <h2 id="modal-titulo">Nova Transação</h2>
                <form id="form-transacao">
                    <input type="text" id="descricao" placeholder="Descrição" required>
                    <input type="number" id="valor" placeholder="Valor" step="0.01" required>
                    <input type="date" id="data" required>
                    <select id="categoria" required>
                        <option value="">Selecione uma categoria</option>
                    </select>
                    <input type="hidden" id="tipo">
                    <button type="submit" class="btn-salvar">Salvar</button>
                </form>
            </div>
        </div>        <!-- Modal para nova meta -->
        <div id="modal-meta" class="modal">
            <div class="modal-content">
                <div class="modal-drag-indicator"></div>
                <button class="fechar">&times;</button>
                <h2>Nova Meta de Economia</h2>
                <form id="form-meta">
                    <input type="number" id="valor-economia" placeholder="Quanto deseja economizar?" step="0.01" required>
                    <textarea id="objetivo-meta" placeholder="Qual seu objetivo? (Ex: Comprar um carro, Viagem, etc)" required></textarea>
                    <input type="month" id="mes-referencia" required>
                    <button type="submit" class="btn-salvar">Salvar Meta</button>
                </form>
            </div>
        </div>

        <!-- Modal para nova despesa recorrente -->
        <div id="modal-despesa" class="modal">
            <div class="modal-content">
                <div class="modal-drag-indicator"></div>
                <button class="fechar">&times;</button>
                <h2>Nova Despesa Recorrente</h2>
                <form id="form-despesa">
                    <input type="text" id="descricao-despesa" placeholder="Descrição" required>
                    <input type="number" id="valor-despesa" placeholder="Valor" step="0.01" required>
                    <select id="categoria-despesa" required>
                        <option value="">Selecione uma categoria</option>
                    </select>
                    <input type="number" id="dia-vencimento" placeholder="Dia do Vencimento" min="1" max="31" required>
                    <button type="submit" class="btn-salvar">Salvar Despesa</button>
                </form>
            </div>
        </div>
    </div>    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="js/script.js"></script>
</body>
</html>
