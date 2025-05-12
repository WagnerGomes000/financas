<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minhas Finanças</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <header>
            <h1>Minhas Finanças</h1>
        </header>

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

        <div class="acoes">
            <button onclick="abrirModal('entrada')" class="btn-entrada">Nova Entrada</button>
            <button onclick="abrirModal('saida')" class="btn-saida">Nova Saída</button>
            <button onclick="confirmarLimparDados()" class="btn-limpar">Limpar Dados</button>
        </div>

        <div class="transacoes">
            <h2>Últimas Transações</h2>
            <div id="lista-transacoes"></div>
        </div>
    </div>

    <!-- Modal para nova transação -->
    <div id="modal" class="modal">
        <div class="modal-content">
            <span class="fechar">&times;</span>
            <h2 id="modal-titulo">Nova Transação</h2>
            <form id="form-transacao">
                <input type="text" id="descricao" placeholder="Descrição" required>
                <input type="number" id="valor" placeholder="Valor" step="0.01" required>
                <input type="date" id="data" required>
                <select id="categoria" required></select>
                <input type="hidden" id="tipo">
                <button type="submit" class="btn-salvar">Salvar</button>
            </form>
        </div>
    </div>

    <script src="js/script.js"></script>
</body>
</html>
