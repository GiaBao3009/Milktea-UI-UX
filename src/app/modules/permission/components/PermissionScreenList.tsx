import React from "react";
import { Check, Save } from "lucide-react";
import Can from "@app/components/permission/Can";
import type { RolePermission } from "../types";

export interface PermissionScreenListProps {
  permissions: RolePermission[];
  onToggleAction: (screenCode: string, action: keyof RolePermission) => void;
  onSave?: () => void;
  saving?: boolean;
  loading: boolean;
  t: (key: string) => string;
}

const SCREEN_GROUPS = [
  { id: "overview", label: "Tổng quan",  codes: ["DASHBOARD"] },
  { id: "business", label: "Kinh doanh", codes: ["ORDER_MANAGEMENT", "PRODUCT_MANAGEMENT", "POS", "VOUCHER_MANAGEMENT"] },
  { id: "staff",    label: "Nhân sự",    codes: ["STAFF_MANAGEMENT", "SHIFT_MANAGEMENT"] },
  { id: "branch",   label: "Chi nhánh",  codes: ["BRANCH_MANAGEMENT", "ATTRIBUTE_MANAGEMENT"] },
  { id: "reports",  label: "Báo cáo",   codes: ["ANALYTICS"] },
  { id: "system",   label: "Hệ thống",  codes: ["ROLE_SETTING", "SYSTEM_SETTINGS"] },
];

const ACTIONS = [
  { key: "canView"   as keyof RolePermission, label: "Xem"  },
  { key: "canCreate" as keyof RolePermission, label: "Thêm" },
  { key: "canEdit"   as keyof RolePermission, label: "Sửa"  },
  { key: "canDelete" as keyof RolePermission, label: "Xoá"  },
];

const ACTION_COLORS: Record<string, string> = {
  canView:   "checked:bg-blue-500   checked-border-blue-500",
  canCreate: "checked:bg-green-500  checked-border-green-500",
  canEdit:   "checked:bg-amber-500  checked-border-amber-500",
  canDelete: "checked:bg-red-500    checked-border-red-500",
};

const ACTIVE_BG: Record<string, string> = {
  canView:   "bg-blue-500 border-blue-500",
  canCreate: "bg-green-500 border-green-500",
  canEdit:   "bg-amber-500 border-amber-500",
  canDelete: "bg-red-500 border-red-500",
};

const PermissionScreenList: React.FC<PermissionScreenListProps> = ({
  permissions,
  onToggleAction,
  onSave,
  saving,
  loading,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[620px] rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-200 border-t-brand-500" />
          <p className="text-sm text-slate-500">Đang tải quyền...</p>
        </div>
      </div>
    );
  }

  const groupedCodes = SCREEN_GROUPS.flatMap((g) => g.codes);
  const otherPermissions = permissions.filter((p) => !groupedCodes.includes(p.screenCode));

  const renderRow = (p: RolePermission) => (
    <tr
      key={p.screenCode}
      className="hover:bg-slate-50/80 dark:hover:bg-gray-700/20 transition-colors"
    >
      <td className="px-5 py-3">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{p.screenName}</p>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono mt-0.5">{p.screenCode}</p>
      </td>

      {ACTIONS.map((action) => {
        const checked = !!p[action.key];
        return (
          <td key={action.key} className="px-4 py-3 text-center">
            <Can action="edit" screen="ROLE_SETTING" passThrough>
              {(allowed) => (
                <button
                  type="button"
                  disabled={!allowed}
                  onClick={() => onToggleAction(p.screenCode, action.key)}
                  className={`
                    inline-flex items-center justify-center w-6 h-6 rounded-md border-2
                    transition-all duration-150 active:scale-90
                    ${checked
                      ? `${ACTIVE_BG[action.key]} text-white shadow-sm`
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-transparent hover:border-gray-400"
                    }
                    ${!allowed ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                  `}
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              )}
            </Can>
          </td>
        );
      })}
    </tr>
  );

  const renderGroupHeader = (label: string) => (
    <tr key={`h-${label}`} className="bg-slate-50 dark:bg-gray-900/40">
      <td colSpan={5} className="px-5 py-2">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.12em]">
          {label}
        </span>
      </td>
    </tr>
  );

  return (
    <div className="flex flex-col h-[620px] rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700 shrink-0">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Phân quyền màn hình</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Cấu hình quyền xem, thêm, sửa, xoá cho từng tính năng.
          </p>
        </div>

        <Can action="edit" screen="ROLE_SETTING">
          {onSave && (
            <button
              onClick={onSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 active:scale-95 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
            >
              {saving
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Save className="w-4 h-4" />
              }
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
          )}
        </Can>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-5 py-2 border-b border-gray-50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/20 shrink-0">
        {ACTIONS.map((a) => (
          <div key={a.key} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-sm ${ACTIVE_BG[a.key]}`} />
            <span className="text-xs text-gray-500 dark:text-gray-400">{a.label}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Tính năng
              </th>
              {ACTIONS.map((action) => (
                <th
                  key={action.key}
                  className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                >
                  {action.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
            {SCREEN_GROUPS.map((group) => {
              const groupPermissions = permissions.filter((p) => group.codes.includes(p.screenCode));
              if (groupPermissions.length === 0) return null;
              return (
                <React.Fragment key={group.id}>
                  {renderGroupHeader(group.label)}
                  {groupPermissions.map(renderRow)}
                </React.Fragment>
              );
            })}

            {otherPermissions.length > 0 && (
              <React.Fragment key="others">
                {renderGroupHeader("Khác")}
                {otherPermissions.map(renderRow)}
              </React.Fragment>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PermissionScreenList;
