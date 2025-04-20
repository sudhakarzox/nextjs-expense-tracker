import {  NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import DTrans from '@/models/DTrans';
import Transaction from '@/models/transaction';
import Category from '@/models/Category';

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const  { id } =await context.params;
  const debtorId = id;
  try {
    const dTrans = await DTrans.findOne({ debtor: debtorId })
      .populate({
        path: 'transactions.transaction',
        model: Transaction,
      }).populate({
        path: 'transactions.transaction',
        populate: {
          path: 'category',
          model: Category,
        },
      })
      .exec();

    if (!dTrans) {
      return NextResponse.json({ transactions: [] });
    }

    return NextResponse.json({ transactions: dTrans.transactions });
  } catch (err) {
    console.error('[DTRANS API ERROR]', err);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
