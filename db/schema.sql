CREATE DATABASE IF NOT EXISTS financas_pessoais;
USE financas_pessoais;

CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    tipo ENUM('entrada', 'saida') NOT NULL
);

CREATE TABLE transacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(100) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data DATE NOT NULL,
    categoria_id INT,
    tipo ENUM('entrada', 'saida') NOT NULL,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
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
