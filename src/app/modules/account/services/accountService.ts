import { api, API_BASE } from '@app/services/api';

export const accountService = {
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    if (!API_BASE) return;
    await api.post('/api/account/change-password', { currentPassword, newPassword });
  },
};
