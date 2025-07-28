// Common types
export interface Address {
  street: string;
  city: string;
  district: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface Contact {
  phone: string;
  email?: string;
  whatsapp?: string;
}

// Farmer Management
export interface Farmer {
  id: string;
  name: string;
  farmerId: string;
  address: Address;
  contact: Contact;
  farmSize: number; // in acres
  farmType: 'organic' | 'conventional' | 'mixed';
  joinDate: string;
  status: 'active' | 'inactive' | 'suspended';
  crops: string[]; // crop IDs
  totalHarvest: number;
  revenue: number;
  notes?: string;
  avatar?: string;
}

// Crop Management
export interface Crop {
  id: string;
  name: string;
  variety: string;
  category: 'grain' | 'vegetable' | 'fruit' | 'spice' | 'beverage' | 'other';
  growingPeriod: number; // in days
  plantingSeason: string[];
  harvestSeason: string[];
  waterRequirement: 'low' | 'medium' | 'high';
  soilType: string[];
  optimalTemperature: {
    min: number;
    max: number;
  };
  description?: string;
  image?: string;
}

export interface CropPlan {
  id: string;
  farmerId: string;
  cropId: string;
  fieldName: string;
  area: number; // in acres
  plantingDate: string;
  expectedHarvestDate: string;
  status: 'planned' | 'planted' | 'growing' | 'harvested' | 'failed';
  notes?: string;
  estimatedYield: number;
  actualYield?: number;
  costs: {
    seeds: number;
    fertilizer: number;
    labor: number;
    irrigation: number;
    pesticides: number;
    other: number;
  };
}

// Inventory Management
export interface InventoryItem {
  id: string;
  name: string;
  category: 'seeds' | 'fertilizer' | 'pesticide' | 'equipment' | 'tools' | 'other';
  brand?: string;
  unit: string;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  pricePerUnit: number;
  supplier: string;
  lastRestocked: string;
  expiryDate?: string;
  location: string;
  description?: string;
  image?: string;
}

export interface StockTransaction {
  id: string;
  itemId: string;
  type: 'in' | 'out';
  quantity: number;
  reason: string;
  date: string;
  userId: string;
  notes?: string;
  cost?: number;
}

// Harvest Management
export interface HarvestRecord {
  id: string;
  farmerId: string;
  cropPlanId: string;
  cropName: string;
  harvestDate: string;
  quantity: number;
  unit: string;
  quality: 'excellent' | 'good' | 'average' | 'poor';
  moistureContent?: number;
  grade?: string;
  pricePerUnit: number;
  totalValue: number;
  storageLocation: string;
  status: 'harvested' | 'stored' | 'sold' | 'processed';
  notes?: string;
}

// Sales & Finance
export interface Sale {
  id: string;
  invoiceNumber: string;
  date: string;
  customerId: string;
  customerName: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentStatus: 'pending' | 'partial' | 'paid' | 'overdue';
  paymentMethod: 'cash' | 'bank_transfer' | 'cheque' | 'mobile_payment';
  dueDate?: string;
  notes?: string;
}

export interface SaleItem {
  harvestId: string;
  cropName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  total: number;
}

export interface Customer {
  id: string;
  name: string;
  type: 'individual' | 'company' | 'wholesaler' | 'retailer';
  contact: Contact;
  address: Address;
  creditLimit: number;
  outstandingBalance: number;
  paymentTerms: number; // in days
  status: 'active' | 'inactive';
}

export interface Payment {
  id: string;
  saleId: string;
  amount: number;
  date: string;
  method: 'cash' | 'bank_transfer' | 'cheque' | 'mobile_payment';
  reference?: string;
  notes?: string;
}

// Marketplace
export interface MarketListing {
  id: string;
  farmerId: string;
  harvestId: string;
  cropName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  minOrderQuantity: number;
  quality: 'excellent' | 'good' | 'average';
  harvestDate: string;
  availableFrom: string;
  description: string;
  images: string[];
  location: string;
  status: 'active' | 'sold' | 'expired' | 'withdrawn';
  createdAt: string;
  views: number;
  inquiries: number;
}

export interface MarketInquiry {
  id: string;
  listingId: string;
  buyerName: string;
  buyerContact: Contact;
  quantity: number;
  proposedPrice?: number;
  message: string;
  status: 'pending' | 'responded' | 'accepted' | 'rejected';
  createdAt: string;
}

// Sensor & IoT
export interface Sensor {
  id: string;
  name: string;
  type: 'temperature' | 'humidity' | 'soil_moisture' | 'ph' | 'light' | 'rainfall';
  location: string;
  farmerId: string;
  fieldName: string;
  status: 'active' | 'inactive' | 'maintenance';
  batteryLevel?: number;
  lastReading: string;
  installedDate: string;
}

export interface SensorReading {
  id: string;
  sensorId: string;
  value: number;
  unit: string;
  timestamp: string;
  quality: 'good' | 'questionable' | 'poor';
}

export interface WeatherData {
  date: string;
  temperature: {
    min: number;
    max: number;
    avg: number;
  };
  humidity: number;
  rainfall: number;
  windSpeed: number;
  windDirection: string;
  pressure: number;
  uvIndex: number;
}

// Analytics
export interface ProductionMetrics {
  period: string;
  totalProduction: number;
  totalRevenue: number;
  averageYield: number;
  topCrops: {
    cropName: string;
    production: number;
    revenue: number;
  }[];
  efficiency: number;
}

export interface MarketTrend {
  cropName: string;
  currentPrice: number;
  priceChange: number;
  demand: 'high' | 'medium' | 'low';
  supply: 'high' | 'medium' | 'low';
  prediction: 'increasing' | 'stable' | 'decreasing';
  seasonality: number[];
}

// User & System
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'operator' | 'farmer';
  permissions: string[];
  avatar?: string;
  lastLogin: string;
  status: 'active' | 'inactive';
}

export interface Alert {
  id: string;
  type: 'weather' | 'inventory' | 'pest' | 'system' | 'financial';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  createdAt: string;
  readAt?: string;
  dismissedAt?: string;
  actionRequired: boolean;
  actionUrl?: string;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form types for validation
export interface FormErrors {
  [key: string]: string | undefined;
}

export interface SelectOption {
  value: string;
  label: string;
}
