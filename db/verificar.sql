-- Execute estes comandos dentro do banco db para conferir os dados.
SELECT COUNT(*) AS total_pokemon FROM pokemon;
SELECT COUNT(*) AS total_tipos FROM tipos;
SELECT COUNT(*) AS total_movimentos FROM movimentos;
SELECT COUNT(*) AS total_evolucoes FROM evolucoes;
SELECT COUNT(*) AS total_tipos_associados FROM pokemon_tipo;
SELECT COUNT(*) AS total_movimentos_associados FROM pokemon_movimento;
SELECT COUNT(*) AS total_treinadores FROM treinadores;
SELECT COUNT(*) AS total_pokemon_na_equipe FROM equipe;
SELECT COUNT(*) AS total_favoritos FROM favoritos;

-- Lista cada Pokemon e seus tipos.
SELECT p.id, p.nome, t.nome AS tipo
FROM pokemon p
JOIN pokemon_tipo pt ON pt.pokemon_id = p.id
JOIN tipos t ON t.id = pt.tipo_id
ORDER BY p.id, pt.posicao;
