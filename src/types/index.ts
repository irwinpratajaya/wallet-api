export interface User {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
}

export interface Wallet {
  id: string;
  balance: number;
  user_id: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  user_id: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  description: string | null;
  date: string;
  category_id: string;
  wallet_id: string;
}
