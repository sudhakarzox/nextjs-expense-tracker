import mongoose from 'mongoose';

const DebtorSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

export default mongoose.models.Debtor || mongoose.model('Debtor', DebtorSchema);
