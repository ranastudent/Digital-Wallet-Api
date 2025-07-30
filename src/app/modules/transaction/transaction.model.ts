import { Schema, model } from 'mongoose';

type ITransactionType = 'add-money' | 'withdraw' | 'send' | 'cash-in' | 'cash-out';

interface ITransaction {
  from: Schema.Types.ObjectId | null;
  to: Schema.Types.ObjectId | null;
  amount: number;
  type: ITransactionType;
  status: 'success' | 'failed';
  agent?: Schema.Types.ObjectId | null; // NEW
  commission?: number; // NEW
  createdAt?: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    from: { type: Schema.Types.ObjectId, ref: 'Wallet', default: null },
    to: { type: Schema.Types.ObjectId, ref: 'Wallet', default: null },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ['add-money', 'withdraw', 'send', 'cash-in', 'cash-out'],
      required: true,
    },
    status: {
      type: String,
      enum: ['success', 'failed'],
      default: 'success',
    },
    agent: { type: Schema.Types.ObjectId, ref: 'User', default: null }, // NEW
    commission: { type: Number, default: 0 }, // NEW
  },
  { timestamps: true }
);

export const Transaction = model<ITransaction>('Transaction', transactionSchema);
