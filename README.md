# Pokédex

## Descrição do projeto

Este projeto consiste no desenvolvimento de uma Pokédex web inspirada no universo Pokémon. A aplicação tem como objetivo permitir que os usuários consultem informações sobre os Pokémon da primeira geração, visualizem suas características e movimentos e organizem seus favoritos e equipes.

O projeto está sendo desenvolvido como atividade acadêmica, utilizando um banco de dados relacional PostgreSQL e uma API REST desenvolvida em Node.js.

## Objetivo

Desenvolver uma aplicação web que permita armazenar, consultar e organizar informações dos Pokémon, aplicando os conceitos de banco de dados relacionais, relacionamentos entre tabelas, autenticação de usuários e operações de cadastro, consulta, alteração e exclusão de dados.

## Tecnologias utilizadas

- PostgreSQL: gerenciamento do banco de dados.
- Docker Compose: execução do banco de dados em um contêiner.
- SQL: criação das tabelas e inserção dos dados iniciais.
- Node.js: ambiente de execução do backend.
- Express: desenvolvimento da API REST.
- JWT: autenticação e autorização de usuários.
- bcrypt: geração e verificação dos hashes das senhas.
- Multer: upload de fotos de perfil.
- dotenv: gerenciamento das variáveis de ambiente.
- pg: conexão entre o backend e o PostgreSQL.
- Nodemon: reinicialização automática do servidor durante o desenvolvimento.
- React, HTML, CSS e JavaScript: tecnologias previstas para o desenvolvimento do frontend.

## Estrutura do banco de dados

O banco de dados possui oito tabelas:

| Tabela | Descrição |
|---|---|
| treinadores | Informações dos usuários e administradores. |
| pokemon | Informações e atributos dos Pokémon. |
| tipos | Tipos dos Pokémon e movimentos. |
| movimentos | Informações dos movimentos. |
| equipe | Pokémon que fazem parte das equipes dos treinadores. |
| pokemon_tipo | Associação entre Pokémon e tipos. |
| pokemon_movimento | Associação entre Pokémon e movimentos. |
| favoritos | Pokémon favoritos dos treinadores. |

O banco possui relacionamentos de um para muitos (1:N) e muitos para muitos (N:N).

## Pré-requisitos

Para executar o projeto, é necessário possuir:

- Docker Desktop.
- Node.js.
- npm.
- Git.

O Postman pode ser utilizado para testar as rotas da API.

## Como executar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/LowState/Pokedex.git
cd Pokedex
```

### 2. Inicializar o banco de dados

Inicie o Docker Desktop e, na pasta raiz do projeto, execute:

```bash
docker compose up -d
```

Para verificar o estado do contêiner:

```bash
docker compose ps
```

O arquivo `db/banco.sql` contém a estrutura do banco de dados e os dados iniciais, que são carregados durante a primeira inicialização do banco.

O arquivo `db/verificar.sql` contém consultas para auxiliar na conferência dos dados.

### 3. Instalar as dependências do backend

Acesse a pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

### 4. Configurar as variáveis de ambiente

Crie um arquivo chamado `.env` dentro da pasta `backend`.

Exemplo de configuração:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=db
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET= (eu usei:) uma_chave_secreta_bem_grande_e_unica
```

Os dados de conexão devem corresponder às configurações do PostgreSQL presentes no arquivo `compose.yaml`.

A variável `JWT_SECRET` deve conter uma chave secreta utilizada na geração e validação dos tokens JWT.

O arquivo `.env` não deve ser enviado ao repositório.

### 5. Inicializar o backend

Dentro da pasta `backend`, execute:

```bash
npm run dev
```

Também é possível executar o servidor sem o Nodemon:

```bash
npm start
```

O servidor estará disponível, utilizando a porta 3000, em:

```text
http://localhost:3000
```

### 6. Verificar o funcionamento

Acesse pelo navegador ou pelo Postman:

```text
http://localhost:3000/teste-banco
```

Essa rota permite verificar se o backend está conectado ao PostgreSQL.

Para verificar a consulta dos Pokémon:

```text
http://localhost:3000/pokemon
```

### 7. Encerrar a execução

Para encerrar o backend, pressione `Ctrl + C` no terminal em que ele está sendo executado.

Para encerrar o contêiner sem apagar os dados persistidos, execute na pasta raiz do projeto:

```bash
docker compose down
```

## Autenticação e permissões

A API utiliza JWT para autenticar os usuários.

Após realizar o login, o servidor retorna um token que deve ser enviado no cabeçalho das requisições protegidas.

```text
Authorization: Bearer TOKEN
```

No Postman, selecione a opção Bearer Token na aba Authorization e informe o token recebido durante o login.

O sistema possui três níveis de acesso:

- Público: permite consultar informações sem autenticação.
- Autenticado: permite gerenciar o perfil, os favoritos e a equipe do treinador.
- Administrador: permite cadastrar, alterar e excluir Pokémon, movimentos e suas associações.

As senhas dos usuários são armazenadas utilizando hashes gerados pelo bcrypt.

## Documentação da API

Todas as rotas utilizam como endereço base:

```text
http://localhost:3000
```

As requisições que recebem dados em JSON devem utilizar o cabeçalho:

```text
Content-Type: application/json
```

As rotas protegidas também devem receber o token JWT.

### Rotas de teste

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/` | Público | Verifica se o servidor está funcionando. |
| GET | `/teste-banco` | Público | Testa a conexão com o banco de dados. |
| GET | `/teste-pokemon` | Público | Testa a consulta de Pokémon. |
| GET | `/teste-autenticacao` | Autenticado | Testa a autenticação JWT. |
| GET | `/teste-admin` | Administrador | Testa a permissão de administrador. |

### Usuários

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/usuarios/cadastro` | Público | Cadastra um novo usuário. |
| POST | `/usuarios/login` | Público | Autentica um usuário e retorna um token JWT. |

#### Cadastro de usuário

POST `/usuarios/cadastro`

Body:

```json
{
    "nome": "Treinador Exemplo",
    "login": "treinador_exemplo",
    "senha": "Senha123"
}
```

#### Login

POST `/usuarios/login`

Body:

```json
{
    "login": "treinador_exemplo",
    "senha": "Senha123"
}
```

Após o login, utilize o valor do campo `token` para acessar as rotas protegidas.

### Pokémon

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/pokemon` | Público | Lista os Pokémon cadastrados. |
| GET | `/pokemon/:id` | Público | Consulta um Pokémon pelo ID. |
| POST | `/pokemon` | Administrador | Cadastra um Pokémon. |
| PUT | `/pokemon/:id` | Administrador | Atualiza um Pokémon. |
| DELETE | `/pokemon/:id` | Administrador | Exclui um Pokémon. |

#### Cadastro de Pokémon

POST `/pokemon`

Body de exemplo:

```json
{
    "id": 152,
    "nome": "Chikorita",
    "foto": "/imagens/pokemon/152.png",
    "altura_m": 0.9,
    "peso_kg": 6.4,
    "hp_base": 45,
    "ataque_base": 49,
    "defesa_base": 65,
    "ataque_especial_base": 49,
    "defesa_especial_base": 65,
    "velocidade_base": 45,
    "tipos": [5]
}
```

O Pokémon utilizado no exemplo pertence à segunda geração e serve apenas para demonstrar a operação de cadastro. Utilize um ID e um nome que ainda não estejam cadastrados.

Os atributos base devem ser números inteiros positivos. O campo `tipos` recebe os IDs dos tipos associados ao Pokémon.

#### Atualização de Pokémon

PUT `/pokemon/152`

Body:

```json
{
    "nome": "Chikorita",
    "foto": "/imagens/pokemon/152.png",
    "altura_m": 0.9,
    "peso_kg": 6.4,
    "hp_base": 45,
    "ataque_base": 49,
    "defesa_base": 65,
    "ataque_especial_base": 49,
    "defesa_especial_base": 65,
    "velocidade_base": 45,
    "tipos": [5]
}
```

O ID do Pokémon que será atualizado deve ser informado na URL.

#### Exclusão de Pokémon

DELETE `/pokemon/152`

Não é necessário enviar dados no Body.

Utilize um Pokémon cadastrado exclusivamente para testes, evitando excluir os registros originais.

### Tipos

Os IDs dos tipos cadastrados inicialmente são:

| ID | Tipo | ID | Tipo |
|---|---|---|---|
| 1 | Normal | 10 | Voador |
| 2 | Fogo | 11 | Psíquico |
| 3 | Água | 12 | Inseto |
| 4 | Elétrico | 13 | Pedra |
| 5 | Grama | 14 | Fantasma |
| 6 | Gelo | 15 | Dragão |
| 7 | Lutador | 16 | Sombrio |
| 8 | Veneno | 17 | Aço |
| 9 | Terra | 18 | Fada |

Os IDs são utilizados no cadastro e na atualização dos Pokémon e movimentos.

### Movimentos

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/movimentos` | Público | Lista os movimentos. |
| GET | `/movimentos/:id` | Público | Consulta um movimento. |
| POST | `/movimentos` | Administrador | Cadastra um movimento. |
| PUT | `/movimentos/:id` | Administrador | Atualiza um movimento. |
| DELETE | `/movimentos/:id` | Administrador | Exclui um movimento. |

#### Cadastro e atualização de movimentos

POST `/movimentos`

PUT `/movimentos/:id`

Body de exemplo:

```json
{
    "nome": "Movimento de Teste",
    "tipo_id": 1,
    "poder": 40,
    "precisao": 100,
    "pp": 35,
    "categoria": "fisico"
}
```

As categorias disponíveis são:

- `fisico`
- `especial`
- `status`

O poder deve ser um número inteiro não negativo, a precisão deve estar entre 0 e 100 e o PP deve ser um número inteiro positivo.

Os campos `poder` e `precisao` também podem receber `null`.

### Movimentos associados aos Pokémon

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/pokemon/:id/movimentos` | Público | Lista os movimentos de um Pokémon. |
| POST | `/pokemon/:id/movimentos` | Administrador | Associa um movimento ao Pokémon. |
| DELETE | `/pokemon/:id/movimentos/:movimentoId` | Administrador | Remove a associação. |

#### Associar um movimento

POST `/pokemon/1/movimentos`

Body:

```json
{
    "movimento_id": 1
}
```

O Pokémon e o movimento devem existir no banco de dados e não podem possuir a mesma associação cadastrada anteriormente.

#### Remover uma associação

DELETE `/pokemon/1/movimentos/1`

Não é necessário enviar dados no Body.

### Favoritos

Todas as rotas de favoritos necessitam de autenticação.

| Método | Rota | Descrição |
|---|---|---|
| GET | `/favoritos` | Lista os favoritos do usuário autenticado. |
| POST | `/favoritos` | Adiciona um Pokémon aos favoritos. |
| DELETE | `/favoritos/:pokemonId` | Remove um Pokémon dos favoritos. |

#### Adicionar favorito

POST `/favoritos`

Body:

```json
{
    "pokemon_id": 25
}
```

#### Remover favorito

DELETE `/favoritos/25`

Os favoritos são associados automaticamente ao usuário autenticado pelo token JWT.

### Equipes

Todas as rotas de equipes necessitam de autenticação.

| Método | Rota | Descrição |
|---|---|---|
| GET | `/equipes` | Lista os Pokémon da equipe do usuário. |
| POST | `/equipes` | Adiciona um Pokémon à equipe. |
| PUT | `/equipes/:posicao` | Atualiza um Pokémon da equipe. |
| DELETE | `/equipes/:posicao` | Remove um Pokémon da equipe. |

Cada equipe pode possuir até seis Pokémon, organizados em posições de 1 a 6.

#### Adicionar Pokémon à equipe

POST `/equipes`

Body:

```json
{
    "pokemon_id": 25,
    "posicao": 1,
    "apelido": "Pikachu"
}
```

#### Atualizar Pokémon da equipe

PUT `/equipes/1`

Body:

```json
{
    "pokemon_id": 4,
    "apelido": "Chama"
}
```

#### Remover Pokémon da equipe

DELETE `/equipes/1`

O campo `apelido` é opcional e possui um limite de 50 caracteres.

### Perfil

Todas as rotas de perfil necessitam de autenticação.

| Método | Rota | Descrição |
|---|---|---|
| GET | `/perfil` | Consulta os dados do usuário autenticado. |
| PUT | `/perfil` | Atualiza o nome e o login. |
| PUT | `/perfil/senha` | Altera a senha. |
| POST | `/perfil/foto` | Envia uma foto de perfil. |
| DELETE | `/perfil/foto` | Remove a foto de perfil. |

#### Atualizar perfil

PUT `/perfil`

Body:

```json
{
    "nome": "Novo Nome",
    "login": "novo_login"
}
```

#### Alterar senha

PUT `/perfil/senha`

Body:

```json
{
    "senha_atual": "Senha123",
    "nova_senha": "NovaSenha123"
}
```

#### Enviar foto de perfil

POST `/perfil/foto`

Para realizar o upload pelo Postman:

1. Informe o token JWT na aba Authorization.
2. Acesse a aba Body.
3. Selecione a opção form-data.
4. Crie um campo chamado `foto`.
5. Altere o tipo do campo de Text para File.
6. Selecione a imagem.
7. Envie a requisição.

Formatos permitidos:

- JPG.
- JPEG.
- PNG.
- WEBP.

O tamanho máximo permitido é de 5 MB.

As imagens são armazenadas na pasta `backend/uploads`, enquanto o banco de dados armazena o caminho do arquivo.

Os arquivos enviados podem ser acessados através de:

```text
http://localhost:3000/uploads/NOME_DO_ARQUIVO
```

#### Remover foto de perfil

DELETE `/perfil/foto`

Não é necessário enviar dados no Body.

#### Armazenamento de imagens

As imagens dos Pokémon são armazenadas localmente no sistema de arquivos do backend, na pasta `backend/imagens/pokemon/`.

O PostgreSQL armazena apenas o caminho de cada imagem na coluna `foto` da tabela `pokemon`.

O Express disponibiliza essas imagens por meio da rota estática `/imagens`.

Exemplo:

- Arquivo: `backend/imagens/pokemon/001.png`
- Caminho no banco: `/imagens/pokemon/001.png`
- Endereço de acesso: `http://localhost:3000/imagens/pokemon/001.png`

As imagens estão incluídas no repositório, portanto não é necessário realizar downloads adicionais durante a execução do projeto.

As fotos de perfil dos treinadores são armazenadas separadamente, na pasta `backend/uploads/`.

As imagens dos Pokémon foram obtidas do repositório [PokeAPI Sprites](https://github.com/PokeAPI/sprites).

## Testando as permissões de administrador

Para testar as rotas administrativas em um ambiente de desenvolvimento local, cadastre um usuário normalmente pela rota `/usuarios/cadastro`.

Em seguida, acesse o PostgreSQL:

```bash
docker exec -it pokedex-db psql -U postgres -d db
```

Altere a permissão do usuário cadastrado:

```sql
UPDATE treinadores
SET administrador = TRUE
WHERE login = 'treinador_exemplo';
```

Saia do PostgreSQL:

```sql
\q
```

Realize novamente o login para obter um token JWT com a permissão de administrador.

Essa alteração deve ser realizada exclusivamente por alguém autorizado a administrar o banco de dados.

## Códigos de resposta HTTP

A API utiliza códigos HTTP para indicar o resultado das requisições.

| Código | Descrição |
|---|---|
| 200 | Operação realizada com sucesso. |
| 201 | Registro criado com sucesso. |
| 400 | Dados informados inválidos. |
| 401 | Autenticação necessária ou inválida. |
| 403 | Usuário sem permissão. |
| 404 | Registro não encontrado. |
| 409 | Conflito ou registro duplicado. |
| 413 | Arquivo enviado acima do limite permitido. |
| 500 | Erro interno do servidor. |

## Integrantes

- Eros Godoy Olivatto;
- Paulo Guilherme Zanetti Serra.

## Status do projeto

- Banco de dados: implementado.
- Backend REST: implementado.
- Autenticação JWT: implementada.
- Permissões de usuários e administradores: implementadas.
- Cadastro, consulta, alteração e exclusão de registros: implementados.
- Upload de foto de perfil: implementado.
- Documentação da API: implementada.
- Frontend: pendente de desenvolvimento.

Projeto em desenvolvimento.