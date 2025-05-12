<?php
require_once '../config/database.php';
header('Content-Type: application/json');

try {
    // Buscar transações
    $stmt = $pdo->query("
        SELECT t.*, c.nome as categoria_nome 
        FROM transacoes t 
        LEFT JOIN categorias c ON t.categoria_id = c.id 
        ORDER BY t.data DESC 
        LIMIT 10
    ");
    $transacoes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Calcular resumo
    $stmt = $pdo->query("
        SELECT 
            SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END) as total_entradas,
            SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END) as total_saidas
        FROM transacoes
    ");
    $totais = $stmt->fetch(PDO::FETCH_ASSOC);

    $resumo = [
        'entradas' => $totais['total_entradas'] ?? 0,
        'saidas' => $totais['total_saidas'] ?? 0,
        'saldo' => ($totais['total_entradas'] ?? 0) - ($totais['total_saidas'] ?? 0)
    ];

    echo json_encode([
        'sucesso' => true,
        'transacoes' => $transacoes,
        'resumo' => $resumo
    ]);
} catch(PDOException $e) {
    echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
}
?>
