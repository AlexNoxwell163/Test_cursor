export type ServiceCategory = "cut" | "color" | "styling" | "beard" | "care";

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: ServiceCategory;
}

export interface Master {
  id: string;
  name: string;
  role: string;
  experienceYears: number;
  photo: string;
  bio: string;
  specialties: ServiceCategory[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  service: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  masterId: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  comment?: string;
  createdAt: string;
  /** Если запись с аккаунта — для лояльности и быстрой записи */
  userId?: string;
  /** Снимок цены услуги на момент записи */
  servicePriceRub?: number;
  depositRub?: number;
  depositPaid?: boolean;
  giftCertificateCode?: string;
  giftCertificateAppliedRub?: number;
  loyaltyDiscountPercent?: number;
  /** Цена услуги после скидок (без депозита как предоплаты) */
  finalServicePriceRub?: number;
}

export interface BookingDetails extends Booking {
  serviceName: string;
  servicePrice: number;
  masterName: string;
}

export interface GiftCertificate {
  id: string;
  code: string;
  balanceInitial: number;
  balanceRemaining: number;
  createdAt: string;
}

export interface LoyaltyTier {
  id: string;
  name: string;
  minPoints: number;
  discountPercent: number;
}

export interface LoyaltyProfile {
  userId: string;
  points: number;
  visits: number;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface AuthUserRecord extends AuthUser {
  password: string;
  createdAt: string;
}
