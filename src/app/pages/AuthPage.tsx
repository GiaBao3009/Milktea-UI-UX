import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Award,
  Coffee,
  Crown,
  Gift,
  Heart,
  Percent,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/ScrollReveal';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { products } from '../data/products';

const MEMBER_TIERS = [
  {
    name: 'Lá Non',
    subtitle: 'Bắt đầu hành trình',
    icon: Coffee,
    color: '#000000ff',
    bg: '#fb6514',
    border: '#000000ff',
    points: '0 – 499',
    perks: ['Tích 1 điểm / 10.000₫', 'Ưu đãi sinh nhật', 'Đặt hàng nhanh'],
  },
  {
    name: 'Lá Xanh',
    subtitle: 'Quen thuộc & đặc biệt',
    icon: Award,
    color: '#000000ff',
    bg: '#fb6514',
    border: '#000000ff',
    points: '500 – 1.499',
    perks: ['Tích 1.5 điểm / 10.000₫', 'Miễn phí topping mỗi tuần', 'Upsize miễn phí x2/tháng', 'Nhận món mới sớm'],
    popular: true,
  },
  {
    name: 'Lá Vàng',
    subtitle: 'VIP của Fresh',
    icon: Crown,
    color: '#000000ff',
    bg: '#fb6514',
    border: '#000000ff',
    points: '1.500+',
    perks: ['Tích 2 điểm / 10.000₫', 'Miễn phí giao hàng', 'Upsize miễn phí không giới hạn', 'Ưu đãi độc quyền VIP', 'Quà tặng hàng quý'],
    isGold: true,
  },
];

const BENEFITS = [
  {
    icon: Heart,
    title: 'Lưu món yêu thích',
    description: 'Độ ngọt, topping, kiểu ly quen thuộc — tất cả được nhớ để lần sau đặt chỉ 1 chạm.',
  },
  {
    icon: Zap,
    title: 'Đặt lại siêu nhanh',
    description: 'Đơn hàng gần nhất hiển thị ngay khi mở app, chỉ cần xác nhận là xong.',
  },
  {
    icon: Gift,
    title: 'Quà sinh nhật',
    description: 'Một ly miễn phí vào tháng sinh nhật — lời chúc ngọt từ Fresh dành riêng bạn.',
  },
  {
    icon: Star,
    title: 'Nhận món mới sớm',
    description: 'Phiên bản giới hạn và đồ uống theo mùa được giới thiệu trước cho hội viên.',
  },
  {
    icon: Percent,
    title: 'Tích điểm đổi quà',
    description: 'Mỗi ly bạn mua đều tích điểm, đổi món miễn phí hoặc voucher hấp dẫn.',
  },
  {
    icon: ShieldCheck,
    title: 'Ưu đãi độc quyền',
    description: 'Flash sale, combo giảm giá và event chỉ dành riêng cho thành viên.',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Tạo tài khoản',
    description: 'Đăng ký nhanh bằng Google hoặc Facebook — chỉ mất 30 giây.',
  },
  {
    step: '02',
    title: 'Đặt món & tích điểm',
    description: 'Mỗi đơn hàng đều tự động tích điểm vào tài khoản hội viên.',
  },
  {
    step: '03',
    title: 'Lên hạng & nhận quà',
    description: 'Càng nhiều điểm, hạng càng cao và ưu đãi càng hấp dẫn.',
  },
];

const STATS = [
  { value: '12.000+', label: 'Hội viên' },
  { value: '98%', label: 'Hài lòng' },
  { value: '250.000+', label: 'Ly đã phục vụ' },
  { value: '4.8★', label: 'Đánh giá' },
];

export function AuthPage() {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        backgroundColor: '#f9fafb',
      }}
    >
      {/* ── Hero Section ─────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background blurs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-[#d8eadf]/60 blur-[100px]" />
          <div className="absolute -right-20 top-40 h-[400px] w-[400px] rounded-full bg-[#f68749]/30 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1240px] px-4 py-16 md:px-8 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-6 flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="h-14 w-auto object-contain drop-shadow-[0_8px_16px_rgba(61,103,81,0.2)]"
                />
                <span className="rounded-full bg-[#fff4e9] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-[#fb6514]">
                  Hội viên Fresh
                </span>
              </div>

              <h1
                className="mb-6 font-bold leading-[1.05] tracking-[-0.03em] text-[#101828]"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4.2rem)' }}
              >
                Uống nhiều hơn.
                <br />
                <span className="text-[#fb6514]">Nhận nhiều hơn.</span>
              </h1>

              <p className="mb-8 max-w-lg text-lg leading-relaxed text-[#344054]">
                Tham gia chương trình hội viên Fresh Bubble Tea để tích điểm
                mỗi lần đặt món, lên hạng nhận ưu đãi độc quyền và luôn là người
                đầu tiên thử những phiên bản giới hạn.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/dang-nhap"
                  className="group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                  style={{
                    background: '#fb6514',
                    boxShadow: '0 10px 30px rgba(61,103,81,0.25)',
                  }}
                >
                  Tham gia ngay
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  to="/thuc-don"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-[#fb6514]/20 px-7 py-3.5 font-semibold text-[#fb6514] transition-all duration-300 hover:border-[#fb6514]/40 hover:bg-[#fff4e9]"
                >
                  Xem thực đơn
                </Link>
              </div>

              {/* Stats row */}
              <div className="mt-12 grid grid-cols-4 gap-4">
                {STATS.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center"
                  >
                    <p className="text-xl font-bold text-[#fb6514] md:text-2xl">{stat.value}</p>
                    <p className="mt-1 text-xs text-[#344054]">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right image */}
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] shadow-[0_32px_80px_rgba(61,103,81,0.2)]">
                <ImageWithFallback
                  src={products[2].image}
                  alt="Matcha Fresh Bubble Tea"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a28]/60 via-transparent to-transparent" />

                {/* Floating card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-white/15 p-5 backdrop-blur-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/25">
                      <TrendingUp size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">+320 điểm tháng này</p>
                      <p className="text-xs text-white/70">Còn 180 điểm nữa để lên Lá Vàng</p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '64%' }}
                      transition={{ delay: 1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full"
                      style={{ background: '#fb6514' }}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5, type: 'spring', stiffness: 200 }}
                className="absolute -left-6 top-8 flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-[0_12px_40px_rgba(26,28,28,0.1)]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff4e9]">
                  <Sparkles size={16} className="text-[#fb6514]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#101828]">Hạng Lá Xanh</p>
                  <p className="text-[11px] text-[#344054]">820 điểm tích lũy</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Quyền lợi hội viên ──────────────────────── */}
      <section className="relative py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[#fff4e9]/50 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1240px] px-4 md:px-8">
          <ScrollReveal className="mb-14 text-center">
            <span className="mb-4 inline-flex rounded-full bg-[#fff4e9] px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-[#fb6514]">
              Quyền lợi
            </span>
            <h2
              className="mb-4 font-bold tracking-[-0.03em] text-[#101828]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              Đặc quyền dành riêng cho hội viên
            </h2>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#344054]">
              Mỗi ly trà sữa bạn đặt đều mang lại giá trị — từ tích điểm, nhận quà tới trải nghiệm VIP.
            </p>
          </ScrollReveal>

          <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.08}>
            {BENEFITS.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <StaggerItem key={benefit.title}>
                  <article className="group h-full rounded-[1.75rem] border border-white/80 bg-white/90 p-6 shadow-[0_8px_32px_rgba(61,103,81,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(61,103,81,0.12)]">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff4e9] text-[#fb6514] transition-colors duration-300 group-hover:bg-[#fb6514] group-hover:text-white">
                      <Icon size={22} />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-[#101828]">{benefit.title}</h3>
                    <p className="text-sm leading-relaxed text-[#344054]">{benefit.description}</p>
                  </article>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Hạng thành viên ──────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-[1240px] px-4 md:px-8">
          <ScrollReveal className="mb-14 text-center">
            <span className="mb-4 inline-flex rounded-full bg-[#fff4e9] px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-[#fb6514]">
              Hạng thành viên
            </span>
            <h2
              className="mb-4 font-bold tracking-[-0.03em] text-[#101828]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              Uống càng nhiều, hạng càng cao
            </h2>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#344054]">
              Ba cấp hạng hội viên với ưu đãi tăng dần — bắt đầu từ Lá Non và chinh phục Lá Vàng.
            </p>
          </ScrollReveal>

          <StaggerContainer className="grid gap-6 md:grid-cols-3" staggerDelay={0.12}>
            {MEMBER_TIERS.map((tier) => {
              const Icon = tier.icon;
              const isGold = tier.isGold;
              return (
                <StaggerItem key={tier.name}>
                  <div
                    className="relative h-full overflow-hidden rounded-[2rem] p-[1px] transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: isGold
                        ? '#fb6514'
                        : tier.popular
                          ? '#fb6514'
                          : '#e2e8e4',
                    }}
                  >
                    {tier.popular && (
                      <div className="absolute right-5 top-5 z-10 rounded-full bg-[#fb6514] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                        Phổ biến
                      </div>
                    )}

                    <div
                      className="relative h-full rounded-[calc(2rem-1px)] p-7"
                      style={{
                        background: isGold ? tier.bg : 'white',
                      }}
                    >
                      <div
                        className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
                        style={{
                          background: isGold ? 'rgba(255,255,255,0.18)' : tier.bg,
                        }}
                      >
                        <Icon size={26} style={{ color: isGold ? '#d3eddc' : tier.color }} />
                      </div>

                      <h3
                        className="mb-1 text-2xl font-bold"
                        style={{ color: isGold ? '#fff4e9' : '#101828' }}
                      >
                        {tier.name}
                      </h3>
                      <p
                        className="mb-1 text-sm font-medium"
                        style={{ color: isGold ? 'rgba(255,255,255,0.7)' : '#344054' }}
                      >
                        {tier.subtitle}
                      </p>
                      <p
                        className="mb-6 text-xs font-semibold"
                        style={{ color: isGold ? '#f68749' : '#fb6514' }}
                      >
                        {tier.points} điểm
                      </p>

                      <div className="space-y-3">
                        {tier.perks.map((perk) => (
                          <div key={perk} className="flex items-start gap-2.5">
                            <div
                              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                              style={{
                                backgroundColor: isGold ? 'rgba(168,213,186,0.25)' : '#fff4e9',
                              }}
                            >
                              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                <path
                                  d="M1 4L3.5 6.5L9 1"
                                  stroke={isGold ? '#f68749' : '#fb6514'}
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <span
                              className="text-sm leading-relaxed"
                              style={{ color: isGold ? 'rgba(255,255,255,0.85)' : '#1d2939' }}
                            >
                              {perk}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Cách tham gia ────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-[1240px] px-4 md:px-8">
          <ScrollReveal className="mb-14 text-center">
            <span className="mb-4 inline-flex rounded-full bg-[#fff4e9] px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-[#fb6514]">
              Bắt đầu
            </span>
            <h2
              className="mb-4 font-bold tracking-[-0.03em] text-[#101828]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              3 bước đơn giản để tham gia
            </h2>
          </ScrollReveal>

          <StaggerContainer
            className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3"
            staggerDelay={0.15}
          >
            {HOW_IT_WORKS.map((item, index) => (
              <StaggerItem key={item.step}>
                <div className="relative text-center">
                  {/* Connector line */}
                  {index < HOW_IT_WORKS.length - 1 && (
                    <div className="absolute left-[calc(50%+48px)] top-10 hidden h-px w-[calc(100%-48px)] bg-[#d4eddb] md:block" />
                  )}
                  <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#fb6514]">
                    <span className="text-2xl font-bold text-[#fb6514]">{item.step}</span>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-[#101828]">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-[#344054]">{item.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────── */}
      <section className="pb-20">
        <div className="mx-auto max-w-[1240px] px-4 md:px-8">
          <ScrollReveal>
            <div
              className="relative overflow-hidden rounded-[2.5rem] p-10 text-white shadow-[0_24px_70px_rgba(61,103,81,0.22)] md:p-14"
              style={{
                background: '#fb6514',
              }}
            >
              {/* Decorative circles */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/5" />

              <div className="relative z-10 grid items-center gap-8 md:grid-cols-[1fr_auto]">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
                    Bước tiếp theo
                  </p>
                  <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                    Sẵn sàng bắt đầu hành trình hội viên?
                  </h2>
                  <p className="max-w-xl text-base leading-relaxed text-white/75">
                    Đăng ký miễn phí, bắt đầu tích điểm từ đơn hàng đầu tiên và khám phá
                    những đặc quyền chỉ dành riêng cho thành viên Fresh Bubble Tea.
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
