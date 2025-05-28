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
        INSERT INTO metas (valor_economia, objetivo, mes_referencia, usuario_id) 
        VALUES (?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $dados['valor_economia'],
        $dados['objetivo'],
        $dados['mes_referencia'],
        $_SESSION['usuario_id']
    ]);

    echo json_encode(['sucesso' => true]);
} catch(PDOException $e) {
    echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
}
?>
