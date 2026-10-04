import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { COVER_PRESETS } from '../../data/initialData';
import { PageFormatSelector } from '../common/PageFormatSelector';
import { DataEditModal, DataEditType } from '../modals/DataEditModal';
import {
  Pencil,
  BadgeCheck,
  Calendar,
  Sparkles,
  Trash2,
  Plus,
  RefreshCw,
  ExternalLink,
  Share2,
  Star,
  Zap,
  Phone,
  ShieldCheck,
  ChevronRight,
  Camera,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    profile,
    services,
    clients,
    banners,
    saveProfile,
    removeBanner,
    setProfileEditField,
    setIsBookingRulesOpen,
    setIsBannerModalOpen,
    setIsStorefrontOpen,
    resetAllData,
    setActiveTab,
    showToast,
  } = useApp();

  const [activeDataModal, setActiveDataModal] = useState<DataEditType>(null);
  const fileCoverRef = useRef<HTMLInputElement>(null);
  const fileAvatarRef = useRef<HTMLInputElement>(null);

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 25 * 1024 * 1024) {
      showToast('Arquivo muito grande (máx. 25 MB)');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        saveProfile({
          cover: reader.result,
          coverType: 'image',
          customCoverUrl: reader.result,
        });
        showToast('Foto da capa atualizada com sucesso!');
      }
    };
    reader.readAsDataURL(f);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      showToast('Imagem muito grande (máx. 10 MB)');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        saveProfile({
          avatar: reader.result,
          avatarUrl: reader.result,
        });
        showToast('Foto de perfil atualizada com sucesso!');
      }
    };
    reader.readAsDataURL(f);
  };

  const currentCoverGradient = COVER_PRESETS[profile.coverIndex] || COVER_PRESETS[0];
  const layout = profile.layout || 'classic';
  const isCinema = layout === 'cinema';
  const isHero = layout === 'hero';

  const title = profile.title || profile.name || 'Meu Estúdio';
  const sub = profile.sub || profile.bio || 'Transformando autoestima com tecnologia de ponta e acolhimento';

  const renderCinemaTitle = () => {
    const parts = title.trim().split(/\s+/);
    if (parts.length < 2) return title;
    return (
      <>
        <span className="text-white/50">{parts[0]}</span> {parts.slice(1).join(' ')}
      </>
    );
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

  return (
    <div className="space-y-6 pb-6">
      {/* Hidden File Inputs for Direct Native Image Upload */}
      <input
        ref={fileCoverRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleCoverUpload}
      />
      <input
        ref={fileAvatarRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarUpload}
      />

      {/* Dynamic Cover Header reflecting Profile Layout Format */}
      <div className="relative">
        <div
          onClick={() => fileCoverRef.current?.click()}
          className={`relative cursor-pointer overflow-hidden transition-all shadow-inner group ${
            isCinema
              ? 'aspect-[9/16] max-h-[580px] w-full rounded-b-[34px] bg-gradient-to-b from-[#6b1a30] via-[#2a0a14] to-[#0a0305]'
              : isHero
              ? 'h-[220px] bg-gradient-to-br from-[#ff5f8a] via-[#ef1f4d] to-[#8f0d24]'
              : 'h-[160px] bg-gradient-to-br from-[#ff5f8a] via-[#ef1f4d] to-[#8f0d24]'
          }`}
          style={{
            background: profile.cover
              ? undefined
              : profile.customCoverUrl
              ? `url('${profile.customCoverUrl}') center/cover no-repeat`
              : `linear-gradient(135deg, ${currentCoverGradient[0]}, ${currentCoverGradient[1]}, ${currentCoverGradient[2]})`,
          }}
        >
          {profile.cover ? (
            profile.coverType === 'video' ? (
              <video
                src={profile.cover}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <img src={profile.cover} alt="Capa" className="absolute inset-0 w-full h-full object-cover" />
            )
          ) : isCinema ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center font-extrabold text-[#ffa6c4] tracking-tighter opacity-80 select-none">
              <span className="text-4xl">doce</span>
              <span className="text-4xl text-black/30">favorito</span>
            </div>
          ) : null}

          {/* Base Dark Overlay for high contrast */}
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />

          {/* Directional Gradient Overlay */}
          <div
            className={`absolute inset-0 pointer-events-none ${
              isCinema
                ? 'bg-gradient-to-b from-black/50 via-black/15 via-black/50 via-black/85 to-black'
                : isHero
                ? 'bg-gradient-to-b from-black/30 via-transparent to-black/85'
                : 'bg-gradient-to-b from-black/25 via-transparent to-black/75'
            }`}
          />
        </div>

        {/* Direct Edit Cover Chip */}
        <button
          type="button"
          onClick={() => fileCoverRef.current?.click()}
          className={`absolute z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-semibold hover:bg-black/80 transition-colors ${
            isCinema
              ? 'top-3.5 left-3.5'
              : isHero
              ? 'bottom-12 right-3.5'
              : 'bottom-3 right-3.5'
          }`}
        >
          <Camera className="w-3 h-3" />
          <span>Editar capa</span>
        </button>

        {/* Share Button (Cinema mode) */}
        {isCinema && (
          <button
            type="button"
            onClick={handleShare}
            className="absolute top-3.5 right-3.5 z-20 w-10 h-10 rounded-full bg-black/55 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            title="Compartilhar"
          >
            <Share2 className="w-4 h-4" />
          </button>
        )}

        {/* Cinema Titles overlaid directly on the image */}
        {isCinema && (
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

      {/* Profile Identity Block (Hidden in Cinema mode since it's overlaid on cover) */}
      {!isCinema && (
        <div className="px-5">
          {isHero ? (
            /* Destaque: Avatar estritamente centralizado com presença visual marcante */
            <div className="w-full flex flex-col items-center justify-center text-center -mt-14 relative z-20">
              {/* Avatar centralizado */}
              <div
                onClick={() => fileAvatarRef.current?.click()}
                className="relative rounded-full bg-[#161616] border-4 border-black w-24 h-24 text-3xl flex items-center justify-center font-extrabold text-white cursor-pointer group shadow-2xl flex-shrink-0 mx-auto"
                title="Clique para fazer upload de foto de perfil"
              >
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full rounded-full object-cover" />
                ) : profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span>{profile.avatarEmoji || 'M'}</span>
                )}
                <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white text-black flex items-center justify-center border-2 border-black group-hover:scale-110 transition-transform">
                  <Camera className="w-3 h-3 stroke-[2.5]" />
                </span>
              </div>

              {/* Botão de Ação: Editar perfil (upload de imagem) */}
              <button
                type="button"
                onClick={() => fileAvatarRef.current?.click()}
                className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e1e1e] hover:bg-[#262626] border border-white/15 text-white text-xs font-semibold transition-colors"
              >
                <Camera className="w-3 h-3 text-[#2f7dff]" />
                <span>Editar perfil</span>
              </button>

              {/* Info Centralizado */}
              <div
                onClick={() => setProfileEditField('name')}
                className="w-full mt-2.5 flex flex-col items-center justify-center text-center cursor-pointer group"
              >
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  <h2 className="text-xl font-bold text-white tracking-tight group-hover:text-rose-400 transition-colors">
                    {profile.name}
                  </h2>
                  <BadgeCheck className="w-5 h-5 text-[#2f7dff] fill-[#2f7dff]/20 flex-shrink-0" />
                </div>

                <div className="flex items-center justify-center gap-2.5 text-xs text-white/50 mt-1 flex-wrap">
                  <span>{profile.handle}</span>
                  <span>·</span>
                  <span>{services.length} serviços</span>
                  <span>·</span>
                  <span>{clients.length} agendamentos hoje</span>
                </div>

                {profile.bio && (
                  <p className="text-xs text-white/70 mt-1.5 leading-relaxed max-w-xs mx-auto text-center">
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* Clássico: Foto lateral e dados ao lado */
            <div className="flex flex-row gap-4 items-end -mt-10 relative z-20">
              <div
                onClick={() => fileAvatarRef.current?.click()}
                className="relative rounded-full bg-[#161616] border-4 border-black w-20 h-20 text-2xl flex items-center justify-center font-extrabold text-white cursor-pointer group shadow-xl flex-shrink-0"
                title="Clique para fazer upload de foto de perfil"
              >
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full rounded-full object-cover" />
                ) : profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span>{profile.avatarEmoji || 'M'}</span>
                )}
                <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white text-black flex items-center justify-center border-2 border-black group-hover:scale-110 transition-transform">
                  <Camera className="w-3 h-3 stroke-[2.5]" />
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div
                    onClick={() => setProfileEditField('name')}
                    className="cursor-pointer group flex-1 min-w-0"
                  >
                    <h2 className="text-xl font-bold text-white tracking-tight group-hover:text-rose-400 transition-colors truncate">
                      {profile.name}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-white/50 mt-0.5 flex-wrap">
                      <span>{profile.handle}</span>
                      <span>·</span>
                      <span>{services.length} serviços</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => fileAvatarRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1e1e1e] hover:bg-[#262626] border border-white/15 text-white text-xs font-semibold transition-colors flex-shrink-0"
                    title="Fazer upload de foto de perfil"
                  >
                    <Camera className="w-3 h-3 text-[#2f7dff]" />
                    <span>Editar perfil</span>
                  </button>
                </div>

                {profile.bio && (
                  <p
                    onClick={() => setProfileEditField('name')}
                    className="text-xs text-white/70 mt-1 leading-relaxed truncate cursor-pointer hover:text-white"
                  >
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Public Storefront Preview Action */}
      <div className="px-5">
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-white/50">Link público do seu estúdio</span>
          <button
            onClick={() => setIsStorefrontOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1e1e1e] hover:bg-[#262626] text-xs font-semibold text-white hover:text-white transition-colors"
          >
            <ExternalLink className="w-3 h-3 text-[#2f7dff]" />
            <span>Visualizar site</span>
          </button>
        </div>
      </div>

      {/* Layout Format Selection */}
      <section className="px-5 space-y-3">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">Formato da página pública</h3>
          <p className="text-xs text-white/50">Personalize o layout visual que suas clientes verão</p>
        </div>

        {/* Live Format Selector: immediately updates head above */}
        <PageFormatSelector showSectionHeader={false} />
      </section>

      {/* Componentes de Editar Dados: Avaliações no Google, Agendamento InfinitePay, Pagamento Pix, Informações de Contato */}
      <section className="px-5 space-y-3">
        <div className="flex items-baseline justify-between">
          <h3 className="text-sm font-bold text-white tracking-tight">Editar dados da página</h3>
          <span className="text-xs text-white/40">Toque para configurar</span>
        </div>

        <div className="space-y-2.5">
          {/* 1. Avaliações no Google */}
          <button
            type="button"
            onClick={() => setActiveDataModal('google')}
            className="w-full p-3.5 rounded-2xl bg-[#141414] border border-white/[0.06] hover:bg-[#1a1a1a] hover:border-white/15 transition-all flex items-center gap-3.5 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/70 flex-shrink-0 group-hover:text-white transition-colors">
              <Star className="w-3.5 h-3.5 stroke-[1.25]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <b className="text-xs font-semibold text-white block truncate">Avaliações no Google</b>
                {profile.googleOn && (
                  <span className="text-[10px] font-medium text-white/50 bg-white/[0.04] border border-white/10 px-2 py-0.5 rounded-full">
                    Ativo no topo
                  </span>
                )}
              </div>
              <span className="text-[11.5px] text-white/45 block truncate mt-0.5">
                {profile.place || 'Studio Marina Ravi'} · {profile.google ? 'Link configurado' : 'Configurar link'}
              </span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 transition-colors" />
          </button>

          {/* 2. Agendamento online (InfinitePay) */}
          <button
            type="button"
            onClick={() => setActiveDataModal('infinitepay')}
            className="w-full p-3.5 rounded-2xl bg-[#141414] border border-white/[0.06] hover:bg-[#1a1a1a] hover:border-white/15 transition-all flex items-center gap-3.5 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/70 flex-shrink-0 group-hover:text-white transition-colors">
              <ShieldCheck className="w-3.5 h-3.5 stroke-[1.25]" />
            </div>
            <div className="flex-1 min-w-0">
              <b className="text-xs font-semibold text-white block truncate">Agendamento online (InfinitePay)</b>
              <span className="text-[11.5px] text-white/45 block truncate mt-0.5 font-mono">
                {profile.apiUrl || 'https://api.seudominio.com'}
              </span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 transition-colors" />
          </button>

          {/* 3. Pagamento Pix */}
          <button
            type="button"
            onClick={() => setActiveDataModal('pix')}
            className="w-full p-3.5 rounded-2xl bg-[#141414] border border-white/[0.06] hover:bg-[#1a1a1a] hover:border-white/15 transition-all flex items-center gap-3.5 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/70 flex-shrink-0 group-hover:text-white transition-colors">
              <Zap className="w-3.5 h-3.5 stroke-[1.25]" />
            </div>
            <div className="flex-1 min-w-0">
              <b className="text-xs font-semibold text-white block truncate">Pagamento Pix</b>
              <span className="text-[11.5px] text-white/45 block truncate mt-0.5">
                {profile.pixKey || 'tonyfilho911@gmail.com'} · {profile.pixName || 'Antonio Jose de Oliveira'} ({profile.pixCity || 'SAO PAULO'})
              </span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 transition-colors" />
          </button>

          {/* 4. Informações de Contato */}
          <button
            type="button"
            onClick={() => setActiveDataModal('contact')}
            className="w-full p-3.5 rounded-2xl bg-[#141414] border border-white/[0.06] hover:bg-[#1a1a1a] hover:border-white/15 transition-all flex items-center gap-3.5 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/70 flex-shrink-0 group-hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 stroke-[1.25]" />
            </div>
            <div className="flex-1 min-w-0">
              <b className="text-xs font-semibold text-white block truncate">Informações de Contato</b>
              <span className="text-[11.5px] text-white/45 block truncate mt-0.5">
                {profile.whats || '(11) 90000-0000'} · {profile.insta || '@marinaravi'} · {profile.email || 'contato@marinaravi.com.br'}
              </span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 transition-colors" />
          </button>
        </div>
      </section>

      {/* Booking Modal Rules shortcut */}
      <section className="px-5 space-y-2.5">
        <h3 className="text-sm font-bold text-white tracking-tight">Agendamento do cliente</h3>
        <button
          onClick={() => setIsBookingRulesOpen(true)}
          className="w-full p-4 rounded-2xl bg-[#161616] border border-white/10 hover:bg-[#1e1e1e] hover:border-white/20 transition-all flex items-center gap-3.5 text-left group"
        >
          <div className="w-10 h-10 rounded-full bg-[#262626] flex items-center justify-center text-white flex-shrink-0">
            <Calendar className="w-4 h-4 text-[#2f7dff]" />
          </div>
          <div className="flex-1 min-w-0">
            <b className="text-sm font-bold text-white block">Configurar regras de agendamento</b>
            <span className="text-xs text-white/50 block truncate">
              Intervalos · Antecedência mínima · Pagamento no local
            </span>
          </div>
          <Pencil className="w-3.5 h-3.5 text-white/30 group-hover:text-white/70 transition-colors" />
        </button>
      </section>

      {/* About Me Section */}
      <section className="px-5 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-tight">Sobre mim</h3>
          <button
            onClick={() => setProfileEditField('about')}
            className="text-xs font-semibold text-white/50 hover:text-white flex items-center gap-1 transition-colors"
          >
            <Pencil className="w-3 h-3" />
            <span>Editar</span>
          </button>
        </div>

        <div
          onClick={() => setProfileEditField('about')}
          className="p-4 rounded-2xl bg-[#161616] border border-white/10 hover:border-white/20 text-xs sm:text-sm text-white/75 leading-relaxed cursor-pointer transition-colors"
        >
          {profile.about || 'Clique para escrever sobre sua trajetória e formação profissional.'}
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="px-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-tight">Banners promocionais</h3>
          <span className="text-xs text-white/40">{banners.length} ativos</span>
        </div>

        <div className="space-y-2.5">
          {banners.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl bg-gradient-to-r from-[#ff5f8a] to-[#8f0d24] text-white relative overflow-hidden shadow-md flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/80 block mb-0.5">
                  {b.emoji ? `${b.emoji} ` : ''}
                  {b.kicker}
                </span>
                <h4 className="text-sm font-bold text-white leading-tight truncate">{b.title}</h4>
                <p className="text-xs text-white/80 mt-0.5 truncate">{b.sub}</p>
              </div>

              <button
                onClick={() => removeBanner(b.id)}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white/80 hover:text-white transition-colors flex-shrink-0"
                aria-label="Remover banner"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          <button
            onClick={() => setIsBannerModalOpen(true)}
            className="w-full py-3.5 rounded-2xl bg-[#161616] border border-dashed border-white/20 hover:border-white/40 text-xs font-bold text-white/60 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar novo banner</span>
          </button>
        </div>
      </section>

      {/* Danger/Reset Zone */}
      <div className="px-5 pt-4">
        <button
          onClick={resetAllData}
          className="w-full py-2.5 rounded-2xl bg-[#121212] border border-white/5 hover:bg-[#1a1a1a] text-xs font-medium text-white/40 hover:text-white/70 flex items-center justify-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Restaurar dados padrão de demonstração</span>
        </button>
      </div>

      {/* Modal de Edição de Dados (Google Reviews, InfinitePay, Pix, Contato) */}
      <DataEditModal type={activeDataModal} onClose={() => setActiveDataModal(null)} />
    </div>
  );
};
