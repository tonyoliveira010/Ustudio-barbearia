import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, TrendingUp, Users, DollarSign, Sparkles } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { setActiveTab } = useApp();
  const [range, setRange] = useState<'dia' | 'semana' | 'mes'>('dia');

  // Metrics based on range
  const dataMap = {
    dia: {
      revenue: 'R$ 400',
      count: '3',
      avg: 'R$ 133',
      bars: [30, 45, 60, 90, 75, 40],
      labels: ['09h', '11h', '13h', '15h', '17h', '19h'],
      forecast: 'R$ 480 estimado para amanhã (+20% com 4 vagas preenchidas)',
    },
    semana: {
      revenue: 'R$ 2.450',
      count: '18',
      avg: 'R$ 136',
      bars: [45, 70, 85, 60, 95, 80, 20],
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      forecast: 'R$ 2.800 projetado para a próxima semana com campanhas ativas',
    },
    mes: {
      revenue: 'R$ 11.200',
      count: '84',
      avg: 'R$ 133',
      bars: [55, 65, 80, 95],
      labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
      forecast: 'R$ 12.500 no próximo mês com taxa de retorno de 78%',
    },
  };

  const currentData = dataMap[range];

  return (
    <div className="px-5 space-y-5">
      {/* Top Header */}
      <div className="space-y-3 pt-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('services')}
            className="w-9 h-9 rounded-full bg-[#161616] border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            aria-label="Voltar para serviços"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-xl font-bold text-white tracking-tight">Dashboard financeiro</h2>
        </div>

        {/* Range Segmented Control */}
        <div className="inline-flex p-1 bg-[#161616] border border-white/10 rounded-full w-full max-w-[280px]">
          <button
            onClick={() => setRange('dia')}
            className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              range === 'dia' ? 'bg-white text-black' : 'text-white/50 hover:text-white'
            }`}
          >
            Dia
          </button>
          <button
            onClick={() => setRange('semana')}
            className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              range === 'semana' ? 'bg-white text-black' : 'text-white/50 hover:text-white'
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => setRange('mes')}
            className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              range === 'mes' ? 'bg-white text-black' : 'text-white/50 hover:text-white'
            }`}
          >
            Mês
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-[#161616] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
              Faturamento
            </span>
            <DollarSign className="w-3.5 h-3.5 text-[#34c281]" />
          </div>
          <span className="text-base font-extrabold text-white tracking-tight">
            {currentData.revenue}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#161616] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
              Atendimentos
            </span>
            <Users className="w-3.5 h-3.5 text-[#2f7dff]" />
          </div>
          <span className="text-base font-extrabold text-white tracking-tight">
            {currentData.count}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#161616] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
              Ticket médio
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-[#ffb020]" />
          </div>
          <span className="text-base font-extrabold text-white tracking-tight">
            {currentData.avg}
          </span>
        </div>
      </div>

      {/* Interactive Visual Chart */}
      <div className="p-4 rounded-3xl bg-[#161616] border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Volume de vendas & atendimentos
          </span>
          <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            +14% vs período anterior
          </span>
        </div>

        {/* SVG Bars Visual */}
        <div className="h-36 w-full flex items-end justify-between gap-2 pt-4 px-2">
          {currentData.bars.map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <div
                className="w-full max-w-[32px] rounded-t-lg bg-gradient-to-t from-[#8f0d24] via-[#ef1f4d] to-[#ff5f8a] group-hover:brightness-125 transition-all relative"
                style={{ height: `${height}%` }}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-[10px] text-white px-1.5 py-0.5 rounded border border-white/20 pointer-events-none whitespace-nowrap z-10">
                  {height}%
                </div>
              </div>
              <span className="text-[10px] font-medium text-white/40 block truncate">
                {currentData.labels[i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Forecast Card */}
      <div className="p-4 rounded-3xl bg-[#1e1e1e] border border-white/10 flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-[#ffb020]/20 text-[#ffb020] flex items-center justify-center flex-shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider block mb-1">
            Previsão inteligente
          </span>
          <p className="text-sm font-semibold text-white leading-snug">
            {currentData.forecast}
          </p>
          <span className="text-xs text-white/50 block mt-1">
            Cálculo baseado no histórico de comparecimento e taxa de retorno dos clientes fidelizados.
          </span>
        </div>
      </div>

      {/* Top Services ranking */}
      <div className="p-4 rounded-3xl bg-[#161616] border border-white/10 space-y-3">
        <span className="text-xs font-bold text-white uppercase tracking-wider block">
          Mais procurados neste período
        </span>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#1e1e1e]">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px]">
                1
              </span>
              <span className="font-semibold text-white">Limpeza de pele profunda</span>
            </div>
            <span className="font-bold text-white">R$ 1.260 (7 atendimentos)</span>
          </div>

          <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#1e1e1e]">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px]">
                2
              </span>
              <span className="font-semibold text-white">Massagem relaxante</span>
            </div>
            <span className="font-bold text-white">R$ 750 (5 atendimentos)</span>
          </div>

          <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#1e1e1e]">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px]">
                3
              </span>
              <span className="font-semibold text-white">Design de sobrancelhas</span>
            </div>
            <span className="font-bold text-white">R$ 420 (6 atendimentos)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
