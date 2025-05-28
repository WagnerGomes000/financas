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
    // Buscar dados para os gráficos
    // Gastos por categoria
    $stmt = $pdo->prepare("
        SELECT c.nome, SUM(t.valor) as total
        FROM transacoes t
        JOIN categorias c ON t.categoria_id = c.id
        WHERE t.tipo = 'saida'
        AND t.data >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        AND t.usuario_id = ?
        GROUP BY c.id, c.nome
    ");
    $stmt->execute([$_SESSION['usuario_id']]);
    $gastosPorCategoria = $stmt->fetchAll(PDO::FETCH_ASSOC);    // Evolução do saldo (últimos 30 dias)
    $stmt = $pdo->prepare("
        SELECT DATE(data) as dia,
        SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE -valor END) as saldo_dia
        FROM transacoes
        WHERE data >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        AND usuario_id = ?
        GROUP BY DATE(data)
        ORDER BY data
    ");
    $stmt->execute([$_SESSION['usuario_id']]);
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
