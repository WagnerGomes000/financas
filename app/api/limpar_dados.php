<?php
require_once '../config/database.php';
header('Content-Type: application/json');

try {
    // Começar uma transação
    $pdo->beginTransaction();
    
    // Desabilitar verificação de chave estrangeira
    $pdo->exec('SET FOREIGN_KEY_CHECKS = 0');
    
    // Limpar tabela de transações
    $stmt = $pdo->prepare("DELETE FROM transacoes");
    $stmt->execute();
    
    // Reabilitar verificação de chave estrangeira
    $pdo->exec('SET FOREIGN_KEY_CHECKS = 1');
    
    // Confirmar as alterações
    $pdo->commit();
    
    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Dados limpos com sucesso'
    ]);
} catch(PDOException $e) {
    // Reverter em caso de erro
    $pdo->rollBack();
    
    // Log do erro para debug
    error_log("Erro ao limpar dados: " . $e->getMessage());
    
    echo json_encode([
        'sucesso' => false,
        'erro' => $e->getMessage()
    ]);
}
?>
