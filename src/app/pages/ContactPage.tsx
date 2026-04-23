import { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Mail, MapPin, Phone, Send, MessageCircle } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/ScrollReveal';

const BRANCHES = [
  {
    name: 'Fresh Bubble Tea — Quận 1',
    address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
    phone: '028 1234 5678',
    hours: '08:00 – 22:00',
  },
  {
    name: 'Fresh Bubble Tea — Quận 3',
    address: '456 Võ Văn Tần, Phường 5, Quận 3, TP.HCM',
    phone: '028 2345 6789',
    hours: '08:00 – 22:00',
  },
  {
    name: 'Fresh Bubble Tea — Quận 7',
    address: '789 Nguyễn Thị Thập, Tân Phú, Quận 7, TP.HCM',
    phone: '028 3456 7890',
    hours: '08:00 – 22:30',
  },
];

const CONTACT_INFO = [
  { icon: Phone, label: 'Hotline', value: '1900 1234', href: 'tel:19001234' },
  { icon: Mail, label: 'Email', value: 'hello@freshbubbletea.vn', href: 'mailto:hello@freshbubbletea.vn' },
  { icon: MessageCircle, label: 'Zalo', value: 'Fresh Bubble Tea', href: '#' },
  { icon: Clock, label: 'Giờ mở cửa', value: '08:00 – 22:00 hàng ngày', href: undefined },
];

export function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div
      className="relative overflow-hidden"
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        backgroundColor: '#f9fafb',
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-[#d8eadf]/50 blur-[100px]" />
        <div className="absolute -right-20 bottom-40 h-[400px] w-[400px] rounded-full bg-[#f68749]/25 blur-[100px]" />
      </div>

      {/* Hero */}
      <section className="relative z-10 pb-8 pt-16">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <span className="mb-4 inline-flex rounded-full bg-[#fff4e9] px-5 py-2 text-xs font-bold uppercase tracking-[0.25em] text-[#fb6514]">
              Liên hệ
            </span>
            <h1
              className="mb-5 font-bold leading-tight tracking-[-0.03em] text-[#101828]"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
            >
              Kết nối với chúng tôi
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#344054]">
              Có câu hỏi, góp ý hay muốn hợp tác? Chúng tôi luôn sẵn sàng lắng nghe bạn.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="relative z-10 py-8">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.08}>
            {CONTACT_INFO.map((info) => {
              const Icon = info.icon;
              const Wrapper = info.href ? 'a' : 'div';
              return (
                <StaggerItem key={info.label}>
                  <Wrapper
                    {...(info.href ? { href: info.href } : {})}
                    className="group flex items-center gap-4 rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(61,103,81,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(61,103,81,0.1)]"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff4e9] text-[#fb6514] transition-colors group-hover:bg-[#fb6514] group-hover:text-white">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#344054]">{info.label}</p>
                      <p className="text-sm font-bold text-[#101828]">{info.value}</p>
                    </div>
                  </Wrapper>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Form + Branches */}
      <section className="relative z-10 py-12">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Contact Form */}
            <ScrollReveal direction="left">
              <div className="rounded-[2rem] bg-white p-7 shadow-[0_12px_40px_rgba(61,103,81,0.06)] md:p-10">
                <h2 className="mb-2 text-2xl font-bold text-[#101828]">Gửi tin nhắn</h2>
                <p className="mb-7 text-sm text-[#344054]">Chúng tôi sẽ phản hồi trong vòng 24 giờ.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#1d2939]">Họ và tên</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nhập họ và tên"
                        className="w-full rounded-xl border-0 bg-[#f3f5f3] px-4 py-3 text-sm text-[#101828] outline-none transition-all placeholder:text-[#a3ada7] focus:bg-[#eef3ef] focus:ring-2 focus:ring-[#f68749]"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#1d2939]">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Nhập email"
                        className="w-full rounded-xl border-0 bg-[#f3f5f3] px-4 py-3 text-sm text-[#101828] outline-none transition-all placeholder:text-[#a3ada7] focus:bg-[#eef3ef] focus:ring-2 focus:ring-[#f68749]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#1d2939]">Chủ đề</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Bạn muốn hỏi về điều gì?"
                      className="w-full rounded-xl border-0 bg-[#f3f5f3] px-4 py-3 text-sm text-[#101828] outline-none transition-all placeholder:text-[#a3ada7] focus:bg-[#eef3ef] focus:ring-2 focus:ring-[#f68749]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#1d2939]">Nội dung</label>
                    <textarea
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Viết tin nhắn của bạn..."
                      className="w-full resize-none rounded-xl border-0 bg-[#f3f5f3] px-4 py-3 text-sm text-[#101828] outline-none transition-all placeholder:text-[#a3ada7] focus:bg-[#eef3ef] focus:ring-2 focus:ring-[#f68749]"
                    />
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.01]"
                    style={{
                      background: '#fb6514',
                      boxShadow: '0 8px 24px rgba(61,103,81,0.22)',
                    }}
                  >
                    <Send size={16} />
                    Gửi tin nhắn
                  </motion.button>
                </form>
              </div>
            </ScrollReveal>

            {/* Branches */}
            <ScrollReveal direction="right" delay={0.12}>
              <div className="space-y-5">
                <h2 className="mb-2 text-2xl font-bold text-[#101828]">Hệ thống cửa hàng</h2>
                <p className="mb-4 text-sm text-[#344054]">Ghé thăm chúng tôi tại các chi nhánh dưới đây.</p>

                {BRANCHES.map((branch) => (
                  <article
                    key={branch.name}
                    className="group rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(61,103,81,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(61,103,81,0.1)]"
                  >
                    <h3 className="mb-3 text-base font-bold text-[#101828]">{branch.name}</h3>
                    <div className="space-y-2 text-sm text-[#344054]">
                      <p className="flex items-start gap-2.5">
                        <MapPin size={15} className="mt-0.5 shrink-0 text-[#fb6514]" />
                        {branch.address}
                      </p>
                      <p className="flex items-center gap-2.5">
                        <Phone size={15} className="shrink-0 text-[#fb6514]" />
                        {branch.phone}
                      </p>
                      <p className="flex items-center gap-2.5">
                        <Clock size={15} className="shrink-0 text-[#fb6514]" />
                        {branch.hours}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
