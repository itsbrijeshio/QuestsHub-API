# 🧠 QuestsHub – Backend API

QuestsHub is a full-stack, real-world developer challenge platform where users complete quests (coding challenges), submit solutions, and earn XP across skill categories like frontend, backend, and DevOps.

This is the **backend API**, built with **Node.js**, **Express**, and **MongoDB** using Mongoose.

---

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **Argon2 (password hashing)**
- **Zod (optional validation)**
- **Role-based access (Admin & Developer)**

---

## 📦 Features

- 🔐 Secure JWT auth system (access + refresh tokens)
- 🧩 Quest creation, listing, and editing (admin-only)
- 📤 Quest submissions with GitHub repo links
- 🎮 XP & skill tracking per user
- 🧑‍⚖️ Admin: review & score submissions
- 🧾 XP logs for audit & progress tracking

---

## ⚙️ Getting Started

### 📁 Clone the repo
```bash
git clone https://github.com/itsbrijeshio/QuestsHub-API
cd QuestsHub-API
````

### 📦 Install dependencies

```bash
npm install
```

### ⚙️ Setup environment

Create a `.env.dev` file:

```env
NODE_ENV=development
PORT=
MONGODB_URI=
JWT_ACCESS_SECRET=
# Mins
JWT_ACCESS_EXPIRES_IN=
JWT_REFRESH_SECRET=
# Mins
JWT_REFRESH_EXPIRES_IN=
```

### ▶️ Run the dev server

```bash
npm run dev
```

---

## 🔐 Authentication Endpoints

| Method | Route                | Access | Description              |     |
| ------ | -------------------- | ------ | ------------------------ | --- |
| POST   | `/api/auth/register` | Public | Register a new user      |     |
| POST   | `/api/auth/login`    | Public | Login and receive tokens |     |
| POST   | `/api/auth/refresh`  | Public | Refresh access token     |     |

---
## 🔐 User Endpoints

| Method | Route          | Access | Description           |
| ------ | -------------- | ------ | --------------------- |
| GET    | `/api/user/me` | Auth   | Get current user info |

---

## 🧪 Quest Endpoints

|Method|Route|Access|Description|
|---|---|---|---|
|GET|`/api/quests`|Public|Get all quests|
|GET|`/api/quests/:id`|Public|Get quest by ID|
|POST|`/api/quests`|Admin|Create a new quest|
|PUT|`/api/quests/:id`|Admin|Update a quest|
|DELETE|`/api/quests/:id`|Admin|Delete a quest|

---

## 📤 Submission Endpoints

| Method | Route                               | Access     | Description                      |
| ------ | ----------------------------------- | ---------- | -------------------------------- |
| POST   | `/api/submissions`                  | Auth       | Submit a quest solution          |
| GET    | `/api/submissions`                  | Auth       | Get submissions for current user |
| GET    | `/api/submissions/:id`              | Auth/Admin | View one submission              |
| PUT    | `/api/submissions/:id`              | Auth       | Edit a submission                |
| DELETE | `/api/submissions/:id`              | Auth       | Delete a submission              |
| GET    | `/api/admin/submissions`            | Admin      | View all submissions             |
| PATCH  | `/api/admin/submissions/:id/review` | Admin      | Review and score a submission    |
| DELETE | `/api/admin/submissions/:id/`       | Admin      | Delete a submission              |

---

## 🎮 XP Tracking Endpoints

| Method | Route                   | Access | Description                          |
| ------ | ----------------------- | ------ | ------------------------------------ |
| GET    | `/api/user/xp`          | Auth   | Get current user XP logs & breakdown |
| GET    | `/api/admin/xp/:userId` | Admin  | Get another user’s XP breakdown      |

---

## 🛠️ Admin Utilities

| Method | Route                    | Access | Description             |
| ------ | ------------------------ | ------ | ----------------------- |
| GET    | `/api/admin/users`       | Admin  | List all users          |

---

## 🧠 XP System

- XP is awarded after a submission is reviewed.
    
- XP is categorized by `skillCategory` (`frontend`, `backend`, `devops`).
    
- Total XP and per-category XP are tracked.
    
- Optional `XPLog` collection stores XP history.
    

---

## 📁 Folder Structure

```
/src
  /config        # Configuration database and env
  /models        # Mongoose schemas
  /routes        # Express route files
  /controllers   # Route logic
  /middleware    # Auth & validation middleware
  /services      # XP & utility logic
  /utils         # Token utils, logger, etc.
  app.js         # Express app setup
server.js      # Start the server
```
---

## 🧾 License

This project is open-source and available under the [MIT License](https://chatgpt.com/g/g-FXtKHJSFQ-reactjs-expert/c/LICENSE).

---

## 👏 Contributing

Feel free to fork, improve, and submit PRs. Issues welcome!

---

## 📫 Contact

Made by [Brijesh](https://github.com/itsbrijeshio) — feel free to reach out if you have questions or suggestions!