<?php
require_once '../config/database.php';
header('Content-Type: application/json');

try {
    $stmt = $pdo->query("
        SELECT m.*, c.nome as categoria_nome,
        (SELECT SUM(valor) FROM transacoes t 
         WHERE t.categoria_id = m.categoria_id 
         AND MONTH(t.data) = MONTH(m.mes_referencia)
         AND YEAR(t.data) = YEAR(m.mes_referencia)
         AND t.tipo = 'saida') as valor_atual
        FROM metas m
        JOIN categorias c ON m.categoria_id = c.id
        WHERE m.mes_referencia >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
        ORDER BY m.mes_referencia DESC
    ");
    $metas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'sucesso' => true,
        'metas' => $metas
    ]);
} catch(PDOException $e) {
    echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
}
?>
