import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { branchService, type Branch } from '@app/modules/system/services/branchService';

const BRANCH_STORAGE_KEY = 'chips_branch_id';
const ADMIN_USER_STORAGE_KEY = 'chips_admin_user';

interface BranchContextValue {
  branches: Branch[];
  currentBranchId: string;
  currentBranch: Branch | null;
  isLoading: boolean;
  error: string | null;
  changeBranch: (branchId: string) => void;
  refreshBranches: () => Promise<void>;
}

const BranchContext = createContext<BranchContextValue | null>(null);

function getStoredBranchId(): string {
  return localStorage.getItem(BRANCH_STORAGE_KEY) ?? '';
}

function persistBranchId(branchId: string) {
  if (branchId) {
    localStorage.setItem(BRANCH_STORAGE_KEY, branchId);
    syncStoredUserBranchId(branchId);
    return;
  }
  localStorage.removeItem(BRANCH_STORAGE_KEY);
  syncStoredUserBranchId('');
}

function syncStoredUserBranchId(branchId: string) {
  try {
    const rawUser = localStorage.getItem(ADMIN_USER_STORAGE_KEY);
    if (!rawUser) return;
    const user = JSON.parse(rawUser) as Record<string, unknown>;
    if (branchId) {
      user.branchId = Number(branchId);
    } else {
      delete user.branchId;
    }
    localStorage.setItem(ADMIN_USER_STORAGE_KEY, JSON.stringify(user));
  } catch {
    return;
  }
}

export function BranchProvider({ children }: { children: ReactNode }) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranchId, setCurrentBranchId] = useState(getStoredBranchId);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshBranches = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const branchList = await branchService.getAll();
      setBranches(branchList);

      const storedBranchId = getStoredBranchId();
      const storedBranchExists = branchList.some((branch) => String(branch.id) === storedBranchId);
      const nextBranchId = storedBranchExists ? storedBranchId : String(branchList[0]?.id ?? '');

      if (nextBranchId && nextBranchId !== storedBranchId) {
        persistBranchId(nextBranchId);
      }
      setCurrentBranchId(nextBranchId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách chi nhánh.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshBranches();
  }, [refreshBranches]);

  const changeBranch = useCallback((branchId: string) => {
    persistBranchId(branchId);
    setCurrentBranchId(branchId);
  }, []);

  const currentBranch = useMemo(
    () => branches.find((branch) => String(branch.id) === currentBranchId) ?? null,
    [branches, currentBranchId],
  );

  const value = useMemo<BranchContextValue>(
    () => ({
      branches,
      currentBranchId,
      currentBranch,
      isLoading,
      error,
      changeBranch,
      refreshBranches,
    }),
    [branches, changeBranch, currentBranch, currentBranchId, error, isLoading, refreshBranches],
  );

  return <BranchContext.Provider value={value}>{children}</BranchContext.Provider>;
}

export function useBranch(): BranchContextValue {
  const ctx = useContext(BranchContext);
  if (!ctx) throw new Error('useBranch must be used within BranchProvider');
  return ctx;
}
