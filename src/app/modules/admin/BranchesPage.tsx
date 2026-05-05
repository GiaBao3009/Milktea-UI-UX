import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Mail, Edit, Trash2, Plus, X, Loader2 } from 'lucide-react';
import { useTrans } from '@app/hooks/useTranslation';
import { toast } from 'sonner';
import { branchService, type Branch, type BranchPayload } from '@app/modules/system/services/branchService';

const EMPTY: BranchPayload = { name: '', address: '', phone: '', email: '', status: 'active', manager: '' };

export default function BranchesPage() {
  const { t } = useTrans();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Branch | null>(null);
  const [form, setForm] = useState<BranchPayload>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setBranches(await branchService.getAll());
    } catch {
      toast.error(t('admin.branches.messages.load_error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (b: Branch) => {
    setEditing(b);
    setForm({ name: b.name, address: b.address, phone: b.phone, email: b.email, status: b.status, manager: b.manager ?? '' });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditing(null); };

  const handleSave = async () => {
    if (!form.name || !form.address) { toast.error(t('admin.branches.messages.fill_info')); return; }
    try {
      setSaving(true);
      if (editing) {
        const updated = await branchService.update(editing.id, form);
        setBranches((prev) => prev.map((b) => b.id === editing.id ? updated : b));
        toast.success(t('admin.branches.messages.update_success'));
      } else {
        const created = await branchService.create(form);
        setBranches((prev) => [...prev, created]);
        toast.success(t('admin.branches.messages.create_success'));
      }
      closeModal();
    } catch (e) {
      toast.error((e as Error).message ?? t('admin.branches.messages.error'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await branchService.remove(id);
      setBranches((prev) => prev.filter((b) => b.id !== id));
      toast.success(t('admin.branches.messages.delete_success'));
    } catch (e) {
      toast.error((e as Error).message ?? t('admin.branches.messages.delete_error'));
    } finally {
      setDeleteId(null);
    }
  };

  const FIELDS = [
    { label: t('admin.branches.fields.name'), key: 'name', type: 'text', placeholder: t('admin.branches.fields.name_placeholder') },
    { label: t('admin.branches.fields.address'), key: 'address', type: 'text', placeholder: t('admin.branches.fields.address_placeholder') },
    { label: t('admin.branches.fields.phone'), key: 'phone', type: 'tel', placeholder: t('admin.branches.fields.phone_placeholder') },
    { label: t('admin.branches.fields.email'), key: 'email', type: 'email', placeholder: t('admin.branches.fields.email_placeholder') },
    { label: t('admin.branches.fields.manager'), key: 'manager', type: 'text', placeholder: t('admin.branches.fields.manager_placeholder') },
  ] as const;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t('admin.branches.title')}</h2>
          <p className="text-muted-foreground">
            {loading ? t('admin.branches.loading') : `${branches.length} ${t('admin.branches.active_branches_count')}`}
          </p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /><span>{t('admin.branches.add_branch')}</span>
        </motion.button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : branches.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-muted-foreground">
          <MapPin className="w-12 h-12 mb-3 opacity-30" />
          <p className="font-medium">{t('admin.branches.no_branches')}</p>
          <button onClick={openCreate} className="mt-4 text-primary text-sm font-medium hover:underline">{t('admin.branches.add_first_branch')}</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch, index) => (
            <motion.div key={branch.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(251,101,20,0.12)' }}
              className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(branch)} className="p-2 hover:bg-secondary rounded-lg transition-colors">
                    <Edit className="w-4 h-4 text-primary" />
                  </button>
                  <button onClick={() => setDeleteId(branch.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">{branch.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex gap-2"><MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" /><p className="text-muted-foreground">{branch.address}</p></div>
                <div className="flex gap-2"><Phone className="w-4 h-4 text-muted-foreground shrink-0" /><p className="text-muted-foreground">{branch.phone}</p></div>
                <div className="flex gap-2"><Mail className="w-4 h-4 text-muted-foreground shrink-0" /><p className="text-muted-foreground">{branch.email}</p></div>
              </div>
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{t('admin.branches.manager')}</p>
                  <p className="font-medium text-sm">{branch.manager || '—'}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${branch.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {branch.status === 'active' ? t('admin.branches.status_active') : t('admin.branches.status_inactive')}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal} className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-card rounded-2xl p-6 w-full max-w-md border border-border shadow-xl pointer-events-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">{editing ? t('admin.branches.edit_branch') : t('admin.branches.create_branch')}</h3>
                  <button onClick={closeModal} className="p-2 hover:bg-secondary rounded-lg"><X className="w-5 h-5" /></button>
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
                    <label className="text-sm font-medium mb-1 block">{t('admin.branches.fields.status')}</label>
                    <select value={form.status}
                      onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as 'active' | 'inactive' }))}
                      className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option value="active">{t('admin.branches.status_active')}</option>
                      <option value="inactive">{t('admin.branches.status_inactive')}</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={closeModal} className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors">{t('admin.branches.cancel')}</button>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving}
                    className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2">
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {saving ? t('admin.branches.saving') : editing ? t('admin.branches.update') : t('admin.branches.create')}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)} className="fixed inset-0 bg-black/40 z-40" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-card rounded-2xl p-6 w-full max-w-sm border border-border shadow-xl text-center pointer-events-auto">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="font-bold text-lg mb-2">{t('admin.branches.confirm_delete_title')}</h3>
                <p className="text-muted-foreground text-sm mb-6">{t('admin.branches.confirm_delete_msg')}</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium">{t('admin.branches.cancel')}</button>
                  <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600">{t('admin.branches.delete')}</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
