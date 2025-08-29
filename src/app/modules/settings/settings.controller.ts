// src/app/modules/settings/settings.controller.ts
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { SettingsService } from './settings.service';
import httpStatus from 'http-status';
import AppError from '../../utils/Apperror';

// ✅ GET system setting by key
export const getSystemSetting = catchAsync(async (req: Request, res: Response) => {
  const { key } = req.params;
  const value = await SettingsService.get(key);

  if (value === undefined) {
    throw new AppError(httpStatus.NOT_FOUND, `Setting "${key}" not found`);
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: `Setting "${key}" fetched successfully`,
    data: { key, value },
  });
});

// ✅ PATCH update system setting
export const updateSystemSetting = catchAsync(async (req: Request, res: Response) => {
  const { key, value } = req.body;

  if (!key || value === undefined) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Both key and value are required');
  }

  const updatedSetting = await SettingsService.set(key, value);

  res.status(httpStatus.OK).json({
    success: true,
    message: `Setting "${key}" updated successfully`,
    data: { key: updatedSetting.key, value: updatedSetting.value },
  });
});
