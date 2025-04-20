import mongoose from 'mongoose';

const DTransSchema = new mongoose.Schema({
  debtor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Debtor',
    required: true,
  },
  transactions: [
    {
      transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        required: true,
      },
      expectedReturnDate: { type: Date },
      actualReturnDate: { type: Date },
      creditedTillDate: { type: Number, default: 0 },
    },
  ],
});

export default mongoose.models.DTrans || mongoose.model('DTrans', DTransSchema);


