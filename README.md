## Executando o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 22+)
- [PNPM](https://pnpm.io/)
- [PostgreSQL](https://www.postgresql.org/)

1. **Clone o repositório**

   ```bash
   git clone https://github.com/bruno-bergamaschi/challenge-global-hitss-api.git
   cd challenge-global-hitss-api
   ```

2. **Instale as dependências**:

   ```bash
   pnpm install
   ```

3. **Crie um arquivo .env na raiz do projeto**:

   ```bash
   .env

   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_DATABASE=challenge-global-hitss
   ```

   ```bash
   .env.testing

   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_DATABASE=challenge-full-stack-web-testing
   ```

4. **Execute as migrations**:

   ```bash
   pnpm run migrations
   ```

5. **Execute os seeds básicos (opcional)**:

   ```bash
   pnpm run seeds:basic
   ```

6. **Inicie o app**:

   ```bash
   pnpm run dev
   ```

## Testes Automatizados

A API contém testes implementados com **Jest**, localizados em:

test/

Para rodar:

```bash
pnpm run test
```
