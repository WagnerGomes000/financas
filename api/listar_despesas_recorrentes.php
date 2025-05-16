<?php
require_once '../config/database.php';
header('Content-Type: application/json');

try {
    $stmt = $pdo->query("
        SELECT d.*, c.nome as categoria_nome
        FROM despesas_recorrentes d
        JOIN categorias c ON d.categoria_id = c.id
        ORDER BY d.dia_vencimento
    ");
    $despesas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'sucesso' => true,
        'despesas' => $despesas
    ]);
} catch(PDOException $e) {
    echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
}
?>
