import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceItem } from '../../types';
import {
  TrendingUp,
  CreditCard,
  List,
  LayoutGrid,
  Plus,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const ServicesView: React.FC = () => {
  const {
    services,
    categories,
    paymentConfig,
    setActiveTab,
    setIsPaymentConfigOpen,
    setEditingService,
    setSelectedProduct,
  } = useApp();

  const [viewMode, setViewMode] = useState<'list' | 'cards'>('cards');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filteredServices = services.filter((s) => {
    if (selectedFilter === 'all') return true;
    return s.cat === selectedFilter;
  });

  // Group services by category
  const grouped = categories.reduce<Record<string, ServiceItem[]>>((acc, cat) => {
    const matched = filteredServices.filter((s) => s.cat === cat.key);
    if (matched.length > 0) {
      acc[cat.key] = matched;
    }
    return acc;
  }, {});

  const handleItemClick = (item: ServiceItem) => {
    if (item.type === 'produto') {
      setSelectedProduct(item);
    } else {
      setEditingService({ item, isNew: false });
    }
  };

  const getPaymentStatusText = () => {
    if (paymentConfig.activeMethod === 'sync') return 'Pix via API SyncPayments ativo';
    if (paymentConfig.activeMethod === 'infinite') return 'InfinitePay Checkout ativo';
    if (paymentConfig.activeMethod === 'both') return 'Pix e InfinitePay ativos';
    return 'Nenhum método configurado';
  };

  return (
    <div className="px-5 space-y-5">
      {/* Header with Title and Add Button */}
      <div className="flex items-center justify-between pt-3">
        <h2 className="text-2xl font-bold text-white tracking-tight">Serviços</h2>
        <button
          onClick={() => setEditingService({ item: null, isNew: true })}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-white/90 active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4 stroke-[2.2]" />
          <span>Novo item</span>
        </button>
      </div>

      {/* Quick Access Action Banners */}
      <div className="space-y-2.5">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="w-full p-3.5 rounded-2xl bg-[#161616] border border-white/10 hover:bg-[#1e1e1e] hover:border-white/20 transition-all flex items-center gap-3.5 text-left group"
        >
          <div className="w-10 h-10 rounded-full bg-[#262626] flex items-center justify-center text-white flex-shrink-0">
            <TrendingUp className="w-4 h-4 text-[#2f7dff]" />
          </div>
          <div className="flex-1 min-w-0">
            <b className="text-sm font-bold text-white block">Dashboard financeiro</b>
            <span className="text-xs text-white/50 block truncate">
              Faturamento, previsão e ticket médio
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/70 transition-colors" />
        </button>

        <button
          onClick={() => setIsPaymentConfigOpen(true)}
          className="w-full p-3.5 rounded-2xl bg-[#161616] border border-white/10 hover:bg-[#1e1e1e] hover:border-white/20 transition-all flex items-center gap-3.5 text-left group"
        >
          <div className="w-10 h-10 rounded-full bg-[#262626] flex items-center justify-center text-white flex-shrink-0">
            <CreditCard className="w-4 h-4 text-[#34c281]" />
          </div>
          <div className="flex-1 min-w-0">
            <b className="text-sm font-bold text-white block">Configurar pagamentos</b>
            <span className="text-xs text-white/50 block truncate">
              {getPaymentStatusText()}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/70 transition-colors" />
        </button>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="inline-flex gap-1 p-1 bg-[#161616] border border-white/10 rounded-full">
          <button
            onClick={() => setViewMode('list')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              viewMode === 'list' ? 'bg-white text-black' : 'text-white/50 hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Lista</span>
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              viewMode === 'cards' ? 'bg-white text-black' : 'text-white/50 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
        </div>

        <span className="text-xs text-white/45">
          {filteredServices.length} {filteredServices.length === 1 ? 'item' : 'itens'}
        </span>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            selectedFilter === 'all'
              ? 'bg-white text-black'
              : 'bg-[#161616] border border-white/10 text-white/60 hover:text-white'
          }`}
        >
          Todas ({services.length})
        </button>
        {categories.map((cat) => {
          const count = services.filter((s) => s.cat === cat.key).length;
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedFilter(cat.key)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                selectedFilter === cat.key
                  ? 'bg-white text-black'
                  : 'bg-[#161616] border border-white/10 text-white/60 hover:text-white'
              }`}
            >
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Services List / Cards */}
      <div className="space-y-6">
        {Object.keys(grouped).length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#161616] border border-white/10 text-center">
            <p className="text-sm text-white/60">Nenhum item nesta categoria.</p>
            <button
              onClick={() => setEditingService({ item: null, isNew: true })}
              className="mt-3 text-xs font-semibold text-[#2f7dff] hover:underline"
            >
              + Adicionar item agora
            </button>
          </div>
        ) : (
          Object.entries(grouped).map(([catKey, items]) => {
            const cat = categories.find((c) => c.key === catKey) || categories[0];

            if (viewMode === 'list') {
              return (
                <div key={catKey} className="space-y-2">
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-sm">{cat.emoji}</span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white/40">
                      {cat.label}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {items.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => handleItemClick(s)}
                        className="p-3.5 rounded-2xl bg-[#161616] border border-white/10 hover:bg-[#1e1e1e] hover:border-white/20 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
                              {s.name}
                            </span>
                            {s.badge && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff5f8a]/20 text-[#ff5f8a] border border-[#ff5f8a]/30">
                                {s.badge}
                              </span>
                            )}
                            {s.type === 'produto' && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                Produto
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-white/50 mt-0.5">
                            {s.duration} · {s.desc ? s.desc.slice(0, 50) + '...' : ''}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="px-3 py-1.5 rounded-full bg-[#262626] text-xs font-bold text-white">
                            {s.price}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            // Cards view
            return (
              <div key={catKey} className="space-y-3">
                <div className="flex items-baseline justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{cat.emoji}</span>
                    <h3 className="text-lg font-bold text-white tracking-tight">{cat.label}</h3>
                  </div>
                  <span className="text-xs text-white/45">
                    {items.length} {items.length === 1 ? 'item' : 'itens'}
                  </span>
                </div>

                <div className="flex gap-3.5 overflow-x-auto pb-3 pt-1 no-scrollbar">
                  {items.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => handleItemClick(s)}
                      className="flex-shrink-0 w-[240px] rounded-3xl bg-[#161616] border border-white/10 hover:border-white/30 transition-all overflow-hidden cursor-pointer flex flex-col group shadow-lg"
                    >
                      {/* Visual Header */}
                      <div
                        className="h-36 relative flex items-center justify-center text-5xl overflow-hidden"
                        style={{
                          background: s.image
                            ? `url('${s.image}') center/cover no-repeat`
                            : `linear-gradient(180deg, ${cat.soft} 0%, rgba(22,22,22,0.85) 100%)`,
                        }}
                      >
                        {s.badge && (
                          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide text-white bg-gradient-to-r from-[#ff5f8a] to-[#ef1f4d] shadow-md">
                            {s.badge}
                          </span>
                        )}
                        {s.type === 'produto' && (
                          <span className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40">
                            Loja
                          </span>
                        )}
                        {!s.image && (
                          <span className="group-hover:scale-110 transition-transform">
                            {s.emoji || cat.emoji}
                          </span>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-[#ff5f8a] uppercase tracking-wider block mb-1">
                            {cat.label}
                          </span>
                          <h4 className="text-sm font-bold text-white leading-snug line-clamp-1 mb-1">
                            {s.name}
                          </h4>
                          <p className="text-xs text-white/55 line-clamp-2 leading-relaxed mb-3">
                            {s.desc}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                          <div>
                            <span className="text-base font-extrabold text-white block">
                              {s.price}
                            </span>
                            <span className="text-[10px] text-white/45">{s.duration}</span>
                          </div>
                          <span className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#ff5f8a] to-[#ef1f4d] text-white font-bold text-xs shadow-md group-hover:opacity-90">
                            {s.type === 'produto' ? 'Comprar' : 'Detalhes'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
