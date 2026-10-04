import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Megaphone } from 'lucide-react';

const BANNER_EMOJIS = ['🎁', '📅', '🔥', '✨', '🌸', '⚡', '👑', '🎉'];

export const BannerFormModal: React.FC = () => {
  const { isBannerModalOpen, setIsBannerModalOpen, addBanner } = useApp();

  const [kicker, setKicker] = useState('Promoção');
  const [title, setTitle] = useState('');
  const [sub, setSub] = useState('');
  const [emoji, setEmoji] = useState('🎁');

  if (!isBannerModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addBanner({
      kicker: kicker.trim() || 'Destaque',
      title: title.trim(),
      sub: sub.trim() || 'Aproveite por tempo limitado',
      emoji,
    });

    setTitle('');
    setSub('');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={() => setIsBannerModalOpen(false)}
    >
      <div
        className="w-full max-w-[430px] bg-[#161616] border border-white/15 rounded-t-3xl sm:rounded-3xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-[#ffb020]" />
            <h3 className="text-base font-bold text-white">Novo banner promocional</h3>
          </div>
          <button
            onClick={() => setIsBannerModalOpen(false)}
            className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center text-white/70 hover:text-white"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1">
              Selo pequeno
            </label>
            <input
              type="text"
              value={kicker}
              onChange={(e) => setKicker(e.target.value)}
              placeholder="Ex: Promoção, Novidade"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1e1e1e] border border-white/10 text-white focus:outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1">
              Título do anúncio
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: 20% off em Limpeza de pele"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1e1e1e] border border-white/10 text-white font-semibold focus:outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1">
              Subtítulo / Regra
            </label>
            <input
              type="text"
              value={sub}
              onChange={(e) => setSub(e.target.value)}
              placeholder="Ex: Válido até domingo ou enquanto durarem os horários"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1e1e1e] border border-white/10 text-white focus:outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1.5">
              Ícone / Emoji
            </label>
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {BANNER_EMOJIS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setEmoji(em)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-base transition-all ${
                    emoji === em
                      ? 'bg-white text-black shadow-md scale-110'
                      : 'bg-[#1e1e1e] border border-white/10 text-white/70 hover:bg-[#262626]'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t border-white/10 mt-4">
            <button
              type="button"
              onClick={() => setIsBannerModalOpen(false)}
              className="flex-1 py-3 rounded-full bg-[#1e1e1e] hover:bg-[#262626] text-white/70 text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 py-3 rounded-full bg-white hover:bg-white/90 text-black text-xs font-bold transition-colors disabled:opacity-50"
            >
              Adicionar banner
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
