import { connectDB } from '@/lib/db';
import Transaction from '@/models/transaction';
import Account from '@/models/account';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const db = await connectDB();
  const session = db.startSession();
  try {
    session.startTransaction();

    const { type, amount, account, date, to, category, status } = await req.json();

    // 1. Create Transaction
    const transaction = await Transaction.create(
      {
        type,
        amount,
        account,
        date: new Date(date), // Convert date to Date object with current time
        to,
        category,
        status,
      },
      { session }
    );

    // 2. Update account balance
    const accountE = await Account.findById(account).session(session);
    if (!accountE) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }
    if (type === 'income') {
      accountE.balance += amount;
    } else if (type === 'expense') {
      accountE.balance -= amount;
    }
    await accountE.save({ session });

    // Commit the transaction
    await session.commitTransaction();

    return NextResponse.json({ success: true, data: transaction }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
    // Abort the transaction in case of an error
    await session.abortTransaction();

      return NextResponse.json(
        {
          success: false,
          error: {
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined, // Include stack trace only in development
          },
        },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'An unknown error occurred',
          },
        },
        { status: 500 }
      );
    }
  } finally {
    session.endSession(); // End the session
  }
}

export async function GET() {
  try {
    await connectDB();
    const transactions = await Transaction.find({})
      .populate('account')
      .populate('category')
      .sort({ date: -1 }); // Sort by date in descending order

    return NextResponse.json({ success: true, data: transactions });
  } catch (error: unknown) {
    // Handle unknown error
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined, // Include stack trace only in development
          },
        },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'An unknown error occurred',
          },
        },
        { status: 500 }
      );
    }
  }
}
