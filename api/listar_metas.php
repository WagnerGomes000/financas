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
    $stmt = $pdo->prepare("
        SELECT m.*, 
        (
            SELECT SUM(CASE 
                WHEN t.tipo = 'entrada' THEN t.valor 
                WHEN t.tipo = 'saida' THEN -t.valor 
                ELSE 0 
            END)
            FROM transacoes t 
            WHERE t.usuario_id = m.usuario_id
            AND MONTH(t.data) = MONTH(m.mes_referencia)
            AND YEAR(t.data) = YEAR(m.mes_referencia)
        ) as valor_atual
        FROM metas m
        WHERE m.usuario_id = ?
        AND m.mes_referencia >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
        ORDER BY m.mes_referencia DESC
    ");    $stmt->execute([$_SESSION['usuario_id']]);
    $metas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'sucesso' => true,
        'metas' => $metas
    ]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
}
?>
