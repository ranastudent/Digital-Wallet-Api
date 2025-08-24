import { Wallet } from './wallet.model';
import { Types } from 'mongoose';

export const WalletService = {
 getMyWallet: async (userId: string) => {
    const wallet = await Wallet.findOne({ user: new Types.ObjectId(userId) });
    if (!wallet) return null;
    return { balance: wallet.balance, isBlocked: wallet.isBlocked };
  },

  getWalletById: async (walletId: string) => {
    return await Wallet.findById(walletId).populate('user');
  },
};
