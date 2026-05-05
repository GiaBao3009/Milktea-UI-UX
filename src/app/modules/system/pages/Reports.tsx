import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { Download, Calendar, TrendingUp, ShoppingBag, Users, ChevronDown, DollarSign } from "lucide-react";
import { OrderService } from "@app/services/OrderService";
import { showToast } from "@app/utils/toast";

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >{children}</motion.div>
  );
}

export function Reports() {
  const [timeRange, setTimeRange] = useState('Tháng này');
  const [isExporting, setIsExporting] = useState(false);
  
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const handleRefresh = () => {
      setOrders(OrderService.getAllOrders());
      setUsers(JSON.parse(localStorage.getItem('milktea_users_clean') || '[]'));
    };
    handleRefresh();
    window.addEventListener('storage', handleRefresh);
    const interval = setInterval(handleRefresh, 3000);
    return () => {
      window.removeEventListener('storage', handleRefresh);
      clearInterval(interval);
    };
  }, []);

  // Compute real metrics
  const completedOrders = orders.filter(o => o.status === 'completed');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const totalUsers = users.length + 380; // offset for mock feel, or just use users.length if they prefer strict tracking
  // Wait, let's just use exact numbers from the arrays so they see their updates!
  const displayRevenue = totalRevenue;
  const displayOrders = orders.length;
  const displayUsers = users.length;

  const handleExport = () => {
    setIsExporting(true);
    showToast.loading("Đang tổng hợp dữ liệu báo cáo...");
    setTimeout(() => {
      setIsExporting(false);
      showToast.dismiss();
      showToast.success("Xuất File thành công", { description: "Báo cáo doanh thu và tổng quan đã được tải." });
      
      const blob = new Blob(["Ngày,Doanh Thu,Đơn Hàng\n20/04/2026,18500000,138"], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bao_cao_doanh_thu.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1500);
  };

  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '22px', fontWeight: 700, color: '#1A1A1A' }}>
            Báo cáo & Thống kê
          </h1>
          <p style={{ fontSize: '13.5px', color: '#A0845C' }}>Phân tích hiệu quả kinh doanh của hệ thống</p>
        </div>
        <div className="flex gap-3">
          {/* Time Filter */}
          <div className="relative">
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2.5 rounded-xl border outline-none font-medium"
              style={{ background: 'white', borderColor: '#F0DCC8', color: '#1A1A1A', fontSize: '13.5px' }}>
              {['Hôm nay', 'Tuần này', 'Tháng này', 'Năm nay'].map(t => <option key={t}>{t}</option>)}
            </select>
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#A0845C' }} />
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#A0845C' }} />
          </div>

          {/* Export Button */}
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${isExporting ? 'bg-orange-400 cursor-not-allowed opacity-80' : 'hover:shadow-lg hover:-translate-y-0.5'}`}
            style={{ background: '#F58220', color: 'white', fontWeight: 600, fontSize: '13.5px' }}
          >
            <Download size={16} className={isExporting ? 'animate-bounce' : ''} /> 
            {isExporting ? 'Đang xuất...' : 'Xuất File'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Doanh thu tổng', value: displayRevenue.toLocaleString('vi-VN') + 'đ', diff: '+15.2%', isUp: true, icon: DollarSign, bg: '#FFEDD5', color: '#9A3412' },
          { label: 'Số đơn hàng', value: displayOrders.toLocaleString('vi-VN'), diff: '+5.4%', isUp: true, icon: ShoppingBag, bg: '#EFF6FF', color: '#1E40AF' },
          { label: 'Khách hàng mới', value: displayUsers.toLocaleString('vi-VN'), diff: '+1.2%', isUp: true, icon: Users, bg: '#FEF3C7', color: '#92400E' },
          { label: 'Tỉ lệ hoàn thành', value: orders.length > 0 ? ((completedOrders.length / orders.length) * 100).toFixed(1) + '%' : '92%', diff: '+1.2%', isUp: true, icon: TrendingUp, bg: '#F3E8FF', color: '#6B21A8' },
        ].map((card, i) => (
          <FadeIn key={i} delay={i * 0.1}>
          <motion.div
            whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(245,130,32,0.15)' }}
            className="rounded-xl p-5" style={{ background: 'white', border: '0.5px solid #F0DCC8', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: card.bg, color: card.color }}>
                <card.icon size={20} />
              </div>
              <span className="px-2 py-1 rounded-md text-xs font-bold"
                style={{ background: card.isUp ? '#FFEDD5' : '#FEE2E2', color: card.isUp ? '#9A3412' : '#991B1B' }}>
                {card.diff}
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#A0845C', marginBottom: '4px' }}>{card.label}</div>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '24px', fontWeight: 800, color: '#1A1A1A' }}>
              {card.value}
            </div>
          </motion.div>
          </FadeIn>
        ))}
      </div>

      {/* Main Charts & Lists Area */}
      <FadeIn delay={0.2}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Revenue Chart Placeholder) */}
        <div className="lg:col-span-2 rounded-xl p-6" style={{ background: 'white', border: '0.5px solid #F0DCC8', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '16px', fontWeight: 700, color: '#1A1A1A' }}>Biểu đồ Doanh thu</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#F58220]"></div><span style={{ fontSize: '12px', color: '#A0845C' }}>Doanh thu</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#F5C088]"></div><span style={{ fontSize: '12px', color: '#A0845C' }}>Chi phí</span></div>
            </div>
          </div>
          
          {/* Mock Chart Area */}
          <div className="h-[300px] flex items-end justify-between gap-2 border-b border-l pb-2 pl-2" style={{ borderColor: '#F0DCC8' }}>
            {[30, 45, 25, 60, 75, 40, 85, 55, 90, 65, 80, 100].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end items-center gap-1 group relative">
                <div className="w-full bg-[#F58220] rounded-t-sm transition-all duration-300 hover:opacity-80" style={{ height: `${val}%` }}></div>
                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-[10px] px-2 py-1 rounded">
                  {val}M
                </div>
                <span style={{ fontSize: '10px', color: '#9CA3AF' }}>T{i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (Top Products) */}
        <div className="rounded-xl p-6" style={{ background: 'white', border: '0.5px solid #F0DCC8', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '16px', fontWeight: 700, color: '#1A1A1A', mb: '16px' }} className="mb-6">Sản phẩm bán chạy</h2>
          <div className="space-y-5">
            {[
              { name: 'Trà Sữa Trân Châu', sold: 450, total: '22.5M', percent: 85 },
              { name: 'Trà Đào Cam Sả', sold: 320, total: '14.4M', percent: 65 },
              { name: 'Cà Phê Sữa Đá', sold: 280, total: '8.4M', percent: 55 },
              { name: 'Trà Oolong Macchiato', sold: 210, total: '11.5M', percent: 45 },
              { name: 'Hồng Trà Sữa', sold: 150, total: '6.0M', percent: 30 },
            ].map((p, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#1A1A1A' }}>{p.name}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#F58220' }}>{p.total}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full" style={{ background: '#F3F4F6' }}>
                    <div className="h-full rounded-full" style={{ background: '#F58220', width: `${p.percent}%` }}></div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#A0845C', minWidth: '50px', textAlign: 'right' }}>{p.sold} ly</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      </FadeIn>
    </div>
  );
}
