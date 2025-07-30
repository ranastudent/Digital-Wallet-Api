import { Schema, model } from 'mongoose';
import { ISystemSettings } from './settings.interface';

const systemSettingsSchema = new Schema<ISystemSettings>({
  key: { type: String, required: true, unique: true },
  value: { type: Number, required: true },
});

export const SystemSettings = model<ISystemSettings>('SystemSettings', systemSettingsSchema);
