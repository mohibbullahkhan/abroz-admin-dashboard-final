import { CATEGORIES } from '../constants';

export interface Product {
  id: string;
  name: string;
  brand: string;
  sku: string;
  category: string;
  status: 'Active' | 'Draft';
  featured: boolean;
  clicks: number;
  whatsappClicks: number;
  messengerClicks: number;
  price?: number;
  discountPrice?: number;
  image: string;
  description: string;
  machineCompatibility: string[];
  tags: string[];
  qty: number;
  updatedAt: string;
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Jonah Lane',
    sku: '435',
    category: 'sdfjk',
    status: 'draft' as any,
    brand: 'DUSTIN BURGESS',
    qty: 94,
    featured: false,
    clicks: 0,
    whatsappClicks: 0,
    messengerClicks: 0,
    image: '',
    description: '',
    machineCompatibility: [],
    tags: [],
    updatedAt: '2026-07-02T00:00:00Z',
  },
  {
    id: '2',
    name: 'Kareem Dickson',
    sku: '212',
    category: 'sdf',
    status: 'active' as any,
    brand: 'BRENNAN BLACK',
    qty: 98,
    featured: false,
    clicks: 0,
    whatsappClicks: 0,
    messengerClicks: 0,
    image: 'https://picsum.photos/400/300?random=2',
    description: '',
    machineCompatibility: [],
    tags: [],
    updatedAt: '2026-07-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'Brock Arnold',
    sku: '872',
    category: 'Placeat voluptas ex',
    status: 'active' as any,
    brand: 'SYDNEE GOFF',
    qty: 85,
    featured: false,
    clicks: 0,
    whatsappClicks: 0,
    messengerClicks: 0,
    image: '',
    description: '',
    machineCompatibility: [],
    tags: [],
    updatedAt: '2026-07-02T00:00:00Z',
  },
  {
    id: '4',
    name: 'Joelle Fitzgerald',
    sku: '271',
    category: 'Sint rerum voluptates',
    status: 'active' as any,
    brand: 'ISAAC BLACKWELL',
    qty: 630,
    featured: false,
    clicks: 0,
    whatsappClicks: 0,
    messengerClicks: 0,
    image: '',
    description: '',
    machineCompatibility: [],
    tags: [],
    updatedAt: '2026-07-02T00:00:00Z',
  },
  {
    id: '5',
    name: 'Rashad Butler',
    sku: '647',
    category: 'Control Valve Main Pump',
    status: 'draft' as any,
    brand: 'NYSSA WILLIS',
    qty: 32,
    featured: false,
    clicks: 0,
    whatsappClicks: 0,
    messengerClicks: 0,
    image: 'https://picsum.photos/400/300?random=5',
    description: '',
    machineCompatibility: [],
    tags: [],
    updatedAt: '2026-07-02T00:00:00Z',
  },
  {
    id: '6',
    name: 'Harper Peck',
    sku: '701',
    category: 'Control Valve',
    status: 'active' as any,
    brand: 'QUYN JIMENEZ',
    qty: 75,
    featured: false,
    clicks: 0,
    whatsappClicks: 0,
    messengerClicks: 0,
    image: 'https://picsum.photos/400/300?random=6',
    description: '',
    machineCompatibility: [],
    tags: [],
    updatedAt: '2026-07-02T00:00:00Z',
  },
  {
    id: '7',
    name: 'Frances Fox',
    sku: '184',
    category: 'Car',
    status: 'draft' as any,
    brand: 'CIARAN RANDALL',
    qty: 79,
    featured: false,
    clicks: 0,
    whatsappClicks: 0,
    messengerClicks: 0,
    image: 'https://picsum.photos/400/300?random=7',
    description: '',
    machineCompatibility: [],
    tags: [],
    updatedAt: '2026-07-02T00:00:00Z',
  },
  {
    id: '8',
    name: 'Roy Luettgen',
    sku: '912',
    category: 'Placeat voluptas ex',
    status: 'draft' as any,
    brand: 'DEPRAEDOR FACERE ADDO',
    qty: 36,
    featured: false,
    clicks: 0,
    whatsappClicks: 0,
    messengerClicks: 0,
    image: '',
    description: '',
    machineCompatibility: [],
    tags: [],
    updatedAt: '2026-07-02T00:00:00Z',
  },
  {
    id: '9',
    name: 'Bradley Schultz',
    sku: '951',
    category: 'Control Valve Main Pump',
    status: 'active' as any,
    brand: 'SHAD CHRISTIAN',
    qty: 42,
    featured: false,
    clicks: 0,
    whatsappClicks: 0,
    messengerClicks: 0,
    image: 'https://picsum.photos/400/300?random=9',
    description: '',
    machineCompatibility: [],
    tags: [],
    updatedAt: '2026-07-02T00:00:00Z',
  },
  {
    id: '10',
    name: 'FMs',
    sku: 'KOM-SA6D102-001',
    category: 'In doloribus',
    status: 'active' as any,
    brand: 'EASY',
    qty: 30,
    featured: false,
    clicks: 0,
    whatsappClicks: 0,
    messengerClicks: 0,
    image: '',
    description: '',
    machineCompatibility: [],
    tags: [],
    updatedAt: '2026-07-02T00:00:00Z',
  }
];

export const mockCategories = [
  { id: '1', name: 'rrdt', description: 'ee', icon: 'Box', productCount: 0, views: 0 },
  { id: '2', name: 'Veniam eaque aute q', description: 'Voluptatem Sed aut', icon: 'Box', productCount: 0, views: 0 },
  { id: '3', name: 'sdfjk', description: 'dsf', icon: 'Box', productCount: 0, views: 0 },
  { id: '4', name: 'sdf', description: 'df', icon: 'Box', productCount: 0, views: 0 },
  { id: '5', name: 'Aut quo quo laborum', description: 'lure omnis neque qua', icon: 'Box', productCount: 0, views: 0 },
  { id: '6', name: 'Quae qui sed dolor q', description: 'Eu Nam aut quis volu', icon: 'Box', productCount: 0, views: 0 },
  { id: '7', name: 'Sint rerum voluptates', description: 'Dolores tenetur mini', icon: 'Box', productCount: 0, views: 0 },
  { id: '8', name: 'Aut molestiae', description: 'Rerum occaecat corpo', icon: 'Box', productCount: 0, views: 0 },
  { id: '9', name: 'Placeat voluptas ex', description: 'Cupiditate inventore', icon: 'Box', productCount: 0, views: 0 },
  { id: '10', name: 'Car', description: 'parts', icon: 'Box', productCount: 0, views: 0 },
  { id: '11', name: 'In doloribus', description: 'Ipsum magnam dolore', icon: 'Box', productCount: 0, views: 0 },
  { id: '12', name: 'Control Valve', description: 'No description available for this category.', icon: 'Box', productCount: 0, views: 0 },
  { id: '13', name: 'Quisquam', description: 'Nihil ea esse elit', icon: 'Box', productCount: 0, views: 0 },
];

export const mockAnalytics = {
  dailyTraffic: [
    { date: '2026-06-02', clicks: 14 },
    { date: '2026-06-03', clicks: 1 },
    { date: '2026-06-04', clicks: 4 },
    { date: '2026-06-07', clicks: 16 },
    { date: '2026-06-08', clicks: 1 },
    { date: '2026-06-13', clicks: 1 },
  ],
  inquiriesByChannel: [
    { name: 'Messenger', value: 10 },
    { name: 'WhatsApp', value: 90 },
  ],
  topCategories: CATEGORIES.slice(0, 5).map(cat => ({
    name: cat,
    views: Math.floor(Math.random() * 3000) + 1000,
  })),
  notificationPerformance: Array.from({ length: 6 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
    sent: Math.floor(Math.random() * 100) + 50,
    opened: Math.floor(Math.random() * 40) + 20,
  })),
};

export const mockRecentActivity = [
  { id: '1', action: 'Created category: rrdt', description: 'Created category: rrdt', admin: 'Create', timestamp: '2026-07-01T10:00:00Z', type: 'product_added' },
  { id: '2', action: 'Created customer: Fahad', description: 'Created customer: Fahad', admin: 'Create', timestamp: '2026-07-01T10:05:00Z', type: 'product_added' },
  { id: '3', action: 'Deleted customer: Syed Mohiuddin Meshal', description: 'Deleted customer: Syed Mohiuddin Meshal', admin: 'Delete', timestamp: '2026-07-01T11:00:00Z', type: 'product_deleted' },
  { id: '4', action: 'Deleted customer: Syed Mohiuddin Meshal', description: 'Deleted customer: Syed Mohiuddin Meshal', admin: 'Delete', timestamp: '2026-07-01T12:00:00Z', type: 'product_deleted' },
  { id: '5', action: 'Deleted customer: Fahad', description: 'Deleted customer: Fahad', admin: 'Delete', timestamp: '2026-07-01T13:00:00Z', type: 'product_deleted' },
  { id: '6', action: 'Created customer: Fahad', description: 'Created customer: Fahad', admin: 'Create', timestamp: '2026-07-01T14:00:00Z', type: 'product_added' },
];

export const mockNotifications = [
  { id: '1', title: '🆕 New Hydraulic Parts Available', message: 'Check out our new stock of hydraulic pumps and valves.', status: 'Sent', date: '2026-05-15T10:00:00Z' },
  { id: '2', title: '⚙️ Komatsu Undercarriage Parts Now In Stock', message: 'Full range of track chains and rollers for PC200.', status: 'Sent', date: '2026-05-14T14:00:00Z' },
  { id: '3', title: '📢 Check Our Latest Featured Products', message: 'Browse through our top-rated machinery parts.', status: 'Sent', date: '2026-05-13T11:00:00Z' },
  { id: '4', title: '🎉 New Dozer Parts Have Arrived', message: 'D85 and D155 blades and segments available.', status: 'Sent', date: '2026-05-12T09:00:00Z' },
  { id: '5', title: '🛠 Maintenance Tips for Your Excavator', message: 'Learn how to extend the life of your machinery.', status: 'Scheduled', date: '2026-05-20T08:00:00Z' },
];
