export interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

export const getPasswordRequirements = (
  t: (key: string) => string,
): PasswordRequirement[] => [
  {
    label: t("changePasswordReqLowercase"),
    test: (pwd) => /[a-z]/.test(pwd),
  },
  {
    label: t("changePasswordReqUppercase"),
    test: (pwd) => /[A-Z]/.test(pwd),
  },
  {
    label: t("changePasswordReqNumber"),
    test: (pwd) => /[0-9]/.test(pwd),
  },
  {
    label: t("changePasswordReqSpecialChar"),
    test: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
  },
  {
    label: t("changePasswordReqMinLength"),
    test: (pwd) => pwd.length >= 8,
  },
];

export const validPassword = (pass: string) => {
  const requirements = getPasswordRequirements((key) => key);
  return requirements.every(req => req.test(pass));
};
