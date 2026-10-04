import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Sparkles, Megaphone, CalendarPlus, ChevronRight } from 'lucide-react';

export const QuickActionModal: React.FC = () => {
  const {
    isQuickActionOpen,
    setIsQuickActionOpen,
    setEditingService,
    setIsBannerModalOpen,
    setIsManualBookingOpen,
  } = useApp();

  if (!isQuickActionOpen) return null;

  const handleSelect = (action: 'service' | 'banner' | 'booking') => {
    setIsQuickActionOpen(false);

    if (action === 'service') {
      setEditingService({ item: null, isNew: true });
    } else if (action === 'banner') {
      setIsBannerModalOpen(true);
    } else if (action === 'booking') {
      setIsManualBookingOpen(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={() => setIsQuickActionOpen(false)}
    >
      <div
        className="w-full max-w-[430px] bg-[#161616] border border-white/15 rounded-t-3xl sm:rounded-3xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <h3 className="text-base font-bold text-white">O que você quer criar?</h3>
          <button
            onClick={() => setIsQuickActionOpen(false)}
            className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center text-white/70 hover:text-white"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={() => handleSelect('service')}
            className="w-full p-4 rounded-2xl bg-[#1e1e1e] hover:bg-[#262626] border border-white/5 hover:border-white/15 transition-all flex items-center gap-3.5 text-left group"
          >
            <div className="w-10 h-10 rounded-full bg-[#2a2a2a] text-[#ff5f8a] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <b className="text-sm font-bold text-white block">Produto ou serviço</b>
              <span className="text-xs text-white/50 block">Adicionar item ao catálogo</span>
            </div>
            <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/70 transition-colors" />
          </button>

          <button
            onClick={() => handleSelect('banner')}
            className="w-full p-4 rounded-2xl bg-[#1e1e1e] hover:bg-[#262626] border border-white/5 hover:border-white/15 transition-all flex items-center gap-3.5 text-left group"
          >
            <div className="w-10 h-10 rounded-full bg-[#2a2a2a] text-[#ffb020] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Megaphone className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <b className="text-sm font-bold text-white block">Banner promocional</b>
              <span className="text-xs text-white/50 block">Destaque especial no seu perfil</span>
            </div>
            <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/70 transition-colors" />
          </button>

          <button
            onClick={() => handleSelect('booking')}
            className="w-full p-4 rounded-2xl bg-[#1e1e1e] hover:bg-[#262626] border border-white/5 hover:border-white/15 transition-all flex items-center gap-3.5 text-left group"
          >
            <div className="w-10 h-10 rounded-full bg-[#2a2a2a] text-[#2f7dff] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <CalendarPlus className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <b className="text-sm font-bold text-white block">Agendamento manual</b>
              <span className="text-xs text-white/50 block">Encaixar cliente na agenda</span>
            </div>
            <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/70 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};
