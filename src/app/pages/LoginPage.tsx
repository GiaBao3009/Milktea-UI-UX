import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { products } from '../data/products';

type AuthMode = 'signin' | 'signup';

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
        fill="#fb6514"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
        fill="#5a9e74"
      />
      <path
        d="M5.84 14.09A6.97 6.97 0 0 1 5.48 12c0-.72.13-1.42.36-2.09V7.07H2.18A11.97 11.97 0 0 0 0 12c0 1.94.46 3.77 1.28 5.4l3.56-2.77.01-.54Z"
        fill="#8fc4a0"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.99 14.97.96 12 .96 7.7.96 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
        fill="#2b5640"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.875V12h3.328l-.532 3.47h-2.796v8.385C19.612 22.954 24 17.99 24 12Z"
        fill="#fb6514"
      />
      <path
        d="M16.671 15.469 17.203 12h-3.328V9.75c0-.949.465-1.875 1.956-1.875h1.514V4.922s-1.374-.234-2.686-.234c-2.741 0-4.533 1.66-4.533 4.669V12H7.078v3.469h3.047v8.385a12.09 12.09 0 0 0 3.75 0V15.47h2.796Z"
        fill="white"
      />
    </svg>
  );
}

export function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const isSignIn = mode === 'signin';

  return (
    <div
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        backgroundColor: '#f9fafb',
      }}
    >
      <div className="mx-auto max-w-[1240px] px-4 py-6 md:px-8">
        {/* Grid: image + form side by side, both stretch to same height */}
        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          {/* Left - Image (stretches to match form height) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden overflow-hidden rounded-[2.5rem] shadow-[0_24px_80px_rgba(61,103,81,0.18)] lg:block"
          >
            <ImageWithFallback
              src={products[2].image}
              alt="Fresh Bubble Tea"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[#fb6514,rgba(23,39,31,0.65))]" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#fb6514)]" />

            <div className="absolute bottom-0 left-0 right-0 p-10">
              <h1
                className="mb-4 font-bold leading-[0.96] tracking-[-0.03em] text-white"
                style={{ fontSize: 'clamp(2.4rem, 4vw, 3.8rem)' }}
              >
                Thanh Vị An Yên
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-white/80">
                Ủ trọn nét thanh tao. Khám phá sự thanh mát thuần khiết và năng lượng bừng tỉnh
                từ những lá trà thượng phẩm.
              </p>
            </div>
          </motion.div>

          {/* Right - Auth Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center py-4 lg:py-6"
          >
            <div className="w-full max-w-[440px] rounded-[2.2rem] bg-white p-6 shadow-[0_20px_60px_rgba(61,103,81,0.09)] md:p-8">
              {/* Tab Switcher */}
              <div className="mb-6 flex justify-center gap-8 border-b border-[#e8ece8]">
                {(['signin', 'signup'] as AuthMode[]).map((tab) => {
                  const active = mode === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setMode(tab)}
                      className="relative pb-3.5 text-sm font-semibold transition-colors duration-200"
                      style={{
                        color: active ? '#2b5640' : '#8a958e',
                      }}
                    >
                      {tab === 'signin' ? 'Đăng nhập' : 'Tạo tài khoản'}
                      {active && (
                        <motion.div
                          layoutId="auth-tab-underline"
                          className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full"
                          style={{ backgroundColor: '#fb6514' }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Title */}
                  <h2 className="mb-5 text-[1.5rem] font-bold tracking-tight text-[#101828] md:text-[1.6rem]">
                    {isSignIn ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
                  </h2>

                  {/* Form */}
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
                  >
                    {/* Name field - only for signup */}
                    {!isSignIn && (
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-[#1d2939]">
                          Họ và tên
                        </label>
                        <div className="relative">
                          <User
                            size={17}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#919e95]"
                          />
                          <input
                            type="text"
                            placeholder="Nhập họ và tên"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-xl border-0 bg-[#f3f5f3] py-3 pl-10 pr-4 text-sm text-[#101828] outline-none transition-all duration-200 placeholder:text-[#a3ada7] focus:bg-[#eef3ef] focus:ring-2 focus:ring-[#f68749]"
                          />
                        </div>
                      </div>
                    )}

                    {/* Email */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#1d2939]">
                        Email
                      </label>
                      <div className="relative">
                        <Mail
                          size={17}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#919e95]"
                        />
                        <input
                          type="email"
                          placeholder="Nhập tài khoản email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-xl border-0 bg-[#f3f5f3] py-3 pl-10 pr-4 text-sm text-[#101828] outline-none transition-all duration-200 placeholder:text-[#a3ada7] focus:bg-[#eef3ef] focus:ring-2 focus:ring-[#f68749]"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <div className="mb-1.5 flex items-center justify-between">
                        <label className="text-sm font-medium text-[#1d2939]">
                          Mật Khẩu
                        </label>
                        {isSignIn && (
                          <button
                            type="button"
                            className="text-sm font-medium text-[#fb6514] transition-colors hover:text-[#2b5640]"
                          >
                            Quên Mật Khẩu?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock
                          size={17}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#919e95]"
                        />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Nhập mật khẩu"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full rounded-xl border-0 bg-[#f3f5f3] py-3 pl-10 pr-11 text-sm text-[#101828] outline-none transition-all duration-200 placeholder:text-[#a3ada7] focus:bg-[#eef3ef] focus:ring-2 focus:ring-[#f68749]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#919e95] transition-colors hover:text-[#5f6b65]"
                        >
                          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password - only for signup */}
                    {!isSignIn && (
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-[#1d2939]">
                          Xác nhận mật khẩu
                        </label>
                        <div className="relative">
                          <Lock
                            size={17}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#919e95]"
                          />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Nhập lại mật khẩu"
                            className="w-full rounded-xl border-0 bg-[#f3f5f3] py-3 pl-10 pr-4 text-sm text-[#101828] outline-none transition-all duration-200 placeholder:text-[#a3ada7] focus:bg-[#eef3ef] focus:ring-2 focus:ring-[#f68749]"
                          />
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full rounded-xl py-3 text-sm font-bold text-white shadow-lg transition-transform duration-200 hover:scale-[1.01]"
                      style={{
                        background: '#fb6514',
                        boxShadow: '0 8px 24px rgba(61,103,81,0.22)',
                      }}
                    >
                      {isSignIn ? 'Đăng nhập' : 'Tạo tài khoản'}
                    </motion.button>
                  </form>

                  {/* Divider */}
                  <div className="my-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-[#e8ece8]" />
                    <span className="text-xs text-[#8a958e]">Hoặc tiếp tục với</span>
                    <div className="h-px flex-1 bg-[#e8ece8]" />
                  </div>

                  {/* Social Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="flex flex-1 items-center justify-center gap-2.5 rounded-xl border border-[#e2e8e4] bg-[#f7faf8] py-2.5 text-sm font-semibold text-[#101828] transition-all duration-200 hover:border-[#b8d4c4] hover:bg-white hover:shadow-[0_4px_16px_rgba(61,103,81,0.1)]"
                    >
                      <GoogleIcon />
                      Google
                    </button>
                    <button
                      type="button"
                      className="flex flex-1 items-center justify-center gap-2.5 rounded-xl border border-[#e2e8e4] bg-[#f7faf8] py-2.5 text-sm font-semibold text-[#101828] transition-all duration-200 hover:border-[#b8d4c4] hover:bg-white hover:shadow-[0_4px_16px_rgba(61,103,81,0.1)]"
                    >
                      <FacebookIcon />
                      Facebook
                    </button>
                  </div>

                  {/* Switch mode text */}
                  <p className="mt-5 text-center text-sm text-[#344054]">
                    {isSignIn ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
                    <button
                      type="button"
                      onClick={() => setMode(isSignIn ? 'signup' : 'signin')}
                      className="font-semibold text-[#fb6514] transition-colors hover:text-[#2b5640]"
                    >
                      {isSignIn ? 'Tạo tài khoản' : 'Đăng nhập'}
                    </button>
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
