import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Client,
  Category,
  ServiceItem,
  DayScheduleSlot,
  WorkingHours,
  PaymentConfig,
  BookingSettings,
  Profile,
  Banner,
} from '../types';
import {
  INITIAL_CLIENTS,
  INITIAL_CATEGORIES,
  INITIAL_SERVICES,
  INITIAL_DAY_SCHEDULE,
  INITIAL_PROFILE,
  INITIAL_BANNERS,
  INITIAL_WORKING_HOURS,
  INITIAL_PAYMENT_CONFIG,
  INITIAL_BOOKING_SETTINGS,
} from '../data/initialData';

interface AppContextType {
  // Data State
  clients: Client[];
  categories: Category[];
  services: ServiceItem[];
  daySchedule: DayScheduleSlot[];
  profile: Profile;
  banners: Banner[];
  workingHours: WorkingHours;
  paymentConfig: PaymentConfig;
  bookingSettings: BookingSettings;

  // Navigation & View
  activeTab: 'home' | 'services' | 'agenda' | 'profile' | 'dashboard';
  setActiveTab: (tab: 'home' | 'services' | 'agenda' | 'profile' | 'dashboard') => void;
  isStorefrontOpen: boolean;
  setIsStorefrontOpen: (open: boolean) => void;

  // Actions
  addClientBooking: (data: {
    name: string;
    phone: string;
    time: string;
    serviceName: string;
    vip?: boolean;
    dob?: string;
    notes?: string;
  }) => void;
  updateClient: (updated: Client) => void;
  updateClientNotes: (clientId: string, notes: string) => void;
  cancelAppointment: (clientId: string) => void;
  rescheduleAppointment: (clientId: string, dayDisplay: string, newTime: string) => void;
  blockSlot: (time: string) => void;
  unblockSlot: (time: string) => void;
  saveService: (item: ServiceItem) => void;
  deleteService: (id: string) => void;
  saveProfile: (p: Partial<Profile>) => void;
  addBanner: (b: Omit<Banner, 'id'>) => void;
  removeBanner: (id: string) => void;
  saveWorkingHours: (hours: WorkingHours) => void;
  savePaymentConfig: (cfg: PaymentConfig) => void;
  saveBookingSettings: (cfg: BookingSettings) => void;
  resetAllData: () => void;

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Modals state & handlers
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;

  editingService: { item: ServiceItem | null; isNew: boolean } | null;
  setEditingService: (val: { item: ServiceItem | null; isNew: boolean } | null) => void;

  selectedProduct: ServiceItem | null;
  setSelectedProduct: (item: ServiceItem | null) => void;

  isQuickActionOpen: boolean;
  setIsQuickActionOpen: (open: boolean) => void;

  isManualBookingOpen: boolean;
  setIsManualBookingOpen: (open: boolean) => void;

  isHoursConfigOpen: boolean;
  setIsHoursConfigOpen: (open: boolean) => void;

  isPaymentConfigOpen: boolean;
  setIsPaymentConfigOpen: (open: boolean) => void;

  isBookingRulesOpen: boolean;
  setIsBookingRulesOpen: (open: boolean) => void;

  profileEditField: 'cover' | 'avatar' | 'name' | 'about' | null;
  setProfileEditField: (field: 'cover' | 'avatar' | 'name' | 'about' | null) => void;

  isBannerModalOpen: boolean;
  setIsBannerModalOpen: (open: boolean) => void;

  reschedulingClientId: string | null;
  setReschedulingClientId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or fallback to defaults
  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const saved = localStorage.getItem('studiolite_clients_v2');
      return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
    } catch {
      return INITIAL_CLIENTS;
    }
  });

  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);

  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem('studiolite_services');
      return saved ? JSON.parse(saved) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  });

  const [daySchedule, setDaySchedule] = useState<DayScheduleSlot[]>(() => {
    try {
      const saved = localStorage.getItem('studiolite_schedule');
      return saved ? JSON.parse(saved) : INITIAL_DAY_SCHEDULE;
    } catch {
      return INITIAL_DAY_SCHEDULE;
    }
  });

  const [profile, setProfile] = useState<Profile>(() => {
    try {
      const saved = localStorage.getItem('studiolite_profile');
      return saved ? JSON.parse(saved) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  });

  const [banners, setBanners] = useState<Banner[]>(() => {
    try {
      const saved = localStorage.getItem('studiolite_banners');
      return saved ? JSON.parse(saved) : INITIAL_BANNERS;
    } catch {
      return INITIAL_BANNERS;
    }
  });

  const [workingHours, setWorkingHours] = useState<WorkingHours>(() => {
    try {
      const saved = localStorage.getItem('studiolite_hours');
      return saved ? JSON.parse(saved) : INITIAL_WORKING_HOURS;
    } catch {
      return INITIAL_WORKING_HOURS;
    }
  });

  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(() => {
    try {
      const saved = localStorage.getItem('studiolite_payment');
      return saved ? JSON.parse(saved) : INITIAL_PAYMENT_CONFIG;
    } catch {
      return INITIAL_PAYMENT_CONFIG;
    }
  });

  const [bookingSettings, setBookingSettings] = useState<BookingSettings>(() => {
    try {
      const saved = localStorage.getItem('studiolite_booking_settings');
      return saved ? JSON.parse(saved) : INITIAL_BOOKING_SETTINGS;
    } catch {
      return INITIAL_BOOKING_SETTINGS;
    }
  });

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('studiolite_clients_v2', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('studiolite_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('studiolite_schedule', JSON.stringify(daySchedule));
  }, [daySchedule]);

  useEffect(() => {
    localStorage.setItem('studiolite_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('studiolite_banners', JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    localStorage.setItem('studiolite_hours', JSON.stringify(workingHours));
  }, [workingHours]);

  useEffect(() => {
    localStorage.setItem('studiolite_payment', JSON.stringify(paymentConfig));
  }, [paymentConfig]);

  useEffect(() => {
    localStorage.setItem('studiolite_booking_settings', JSON.stringify(bookingSettings));
  }, [bookingSettings]);

  // Navigation
  const [activeTab, setActiveTab] = useState<'home' | 'services' | 'agenda' | 'profile' | 'dashboard'>('home');
  const [isStorefrontOpen, setIsStorefrontOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2400);
  };

  // Modals state
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<{ item: ServiceItem | null; isNew: boolean } | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ServiceItem | null>(null);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isManualBookingOpen, setIsManualBookingOpen] = useState(false);
  const [isHoursConfigOpen, setIsHoursConfigOpen] = useState(false);
  const [isPaymentConfigOpen, setIsPaymentConfigOpen] = useState(false);
  const [isBookingRulesOpen, setIsBookingRulesOpen] = useState(false);
  const [profileEditField, setProfileEditField] = useState<'cover' | 'avatar' | 'name' | 'about' | null>(null);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [reschedulingClientId, setReschedulingClientId] = useState<string | null>(null);

  // Actions
  const addClientBooking = (data: {
    name: string;
    phone: string;
    time: string;
    serviceName: string;
    vip?: boolean;
    dob?: string;
    notes?: string;
  }) => {
    const newId = 'c_' + Date.now().toString(36);
    const targetService = services.find((s) => s.name === data.serviceName);

    const newClient: Client = {
      id: newId,
      name: data.name,
      phone: data.phone,
      vip: !!data.vip,
      dob: data.dob || '—',
      since: 'Hoje',
      service: data.serviceName,
      duration: targetService?.duration || '45 min',
      price: targetService?.price || 'R$ 120',
      status: 'Confirmado',
      time: `Hoje, ${data.time}`,
      notes: data.notes || '',
    };

    setClients((prev) => [newClient, ...prev]);

    // Update schedule
    setDaySchedule((prev) => {
      const existing = prev.find((s) => s.time === data.time);
      if (existing) {
        return prev.map((s) => (s.time === data.time ? { ...s, type: 'client' as const, id: newId } : s));
      }
      return [...prev, { time: data.time, type: 'client' as const, id: newId }].sort((a, b) =>
        a.time.localeCompare(b.time)
      );
    });

    showToast(`Agendamento de ${data.name} confirmado às ${data.time}`);
  };

  const updateClient = (updated: Client) => {
    setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    showToast('Dados do agendamento atualizados');
  };

  const updateClientNotes = (clientId: string, notes: string) => {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, notes } : c))
    );
    showToast('Observações salvas');
  };

  const cancelAppointment = (clientId: string) => {
    setDaySchedule((prev) =>
      prev.map((s) => (s.id === clientId ? { time: s.time, type: 'free' } : s))
    );
    setClients((prev) => prev.filter((c) => c.id !== clientId));
    setSelectedClientId(null);
    showToast('Agendamento cancelado com sucesso');
  };

  const rescheduleAppointment = (clientId: string, dayDisplay: string, newTime: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;

    const isToday = dayDisplay.toLowerCase().includes('hoje') || dayDisplay.toLowerCase().includes('sex');

    setDaySchedule((prev) => {
      const cleared = prev.map((s) => (s.id === clientId ? { time: s.time, type: 'free' as const } : s));
      if (isToday) {
        const slotIdx = cleared.findIndex((s) => s.time === newTime);
        if (slotIdx > -1) {
          cleared[slotIdx] = { time: newTime, type: 'client' as const, id: clientId };
          return cleared;
        }
        return [...cleared, { time: newTime, type: 'client' as const, id: clientId }].sort((a, b) =>
          a.time.localeCompare(b.time)
        );
      }
      return cleared;
    });

    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? {
              ...c,
              time: `${dayDisplay}, ${newTime}`,
            }
          : c
      )
    );

    setReschedulingClientId(null);
    showToast(`Reagendado para ${dayDisplay} às ${newTime}`);
  };

  const blockSlot = (time: string) => {
    setDaySchedule((prev) =>
      prev.map((s) => (s.time === time ? { ...s, type: 'blocked', blockedReason: 'Indisponível' } : s))
    );
    showToast(`Horário ${time} bloqueado`);
  };

  const unblockSlot = (time: string) => {
    setDaySchedule((prev) =>
      prev.map((s) => (s.time === time ? { time: s.time, type: 'free' } : s))
    );
    showToast(`Horário ${time} liberado para agendamento`);
  };

  const saveService = (item: ServiceItem) => {
    setServices((prev) => {
      const exists = prev.some((s) => s.id === item.id);
      if (exists) {
        return prev.map((s) => (s.id === item.id ? item : s));
      }
      return [item, ...prev];
    });
    setEditingService(null);
    showToast(
      item.type === 'produto'
        ? 'Produto salvo no catálogo'
        : 'Serviço salvo e vinculado à agenda'
    );
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    setEditingService(null);
    setSelectedProduct(null);
    showToast('Item removido do catálogo');
  };

  const saveProfile = (p: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...p }));
    setProfileEditField(null);
    showToast('Formato e perfil salvos');
  };

  const addBanner = (b: Omit<Banner, 'id'>) => {
    const newBanner: Banner = {
      ...b,
      id: 'b_' + Date.now().toString(36),
    };
    setBanners((prev) => [newBanner, ...prev]);
    setIsBannerModalOpen(false);
    showToast('Banner promocional adicionado');
  };

  const removeBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    showToast('Banner removido');
  };

  const saveWorkingHours = (hours: WorkingHours) => {
    setWorkingHours(hours);
    setIsHoursConfigOpen(false);
    showToast('Horário de funcionamento salvo');
  };

  const savePaymentConfig = (cfg: PaymentConfig) => {
    setPaymentConfig(cfg);
    setIsPaymentConfigOpen(false);
    showToast('Configuração de pagamentos atualizada');
  };

  const saveBookingSettings = (cfg: BookingSettings) => {
    setBookingSettings(cfg);
    setIsBookingRulesOpen(false);
    showToast('Regras de agendamento salvas');
  };

  const resetAllData = () => {
    setClients(INITIAL_CLIENTS);
    setServices(INITIAL_SERVICES);
    setDaySchedule(INITIAL_DAY_SCHEDULE);
    setProfile(INITIAL_PROFILE);
    setBanners(INITIAL_BANNERS);
    setWorkingHours(INITIAL_WORKING_HOURS);
    setPaymentConfig(INITIAL_PAYMENT_CONFIG);
    setBookingSettings(INITIAL_BOOKING_SETTINGS);
    showToast('Dados restaurados para o padrão de demonstração');
  };

  return (
    <AppContext.Provider
      value={{
        clients,
        categories,
        services,
        daySchedule,
        profile,
        banners,
        workingHours,
        paymentConfig,
        bookingSettings,
        activeTab,
        setActiveTab,
        isStorefrontOpen,
        setIsStorefrontOpen,
        addClientBooking,
        updateClient,
        updateClientNotes,
        cancelAppointment,
        rescheduleAppointment,
        blockSlot,
        unblockSlot,
        saveService,
        deleteService,
        saveProfile,
        addBanner,
        removeBanner,
        saveWorkingHours,
        savePaymentConfig,
        saveBookingSettings,
        resetAllData,
        toastMessage,
        showToast,
        selectedClientId,
        setSelectedClientId,
        editingService,
        setEditingService,
        selectedProduct,
        setSelectedProduct,
        isQuickActionOpen,
        setIsQuickActionOpen,
        isManualBookingOpen,
        setIsManualBookingOpen,
        isHoursConfigOpen,
        setIsHoursConfigOpen,
        isPaymentConfigOpen,
        setIsPaymentConfigOpen,
        isBookingRulesOpen,
        setIsBookingRulesOpen,
        profileEditField,
        setProfileEditField,
        isBannerModalOpen,
        setIsBannerModalOpen,
        reschedulingClientId,
        setReschedulingClientId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
