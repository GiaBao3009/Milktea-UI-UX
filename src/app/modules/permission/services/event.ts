export const ROLE_EVENT = {
  CREATE: "roles:create",
  FIND_ALL: "roles:findAll",
  FIND_ONE: "roles:findOne",
  UPDATE: "roles:update",
  DELETE: "roles:delete",
  ASSIGN_TO_USER: "roles:assignToUser",
  REMOVE_FROM_USER: "roles:removeFromUser",
  GET_FOR_USER: "roles:getForUser",
};

export const SCREEN_EVENT = {
  FIND_ALL: "screens:findAll",
  FIND_ONE: "screens:findOne",
  UPDATE: "screens:update",
  DELETE: "screens:delete",
};

export const AUTH_EXCEPTION_EVENT = "exception";

export const AUTH_ERROR_CODES = {
  NO_TOKEN: "AUTHEN000",
  INVALID_TOKEN: "AUTHEN002",
  SESSION_EXPIRED: "AUTHEN003",
  FORBIDDEN: "AUTHEN004",
} as const;