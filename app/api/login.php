<?php
require_once '../config/database.php';
session_start();
header('Content-Type: application/json');

try {
    $dados = json_decode(file_get_contents('php://input'), true);
    $stmt = $pdo->prepare("
        SELECT id, nome, senha
        FROM usuarios 
        WHERE email = ?
    ");
    
    $stmt->execute([$dados['email']]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$usuario || !password_verify($dados['senha'], $usuario['senha'])) {
        throw new Exception('E-mail ou senha incorretos');
    }
    
    // Criar sessão
    $_SESSION['usuario_id'] = $usuario['id'];
    $_SESSION['usuario_nome'] = $usuario['nome'];

    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Login realizado com sucesso',
        'nome' => $usuario['nome']
    ]);
    
} catch(Exception $e) {
    http_response_code(401);
    echo json_encode([
        'sucesso' => false,
        'erro' => $e->getMessage()
    ]);
}
