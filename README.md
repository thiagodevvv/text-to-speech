
Passos para executar servidor (backend)

1. https://dev.mysql.com/downloads/file/?id=506568  baixar e instalar como developer default banco de dados MySQL
2. Criar usuário com nome: "admin"  e senha: "12345"
3. Entrar no Command Line MySQL, se authenticar e rodar comando: "create database db_comments;"
4. git clone https://github.com/thiagodevvv/text-to-speech.git
5. cd text-to-speech && cd backend && npm install 
6. cd src && npx knex migrate:latest (criar tabela)
7. cd .. && npx nodemon ou node index.js

Fim

Passos para executar web (front end)

1. Pelo terminal, entrar na pasta "web"
2. Rodar comando "npm install"
3. Rodar comando "npm run dev"
