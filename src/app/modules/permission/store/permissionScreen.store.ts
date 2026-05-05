import { create } from "zustand";
import type { RolePermission } from "../types";

interface RolePermissionState {
  permissionsByRole: Record<string, RolePermission[]>;
  loading: boolean;
  saving: boolean;
  error: string | null;
  setPermissionsByRole: (roleId: number, permissions: RolePermission[]) => void;
  updatePermissionAction: (
    roleId: number,
    screenCode: string,
    action: keyof RolePermission,
    value: boolean
  ) => void;
  clearPermissionsByRole: (roleId: number) => void;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setError: (error: string | null) => void;
}

export const useRolePermissionStore = create<RolePermissionState>((set) => ({
  permissionsByRole: {},
  loading: false,
  saving: false,
  error: null,
  setPermissionsByRole: (roleId, permissions) =>
    set((state) => ({
      permissionsByRole: {
        ...state.permissionsByRole,
        [String(roleId)]: permissions,
      },
    })),
  updatePermissionAction: (roleId, screenCode, action, value) =>
    set((state) => {
      const currentPermissions = state.permissionsByRole[String(roleId)] ?? [];
      const updatedPermissions = currentPermissions.map((p) =>
        p.screenCode === screenCode ? { ...p, [action]: value } : p
      );
      
      return {
        permissionsByRole: {
          ...state.permissionsByRole,
          [String(roleId)]: updatedPermissions,
        },
      };
    }),
  clearPermissionsByRole: (roleId) =>
    set((state) => ({
      permissionsByRole: Object.fromEntries(
        Object.entries(state.permissionsByRole).filter(
          ([id]) => id !== String(roleId),
        ),
      ),
    })),
  setLoading: (loading) => set({ loading }),
  setSaving: (saving) => set({ saving }),
  setError: (error) => set({ error }),
}));