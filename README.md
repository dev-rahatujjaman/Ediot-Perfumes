# 🛍️ Full-Stack MERN Ecommerce Platform

A production-ready full-stack eCommerce application built with **React 18**, **Vite**, **Redux Toolkit**, **Node.js**, **Express**, and **MongoDB**.

---

## 🌟 Key Features

### 👤 Customer Experience
- **Authentication & Authorization**: JWT-based login/registration with secure HTTP headers & password hashing via bcryptjs.
- **Product Discovery**: Search, category filters, pagination, top-rated carousel, and star reviews.
- **Shopping Cart**: Real-time quantity selection, stock validation, and local storage persistence.
- **Multi-Step Checkout**: Shipping address, payment method selection, order review, and order placement.
- **User Profile**: Update profile details, password changes, and order history tracking.

### 🛡️ Admin Dashboard
- **Product Management**: Create, edit, update stock/pricing, upload product images, and delete products.
- **Order Management**: View all customer orders, mark orders as delivered/paid.
- **User Management**: View all users, edit user roles, delete accounts.

---

## 🏗️ Project Architecture

```
Ecommerce Site/
├── backend/
│   ├── config/             # Database connection (Mongoose)
│   ├── controllers/        # Route controllers (Auth, Products, Orders, Users)
│   ├── data/               # Seed data (Users & Products)
│   ├── middleware/         # Auth, Admin guard & Error handlers
│   ├── models/             # Mongoose schemas (User, Product, Order)
│   ├── routes/             # RESTful API endpoints
│   ├── utils/              # Token generator & Seeder script
│   ├── uploads/            # Multer upload storage
│   ├── server.js           # Server entry point
│   ├── .env.example        # Backend environment template
│   └── package.json
│
├── frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI (Header, Footer, ProductCard, etc.)
│   │   ├── pages/          # Home, Product, Cart, Checkout, Profile, Admin
│   │   ├── services/       # Axios API client & endpoints
│   │   ├── store/          # Redux Toolkit store & feature slices
│   │   ├── App.jsx         # App router & layout
│   │   ├── index.css       # Clean modern CSS styling
│   │   └── main.jsx        # App mounting point
│   ├── vite.config.js      # Vite build & proxy configuration
│   ├── .env.example        # Frontend environment template
│   └── package.json
│
├── package.json            # Root scripts for running both apps concurrently
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v16+ recommended)
- **MongoDB** (Local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 2. Environment Setup

#### Backend `.env`
Create `backend/.env` (or copy from `backend/.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_jwt_key_here_12345
```

#### Frontend `.env` (Optional)
Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

---

### 3. Install Dependencies

You can install all dependencies from the root directory:
```bash
npm run install:all
```
*Or install individually:*
```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

---

### 4. Seed Sample Data (Optional)

Populate your MongoDB database with sample products and users (including an Admin user):

```bash
# From root
npm run seed

# Or from backend directory
cd backend && npm run data:import
```

> **Default Admin Account:**
> - **Email:** `admin@example.com`
> - **Password:** `123456`
>
> **Default Customer Accounts:**
> - **Email:** `john@example.com` / **Password:** `123456`
> - **Email:** `jane@example.com` / **Password:** `123456`

To clear the seeded database:
```bash
npm run seed:destroy
```

---

### 5. Run the Application

#### Run both Frontend & Backend concurrently:
```bash
npm run dev
```

#### Or run separately:
```bash
# Terminal 1 (Backend on http://localhost:5000)
cd backend && npm run dev

# Terminal 2 (Frontend on http://localhost:5173)
cd frontend && npm run dev
```

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Access |
|---|---|---|---|
| **POST** | `/api/auth/register` | Register new user | Public |
| **POST** | `/api/auth/login` | Authenticate user & get token | Public |
| **GET** | `/api/auth/profile` | Get logged-in user profile | Private |
| **PUT** | `/api/auth/profile` | Update profile / password | Private |
| **GET** | `/api/products` | Get all products (with search/pagination) | Public |
| **GET** | `/api/products/:id` | Get single product details | Public |
| **POST** | `/api/products/:id/reviews` | Create product review | Private |
| **POST** | `/api/products` | Create product | Admin |
| **PUT** | `/api/products/:id` | Update product | Admin |
| **DELETE**| `/api/products/:id` | Delete product | Admin |
| **POST** | `/api/orders` | Create new order | Private |
| **GET** | `/api/orders/myorders` | Get logged-in user orders | Private |
| **GET** | `/api/orders/:id` | Get order by ID | Private |
| **PUT** | `/api/orders/:id/pay` | Update order to paid | Private |
| **GET** | `/api/orders` | Get all orders | Admin |
| **PUT** | `/api/orders/:id/deliver` | Mark order as delivered | Admin |
| **POST** | `/api/upload` | Upload product image | Admin |
| **GET** | `/api/users` | Get all users | Admin |

---

## 🛠️ Built With
- **Frontend**: [React](https://react.dev/), [Vite](https://vitejs.dev/), [Redux Toolkit](https://redux-toolkit.js.org/), [React Router](https://reactrouter.com/), [React Icons](https://react-icons.github.io/react-icons/), [React Toastify](https://fkhadra.github.io/react-toastify/)
- **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [Mongoose](https://mongoosejs.com/), [JWT](https://jwt.io/), [BcryptJS](https://github.com/dcodeIO/bcrypt.js), [Multer](https://github.com/expressjs/multer)
