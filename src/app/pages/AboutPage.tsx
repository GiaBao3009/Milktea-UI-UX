import { motion } from 'motion/react';
import { ArrowRight, Heart, Leaf, MapPin, Shield, Sparkles, Star, Users } from 'lucide-react';
import { Link } from 'react-router';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/ScrollReveal';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { products } from '../data/products';

const VALUES = [
  {
    icon: Leaf,
    title: 'Nguyên liệu tự nhiên',
    description: 'Trà lá, trái cây tươi và topping được chọn lọc kỹ, không dùng hương liệu nhân tạo.',
  },
  {
    icon: Heart,
    title: 'Tâm huyết từng ly',
    description: 'Mỗi ly được pha chế cẩn thận, trân châu nấu mới mỗi ngày để giữ độ dẻo tự nhiên.',
  },
  {
    icon: Shield,
    title: 'An toàn vệ sinh',
    description: 'Quy trình sản xuất đạt chuẩn ATTP, nguyên liệu có nguồn gốc rõ ràng, truy xuất được.',
  },
  {
    icon: Users,
    title: 'Cộng đồng yêu trà',
    description: 'Hơn 12.000 hội viên tin tưởng và đồng hành cùng Fresh Bubble Tea mỗi ngày.',
  },
];

const MILESTONES = [
  { year: '2022', event: 'Ra mắt cửa hàng đầu tiên tại Quận 1, TP.HCM' },
  { year: '2023', event: 'Mở rộng lên 5 chi nhánh, ra mắt chương trình hội viên' },
  { year: '2024', event: 'Đạt 10.000 hội viên, ra mắt dòng sản phẩm theo mùa' },
  { year: '2025', event: 'Nâng cấp trải nghiệm đặt hàng online, mở rộng giao hàng' },
  { year: '2026', event: 'Hướng tới 20 chi nhánh trên toàn quốc' },
];

export function AboutPage() {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        backgroundColor: '#f9fafb',
      }}
    >
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-[#d8eadf]/50 blur-[100px]" />
          <div className="absolute -right-20 top-40 h-[400px] w-[400px] rounded-full bg-[#f68749]/25 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1240px] px-4 py-20 md:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-6 flex items-center gap-3">

                <span className="rounded-full bg-[#fff4e9] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-[#fb6514]">
                  Giới thiệu
                </span>
              </div>
              <h1
                className="mb-6 font-bold leading-tight tracking-[-0.03em] text-[#101828]"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
              >
                Câu chuyện của
                <br />
                <span className="text-[#fb6514]">Fresh Bubble Tea</span>
              </h1>
              <p className="mb-8 max-w-lg text-lg leading-relaxed text-[#344054]">
                Chúng tôi tin rằng một ly trà sữa ngon không chỉ đến từ công thức,
                mà còn từ sự tỉ mỉ trong từng nguyên liệu, cách pha chế và trải nghiệm
                mà khách hàng nhận được.
              </p>
              <Link
                to="/thuc-don"
                className="group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: '#fb6514',
                  boxShadow: '0 10px 30px rgba(61,103,81,0.25)',
                }}
              >
                Khám phá thực đơn
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] shadow-[0_32px_80px_rgba(61,103,81,0.2)]">
                <ImageWithFallback
                  src={products[6].image}
                  alt="Fresh Bubble Tea"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a28]/50 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-white/15 p-5 backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <Star size={20} fill="white" className="text-white" />
                    <div>
                      <p className="text-sm font-bold text-white">4.8/5 đánh giá</p>
                      <p className="text-xs text-white/70">Từ hơn 12.000 khách hàng</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="mx-auto max-w-[1240px] px-4 md:px-8">
          <ScrollReveal className="mb-14 text-center">
            <span className="mb-4 inline-flex rounded-full bg-[#fff4e9] px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-[#fb6514]">
              Giá trị cốt lõi
            </span>
            <h2
              className="mb-4 font-bold tracking-[-0.03em] text-[#101828]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              Điều làm nên Fresh Bubble Tea
            </h2>
          </ScrollReveal>

          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.08}>
            {VALUES.map((item) => {
              const Icon = item.icon;
              return (
                <StaggerItem key={item.title}>
                  <article className="group h-full rounded-[1.75rem] border border-white/80 bg-white/90 p-6 shadow-[0_8px_32px_rgba(61,103,81,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(61,103,81,0.12)]">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff4e9] text-[#fb6514] transition-colors duration-300 group-hover:bg-[#fb6514] group-hover:text-white">
                      <Icon size={22} />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-[#101828]">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-[#344054]">{item.description}</p>
                  </article>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="mx-auto max-w-[1240px] px-4 md:px-8">
          <ScrollReveal className="mb-14 text-center">
            <span className="mb-4 inline-flex rounded-full bg-[#fff4e9] px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-[#fb6514]">
              Hành trình
            </span>
            <h2
              className="mb-4 font-bold tracking-[-0.03em] text-[#101828]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              Dấu mốc phát triển
            </h2>
          </ScrollReveal>

          <div className="mx-auto max-w-3xl">
            <StaggerContainer className="relative space-y-0" staggerDelay={0.1}>
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-[#d4eddb] md:left-1/2 md:-translate-x-px" />

              {MILESTONES.map((milestone, index) => (
                <StaggerItem key={milestone.year}>
                  <div className={`relative flex items-start gap-6 pb-10 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fb6514] text-sm font-bold text-white shadow-lg md:absolute md:left-1/2 md:-translate-x-1/2">
                      {milestone.year}
                    </div>
                    <div className={`flex-1 rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(61,103,81,0.06)] ${index % 2 === 0 ? 'md:mr-[calc(50%+2rem)] md:text-right' : 'md:ml-[calc(50%+2rem)]'}`}>
                      <p className="text-sm leading-relaxed text-[#1d2939]">{milestone.event}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="mx-auto max-w-[1240px] px-4 md:px-8">
          <ScrollReveal>
            <div
              className="relative overflow-hidden rounded-[2.5rem] p-10 text-center text-white shadow-[0_24px_70px_rgba(61,103,81,0.22)] md:p-14"
              style={{
                background: '#fb6514',
              }}
            >
              <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5" />
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Hãy để chúng tôi phục vụ bạn
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-white/75">
                Ghé thăm cửa hàng hoặc đặt online — chúng tôi luôn sẵn sàng mang tới ly trà sữa ngon nhất.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/thuc-don"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-bold text-[#2f523f] shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  Đặt hàng ngay <ArrowRight size={18} />
                </Link>
                <Link
                  to="/lien-he"
                  className="inline-flex items-center rounded-full border border-white/25 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <MapPin size={16} className="mr-2" />
                  Liên hệ
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
