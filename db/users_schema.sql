CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultimo_acesso DATETIME
);

-- Adicionar coluna de usuário na tabela de transações
ALTER TABLE transacoes ADD COLUMN usuario_id INT;
ALTER TABLE transacoes ADD FOREIGN KEY (usuario_id) REFERENCES usuarios(id);

-- Adicionar coluna de usuário na tabela de metas
ALTER TABLE metas ADD COLUMN usuario_id INT;
ALTER TABLE metas ADD FOREIGN KEY (usuario_id) REFERENCES usuarios(id);

-- Adicionar coluna de usuário na tabela de despesas recorrentes
ALTER TABLE despesas_recorrentes ADD COLUMN usuario_id INT;
ALTER TABLE despesas_recorrentes ADD FOREIGN KEY (usuario_id) REFERENCES usuarios(id);
