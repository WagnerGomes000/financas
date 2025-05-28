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
    // Buscar despesas recorrentes
    $stmt = $pdo->prepare("
        SELECT d.*, c.nome as categoria_nome
        FROM despesas_recorrentes d
        JOIN categorias c ON d.categoria_id = c.id
        WHERE d.usuario_id = ?
        ORDER BY d.dia_vencimento
    ");
    $stmt->execute([$_SESSION['usuario_id']]);
    $despesas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Calcular o total das despesas recorrentes
    $totalDespesasRecorrentes = array_reduce($despesas, function($acc, $item) {
        return $acc + $item['valor'];
    }, 0);
    
    // Buscar as saídas do mês atual
    $stmt = $pdo->prepare("
        SELECT t.*, c.nome as categoria_nome
        FROM transacoes t
        JOIN categorias c ON t.categoria_id = c.id
        WHERE t.tipo = 'saida' 
        AND t.usuario_id = ?
        AND MONTH(t.data) = MONTH(CURRENT_DATE())
        AND YEAR(t.data) = YEAR(CURRENT_DATE())
        ORDER BY t.data DESC
    ");
    $stmt->execute([$_SESSION['usuario_id']]);
    $saidas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Calcular o total das saídas do mês
    $totalSaidasMes = array_reduce($saidas, function($acc, $item) {
        return $acc + $item['valor'];
    }, 0);

    echo json_encode([
        'sucesso' => true,
        'despesas' => $despesas,
        'saidas' => $saidas,
        'totalDespesasRecorrentes' => $totalDespesasRecorrentes,
        'totalSaidasMes' => $totalSaidasMes
    ]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
}
?>
