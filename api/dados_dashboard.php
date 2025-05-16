<?php
require_once '../config/database.php';
header('Content-Type: application/json');

try {
    // Buscar dados para os gráficos
    // Gastos por categoria
    $stmt = $pdo->query("
        SELECT c.nome, SUM(t.valor) as total
        FROM transacoes t
        JOIN categorias c ON t.categoria_id = c.id
        WHERE t.tipo = 'saida'
        AND t.data >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY c.id, c.nome
    ");
    $gastosPorCategoria = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Evolução do saldo (últimos 30 dias)
    $stmt = $pdo->query("
        SELECT DATE(data) as dia,
        SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE -valor END) as saldo_dia
        FROM transacoes
        WHERE data >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY DATE(data)
        ORDER BY data
    ");
    $evolucaoSaldo = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'sucesso' => true,
        'gastosPorCategoria' => $gastosPorCategoria,
        'evolucaoSaldo' => $evolucaoSaldo
    ]);
} catch(PDOException $e) {
    echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
}
?>
