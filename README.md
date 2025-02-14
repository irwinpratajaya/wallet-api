# Expense Tracker API

A RESTful API built with Next.js, TypeScript, and Supabase for tracking expenses and managing personal finances.

## Features

- User authentication (register/login)
- Wallet management
- Transaction tracking (income/expense)
- Category management
- Secure API endpoints with JWT authentication

## Prerequisites

- Node.js 16.x or later
- Supabase account and project
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```

4. Update the environment variables in `.env.local` with your Supabase project credentials and JWT secret.

5. Run the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Categories
- GET `/api/categories` - Get all categories for user
- POST `/api/categories` - Create a new category

### Transactions
- GET `/api/transactions?wallet_id={walletId}` - Get all transactions for a wallet
- POST `/api/transactions` - Create a new transaction

### Wallet
- GET `/api/wallets` - Get user's wallet

## Authentication

All API endpoints (except registration and login) require JWT authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer your-jwt-token
```
