import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAccount } from "@app/modules/system";
import { useToast } from "@app/hooks/useToast";
import { useTrans } from "@app/hooks/useTranslation";
import Card from "@app/components/ui/card";

import PermissionGroupList from "../components/PermissionGroupList";
import PermissionScreenList from "../components/PermissionScreenList";
import PermissionUserList from "../components/PermissionUserList";
import { usePermission } from "../hooks/usePermission";
import type { RolePermission } from "../types";

function PermissionPage() {
  const { t } = useTrans();
  const { toast } = useToast();
  const {
    roles,
    permissionsByRole,
    screenLoading,
    screenSaving,
    fetchRoles,
    fetchPermissionsByRole,
    fetchUsersByGroup,
    fetchAllRoleAssignments,
    updatePermissionAction,
    saveRolePermissions,
    createRole,
    updateRole,
    deleteRole,
    toggleUserInRole,
    batchToggleUsersInRole,
    userGroupsByUser,
  } = usePermission();

  const { accounts, loading: accountLoading, fetchAccounts } = useAccount();

  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const hasLoadedAllAssignments = useRef(false);

  useEffect(() => {
    fetchRoles();
    fetchAccounts();
  }, [fetchRoles, fetchAccounts]);

  useEffect(() => {
    if (roles.length > 0 && !hasLoadedAllAssignments.current) {
      fetchAllRoleAssignments(roles);
      hasLoadedAllAssignments.current = true;
    }
  }, [roles, fetchAllRoleAssignments]);

  useEffect(() => {
    if (!roles.length) { setSelectedRoleId(null); return; }
    if (selectedRoleId === null || !roles.some((r) => r.id === selectedRoleId)) {
      setSelectedRoleId(roles[0].id);
    }
  }, [roles, selectedRoleId]);

  const selectedRole = useMemo(
    () => roles.find((r) => r.id === selectedRoleId) ?? roles[0] ?? null,
    [roles, selectedRoleId],
  );

  useEffect(() => {
    if (selectedRole) {
      fetchPermissionsByRole(selectedRole.id);
      fetchUsersByGroup(selectedRole.id);
    }
  }, [selectedRole, fetchPermissionsByRole, fetchUsersByGroup]);

  const currentPermissions = useMemo(
    () => (selectedRole ? permissionsByRole[String(selectedRole.id)] ?? [] : []),
    [permissionsByRole, selectedRole],
  );

  const handleToggleAction = useCallback(
    (screenCode: string, action: keyof RolePermission) => {
      if (!selectedRole) return;
      const perm = currentPermissions.find((p) => p.screenCode === screenCode);
      updatePermissionAction(selectedRole.id, screenCode, action, !perm?.[action]);
    },
    [selectedRole, currentPermissions, updatePermissionAction],
  );

  const handleToggleMember = useCallback(
    (memberId: string) => {
      if (!selectedRole) return;
      toggleUserInRole(selectedRole.id, memberId).catch((e: Error) => toast.error(e.message));
    },
    [selectedRole, toggleUserInRole, toast],
  );

  const handleSelectAll = useCallback(
    (userIds: string[], isSelect: boolean) => {
      if (!selectedRole) return;
      batchToggleUsersInRole(selectedRole.id, userIds, isSelect).catch((e: Error) =>
        toast.error(e.message),
      );
    },
    [selectedRole, batchToggleUsersInRole, toast],
  );

  const handleSave = async () => {
    if (selectedRole) await saveRolePermissions(selectedRole.id);
  };

  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Phân quyền hệ thống</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
          Quản lý nhóm quyền, phân quyền màn hình và gán người dùng.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3">
          <PermissionGroupList
            roles={roles}
            selectedGroupId={selectedRole ? String(selectedRole.id) : ""}
            selectedGroup={selectedRole}
            onSelectGroup={(id) => setSelectedRoleId(Number(id))}
            onCreateGroup={createRole}
            onUpdateGroup={(id, data) => updateRole({ id, data })}
            onDeleteGroup={deleteRole}
            t={t}
          />
        </div>

        <div className="col-span-12 lg:col-span-9 space-y-6">
          {selectedRole ? (
            <PermissionScreenList
              permissions={currentPermissions}
              onToggleAction={handleToggleAction}
              onSave={handleSave}
              saving={screenSaving}
              loading={screenLoading}
              t={t}
            />
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-gray-500">Chọn một nhóm quyền để xem cấu hình</p>
            </div>
          )}
        </div>
      </div>

      {selectedRole && (
        <div className="rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-5">
          <PermissionUserList
            selectedGroup={selectedRole}
            accounts={accounts}
            roles={roles}
            loading={accountLoading}
            memberGroupIdsByAccount={userGroupsByUser}
            onToggleMember={handleToggleMember}
            onSelectAll={handleSelectAll}
            t={t}
          />
        </div>
      )}
    </div>
  );
}

export default PermissionPage;
