import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  balance: { type: Number, default: 0 },
});

export default mongoose.models.Account || mongoose.model('Account', AccountSchema);
