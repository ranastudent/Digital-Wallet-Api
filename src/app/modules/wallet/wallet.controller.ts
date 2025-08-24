import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { WalletService } from "./wallet.service";

export const WalletController = {
  getMyWallet: catchAsync(async (req: Request, res: Response) => {
    console.log("Logged-in user info:", req.user);

    // Extract user id from JWT payload
    const userId = (req.user as any)._id;

    const wallet = await WalletService.getMyWallet(userId);

    if (!wallet) {
      res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
      return; // ✅ stop execution but don't return the Response object
    }

    res.status(200).json({
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
