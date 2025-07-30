import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { WalletService } from "./wallet.service";
import mongoose from "mongoose";

export const WalletController = {
  getMyWallet: catchAsync(async (req: Request, res: Response) => {
    const userId = new mongoose.Types.ObjectId(req.user!.userId);
    const wallet = await WalletService.getMyWallet(userId);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Wallet fetched successfully",
      data: wallet,
    });
  }),

  getWalletById: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const wallet = await WalletService.getWalletById(id);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Wallet by ID fetched successfully",
      data: wallet,
    });
  }),
};
