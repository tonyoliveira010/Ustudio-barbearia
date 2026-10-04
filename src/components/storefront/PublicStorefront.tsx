import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceItem } from '../../types';
import { QRGen } from '../../utils/qrGen';
import { buildPix, normKey } from '../../utils/pix';
import {
  ArrowLeft,
  Share2,
  ExternalLink,
  X,
  CheckCircle2,
  Zap,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';

const DOWS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const PublicStorefront: React.FC = () => {
  const {
    profile,
    services,
    setIsStorefrontOpen,
    addClientBooking,
    showToast,
  } = useApp();

  const layout = profile.layout || 'classic';
  const title = profile.title || profile.name || 'Meu Estúdio';
  const sub = profile.sub || profile.bio || 'Transformando autoestima com tecnologia de ponta e acolhimento';
  const place = profile.place || title;
  const google = profile.google || 'https://share.google/OIdcey9tf11sD3lEz';
  const googleOn = profile.googleOn ?? true;
  const whats = profile.whats || '(11) 90000-0000';
  const insta = profile.insta || profile.handle || '@marinaravi';
  const email = profile.email || 'contato@marinaravi.com.br';
  const address = profile.address || 'Av. Paulista, 1000 · Bela Vista, São Paulo — SP';
  const pixKey = profile.pixKey || 'tonyfilho911@gmail.com';
  const pixName = profile.pixName || 'Antonio Jose de Oliveira';
  const pixCity = profile.pixCity || 'SAO PAULO';
  const cover = profile.cover || '';
  const coverType = profile.coverType || 'image';
  const avatar = profile.avatar || '';

  // Tabs state (servicos, sobre mim com localização e contato unificados, pagamento)
  const [activeTab, setActiveTab] = useState<'servicos' | 'sobre' | 'pagamento'>('servicos');

  // Pix dynamic payment state
  const [payAmount, setPayAmount] = useState('50,00');
  const [payValue, setPayValue] = useState(50);
  const [lastCode, setLastCode] = useState('');
  const [qrSvg, setQrSvg] = useState('');

  // Review Modal state
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Booking Modal State
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookStep, setBookStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedDate, setSelectedDate] = useState('2026-09-11');
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [clientForm, setClientForm] = useState({ nome: '', telefone: '', email: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);

  // Pre-configured agenda days for booking
  const agendaDays = [
    {
      data: '2026-09-11',
      dow: 'Sex',
      day: '11',
      horarios: [
        { hora: '09:00', livre: true },
        { hora: '10:00', livre: true },
        { hora: '11:30', livre: false },
        { hora: '14:00', livre: true },
        { hora: '15:30', livre: true },
        { hora: '17:00', livre: true },
      ],
    },
    {
      data: '2026-09-12',
      dow: 'Sáb',
      day: '12',
      horarios: [
        { hora: '09:00', livre: true },
        { hora: '10:30', livre: true },
        { hora: '13:00', livre: true },
      ],
    },
    {
      data: '2026-09-14',
      dow: 'Seg',
      day: '14',
      horarios: [
        { hora: '10:00', livre: true },
        { hora: '13:00', livre: true },
        { hora: '15:00', livre: true },
      ],
    },
    {
      data: '2026-09-15',
      dow: 'Ter',
      day: '15',
      horarios: [
        { hora: '09:00', livre: true },
        { hora: '11:00', livre: true },
        { hora: '14:00', livre: true },
      ],
    },
    {
      data: '2026-09-16',
      dow: 'Qua',
      day: '16',
      horarios: [
        { hora: '09:30', livre: true },
        { hora: '14:30', livre: true },
        { hora: '16:00', livre: true },
      ],
    },
  ];

  // Recalculate Pix BR Code and QR SVG
  useEffect(() => {
    if (payValue >= 1 && pixKey && pixName && pixCity) {
      try {
        const code = buildPix({
          key: pixKey,
          name: pixName,
          city: pixCity,
          amount: payValue,
        });
        setLastCode(code);
        setQrSvg(QRGen.svg(code));
      } catch {
        setLastCode('');
        setQrSvg('');
      }
    } else {
      setLastCode('');
      setQrSvg('');
    }
  }, [payValue, pixKey, pixName, pixCity]);

  const handlePayAmountChange = (val: string) => {
    const clean = val.replace(/\./g, ',').replace(/[^\d,]/g, '');
    const [int, dec] = clean.split(',');
    const limited = dec === undefined ? (int || '') : `${int || ''},${dec.slice(0, 2)}`;
    setPayAmount(limited);
    const num = parseFloat(limited.replace(',', '.')) || 0;
    setPayValue(num);
  };

  const handleQuickPay = (val: number) => {
    setPayValue(val);
    setPayAmount(val.toFixed(2).replace('.', ','));
  };

  const handleCopyPix = async () => {
    if (!lastCode) return;
    try {
      await navigator.clipboard.writeText(lastCode);
      showToast('Código Pix copiado!');
    } catch {
      showToast('Selecione e copie o código');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, text: sub, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link do estúdio copiado!');
      }
    } catch {}
  };

  const renderCinemaTitle = () => {
    const parts = title.trim().split(/\s+/);
    if (parts.length < 2) return title;
    return (
      <>
        <span className="text-white/50">{parts[0]}</span> {parts.slice(1).join(' ')}
      </>
    );
  };

  // Booking Flow Triggers
  const openBookingFor = (svc?: ServiceItem) => {
    if (svc) {
      setSelectedService(svc);
      setBookStep(2);
    } else {
      setSelectedService(services[0] || null);
      setBookStep(1);
    }
    setIsBookingSuccess(false);
    setFormErrors({});
    setIsBookModalOpen(true);
  };

  const handleBookNext = () => {
    if (bookStep === 1) {
      if (!selectedService) return showToast('Selecione um serviço');
      setBookStep(2);
    } else if (bookStep === 2) {
      if (!selectedDate || !selectedTime) return showToast('Escolha a data e o horário');
      setBookStep(3);
    } else if (bookStep === 3) {
      const errors: Record<string, string> = {};
      if (!clientForm.nome.trim() || clientForm.nome.trim().split(' ').length < 2) {
        errors.nome = 'Informe seu nome e sobrenome.';
      }
      if (clientForm.telefone.replace(/\D/g, '').length < 10) {
        errors.telefone = 'Informe um WhatsApp com DDD válido.';
      }
      setFormErrors(errors);
      if (Object.keys(errors).length > 0) return;

      // Register booking
      addClientBooking({
        name: clientForm.nome.trim(),
        phone: clientForm.telefone.trim(),
        time: selectedTime,
        serviceName: selectedService?.name || 'Serviço Estético',
        vip: false,
      });

      setIsBookingSuccess(true);
      setBookStep(4);
      showToast('Agendamento confirmado com sucesso!');
    }
  };

  const digitsWhats = whats.replace(/\D/g, '');
  const instaHandle = insta.replace(/^@/, '').trim();
  const whatsappUrl = digitsWhats ? `https://wa.me/${digitsWhats.length <= 11 ? '55' + digitsWhats : digitsWhats}` : '#';

  const selectedDayObj = agendaDays.find((d) => d.data === selectedDate) || agendaDays[0];

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center selection:bg-[#ef1f4d] selection:text-white">
      {/* Top Banner (Preview Indicator) */}
      <div className="w-full bg-[#161616] border-b border-white/10 px-4 py-2.5 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-white/90">
            Site Público (Visão da Cliente)
          </span>
        </div>
        <button
          onClick={() => setIsStorefrontOpen(false)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-black text-xs font-bold hover:bg-white/90 transition-transform active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar ao painel</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-[430px] min-h-screen bg-black pb-24 relative shadow-2xl">
        {/* CINE HERO */}
        <div className="relative">
          {/* Cover Area */}
          <div
            className={`relative overflow-hidden transition-all ${
              layout === 'cinema'
                ? 'aspect-[9/16] max-h-[620px] w-full rounded-b-[34px] bg-gradient-to-b from-[#6b1a30] via-[#2a0a14] to-[#0a0305]'
                : layout === 'hero'
                ? 'h-[220px] bg-gradient-to-br from-[#ff5f8a] via-[#ef1f4d] to-[#8f0d24]'
                : 'h-[160px] bg-gradient-to-br from-[#ff5f8a] via-[#ef1f4d] to-[#8f0d24]'
            }`}
          >
            {cover ? (
              coverType === 'video' ? (
                <video
                  src={cover}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <img src={cover} alt="Capa" className="absolute inset-0 w-full h-full object-cover" />
              )
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center font-extrabold text-[#ffa6c4] tracking-tighter opacity-80 select-none">
                <span className="text-4xl">doce</span>
                <span className="text-4xl text-black/30">favorito</span>
              </div>
            )}

            {/* Base Dark Overlay for high contrast */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />

            {/* Directional Gradient Overlay */}
            <div
              className={`absolute inset-0 pointer-events-none ${
                layout === 'cinema'
                  ? 'bg-gradient-to-b from-black/50 via-black/15 via-black/50 via-black/85 to-black'
                  : layout === 'hero'
                  ? 'bg-gradient-to-b from-black/30 via-transparent to-black/85'
                  : 'bg-gradient-to-b from-black/25 via-transparent to-black/75'
              }`}
            />
          </div>

          {/* Top Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="absolute top-3.5 right-3.5 z-20 w-10 h-10 rounded-full bg-black/55 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            title="Compartilhar"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Cinema Title (overlays image) */}
          {layout === 'cinema' && (
            <div className="absolute left-0 right-0 bottom-0 z-20 p-5 pointer-events-none">
              <h1 className="text-3xl font-extrabold text-white leading-tight tracking-tight mb-2">
                {renderCinemaTitle()}
              </h1>
              <p className="text-sm font-light text-white/90 max-w-[28ch] leading-relaxed">
                {sub}
              </p>
            </div>
          )}
        </div>

        {/* PROFILE BLOCK (Hidden in Cinema mode) */}
        {layout !== 'cinema' && (
          <div className="px-4 relative z-30">
            {layout === 'hero' ? (
              <div className="w-full flex flex-col items-center justify-center text-center -mt-14">
                {/* Centered Avatar */}
                <div className="w-24 h-24 text-3xl rounded-full bg-[#161616] border-4 border-black text-white font-extrabold flex items-center justify-center flex-shrink-0 shadow-2xl mx-auto">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span>M</span>
                  )}
                </div>

                {/* Profile Info Centered */}
                <div className="w-full mt-3 flex flex-col items-center justify-center text-center">
                  <h2 className="text-xl font-bold text-white flex items-center justify-center gap-1.5">
                    <span>{title}</span>
                    <span className="text-[#2f7dff]" title="Verificado">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l2.4 2.2 3.2-.6.8 3.2 3 1.4-1 3.1 1 3.1-3 1.4-.8 3.2-3.2-.6L12 22l-2.4-2.2-3.2.6-.8-3.2-3-1.4 1-3.1-1-3.1 3-1.4.8-3.2 3.2.6z" />
                        <path
                          d="M9 12l2 2 4-4"
                          stroke="#161616"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </h2>

                  <div className="flex items-center justify-center gap-2.5 text-xs text-white/50 mt-1 flex-wrap">
                    <span>{insta}</span>
                    <span>·</span>
                    <span>{services.length} serviços</span>
                  </div>
                  <p className="text-xs text-white/70 mt-1.5 leading-relaxed max-w-xs mx-auto text-center">{sub}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-[76px_1fr] gap-3.5 items-end -mt-9">
                <div className="w-20 h-20 text-2xl rounded-full bg-[#161616] border-4 border-black text-white font-extrabold flex items-center justify-center flex-shrink-0 shadow-2xl">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span>M</span>
                  )}
                </div>

                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-white flex items-center gap-1.5">
                    <span>{title}</span>
                  </h2>
                  <div className="flex gap-2.5 text-xs text-white/50 mt-0.5">
                    <span>{insta}</span>
                    <span>·</span>
                    <span>{services.length} serviços</span>
                  </div>
                  <p className="text-xs text-white/70 mt-1 leading-snug">{sub}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* GOOGLE REVIEWS TOP CARD (if enabled) */}
        {googleOn && (
          <div className="px-4 mt-4">
            <div className="p-4 rounded-2xl bg-[#161616] border border-white/10 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg width="24" height="24" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.5 17.7 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">
                    Avaliações no Google
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-white/60">
                    <span className="text-amber-400 tracking-wider">★★★★★</span>
                    <b className="text-white text-sm">5.0</b>
                    <span>(48 avaliações)</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded-xl text-center leading-tight">
                  Google<br />Verificado ✓
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">
                  Avalie nosso atendimento no Google
                </h4>
                <p className="text-xs text-white/55 leading-relaxed">
                  Sua opinião é fundamental para mantermos a excelência nos tratamentos.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsReviewOpen(true)}
                className="w-full py-2.5 rounded-full bg-[#1e1e1e] hover:bg-[#262626] border border-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Deixar avaliação no Google</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* TABS HEADER */}
        <div className="flex border-b border-white/10 px-4 mt-5">
          {[
            { id: 'servicos', label: 'Serviços' },
            { id: 'sobre', label: 'Sobre mim' },
            { id: 'pagamento', label: 'Pagamento' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 text-xs font-bold whitespace-nowrap transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'text-white border-white'
                  : 'text-white/40 border-transparent hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: SERVIÇOS */}
        {activeTab === 'servicos' && (
          <div className="p-4 space-y-2.5">
            {services.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => openBookingFor(s)}
                className="w-full p-4 rounded-2xl bg-[#161616] border border-white/10 hover:bg-[#1e1e1e] hover:border-white/25 transition-all text-left flex items-center justify-between gap-3 group"
              >
                <div className="min-w-0 flex-1">
                  <b className="text-sm font-bold text-white block group-hover:text-rose-400 transition-colors">
                    {s.name}
                  </b>
                  <span className="text-xs text-white/50 block mt-0.5">{s.duration}</span>
                </div>
                <span className="px-3.5 py-1.5 rounded-full bg-[#262626] text-xs font-bold text-white flex-shrink-0 group-hover:bg-white group-hover:text-black transition-colors">
                  {s.price}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* TAB 2: SOBRE MIM (Sobre mim + Localização embed + Contatos unificados) */}
        {activeTab === 'sobre' && (
          <div className="p-4 space-y-3.5">
            {/* 1. Biografia e Diferenciais */}
            <div className="p-4 rounded-2xl bg-[#161616] border border-white/10 text-xs text-white/75 leading-relaxed space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Sobre mim
              </h4>
              <p>
                {profile.about ||
                  'Trabalho há mais de 8 anos com estética facial e corporal em São Paulo. Meu foco é criar experiências de autocuidado personalizadas, sempre com escuta atenta e cuidado técnico em cada procedimento.'}
              </p>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider pt-1">
                Diferenciais e formação
              </h4>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-[#1e1e1e] border border-white/10 text-white font-semibold text-[11px]">
                  ✓ Estética avançada
                </span>
                <span className="px-3 py-1 rounded-full bg-[#1e1e1e] border border-white/10 text-white font-semibold text-[11px]">
                  ✓ Biossegurança rigorosa
                </span>
                <span className="px-3 py-1 rounded-full bg-[#1e1e1e] border border-white/10 text-white font-semibold text-[11px]">
                  ✓ Protocolos personalizados
                </span>
                <span className="px-3 py-1 rounded-full bg-[#1e1e1e] border border-white/10 text-white font-semibold text-[11px]">
                  ✓ Cosméticos de alta performance
                </span>
              </div>
            </div>

            {/* 2. Localização no Mapa (Embed) */}
            <div className="p-4 rounded-2xl bg-[#161616] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#2f7dff]" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Localização & Endereço
                  </h4>
                </div>
                <span className="text-[11px] text-white/45 truncate max-w-[150px]">{place || title}</span>
              </div>

              {/* Google Maps Embed Frame */}
              <div className="h-60 rounded-2xl overflow-hidden bg-[#1e1e1e] border border-white/10 relative">
                <iframe
                  title="Estabelecimento no Google Maps"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(place || title)}&output=embed&hl=pt-BR`}
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>

              {address && (
                <div className="text-xs text-white/70 leading-relaxed bg-[#1e1e1e] p-3 rounded-xl border border-white/5">
                  <b className="text-white block mb-0.5">Endereço do estúdio</b>
                  <span>{address}</span>
                </div>
              )}

              <a
                href={google || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place || title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-full bg-[#1e1e1e] hover:bg-[#262626] border border-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Abrir rota no Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#2f7dff]" />
              </a>
            </div>

            {/* 3. Informações de Contato e Horários */}
            <div className="p-4 rounded-2xl bg-[#161616] border border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Informações de Contato
              </h4>

              <div className="space-y-2">
                {whats && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-2xl bg-[#1e1e1e] border border-white/10 flex items-center justify-between text-white hover:bg-[#262626] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Phone className="w-4 h-4 stroke-[1.5]" />
                      </div>
                      <div>
                        <b className="block font-bold text-xs">WhatsApp</b>
                        <span className="text-[11px] text-white/50">{whats}</span>
                      </div>
                    </div>
                    <span className="text-white/40 text-xs">Falar agora ›</span>
                  </a>
                )}

                {instaHandle && (
                  <a
                    href={`https://instagram.com/${instaHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-2xl bg-[#1e1e1e] border border-white/10 flex items-center justify-between text-white hover:bg-[#262626] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 font-bold text-xs">
                        IG
                      </div>
                      <div>
                        <b className="block font-bold text-xs">Instagram</b>
                        <span className="text-[11px] text-white/50">@{instaHandle}</span>
                      </div>
                    </div>
                    <span className="text-white/40 text-xs">Ver perfil ›</span>
                  </a>
                )}

                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="p-3.5 rounded-2xl bg-[#1e1e1e] border border-white/10 flex items-center justify-between text-white hover:bg-[#262626] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Mail className="w-4 h-4 stroke-[1.5]" />
                      </div>
                      <div>
                        <b className="block font-bold text-xs">E-mail</b>
                        <span className="text-[11px] text-white/50 truncate max-w-[200px] block">{email}</span>
                      </div>
                    </div>
                    <span className="text-white/40 text-xs">Enviar ›</span>
                  </a>
                )}
              </div>

              {/* Horário de Atendimento */}
              <div className="pt-2 border-t border-white/10 space-y-1.5 text-[11.5px]">
                <span className="text-white/50 block font-semibold uppercase text-[10px] tracking-wider mb-1">
                  Horário de atendimento
                </span>
                <div className="flex justify-between pb-1 border-b border-white/5">
                  <span className="text-white/60">Segunda a sexta</span>
                  <b className="text-white">09:00 – 18:00</b>
                </div>
                <div className="flex justify-between pb-1 border-b border-white/5">
                  <span className="text-white/60">Sábado</span>
                  <b className="text-white">09:00 – 14:00</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Domingo</span>
                  <b className="text-white/40">Fechado</b>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PAGAMENTO PIX */}
        {activeTab === 'pagamento' && (
          <div className="p-4">
            <div className="p-4 rounded-2xl bg-[#161616] border border-white/10 space-y-3">
              <div className="flex items-center gap-3 pb-2 border-b border-white/10">
                <div className="w-10 h-10 rounded-full bg-[#262626] flex items-center justify-center text-white flex-shrink-0">
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <b className="text-xs font-bold text-white block truncate">{pixName}</b>
                  <span className="text-[11px] text-white/50 block truncate">{pixKey}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1">
                  Quanto você quer pagar?
                </label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#1e1e1e] border border-white/10 focus-within:border-white/30">
                  <span className="text-sm font-bold text-white/40">R$</span>
                  <input
                    type="text"
                    value={payAmount}
                    onChange={(e) => handlePayAmountChange(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-transparent text-xl font-extrabold text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-1.5 flex-wrap">
                {[50, 100, 150, 200].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleQuickPay(v)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                      payValue === v
                        ? 'bg-white text-black'
                        : 'bg-[#1e1e1e] border border-white/10 text-white/70 hover:text-white'
                    }`}
                  >
                    R$ {v}
                  </button>
                ))}
              </div>

              {/* Generated QR & Copia e Cola */}
              {qrSvg && (
                <div className="pt-2 flex flex-col items-center gap-3">
                  <div
                    className="w-48 h-48 bg-white p-2.5 rounded-2xl flex items-center justify-center shadow-lg"
                    dangerouslySetInnerHTML={{ __html: qrSvg }}
                  />
                  <span className="text-xs text-white/60">
                    Total: <b className="text-white">R$ {payValue.toFixed(2).replace('.', ',')}</b>
                  </span>

                  <div className="w-full">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1">
                      Pix copia e cola
                    </span>
                    <div className="p-2.5 rounded-xl bg-[#1e1e1e] text-[10px] text-white/70 font-mono break-all max-h-20 overflow-y-auto mb-2 select-all">
                      {lastCode}
                    </div>

                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={handleCopyPix}
                        className="w-full py-2.5 rounded-full bg-white text-black font-bold text-xs hover:bg-white/90 transition-transform active:scale-98"
                      >
                        Copiar código Pix
                      </button>

                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 rounded-full bg-[#1e1e1e] hover:bg-[#262626] border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span>Enviar comprovante no WhatsApp</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BOTTOM FIXED CTA: AGENDAR HORÁRIO */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent flex justify-center z-40">
          <button
            type="button"
            onClick={() => openBookingFor()}
            className="w-full max-w-[398px] py-4 rounded-full bg-white text-black font-extrabold text-sm shadow-2xl hover:bg-white/95 active:scale-98 transition-transform"
          >
            Agendar horário
          </button>
        </div>
      </div>

      {/* ================= MODAL: AVALIAR NO GOOGLE ================= */}
      {isReviewOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setIsReviewOpen(false)}
        >
          <div
            className="w-full max-w-[430px] bg-[#161616] border border-white/15 rounded-t-3xl sm:rounded-3xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div>
                <h3 className="text-base font-bold text-white">Avaliar no Google</h3>
                <span className="text-xs text-white/50 block">{place || title}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewOpen(false)}
                className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="h-72 rounded-2xl overflow-hidden bg-[#1e1e1e] border border-white/10 mb-4">
              <iframe
                title="Estabelecimento no Google Maps"
                src={`https://www.google.com/maps?q=${encodeURIComponent(place || title)}&output=embed&hl=pt-BR`}
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>

            <div className="space-y-2">
              <a
                href={google || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place || title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-full bg-white text-black font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/90"
              >
                <span>Escrever avaliação no Google</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => setIsReviewOpen(false)}
                className="w-full py-3 rounded-full bg-[#1e1e1e] text-white/70 text-xs font-semibold hover:text-white"
              >
                Agora não
              </button>
            </div>
            <p className="text-[11px] text-white/40 text-center mt-3 leading-relaxed">
              Para publicar a avaliação, o Google solicita login na sua conta Google.
            </p>
          </div>
        </div>
      )}

      {/* ================= MODAL: AGENDAR + PAGAR (4 STEPS) ================= */}
      {isBookModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setIsBookModalOpen(false)}
        >
          <div
            className="w-full max-w-[430px] max-h-[92vh] bg-[#161616] border border-white/15 rounded-t-3xl sm:rounded-3xl p-5 overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  {bookStep === 1
                    ? 'Escolha o serviço'
                    : bookStep === 2
                    ? selectedService?.name || 'Agendar'
                    : bookStep === 3
                    ? 'Confirme e pague'
                    : 'Pagamento'}
                </h3>
                {selectedService && bookStep > 1 && bookStep < 4 && (
                  <span className="text-xs text-white/50 block">
                    {selectedService.duration} · {selectedService.price}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsBookModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Progress Bar (steps 1, 2, 3) */}
            {bookStep < 4 && (
              <div className="flex gap-1.5 mb-4">
                <i className={`h-1 flex-1 rounded-full ${bookStep >= 1 ? 'bg-white' : 'bg-[#262626]'}`} />
                <i className={`h-1 flex-1 rounded-full ${bookStep >= 2 ? 'bg-white' : 'bg-[#262626]'}`} />
                <i className={`h-1 flex-1 rounded-full ${bookStep >= 3 ? 'bg-white' : 'bg-[#262626]'}`} />
              </div>
            )}

            {/* STEP 1: Escolha o serviço */}
            {bookStep === 1 && (
              <div className="space-y-2">
                {services.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSelectedService(s);
                      setBookStep(2);
                    }}
                    className="w-full p-3.5 rounded-2xl bg-[#1e1e1e] border border-white/5 hover:border-white/20 transition-all text-left flex items-center justify-between"
                  >
                    <div>
                      <b className="text-xs font-bold text-white block">{s.name}</b>
                      <small className="text-[11px] text-white/50 block">{s.duration}</small>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#262626] text-xs font-bold text-white">
                      {s.price}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* STEP 2: Escolha data & horário */}
            {bookStep === 2 && (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-2">
                    Escolha o dia
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {agendaDays.map((d) => (
                      <button
                        key={d.data}
                        type="button"
                        onClick={() => setSelectedDate(d.data)}
                        className={`flex-shrink-0 w-14 py-2.5 rounded-2xl flex flex-col items-center justify-center transition-all ${
                          selectedDate === d.data
                            ? 'bg-white text-black font-extrabold shadow-md'
                            : 'bg-[#1e1e1e] border border-white/10 text-white/70 hover:text-white'
                        }`}
                      >
                        <span className="text-[10px] font-semibold uppercase">{d.dow}</span>
                        <span className="text-base font-bold mt-0.5">{d.day}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-2">
                    Escolha o horário
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedDayObj.horarios.map((h) => (
                      <button
                        key={h.hora}
                        type="button"
                        disabled={!h.livre}
                        onClick={() => setSelectedTime(h.hora)}
                        className={`py-2.5 rounded-full font-bold text-xs transition-all ${
                          !h.livre
                            ? 'opacity-30 line-through bg-[#1a1a1a] text-white/30 cursor-not-allowed'
                            : selectedTime === h.hora
                            ? 'bg-white text-black shadow-md'
                            : 'bg-[#1e1e1e] border border-white/10 text-white/80 hover:bg-[#262626]'
                        }`}
                      >
                        {h.hora}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setBookStep(1)}
                    className="py-3 px-4 rounded-full bg-[#1e1e1e] text-white/70 text-xs font-semibold hover:text-white"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={handleBookNext}
                    className="flex-1 py-3 rounded-full bg-white hover:bg-white/90 text-black text-xs font-bold transition-colors"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Dados & Pagamento */}
            {bookStep === 3 && (
              <div className="space-y-3.5 text-xs">
                {/* Summary */}
                <div className="p-3.5 rounded-2xl bg-[#1e1e1e] space-y-1.5 border border-white/10">
                  <div className="flex justify-between">
                    <span className="text-white/50">Serviço</span>
                    <b className="text-white font-bold">{selectedService?.name}</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Data</span>
                    <b className="text-white font-bold">
                      {selectedDayObj.dow}, {selectedDayObj.day} de setembro
                    </b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Horário</span>
                    <b className="text-white font-bold">{selectedTime}</b>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-white/10 text-sm">
                    <span className="text-white/60">Total</span>
                    <b className="text-white font-extrabold">{selectedService?.price}</b>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    value={clientForm.nome}
                    onChange={(e) => setClientForm({ ...clientForm, nome: e.target.value })}
                    placeholder="Ex: Carla Mendes"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1e1e1e] border border-white/10 text-white font-semibold focus:outline-none focus:border-white/30"
                  />
                  {formErrors.nome && <p className="text-[#ff6b6b] text-[11px] mt-1">{formErrors.nome}</p>}
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={clientForm.telefone}
                    onChange={(e) => setClientForm({ ...clientForm, telefone: e.target.value })}
                    placeholder="(11) 90000-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1e1e1e] border border-white/10 text-white focus:outline-none focus:border-white/30"
                  />
                  {formErrors.telefone && (
                    <p className="text-[#ff6b6b] text-[11px] mt-1">{formErrors.telefone}</p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1">
                    E-mail (opcional)
                  </label>
                  <input
                    type="email"
                    value={clientForm.email}
                    onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                    placeholder="voce@email.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1e1e1e] border border-white/10 text-white focus:outline-none focus:border-white/30"
                  />
                </div>

                <div className="flex gap-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setBookStep(2)}
                    className="py-3 px-4 rounded-full bg-[#1e1e1e] text-white/70 text-xs font-semibold hover:text-white"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={handleBookNext}
                    className="flex-1 py-3 rounded-full bg-white hover:bg-white/90 text-black text-xs font-bold transition-colors"
                  >
                    Pagar com InfinitePay ou Pix
                  </button>
                </div>
                <p className="text-[11px] text-white/40 text-center leading-relaxed">
                  Cartão em até 12x ou Pix. O horário fica reservado para você.
                </p>
              </div>
            )}

            {/* STEP 4: Concluído */}
            {bookStep === 4 && (
              <div className="py-6 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">Tudo certo, {clientForm.nome}!</h4>
                <p className="text-xs text-white/70 leading-relaxed max-w-xs mx-auto">
                  Seu agendamento para <b>{selectedService?.name}</b> foi confirmado para{' '}
                  <b>
                    {selectedDayObj.dow}, {selectedDayObj.day} de setembro às {selectedTime}
                  </b>
                  .
                </p>
                <div className="p-3.5 rounded-2xl bg-[#1e1e1e] border border-white/10 text-xs text-left text-white/80 space-y-1">
                  <p><b>Profissional:</b> {title}</p>
                  <p><b>Endereço:</b> {address}</p>
                  <p><b>Valor:</b> {selectedService?.price}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="w-full py-3.5 rounded-full bg-white text-black font-bold text-xs hover:bg-white/90 transition-transform active:scale-95"
                >
                  Concluir
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
