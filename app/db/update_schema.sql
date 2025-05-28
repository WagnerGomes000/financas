-- Tabela para metas mensais
CREATE TABLE metas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    valor_economia DECIMAL(10,2) NOT NULL,
    objetivo TEXT,
    mes_referencia DATE NOT NULL,
    usuario_id INT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabela para despesas recorrentes
CREATE TABLE despesas_recorrentes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(100) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    categoria_id INT,
    dia_vencimento INT NOT NULL,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);
