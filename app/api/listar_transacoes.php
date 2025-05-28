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
    // Buscar transações do usuário atual
    $stmt = $pdo->prepare("
        SELECT t.*, c.nome as categoria_nome 
        FROM transacoes t 
        LEFT JOIN categorias c ON t.categoria_id = c.id 
        WHERE t.usuario_id = ?
        ORDER BY t.data DESC 
        LIMIT 10
    ");
    $stmt->execute([$_SESSION['usuario_id']]);
    $transacoes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Calcular resumo do usuário atual
    $stmt = $pdo->prepare("
        SELECT 
            SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END) as total_entradas,
            SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END) as total_saidas
        FROM transacoes
        WHERE usuario_id = ?
    ");
    $stmt->execute([$_SESSION['usuario_id']]);
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
