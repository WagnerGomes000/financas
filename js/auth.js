// Alternar entre formulários de login e registro
function toggleForms() {
    const loginBox = document.getElementById('login-box');
    const registroBox = document.getElementById('registro-box');
    
    if (loginBox.style.display === 'none') {
        loginBox.style.display = 'block';
        registroBox.style.display = 'none';
    } else {
        loginBox.style.display = 'none';
        registroBox.style.display = 'block';
    }
}

// Formulário de Login
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const dados = {
        email: document.getElementById('login-email').value,
        senha: document.getElementById('login-senha').value
    };
      fetch('api/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
    .then(response => response.json())    .then(data => {
        if (data.sucesso) {
            // Limpar qualquer dado antigo do localStorage
            localStorage.clear();
            // Armazenar dados do usuário
            localStorage.setItem('usuario_nome', data.nome);
            window.location.href = 'index.php';
        } else {
            alert(data.erro);
        }
    })
    .catch(error => {
        alert('Erro ao fazer login. Tente novamente.');
    });
});

// Formulário de Registro
document.getElementById('registro-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const senha = document.getElementById('registro-senha').value;
    const confirmarSenha = document.getElementById('registro-confirmar-senha').value;
    
    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem');
        return;
    }
    
    const dados = {
        nome: document.getElementById('registro-nome').value,
        email: document.getElementById('registro-email').value,
        senha: senha
    };
    
    fetch('api/registro.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
    .then(response => response.json())
    .then(data => {
        if (data.sucesso) {
            window.location.href = 'index.php';
        } else {
            alert(data.erro);
        }
    })
    .catch(error => {
        alert('Erro ao fazer cadastro. Tente novamente.');
    });
});
