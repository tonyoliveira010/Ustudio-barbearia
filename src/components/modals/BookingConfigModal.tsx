import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, MessageSquare, Tag, DollarSign } from 'lucide-react';

export const BookingConfigModal: React.FC = () => {
  const { isBookingRulesOpen, setIsBookingRulesOpen, bookingSettings, saveBookingSettings } = useApp();

  const [activeTab, setActiveTab] = useState<'agenda' | 'contato' | 'cupons' | 'pagamento'>('agenda');

  const [minAdvanceHours, setMinAdvanceHours] = useState(bookingSettings.minAdvanceHours);
  const [bufferMinutes, setBufferMinutes] = useState(bookingSettings.bufferMinutes);
  const [freeCancellationHours, setFreeCancellationHours] = useState(bookingSettings.freeCancellationHours);
  const [requireWhatsapp, setRequireWhatsapp] = useState(bookingSettings.requireWhatsapp);
  const [autoWhatsappNotification, setAutoWhatsappNotification] = useState(bookingSettings.autoWhatsappNotification);
  const [firstVisitDiscount, setFirstVisitDiscount] = useState(bookingSettings.firstVisitDiscount);
  const [activeCoupon, setActiveCoupon] = useState(bookingSettings.activeCoupon);
  const [requireDeposit, setRequireDeposit] = useState(bookingSettings.requireDeposit);
  const [depositPercent, setDepositPercent] = useState(bookingSettings.depositPercent);
  const [allowPayOnSite, setAllowPayOnSite] = useState(bookingSettings.allowPayOnSite);

  if (!isBookingRulesOpen) return null;

  const handleSave = () => {
    saveBookingSettings({
      minAdvanceHours,
      bufferMinutes,
      freeCancellationHours,
      requireWhatsapp,
      autoWhatsappNotification,
      firstVisitDiscount,
      activeCoupon: activeCoupon.trim().toUpperCase(),
      requireDeposit,
      depositPercent,
      allowPayOnSite,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={() => setIsBookingRulesOpen(false)}
    >
      <div
        className="w-full max-w-[430px] max-h-[90vh] bg-[#161616] border border-white/15 rounded-t-3xl sm:rounded-3xl p-5 overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <h3 className="text-base font-bold text-white">Modal de agendamento do cliente</h3>
          <button
            onClick={() => setIsBookingRulesOpen(false)}
            className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center text-white/70 hover:text-white"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-[#1e1e1e] rounded-full mb-4">
          <button
            onClick={() => setActiveTab('agenda')}
            className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              activeTab === 'agenda' ? 'bg-white text-black' : 'text-white/50 hover:text-white'
            }`}
          >
            Agenda
          </button>
          <button
            onClick={() => setActiveTab('contato')}
            className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              activeTab === 'contato' ? 'bg-white text-black' : 'text-white/50 hover:text-white'
            }`}
          >
            Contato
          </button>
          <button
            onClick={() => setActiveTab('cupons')}
            className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              activeTab === 'cupons' ? 'bg-white text-black' : 'text-white/50 hover:text-white'
            }`}
          >
            Cupons
          </button>
          <button
            onClick={() => setActiveTab('pagamento')}
            className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              activeTab === 'pagamento' ? 'bg-white text-black' : 'text-white/50 hover:text-white'
            }`}
          >
            Pagamento
          </button>
        </div>

        {/* Tab 1: Agenda */}
        {activeTab === 'agenda' && (
          <div className="space-y-3.5 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#1e1e1e] space-y-1.5">
              <label className="text-xs font-bold text-white block">
                Antecedência mínima para agendar
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="48"
                  value={minAdvanceHours}
                  onChange={(e) => setMinAdvanceHours(Number(e.target.value))}
                  className="w-20 px-3 py-1.5 rounded-xl bg-[#262626] border border-white/10 text-white font-bold"
                />
                <span className="text-white/60">horas antes do horário</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#1e1e1e] space-y-1.5">
              <label className="text-xs font-bold text-white block">
                Intervalo de respiro entre atendimentos
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="60"
                  step="5"
                  value={bufferMinutes}
                  onChange={(e) => setBufferMinutes(Number(e.target.value))}
                  className="w-20 px-3 py-1.5 rounded-xl bg-[#262626] border border-white/10 text-white font-bold"
                />
                <span className="text-white/60">minutos (limpeza/preparação da sala)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#1e1e1e] space-y-1.5">
              <label className="text-xs font-bold text-white block">
                Cancelamento gratuito permitido até
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="72"
                  value={freeCancellationHours}
                  onChange={(e) => setFreeCancellationHours(Number(e.target.value))}
                  className="w-20 px-3 py-1.5 rounded-xl bg-[#262626] border border-white/10 text-white font-bold"
                />
                <span className="text-white/60">horas antes da sessão</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Contato */}
        {activeTab === 'contato' && (
          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1e1e1e] cursor-pointer">
              <div>
                <span className="font-bold text-white block">Exigir WhatsApp no agendamento</span>
                <span className="text-[11px] text-white/50 block mt-0.5">
                  Garante canal direto para envio de confirmação e ficha
                </span>
              </div>
              <input
                type="checkbox"
                checked={requireWhatsapp}
                onChange={(e) => setRequireWhatsapp(e.target.checked)}
                className="w-4 h-4 rounded accent-white"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1e1e1e] cursor-pointer">
              <div>
                <span className="font-bold text-white block">Lembretes automáticos</span>
                <span className="text-[11px] text-white/50 block mt-0.5">
                  Disparo de mensagem de confirmação 24h e 2h antes
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoWhatsappNotification}
                onChange={(e) => setAutoWhatsappNotification(e.target.checked)}
                className="w-4 h-4 rounded accent-white"
              />
            </label>
          </div>
        )}

        {/* Tab 3: Cupons */}
        {activeTab === 'cupons' && (
          <div className="space-y-3.5 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#1e1e1e] space-y-1.5">
              <label className="text-xs font-bold text-white block">
                Desconto para primeira visita
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={firstVisitDiscount}
                  onChange={(e) => setFirstVisitDiscount(Number(e.target.value))}
                  className="w-20 px-3 py-1.5 rounded-xl bg-[#262626] border border-white/10 text-white font-bold"
                />
                <span className="text-white/60">% de desconto automático</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#1e1e1e] space-y-1.5">
              <label className="text-xs font-bold text-white block">
                Código de cupom ativo
              </label>
              <input
                type="text"
                value={activeCoupon}
                onChange={(e) => setActiveCoupon(e.target.value)}
                placeholder="Ex: BEMVINDA10"
                className="w-full px-3 py-2 rounded-xl bg-[#262626] border border-white/10 text-white font-mono font-bold tracking-wider uppercase focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Tab 4: Pagamento */}
        {activeTab === 'pagamento' && (
          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1e1e1e] cursor-pointer">
              <div>
                <span className="font-bold text-white block">Exigir sinal / caução de reserva</span>
                <span className="text-[11px] text-white/50 block mt-0.5">
                  Evita faltas ("no-show") exigindo pagamento prévio
                </span>
              </div>
              <input
                type="checkbox"
                checked={requireDeposit}
                onChange={(e) => setRequireDeposit(e.target.checked)}
                className="w-4 h-4 rounded accent-white"
              />
            </label>

            {requireDeposit && (
              <div className="p-3.5 rounded-2xl bg-[#1e1e1e] space-y-1.5 ml-3 border-l-2 border-[#ff5f8a]">
                <label className="text-xs font-bold text-white block">
                  Porcentagem do sinal
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="10"
                    max="100"
                    step="5"
                    value={depositPercent}
                    onChange={(e) => setDepositPercent(Number(e.target.value))}
                    className="w-20 px-3 py-1.5 rounded-xl bg-[#262626] border border-white/10 text-white font-bold"
                  />
                  <span className="text-white/60">% do valor total do procedimento</span>
                </div>
              </div>
            )}

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1e1e1e] cursor-pointer">
              <div>
                <span className="font-bold text-white block">Permitir pagamento no local</span>
                <span className="text-[11px] text-white/50 block mt-0.5">
                  Cliente pode quitar o saldo restante na hora do atendimento
                </span>
              </div>
              <input
                type="checkbox"
                checked={allowPayOnSite}
                onChange={(e) => setAllowPayOnSite(e.target.checked)}
                className="w-4 h-4 rounded accent-white"
              />
            </label>
          </div>
        )}

        <div className="flex gap-2 pt-5 border-t border-white/10 mt-5">
          <button
            type="button"
            onClick={() => setIsBookingRulesOpen(false)}
            className="flex-1 py-3 rounded-full bg-[#1e1e1e] hover:bg-[#262626] text-white/70 text-xs font-semibold transition-colors"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 rounded-full bg-white hover:bg-white/90 text-black text-xs font-bold transition-colors"
          >
            Salvar regras
          </button>
        </div>
      </div>
    </div>
  );
};
