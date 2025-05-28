<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Minhas Finanças</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body class="auth-page">
    <div class="auth-container">
        <div class="auth-box" id="login-box">
            <div class="auth-header">
                <h1>💸 Nubance</h1>
                <p>Faça login para acessar suas finanças</p>
            </div>
            <form id="login-form" class="auth-form">
                <div class="form-group">
                    <input type="email" id="login-email" placeholder="E-mail" required>
                </div>
                <div class="form-group">
                    <input type="password" id="login-senha" placeholder="Senha" required>
                </div>
                <button type="submit" class="btn-auth">Entrar</button>
            </form>
            <p class="auth-link">
                Não tem uma conta? <a href="#" onclick="toggleForms()">Cadastre-se</a>
            </p>
        </div>

        <div class="auth-box" id="registro-box" style="display: none;">
            <div class="auth-header">
                <h1>💸 Nubance</h1>
                <p>Crie sua conta</p>
            </div>
            <form id="registro-form" class="auth-form">
                <div class="form-group">
                    <input type="text" id="registro-nome" placeholder="Nome completo" required>
                </div>
                <div class="form-group">
                    <input type="email" id="registro-email" placeholder="E-mail" required>
                </div>
                <div class="form-group">
                    <input type="password" id="registro-senha" placeholder="Senha" required>
                </div>
                <div class="form-group">
                    <input type="password" id="registro-confirmar-senha" placeholder="Confirmar senha" required>
                </div>
                <button type="submit" class="btn-auth">Cadastrar</button>
            </form>
            <p class="auth-link">
                Já tem uma conta? <a href="#" onclick="toggleForms()">Faça login</a>
            </p>
        </div>
    </div>
    <script src="js/auth.js"></script>
</body>
</html>
