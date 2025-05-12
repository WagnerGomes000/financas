document.addEventListener('DOMContentLoaded', function() {
    carregarTransacoes();
    carregarCategorias();
});

function abrirModal(tipo) {
    document.getElementById('modal').style.display = 'block';
    document.getElementById('tipo').value = tipo;
    document.getElementById('modal-titulo').textContent = tipo === 'entrada' ? 'Nova Entrada' : 'Nova Saída';
    carregarCategorias(tipo); // Modificado para passar o tipo
}

document.querySelector('.fechar').onclick = function() {
    document.getElementById('modal').style.display = 'none';
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
