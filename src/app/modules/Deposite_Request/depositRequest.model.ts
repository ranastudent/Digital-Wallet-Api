import { Schema, model } from 'mongoose';

interface IDepositRequest {
  user: Schema.Types.ObjectId;
  amount: number;
  phoneNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
  processedBy?: Schema.Types.ObjectId | string; // agent who approved
  processedAt?: Date; // timestamp when approved
}

const depositRequestSchema = new Schema<IDepositRequest>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    phoneNumber: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

export const DepositRequest = model<IDepositRequest>('DepositRequest', depositRequestSchema);
