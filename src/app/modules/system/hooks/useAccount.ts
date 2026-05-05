import { useState, useCallback } from 'react';
import { api, API_BASE } from '@app/services/api';

export interface Account {
  id: number;
  name: string;
  user_nm: string;
  permission_level: string | number;
}

const MOCK_ACCOUNTS: Account[] = [
  { id: 1, name: 'Nguyễn Thị Lan', user_nm: 'lan@chips.vn', permission_level: '1' },
  { id: 2, name: 'Trần Văn Minh', user_nm: 'minh@chips.vn', permission_level: '1' },
  { id: 3, name: 'Lê Thị Hoa', user_nm: 'hoa@chips.vn', permission_level: '1' },
  { id: 4, name: 'Phạm Văn Nam', user_nm: 'nam@chips.vn', permission_level: '0' },
  { id: 5, name: 'Hoàng Thị Mai', user_nm: 'mai@chips.vn', permission_level: '0' },
];

export function useAccount() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      if (!API_BASE) {
        setAccounts(MOCK_ACCOUNTS);
        return;
      }
      const data = await api.get<Account[]>('/api/account/users');
      setAccounts(Array.isArray(data) ? data : MOCK_ACCOUNTS);
    } catch {
      setAccounts(MOCK_ACCOUNTS);
    } finally {
      setLoading(false);
    }
  }, []);

  return { accounts, loading, fetchAccounts };
}
