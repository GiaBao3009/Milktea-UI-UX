import { motion } from 'motion/react';
import { Link } from 'react-router';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/ScrollReveal';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { products } from '../data/products';

const NEWS_ARTICLES = [
  {
    id: 1,
    title: 'Ra mắt bộ sưu tập Hè 2026 — Trà trái cây nhiệt đới',
    excerpt: 'Khám phá 3 hương vị mới: Dưa lưới sữa chua, Chanh dây matcha và Xoài nếp cẩm — chỉ có trong mùa hè.',
    image: products[5].image,
    date: '15/04/2026',
    readTime: '3 phút đọc',
    category: 'Sản phẩm mới',
    featured: true,
  },
  {
    id: 2,
    title: 'Fresh Bubble Tea mở chi nhánh thứ 8 tại Quận 7',
    excerpt: 'Không gian mới rộng rãi hơn, khu vực ngồi thoáng và menu signature riêng cho chi nhánh.',
    image: products[6].image,
    date: '08/04/2026',
    readTime: '2 phút đọc',
    category: 'Tin tức',
  },
  {
    id: 3,
    title: 'Chương trình hội viên nâng cấp — Thêm quyền lợi hạng Lá Vàng',
    excerpt: 'Hội viên Lá Vàng giờ được miễn phí giao hàng không giới hạn và quà tặng hàng quý.',
    image: products[2].image,
    date: '01/04/2026',
    readTime: '4 phút đọc',
    category: 'Hội viên',
  },
  {
    id: 4,
    title: 'Cách chúng tôi chọn lá trà cho từng ly',
    excerpt: 'Từ vùng trồng cao nguyên đến quy trình sao chế — hành trình của lá trà trước khi đến tay bạn.',
    image: products[0].image,
    date: '25/03/2026',
    readTime: '5 phút đọc',
    category: 'Câu chuyện',
  },
  {
    id: 5,
    title: 'Ưu đãi đặc biệt tháng 4 — Giảm 20% toàn menu',
    excerpt: 'Sử dụng mã FRESH20 để nhận giảm giá 20% cho tất cả đơn hàng trong tháng 4.',
    image: products[4].image,
    date: '20/03/2026',
    readTime: '2 phút đọc',
    category: 'Ưu đãi',
  },
  {
    id: 6,
    title: 'Workshop "Pha trà sữa tại nhà" — Đăng ký miễn phí',
    excerpt: 'Học cách pha trà sữa đúng chuẩn từ barista của Fresh, hoàn toàn miễn phí cho hội viên.',
    image: products[3].image,
    date: '15/03/2026',
    readTime: '3 phút đọc',
    category: 'Sự kiện',
  },
];

function getCategoryColor(cat: string) {
  const colors: Record<string, string> = {
    'Sản phẩm mới': '#fb6514',
    'Tin tức': '#2d5a8c',
    'Hội viên': '#8c5a2d',
    'Câu chuyện': '#6b3d67',
    'Ưu đãi': '#8c2d2d',
    'Sự kiện': '#2d8c5a',
  };
  return colors[cat] || '#fb6514';
}

export function NewsPage() {
  const featured = NEWS_ARTICLES[0];
  const rest = NEWS_ARTICLES.slice(1);

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
            <span className="mb-4 inline-flex rounded-full bg-[#fff4e9] px-5 py-2 text-xs font-bold uppercase tracking-[0.25em] text-[#fb6514]">
              Tin tức
            </span>
            <h1
              className="mb-5 font-bold leading-tight tracking-[-0.03em] text-[#101828]"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
            >
              Tin tức & Cập nhật
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#344054]">
              Cập nhật những thông tin mới nhất về sản phẩm, ưu đãi và hoạt động của Fresh Bubble Tea.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="relative z-10 py-8">
        <div className="mx-auto max-w-[1240px] px-4 md:px-8">
          <ScrollReveal>
            <article className="group grid overflow-hidden rounded-[2.5rem] bg-white shadow-[0_16px_48px_rgba(61,103,81,0.08)] lg:grid-cols-2">
              <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
                <ImageWithFallback
                  src={featured.image}
                  alt={featured.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-md"
                  style={{ color: getCategoryColor(featured.category) }}
                >
                  {featured.category}
                </div>
              </div>
              <div className="flex flex-col justify-center p-8 md:p-12">
                <div className="mb-4 flex items-center gap-4 text-xs text-[#344054]">
                  <span className="flex items-center gap-1"><Calendar size={12} />{featured.date}</span>
                  <span className="flex items-center gap-1"><Clock size={12} />{featured.readTime}</span>
                </div>
                <h2 className="mb-4 text-2xl font-bold leading-tight text-[#101828] md:text-3xl">
                  {featured.title}
                </h2>
                <p className="mb-6 text-base leading-relaxed text-[#344054]">{featured.excerpt}</p>
                <Link
                  to="/thuc-don"
                  className="group/link inline-flex w-fit items-center gap-2 text-sm font-bold text-[#fb6514] transition-colors hover:text-[#2b5640]"
                >
                  Đọc thêm
                  <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </article>
          </ScrollReveal>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="relative z-10 py-12">
        <div className="mx-auto max-w-[1240px] px-4 md:px-8">
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.08}>
            {rest.map((article) => (
              <StaggerItem key={article.id}>
                <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_8px_28px_rgba(61,103,81,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(61,103,81,0.12)]">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <ImageWithFallback
                      src={article.image}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                      className="absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md"
                      style={{ color: getCategoryColor(article.category) }}
                    >
                      {article.category}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex items-center gap-3 text-xs text-[#344054]">
                      <span className="flex items-center gap-1"><Calendar size={11} />{article.date}</span>
                      <span className="flex items-center gap-1"><Clock size={11} />{article.readTime}</span>
                    </div>
                    <h3 className="mb-2 text-lg font-bold leading-snug text-[#101828]">{article.title}</h3>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-[#344054]">{article.excerpt}</p>
                    <Link
                      to="/thuc-don"
                      className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-[#fb6514] transition-colors hover:text-[#2b5640]"
                    >
                      Đọc thêm <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
