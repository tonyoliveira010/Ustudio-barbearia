import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Clock } from 'lucide-react';

const WEEKDAYS = [
  { key: 'seg', label: 'Seg' },
  { key: 'ter', label: 'Ter' },
  { key: 'qua', label: 'Qua' },
  { key: 'qui', label: 'Qui' },
  { key: 'sex', label: 'Sex' },
  { key: 'sab', label: 'Sáb' },
  { key: 'dom', label: 'Dom' },
];

export const HoursConfigModal: React.FC = () => {
  const { isHoursConfigOpen, setIsHoursConfigOpen, workingHours, saveWorkingHours } = useApp();

  const [selectedDays, setSelectedDays] = useState<string[]>(workingHours.days);
  const [startTime, setStartTime] = useState(workingHours.start);
  const [endTime, setEndTime] = useState(workingHours.end);

  if (!isHoursConfigOpen) return null;

  const toggleDay = (key: string) => {
    setSelectedDays((prev) =>
      prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key]
    );
  };

  const handleSave = () => {
    saveWorkingHours({
      days: selectedDays,
      start: startTime,
      end: endTime,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={() => setIsHoursConfigOpen(false)}
    >
      <div
        className="w-full max-w-[430px] bg-[#161616] border border-white/15 rounded-t-3xl sm:rounded-3xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#2f7dff]" />
            <h3 className="text-base font-bold text-white">Horário de atendimento</h3>
          </div>
          <button
            onClick={() => setIsHoursConfigOpen(false)}
            className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center text-white/70 hover:text-white"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-2">
              Dias de funcionamento
            </label>
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {WEEKDAYS.map((d) => {
                const isActive = selectedDays.includes(d.key);
                return (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => toggleDay(d.key)}
                    className={`flex-1 py-2.5 rounded-2xl font-bold transition-all text-center ${
                      isActive
                        ? 'bg-white text-black shadow-md'
                        : 'bg-[#1e1e1e] border border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1">
                Abertura
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#1e1e1e] border border-white/10 text-white font-bold focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1">
                Fechamento
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#1e1e1e] border border-white/10 text-white font-bold focus:outline-none focus:border-white/40"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-5 border-t border-white/10 mt-5">
          <button
            type="button"
            onClick={() => setIsHoursConfigOpen(false)}
            className="flex-1 py-3 rounded-full bg-[#1e1e1e] hover:bg-[#262626] text-white/70 text-xs font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 rounded-full bg-white hover:bg-white/90 text-black text-xs font-bold transition-colors"
          >
            Salvar horários
          </button>
        </div>
      </div>
    </div>
  );
};
