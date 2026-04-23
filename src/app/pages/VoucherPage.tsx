import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Clock, Copy, Gift, Percent, Sparkles, Tag, Ticket, Check } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/ScrollReveal';

const VOUCHERS = [
  {
    id: 'FRESH20',
    code: 'FRESH20',
    title: 'Giảm 20% đơn đầu tiên',
    description: 'Áp dụng cho tất cả sản phẩm trong thực đơn. Tối đa giảm 30.000₫.',
    discount: '20%',
    minOrder: '50.000₫',
    expiry: '31/05/2026',
    type: 'percent' as const,
    isNew: true,
  },
  {
    id: 'FREESHIP',
    code: 'FREESHIP',
    title: 'Miễn phí giao hàng',
    description: 'Miễn phí giao hàng cho đơn từ 80.000₫ trong bán kính 5km.',
    discount: 'Free Ship',
    minOrder: '80.000₫',
    expiry: '30/06/2026',
    type: 'shipping' as const,
  },
  {
    id: 'TOPPING0',
    code: 'TOPPING0',
    title: 'Tặng 1 topping bất kỳ',
    description: 'Chọn bất kỳ topping nào miễn phí khi đặt từ 2 ly trở lên.',
    discount: 'Free',
    minOrder: '2 ly',
    expiry: '15/05/2026',
    type: 'gift' as const,
    isHot: true,
  },
  {
    id: 'MEMBER50',
    code: 'MEMBER50',
    title: 'Hội viên giảm 50.000₫',
    description: 'Dành riêng cho hội viên hạng Lá Xanh trở lên. Đơn tối thiểu 150.000₫.',
    discount: '50K',
    minOrder: '150.000₫',
    expiry: '30/04/2026',
    type: 'fixed' as const,
    isMember: true,
  },
  {
    id: 'MATCHA15',
    code: 'MATCHA15',
    title: 'Giảm 15% dòng Matcha',
    description: 'Áp dụng cho tất cả sản phẩm trong danh mục Trà sữa đặc trưng.',
    discount: '15%',
    minOrder: '0₫',
    expiry: '20/05/2026',
    type: 'percent' as const,
  },
  {
    id: 'COMBO2',
    code: 'COMBO2',
    title: 'Combo 2 ly giảm 25.000₫',
    description: 'Đặt bất kỳ 2 ly, tự động giảm 25.000₫ trên tổng đơn.',
    discount: '25K',
    minOrder: '2 ly',
    expiry: '31/05/2026',
    type: 'fixed' as const,
    isNew: true,
  },
];

function getTypeIcon(type: string) {
  switch (type) {
    case 'percent': return <Percent size={20} />;
    case 'shipping': return <Ticket size={20} />;
    case 'gift': return <Gift size={20} />;
    case 'fixed': return <Tag size={20} />;
    default: return <Sparkles size={20} />;
  }
}

function getTypeBg(type: string) {
  switch (type) {
    case 'percent': return '#fb6514';
    case 'shipping': return '#fb6514';
    case 'gift': return '#fb6514';
    case 'fixed': return '#fb6514';
    default: return '#fb6514';
  }
}

export function VoucherPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div
      className="relative overflow-hidden"
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        backgroundColor: '#f9fafb',
      }}
    >
      {/* Background blurs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-[#d8eadf]/50 blur-[100px]" />
        <div className="absolute -right-20 top-60 h-[400px] w-[400px] rounded-full bg-[#f68749]/25 blur-[100px]" />
      </div>

      {/* Hero */}
      <section className="relative z-10 pb-8 pt-16">
        <div className="mx-auto max-w-[1240px] px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#fff4e9] px-5 py-2 text-xs font-bold uppercase tracking-[0.25em] text-[#fb6514]">
              <Sparkles size={14} />
              Ưu đãi
            </span>
            <h1
              className="mb-5 font-bold leading-tight tracking-[-0.03em] text-[#101828]"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
            >
              Mã giảm giá & Voucher
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#344054]">
              Sao chép mã và áp dụng khi thanh toán để nhận ưu đãi hấp dẫn từ Fresh Bubble Tea.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Voucher Grid */}
      <section className="relative z-10 py-12">
        <div className="mx-auto max-w-[1240px] px-4 md:px-8">
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.08}>
            {VOUCHERS.map((voucher) => (
              <StaggerItem key={voucher.id}>
                <article className="group relative h-full overflow-hidden rounded-[2rem] bg-white shadow-[0_8px_32px_rgba(61,103,81,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(61,103,81,0.12)]">
                  {/* Top colored strip */}
                  <div
                    className="flex items-center justify-between px-6 py-4"
                    style={{ background: getTypeBg(voucher.type) }}
                  >
                    <div className="flex items-center gap-3 text-white">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                        {getTypeIcon(voucher.type)}
                      </div>
                      <span className="text-2xl font-bold">{voucher.discount}</span>
                    </div>
                    <div className="flex gap-2">
                      {voucher.isNew && (
                        <span className="rounded-full bg-white/25 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                          Mới
                        </span>
                      )}
                      {voucher.isHot && (
                        <span className="rounded-full bg-[#ff6b6b]/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                          Hot
                        </span>
                      )}
                      {voucher.isMember && (
                        <span className="rounded-full bg-[#ffd700]/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#5a4000]">
                          VIP
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="mb-2 text-lg font-bold text-[#101828]">{voucher.title}</h3>
                    <p className="mb-4 text-sm leading-relaxed text-[#344054]">{voucher.description}</p>

                    <div className="mb-5 flex items-center gap-4 text-xs text-[#344054]">
                      <span className="flex items-center gap-1">
                        <Tag size={12} />
                        Tối thiểu: {voucher.minOrder}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        HSD: {voucher.expiry}
                      </span>
                    </div>

                    {/* Copy button */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 rounded-xl border-2 border-dashed border-[#d4eddb] bg-[#f7fbf8] px-4 py-2.5 text-center font-mono text-sm font-bold tracking-wider text-[#fb6514]">
                        {voucher.code}
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => handleCopy(voucher.code)}
                        className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200"
                        style={{
                          background: copiedCode === voucher.code
                            ? '#fb6514'
                            : '#fb6514',
                        }}
                      >
                        {copiedCode === voucher.code ? (
                          <>
                            <Check size={14} />
                            Đã sao chép
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            Sao chép
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 pb-20 pt-8">
        <div className="mx-auto max-w-[1240px] px-4 md:px-8">
          <ScrollReveal>
            <div
              className="relative overflow-hidden rounded-[2.5rem] p-10 text-white shadow-[0_24px_70px_rgba(61,103,81,0.22)] md:p-14"
              style={{
                background: '#fb6514',
              }}
            >
              <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/5" />

              <div className="relative z-10 grid items-center gap-8 md:grid-cols-[1fr_auto]">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
                    Nhiều hơn nữa
                  </p>
                  <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                    Tham gia hội viên để nhận ưu đãi độc quyền
                  </h2>
                  <p className="max-w-xl text-base leading-relaxed text-white/75">
                    Hội viên Fresh được nhận voucher riêng, ưu đãi sinh nhật và quyền truy cập
                    sớm các phiên bản giới hạn.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/dang-nhap"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-bold text-[#2f523f] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    Đăng ký ngay
                    <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/thuc-don"
                    className="inline-flex items-center justify-center rounded-full border border-white/25 px-7 py-3.5 font-semibold text-white transition-colors duration-300 hover:bg-white/10"
                  >
                    Xem thực đơn
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
