import { create } from "zustand";

import type { PermissionUserGroupMap } from "../types";

interface PermissionUserState {
  userGroupsByUser: PermissionUserGroupMap;
  loadedUsersByGroup: Record<string, boolean>;
  dirtyUserIds: string[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  setUsersByGroup: (groupId: number, userMap: PermissionUserGroupMap) => void;
  setAssignedGroupsForUser: (userId: string, groupIds: string[]) => void;
  removeGroupFromUsers: (groupId: string) => void;
  clearDirtyUsers: () => void;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePermissionUserStore = create<PermissionUserState>((set) => ({
  userGroupsByUser: {},
  loadedUsersByGroup: {},
  dirtyUserIds: [],
  loading: false,
  saving: false,
  error: null,
  setUsersByGroup: (groupId, userMap) =>
    set((state) => {
      const targetGroupId = String(groupId);
      const nextUserGroupsByUser = Object.entries(
        state.userGroupsByUser,
      ).reduce<PermissionUserGroupMap>((accumulator, [userId, groupIds]) => {
        const nextGroupIds = groupIds.filter((id) => id !== targetGroupId);

        if (nextGroupIds.length) {
          accumulator[userId] = nextGroupIds;
        }

        return accumulator;
      }, {});

      Object.entries(userMap).forEach(([userId, groupIds]) => {
        nextUserGroupsByUser[userId] = Array.from(
          new Set([...(nextUserGroupsByUser[userId] ?? []), ...groupIds]),
        );
      });

      return {
        userGroupsByUser: nextUserGroupsByUser,
        loadedUsersByGroup: {
          ...state.loadedUsersByGroup,
          [targetGroupId]: true,
        },
      };
    }),
  setAssignedGroupsForUser: (userId, groupIds) =>
    set((state) => ({
      userGroupsByUser: {
        ...state.userGroupsByUser,
        [userId]: Array.from(new Set(groupIds)),
      },
      dirtyUserIds: state.dirtyUserIds.includes(userId)
        ? state.dirtyUserIds
        : [...state.dirtyUserIds, userId],
    })),
  removeGroupFromUsers: (groupId) =>
    set((state) => ({
      userGroupsByUser: Object.fromEntries(
        Object.entries(state.userGroupsByUser)
          .map(([userId, groupIds]) => [
            userId,
            groupIds.filter((id) => id !== groupId),
          ])
          .filter(([, groupIds]) => groupIds.length > 0),
      ),
      loadedUsersByGroup: Object.fromEntries(
        Object.entries(state.loadedUsersByGroup).filter(([id]) => id !== groupId),
      ),
    })),
  clearDirtyUsers: () => set({ dirtyUserIds: [] }),
  setLoading: (loading) => set({ loading }),
  setSaving: (saving) => set({ saving }),
  setError: (error) => set({ error }),
}));