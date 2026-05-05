import React, { useState, useMemo } from "react";
import { Check, CheckCheck } from "lucide-react";
import type { Account } from "@app/modules/system";

import LoadingSpinner from "@app/components/LoadingSpinner";
import Can from "@app/components/permission/Can";

import type { Role } from "../types";

interface PermissionUserPanelProps {
  selectedGroup: Role;
  accounts: Account[];
  roles: Role[];
  loading: boolean;
  memberGroupIdsByAccount: Record<string, string[]>;
  onToggleMember: (memberId: string) => void;
  onSelectAll?: (userIds: string[], isSelect: boolean) => void;
  t: (key: string) => string;
}

const PermissionUserList = ({
  selectedGroup,
  accounts,
  roles,
  loading,
  memberGroupIdsByAccount,
  onToggleMember,
  onSelectAll,
  t,
}: PermissionUserPanelProps) => {
  const [activeTab, setActiveTab] = useState<"USER" | "CUSTOMER">("USER");

  const selectedGroupId = String(selectedGroup.id);

  const displayAccounts = useMemo(() => {
    return accounts.filter(account => {
      const pLevel = String((account as any).permission_level ?? (account as any).permissionLevel);
      if (activeTab === "USER") {
        return pLevel === "0" || pLevel === "1";
      } else {
        return pLevel === "3";
      }
    });
  }, [accounts, activeTab]);

  const unselectedUsers = displayAccounts.filter(
    a => !(memberGroupIdsByAccount[String(a.id)] ?? []).includes(selectedGroupId)
  );
  const isAllSelected = displayAccounts.length > 0 && unselectedUsers.length === 0;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectAll?.(displayAccounts.map(a => String(a.id)), false);
    } else {
      onSelectAll?.(unselectedUsers.map(a => String(a.id)), true);
    }
  };

  const roleNameMap = roles.reduce<Record<string, string>>((accumulator, role) => {
    accumulator[String(role.id)] = role.name;
    return accumulator;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {t("systemPermissionUserTitle")}
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-gray-400">
            {t("systemPermissionUserSubtitle")}
          </p>
        </div>
        <Can action="edit" screen="ROLE_SETTING" passThrough>
          {(allowed) => (
            <button
              onClick={handleSelectAll}
              disabled={!allowed || displayAccounts.length === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCheck className={`w-4 h-4 ${isAllSelected ? 'text-brand-500' : 'text-slate-400'}`} />
              {isAllSelected ? t("deselectAll") : t("selectAll")}
            </button>
          )}
        </Can>
      </div>

      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("USER")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "USER"
            ? "border-brand-500 text-brand-600 dark:text-brand-400"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
        >
          {t("permissionTabInternalUsers")}
        </button>
        <button
          onClick={() => setActiveTab("CUSTOMER")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "CUSTOMER"
            ? "border-brand-500 text-brand-600 dark:text-brand-400"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
        >
          {t("permissionTabCustomers")}
        </button>
      </div>

      <div className="pt-2">
        {loading && !displayAccounts.length && (
          <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-slate-200 px-6 py-10 dark:border-gray-700">
            <LoadingSpinner />
          </div>
        )}

        {!loading && !displayAccounts.length && (
          <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-slate-200 px-6 py-10 text-center dark:border-gray-700">
            <p className="text-sm text-slate-500 dark:text-gray-400">{t("noData")}</p>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
          {displayAccounts.map((account) => {
            const accountId = String(account.id);
            const groupIds = memberGroupIdsByAccount[accountId] ?? [];
            const isSelected = groupIds.includes(selectedGroupId);
            const memberGroups = groupIds
              .map((groupId) => roleNameMap[groupId])
              .filter(Boolean)
              .join(", ");

            return (
              <Can key={account.id} action="edit" screen="ROLE_SETTING" passThrough>
                {(allowed) => (
                  <button
                    type="button"
                    disabled={!allowed}
                    onClick={() => onToggleMember(accountId)}
                    className={`relative rounded-lg border px-4 py-4 text-left transition-colors overflow-hidden ${isSelected
                      ? "border-brand-400 bg-amber-50/70 shadow-sm dark:border-brand-600 dark:bg-brand-900/20"
                      : "border-slate-200 bg-white hover:border-brand-200 hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-brand-700 dark:hover:bg-gray-700/60"
                      } ${!allowed ? "cursor-default ring-0" : ""}`}
                  >
                    <span
                      className={`absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${isSelected
                        ? "border-brand-500 bg-brand-500 text-white"
                        : "border-slate-300 bg-white text-transparent dark:border-gray-500 dark:bg-gray-800"
                        }`}
                    >
                      <Check className="h-4 w-4" />
                    </span>

                    <p className="pr-10 text-lg font-semibold text-slate-900 dark:text-white truncate">
                      {account.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                      {account.user_nm}
                    </p>
                    <p className="mt-4 text-sm text-slate-500 dark:text-gray-400">
                      {t("systemPermissionAssignedGroups")}: {memberGroups || t("systemPermissionNoGroup")}
                    </p>
                  </button>
                )}
              </Can>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PermissionUserList;