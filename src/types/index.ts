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
}

export interface BookingDetails extends Booking {
  serviceName: string;
  servicePrice: number;
  masterName: string;
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
