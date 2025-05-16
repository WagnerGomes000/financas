<?php
require_once '../config/database.php';
header('Content-Type: application/json');

try {
    $dados = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $pdo->prepare("
        INSERT INTO metas (categoria_id, valor_limite, mes_referencia) 
        VALUES (?, ?, ?)
    ");
    
    $stmt->execute([
        $dados['categoria_id'],
        $dados['valor_limite'],
        $dados['mes_referencia']
    ]);

    echo json_encode(['sucesso' => true]);
} catch(PDOException $e) {
    echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
}
?>
