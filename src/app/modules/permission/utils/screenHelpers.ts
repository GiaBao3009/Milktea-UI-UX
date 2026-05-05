import type { RolePermission, Screen } from "../types";

/**
 * Initializes a list of permissions for a role based on all available screens.
 * If existing permissions are provided, it merges them.
 */
export const initializeRolePermissions = (
  allScreens: Screen[],
  existingPermissions: RolePermission[] = []
): RolePermission[] => {
  return allScreens.map((screen) => {
    const existing = existingPermissions.find(
      (p) => p.screenCode === screen.screenCode
    );

    return {
      screenId: screen.id,
      screenCode: screen.screenCode,
      screenName: screen.name,
      canView: existing?.canView ?? false,
      canCreate: existing?.canCreate ?? false,
      canEdit: existing?.canEdit ?? false,
      canDelete: existing?.canDelete ?? false,
    };
  });
};

/**
 * Maps legacy or partial permission data to the RolePermission structure
 */
export const mapRolePermissions = (data: any): RolePermission[] => {
  if (!data) return [];

  // If it's already an array of permissions
  if (Array.isArray(data)) {
    return data.map(p => ({
      screenId: p.screenId || 0,
      screenCode: p.screenCode || "",
      screenName: p.screenName || p.screenCode || "",
      canView: !!p.canView,
      canCreate: !!p.canCreate,
      canEdit: !!p.canEdit,
      canDelete: !!p.canDelete,
      canExport: !!p.canExport,
    }));
  }

  return [];
};