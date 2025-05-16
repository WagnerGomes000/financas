-- Tabela para metas mensais
CREATE TABLE metas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria_id INT,
    valor_limite DECIMAL(10,2) NOT NULL,
    mes_referencia DATE NOT NULL,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
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
