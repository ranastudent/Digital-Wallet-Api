# 💰 Digital Wallet API

A secure digital wallet backend system built with **Express.js** and **MongoDB**, supporting users, agents, and admins for performing transactions like cash-in, cash-out, send money, and wallet management.

# video description Link
https://www.loom.com/share/5eb7b2a15721490eb73f08c90319149d?sid=224c1e0c-da65-43a4-8230-5347fb87d125

# Live Link
https://digital-wallet-api-ten.vercel.app

---

## 🚀 Features

### 👤 Authentication & Roles
- JWT-based authentication
- Roles: `user`, `agent`, `admin`

### 💼 Wallet
- Wallet creation on registration
- Block/unblock wallet by admin

### 💸 Transactions
- Send money between users
- Cash-in / cash-out by agents
- Transaction commission handling
- Agent commission tracking

### 🧑‍💼 Agent Features
- Admin can approve/suspend agents
- Agents can add/withdraw money
- Agents can view commission history

### ⚙️ Admin Features
- View all users, agents, wallets, transactions
- Block/unblock wallets
- Approve/suspend agents
- Set system parameters (e.g., fees)

---

## 🧪 API Testing with Postman

### 🔐 Auth
- **Register User**
  - `POST /api/auth/register`
  - body: `{ name, email, password, role }`

- **Login**
  - `POST /api/auth/login`
  - body: `{ email, password }`

---

### 💼 Wallet APIs

- **Block Wallet (admin only)**
  - `PATCH /api/wallets/:walletId/block`
  - Header: `Authorization: Bearer <token>`

- **Unblock Wallet (admin only)**
  - `PATCH /api/wallets/:walletId/unblock`

---

### 💸 Transaction APIs

- **Send Money**
  - `POST /api/transactions/send`
  - body: `{ to: <userId>, amount }`

- **Withdraw Money**
  - `POST /api/transactions/withdraw`
  - body: `{ userId, amount }` (Agent only)

- **Cash-In**
  - `POST /api/transactions/cash-in`
  - body: `{ userId, amount }` (Agent only)

---

### 🧾 Commission History (Agent)

- `GET /api/transactions/commission`
  - Header: `Authorization: Bearer <agent-token>`

---

### 🧑‍💼 Admin Routes

- **Approve Agent**
  - `PATCH /api/agents/:id/approve`

- **Suspend Agent**
  - `PATCH /api/agents/:id/suspend`

- **Get All Users/Agents/Wallets**
  - `GET /api/admin/users`
  - `GET /api/admin/agents`
  - `GET /api/admin/wallets`

---

### ⚙️ System Settings

- **Update Setting**
  - `PATCH /api/settings`
  - body: `{ key: "transactionFee", value: 0.01 }`

- **Get Setting**
  - `GET /api/settings/transactionFee`

---

## 🛠️ Tech Stack

- **Backend**: Express.js, MongoDB, Mongoose
- **Auth**: JWT
- **Validation**: Zod
- **Deployment**: Vercel / Render

---

## 🧑‍🔧 Environment Variables (`.env`)

```env
PORT=5000
DATABASE_URL=<your_mongodb_connection>
JWT_SECRET=<your_jwt_secret>
