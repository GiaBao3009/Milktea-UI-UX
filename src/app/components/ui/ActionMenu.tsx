import React, { useRef, useState, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import { cn } from './utils';

interface ActionItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
  divider?: boolean;
}

interface ActionMenuProps {
  items: ActionItem[];
  triggerClassName?: string;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ items, triggerClassName }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!items.length) return null;

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className={cn(
          'p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors',
          triggerClassName,
        )}
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-40 rounded-xl border border-gray-100 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="py-1">
            {items.map((item, idx) => (
              <React.Fragment key={idx}>
                {item.divider && idx > 0 && (
                  <div className="my-1 h-px bg-gray-100 dark:bg-gray-700" />
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                    item.onClick();
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors',
                    item.variant === 'danger'
                      ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700',
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
