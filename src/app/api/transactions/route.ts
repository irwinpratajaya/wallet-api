import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const userId = await auth(request);
    const { searchParams } = new URL(request.url);
    const walletId = searchParams.get('wallet_id');
    
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select(`
        *,
        categories (
          name,
          type
        )
      `)
      .eq('wallet_id', walletId)
      .order('date', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ transactions });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = await auth(request);
    const { amount, type, description, category_id, wallet_id, date } = await request.json();

    if (!amount || !type || !category_id || !wallet_id) {
      return NextResponse.json(
        { error: 'Amount, type, category_id, and wallet_id are required' },
        { status: 400 }
      );
    }

    if (!['income', 'expense'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be either income or expense' },
        { status: 400 }
      );
    }

    // Start a transaction
    const { data: wallet } = await supabase
      .from('wallets')
      .select('balance')
      .eq('id', wallet_id)
      .single();

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      );
    }

    const newBalance = type === 'income' 
      ? wallet.balance + amount 
      : wallet.balance - amount;

    // Update wallet balance
    const { error: walletError } = await supabase
      .from('wallets')
      .update({ balance: newBalance })
      .eq('id', wallet_id);

    if (walletError) {
      return NextResponse.json(
        { error: walletError.message },
        { status: 400 }
      );
    }

    // Create transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert([{
        amount,
        type,
        description,
        category_id,
        wallet_id,
        date: date || new Date().toISOString()
      }])
      .select()
      .single();

    if (transactionError) {
      return NextResponse.json(
        { error: transactionError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ transaction }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
