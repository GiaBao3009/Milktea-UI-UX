import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Plus, Star } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/ScrollReveal';
import { useCart } from '../contexts/CartContext';
import { formatPrice, products } from '../data/products';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const featuredProduct = products[0];
const sideProducts = [products[6], products[4], products[2]];
const categoryCards = [
  {
    href: '/thuc-don?cat=matcha',
    label: 'Trà sữa đặc trưng',
    description: 'Nền trà đậm, sữa mềm và topping nấu mới giúp cảm giác thương hiệu rõ hơn ngay từ ly đầu tiên.',
    image: products[0].image,
  },
  {
    href: '/thuc-don?cat=botanical',
    label: 'Trà trái cây',
    description: 'Tươi, sáng và thoáng vị để tổng thể thực đơn không bị nặng mà vẫn giữ chất cao cấp.',
    image: products[5].image,
  },
  {
    href: '/thuc-don?cat=cold-brew',
    label: 'Kem phủ và pha tầng',
    description: 'Những ly có bề mặt đẹp và nhiều lớp vị giúp giao diện nhìn bắt mắt hơn khi trưng bày.',
    image: products[6].image,
  },
];

const highlightCards = [
  {
    title: 'Nhận diện rõ hơn',
    description: 'Logo, tên thương hiệu và câu chuyện sản phẩm giờ đã cùng nói về trà sữa, không còn lệch sang matcha thuần.',
  },
  {
    title: 'Điều hướng rõ ràng',
    description: 'Người dùng nhìn vào là thấy ngay lối vào thực đơn, khu hội viên và bước thanh toán.',
  },
  {
    title: 'Chuyển động mềm',
    description: 'Hiệu ứng khi cuộn vẫn sang và mượt nhưng không lấn át sản phẩm hay làm trang bị ồn.',
  },
];

export function HomePage() {
  const { dispatch } = useCart();
  const navigate = useNavigate();

  const handleQuickAdd = (product: typeof products[0]) => {
    dispatch({
      type: 'ADD_ITEM',
      item: {
        cartId: `${product.id}-M-50`,
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        size: 'Vừa',
        sweetness: '50%',
        toppings: [],
      },
    });
  };

  return (
    <div
      className="overflow-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", backgroundColor: '#f9fafb' }}
    >
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-28 top-10 h-72 w-72 rounded-full bg-[#d7eadf] blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[#eef6f0] blur-3xl" />
          <div className="absolute bottom-8 left-1/2 h-60 w-60 rounded-full bg-[#bddcc8]/60 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-80px)] max-w-[1240px] items-center px-6 py-10 md:px-12">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1
                  className="mb-6 font-bold leading-[0.92] tracking-[-0.05em] text-[#101828]"
                  style={{ fontSize: 'clamp(3.2rem, 7vw, 6rem)' }}
                >
                  Trà sữa với cảm giác mềm, xanh và sang hơn.
                </h1>

                <p className="mb-8 max-w-xl text-lg leading-relaxed text-[#344054] md:text-xl">
                  Tông xanh matcha vẫn được giữ lại vì rất hợp mắt, nhưng toàn bộ nội dung, cấu trúc
                  và điểm nhấn giờ đã xoay đúng về trà sữa, trà trái cây và topping phong phú hơn.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="mb-10 flex flex-col gap-4 sm:flex-row"
              >
                <Link
                  to="/thuc-don"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 font-semibold text-white shadow-lg transition-transform duration-300 hover:scale-[1.02]"
                  style={{ background: '#fb6514' }}
                >
                  Xem thực đơn
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/tai-khoan"
                  className="inline-flex items-center justify-center rounded-full border border-[#c8ddd0] bg-white/70 px-8 py-4 font-semibold text-[#fb6514] transition-colors duration-300 hover:bg-[#edf7f0]"
                >
                  Vào khu hội viên
                </Link>
              </motion.div>

              <StaggerContainer className="grid gap-4 sm:grid-cols-3" staggerDelay={0.08}>
                {[
                  { value: '4.9/5', label: 'Ấn tượng thị giác và độ rõ sản phẩm' },
                  { value: 'Mỗi ngày', label: 'Trân châu và lớp foam được làm tươi trong ngày' },
                  { value: '2 chạm', label: 'Đăng nhập hội viên bằng Facebook hoặc Google' },
                ].map((item) => (
                  <StaggerItem key={item.value}>
                    <div className="rounded-[1.7rem] border border-white/80 bg-white/78 p-5 shadow-[0_18px_40px_rgba(61,103,81,0.08)] backdrop-blur-xl">
                      <p className="mb-2 text-2xl font-bold tracking-tight text-[#101828]">
                        {item.value}
                      </p>
                      <p className="text-sm leading-relaxed text-[#5c6862]">{item.label}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-[3rem] bg-white p-4 shadow-[0_30px_80px_rgba(61,103,81,0.16)]">
                <div className="relative overflow-hidden rounded-[2.4rem] bg-[#edf4ef]">
                  <ImageWithFallback
                    src={featuredProduct.image}
                    alt={featuredProduct.name}
                    className="h-[560px] w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[#fb6514,rgba(17,31,24,0.54))]" />
                  <div className="absolute left-6 top-6 rounded-full bg-white/82 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#fb6514] shadow-sm backdrop-blur-xl">
                    Món nổi bật
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 rounded-[2rem] border border-white/15 bg-white/15 p-5 text-white backdrop-blur-xl">
                    <div className="mb-3 flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} size={14} fill="currentColor" className="text-[#dcefe4]" />
                      ))}
                      <span className="ml-1 text-sm font-semibold">4.9 điểm yêu thích từ khách</span>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">{featuredProduct.name}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-white/84">
                      Một ly đủ rõ chất trà sữa để trở thành hình ảnh mở đầu cho toàn bộ trang.
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-lg font-bold">{formatPrice(featuredProduct.price)}</span>
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(featuredProduct)}
                        className="rounded-full bg-white px-5 py-2.5 font-semibold text-[#2e513e] transition-transform duration-300 hover:scale-[1.03]"
                      >
                        Thêm ngay
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="bestsellers" className="mx-auto max-w-[1240px] px-6 py-24 md:px-12">
        <ScrollReveal>
          <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="mb-4 inline-flex rounded-full bg-[#fff4e9] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#fb6514]">
                Món bán chạy
              </span>
              <h2
                className="mb-4 font-bold tracking-[-0.03em] text-[#101828]"
                style={{ fontSize: 'clamp(2.1rem, 4vw, 3rem)' }}
              >
                Những chiếc thẻ sản phẩm đủ đẹp để giữ người dùng ở lại lâu hơn.
              </h2>
              <p className="max-w-2xl text-lg leading-relaxed text-[#5a6760]">
                Ảnh mạnh hơn, bo góc mềm hơn và bóng đổ vừa phải giúp giao diện thoáng mắt nhưng vẫn cao cấp.
              </p>
            </div>

            <Link
              to="/thuc-don"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-[#fb6514] transition-opacity hover:opacity-80"
            >
              Xem tất cả
              <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid gap-8 md:grid-cols-12 md:gap-12">
          <ScrollReveal className="md:col-span-7" direction="left">
            <article
              className="group relative flex h-full cursor-pointer flex-col overflow-hidden bg-white shadow-[0_12px_36px_rgba(26,28,28,0.05)]"
              style={{ borderRadius: '3rem 3rem 2rem 2rem' }}
              onClick={() => navigate(`/thuc-don/${featuredProduct.id}`)}
            >
              <div className="relative h-[390px] overflow-hidden bg-[#f9fafb]">
                <ImageWithFallback
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute left-6 top-6 rounded-full bg-white/82 px-4 py-2 text-sm font-semibold text-[#fb6514] shadow-sm backdrop-blur-md">
                  Được chọn nhiều
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between bg-white p-8 md:p-12">
                <div>
                  <h3 className="mb-3 text-2xl font-bold text-[#101828]">{featuredProduct.name}</h3>
                  <p className="mb-6 leading-relaxed text-[#344054]">{featuredProduct.description}</p>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-[#f0f3f0] pt-6">
                  <span className="text-xl font-semibold text-[#101828]">
                    {formatPrice(featuredProduct.price)}
                  </span>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleQuickAdd(featuredProduct);
                    }}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff4e9] text-[#fb6514] transition-transform hover:scale-105"
                  >
                    <Plus size={22} />
                  </button>
                </div>
              </div>
            </article>
          </ScrollReveal>

          <StaggerContainer className="md:col-span-5 flex flex-col gap-8 md:gap-12" staggerDelay={0.12}>
            {sideProducts.map((product) => (
              <StaggerItem key={product.id}>
                <article
                  className="group flex cursor-pointer items-center overflow-hidden bg-white p-5 shadow-[0_8px_28px_rgba(26,28,28,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(26,28,28,0.08)]"
                  style={{ borderRadius: '2rem' }}
                  onClick={() => navigate(`/thuc-don/${product.id}`)}
                >
                  <div className="h-28 w-28 shrink-0 overflow-hidden rounded-[1.1rem] bg-[#f9fafb]">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1 pl-5">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <h3 className="text-lg font-bold leading-tight text-[#101828]">{product.name}</h3>
                      <span className="shrink-0 font-semibold text-[#fb6514]">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <p className="mb-4 line-clamp-2 text-sm text-[#5a6760]">{product.description}</p>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleQuickAdd(product);
                      }}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#fb6514] transition-opacity hover:opacity-75"
                    >
                      Thêm nhanh
                      <Plus size={16} />
                    </button>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="bg-[#f2f6f2] px-6 py-24 md:px-12">
        <div className="mx-auto max-w-[1240px]">
          <ScrollReveal className="mb-16 text-center">
            <span className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#fb6514] shadow-sm">
              Bộ sưu tập
            </span>
            <h2
              className="mb-4 font-bold tracking-[-0.03em] text-[#101828]"
              style={{ fontSize: 'clamp(2.1rem, 4vw, 3rem)' }}
            >
              Ba nhóm sản phẩm đủ để giải thích thương hiệu rõ hơn ngay trên trang đầu.
            </h2>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#5a6760]">
              Thực đơn được chia lại để người xem hiểu nhanh: trà sữa là trục chính, trà trái cây làm nhịp nhẹ và foam tạo điểm nhấn thị giác.
            </p>
          </ScrollReveal>

          <StaggerContainer className="grid gap-6 md:grid-cols-3" staggerDelay={0.12}>
            {categoryCards.map((card, index) => (
              <StaggerItem key={card.label}>
                <Link
                  to={card.href}
                  className="group relative block min-h-[420px] overflow-hidden rounded-[2.4rem] shadow-[0_18px_50px_rgba(61,103,81,0.10)]"
                  style={{
                    borderRadius: index === 0 ? '2.8rem 2.8rem 1.8rem 1.8rem' : '2.4rem',
                  }}
                >
                  <ImageWithFallback
                    src={card.image}
                    alt={card.label}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[#fb6514,rgba(13,23,18,0.76))]" />
                  <div className="relative flex h-full flex-col justify-end p-7 text-white">
                    <span className="mb-4 inline-flex w-fit rounded-full border border-white/15 bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/84 backdrop-blur-xl">
                      Danh mục
                    </span>
                    <h3 className="mb-3 text-2xl font-bold tracking-tight">{card.label}</h3>
                    <p className="max-w-sm text-sm leading-relaxed text-white/82">{card.description}</p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section id="brand-story" className="mx-auto max-w-[1240px] px-6 py-24 md:px-12">
        <div className="grid items-center gap-16 lg:grid-cols-[0.92fr_1.08fr]">
          <ScrollReveal direction="left">
            <div className="relative">
              <div
                className="aspect-[4/5] w-full overflow-hidden shadow-[0_24px_64px_rgba(26,28,28,0.08)]"
                style={{ borderRadius: '3rem' }}
              >
                <ImageWithFallback
                  src={products[6].image}
                  alt="Không khí thương hiệu Fresh Bubble Tea"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 max-w-[240px] rounded-[2rem] bg-white p-5 shadow-xl">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#617067]">
                  Điểm giữ lại
                </p>
                <p className="font-bold text-[#101828]">Màu xanh vẫn được giữ.</p>
                <p className="text-sm text-[#fb6514]">Chỉ có câu chuyện sản phẩm được làm đúng hơn.</p>
              </div>
            </div>
          </ScrollReveal>

          <div>
            <ScrollReveal direction="right">
              <span className="mb-5 inline-flex rounded-full bg-[#fff4e9] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#fb6514]">
                Tinh thần thương hiệu
              </span>
              <h2
                className="mb-6 font-bold leading-tight tracking-[-0.03em] text-[#101828]"
                style={{ fontSize: 'clamp(2.1rem, 4vw, 3rem)' }}
              >
                Điều tốt nhất không phải là thay đổi tất cả, mà là chỉnh đúng những gì đang đẹp sẵn.
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-[#56635d]">
                Giao diện gốc có sẵn nhiều điểm mạnh: xanh dịu, nhiều khoảng thở và cảm giác cao cấp.
                Phần cần sửa là ngữ nghĩa thương hiệu. Bây giờ logo, hình ảnh và sản phẩm đã cùng kể một câu chuyện rõ về trà sữa.
              </p>
            </ScrollReveal>

            <StaggerContainer className="grid gap-5 md:grid-cols-3" staggerDelay={0.1}>
              {highlightCards.map((item) => (
                <StaggerItem key={item.title}>
                  <article className="h-full rounded-[1.9rem] border border-[#edf2ee] bg-white p-6 shadow-[0_14px_40px_rgba(61,103,81,0.05)]">
                    <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#fb6514]">
                      {item.title}
                    </p>
                    <p className="text-sm leading-relaxed text-[#56635d]">{item.description}</p>
                  </article>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      <section id="hoi-vien" className="px-6 py-20 md:px-12">
        <ScrollReveal>
          <div
            className="mx-auto grid max-w-[1280px] gap-0 overflow-hidden shadow-[0_30px_80px_rgba(61,103,81,0.18)] lg:grid-cols-[0.95fr_1.05fr]"
            style={{ borderRadius: '3rem' }}
          >
            <div className="relative min-h-[420px] overflow-hidden">
              <ImageWithFallback
                src={products[2].image}
                alt="Khu hội viên Fresh Bubble Tea"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[#fb6514,rgba(11,19,15,0.80))]" />
              <div className="relative flex h-full flex-col justify-end p-8 text-white md:p-10">
                <span className="mb-4 inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/84 backdrop-blur-xl">
                  Dựa trên bố cục bạn gửi
                </span>
                <h2 className="max-w-md text-4xl font-bold leading-tight tracking-tight">
                  Đăng nhập và tạo tài khoản giờ nằm trong một khu hội viên riêng.
                </h2>
              </div>
            </div>

            <div className="bg-[#fb6514] p-8 text-white md:p-10">
              <p className="text-xs uppercase tracking-[0.28em] text-white/70">Hội viên</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                Gọn hơn, sáng hơn và đúng tinh thần ảnh mẫu.
              </h2>
              <p className="mt-5 max-w-2xl text-white/82">
                Trang hội viên mới giữ bố cục chia đôi như ảnh tham chiếu, nhưng lược bỏ trường nhập rườm rà.
                Người dùng chỉ cần Facebook hoặc Google để đi tiếp.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                  'Bố cục hai cột rõ ràng, hình lớn bên trái và thẻ thao tác bên phải.',
                  'Chỉ giữ Facebook và Google theo đúng yêu cầu.',
                  'Hiệu ứng xuất hiện khi cuộn được thêm vào toàn bộ hành trình.',
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.7rem] border border-white/12 bg-white/10 p-4 text-sm leading-relaxed text-white/84 backdrop-blur-xl"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/tai-khoan"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-[#2f523f] transition-transform duration-300 hover:scale-[1.02]"
                >
                  Mở khu hội viên
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/thuc-don"
                  className="inline-flex items-center justify-center rounded-full border border-white/25 px-7 py-3.5 font-semibold text-white transition-colors duration-300 hover:bg-white/10"
                >
                  Tiếp tục xem món
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
