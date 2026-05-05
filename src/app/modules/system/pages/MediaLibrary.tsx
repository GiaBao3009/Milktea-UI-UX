import { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, Copy, Trash2, Search, Filter, FolderPlus, Download, CheckCircle2, X } from "lucide-react";
import { products, toppings } from "@app/constants/mockData";
import { showToast } from "@app/utils/toast";

const initialMedia = [
  { id: '1', name: 'Banner Mùa Hè 2026', type: 'banner', size: '2.4 MB', dimensions: '1920x1080', date: '20/04/2026', url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80' },
  { id: '2', name: 'Trà Sữa Trân Châu', type: 'product', size: '1.2 MB', dimensions: '800x800', date: '19/04/2026', url: 'https://images.unsplash.com/photo-1599810694-b5ac1ea63fe2?w=800&q=80' },
  { id: '3', name: 'Trà Trái Cây Nhiệt Đới', type: 'product', size: '1.5 MB', dimensions: '800x800', date: '19/04/2026', url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80' },
  { id: '4', name: 'Icon Sale 50%', type: 'icon', size: '45 KB', dimensions: '128x128', date: '18/04/2026', url: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&q=80' },
  { id: '5', name: 'Matcha Đá Xay', type: 'product', size: '1.1 MB', dimensions: '800x800', date: '15/04/2026', url: 'https://images.unsplash.com/photo-1579440138250-88c522c4bafc?w=800&q=80' },
  { id: '6', name: 'Cà Phê Sữa Đá', type: 'product', size: '1.8 MB', dimensions: '800x800', date: '10/04/2026', url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&q=80' },
  { id: '7', name: 'Nước Cam Tươi', type: 'product', size: '1.3 MB', dimensions: '800x800', date: '08/04/2026', url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&q=80' },
  { id: '8', name: 'Trà Đào Cam Sả', type: 'product', size: '1.4 MB', dimensions: '800x800', date: '05/04/2026', url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80' },
];

const tabs = [
  { id: 'all', label: 'Tất cả file' },
  { id: 'product', label: 'Thức uống' },
  { id: 'banner', label: 'Banner & Poster' },
  { id: 'icon', label: 'Icon & Graphic' },
];

export function MediaLibrary() {
  const dynamicMedia = [
    ...products.filter(p => p.image && !p.image.includes('placeholder')).map(p => ({
      id: `p-${p.id}`, name: p.name,
      type: 'product', size: '1.2 MB', dimensions: '800x800', date: '20/04/2026', url: p.image
    })),
    ...toppings.filter(t => t.image && !t.image.includes('placeholder')).map(t => ({
      id: `t-${t.id}`, name: t.name,
      type: 'product', size: '800 KB', dimensions: '400x400', date: '20/04/2026', url: t.image
    }))
  ];

  const [mediaList, setMediaList] = useState([...dynamicMedia, ...initialMedia]);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    e.preventDefault();
    setIsUploading(false);
    let files: FileList | null = null;
    if ('dataTransfer' in e) files = e.dataTransfer.files;
    else if ('target' in e && (e.target as HTMLInputElement).files) files = (e.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      const newItems = Array.from(files).map(file => ({
        id: `upload-${Date.now()}-${Math.random()}`,
        name: file.name,
        type: file.type.includes('image') ? 'product' : 'banner',
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        dimensions: 'Tùy chỉnh',
        date: new Date().toLocaleDateString('vi-VN'),
        url: URL.createObjectURL(file)
      }));
      setMediaList(prev => [...newItems, ...prev]);
      showToast.success(`Đã tải lên ${files.length} file thành công!`);
    }
  };

  const filteredMedia = mediaList.filter(m =>
    (activeTab === 'all' || m.type === activeTab) &&
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast.success('Đã sao chép liên kết vào bộ nhớ tạm!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }} className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5 flex-shrink-0">
        <div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '22px', fontWeight: 700, color: '#1A1A1A' }}>
            Thư viện Media
          </h1>
          <p style={{ fontSize: '13.5px', color: '#A0845C' }}>Quản lý hình ảnh, video và tài liệu của hệ thống</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {/* Mobile filter toggle */}
          <button
            className="md:hidden flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all"
            style={{ borderColor: '#F0DCC8', color: '#1A1A1A', fontSize: '13px', fontWeight: 600 }}
            onClick={() => setSidebarOpen(true)}
          >
            <Filter size={16} /> Lọc
          </button>
          <button className="flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-xl border transition-all hover:bg-gray-50 text-sm"
            style={{ borderColor: '#F0DCC8', color: '#1A1A1A', fontWeight: 600 }}>
            <FolderPlus size={16} /> <span className="hidden sm:inline">Thêm thư mục</span>
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-xl transition-all text-sm"
            style={{ background: '#F58220', color: 'white', fontWeight: 600 }}>
            <UploadCloud size={16} /> <span className="hidden sm:inline">Tải lên</span>
          </button>
          <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" />
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative ml-auto w-72 h-full flex flex-col p-5 gap-5"
            style={{ background: 'white', boxShadow: '-4px 0 24px rgba(0,0,0,0.12)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <span style={{ fontWeight: 700, fontSize: '16px', color: '#1A1A1A' }}>Bộ lọc</span>
              <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X size={18} style={{ color: '#A0845C' }} />
              </button>
            </div>
            {/* Dropzone */}
            <div className="border-2 border-dashed rounded-2xl p-5 flex flex-col items-center text-center cursor-pointer"
              style={{ borderColor: '#F5C088', background: '#FFFAF5' }}
              onClick={() => { fileInputRef.current?.click(); setSidebarOpen(false); }}>
              <UploadCloud size={24} style={{ color: '#F58220', marginBottom: '8px' }} />
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}>Kéo thả hoặc click để upload</div>
              <div style={{ fontSize: '11px', color: '#A0845C' }}>Max 5MB</div>
            </div>
            {/* Categories */}
            <div>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#A0845C', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Phân loại</h3>
              <div className="space-y-1">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all"
                    style={{ background: activeTab === tab.id ? '#FFF3E6' : 'transparent', color: activeTab === tab.id ? '#F58220' : '#A0845C' }}>
                    <div className="flex items-center gap-2">
                      <ImageIcon size={16} />
                      <span style={{ fontSize: '13.5px', fontWeight: activeTab === tab.id ? 600 : 500 }}>{tab.label}</span>
                    </div>
                    {activeTab === tab.id && <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#F58220' }} />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-5 flex-1 min-h-0">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex w-56 xl:w-64 flex-shrink-0 flex-col gap-5">
          {/* Upload Dropzone */}
          <div className="border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all cursor-pointer"
            style={{ borderColor: isUploading ? '#F58220' : '#F5C088', background: isUploading ? '#FFF3E6' : '#FFFAF5' }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsUploading(true); }}
            onDragLeave={() => setIsUploading(false)}
            onDrop={handleFileUpload}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: '#FFF3E6', color: '#F58220' }}>
              <UploadCloud size={24} />
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '4px' }}>Kéo thả file vào đây</div>
            <div style={{ fontSize: '11px', color: '#A0845C' }}>hoặc click để chọn (Max 5MB)</div>
          </div>
          {/* Categories */}
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#A0845C', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Phân loại</h3>
            <div className="space-y-1">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all"
                  style={{ background: activeTab === tab.id ? '#FFF3E6' : 'transparent', color: activeTab === tab.id ? '#F58220' : '#A0845C' }}>
                  <div className="flex items-center gap-2">
                    <ImageIcon size={16} />
                    <span style={{ fontSize: '13.5px', fontWeight: activeTab === tab.id ? 600 : 500 }}>{tab.label}</span>
                  </div>
                  {activeTab === tab.id && <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#F58220' }} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl border overflow-hidden min-w-0" style={{ borderColor: '#F0DCC8', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          {/* Toolbar */}
          <div className="flex items-center justify-between p-4 border-b flex-shrink-0" style={{ borderColor: '#F0DCC8' }}>
            <div className="relative flex-1 max-w-xs">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm file..."
                className="w-full pl-9 pr-4 rounded-xl border outline-none transition-all"
                style={{ height: '38px', borderColor: '#F0DCC8', fontSize: '13px', background: '#FFFAF5' }}
                onFocus={(e) => e.target.style.borderColor = '#F5C088'}
                onBlur={(e) => e.target.style.borderColor = '#F0DCC8'}
              />
            </div>
            <span style={{ fontSize: '13px', color: '#A0845C', whiteSpace: 'nowrap', marginLeft: '12px' }}>{filteredMedia.length} file</span>
          </div>
          {/* Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            {filteredMedia.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: '#FFFAF5', color: '#9CA3AF' }}>
                  <ImageIcon size={32} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Trống</h3>
                <p style={{ fontSize: '13.5px', color: '#A0845C' }}>Không tìm thấy file nào phù hợp.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredMedia.map(m => (
                  <div key={m.id} className="group relative rounded-xl overflow-hidden border transition-all hover:shadow-md" style={{ borderColor: '#F0DCC8' }}>
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      <img src={m.url} alt={m.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button onClick={() => copyUrl(m.id, m.url)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform" title="Copy Link">
                          {copiedId === m.id ? <CheckCircle2 size={16} style={{ color: '#9A3412' }} /> : <Copy size={16} style={{ color: '#1A1A1A' }} />}
                        </button>
                        <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform" title="Tải xuống">
                          <Download size={16} style={{ color: '#1A1A1A' }} />
                        </button>
                        <button onClick={() => {
                          setMediaList(prev => prev.filter(item => item.id !== m.id));
                          showToast.error('Đã xóa file khỏi thư viện!');
                        }} className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform" title="Xóa">
                          <Trash2 size={16} style={{ color: '#991B1B' }} />
                        </button>
                      </div>
                    </div>
                    <div className="p-2.5 bg-white">
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#1A1A1A' }} className="truncate mb-0.5" title={m.name}>{m.name}</div>
                      <div className="flex items-center justify-between">
                        <span style={{ fontSize: '10px', color: '#A0845C' }}>{m.size}</span>
                        <span style={{ fontSize: '10px', color: '#9CA3AF' }}>{m.dimensions}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
