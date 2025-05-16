<?php
require_once '../config/database.php';
header('Content-Type: application/json');

try {
    $dados = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $pdo->prepare("
        INSERT INTO despesas_recorrentes (descricao, valor, categoria_id, dia_vencimento) 
        VALUES (?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $dados['descricao'],
        $dados['valor'],
        $dados['categoria_id'],
        $dados['dia_vencimento']
    ]);

    echo json_encode(['sucesso' => true]);
} catch(PDOException $e) {
    echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
}
?>
