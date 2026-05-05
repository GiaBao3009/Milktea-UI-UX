type RouterScreenPermission = {
  router_screen?: string | null;
};

type RouteLike = {
  path: string;
};

const sanitizePath = (path?: string | null): string => {
  const normalized = String(path || "")
    .split(/[?#]/)[0]
    .trim();
  if (!normalized) return "";
  if (normalized === "/") return "/";
  return normalized.replace(/\/+$/, "");
};

export const getAllowedPaths = (
  permissions?: RouterScreenPermission[],
): string[] => {
  if (!Array.isArray(permissions) || !permissions.length) {
    return [];
  }

  return Array.from(
    new Set(
      permissions
        .map((permission) => sanitizePath(permission?.router_screen))
        .filter(Boolean),
    ),
  );
};

export const canAccessPath = (
  path: string,
  permissions?: RouterScreenPermission[],
): boolean => {
  return getAllowedPaths(permissions).includes(path);
};

export const getFirstAccessibleRoute = <T extends RouteLike>(
  routes: T[],
  permissions?: RouterScreenPermission[],
): T | null => {
  return routes.find((route) => canAccessPath(route.path, permissions)) ?? null;
};
