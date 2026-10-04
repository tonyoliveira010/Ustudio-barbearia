import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentConfig } from '../../types';
import { X, CreditCard, ExternalLink, Zap, ShieldCheck } from 'lucide-react';

export const PaymentConfigModal: React.FC = () => {
  const { isPaymentConfigOpen, setIsPaymentConfigOpen, paymentConfig, savePaymentConfig } = useApp();

  const [activeMethod, setActiveMethod] = useState<'sync' | 'infinite' | 'both' | 'none'>(
    paymentConfig.activeMethod
  );
  const [syncApiKey, setSyncApiKey] = useState(paymentConfig.syncApiKey);
  const [syncPixKey, setSyncPixKey] = useState(paymentConfig.syncPixKey);
  const [infiniteClientId, setInfiniteClientId] = useState(paymentConfig.infiniteClientId);
  const [infiniteApiKey, setInfiniteApiKey] = useState(paymentConfig.infiniteApiKey);
  const [webhookUrl, setWebhookUrl] = useState(paymentConfig.webhookUrl);
  const [isProduction, setIsProduction] = useState(paymentConfig.isProduction);

  if (!isPaymentConfigOpen) return null;

  const handleSave = () => {
    savePaymentConfig({
      activeMethod,
      syncApiKey: syncApiKey.trim(),
      syncPixKey: syncPixKey.trim(),
      infiniteClientId: infiniteClientId.trim(),
      infiniteApiKey: infiniteApiKey.trim(),
      webhookUrl: webhookUrl.trim(),
      isProduction,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={() => setIsPaymentConfigOpen(false)}
    >
      <div
        className="w-full max-w-[430px] max-h-[90vh] bg-[#161616] border border-white/15 rounded-t-3xl sm:rounded-3xl p-5 overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#34c281]" />
            <h3 className="text-base font-bold text-white">Configurar pagamentos</h3>
          </div>
          <button
            onClick={() => setIsPaymentConfigOpen(false)}
            className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center text-white/70 hover:text-white"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-white/60 leading-relaxed mb-4">
          Escolha como você quer receber pagamentos online e presenciais dos seus clientes.
        </p>

        {/* Method Selectors */}
        <div className="space-y-2.5 mb-5">
          {/* SyncPayments Option */}
          <div
            onClick={() =>
              setActiveMethod((prev) => (prev === 'sync' ? 'none' : prev === 'infinite' ? 'both' : 'sync'))
            }
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              activeMethod === 'sync' || activeMethod === 'both'
                ? 'bg-[#1e1e1e] border-white/30 shadow-md'
                : 'bg-[#141414] border-white/5 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  activeMethod === 'sync' || activeMethod === 'both'
                    ? 'bg-white text-black'
                    : 'bg-[#262626] text-white/70'
                }`}
              >
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <b className="text-xs font-bold text-white block">Pix via API (SyncPayments)</b>
                <span className="text-[11px] text-white/50 block">Recebimento direto e instantâneo</span>
              </div>
            </div>

            <a
              href="https://syncpayments.com.br/conecte-via-api"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[11px] font-semibold text-white/50 hover:text-white flex items-center gap-1 px-2 py-1"
            >
              <span>Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* InfinitePay Option */}
          <div
            onClick={() =>
              setActiveMethod((prev) => (prev === 'infinite' ? 'none' : prev === 'sync' ? 'both' : 'infinite'))
            }
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              activeMethod === 'infinite' || activeMethod === 'both'
                ? 'bg-[#1e1e1e] border-white/30 shadow-md'
                : 'bg-[#141414] border-white/5 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  activeMethod === 'infinite' || activeMethod === 'both'
                    ? 'bg-white text-black'
                    : 'bg-[#262626] text-white/70'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <b className="text-xs font-bold text-white block">InfinitePay Checkout</b>
                <span className="text-[11px] text-white/50 block">Cartão de crédito, Pix e parcelamento</span>
              </div>
            </div>

            <a
              href="https://www.infinitepay.io/checkout-documentacao"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[11px] font-semibold text-white/50 hover:text-white flex items-center gap-1 px-2 py-1"
            >
              <span>Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Detailed Fields based on Active Method */}
        <div className="space-y-3.5 text-xs">
          {(activeMethod === 'sync' || activeMethod === 'both') && (
            <div className="p-3.5 rounded-2xl bg-[#1e1e1e] space-y-2.5 border border-white/10">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#ff5f8a] block">
                Credenciais SyncPayments
              </span>

              <div>
                <label className="text-[10px] font-bold text-white/50 block mb-1">
                  Chave Pix cadastrada
                </label>
                <input
                  type="text"
                  value={syncPixKey}
                  onChange={(e) => setSyncPixKey(e.target.value)}
                  placeholder="sua-chave@pix.com.br"
                  className="w-full px-3 py-2 rounded-xl bg-[#262626] border border-white/10 text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-white/50 block mb-1">
                  API Key (Secret Token)
                </label>
                <input
                  type="password"
                  value={syncApiKey}
                  onChange={(e) => setSyncApiKey(e.target.value)}
                  placeholder="sync_sec_..."
                  className="w-full px-3 py-2 rounded-xl bg-[#262626] border border-white/10 text-white font-mono text-[11px] focus:outline-none focus:border-white/30"
                />
              </div>
            </div>
          )}

          {(activeMethod === 'infinite' || activeMethod === 'both') && (
            <div className="p-3.5 rounded-2xl bg-[#1e1e1e] space-y-2.5 border border-white/10">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2f7dff] block">
                Credenciais InfinitePay
              </span>

              <div>
                <label className="text-[10px] font-bold text-white/50 block mb-1">
                  Client ID
                </label>
                <input
                  type="text"
                  value={infiniteClientId}
                  onChange={(e) => setInfiniteClientId(e.target.value)}
                  placeholder="inf_cli_..."
                  className="w-full px-3 py-2 rounded-xl bg-[#262626] border border-white/10 text-white font-mono text-[11px] focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-white/50 block mb-1">
                  API Secret Token
                </label>
                <input
                  type="password"
                  value={infiniteApiKey}
                  onChange={(e) => setInfiniteApiKey(e.target.value)}
                  placeholder="inf_sec_..."
                  className="w-full px-3 py-2 rounded-xl bg-[#262626] border border-white/10 text-white font-mono text-[11px] focus:outline-none focus:border-white/30"
                />
              </div>
            </div>
          )}

          {/* Webhook & Environment */}
          <div className="space-y-2 pt-1">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1">
                URL de Webhook (notificação de pagamentos)
              </label>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-[#1e1e1e] border border-white/10 text-white/90 text-xs font-mono focus:outline-none focus:border-white/30"
              />
            </div>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#1e1e1e] cursor-pointer">
              <div>
                <span className="text-xs font-bold text-white block">Modo Produção (Live)</span>
                <span className="text-[11px] text-white/45 block">
                  {isProduction ? 'Cobranças reais ativas' : 'Modo sandbox de testes ativado'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={isProduction}
                onChange={(e) => setIsProduction(e.target.checked)}
                className="w-4 h-4 rounded accent-white"
              />
            </label>
          </div>
        </div>

        <div className="flex gap-2 pt-5 border-t border-white/10 mt-5">
          <button
            type="button"
            onClick={() => setIsPaymentConfigOpen(false)}
            className="flex-1 py-3 rounded-full bg-[#1e1e1e] hover:bg-[#262626] text-white/70 text-xs font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 rounded-full bg-white hover:bg-white/90 text-black text-xs font-bold transition-colors"
          >
            Salvar configuração
          </button>
        </div>
      </div>
    </div>
  );
};
