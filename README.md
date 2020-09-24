# API RestFull com Nodejs e Mysql

## Requisitos
* Nodejs
* MySQL
* Git/GitHub
* Conta de e-mail para os envios

## Para executar o Projeto
Clonar o repositório com `git clone`
```
git clone https://github.com/ronycleber/RestFull-API-Nodejs-Mysql.git
```
Acessar o repositório criado
```
cd RestFull-API-Nodejs-Mysql
```
Instalar as dependências do projeto
```
npm install
```
Criar as tabelas no Banco de Dados, para isso segue o script SQL `restfull-api.sql`. 
Configurar o arquivo `connection.js` com os dados do banco
```
const knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : 'localhost',
      user : 'root',
      password : '',
      database : 'restfull-api'
    }
  });

module.exports = knex;
```

### Executar em desenvolvimento
```
npx nodemon index.js
```
Para testar os endpoints segue a Colletion do Postman `API_RestFull.postman_collection.json`

## Endpoint `/pedidos/40/sendmail`
Para testar esse endpoint é necessário configurar com uma conta de email. Para isso, segue exemplo do código a ser configurado em `PedidoController` função `sendEmailReport`

```
let transporter = nodemailer.createTransport({
            host :'smtp.gmail.com',
            port : 587,
            secure : false,            
            auth: {
              user: 'ronycleber.dev@gmail.com',
              pass: 'sdpmtp32'
            },
        });
