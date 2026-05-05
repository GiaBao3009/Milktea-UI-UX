import { create } from "zustand";
import type { Role } from "../types";

interface RoleState {
  roles: Role[];
  total: number;
  loading: boolean;
  error: string | null;
  setRoles: (list: Role[]) => void;
  addRole: (item: Role) => void;
  updateRole: (item: Role) => void;
  removeRole: (id: number) => void;
  setTotal: (total: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  roles: [],
  total: 0,
  loading: false,
  error: null,
  setRoles: (roles) => set({ roles: Array.isArray(roles) ? roles : [] }),
  addRole: (item) =>
    set((state) => ({
      roles: Array.isArray(state.roles) ? [item, ...state.roles] : [item],
    })),
  updateRole: (item) =>
    set((state) => ({
      roles: Array.isArray(state.roles)
        ? state.roles.map((role) => (role.id === item.id ? item : role))
        : [],
    })),
  removeRole: (id) =>
    set((state) => ({
      roles: Array.isArray(state.roles)
        ? state.roles.filter((role) => role.id !== id)
        : [],
    })),
  setTotal: (total) => set({ total }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
