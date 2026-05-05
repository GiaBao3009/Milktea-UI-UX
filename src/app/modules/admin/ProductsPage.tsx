import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Edit, Trash2, Coffee, X, Loader2, ImageIcon, ToggleLeft, ToggleRight } from 'lucide-react';
import { useTrans } from '@app/hooks/useTranslation';
import { toast } from 'sonner';
import {
  productService,
  type Product, type Category, type ProductPayload, type CategoryPayload, type ProductAttribute,
} from '@app/modules/product-catalog/services/productService';

const EMPTY_FORM: ProductPayload = {
  name: '',
  categoryId: '',
  description: '',
  basePrice: 0,
  imageUrl: '',
  isActive: '1',
  productAttributes: [],
};

export default function ProductsPage() {
  const { t } = useTrans();
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [showProdModal, setShowProdModal] = useState(false);
  const [editingProd, setEditingProd] = useState<Product | null>(null);
  const [prodForm, setProdForm] = useState<ProductPayload>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catForm, setCatForm] = useState<CategoryPayload>({ name: '', status: 'active' });

  const [deleteTarget, setDeleteTarget] = useState<{ type: 'product' | 'category'; id: string } | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const [prods, cats] = await Promise.all([productService.getProducts(), productService.getCategories()]);
      setProducts(prods);
      setCategories(cats);
    } catch {
      toast.error(t('admin.products.messages.load_error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.categoryName ?? '').toLowerCase().includes(search.toLowerCase())
  );

  // Product CRUD
  const openCreateProd = () => {
    setEditingProd(null);
    setProdForm({ ...EMPTY_FORM, categoryId: categories[0]?.id ?? '' });
    setShowProdModal(true);
  };
  const openEditProd = (p: Product) => {
    setEditingProd(p);
    setProdForm({
      name: p.name,
      categoryId: p.categoryId,
      description: p.description ?? '',
      basePrice: p.basePrice ?? p.sizes?.[0]?.price ?? 0,
      imageUrl: p.imageUrl ?? p.image ?? '',
      isActive: p.isActive ?? (p.status === 'active' ? '1' : '0'),
      productAttributes: p.productAttributes ?? [],
    });
    setShowProdModal(true);
  };
  const saveProd = async () => {
    if (!prodForm.name || !prodForm.categoryId) { toast.error(t('admin.products.messages.fill_info')); return; }
    if (prodForm.basePrice < 0) { toast.error('Giá gốc không được âm'); return; }
    try {
      setSaving(true);
      if (editingProd) {
        const updated = await productService.updateProduct(editingProd.id, prodForm);
        setProducts((prev) => prev.map((p) => p.id === editingProd.id ? updated : p));
        toast.success(t('admin.products.messages.update_success'));
      } else {
        const created = await productService.createProduct(prodForm);
        setProducts((prev) => [...prev, created]);
        toast.success(t('admin.products.messages.create_success'));
      }
      setShowProdModal(false);
    } catch (e) { toast.error((e as Error).message ?? t('admin.products.messages.error')); }
    finally { setSaving(false); }
  };

  // Attribute helpers
  const addAttr = () => setProdForm((f) => ({
    ...f, productAttributes: [...f.productAttributes, { attributeId: 1, name: '', priceDelta: 0 }],
  }));
  const updateAttr = (i: number, key: keyof ProductAttribute, val: string | number) =>
    setProdForm((f) => ({ ...f, productAttributes: f.productAttributes.map((a, idx) => idx === i ? { ...a, [key]: val } : a) }));
  const removeAttr = (i: number) =>
    setProdForm((f) => ({ ...f, productAttributes: f.productAttributes.filter((_, idx) => idx !== i) }));

  // Category CRUD
  const openCreateCat = () => { setEditingCat(null); setCatForm({ name: '', status: 'active', sortOrder: categories.length + 1 }); setShowCatModal(true); };
  const openEditCat = (c: Category) => { setEditingCat(c); setCatForm({ name: c.name, status: c.status, sortOrder: c.sortOrder }); setShowCatModal(true); };
  const saveCat = async () => {
    if (!catForm.name) { toast.error(t('admin.products.messages.cat_name_required')); return; }
    try {
      setSaving(true);
      if (editingCat) {
        const updated = await productService.updateCategory(editingCat.id, catForm);
        setCategories((prev) => prev.map((c) => c.id === editingCat.id ? updated : c));
        toast.success(t('admin.products.messages.update_cat_success'));
      } else {
        const created = await productService.createCategory(catForm);
        setCategories((prev) => [...prev, created]);
        toast.success(t('admin.products.messages.create_cat_success'));
      }
      setShowCatModal(false);
    } catch (e) { toast.error((e as Error).message ?? t('admin.products.messages.error')); }
    finally { setSaving(false); }
  };

  // Delete
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'product') {
        await productService.removeProduct(deleteTarget.id);
        setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        toast.success(t('admin.products.messages.delete_prod_success'));
      } else {
        await productService.removeCategory(deleteTarget.id);
        setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        toast.success(t('admin.products.messages.delete_cat_success'));
      }
    } catch (e) { toast.error((e as Error).message ?? t('admin.products.messages.delete_error')); }
    finally { setDeleteTarget(null); }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t('admin.products.title')}</h2>
          <p className="text-muted-foreground">{t('admin.products.subtitle')}</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={activeTab === 'products' ? openCreateProd : openCreateCat}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 hover:bg-primary/90">
          <Plus className="w-4 h-4" /><span>{t('admin.products.add_new')}</span>
        </motion.button>
      </div>

      <div className="flex gap-3 border-b border-border">
        {([['products', `${t('admin.products.products_tab')} (${products.length})`], ['categories', `${t('admin.products.categories_tab')} (${categories.length})`]] as const).map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`px-4 py-3 font-medium transition-colors relative text-sm ${activeTab === id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            {label}
            {activeTab === id && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : activeTab === 'products' ? (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder={t('admin.products.search_placeholder')}
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <motion.div key={product.id} whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(251,101,20,0.12)' }}
                className="bg-card rounded-xl border border-border overflow-hidden">
                {/* Image */}
                <div className="relative w-full aspect-video bg-secondary/40">
                  {product.imageUrl || product.image ? (
                    <img src={product.imageUrl ?? product.image} alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Coffee className="w-10 h-10 text-muted-foreground/30" />
                    </div>
                  )}
                  {/* isActive badge */}
                  <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${product.isActive === '0' ? 'bg-gray-800/70 text-gray-200' : 'bg-green-500/90 text-white'}`}>
                    {product.isActive === '0' ? 'Ẩn' : 'Hiện'}
                  </span>
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button onClick={() => openEditProd(product)} className="p-1.5 bg-white/90 hover:bg-white rounded-lg shadow-sm"><Edit className="w-3.5 h-3.5 text-primary" /></button>
                    <button onClick={() => setDeleteTarget({ type: 'product', id: product.id })} className="p-1.5 bg-white/90 hover:bg-white rounded-lg shadow-sm"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
                  </div>
                </div>
                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-0.5 truncate">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{product.categoryName}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary text-sm">
                      {(product.basePrice ?? product.sizes?.[0]?.price ?? 0).toLocaleString('vi-VN')}đ
                    </span>
                    {(product.productAttributes?.length ?? 0) > 0 && (
                      <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                        {product.productAttributes!.length} size
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                {[t('admin.products.columns.category_name'), t('admin.products.columns.product_count'), t('admin.products.columns.status'), t('admin.products.columns.action')].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-sm font-semibold text-primary">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-t border-border hover:bg-secondary/20">
                  <td className="px-6 py-4 font-medium">{cat.name}</td>
                  <td className="px-6 py-4 text-sm">{cat.productCount ?? 0}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">{t('admin.products.status.active')}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEditCat(cat)} className="p-2 hover:bg-secondary rounded-lg"><Edit className="w-4 h-4 text-primary" /></button>
                      <button onClick={() => setDeleteTarget({ type: 'category', id: cat.id })} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Modal */}
      <AnimatePresence>
        {showProdModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowProdModal(false)} className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-card rounded-2xl w-full max-w-lg border border-border shadow-2xl pointer-events-auto flex flex-col max-h-[92vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                  <h3 className="text-lg font-bold">{editingProd ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
                  <button onClick={() => setShowProdModal(false)} className="p-1.5 rounded-lg hover:bg-secondary"><X className="w-5 h-5" /></button>
                </div>

                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
                  {/* Image preview + URL */}
                  <div className="flex gap-3 items-start">
                    <div className="w-20 h-20 rounded-xl border border-border bg-secondary/40 flex items-center justify-center shrink-0 overflow-hidden">
                      {prodForm.imageUrl ? (
                        <img src={prodForm.imageUrl} alt="preview" className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <Coffee className="w-8 h-8 text-muted-foreground/40" />
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-semibold mb-1.5 block flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5" /> URL hình ảnh
                      </label>
                      <input value={prodForm.imageUrl ?? ''} onChange={(e) => setProdForm((f) => ({ ...f, imageUrl: e.target.value }))}
                        placeholder="https://cdn.example.com/image.jpg"
                        className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>

                  {/* Tên + Danh mục */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-semibold mb-1.5 block">Tên sản phẩm <span className="text-red-500">*</span></label>
                      <input value={prodForm.name} onChange={(e) => setProdForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Trà sữa trân châu..." className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-1.5 block">Danh mục <span className="text-red-500">*</span></label>
                      <select value={prodForm.categoryId} onChange={(e) => setProdForm((f) => ({ ...f, categoryId: e.target.value }))}
                        className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Mô tả */}
                  <div>
                    <label className="text-sm font-semibold mb-1.5 block">Mô tả</label>
                    <textarea value={prodForm.description ?? ''} onChange={(e) => setProdForm((f) => ({ ...f, description: e.target.value }))}
                      placeholder="Mô tả ngắn về sản phẩm..." rows={2}
                      className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
                  </div>

                  {/* Giá gốc + isActive */}
                  <div className="flex gap-3 items-end">
                    <div className="flex-1">
                      <label className="text-sm font-semibold mb-1.5 block">Giá gốc (đ) <span className="text-red-500">*</span></label>
                      <input type="number" min={0} value={prodForm.basePrice} onChange={(e) => setProdForm((f) => ({ ...f, basePrice: Number(e.target.value) }))}
                        placeholder="50000" className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                      {prodForm.basePrice > 0 && <p className="text-xs text-muted-foreground mt-1">{prodForm.basePrice.toLocaleString('vi-VN')}đ</p>}
                    </div>
                    <div className="flex items-center gap-2.5 pb-2.5">
                      <span className="text-sm font-semibold">Hiển thị</span>
                      <button type="button" onClick={() => setProdForm((f) => ({ ...f, isActive: f.isActive === '1' ? '0' : '1' }))}>
                        {prodForm.isActive === '1'
                          ? <ToggleRight className="w-8 h-8 text-primary" />
                          : <ToggleLeft className="w-8 h-8 text-muted-foreground" />}
                      </button>
                    </div>
                  </div>

                  {/* Product Attributes (size variants) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold">Tuỳ chọn size / giá thêm</label>
                      <button type="button" onClick={addAttr} className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                        <Plus className="w-3.5 h-3.5" /> Thêm
                      </button>
                    </div>
                    {prodForm.productAttributes.length === 0 ? (
                      <p className="text-xs text-muted-foreground bg-secondary/40 rounded-xl px-3 py-2.5">Chưa có tuỳ chọn nào. Nhấn "Thêm" để thêm size M, L, XL...</p>
                    ) : (
                      <div className="space-y-2">
                        {prodForm.productAttributes.map((a, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <input value={a.name} onChange={(e) => updateAttr(i, 'name', e.target.value)}
                              placeholder="Size M, Size L..." className="flex-1 px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                            <div className="relative w-28 shrink-0">
                              <input type="number" min={0} value={a.priceDelta} onChange={(e) => updateAttr(i, 'priceDelta', Number(e.target.value))}
                                placeholder="0" className="w-full pl-3 pr-7 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">+đ</span>
                            </div>
                            <button type="button" onClick={() => removeAttr(i)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-6 py-4 border-t border-border shrink-0">
                  <button onClick={() => setShowProdModal(false)} className="flex-1 py-2.5 border border-border rounded-xl text-sm font-semibold hover:bg-secondary">Huỷ</button>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={saveProd} disabled={saving}
                    className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2 hover:bg-primary/90">
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {saving ? 'Đang lưu...' : editingProd ? 'Cập nhật' : 'Tạo sản phẩm'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Category Modal */}
      <AnimatePresence>
        {showCatModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCatModal(false)} className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-card rounded-2xl p-6 w-full max-w-sm border border-border shadow-xl pointer-events-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">{editingCat ? t('admin.products.edit_category') : t('admin.products.add_category')}</h3>
                  <button onClick={() => setShowCatModal(false)}><X className="w-5 h-5" /></button>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">{t('admin.products.category_name')}</label>
                  <input value={catForm.name} onChange={(e) => setCatForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder={t('admin.products.category_name_placeholder')} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowCatModal(false)} className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium">{t('admin.products.cancel')}</button>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={saveCat} disabled={saving}
                    className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-60 flex items-center justify-center gap-2">
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {saving ? t('admin.products.saving') : editingCat ? t('admin.products.update') : t('admin.products.create')}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteTarget && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDeleteTarget(null)} className="fixed inset-0 bg-black/40 z-40" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-card rounded-2xl p-6 w-full max-w-sm border border-border shadow-xl text-center pointer-events-auto">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="font-bold text-lg mb-2">{t('admin.products.confirm_delete_title')}</h3>
                <p className="text-sm text-muted-foreground mb-6">{t('admin.products.confirm_delete_msg')}</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 border border-border rounded-lg text-sm">{t('admin.products.cancel')}</button>
                  <button onClick={confirmDelete} className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">{t('admin.products.delete')}</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
