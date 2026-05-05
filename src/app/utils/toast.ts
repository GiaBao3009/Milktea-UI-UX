import { toast } from 'sonner';

export const showToast = {
  success: (message: string, options?: { description?: string }) =>
    toast.success(message, options),
  error: (message: string, options?: { description?: string }) =>
    toast.error(message, options),
  loading: (message: string) =>
    toast.loading(message),
  dismiss: () =>
    toast.dismiss(),
  info: (message: string, options?: { description?: string }) =>
    toast.info(message, options),
};
