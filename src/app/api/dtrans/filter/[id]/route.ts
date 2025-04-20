import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import DTrans from '@/models/DTrans';
import Transaction from '@/models/transaction';


type filterTransactionentryresponse = {
  amount: number;
  date: Date;
  _id?: string;
}

export async function GET(
  req: Request,
  { params }: { params:  Promise<{ id: string }> }
) {
  await connectDB();
  const { id: debtorId } = await params;

  try {
    const dTrans = await DTrans.findOne({ debtor: debtorId }).populate({
      path: 'transactions.transaction',
      model: Transaction,
    });

    if (!dTrans) {
      return NextResponse.json({ transactions: [] });
    }

    // Apply filter: type === "expense" && status === "pending" | "open"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filtered = dTrans.transactions.filter((entry: any) => {
      const txn = entry.transaction;
      return txn?.type === 'expense' && ['pending', 'open'].includes(txn.status);
    });

    //console.log('Filtered transactions:', filtered);

    //map the filtered transactions to the desired format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredTransactionsremap = filtered.map((entry: any) => {
      const txn = entry.transaction;
      return {
        amount: txn.amount,
        date: txn.date,
        _id: txn._id,
      } as filterTransactionentryresponse;
    }
    );

    return NextResponse.json({ transactions: filteredTransactionsremap });
  } catch (error) {
    console.error('[FILTER DTRANS ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
