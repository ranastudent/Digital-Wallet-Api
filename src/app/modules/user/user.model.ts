import { Schema, model } from 'mongoose';
import { IUser } from './user.interface';
import bcrypt from 'bcrypt';

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'agent', 'admin'], default: 'user' },
    isAgentApproved: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false }, // ✅ added this
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const hashed = await bcrypt.hash(this.password, 10);
  this.password = hashed;
  next();
});

export const User = model<IUser>('User', userSchema);
