import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Edit, Loader2, X } from 'lucide-react';
import { useTrans } from '@app/hooks/useTranslation';
import { toast } from 'sonner';
import { userService, type StaffUser, type StaffPayload } from '@app/modules/account/services/userService';

const ROLES = ['Admin', 'Manager', 'Cashier', 'Staff'];
const roleColors: Record<string, string> = {
  Admin: 'bg-red-100 text-red-700',
  Manager: 'bg-blue-100 text-blue-700',
  Cashier: 'bg-green-100 text-green-700',
  Staff: 'bg-gray-100 text-gray-700',
};

const EMPTY: StaffPayload = { name: '', email: '', phone: '', role: 'Cashier', branch: '', status: 'active' };

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).slice(-2).join('').toUpperCase();
}

export default function UsersPage() {
  const { t } = useTrans();
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<StaffUser | null>(null);
  const [form, setForm] = useState<StaffPayload>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try { setUsers(await userService.getAll()); }
      catch { toast.error(t('admin.users.messages.load_error')); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (u: StaffUser) => { setEditing(u); setForm({ name: u.name, email: u.email, phone: u.phone, role: u.role, branch: u.branch, status: u.status }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.name || !form.email) { toast.error(t('admin.users.messages.fill_info')); return; }
    try {
      setSaving(true);
      if (editing) {
        const updated = await userService.update(editing.id, form);
        setUsers((prev) => prev.map((u) => u.id === editing.id ? updated : u));
        toast.success(t('admin.users.messages.update_success'));
      } else {
        const created = await userService.create(form);
        setUsers((prev) => [...prev, created]);
        toast.success(t('admin.users.messages.create_success'));
      }
      setShowModal(false);
    } catch (e) { toast.error((e as Error).message ?? t('admin.users.messages.error')); }
    finally { setSaving(false); }
  };

  const FIELDS = [
    { label: t('admin.users.fields.name'), key: 'name', type: 'text', placeholder: t('admin.users.fields.name_placeholder') },
    { label: t('admin.users.fields.email'), key: 'email', type: 'email', placeholder: t('admin.users.fields.email_placeholder') },
    { label: t('admin.users.fields.phone'), key: 'phone', type: 'tel', placeholder: t('admin.users.fields.phone_placeholder') },
    { label: t('admin.users.fields.branch'), key: 'branch', type: 'text', placeholder: t('admin.users.fields.branch_placeholder') },
  ] as const;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t('admin.users.title')}</h2>
          <p className="text-muted-foreground">{loading ? t('admin.users.loading') : `${users.length} ${t('admin.users.active_users_count')}`}</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={openCreate}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 hover:bg-primary/90">
          <Plus className="w-4 h-4" /><span>{t('admin.users.add_user')}</span>
        </motion.button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={t('admin.users.search_placeholder')}
          className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <>
          <div className="hidden lg:block bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  {[t('admin.users.columns.user'), t('admin.users.columns.role'), t('admin.users.columns.branch'), t('admin.users.columns.contact'), t('admin.users.columns.status'), t('admin.users.columns.action')].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-sm font-semibold text-primary">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-t border-border hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold text-sm">
                          {initials(user.name)}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleColors[user.role] ?? 'bg-gray-100 text-gray-700'}`}>{user.role}</span>
                    </td>
                    <td className="px-6 py-4 text-sm">{user.branch}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{user.phone}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">{t('admin.users.status_active')}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => openEdit(user)} className="p-2 hover:bg-secondary rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-primary" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="py-12 text-center text-muted-foreground text-sm">{t('admin.users.no_users_found')}</div>}
          </div>

          <div className="lg:hidden space-y-4">
            {filtered.map((user) => (
              <motion.div key={user.id} whileHover={{ y: -2 }} className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold">{initials(user.name)}</div>
                  <div className="flex-1">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold ${roleColors[user.role] ?? ''}`}>{user.role}</span>
                  </div>
                </div>
                <button onClick={() => openEdit(user)} className="w-full py-2 bg-secondary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-sm font-medium">{t('admin.users.edit')}</button>
              </motion.div>
            ))}
          </div>
        </>
      )}

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)} className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-card rounded-2xl p-6 w-full max-w-md border border-border shadow-xl pointer-events-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">{editing ? t('admin.users.edit_user') : t('admin.users.create_user')}</h3>
                  <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-4">
                  {FIELDS.map(({ label, key, type, placeholder }) => (
                    <div key={key}>
                      <label className="text-sm font-medium mb-1 block">{label}</label>
                      <input type={type} value={(form as Record<string, string>)[key] ?? ''} placeholder={placeholder}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                        className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                  ))}
                  <div>
                    <label className="text-sm font-medium mb-1 block">{t('admin.users.fields.role')}</label>
                    <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium">{t('admin.users.cancel')}</button>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving}
                    className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-60 flex items-center justify-center gap-2">
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {saving ? t('admin.users.saving') : editing ? t('admin.users.update') : t('admin.users.create')}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
