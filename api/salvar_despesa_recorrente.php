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
        INSERT INTO despesas_recorrentes (descricao, valor, categoria_id, dia_vencimento, usuario_id) 
        VALUES (?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $dados['descricao'],
        $dados['valor'],
        $dados['categoria_id'],
        $dados['dia_vencimento'],
        $_SESSION['usuario_id']
    ]);

    echo json_encode(['sucesso' => true]);
} catch(PDOException $e) {
    echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
}
?>
