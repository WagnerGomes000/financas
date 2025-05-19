<?php
require_once '../config/database.php';
session_start();
header('Content-Type: application/json');

try {
    $dados = json_decode(file_get_contents('php://input'), true);
    
    // Validar email
    if (!filter_var($dados['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('E-mail inválido');
    }
    
    // Verificar se email já existe
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->execute([$dados['email']]);
    if ($stmt->rowCount() > 0) {
        throw new Exception('E-mail já cadastrado');
    }
    
    // Validar senha
    if (strlen($dados['senha']) < 6) {
        throw new Exception('A senha deve ter pelo menos 6 caracteres');
    }
    
    // Hash da senha
    $senha_hash = password_hash($dados['senha'], PASSWORD_DEFAULT);
    
    // Inserir usuário
    $stmt = $pdo->prepare("
        INSERT INTO usuarios (nome, email, senha) 
        VALUES (?, ?, ?)
    ");
    
    $stmt->execute([
        $dados['nome'],
        $dados['email'],
        $senha_hash
    ]);
    
    $usuario_id = $pdo->lastInsertId();
      // Criar sessão
    $_SESSION['usuario_id'] = $usuario_id;
    $_SESSION['usuario_nome'] = $dados['nome'];
    
    // Adicionar 5% de XP inicial
    $xpInicial = 5; // 5% do XP necessário para o nível 1
    $_SESSION['xp_inicial'] = $xpInicial;
    
    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Cadastro realizado com sucesso',
        'xp_inicial' => $xpInicial
    ]);
    
} catch(Exception $e) {
    http_response_code(400);
    echo json_encode([
        'sucesso' => false,
        'erro' => $e->getMessage()
    ]);
}
