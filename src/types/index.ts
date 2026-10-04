export interface Client {
  id: string;
  name: string;
  vip: boolean;
  phone: string;
  dob?: string;
  since?: string;
  service: string;
  duration: string;
  price: string;
  status: 'Confirmado' | 'Pendente' | 'Concluído' | 'Cancelado';
  time: string;
  notes?: string;
}

export interface Category {
  key: string;
  label: string;
  iconName: string;
  soft: string;
  emoji?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  duration: string;
  price: string;
  cents?: number;
  cat: string;
  type: 'servico' | 'produto';
  desc: string;
  badge?: string | null;
  emoji?: string;
  image?: string;
}

export interface DayScheduleSlot {
  time: string;
  type: 'client' | 'free' | 'blocked';
  id?: string;
  blockedReason?: string;
}

export interface WorkingHours {
  days: string[];
  start: string;
  end: string;
}

export interface PaymentConfig {
  activeMethod: 'sync' | 'infinite' | 'both' | 'none';
  syncApiKey: string;
  syncPixKey: string;
  infiniteClientId: string;
  infiniteApiKey: string;
  webhookUrl: string;
  isProduction: boolean;
}

export interface BookingSettings {
  minAdvanceHours: number;
  bufferMinutes: number;
  freeCancellationHours: number;
  requireWhatsapp: boolean;
  autoWhatsappNotification: boolean;
  firstVisitDiscount: number;
  activeCoupon: string;
  requireDeposit: boolean;
  depositPercent: number;
  allowPayOnSite: boolean;
}

export interface Profile {
  name: string;
  handle: string;
  bio: string;
  about: string;
  coverIndex: number;
  customCoverUrl?: string;
  avatarEmoji: string;
  avatarUrl?: string;
  layout: 'classic' | 'hero' | 'cinema';

  // Storefront specific config
  title: string;
  sub: string;
  place: string;
  google: string;
  googleOn: boolean;
  whats: string;
  insta: string;
  email: string;
  address: string;
  pixKey: string;
  pixName: string;
  pixCity: string;
  apiUrl: string;
  cover: string;
  coverType: 'image' | 'video';
  avatar: string;
}

export interface Banner {
  id: string;
  kicker: string;
  title: string;
  sub: string;
  emoji?: string;
}
