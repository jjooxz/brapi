# BrAPI

API brasileira para geração e validação de **CPF**, **CNPJ** e **PIX** — com autenticação, painel administrativo e documentação integrada.

---

## Features

* Autenticação com API Key
* Sistema de usuários com painel admin
* Dashboard com controle de uso
* Geração e validação de CPF e CNPJ
* Geração de PIX (payload e QR Code)
* Documentação interativa (Redoc)
* Interface moderna (EJS + CSS custom)

---

## 📦 Instalação

```bash
git clone https://github.com/jjooxz/brapi.git
cd brapi
npm install
```

---

## ▶️ Rodando o projeto

```bash
npm start
```

ou com nodemon:

```bash
npx nodemon index.js
```

---

## 🌐 Endpoints

Base URL:

```
http://localhost:3000/api/v1
```

### 🔑 Autenticação

Todas as rotas protegidas usam:

```
x-api-key: SUA_API_KEY
```

---

## 📄 Exemplos

### Gerar CPF

```http
GET /cpf/generate?state=sp
```

### Validar CPF

```http
GET /cpf/validate/12345678909
```

---

### Gerar PIX (payload)

```http
POST /pix/static
```

```json
{
  "key": "email@email.com",
  "name": "Joao Silva",
  "city": "SAO PAULO",
  "amount": 10.50
}
```

---

### Gerar QR Code PIX

```http
GET /pix/qrcode?key=email@email.com&name=Joao&amount=10
```

---

## 🧠 Painel Admin

Acesse:

```
http://localhost:3000/admin
```

Funcionalidades:

* 🔍 Buscar usuários
* ➕ Criar usuários
* ⚙️ Alterar rate limit
* 🔄 Resetar uso
* 🔐 Forçar troca de senha

---

## 📚 Documentação

Disponível em:

```
http://localhost:3000/docs
```

Baseada em OpenAPI + Redoc.

---

## 🗂 Estrutura do Projeto

```
src/
 ├── routes/        # Rotas da API
 ├── services/      # Lógica de negócio
 ├── models/        # Banco de dados
 ├── middlewares/   # Auth, API key, etc
 ├── views/         # EJS (frontend)
 ├── public/        # CSS e assets
```

---

## 🛠 Tecnologias

* Node.js
* Express
* SQLite
* EJS
* Redoc (OpenAPI)

---

## ⚠️ Observações

* O banco é SQLite (`database.sqlite`)
* API Key obrigatória nas rotas `/api/v1`
* Conta admin padrão
    * Usuário: admin
    * Senha: admin
* Projeto feito para estudo / uso pessoal

---

## 📌 TODO

* [ ] Rate limit por IP
* [ ] Logs de requisição
* [ ] Deploy (Docker / VPS)
* [ ] Melhorar validações

---

## 🧑‍💻 Autor

Feito pelo Jota! carinha indie que gosta de programar

---

## 🪪 Licença

[MIT](./LICENSE)
