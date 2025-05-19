<?php
require_once '../config/database.php';
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['sucesso' => false, 'erro' => 'Usuário não autenticado']);
    exit;
}

try {
    $dados = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $pdo->prepare("
        INSERT INTO transacoes (descricao, valor, data, categoria_id, tipo, usuario_id) 
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $dados['descricao'],
        $dados['valor'],
        $dados['data'],
        $dados['categoria_id'],
        $dados['tipo'],
        $_SESSION['usuario_id']
    ]);

    echo json_encode(['sucesso' => true, 'mensagem' => 'Transação salva com sucesso']);
} catch(PDOException $e) {
    echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
}
?>
