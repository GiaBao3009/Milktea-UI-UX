/**
 * EmptyState – hiển thị khi danh sách rỗng.
 */
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      {icon && (
        <div className="mb-4 opacity-30">{icon}</div>
      )}
      <p className="text-base font-bold text-gray-700 mb-1">{title}</p>
      {description && (
        <p className="text-sm text-gray-400 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
