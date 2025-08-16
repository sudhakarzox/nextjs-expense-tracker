import { connectDB } from '@/lib/db';
import DTrans from '@/models/DTrans';
import { NextResponse } from 'next/server';
import Transaction from '@/models/transaction';
import { now } from 'mongoose';


type TransactionRec = {
    transaction: string;
    expectedReturnDate: Date;
    actualReturnDate: Date;
    creditedTillDate: number;
    _id: string;
};


// export async function GET() {
//   try {
//     await connectDB();
//     const dtrans = await DTrans.find({})
//       .populate('debtor')
//       .populate('transactions.transaction');

//     return NextResponse.json({ success: true, data: dtrans });
//   } catch (error) {
//     return NextResponse.json({ success: false, error }, { status: 500 });
//   }
// }



export async function POST(req: Request) {
  const db = await connectDB();
  const session = db.startSession();
  try {
    
    const body = await req.json();
    const debtorId = body.debtor;
    const transType = body.transType;
    const status = body.status;
    const selecteddtransId = body.selecteddtransId || null;
    
    //find by debtor in dtrans 
    const dtrans = await DTrans.findOne({ debtor: debtorId }).session(session);
    //console.log("dtrans", dtrans);
    if (!dtrans) {
      return NextResponse.json({ success: false, message: 'Debtor not found' }, { status: 404 });
    }else{

      if (transType === 'expense') {
        dtrans.transactions.push({transaction: body.transaction, 
                              expectedReturnDate: body.expectedReturnDate, 
                               actualReturnDate: null, 
                               creditedTillDate: 0,
                              });
      await dtrans.save({ session });
      }else{
        
        //get the transaction record  
        const transactionRecord = dtrans.transactions.find((t:TransactionRec) => t.transaction.toString() === selecteddtransId.toString()).session(session);
        //console.log("transactionRecord", transactionRecord);
        if (!transactionRecord) {
          return NextResponse.json({ success: false, message: 'Transaction not found' }, { status: 404 }); 
        }

        if(status === 'pending'){
              // dtrans.transactions.push({transaction: body.transaction, 
              //                      //actualReturnDate: null, 
              //                      //creditedTillDate: 0,
              //                     });
                                //adjust
                  

            //get creditedTillDate value from transactionRecord and add body.transaction.amount to it
            const creditedTillDate:number = transactionRecord.creditedTillDate || 0;
            //console.log("creditedTillDate", creditedTillDate);
            transactionRecord.creditedTillDate = creditedTillDate + body.amount;
            //console.log("transactionRecord", transactionRecord);

            // Mark the subdocument as modified
             dtrans.markModified('transactions');
            //save transactionRecord
            await dtrans.save({ session });

        }else{
          // dtrans.transactions.push({transaction: body.transaction,  
          //   // actualReturnDate: body.actualReturnDate,
          //   });
          transactionRecord.actualReturnDate= now();
          //closed transaction
          //selecteddtransId=close;
          transactionRecord.creditedTillDate = body.amount;
          
          await Transaction.findByIdAndUpdate(transactionRecord.transaction, { status: 'completed' }).session(session);

          // Mark the subdocument as modified
          dtrans.markModified('transactions');
          await dtrans.save({ session });

        }

      }
    }
    await session.commitTransaction();// Commit the transaction
    return NextResponse.json({ success: true, data: dtrans }, { status: 201 });
  } catch (error) {
    await session.abortTransaction(); // Rollback the transaction
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }finally {
    session.endSession(); // End the session
  }
}


