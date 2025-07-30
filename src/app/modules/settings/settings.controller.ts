import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';
import { SettingsService } from './settings.service';

export const updateSystemSetting = catchAsync(async (req: Request, res: Response) => {
  const { key, value } = req.body;
  const updated = await SettingsService.set(key, value);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Setting updated',
    data: updated,
  });
});

export const getSystemSetting = catchAsync(async (req: Request, res: Response) => {
  const { key } = req.params;
  const value = await SettingsService.get(key);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Setting fetched',
    data: value,
  });
});
