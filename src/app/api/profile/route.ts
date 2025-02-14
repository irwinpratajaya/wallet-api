import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const userId = await auth(request);
    
    // Get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, name, created_at')
      .eq('id', userId)
      .single();

    if (userError) {
      return NextResponse.json(
        { error: userError.message },
        { status: 400 }
      );
    }

    // Get wallet with transactions
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select(`
        *,
        transactions (*, categories (name, type))
      `)
      .eq('user_id', userId)
      .single();

    if (walletError) {
      return NextResponse.json(
        { error: walletError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      user,
      wallet: {
        ...wallet,
        transactions: wallet.transactions.sort((a: any, b: any) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}