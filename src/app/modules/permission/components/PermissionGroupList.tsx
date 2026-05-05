import React, { useCallback, useState } from "react";
import { Edit2, Plus, Shield, Trash2 } from "lucide-react";
import Button from "@app/components/ui/button";
import ActionMenu from "@app/components/ui/ActionMenu";
import Can from "@app/components/permission/Can";

import type { Role } from "../types";
import AddEditGroupPermissionModal from "./AddEditGroupPermission";
import { useAbility } from "@app/hooks/useAbility";

interface PermissionGroupListProps {
  roles: Array<Role>;
  selectedGroupId: string;
  selectedGroup: Role | null;
  onSelectGroup: (groupId: string) => void;
  onCreateGroup: (payload: { roleCode: string; name: string }) => Promise<void>;
  onUpdateGroup: (id: number, payload: { roleCode: string; name: string }) => Promise<void>;
  onDeleteGroup: (groupId: number) => Promise<void>;
  t: (key: string, options?: Record<string, unknown>) => string;
}

const ROLE_COLORS: Record<string, { bg: string; icon: string; dot: string }> = {
  ADMIN:   { bg: "bg-red-50 dark:bg-red-900/20",    icon: "text-red-500",    dot: "bg-red-400"    },
  MANAGER: { bg: "bg-blue-50 dark:bg-blue-900/20",  icon: "text-blue-500",   dot: "bg-blue-400"   },
  CASHIER: { bg: "bg-green-50 dark:bg-green-900/20",icon: "text-green-500",  dot: "bg-green-400"  },
  STAFF:   { bg: "bg-gray-50 dark:bg-gray-700/40",  icon: "text-gray-400",   dot: "bg-gray-400"   },
};

const getRoleColor = (roleCode: string) =>
  ROLE_COLORS[roleCode] ?? { bg: "bg-brand-50 dark:bg-brand-900/20", icon: "text-brand-500", dot: "bg-brand-400" };

const PermissionGroupList = ({
  roles,
  selectedGroupId,
  onSelectGroup,
  onCreateGroup,
  onUpdateGroup,
  onDeleteGroup,
  t,
}: PermissionGroupListProps) => {
  const [modalMode, setModalMode] = useState<"add" | "edit" | "">("");
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { can } = useAbility();

  const handleCloseModal = useCallback(() => {
    if (isSaving) return;
    setModalMode("");
    setEditingRole(null);
  }, [isSaving]);

  const handleOpenAddModal = useCallback(() => {
    setEditingRole(null);
    setModalMode("add");
  }, []);

  const handleOpenEditModal = useCallback((role: Role) => {
    setEditingRole(role);
    setModalMode("edit");
  }, []);

  const handleSubmitGroup = async (payload: { roleCode: string; name: string }, id?: number) => {
    try {
      setIsSaving(true);
      if (modalMode === "edit" && typeof id === "number") {
        await onUpdateGroup(id, payload);
      } else {
        await onCreateGroup(payload);
      }
      setModalMode("");
      setEditingRole(null);
    } catch {
      // errors handled in hook
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await onDeleteGroup(Number(groupId));
    } catch {
      // errors handled in hook
    }
  };

  return (
    <div className="flex flex-col h-[560px] rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-gray-700 shrink-0">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-brand-500" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Nhóm quyền</h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-gray-400 pl-[42px]">
          Chọn một nhóm để cấu hình và gán người dùng.
        </p>
      </div>

      {/* Role list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-3 space-y-1">
        {roles.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <Shield className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-sm text-slate-400">Chưa có nhóm quyền nào</p>
          </div>
        )}

        {roles.map((role) => {
          const isSelected = String(role.id) === selectedGroupId;
          const color = getRoleColor(role.roleCode);

          return (
            <div
              key={role.id}
              onClick={() => onSelectGroup(String(role.id))}
              className={`
                group flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer
                transition-all duration-150 select-none
                ${isSelected
                  ? "bg-brand-500 shadow-sm shadow-brand-200 dark:shadow-brand-900/30"
                  : "hover:bg-slate-50 dark:hover:bg-gray-700/50"
                }
              `}
            >
              {/* Icon */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
                ${isSelected ? "bg-white/20" : color.bg}`}>
                <Shield className={`w-4 h-4 ${isSelected ? "text-white" : color.icon}`} />
              </div>

              {/* Name + code */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${isSelected ? "text-white" : "text-slate-800 dark:text-gray-100"}`}>
                  {role.name}
                </p>
                <p className={`text-[10px] font-mono truncate ${isSelected ? "text-white/70" : "text-slate-400 dark:text-gray-500"}`}>
                  {role.roleCode}
                </p>
              </div>

              {/* Action menu */}
              <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                <ActionMenu
                  triggerClassName={isSelected ? "hover:bg-white/20 text-white/80 hover:text-white" : ""}
                  items={[
                    ...(can("edit", "ROLE_SETTING")
                      ? [{ label: t("edit"), icon: <Edit2 className="h-4 w-4" />, onClick: () => handleOpenEditModal(role) }]
                      : []),
                    ...(can("delete", "ROLE_SETTING")
                      ? [{
                          label: t("systemPermissionDeleteGroup"),
                          icon: <Trash2 className="h-4 w-4" />,
                          onClick: () => handleDeleteGroup(String(role.id)),
                          variant: "danger" as const,
                          divider: true,
                        }]
                      : []),
                  ]}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-3 pb-3 pt-2 border-t border-slate-100 dark:border-gray-700 shrink-0">
        <Can action="create" screen="ROLE_SETTING">
          <Button
            variant="primary"
            fullWidth
            rounded="xl"
            className="justify-center gap-2 py-2.5 text-sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={handleOpenAddModal}
          >
            {t("systemPermissionAddGroup")}
          </Button>
        </Can>
      </div>

      <AddEditGroupPermissionModal
        mode={modalMode}
        per={editingRole}
        isSaving={isSaving}
        onSubmit={handleSubmitGroup}
        onCancel={handleCloseModal}
      />
    </div>
  );
};

export default PermissionGroupList;
