import { useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle, Clock3, Coffee, ReceiptText, ShoppingBag } from 'lucide-react';

const PRIMARY = '#f68749';

const STEPS = [
  {
    label: 'Đã nhận đơn',
    desc: 'Quầy đã ghi nhận đơn và chuyển sang khu pha chế.',
    status: 'done',
  },
  {
    label: 'Đang pha chế',
    desc: 'Đồ uống được chuẩn bị theo size và độ ngọt đã chọn.',
    status: 'active',
  },
  {
    label: 'Sẵn sàng lấy',
    desc: 'Nhân viên sẽ gọi mã đơn khi đồ uống hoàn tất.',
    status: 'next',
  },
  {
    label: 'Hoàn tất',
    desc: 'Khách nhận món tại quầy.',
    status: 'next',
  },
] as const;

function formatTime(date: Date) {
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function OrderSuccessPage() {
  const orderInfo = useMemo(() => {
    const now = new Date();
    const early = new Date(now.getTime() + 12 * 60 * 1000);
    const late = new Date(now.getTime() + 18 * 60 * 1000);
    const internalTarget = new Date(now.getTime() + 9 * 60 * 1000);

    return {
      code: `#FBT-${Math.floor(Math.random() * 90000) + 10000}`,
      placedAt: formatTime(now),
      readyWindow: `${formatTime(early)} - ${formatTime(late)}`,
      internalTarget: formatTime(internalTarget),
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="min-h-screen bg-[#f9fafb] px-4 py-8 md:px-6"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <main className="mx-auto grid w-full max-w-[1080px] items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 md:p-6"
        >
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff4e9]">
                <CheckCircle size={30} className="text-[#f68749]" />
              </div>
              <p className="mb-2 text-sm font-bold uppercase tracking-wider text-[#9a3d0f]">
                Đơn đã được xác nhận
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-[#101828] md:text-3xl">
                Món đang được chuẩn bị.
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#667085]">
                Thời gian hiển thị có thêm một khoảng dự phòng giống mô hình tracking của Grab, nên
                khách thường nhận món sớm hơn mốc cuối.
              </p>
            </div>

            <div className="rounded-2xl bg-[#fcfcfd] px-5 py-4 text-left ring-1 ring-gray-100">
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#667085]">
                Mã đơn
              </p>
              <p className="text-xl font-bold text-[#f68749]">{orderInfo.code}</p>
              <p className="mt-1 text-xs text-[#667085]">Đặt lúc {orderInfo.placedAt}</p>
            </div>
          </div>

          <div className="mb-6 grid gap-3 md:grid-cols-3">
            <InfoTile
              icon={<Clock3 size={18} />}
              label="Dự kiến sẵn sàng"
              value={orderInfo.readyWindow}
            />
            <InfoTile
              icon={<Coffee size={18} />}
              label="Nhịp pha chế"
              value="Khoảng 8-12 phút"
            />
            <InfoTile
              icon={<ReceiptText size={18} />}
              label="Nhận tại"
              value="Quầy order"
            />
          </div>

          <div className="rounded-2xl bg-[#fff4e9] p-4">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-[#101828]">Tiến độ hiện tại</p>
                <p className="mt-0.5 text-xs font-medium text-[#9a3d0f]">
                  Mục tiêu nội bộ: khoảng {orderInfo.internalTarget}
                </p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#9a3d0f]">
                45%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '45%' }}
                transition={{ delay: 0.25, duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: PRIMARY }}
              />
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {STEPS.map((step, index) => {
              const isDone = step.status === 'done';
              const isActive = step.status === 'active';

              return (
                <div
                  key={step.label}
                  className="flex gap-3 rounded-2xl border border-gray-100 bg-[#fcfcfd] p-4"
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: isDone || isActive ? PRIMARY : '#eef0f3',
                      color: isDone || isActive ? 'white' : '#667085',
                    }}
                  >
                    {isDone ? (
                      <CheckCircle size={17} />
                    ) : isActive ? (
                      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />
                    ) : (
                      <span className="text-xs font-bold">{index + 1}</span>
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-[#101828]">{step.label}</p>
                      {isActive && (
                        <span className="rounded-full bg-[#fff4e9] px-2 py-0.5 text-xs font-bold text-[#9a3d0f]">
                          Đang chạy
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm leading-5 text-[#667085]">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 lg:sticky lg:top-24"
        >
          <h2 className="mb-4 text-lg font-bold text-[#101828]">Việc tiếp theo</h2>
          <div className="mb-5 space-y-3">
            <div className="rounded-2xl bg-[#fcfcfd] p-4 ring-1 ring-gray-100">
              <p className="text-sm font-bold text-[#101828]">Theo dõi mã đơn</p>
              <p className="mt-1 text-sm leading-5 text-[#667085]">
                Khi quầy gọi {orderInfo.code}, khách có thể nhận món ngay.
              </p>
            </div>
            <div className="rounded-2xl bg-[#fcfcfd] p-4 ring-1 ring-gray-100">
              <p className="text-sm font-bold text-[#101828]">ETA có dự phòng</p>
              <p className="mt-1 text-sm leading-5 text-[#667085]">
                Mốc cuối được cộng thêm vài phút để tránh trễ hẹn khi quầy đông.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              to="/thuc-don"
              className="flex items-center justify-center gap-2 rounded-xl py-3.5 text-center font-bold text-[#101828] transition-transform hover:scale-[1.01]"
              style={{ backgroundColor: PRIMARY }}
            >
              Đặt thêm món
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/"
              className="rounded-xl border border-[#f68749]/30 bg-white py-3.5 text-center font-bold text-[#9a3d0f] transition-colors hover:bg-[#fff4e9]"
            >
              Về trang chủ
            </Link>
          </div>
        </motion.aside>
      </main>
    </div>
  );
}

interface InfoTileProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoTile({ icon, label, value }: InfoTileProps) {
  return (
    <div className="rounded-2xl bg-[#fcfcfd] p-4 ring-1 ring-gray-100">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff4e9] text-[#9a3d0f]">
        {icon}
      </div>
      <p className="text-xs font-bold uppercase tracking-wider text-[#667085]">{label}</p>
      <p className="mt-1 font-bold text-[#101828]">{value}</p>
    </div>
  );
}
