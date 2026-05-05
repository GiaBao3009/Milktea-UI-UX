export interface PermissionAction {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export interface Screen {
  id: number;
  screenCode: string;
  name: string;
  description?: string;
}

export interface RolePermission extends PermissionAction {
  screenId: number;
  screenCode: string;
  screenName: string;
}

export interface Role {
  id: number;
  roleCode: string;
  name: string;
  description?: string;
  permissions?: RolePermission[];
}

// Data Transfer Objects (DTOs)
export interface GetRolesParams {
  keySearch?: string;
  limit?: number;
  lastId?: number;
}

export interface CreateRoleDto {
  roleCode: string;
  name: string;
  description?: string;
}

export interface UpdateRoleDto {
  id: number;
  data: {
    roleCode?: string;
    name?: string;
    description?: string;
    permissions?: Omit<RolePermission, "screenName">[]; // Usually name is not sent back
  };
}

export interface GetScreensParams {
  keySearch?: string;
  limit?: number;
  lastId?: number;
}

export interface AssignRoleToUserDto {
  roleId: number;
  userIds: number[];
}

export interface RemoveRoleFromUserDto {
  roleId: number;
  userIds: number[];
}

// userId → list of roleId strings the user belongs to
export type PermissionUserGroupMap = Record<string, string[]>;