<?php
require_once '../config/database.php';
header('Content-Type: application/json');

try {
    $dados = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $pdo->prepare("
        INSERT INTO transacoes (descricao, valor, data, categoria_id, tipo) 
        VALUES (?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $dados['descricao'],
        $dados['valor'],
        $dados['data'],
        $dados['categoria_id'],
        $dados['tipo']
    ]);

    echo json_encode(['sucesso' => true, 'mensagem' => 'Transação salva com sucesso']);
} catch(PDOException $e) {
    echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
}
?>
