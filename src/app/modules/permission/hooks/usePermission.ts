import { useCallback, useState, useEffect } from "react";
import type {
  CreateRoleDto,
  UpdateRoleDto,
  GetRolesParams,
  Role,
  RolePermission,
  Screen,
} from "../types";
import { globalLastId } from "@app/constants";
import { useToast } from "@app/hooks/useToast";
import { timeoutPromise } from "@app/utils/timeout.utils";
import type { SocketResponse } from "@app/types/types";
import { useTrans } from "@app/hooks/useTranslation";

import { useRoleStore } from "../store/role.store";
import { useRolePermissionStore } from "../store/permissionScreen.store";
import { usePermissionUserStore } from "../store/permissionUser.store";
import {
  assignRoleToUserApi,
  createRoleApi,
  deleteRoleApi,
  getRolesApi,
  getRoleByIdApi,
  removeRoleFromUserApi,
  updateRoleApi,
  getScreensApi,
  MOCK_USER_GROUPS,
} from "../services/permission.api";
// Sync với USE_MOCK trong permission.api.ts
const USE_MOCK = true;
import {
  initializeRolePermissions,
  mapRolePermissions,
} from "../utils/screenHelpers";

export function usePermission() {
  const {
    roles,
    total,
    loading,
    error,
    setRoles,
    addRole,
    updateRole,
    removeRole,
    setTotal,
    setLoading,
    setError,
  } = useRoleStore();

  const {
    permissionsByRole,
    loading: screenLoading,
    saving: screenSaving,
    error: screenError,
    setPermissionsByRole,
    updatePermissionAction,
    setLoading: setScreenLoading,
    setSaving: setScreenSaving,
    setError: setScreenError,
  } = useRolePermissionStore();

  const {
    userGroupsByUser,
    loadedUsersByGroup,
    dirtyUserIds,
    setSaving: setUserSaving,
    setAssignedGroupsForUser,
    setUsersByGroup,
  } = usePermissionUserStore();

  const { toast } = useToast();
  const { t } = useTrans();

  // Local state for all screens in the system
  const [allScreens, setAllScreens] = useState<Screen[]>([]);

  // Fetch all available screens once
  useEffect(() => {
    getScreensApi({ limit: 100 }, (response) => {
      if (response.res_code === 0 && response.data) {
        const data = response.data as any;
        const screens = Array.isArray(data) ? data : (data.row || data.rows || []);
        setAllScreens(screens);
      }
    });
  }, []);

  const fetchRoles = useCallback(
    (params: GetRolesParams = {}) => {
      setLoading(true);
      setError(null);

      const payload: GetRolesParams = {
        keySearch: params.keySearch ?? "",
        limit: params.limit ?? 20,
        lastId: params.lastId ?? globalLastId,
      };

      getRolesApi(payload, (response) => {
        console.log('Roles FindAll Response:', response);
        if (response.res_code === 0 && response.data) {
          const data = response.data as any;
          const rows = Array.isArray(data)
            ? data
            : (data.row || data.rows || []);
          setRoles(rows);
          setTotal(data.totalRows || rows.length);
        } else {
          const errorMsg = response.error_cont || t("roleLoadError");
          setError(errorMsg);
          toast.error(errorMsg);
        }
        setLoading(false);
      });
    },
    [setError, setRoles, setLoading, setTotal, toast],
  );

  const fetchPermissionsByRole = useCallback(
    async (roleId: number): Promise<void> => {
      setScreenLoading(true);
      setScreenError(null);

      try {
        const response = await timeoutPromise<SocketResponse<Role>>(
          (callback) => getRoleByIdApi(roleId, callback),
          30000,
        );

        console.log('Role FindOne Response:', response);

        if (response?.res_code === 0 && response.data) {
          const rawPermissions = response.data.permissions || [];
          const completePermissions = initializeRolePermissions(allScreens, rawPermissions);
          setPermissionsByRole(roleId, completePermissions);
        } else {
          throw new Error(String(response?.error_cont || t("roleLoadError")));
        }
      } catch (err: any) {
        setScreenError(err.message);
        toast.error(err.message);
      } finally {
        setScreenLoading(false);
      }
    },
    [allScreens, setPermissionsByRole, setScreenError, setScreenLoading, toast],
  );

  const fetchUsersByGroup = useCallback(
    async (groupId: number) => {
      // Mock mode: build userMap from MOCK_USER_GROUPS
      if (USE_MOCK) {
        const userMap: Record<string, string[]> = {};
        Object.entries(MOCK_USER_GROUPS).forEach(([userId, roleIds]) => {
          userMap[userId] = roleIds;
        });
        setUsersByGroup(groupId, userMap);
        return;
      }

      return new Promise<void>((resolve) => {
        getRoleByIdApi(groupId, (response) => {
          if (response.res_code === 0 && response.data) {
            const users = (response.data as any).users || [];
            const userMap: Record<string, string[]> = {};
            users.forEach((u: any) => {
              userMap[String(u.id)] = [String(groupId)];
            });
            setUsersByGroup(groupId, userMap);
          }
          resolve();
        });
      });
    },
    [setUsersByGroup],
  );

  const fetchAllRoleAssignments = useCallback(
    async (rolesToFetch: Role[]) => {
      if (!rolesToFetch.length) return;
      await Promise.all(rolesToFetch.map(role => fetchUsersByGroup(role.id)));
    },
    [fetchUsersByGroup]
  );

  const togglePermissionAction = useCallback(
    (roleId: number, screenCode: string, action: keyof RolePermission) => {
      updatePermissionAction(roleId, screenCode, action, true); // Logic to toggle is inside store or can be passed
    },
    [updatePermissionAction]
  );

  const saveRolePermissions = useCallback(
    async (roleId: number): Promise<void> => {
      const permissions = permissionsByRole[String(roleId)];
      if (!permissions) return;

      setScreenSaving(true);
      try {
        const response = await timeoutPromise<SocketResponse>(
          (callback) => updateRoleApi({
            id: roleId,
            data: {
              permissions: permissions.map(p => ({
                screenId: p.screenId,
                screenCode: p.screenCode,
                canView: !!p.canView,
                canCreate: !!p.canCreate,
                canEdit: !!p.canEdit,
                canDelete: !!p.canDelete,
              }))
            }
          }, callback),
          30000,
        );

        if (response?.res_code === 0) {
          console.log('Save Role Permissions Response:', response);
          toast.success(t("roleUpdateSuccess"));
        } else {
          throw new Error(String(response?.error_cont || t("roleUpdateError")));
        }
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setScreenSaving(false);
      }
    },
    [permissionsByRole, toast]
  );

  const createRoleAction = useCallback(
    (payload: CreateRoleDto) =>
      timeoutPromise<SocketResponse<Role>>(
        (callback) => createRoleApi(payload, callback),
        30000,
      ).then(response => {
        console.log('Create Role Response:', response);
        if (response?.res_code === 0 && response.data) {
          addRole(response.data);
          toast.success(t("roleCreateSuccess"));
        } else {
          throw new Error(String(response?.error_cont || t("roleCreateError")));
        }
      }),
    [addRole, toast]
  );

  const deleteRoleAction = useCallback(
    (id: number) =>
      timeoutPromise<SocketResponse>(
        (callback) => deleteRoleApi(id, callback),
        30000,
      ).then(response => {
        console.log('Delete Role Response:', response);
        if (response?.res_code === 0) {
          removeRole(id);
          toast.success(t("roleDeleteSuccess"));
        } else {
          throw new Error(String(response?.error_cont || t("roleDeleteError")));
        }
      }),
    [removeRole, toast]
  );

  const updateRoleAction = useCallback(
    (params: UpdateRoleDto) =>
      timeoutPromise<SocketResponse>(
        (callback) => updateRoleApi(params, callback),
        30000,
      ).then((response) => {
        console.log('Update Role Response:', response);
        if (response?.res_code === 0) {
          fetchRoles(); // Refresh to get updated list
          toast.success(t("roleUpdateSuccess"));
        } else {
          throw new Error(String(response?.error_cont || t("roleUpdateError")));
        }
      }),
    [fetchRoles, toast],
  );

  const toggleUserInRole = useCallback(
    async (roleId: number, userId: string | number) => {
      const numericUserId = Number(userId);
      if (isNaN(numericUserId)) {
        toast.error(t("roleAssignError"));
        return;
      }

      const accountId = String(userId);
      const isAssigned = userGroupsByUser[accountId]?.includes(String(roleId));

      console.log(`[Permission] Toggle role ${roleId} for user ${numericUserId}. isAssigned: ${isAssigned}`);

      return timeoutPromise<SocketResponse>(
        (callback) =>
          isAssigned
            ? removeRoleFromUserApi({ roleId, userIds: [numericUserId] }, callback)
            : assignRoleToUserApi({ roleId, userIds: [numericUserId] }, callback),
        30000
      ).then(async (response) => {
        console.log('Toggle User In Role Response:', response);
        if (response?.res_code === 0) {
          // Update local state for immediate feedback
          const currentGroups = userGroupsByUser[accountId] || [];
          const nextGroups = isAssigned
            ? currentGroups.filter((id: string) => id !== String(roleId))
            : [...currentGroups, String(roleId)];

          setAssignedGroupsForUser(accountId, nextGroups);

          // Force refetch from server to ensure sync
          await fetchUsersByGroup(roleId);

          toast.success(
            isAssigned
              ? t("roleRemoveSuccess")
              : t("roleAssignSuccess")
          );
        } else {
          throw new Error(String(response?.error_cont || (isAssigned ? t("roleRemoveError") : t("roleAssignError"))));
        }
      });
    },
    [userGroupsByUser, setAssignedGroupsForUser, fetchUsersByGroup, toast]
  );

  const batchToggleUsersInRole = useCallback(
    async (roleId: number, userIds: (string | number)[], assign: boolean) => {
      const numericUserIds = userIds.map(Number).filter(id => !isNaN(id));
      if (!numericUserIds.length) return;

      return timeoutPromise<SocketResponse>(
        (callback) =>
          assign
            ? assignRoleToUserApi({ roleId, userIds: numericUserIds }, callback)
            : removeRoleFromUserApi({ roleId, userIds: numericUserIds }, callback),
        30000
      ).then(async (response) => {
        if (response?.res_code === 0) {
          numericUserIds.forEach(uid => {
            const accountId = String(uid);
            const currentGroups = userGroupsByUser[accountId] || [];
            const nextGroups = assign
              ? [...new Set([...currentGroups, String(roleId)])]
              : currentGroups.filter((id: string) => id !== String(roleId));
            setAssignedGroupsForUser(accountId, nextGroups);
          });

          await fetchUsersByGroup(roleId);
          toast.success(assign ? "Đã gán người dùng" : "Đã gỡ người dùng");
        } else {
          throw new Error(String(response?.error_cont));
        }
      });
    },
    [userGroupsByUser, setAssignedGroupsForUser, fetchUsersByGroup, toast]
  );

  return {
    roles,
    loading,
    error,
    allScreens,
    permissionsByRole,
    screenLoading,
    screenSaving,
    fetchRoles,
    fetchPermissionsByRole,
    fetchUsersByGroup,
    fetchAllRoleAssignments,
    updatePermissionAction,
    saveRolePermissions,
    createRole: createRoleAction,
    updateRole: updateRoleAction,
    deleteRole: deleteRoleAction,
    toggleUserInRole,
    batchToggleUsersInRole,
    userGroupsByUser,
    loadedUsersByGroup,
  };
}
