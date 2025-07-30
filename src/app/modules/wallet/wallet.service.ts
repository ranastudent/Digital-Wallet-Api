import { Wallet } from './wallet.model';
import { Types } from 'mongoose';

export const WalletService = {
  getMyWallet: async (userId: Types.ObjectId) => {
    return await Wallet.findOne({ user: userId });
  },

  getWalletById: async (walletId: string) => {
    return await Wallet.findById(walletId).populate('user');
  },
};
