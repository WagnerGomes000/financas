<?php
require_once '../config/database.php';
header('Content-Type: application/json');

try {
    $tipo = isset($_GET['tipo']) ? $_GET['tipo'] : null;
    
    // Query mais clara e com ORDER BY para garantir ordem consistente
    $sql = "SELECT id, nome, tipo FROM categorias";
    if ($tipo) {
        $sql .= " WHERE tipo = :tipo";
    }
    $sql .= " ORDER BY nome ASC";
    
    $stmt = $pdo->prepare($sql);
    
    if ($tipo) {
        $stmt->bindParam(':tipo', $tipo);
    }
    
    $stmt->execute();
    $categorias = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Adicionar log para debug
    error_log("Categorias encontradas: " . json_encode($categorias));
    
    echo json_encode($categorias);
} catch(PDOException $e) {
    error_log("Erro ao listar categorias: " . $e->getMessage());
    echo json_encode(['erro' => $e->getMessage()]);
}
?>
