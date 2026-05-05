import type { PermissionTabItem, PermissionView } from "../types";

interface PermissionTabNavProps {
  tabs: PermissionTabItem[];
  activeTab: PermissionView;
  onChange: (tab: PermissionView) => void;
  t: (key: string) => string;
}

const PermissionTabNav = ({
  tabs,
  activeTab,
  onChange,
  t,
}: PermissionTabNavProps) => {
  return (
    <div className="">
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "border-brand-500 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-gray-100"
              }`}
            >
              {t(tab.labelKey)}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PermissionTabNav;