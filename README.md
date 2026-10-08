# Pokédex - 1ª Geração

Aplicação web desenvolvida como projeto do 4º bimestre, utilizando React no frontend e Node.js, Express e PostgreSQL no backend.

O projeto consiste em uma Pokédex interativa baseada nos 151 Pokémon da primeira geração, permitindo que usuários se cadastrem como treinadores, consultem informações sobre os Pokémon e montem sua própria equipe.

## 🎯 Objetivo

Desenvolver uma aplicação web completa que simule uma Pokédex, permitindo o gerenciamento de treinadores, Pokémon, tipos, movimentos e equipes.

O sistema também terá autenticação de usuários e administradores, além de funcionalidades de cadastro, consulta, alteração e exclusão de informações.

## ⚙️ Tecnologias utilizadas

### Frontend
- React
- JavaScript
- HTML
- CSS

### Backend
- Node.js
- Express
- PostgreSQL
- JWT para autenticação
- Multer para upload de arquivos

### Outros
- Git
- GitHub

## 📖 Sobre o projeto

A aplicação será composta por uma Pokédex contendo os 151 Pokémon da primeira geração.

Cada usuário poderá realizar seu cadastro e login como um treinador. Após entrar no sistema, o treinador poderá consultar os Pokémon disponíveis e montar uma equipe contendo até 6 Pokémon.

Também será possível consultar informações relacionadas aos tipos e movimentos dos Pokémon.

O sistema contará com diferentes níveis de acesso, permitindo a existência de usuários comuns e administradores.

## 👤 Treinadores

Os treinadores representam os usuários da aplicação.

Cada treinador possuirá informações como:

- Nome
- Login
- Senha
- Foto de perfil
- Tipo de usuário

O sistema contará com autenticação utilizando JWT.

## 🐱 Pokémon

A Pokédex contará inicialmente com os 151 Pokémon da primeira geração.

Cada Pokémon possuirá informações como:

- ID
- Nome
- Foto
- Tipo(s)
- Movimentos

Cada Pokémon poderá possuir um ou dois tipos.

## ⚔️ Movimentos

Os movimentos representam os ataques que podem ser utilizados pelos Pokémon.

Cada movimento possuirá:

- ID
- Nome
- Tipo

Um movimento pertence a um tipo e pode ser aprendido por vários Pokémon.

## 🔥 Tipos

O sistema possuirá uma tabela específica para os tipos dos Pokémon e dos movimentos.

Entre os tipos utilizados estão:

- Normal
- Fogo
- Água
- Elétrico
- Grama
- Gelo
- Lutador
- Veneno
- Terra
- Voador
- Psíquico
- Inseto
- Pedra
- Fantasma
- Dragão
- Sombrio
- Aço
- Fada

## 🏆 Equipes

Cada treinador poderá montar uma equipe com até 6 Pokémon.

A posição de cada Pokémon na equipe será armazenada, permitindo organizar a equipe da primeira até a sexta posição.

Exemplo:

1. Pokémon 1
2. Pokémon 2
3. Pokémon 3
4. Pokémon 4
5. Pokémon 5
6. Pokémon 6

## 🔐 Autenticação

O sistema contará com autenticação utilizando JWT.

Existirão dois níveis principais de usuário:

- Usuário comum
- Administrador

Usuários comuns poderão utilizar as funcionalidades destinadas aos treinadores.

Administradores terão acesso a funcionalidades adicionais de gerenciamento do sistema.

## 📁 Upload de arquivos

O sistema contará com upload de arquivos, inicialmente utilizado para as fotos de perfil dos treinadores.

## 🗄️ Banco de dados

O banco de dados será desenvolvido utilizando PostgreSQL.

As principais entidades serão:

- Treinadores
- Pokémon
- Tipos
- Movimentos
- Equipes

Também serão utilizadas tabelas intermediárias para representar os relacionamentos N:N entre as entidades.

### Principais relacionamentos

- Treinador × Pokémon → N:N
- Pokémon × Tipo → N:N
- Pokémon × Movimento → N:N
- Tipo × Movimento → 1:N

## 🚀 Funcionalidades previstas

- Cadastro de treinadores
- Login
- Autenticação utilizando JWT
- Diferenciação entre usuário comum e administrador
- Consulta dos Pokémon da primeira geração
- Consulta de tipos
- Consulta de movimentos
- Criação de equipe
- Seleção de até 6 Pokémon
- Organização da equipe
- Alteração da equipe
- Upload de foto de perfil
- CRUD das informações administráveis
- API REST para comunicação entre frontend e backend

## 📂 Estrutura do projeto

A estrutura do projeto será organizada separando o frontend e o backend:

```text
Pokedex/
│
├── backend/
│   ├── src/
│   └── ...
│
├── frontend/
│   ├── src/
│   └── ...
│
├── banco.sql
│
└── README.md
