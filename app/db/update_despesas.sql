-- Adicionar coluna usuario_id na tabela despesas_recorrentes
ALTER TABLE despesas_recorrentes ADD COLUMN usuario_id INT;
ALTER TABLE despesas_recorrentes ADD FOREIGN KEY (usuario_id) REFERENCES usuarios(id);
