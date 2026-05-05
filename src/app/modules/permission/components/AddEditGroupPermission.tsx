import React, { useState } from "react";
import Button from "@app/components/ui/button";
import Input from "@app/components/forms/Input";
import { useTrans } from "@app/hooks/useTranslation";
import { CirclePlus, Pencil } from "lucide-react";

import type { Role } from "../types";

interface AddEditRoleModalProps {
  mode: "add" | "edit" | "";
  per?: Role | null;
  isSaving: boolean;
  onSubmit: (per: { roleCode: string; name: string }, id?: number) => void;
  onCancel: () => void;
}

const AddEditGroupPermissionModal: React.FC<
  AddEditRoleModalProps
> = ({ mode, per, isSaving, onSubmit, onCancel }) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  const { t } = useTrans();

  React.useEffect(() => {
    if (per) {
      setCode(per.roleCode ?? "");
      setName(per.name);
      return;
    }

    setCode("");
    setName("");
  }, [mode, per]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(
      {
        roleCode: code,
        name: name,
      },
      per?.id,
    );
  };

  if (!mode) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg mx-4">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
              {mode === "add" ? (
                <CirclePlus className="w-5 h-5 text-brand-600 dark:text-brand-500" />
              ) : (
                <Pencil className="w-5 h-5 text-brand-600 dark:text-brand-500" />
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {mode === "add" ? t("systemRolesAdd") : t("systemRolesEdit")}
            </h3>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex w-full gap-3 items-center">
              <Input
                label={t("code")}
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                variant="compact"
                containerClassName="w-full"
              />
              <Input
                label={t("systemRolesName")}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                variant="compact"
                containerClassName="w-full"

              />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              rounded="lg"
            >
              {t("cancel")}
            </Button>

            <Button
              type="submit"
              variant="primary"
              rounded="lg"
              disabled={isSaving || !code.trim() || !name.trim()}
            >
              {isSaving ? t("saving") : t("save")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditGroupPermissionModal;
