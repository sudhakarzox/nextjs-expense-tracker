//import { connectDB } from "@/lib/db";
import Transaction from "@/models/transaction";
import DTrans from "@/models/DTrans";
import Account from "@/models/account";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req: Request) {
    //const db = await connectDB();
    const session = await mongoose.startSession();

  try {
    session.startTransaction(); // Start the transaction

    const {
      type,
      amount,
      account,
      date,
      to,
      category,
      status,
      debtorTransaction,
      selectedDebtor,
      expectedReturnDate,
      selecteddtransId,
    } = await req.json();

    // 1. Create the transaction
    const transaction = await Transaction.create(
        [{
          type,
          amount,
          account,
          date: new Date(date),
          to,
          category,
          status: status === "pending" ? "completed" : status,  
        }],
      { session }
    );
//console.log("transaction", transaction[0]._id);
    // 2. Update account balance
    const accountE = await Account.findById(account).session(session);
    if (!accountE) {
      throw new Error("Account not found");
    }

    if (type === "income") {
      accountE.balance += amount;
    } else if (type === "expense") {
      accountE.balance -= amount;
    }
    await accountE.save({ session });

    // 3. Handle debtor transaction logic
    if (debtorTransaction && selectedDebtor) {
      let dtrans = await DTrans.findOne({ debtor: selectedDebtor }).session(session);

      if (!dtrans) {
        // Create a new DTrans document if none exists
        dtrans = new DTrans({
          debtor: selectedDebtor,
          transactions: [],
        });
      }

      if (type === "expense") {
        // Add a new transaction to the transactions array
        dtrans.transactions.push({
          transaction: transaction[0]._id,
          expectedReturnDate: expectedReturnDate || null,
          actualReturnDate: null,
          creditedTillDate: 0,
        });
      } else {
        // Update an existing transaction
        const transactionRecord = dtrans.transactions.find(
          (t: { transaction: mongoose.Types.ObjectId }) => t.transaction.toString() === selecteddtransId
        );

        if (!transactionRecord) {
          throw new Error("Transaction not found in DTrans");
        }

        if (status === "pending") {
          transactionRecord.creditedTillDate += amount;
        } else {
          transactionRecord.actualReturnDate = new Date();
          transactionRecord.creditedTillDate += amount;
          await Transaction.findByIdAndUpdate(transactionRecord.transaction, { status: 'completed' }).session(session);
          // Mark the subdocument as modified
          dtrans.markModified('transactions');
        }
      }

      
      await dtrans.save({ session });
    }

    // Commit the transaction
    await session.commitTransaction();

    return NextResponse.json({ success: true, data: transaction }, { status: 201 });
  } catch (error) {
    // Abort the transaction in case of an error
    await session.abortTransaction();
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  } finally {
    session.endSession(); // End the session
  }
}