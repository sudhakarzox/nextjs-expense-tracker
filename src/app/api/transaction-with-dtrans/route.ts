import { NextResponse } from "next/server";
import mongoose, { ClientSession } from "mongoose";
import Transaction from "@/models/transaction";
import DTrans from "@/models/DTrans";
import Account from "@/models/account";

interface RequestBody {
  type: "income" | "expense";
  amount: number;
  account: string;
  date: string;
  to?: string;
  category?: string;
  status: "pending" | "completed" | string;
  debtorTransaction?: boolean;
  selectedDebtor?: string;
  expectedReturnDate?: string;
  selecteddtransId?: string;
}

async function createTransactionDoc(body: RequestBody, session: ClientSession) {
  const transaction = await Transaction.create(
    [{
      type: body.type,
      amount: body.amount,
      account: body.account,
      date: new Date(body.date),
      to: body.to,
      category: body.category,
      status: body.status === "pending" ? "completed" : body.status,
    }],
    { session }
  );
  return transaction[0];
}

async function updateAccountBalance(
  type: "income" | "expense",
  amount: number,
  accountId: string,
  session: ClientSession
) {
  const account = await Account.findById(accountId).session(session);
  if (!account) throw new Error("Account not found");

  if (type === "income") {
    account.balance += amount;
  } else if (type === "expense") {
    account.balance -= amount;
  }
  await account.save({ session });
}

async function handleDebtorTransaction(
  body: RequestBody,
  transactionId: mongoose.Types.ObjectId,
  session: ClientSession
) {
  if (!body.debtorTransaction || !body.selectedDebtor) return;

  let dtrans = await DTrans.findOne({ debtor: body.selectedDebtor }).session(session);

  if (!dtrans) {
    // Create a new DTrans if none exists
    dtrans = new DTrans({
      debtor: body.selectedDebtor,
      transactions: [],
    });
  }

  if (body.type === "expense") {
    // Adding a new debtor subtransaction
    dtrans.transactions.push({
      transaction: transactionId,
      expectedReturnDate: body.expectedReturnDate || null,
      actualReturnDate: null,
      creditedTillDate: 0,
    });
  } else {
    // Update existing debtor transaction
    const transactionRecord = dtrans.transactions.find(
      (t: { transaction: mongoose.Types.ObjectId }) =>
        t.transaction.toString() === body.selecteddtransId
    );
    if (!transactionRecord) {
      throw new Error("Transaction not found in DTrans");
    }
    if (body.status === "pending") {
      transactionRecord.creditedTillDate += body.amount;
    } else {
      transactionRecord.actualReturnDate = new Date();
      transactionRecord.creditedTillDate += body.amount;
      await Transaction.findByIdAndUpdate(
        transactionRecord.transaction,
        { status: "completed" },
        { session }
      );
      dtrans.markModified("transactions");
    }
  }
  await dtrans.save({ session });
}

export async function POST(req: Request) {
  const session = await mongoose.startSession();
  let createdTransaction = null;

  try {
    session.startTransaction();

    const body: RequestBody = await req.json();

    createdTransaction = await createTransactionDoc(body, session);
    await updateAccountBalance(body.type, body.amount, body.account, session);
    await handleDebtorTransaction(body, createdTransaction._id, session);

    await session.commitTransaction();
    return NextResponse.json({ success: true, data: createdTransaction }, { status: 201 });
  } catch (error) {
    await session.abortTransaction();
    // For testing, error.message is easier to assert than serializing the error object
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : error }, { status: 500 });
  } finally {
    session.endSession();
  }
}
