# Guia simples do SQL usado no projeto

Este guia explica as construções principais de `db/banco.sql`.

## `CREATE TABLE`
Cria uma tabela. Exemplo: `CREATE TABLE tipos (...)` cria a tabela que guarda os nomes dos tipos.

## Tipos de dados
- `INTEGER`: número inteiro, como o número nacional do Pokémon.
- `SERIAL`: inteiro com numeração automática, útil para IDs de treinadores, tipos e movimentos. Como os tipos e movimentos são inseridos sem informar o ID, o PostgreSQL gera esses números sozinho.
- `VARCHAR(50)`: texto com até 50 caracteres.
- `NUMERIC(4, 2)`: número decimal com até 4 algarismos, sendo 2 depois da vírgula; usamos para altura em metros.
- `NUMERIC(6, 2)`: número decimal com até 6 algarismos, sendo 2 depois da vírgula; usamos para peso em quilogramas.
- `PRIMARY KEY`: coluna (ou conjunto de colunas) que identifica uma linha sem repetir.

## Regras de preenchimento
- `NOT NULL`: o campo precisa ter um valor.
- `UNIQUE`: não permite repetir um valor (ou combinação de valores).
- `DEFAULT 'usuario'`: usa `usuario` se o valor não for informado.
- `CHECK (posicao BETWEEN 1 AND 6)`: só aceita posições de 1 a 6.

## Relacionamentos
- `REFERENCES outra_tabela(id)`: cria uma chave estrangeira e garante que o registro relacionado exista.
- `PRIMARY KEY (treinador_id, posicao)`: chave primária composta; neste caso, o mesmo treinador não pode ter duas posições iguais na equipe.
- `UNIQUE (treinador_id, pokemon_id)`: impede colocar o mesmo Pokémon duas vezes na equipe do mesmo treinador.
- `pokemon_tipo` liga Pokémon e tipos. Como é uma tabela de relacionamento, cada linha representa um vínculo.
- `pokemon_movimento` liga Pokémon e movimentos.
- `favoritos` liga treinadores aos Pokémon que favoritaram.
- `evolucoes` relaciona um Pokémon de origem a outro de destino.

## `INSERT INTO`
Insere dados. Por exemplo:

```sql
INSERT INTO tipos (id, nome) VALUES (1, 'Normal');
```

A parte entre parênteses lista as colunas; `VALUES` traz os valores correspondentes, na mesma ordem.

## Por que não usamos `TIMESTAMP`?
`TIMESTAMP` armazena data e hora. Ele seria útil se o sistema precisasse registrar quando um treinador criou a conta ou quando favoritou um Pokémon. Para a primeira versão do banco, essa informação não é necessária, então o campo foi deixado de fora para manter o SQL menor e mais fácil de estudar.

## Por que imagens são URLs?
A coluna `foto` guarda um endereço de imagem, não o arquivo de imagem em si. Assim, o banco fica leve e o frontend pode exibir a imagem com uma tag de imagem. É necessária conexão com a internet para carregar essas imagens remotas.

## Sobre estatísticas e tipos
Altura e peso são valores de referência em metros e quilogramas. Os valores de combate são estatísticas-base modernas. Os tipos também seguem a tabela atual: por isso Clefairy é Fada e Magnemite é Elétrico/Aço, mesmo que esses tipos tenham sido ajustados depois dos jogos originais.

## Conferir a carga

```sql
SELECT COUNT(*) FROM pokemon;
SELECT COUNT(*) FROM tipos;
SELECT p.nome, t.nome AS tipo
FROM pokemon p
JOIN pokemon_tipo pt ON pt.pokemon_id = p.id
JOIN tipos t ON t.id = pt.tipo_id
ORDER BY p.id, pt.posicao;
```

`JOIN` combina linhas relacionadas usando uma condição. É usado aqui para mostrar o nome do Pokémon junto do nome do tipo.
