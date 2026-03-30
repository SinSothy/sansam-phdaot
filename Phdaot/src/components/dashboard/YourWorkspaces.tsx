"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function YourWorkspaces() {
  const t = useTranslations('Dashboard');

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">workspaces</span>
          <h3 className="text-lg font-bold font-headline uppercase">{t('yourWorkspaces')}</h3>
        </div>
      </div>
      
      {/* Workspace Item: Design System Team */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-10 w-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary font-bold">
            DS
          </div>
          <div>
            <h4 className="font-bold text-base">{t('designSystemTeam')}</h4>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button className="px-3 py-1.5 bg-surface-container-low text-xs font-semibold rounded-lg hover:bg-surface-container-high transition-all">{t('boards')}</button>
            <button className="px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-surface-container-high transition-all">{t('membersCount', {count: 12})}</button>
            <button className="px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-surface-container-high transition-all">{t('settings')}</button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 4 */}
          <Link href="/planner" className="group relative h-40 rounded-xl overflow-hidden cursor-pointer bg-surface-container-lowest transition-all hover:shadow-2xl hover:-translate-y-1 block">
            <div className="h-16 bg-gradient-to-r from-blue-400 to-indigo-400" />
            <div className="p-4">
              <p className="font-bold text-sm text-on-surface">{t('boardTitles.componentLibrary')}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">{t('active')}</span>
              </div>
            </div>
          </Link>
          {/* Card 5 */}
          <Link href="/planner" className="group relative h-40 rounded-xl overflow-hidden cursor-pointer bg-surface-container-lowest transition-all hover:shadow-2xl hover:-translate-y-1 block">
            <div className="h-16 bg-gradient-to-r from-orange-400 to-red-400" />
            <div className="p-4">
              <p className="font-bold text-sm text-on-surface">{t('boardTitles.docHub')}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">{t('updating')}</span>
              </div>
            </div>
          </Link>
          {/* Card 6 */}
          <Link href="/planner" className="group relative h-40 rounded-xl overflow-hidden cursor-pointer bg-surface-container-lowest transition-all hover:shadow-2xl hover:-translate-y-1 block">
            <div className="h-16 bg-gradient-to-r from-purple-400 to-pink-400" />
            <div className="p-4">
              <p className="font-bold text-sm text-on-surface">{t('boardTitles.brandAssets')}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">{t('active')}</span>
              </div>
            </div>
          </Link>
          {/* Card 7 */}
          <Link href="/planner" className="group relative h-40 rounded-xl overflow-hidden cursor-pointer bg-surface-container-lowest transition-all hover:shadow-2xl hover:-translate-y-1 block">
            <div className="h-16 bg-gradient-to-r from-slate-400 to-slate-500" />
            <div className="p-4">
              <p className="font-bold text-sm text-on-surface">{t('boardTitles.archive2023')}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">{t('archived')}</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Workspace Item: Mobile App Development */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-10 w-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary font-bold">
            MA
          </div>
          <div>
            <h4 className="font-bold text-base">{t('mobileAppDev')}</h4>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button className="px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-surface-container-high transition-all">{t('boards')}</button>
            <button className="px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-surface-container-high transition-all">{t('membersCount', {count: 8})}</button>
          </div>
        </div>
        
        {/* Bento Grid Layout for Boards */}
        <div className="grid grid-cols-4 grid-rows-2 gap-4 h-64">
          <Link href="/planner" className="col-span-2 row-span-2 bg-primary-container/10 rounded-2xl p-6 flex flex-col justify-between group cursor-pointer hover:bg-primary-container/20 transition-all block">
            <div>
              <h5 className="text-primary font-black text-xl font-headline">{t('boardTitles.appLaunch')}</h5>
              <p className="text-sm text-primary/70 mt-2">{t('appLaunchDesc')}</p>
            </div>
            <div className="flex -space-x-2">
              <img className="h-8 w-8 rounded-full border-2 border-background" alt="User profile 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKg4jOKiPzVdxyFU2I7lmSoghQFDMLXByN11JqWoQCWxJZHeHzuXofNwdjPjR38i55-ZZ-wLabmf8B48GgvKatABaqZqo2cSlGmHX971G4nK9IOY6mE7MI5NKvtTjtnbF_eEg0ICnqsPv76zUsiOWl8VcJ3ZBjKiSiIFtH0KGJLIvaXNFyKNnzv_ktWS793Y43adoAjd6HScpGJFDhNFVHCV2Yco9xm8TKsTzwcLfaEDusPdEKXAQXQrfdYPmExwqMLCyvkqgq"/>
              <img className="h-8 w-8 rounded-full border-2 border-background" alt="User profile 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkgtwVdgpGVGdj1oiz0wTP-mngtfxiGfTy49pBtApAGMxDfIyJUwTwV-BCDAx9j5ppdzyLYmHvY3ZeV-tbJiEk7OK6UNuwDgykvk8qPeO3nIm69f9zobBUMC-XD9FQAv0AqlgSi9nvC1Z-qJKjGFPB6QLzQzzzGXDsaEdVRn_Ro2jyYO5aDXEgDM9zgTwkGOgTdKJW9T8PmmiwERtzJumjipNepqTjBEqaP6hbk-e7pS0d7uMewdLoyKjRLq35ZR5cW7z9AXuy"/>
              <div className="h-8 w-8 rounded-full border-2 border-background bg-surface-container-highest flex items-center justify-center text-[10px] font-bold">+5</div>
            </div>
          </Link>
          <Link href="/planner" className="col-span-1 row-span-1 bg-surface-container-lowest rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all block">
            <p className="font-bold text-sm">{t('boardTitles.iosSprint')}</p>
            <div className="w-full bg-surface-container-low h-1 rounded-full mt-4">
              <div className="bg-blue-600 h-full w-2/3 rounded-full" />
            </div>
          </Link>
          <Link href="/planner" className="col-span-1 row-span-1 bg-surface-container-lowest rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all block">
            <p className="font-bold text-sm">{t('boardTitles.androidSprint')}</p>
            <div className="w-full bg-surface-container-low h-1 rounded-full mt-4">
              <div className="bg-blue-400 h-full w-1/2 rounded-full" />
            </div>
          </Link>
          <div className="col-span-2 row-span-1 border-2 border-dashed border-outline-variant bg-transparent rounded-xl flex items-center justify-center gap-3 cursor-pointer group hover:bg-surface-container-low transition-all">
            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-all">add</span>
            <span className="font-bold text-sm text-secondary">{t('newBoardInWorkspace', {workspace: t('mobileAppDev')})}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
