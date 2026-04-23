import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { useLocation } from 'react-router';

const PRIMARY = '#f68749';

export function PageTransitionLoader() {
  const { pathname } = useLocation();
  const hasMounted = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    setIsLoading(true);
    const timeout = window.setTimeout(() => setIsLoading(false), 520);

    return () => window.clearTimeout(timeout);
  }, [pathname]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed left-0 right-0 top-0 z-[120] h-1 bg-[#fff4e9]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="h-full rounded-r-full"
            style={{ backgroundColor: PRIMARY }}
            initial={{ width: '8%' }}
            animate={{ width: ['8%', '58%', '92%'] }}
            transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface FullScreenLoadingOverlayProps {
  show: boolean;
  title?: string;
  description?: string;
}

export function FullScreenLoadingOverlay({
  show,
  title = 'Đang xử lý',
  description = 'Vui lòng chờ trong giây lát.',
}: FullScreenLoadingOverlayProps) {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-[#101828]/35 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#fff4e9]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 size={30} className="text-[#f68749]" />
              </motion.div>
            </div>
            <h3 className="text-lg font-bold text-[#101828]">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#667085]">{description}</p>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#fff4e9]">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: PRIMARY }}
                initial={{ x: '-100%' }}
                animate={{ x: ['-100%', '120%'] }}
                transition={{ duration: 1.15, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface ButtonLoadingContentProps {
  loading: boolean;
  loadingText: string;
  children: React.ReactNode;
}

export function ButtonLoadingContent({ loading, loadingText, children }: ButtonLoadingContentProps) {
  return (
    <span className="inline-flex items-center justify-center gap-2">
      {loading && <Loader2 size={18} className="animate-spin" />}
      <span>{loading ? loadingText : children}</span>
    </span>
  );
}
