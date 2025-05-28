
-- Tabela de usuários
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultimo_acesso DATETIME
);

-- Tabela de categorias
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    tipo ENUM('entrada', 'saida') NOT NULL
);

-- Tabela de transações
CREATE TABLE transacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(100) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data DATE NOT NULL,
    categoria_id INT,
    tipo ENUM('entrada', 'saida') NOT NULL,
    usuario_id INT,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

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
    usuario_id INT,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Inserir categorias básicas
INSERT INTO categorias (nome, tipo) VALUES
('Salário', 'entrada'),
('Vendas', 'entrada'),
('Alimentação', 'saida'),
('Transporte', 'saida'),
('Moradia', 'saida'),
('Lazer', 'saida'),
('Apps de Stream', 'saida');