# Pokédex

## Descrição do projeto

Este projeto consiste no desenvolvimento de uma Pokédex web inspirada no universo Pokémon. A aplicação terá como objetivo permitir que os usuários consultem informações sobre os Pokémon da primeira geração, visualizem suas características e organizem seus favoritos e equipes.

O projeto está sendo desenvolvido como atividade acadêmica, utilizando um banco de dados relacional PostgreSQL.

## Objetivo

Desenvolver uma aplicação web que permita armazenar, consultar e organizar informações dos Pokémon, aplicando os conceitos de banco de dados relacionais, relacionamentos entre tabelas e operações de cadastro, consulta, alteração e exclusão de dados.

## Tecnologias utilizadas

- PostgreSQL: gerenciamento do banco de dados.
- Docker Compose: execução do banco de dados em um contêiner.
- SQL: criação das tabelas e inserção dos dados iniciais.
- HTML, CSS e JavaScript: tecnologias previstas para a interface web, conforme o desenvolvimento do projeto.

## Estrutura do banco de dados

O banco de dados possui tabelas destinadas a armazenar:

- Treinadores e usuários.
- Pokémon e seus atributos.
- Tipos dos Pokémon.
- Movimentos.
- Equipes dos treinadores.
- Tipos associados aos Pokémon.
- Movimentos associados aos Pokémon.
- Pokémon favoritos dos treinadores.
- Evoluções dos Pokémon.

## Como executar o banco de dados

1. Instale o Docker Desktop.
2. Abra um terminal na pasta raiz do projeto.
3. Execute:

   ```bash
   docker compose up -d
   ```

4. Para verificar o estado do contêiner, execute:

   ```bash
   docker compose ps
   ```

5. Para encerrar o contêiner sem apagar os dados persistidos, execute:

   ```bash
   docker compose down
   ```

O arquivo `db/banco.sql` contém a estrutura do banco e os dados iniciais. O arquivo `db/verificar.sql` contém consultas para auxiliar na conferência dos dados.

## Integrantes

- Eros Godoy Olivatto;
- Paulo Guilherme Zanetti Serra.

## Status do projeto

Em desenvolvimento.
