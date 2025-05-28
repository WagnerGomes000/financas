-- Adicionando coluna valor_economia se não existir
ALTER TABLE metas MODIFY COLUMN valor_economia DECIMAL(10,2);
