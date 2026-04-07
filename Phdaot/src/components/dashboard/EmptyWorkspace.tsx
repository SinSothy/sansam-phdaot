"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface EmptyWorkspaceProps {
  onCreateClick: () => void;
}

export function EmptyWorkspace({ onCreateClick }: EmptyWorkspaceProps) {
  const t = useTranslations("Dashboard.emptyState");

  return (
    <div className="w-full py-12 md:py-20 flex flex-col items-center justify-center animate-in fade-in duration-700">
      <div className="max-w-2xl w-full text-center space-y-10">
        {/* Empty State Illustration */}
        <div className="relative w-full aspect-[16/9] flex items-center justify-center">
          {/* Glassmorphic Background Elements */}
          <div className="absolute inset-0 flex items-center justify-center opacity-40">
            <div className="w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="w-64 h-64 bg-secondary/30 rounded-full blur-3xl -ml-20 mt-10 animate-pulse delay-700" />
          </div>

          {/* Decorative Floating Shapes */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="grid grid-cols-3 gap-4 mb-8">
              {/* Left Card */}
              <div className="w-20 h-24 bg-surface-container-lowest rounded-xl shadow-lg shadow-on-surface/5 flex flex-col p-3 gap-2 opacity-60 transform -rotate-6 transition-transform hover:rotate-0 hover:opacity-100 duration-500">
                <div className="w-full h-2 bg-surface-container rounded-full" />
                <div className="w-3/4 h-2 bg-surface-container rounded-full" />
                <div className="w-1/2 h-2 bg-surface-container rounded-full mt-auto" />
              </div>
              
              {/* Center (Active) Card */}
              <div className="w-20 h-32 bg-surface-container-lowest rounded-xl shadow-2xl shadow-primary/10 -mt-6 border border-primary/10 flex flex-col p-3 gap-2 z-20 transform transition-all hover:scale-110 duration-500">
                <div className="w-full h-2 bg-primary-fixed rounded-full" />
                <div className="w-full h-2 bg-primary-fixed rounded-full" />
                <div className="w-full h-2 bg-primary-fixed rounded-full" />
                <div className="w-1/2 h-2 bg-primary-fixed rounded-full mt-auto" />
              </div>

              {/* Right Card */}
              <div className="w-20 h-24 bg-surface-container-lowest rounded-xl shadow-lg shadow-on-surface/5 flex flex-col p-3 gap-2 opacity-60 transform rotate-6 transition-transform hover:rotate-0 hover:opacity-100 duration-500">
                <div className="w-full h-2 bg-surface-container rounded-full" />
                <div className="w-3/4 h-2 bg-surface-container rounded-full" />
                <div className="w-1/2 h-2 bg-surface-container rounded-full mt-auto" />
              </div>
            </div>

            {/* Pulsing Action Button Highlight */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-20 animate-ping" />
              <button 
                onClick={onCreateClick}
                className="relative w-16 h-16 bg-primary rounded-full flex items-center justify-center text-on-primary shadow-xl shadow-primary/30 transition-transform active:scale-90 hover:scale-110"
              >
                <span className="material-symbols-outlined text-4xl font-fill">add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4 px-6">
          <h2 
            className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight"
            dangerouslySetInnerHTML={{ __html: t.raw('title') }}
          />
          <p className="text-secondary max-w-md mx-auto leading-relaxed text-lg font-body">
            {t.raw('description')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button 
            onClick={onCreateClick}
            className="px-8 py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-xl font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5 active:scale-95 active:translate-y-0"
          >
            {t('createButton')}
          </button>
          <button className="px-8 py-4 bg-surface-container-low text-secondary rounded-xl font-bold text-lg hover:bg-surface-container-high transition-colors">
            {t('viewTutorial')}
          </button>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 border-t border-surface-container">
          <div className="flex items-start gap-4 text-left p-4 rounded-2xl hover:bg-surface-container-low transition-colors group">
            <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-on-secondary-container">dynamic_feed</span>
            </div>
            <div>
              <p className="font-bold text-sm text-on-surface">{t('features.agile.title')}</p>
              <p className="text-xs text-secondary">{t('features.agile.description')}</p>
            </div>
          </div>
          <div className="flex items-start gap-4 text-left p-4 rounded-2xl hover:bg-surface-container-low transition-colors group">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-on-primary-fixed-variant">group_work</span>
            </div>
            <div>
              <p className="font-bold text-sm text-on-surface">{t('features.synergy.title')}</p>
              <p className="text-xs text-secondary">{t('features.synergy.description')}</p>
            </div>
          </div>
          <div className="flex items-start gap-4 text-left p-4 rounded-2xl hover:bg-surface-container-low transition-colors group">
            <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-on-tertiary-fixed">insights</span>
            </div>
            <div>
              <p className="font-bold text-sm text-on-surface">{t('features.analytics.title')}</p>
              <p className="text-xs text-secondary">{t('features.analytics.description')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
