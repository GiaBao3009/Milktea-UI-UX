import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Info, Palette, Monitor, Sun, Moon } from 'lucide-react';
import { useTrans } from '@app/hooks/useTranslation';
import i18n from '@/i18n';

const TABS = [
  { id: 'info', labelKey: 'admin.system.tabs.info', icon: Info },
  { id: 'appearance', labelKey: 'admin.system.tabs.appearance', icon: Palette },
] as const;

type TabId = (typeof TABS)[number]['id'];

const APP_INFO = [
  { labelKey: 'admin.system.info.app_name', value: 'Fresh Bubble Tea' },
  { labelKey: 'admin.system.info.developer', value: 'Chips JSC' },
  { labelKey: 'admin.system.info.version', value: 'Fresh Bubble Tea – v1.0.0, năm xuất bản 2025' },
];

const LANGUAGES = [
  { value: 'vi', labelKey: 'admin.system.langs.vi' },
  { value: 'en', labelKey: 'admin.system.langs.en' },
];

const THEMES = [
  { value: 'light', labelKey: 'admin.system.themes.light', icon: Sun },
  { value: 'dark', labelKey: 'admin.system.themes.dark', icon: Moon },
  { value: 'system', labelKey: 'admin.system.themes.system', icon: Monitor },
];

function InfoContent() {
  const { t } = useTrans();
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('admin.system.info.title')}</h2>
      <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-500">{t('admin.system.info.subtitle')}</p>

      <div className="mt-6 divide-y divide-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        {APP_INFO.map(({ labelKey, value }) => (
          <div key={labelKey} className="flex items-center gap-4 px-6 py-4">
            <span className="w-44 shrink-0 text-sm text-slate-500 dark:text-slate-500">{t(labelKey)}</span>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppearanceContent() {
  const { t } = useTrans();
  const { theme, setTheme } = useTheme();
  const [lang, setLang] = useState<string>(
    localStorage.getItem('language') || 'vi',
  );

  const handleLangChange = (value: string) => {
    setLang(value);
    localStorage.setItem('language', value);
    i18n.changeLanguage(value);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('admin.system.appearance.title')}</h2>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-500">{t('admin.system.appearance.subtitle')}</p>
      </div>

      {/* Language */}
      <div>
        <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">{t('admin.system.appearance.default_lang')}</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LANGUAGES.map(({ value, labelKey }) => {
            const active = lang === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => handleLangChange(value)}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all ${active
                  ? 'border-[#00495a] bg-[#00495a]/5 ring-1 ring-[#00495a] dark:border-teal-400 dark:bg-teal-400/10 dark:ring-teal-400'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 hover:bg-slate-50 dark:hover:border-slate-600 dark:hover:bg-slate-700'
                  }`}
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${active ? 'border-[#00495a] dark:border-teal-400' : 'border-slate-300 dark:border-slate-600'
                    }`}
                >
                  {active && <span className="h-2 w-2 rounded-full bg-[#00495a] dark:bg-teal-400" />}
                </span>
                <span
                  className={`text-sm font-semibold ${active ? 'text-[#00495a] dark:text-teal-400' : 'text-slate-700 dark:text-slate-300'
                    }`}
                >
                  {t(labelKey)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Theme */}
      <div>
        <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">{t('admin.system.appearance.theme')}</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {THEMES.map(({ value, labelKey, icon: Icon }) => {
            const active = theme === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all ${active
                  ? 'border-[#00495a] bg-[#00495a]/5 ring-1 ring-[#00495a] dark:border-teal-400 dark:bg-teal-400/10 dark:ring-teal-400'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 hover:bg-slate-50 dark:hover:border-slate-600 dark:hover:bg-slate-700'
                  }`}
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${active ? 'border-[#00495a] dark:border-teal-400' : 'border-slate-300 dark:border-slate-600'
                    }`}
                >
                  {active && <span className="h-2 w-2 rounded-full bg-[#00495a] dark:bg-teal-400" />}
                </span>
                <Icon
                  size={15}
                  className={active ? 'text-[#00495a] dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}
                />
                <span
                  className={`text-sm font-semibold ${active ? 'text-[#00495a] dark:text-teal-400' : 'text-slate-700 dark:text-slate-300'
                    }`}
                >
                  {t(labelKey)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function SystemSettingsPage() {
  const { t } = useTrans();
  const [activeTab, setActiveTab] = useState<TabId>('info');

  return (
    <div className="flex gap-5 h-full">
      {/* Left sidebar */}
      <aside className="w-56 shrink-0">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
          <div className="border-b border-slate-100 dark:border-slate-800 px-4 py-3.5">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500"> {t('admin.nav.group_system')} </p>
          </div>
          <nav className="p-2">
            {TABS.map(({ id, labelKey, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-all ${active
                    ? 'bg-[#00495a] text-white'
                    : 'text-slate-600 dark:text-slate-300 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                  <Icon
                    size={16}
                    className={active ? 'text-white' : 'text-slate-600/70 dark:text-slate-300/70'}
                  />
                  {t(labelKey)}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
          {activeTab === 'info' && <InfoContent />}
          {activeTab === 'appearance' && <AppearanceContent />}
        </div>
      </div>
    </div>
  );
}
