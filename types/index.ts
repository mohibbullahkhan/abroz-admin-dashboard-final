export interface User {
  _id: string;
  name?: string;
  email: string;
  role: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  origin: string;
  partNumber: string;
  brandName: string;
  quantity: number;
  categoryId: string | Category;
  condition: 'used' | 'new';
  compatibility: string;
  description: string;
  features: string[];
  shippingInfo: string;
  conditionNotes: string;
  status: 'active' | 'inactive' | 'draft';
  images: string[];
  analytics?: {
    totalClicks: number;
    clicksByDate: { date: string; count: number }[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface AdminSocialLinks {
  facebookPage1?: string;
  facebookPage2?: string;
  messengerId?: string;
  whatsappNumber?: string;
  emailAddress?: string;
  websiteLink?: string;
}

export interface AdminInfo {
  _id: string;
  user: string;
  businessName: string;
  businessDescription: string;
  businessAddress: string;
  shippingInfo: string;
  social: AdminSocialLinks;
  whatsappClicks: number;
  messengerClicks: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStatItem {
  total: number;
  todayCount: number;
  growthPercent: number;
}

export interface ProductClickDay {
  count: number;
  date: string;
}

export interface ActivityItem {
  id: string;
  method: 'create' | 'update' | 'delete';
  description: string;
  createdAt: string;
}

export interface TopViewedProduct {
  id: string;
  name: string;
  category: string;
  images: string[];
  totalClicks: number;
  growthPercent: number;
}

export interface DashboardStats {
  products: DashboardStatItem;
  categories: DashboardStatItem;
  whatsappClicks: DashboardStatItem;
  messengerClicks: DashboardStatItem;
  productClicksLast30Days: ProductClickDay[];
  activitiesLast7Days: ActivityItem[];
  topViewedProducts: TopViewedProduct[];
}

export interface Customer {
  _id: string;
  name: string;
  mobileNumber: string;
  createdAt: string;
  updatedAt: string;
}
