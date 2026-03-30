"use client";

import { useState, useRef, useEffect } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";

type MenuState = 'notifications' | 'help' | 'settings' | 'profile' | 'language' | null;

const mockNotifications = [
  { id: 1, title: 'Mentioned you in a comment', project: 'API Gateway', time: '10m ago', unread: true },
  { id: 2, title: 'Assigned you to a new task', project: 'Auth Service', time: '1h ago', unread: true },
  { id: 3, title: 'Sprint planning completed', project: 'Mobile App v2', time: '2h ago', unread: false },
  { id: 4, title: 'Server deployment successful', project: 'DevOps', time: 'Yesterday', unread: false },
];

export function Header() {
  const t = useTranslations('Header');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  const [activeMenu, setActiveMenu] = useState<MenuState>(null);
  const headerRef = useRef<HTMLElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (menu: MenuState) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setActiveMenu(null);
  };

  return (
    <nav ref={headerRef} className="w-full h-16 sticky top-0 z-50 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
      
      {/* Left side: Logo */}
      <div className="flex items-center gap-2 lg:w-48 shrink-0">
        <Link href="/" className="flex items-center gap-2 select-none">
          <span className="font-extrabold text-[#172B4D] text-xl tracking-tight">Phdaot</span>
        </Link>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-2xl mx-12 hidden md:block">
        <div className="relative flex items-center w-full">
          <span className="absolute left-3 text-slate-400 pointer-events-none material-symbols-outlined text-[20px]">search</span>
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-transparent hover:border-slate-200 focus:bg-white focus:border-primary rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 placeholder:text-slate-400 transition-all font-medium text-slate-700"
          />
        </div>
      </div>

      {/* Right side: Icons, Avatar */}
      <div className="flex items-center gap-2 shrink-0">
        
        {/* Language Switcher */}
        <div className="relative">
          <button 
            onClick={() => toggleMenu('language')}
            className={`flex items-center gap-2 px-3 h-10 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${activeMenu === 'language' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'}`}
          >
            <span className="material-symbols-outlined text-[20px]">language</span>
            <span className="text-xs font-bold uppercase">{locale}</span>
          </button>
          
          {activeMenu === 'language' && (
            <div className="absolute right-0 top-full mt-3 w-40 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-200 z-50 overflow-hidden">
               <div className="p-2 space-y-1">
                 <button 
                   onClick={() => handleLanguageChange('en')}
                   className={`w-full flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-xl transition-all ${locale === 'en' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}
                 >
                   English {locale === 'en' && <span className="material-symbols-outlined text-sm">check</span>}
                 </button>
                 <button 
                   onClick={() => handleLanguageChange('km')}
                   className={`w-full flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-xl transition-all ${locale === 'km' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}
                 >
                   ភាសាខ្មែរ {locale === 'km' && <span className="material-symbols-outlined text-sm">check</span>}
                 </button>
               </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => toggleMenu('notifications')}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${activeMenu === 'notifications' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'}`}
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-white" />
          </button>
          
          {activeMenu === 'notifications' && (
            <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-200 z-50 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-800">{t('notifications')}</h3>
                <button className="text-[10px] font-bold text-primary hover:underline">{t('markAllRead')}</button>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {mockNotifications.map(notif => (
                  <div key={notif.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${notif.unread ? 'bg-primary/5' : ''}`}>
                    <div className="shrink-0 mt-0.5">
                       <span className={`material-symbols-outlined text-[20px] ${notif.unread ? 'text-primary' : 'text-slate-400'}`}>
                         {notif.unread ? 'notifications_active' : 'notifications'}
                       </span>
                    </div>
                    <div>
                      <p className={`text-xs ${notif.unread ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>{notif.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-slate-400">{notif.project}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className="text-[10px] font-bold text-slate-400">{notif.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-slate-50/50 text-center border-t border-slate-100">
                <button className="text-xs font-bold text-primary hover:underline w-full">{t('viewAllNotifications')}</button>
              </div>
            </div>
          )}
        </div>

        {/* Help */}
        <div className="relative">
          <button 
            onClick={() => toggleMenu('help')}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${activeMenu === 'help' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'}`}
          >
            <span className="material-symbols-outlined text-[22px]">help</span>
          </button>
          
          {activeMenu === 'help' && (
            <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-200 z-50 overflow-hidden">
              <div className="p-2 space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all text-left">
                  <span className="material-symbols-outlined text-[18px]">menu_book</span> {t('documentation')}
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all text-left">
                  <span className="material-symbols-outlined text-[18px]">support_agent</span> {t('contactSupport')}
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all text-left">
                  <span className="material-symbols-outlined text-[18px]">keyboard</span> {t('keyboardShortcuts')}
                </button>
              </div>
              <div className="p-3 border-t border-slate-100 bg-slate-50">
                 <button className="w-full flex items-center justify-between px-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">
                   {t('whatsNew')} <span className="bg-primary/20 text-primary px-1.5 rounded text-[9px]">v0.1</span>
                 </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="relative">
          <button 
            onClick={() => toggleMenu('settings')}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${activeMenu === 'settings' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'}`}
          >
            <span className="material-symbols-outlined text-[22px]">settings</span>
          </button>
          
          {activeMenu === 'settings' && (
            <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-200 z-50 overflow-hidden">
              <div className="p-2 space-y-1">
                <button className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all text-left">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px]">tune</span> {t('preferences')}
                  </div>
                </button>
                <button className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all text-left">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px]">dark_mode</span> {t('theme')}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 rounded">Light</span>
                </button>
                <button className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all text-left">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px]">shield_person</span> {t('privacy')}
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-slate-200 hidden md:block mx-1"></div>

        {/* Profile Block */}
        <div className="relative">
          <button 
            onClick={() => toggleMenu('profile')}
            className={`flex items-center gap-3 hover:bg-slate-50 p-1.5 pr-3 rounded-full transition-all border outline-none focus:ring-2 focus:ring-primary/20 ${activeMenu === 'profile' ? 'border-slate-200 bg-slate-50' : 'border-transparent'}`}
          >
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-700 leading-none group-hover:text-primary transition-colors">Alex Rivera</span>
              <span className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">Lead Architect</span>
            </div>
            <div className="w-9 h-9 rounded-full overflow-hidden bg-orange-100 flex-shrink-0 flex items-center justify-center ring-2 ring-transparent transition-all hover:ring-primary/30">
              <img className="w-full h-full object-cover" alt="User Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuChWjC_Y4_FTG0uFRun8jaSU8OurR719CF6aOG_EisBWnjs1pd7_wd1fb9XLpNUK_P7pxxiWxo0IBCOME7_QSgpwt3WqpCovEN_UPmC_v0vUgPMbnBrp-tQ1eyaPzbwwiWzzRWyLMayTWzkYNtbCnyhv3DZj7Hq7z9iAKeSrAIRb2MxI2k9cQ21kRcCVRJgwN8tKZ-wJR31PMfIEJtEU5LMD3W66CGPhSi5JOGiiHy5TO67BTFYWw2wCtgT7ThBAmHXSxRE4ojF" />
            </div>
          </button>
          
          {activeMenu === 'profile' && (
            <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-200 z-50 overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <img className="w-12 h-12 rounded-full object-cover border border-slate-200" alt="User Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuChWjC_Y4_FTG0uFRun8jaSU8OurR719CF6aOG_EisBWnjs1pd7_wd1fb9XLpNUK_P7pxxiWxo0IBCOME7_QSgpwt3WqpCovEN_UPmC_v0vUgPMbnBrp-tQ1eyaPzbwwiWzzRWyLMayTWzkYNtbCnyhv3DZj7Hq7z9iAKeSrAIRb2MxI2k9cQ21kRcCVRJgwN8tKZ-wJR31PMfIEJtEU5LMD3W66CGPhSi5JOGiiHy5TO67BTFYWw2wCtgT7ThBAmHXSxRE4ojF" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800">Alex Rivera</span>
                  <span className="text-xs font-medium text-slate-500">alex.rivera@phdaot.io</span>
                </div>
              </div>
              <div className="p-2 space-y-1 border-b border-slate-100">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all text-left">
                  <span className="material-symbols-outlined text-[18px]">person</span> {t('manageProfile')}
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all text-left">
                  <span className="material-symbols-outlined text-[18px]">group_work</span> {t('workspaces')}
                </button>
              </div>
              <div className="p-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all text-left">
                  <span className="material-symbols-outlined text-[18px]">logout</span> {t('logout')}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
