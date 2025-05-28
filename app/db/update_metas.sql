-- Verifica se a tabela existe e cria se não existir
CREATE TABLE IF NOT EXISTS metas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    valor_economia DECIMAL(10,2) NOT NULL,
    objetivo TEXT,
    mes_referencia DATE NOT NULL,
    usuario_id INT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Se a coluna não existir, adiciona ela
ALTER TABLE metas ADD COLUMN IF NOT EXISTS valor_economia DECIMAL(10,2) NOT NULL;
