import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { ILoginPayload, ILoginResponse } from './auth.interface';
import bcrypt from 'bcrypt';
import { createToken } from '../../utils/jwt';
import Apperror from '../../utils/Apperror';
import { Wallet } from '../wallet/wallet.model';
import { IUser } from '../user/user.interface';

export const AuthService = {
  // ✅ Correct method syntax
  registerUser: async (payload: IUser) => {
    const { email } = payload;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Apperror(httpStatus.CONFLICT, 'User with this email already exists');
    }
    

    // Create user
    const user = await User.create(payload);
  
    // Create wallet
    await Wallet.create({
      user: user._id,
      balance: 50,
    });

    // Generate token
    const token = createToken({ userId: user._id, role: user.role });

    return {
      user,
      token,
    };
  },

  loginUser: async (payload: ILoginPayload): Promise<ILoginResponse> => {
    const { phoneNumber, password } = payload;
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      throw new Apperror(401, 'User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Apperror(401, 'Incorrect password');
    }

    const token = createToken({ userId: user._id, role: user.role });
    return { accessToken: token };
  },
};
