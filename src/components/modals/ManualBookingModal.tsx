import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Crown } from 'lucide-react';

export const ManualBookingModal: React.FC = () => {
  const { isManualBookingOpen, setIsManualBookingOpen, services, addClientBooking } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [time, setTime] = useState('10:00');
  const [serviceName, setServiceName] = useState('');
  const [isVip, setIsVip] = useState(false);
  const [notes, setNotes] = useState('');

  if (!isManualBookingOpen) return null;

  const activeServices = services.filter((s) => s.type === 'servico');
  const defaultService = activeServices[0]?.name || 'Limpeza de pele profunda';
  const selectedService = serviceName || defaultService;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addClientBooking({
      name: name.trim(),
      phone: phone.trim() || '(11) 99000-0000',
      time: time || '10:00',
      serviceName: selectedService,
      vip: isVip,
      notes: notes.trim() || undefined,
    });

    setName('');
    setPhone('');
    setNotes('');
    setIsVip(false);
    setIsManualBookingOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={() => setIsManualBookingOpen(false)}
    >
      <div
        className="w-full max-w-[430px] bg-[#161616] border border-white/15 rounded-t-3xl sm:rounded-3xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <h3 className="text-base font-bold text-white">Agendamento manual</h3>
          <button
            onClick={() => setIsManualBookingOpen(false)}
            className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center text-white/70 hover:text-white"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1">
              Nome da cliente
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Carla Mendes"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1e1e1e] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-white/40 font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1">
                Telefone / WhatsApp
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 90000-0000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1e1e1e] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1">
                Horário
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#1e1e1e] border border-white/10 text-white focus:outline-none focus:border-white/40 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1">
              Serviço desejado
            </label>
            <select
              value={selectedService}
              onChange={(e) => setServiceName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1e1e1e] border border-white/10 text-white focus:outline-none focus:border-white/40 font-medium"
            >
              {activeServices.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name} ({s.duration} · {s.price})
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#1e1e1e] cursor-pointer">
            <input
              type="checkbox"
              checked={isVip}
              onChange={(e) => setIsVip(e.target.checked)}
              className="w-4 h-4 rounded accent-white"
            />
            <div className="flex items-center gap-1.5 text-xs text-white">
              <Crown className="w-3.5 h-3.5 text-[#ffb020]" />
              <span className="font-semibold">Marcar como cliente VIP</span>
            </div>
          </label>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1">
              Observações (opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Prefere sala silenciosa"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1e1e1e] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-white/40"
            />
          </div>

          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={() => setIsManualBookingOpen(false)}
              className="flex-1 py-3 rounded-full bg-[#1e1e1e] hover:bg-[#262626] text-white/70 text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 py-3 rounded-full bg-white hover:bg-white/90 text-black text-xs font-bold transition-colors disabled:opacity-50"
            >
              Criar agendamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
