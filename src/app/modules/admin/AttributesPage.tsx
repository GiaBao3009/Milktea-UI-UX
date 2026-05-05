import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, X, Loader2, Trash2, Edit, ChevronDown, ChevronUp,
  Tag, ToggleLeft, ToggleRight, CheckSquare, Circle, Star,
  GripVertical, AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  attributeService,
  type AttributeGroup,
  type AttributeGroupPayload,
  type AttributeOption,
} from '@app/modules/system/services/attributeService';

const fmt = (n: number) =>
  n === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN').format(n) + 'đ';

const EMPTY_GROUP: AttributeGroupPayload = {
  name: '',
  type: 'single',
  required: false,
  status: 'active',
  options: [],
};

const EMPTY_OPTION: Omit<AttributeOption, 'id'> = { label: '', price: 0, isDefault: false };

export default function AttributesPage() {
  const [groups, setGroups] = useState<AttributeGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Group modal
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<AttributeGroup | null>(null);
  const [groupForm, setGroupForm] = useState<AttributeGroupPayload>(EMPTY_GROUP);
  const [savingGroup, setSavingGroup] = useState(false);

  // Option inside group form
  const [optionForm, setOptionForm] = useState<Omit<AttributeOption, 'id'>>(EMPTY_OPTION);

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await attributeService.getAll();
      const safe = Array.isArray(data) ? data : [];
      setGroups(safe);
      if (safe.length > 0) setExpanded(new Set([safe[0].id]));
    } catch {
      toast.error('Không thể tải danh sách thuộc tính');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const openCreate = () => {
    setEditingGroup(null);
    setGroupForm(EMPTY_GROUP);
    setOptionForm(EMPTY_OPTION);
    setShowGroupModal(true);
  };

  const openEdit = (g: AttributeGroup) => {
    setEditingGroup(g);
    setGroupForm({ name: g.name, type: g.type, required: g.required, status: g.status, options: [...(g.options ?? [])] });
    setOptionForm(EMPTY_OPTION);
    setShowGroupModal(true);
  };

  const addOptionToForm = () => {
    if (!optionForm.label.trim()) { toast.error('Vui lòng nhập tên tuỳ chọn'); return; }
    const newOpt: AttributeOption = { ...optionForm, id: Date.now().toString() };
    setGroupForm((f) => ({ ...f, options: [...f.options, newOpt] }));
    setOptionForm(EMPTY_OPTION);
  };

  const removeOptionFromForm = (id: string) => {
    setGroupForm((f) => ({ ...f, options: (f.options ?? []).filter((o) => o.id !== id) }));
  };

  const setDefaultOption = (id: string) => {
    setGroupForm((f) => ({
      ...f,
      options: (f.options ?? []).map((o) => ({ ...o, isDefault: o.id === id })),
    }));
  };

  const handleSaveGroup = async () => {
    if (!groupForm.name.trim()) { toast.error('Vui lòng nhập tên nhóm thuộc tính'); return; }
    if ((groupForm.options ?? []).length === 0) { toast.error('Thêm ít nhất một tuỳ chọn'); return; }
    try {
      setSavingGroup(true);
      if (editingGroup) {
        const updated = await attributeService.update(editingGroup.id, groupForm);
        setGroups((prev) => prev.map((g) => g.id === editingGroup.id ? updated : g));
        toast.success('Cập nhật thuộc tính thành công');
      } else {
        const created = await attributeService.create(groupForm);
        setGroups((prev) => [...prev, created]);
        setExpanded((prev) => new Set([...prev, created.id]));
        toast.success('Tạo thuộc tính thành công');
      }
      setShowGroupModal(false);
    } catch (e) {
      toast.error((e as Error).message ?? 'Có lỗi xảy ra');
    } finally {
      setSavingGroup(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await attributeService.remove(id);
      setGroups((prev) => prev.filter((g) => g.id !== id));
      toast.success('Đã xoá nhóm thuộc tính');
    } catch (e) {
      toast.error((e as Error).message ?? 'Không thể xoá');
    } finally {
      setDeleteId(null);
    }
  };

  const stagger = (i: number) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } });

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Tag className="w-6 h-6 text-primary" />
            Thuộc tính sản phẩm
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {loading ? 'Đang tải...' : `${groups.length} nhóm thuộc tính (Size, Đá, Đường, Topping...)`}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm shadow-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Thêm nhóm
        </motion.button>
      </motion.div>

      {/* Type legend */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        className="flex flex-wrap gap-3 text-xs"
      >
        {[
          { icon: Circle, label: 'Chọn một (single)', color: 'bg-blue-50 text-blue-700 border-blue-200' },
          { icon: CheckSquare, label: 'Chọn nhiều (multiple)', color: 'bg-violet-50 text-violet-700 border-violet-200' },
        ].map(({ icon: Icon, label, color }) => (
          <span key={label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-medium ${color}`}>
            <Icon className="w-3.5 h-3.5" /> {label}
          </span>
        ))}
      </motion.div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : groups.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-24 text-muted-foreground">
          <Tag className="w-14 h-14 mb-4 opacity-20" />
          <p className="font-semibold text-lg">Chưa có nhóm thuộc tính nào</p>
          <p className="text-sm mt-1">Tạo nhóm đầu tiên như Size, Đá, Topping...</p>
          <button onClick={openCreate} className="mt-5 text-primary text-sm font-semibold hover:underline">+ Thêm nhóm</button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {groups.map((group, index) => {
            const isOpen = expanded.has(group.id);
            const TypeIcon = group.type === 'single' ? Circle : CheckSquare;
            return (
              <motion.div key={group.id} {...stagger(index)}
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                {/* Group header */}
                <div
                  className="flex items-center gap-3 p-4 md:p-5 cursor-pointer hover:bg-secondary/40 transition-colors select-none"
                  onClick={() => toggleExpand(group.id)}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Tag className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-base">{group.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1 ${group.type === 'single' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-violet-50 text-violet-700 border-violet-200'}`}>
                        <TypeIcon className="w-3 h-3" />
                        {group.type === 'single' ? 'Chọn một' : 'Chọn nhiều'}
                      </span>
                      {group.required && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-600 border border-red-200">Bắt buộc</span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${group.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {group.status === 'active' ? 'Hoạt động' : 'Tạm ẩn'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{(group.options ?? []).length} tuỳ chọn</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => openEdit(group)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                      <Edit className="w-4 h-4 text-primary" />
                    </button>
                    <button onClick={() => setDeleteId(group.id)} className="p-2 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-secondary transition-colors ml-1">
                      {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </button>
                  </div>
                </div>

                {/* Options list */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border px-4 md:px-5 py-4 bg-secondary/20">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                          {(group.options ?? []).map((opt) => (
                            <motion.div key={opt.id}
                              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                              className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-sm ${opt.isDefault ? 'bg-primary/8 border-primary/30' : 'bg-card border-border'}`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <GripVertical className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                                <span className="font-medium truncate">{opt.label}</span>
                                {opt.isDefault && <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />}
                              </div>
                              <span className={`text-xs font-semibold shrink-0 ${opt.price && opt.price > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                                {fmt(opt.price ?? 0)}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Group Create/Edit Modal */}
      <AnimatePresence>
        {showGroupModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowGroupModal(false)}
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-card rounded-2xl w-full max-w-lg border border-border shadow-2xl pointer-events-auto flex flex-col max-h-[90vh]">
                {/* Modal header */}
                <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
                  <h3 className="font-bold text-lg">
                    {editingGroup ? 'Chỉnh sửa nhóm thuộc tính' : 'Thêm nhóm thuộc tính mới'}
                  </h3>
                  <button onClick={() => setShowGroupModal(false)} className="p-2 rounded-lg hover:bg-secondary">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="overflow-y-auto flex-1 p-5 space-y-5">
                  {/* Group name */}
                  <div>
                    <label className="text-sm font-semibold mb-1.5 block">Tên nhóm <span className="text-red-500">*</span></label>
                    <input
                      value={groupForm.name}
                      onChange={(e) => setGroupForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="VD: Size, Đá, Đường, Topping..."
                      className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  {/* Type & Required */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-semibold mb-1.5 block">Kiểu chọn</label>
                      <select
                        value={groupForm.type}
                        onChange={(e) => setGroupForm((f) => ({ ...f, type: e.target.value as 'single' | 'multiple' }))}
                        className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="single">Chọn một</option>
                        <option value="multiple">Chọn nhiều</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-1.5 block">Trạng thái</label>
                      <select
                        value={groupForm.status}
                        onChange={(e) => setGroupForm((f) => ({ ...f, status: e.target.value as 'active' | 'inactive' }))}
                        className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Tạm ẩn</option>
                      </select>
                    </div>
                  </div>

                  {/* Required toggle */}
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                    <div>
                      <p className="text-sm font-semibold">Bắt buộc chọn</p>
                      <p className="text-xs text-muted-foreground">Khách phải chọn trước khi thêm vào giỏ</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setGroupForm((f) => ({ ...f, required: !f.required }))}
                      className="text-primary"
                    >
                      {groupForm.required
                        ? <ToggleRight className="w-8 h-8 text-primary" />
                        : <ToggleLeft className="w-8 h-8 text-muted-foreground" />}
                    </button>
                  </div>

                  {/* Options section */}
                  <div>
                    <label className="text-sm font-semibold mb-2 block">
                      Danh sách tuỳ chọn <span className="text-red-500">*</span>
                      <span className="ml-2 text-xs font-normal text-muted-foreground">({(groupForm.options ?? []).length} tuỳ chọn)</span>
                    </label>

                    {/* Existing options */}
                    {(groupForm.options ?? []).length > 0 && (
                      <div className="space-y-2 mb-3">
                        {(groupForm.options ?? []).map((opt) => (
                          <div key={opt.id} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm ${opt.isDefault ? 'bg-amber-50 border-amber-200' : 'bg-background border-border'}`}>
                            <button type="button" onClick={() => setDefaultOption(opt.id)} title="Đặt làm mặc định" className="shrink-0">
                              <Star className={`w-4 h-4 ${opt.isDefault ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/40 hover:text-amber-400'}`} />
                            </button>
                            <span className="flex-1 font-medium">{opt.label}</span>
                            <span className="text-xs text-muted-foreground">{fmt(opt.price ?? 0)}</span>
                            <button type="button" onClick={() => removeOptionFromForm(opt.id)} className="p-1 hover:bg-red-50 rounded-lg">
                              <X className="w-3.5 h-3.5 text-red-400" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add new option row */}
                    <div className="flex gap-2">
                      <input
                        value={optionForm.label}
                        onChange={(e) => setOptionForm((f) => ({ ...f, label: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && addOptionToForm()}
                        placeholder="Tên tuỳ chọn (VD: M, Ít đá...)"
                        className="flex-1 px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-w-0"
                      />
                      <input
                        type="number"
                        value={optionForm.price ?? 0}
                        onChange={(e) => setOptionForm((f) => ({ ...f, price: Number(e.target.value) }))}
                        placeholder="Giá thêm"
                        className="w-24 px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={addOptionToForm}
                        className="px-3 py-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </motion.button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">Nhấn ★ để đặt làm mặc định • Giá thêm = 0 nghĩa là miễn phí</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-5 border-t border-border shrink-0">
                  <button onClick={() => setShowGroupModal(false)} className="flex-1 py-2.5 border border-border rounded-xl text-sm font-semibold hover:bg-secondary transition-colors">
                    Huỷ
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSaveGroup}
                    disabled={savingGroup}
                    className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {savingGroup && <Loader2 className="w-4 h-4 animate-spin" />}
                    {savingGroup ? 'Đang lưu...' : editingGroup ? 'Cập nhật' : 'Tạo nhóm'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)} className="fixed inset-0 bg-black/50 z-40" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-card rounded-2xl p-6 w-full max-w-sm border border-border shadow-2xl text-center pointer-events-auto">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="font-bold text-lg mb-2">Xoá nhóm thuộc tính?</h3>
                <p className="text-muted-foreground text-sm mb-6">Hành động này không thể hoàn tác. Tất cả tuỳ chọn trong nhóm sẽ bị xoá.</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-border rounded-xl text-sm font-semibold hover:bg-secondary">Huỷ</button>
                  <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600">Xoá</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
