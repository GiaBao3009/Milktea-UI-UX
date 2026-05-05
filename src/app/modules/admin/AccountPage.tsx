import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Lock, Bell, Shield, Loader2 } from 'lucide-react';
import { useTrans } from '@app/hooks/useTranslation';
import { useAuth } from '@app/auth/contexts/AuthContext';
import { accountService } from '@app/modules/account/services/accountService';
import { toast } from 'sonner';

export default function AccountPage() {
  const { t } = useTrans();
  const { user } = useAuth();
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [changingPwd, setChangingPwd] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPwd || !newPwd || !confirmPwd) { toast.error(t('admin.account.messages.fill_info')); return; }
    if (newPwd !== confirmPwd) { toast.error(t('admin.account.messages.pwd_not_match')); return; }
    if (newPwd.length < 6) { toast.error(t('admin.account.messages.pwd_min_len')); return; }
    try {
      setChangingPwd(true);
      await accountService.changePassword(currentPwd, newPwd);
      toast.success(t('admin.account.messages.pwd_success'));
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
    } catch (e) {
      toast.error((e as Error).message ?? t('admin.account.messages.pwd_error'));
    } finally {
      setChangingPwd(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{t('admin.account.title')}</h2>
        <p className="text-muted-foreground">{t('admin.account.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Thông tin cá nhân */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg">{t('admin.account.personal_info')}</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('admin.account.full_name')}</label>
                  <input type="text" defaultValue={user?.fullName}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('admin.account.email')}</label>
                  <input type="email" defaultValue={user?.email}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">{t('admin.account.role')}</label>
                <input type="text" value={user?.appRole ?? 'Admin'} disabled
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-muted-foreground text-sm" />
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => toast.info(t('admin.roles.messages.dev_feature'))}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                Cập nhật thông tin
              </motion.button>
            </div>
          </div>

          {/* Đổi mật khẩu */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg">{t('admin.account.change_pwd')}</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">{t('admin.account.current_pwd')}</label>
                <input type="password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)}
                  placeholder={t('admin.account.current_pwd_placeholder')}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('admin.account.new_pwd')}</label>
                  <input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)}
                    placeholder={t('admin.account.new_pwd_placeholder')}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('admin.account.confirm_pwd')}</label>
                  <input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)}
                    placeholder={t('admin.account.confirm_pwd_placeholder')}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
                </div>
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleChangePassword} disabled={changingPwd}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-60 flex items-center gap-2">
                {changingPwd && <Loader2 className="w-4 h-4 animate-spin" />}
                {changingPwd ? t('admin.account.updating') : t('admin.account.change_pwd')}
              </motion.button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Thông báo */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center gap-2 mb-6">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg">{t('admin.account.notifications')}</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: t('admin.account.notif_new_order'), defaultChecked: true },
                { label: t('admin.account.notif_daily_report'), defaultChecked: true },
                { label: t('admin.account.notif_system_update'), defaultChecked: false },
              ].map((item) => (
                <label key={item.label} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked={item.defaultChecked}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 accent-primary" />
                  <span className="text-sm">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Bảo mật */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg">{t('admin.account.security')}</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('admin.account.auth_2fa')}</span>
                <span className="text-red-500 font-medium">{t('admin.account.inactive')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('admin.account.last_login')}</span>
                <span className="font-medium">{t('admin.account.today')}</span>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => toast.info(t('admin.roles.messages.dev_feature'))}
              className="w-full mt-4 px-4 py-2 bg-secondary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-sm font-medium">
              Kích hoạt 2FA
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
