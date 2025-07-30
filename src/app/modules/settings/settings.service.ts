import { SystemSettings } from './settings.model';

export const SettingsService = {
  async set(key: string, value: number) {
    return await SystemSettings.findOneAndUpdate(
      { key },
      { value },
      { upsert: true, new: true }
    );
  },

  async get(key: string) {
    const setting = await SystemSettings.findOne({ key });
    return setting?.value;
  },

  async getAll() {
    return await SystemSettings.find();
  }
};
