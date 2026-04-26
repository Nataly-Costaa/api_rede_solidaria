# 🚀 Rede Solidária - Backend

API RESTful para gerenciamento de doações, pontos de coleta, necessidades e usuários, com autenticação JWT e controle de acesso por tipo de usuário.

---

## 🧠 Sobre o projeto

Este backend foi desenvolvido para gerenciar uma rede solidária onde:

- 👤 **Admin** gerencia usuários e pontos de coleta  
- 🏢 **Coordenador** define necessidades de um ponto  
- 🙋 **Voluntário** registra doações  

O sistema calcula automaticamente:

- 📊 Quantidade recebida  
- 📉 Quantidade faltante  
- 📈 Percentual atendido  
- 🚨 Status (urgente, moderado, suficiente)

---

## 🛠️ Tecnologias utilizadas

- Node.js
- Express
- PostgreSQL
- JWT (autenticação)
- Bcrypt (criptografia de senha)
- Zod (validação)
- Dotenv

---

## 📁 Estrutura do projeto

```
src/
├── config/
│   └── db.js
├── controllers/
├── services/
├── routes/
├── middlewares/
├── validators/
└── app.js
```

---

## ⚙️ Configuração do ambiente

Crie um arquivo `.env` na raiz:

```
DATABASE_URL=postgresql://postgres:sua_senha@localhost:5432/nome_do_banco
JWT_SECRET=sua_chave_secreta
PORT=3000
```

---

## ▶️ Rodando o projeto

```
npm install
npm run dev
```

Servidor rodando em:

```
http://localhost:3000
```

---

## 🔐 Autenticação

A API utiliza JWT.

### Login:

```
POST /api/login
```

Body:

```json
{
  "email": "admin@teste.com",
  "senha": "123456"
}
```

Resposta:

```json
{
  "status": "success",
  "token": "JWT_TOKEN"
}
```

Use o token nas rotas protegidas:

```
Authorization: Bearer SEU_TOKEN
```

---

## 👥 Tipos de usuário

| Tipo         | Permissões |
|--------------|-----------|
| admin        | Gerencia tudo |
| coordenador  | Gerencia necessidades do seu ponto |
| voluntario   | Registra doações |

---

## 📌 Principais rotas

### 👤 Usuários

| Método | Rota | Acesso |
|--------|------|--------|
| POST   | /api/usuarios | admin |
| GET    | /api/usuarios | admin |
| PUT    | /api/usuarios/:id | admin ou próprio usuário |
| DELETE | /api/usuarios/:id | admin |

---

### 🏢 Pontos de coleta

| Método | Rota | Acesso |
|--------|------|--------|
| POST   | /api/pontos | admin |
| GET    | /api/pontos | admin |

---

### 📦 Necessidades

| Método | Rota | Acesso |
|--------|------|--------|
| POST   | /api/necessidade | coordenador |
| GET    | /api/necessidades/:id | coordenador |

⚠️ Coordenador só pode acessar o próprio ponto

---

### 🎁 Doações

| Método | Rota | Acesso |
|--------|------|--------|
| POST   | /api/doacoes | voluntario / coordenador |
| GET    | /api/itens | autenticado |

---

## 📊 Exemplo de resposta (itens urgentes)

```json
{
  "ponto": "Centro Comunitário",
  "item": "Água",
  "quantidade_necessaria": 120,
  "total_recebido": 60,
  "quantidade_faltante": 60,
  "percentual_atendido": 50,
  "status": "moderado"
}
```

---

## 🔐 Segurança implementada

- Senhas criptografadas com bcrypt
- Autenticação via JWT
- Autorização por tipo de usuário (RBAC)
- Validação de dados com Zod
- Proteção de rotas sensíveis
- Não exposição de dados sensíveis (senha)

---

## 🚨 Tratamento de erros

Formato padrão:

```json
{
  "status": "error",
  "message": "Descrição do erro"
}
```

---

## 📌 Status do projeto

✅ Backend completo  
✅ Autenticação e autorização  
✅ CRUD completo  
✅ Estrutura profissional  

---

## 👩‍💻 Autora

Desenvolvido por **Nataly Costa**
