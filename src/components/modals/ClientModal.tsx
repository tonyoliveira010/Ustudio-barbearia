import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Crown, Calendar, MessageCircle, Clock, DollarSign, Trash2, CheckCircle2 } from 'lucide-react';

export const ClientModal: React.FC = () => {
  const {
    selectedClientId,
    setSelectedClientId,
    clients,
    cancelAppointment,
    setReschedulingClientId,
    updateClientNotes,
  } = useApp();

  const client = clients.find((c) => c.id === selectedClientId);

  const [notes, setNotes] = useState(client?.notes || '');

  useEffect(() => {
    if (client) {
      setNotes(client.notes || '');
    }
  }, [client]);

  if (!selectedClientId || !client) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handleStartReschedule = () => {
    setReschedulingClientId(client.id);
    setSelectedClientId(null);
  };

  const handleSaveNotes = () => {
    updateClientNotes(client.id, notes.trim());
  };

  const digits = client.phone.replace(/\D/g, '');
  const cleanPhone = digits.length <= 11 ? `55${digits}` : digits;
  const whatsappMessage = encodeURIComponent(
    `Olá ${client.name.split(' ')[0]}! Tudo bem? Aqui é do Studio. Confirmando seu atendimento de ${client.service} para ${client.time}. Qualquer dúvida estamos à disposição!`
  );
  const whatsappUrl = digits ? `https://wa.me/${cleanPhone}?text=${whatsappMessage}` : '#';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={() => setSelectedClientId(null)}
    >
      <div
        className="w-full max-w-[430px] max-h-[90vh] bg-[#161616] border border-white/15 rounded-t-3xl sm:rounded-3xl p-5 overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3.5 border-b border-white/10 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#262626] border border-white/10 flex items-center justify-center font-bold text-base text-white flex-shrink-0 shadow-md">
              {getInitials(client.name)}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-base font-bold text-white">{client.name}</h3>
                {client.vip && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#ffb020] text-black text-[10px] font-extrabold uppercase">
                    <Crown className="w-2.5 h-2.5 fill-black" />
                    VIP
                  </span>
                )}
              </div>
              <span className="text-xs text-white/55 block mt-0.5">{client.service}</span>
            </div>
          </div>

          <button
            onClick={() => setSelectedClientId(null)}
            className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center text-white/70 hover:text-white transition-colors"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3.5 text-xs">
          {/* Dados do Agendamento */}
          <div className="p-3.5 rounded-2xl bg-[#1e1e1e] border border-white/5 space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block">
              Dados do agendamento
            </span>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-[#262626]">
                <span className="text-[10px] text-white/40 block">Data & Horário</span>
                <span className="text-xs font-bold text-white block mt-0.5">{client.time}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#262626]">
                <span className="text-[10px] text-white/40 block">Duração & Valor</span>
                <span className="text-xs font-bold text-white block mt-0.5">
                  {client.duration} · {client.price}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#262626]">
                <span className="text-[10px] text-white/40 block">Telefone</span>
                <span className="text-xs font-bold text-white block mt-0.5">{client.phone}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#262626]">
                <span className="text-[10px] text-white/40 block">Status</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{client.status}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Botão de WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98"
          >
            <MessageCircle className="w-4 h-4 fill-black" />
            <span>Conversar no WhatsApp com {client.name.split(' ')[0]}</span>
          </a>

          {/* Observações */}
          <div className="p-3.5 rounded-2xl bg-[#1e1e1e] border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                Observações do atendimento
              </span>
              <button
                type="button"
                onClick={handleSaveNotes}
                className="text-[11px] font-bold text-[#2f7dff] hover:underline"
              >
                Salvar notas
              </button>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Preferências da cliente, histórico de tons, observações clínicas ou cuidados da sessão..."
              rows={3}
              className="w-full p-2.5 rounded-xl bg-[#262626] border border-white/10 text-white placeholder-white/30 text-xs leading-relaxed focus:outline-none focus:border-white/30 resize-none"
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-2 pt-2 border-t border-white/10">
            <button
              onClick={() => cancelAppointment(client.id)}
              className="flex-1 py-3 rounded-full bg-[#1e1e1e] hover:bg-rose-950/40 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Cancelar agendamento</span>
            </button>
            <button
              onClick={handleStartReschedule}
              className="flex-1 py-3 rounded-full bg-white hover:bg-white/90 text-black text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Reagendar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
