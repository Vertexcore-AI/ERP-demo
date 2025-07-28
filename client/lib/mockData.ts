import {
  Farmer,
  Crop,
  CropPlan,
  InventoryItem,
  HarvestRecord,
  Sale,
  Customer,
  MarketListing,
  Sensor,
  SensorReading,
  WeatherData,
  Alert,
  StockTransaction,
} from '@/types';

// Mock Farmers Data
export const mockFarmers: Farmer[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    farmerId: 'CBF001',
    address: {
      street: '123 Tea Estate Road',
      city: 'Kandy',
      district: 'Kandy',
      province: 'Central',
      postalCode: '20000',
      country: 'Sri Lanka',
    },
    contact: {
      phone: '+94 77 123 4567',
      email: 'priya.sharma@email.com',
      whatsapp: '+94 77 123 4567',
    },
    farmSize: 25.5,
    farmType: 'organic',
    joinDate: '2022-03-15',
    status: 'active',
    crops: ['1', '2', '3'],
    totalHarvest: 1250,
    revenue: 89500,
    notes: 'Excellent organic tea producer with sustainable practices.',
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    farmerId: 'CBF002',
    address: {
      street: '456 Rice Field Lane',
      city: 'Polonnaruwa',
      district: 'Polonnaruwa',
      province: 'North Central',
      postalCode: '51000',
      country: 'Sri Lanka',
    },
    contact: {
      phone: '+94 71 234 5678',
      email: 'rajesh.kumar@email.com',
    },
    farmSize: 18.2,
    farmType: 'conventional',
    joinDate: '2021-08-22',
    status: 'active',
    crops: ['4', '5'],
    totalHarvest: 2100,
    revenue: 125000,
  },
  {
    id: '3',
    name: 'Lakshmi Perera',
    farmerId: 'CBF003',
    address: {
      street: '789 Coconut Grove',
      city: 'Galle',
      district: 'Galle',
      province: 'Southern',
      postalCode: '80000',
      country: 'Sri Lanka',
    },
    contact: {
      phone: '+94 76 345 6789',
      email: 'lakshmi.perera@email.com',
      whatsapp: '+94 76 345 6789',
    },
    farmSize: 12.8,
    farmType: 'mixed',
    joinDate: '2023-01-10',
    status: 'active',
    crops: ['6', '7'],
    totalHarvest: 850,
    revenue: 67500,
  },
];

// Mock Crops Data
export const mockCrops: Crop[] = [
  {
    id: '1',
    name: 'Tea',
    variety: 'Ceylon Black Tea',
    category: 'beverage',
    growingPeriod: 1095, // 3 years
    plantingSeason: ['April', 'May', 'October', 'November'],
    harvestSeason: ['All Year'],
    waterRequirement: 'high',
    soilType: ['acidic', 'well-drained'],
    optimalTemperature: { min: 15, max: 25 },
    description: 'Premium Ceylon black tea with excellent quality and flavor.',
  },
  {
    id: '2',
    name: 'Cinnamon',
    variety: 'Ceylon Cinnamon',
    category: 'spice',
    growingPeriod: 730, // 2 years
    plantingSeason: ['May', 'June'],
    harvestSeason: ['October', 'November', 'March', 'April'],
    waterRequirement: 'medium',
    soilType: ['sandy loam', 'laterite'],
    optimalTemperature: { min: 20, max: 30 },
    description: 'True Ceylon cinnamon with delicate flavor and aroma.',
  },
  {
    id: '3',
    name: 'Cardamom',
    variety: 'Large Cardamom',
    category: 'spice',
    growingPeriod: 1095, // 3 years
    plantingSeason: ['June', 'July'],
    harvestSeason: ['September', 'October', 'November'],
    waterRequirement: 'high',
    soilType: ['loamy', 'well-drained'],
    optimalTemperature: { min: 10, max: 25 },
    description: 'High-quality large cardamom with strong aroma.',
  },
  {
    id: '4',
    name: 'Rice',
    variety: 'Basmati',
    category: 'grain',
    growingPeriod: 120,
    plantingSeason: ['April', 'May', 'October', 'November'],
    harvestSeason: ['August', 'September', 'February', 'March'],
    waterRequirement: 'high',
    soilType: ['clay', 'loamy'],
    optimalTemperature: { min: 20, max: 35 },
    description: 'Premium basmati rice with excellent cooking quality.',
  },
  {
    id: '5',
    name: 'Coconut',
    variety: 'King Coconut',
    category: 'fruit',
    growingPeriod: 2190, // 6 years
    plantingSeason: ['All Year'],
    harvestSeason: ['All Year'],
    waterRequirement: 'medium',
    soilType: ['sandy', 'coastal'],
    optimalTemperature: { min: 22, max: 32 },
    description: 'Premium king coconut variety native to Sri Lanka.',
  },
];

// Mock Inventory Items
export const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Organic Fertilizer NPK 10-10-10',
    category: 'fertilizer',
    brand: 'EcoGrow',
    unit: 'kg',
    currentStock: 2500,
    minStockLevel: 500,
    maxStockLevel: 5000,
    pricePerUnit: 85,
    supplier: 'Green Earth Suppliers',
    lastRestocked: '2024-01-15',
    expiryDate: '2025-01-15',
    location: 'Warehouse A - Section 2',
    description: 'High-quality organic NPK fertilizer for sustainable farming',
  },
  {
    id: '2',
    name: 'Tea Seeds - Ceylon Black',
    category: 'seeds',
    brand: 'Ceylon Seeds Co.',
    unit: 'packet',
    currentStock: 150,
    minStockLevel: 50,
    maxStockLevel: 300,
    pricePerUnit: 1250,
    supplier: 'Ceylon Agricultural Institute',
    lastRestocked: '2024-01-10',
    location: 'Cold Storage Room',
    description: 'Premium tea seeds for Ceylon black tea cultivation',
  },
  {
    id: '3',
    name: 'Pesticide - BioSpray Natural',
    category: 'pesticide',
    brand: 'BioCare',
    unit: 'liter',
    currentStock: 45,
    minStockLevel: 20,
    maxStockLevel: 100,
    pricePerUnit: 2500,
    supplier: 'Bio Solutions Ltd',
    lastRestocked: '2024-01-08',
    expiryDate: '2024-12-31',
    location: 'Chemical Storage - Secured Area',
    description: 'Natural bio-pesticide safe for organic farming',
  },
];

// Mock Harvest Records
export const mockHarvestRecords: HarvestRecord[] = [
  {
    id: '1',
    farmerId: '1',
    cropPlanId: 'cp1',
    cropName: 'Tea',
    harvestDate: '2024-01-15',
    quantity: 125.5,
    unit: 'kg',
    quality: 'excellent',
    moistureContent: 12.5,
    grade: 'A+',
    pricePerUnit: 350,
    totalValue: 43925,
    storageLocation: 'Tea Processing Center - Lot A',
    status: 'stored',
    notes: 'High-quality harvest with excellent flavor profile',
  },
  {
    id: '2',
    farmerId: '2',
    cropPlanId: 'cp2',
    cropName: 'Rice',
    harvestDate: '2024-01-12',
    quantity: 850,
    unit: 'kg',
    quality: 'good',
    moistureContent: 14,
    grade: 'A',
    pricePerUnit: 125,
    totalValue: 106250,
    storageLocation: 'Grain Storage - Silo 2',
    status: 'sold',
  },
];

// Mock Sales
export const mockSales: Sale[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    date: '2024-01-16',
    customerId: 'c1',
    customerName: 'Premium Tea Exporters Ltd',
    items: [
      {
        harvestId: '1',
        cropName: 'Tea',
        quantity: 100,
        unit: 'kg',
        pricePerUnit: 350,
        total: 35000,
      },
    ],
    subtotal: 35000,
    tax: 3500,
    discount: 0,
    total: 38500,
    paymentStatus: 'paid',
    paymentMethod: 'bank_transfer',
    notes: 'Export quality tea shipment',
  },
];

// Mock Customers
export const mockCustomers: Customer[] = [
  {
    id: 'c1',
    name: 'Premium Tea Exporters Ltd',
    type: 'company',
    contact: {
      phone: '+94 11 234 5678',
      email: 'orders@premiumtea.lk',
    },
    address: {
      street: '123 Export Plaza',
      city: 'Colombo',
      district: 'Colombo',
      province: 'Western',
      postalCode: '00100',
      country: 'Sri Lanka',
    },
    creditLimit: 500000,
    outstandingBalance: 0,
    paymentTerms: 30,
    status: 'active',
  },
];

// Mock Market Listings
export const mockMarketListings: MarketListing[] = [
  {
    id: '1',
    farmerId: '1',
    harvestId: '1',
    cropName: 'Premium Ceylon Tea',
    quantity: 25.5,
    unit: 'kg',
    pricePerUnit: 350,
    minOrderQuantity: 5,
    quality: 'excellent',
    harvestDate: '2024-01-15',
    availableFrom: '2024-01-20',
    description: 'Premium Ceylon black tea with exceptional flavor and aroma. Organically grown in the hills of Kandy.',
    images: [],
    location: 'Kandy, Central Province',
    status: 'active',
    createdAt: '2024-01-16',
    views: 25,
    inquiries: 3,
  },
];

// Mock Sensors
export const mockSensors: Sensor[] = [
  {
    id: '1',
    name: 'Tea Field Temperature Sensor',
    type: 'temperature',
    location: 'Tea Estate Block A',
    farmerId: '1',
    fieldName: 'Upper Field',
    status: 'active',
    batteryLevel: 85,
    lastReading: '2024-01-16T10:30:00Z',
    installedDate: '2023-06-15',
  },
  {
    id: '2',
    name: 'Soil Moisture Monitor',
    type: 'soil_moisture',
    location: 'Rice Field Section 2',
    farmerId: '2',
    fieldName: 'Main Field',
    status: 'active',
    batteryLevel: 92,
    lastReading: '2024-01-16T10:25:00Z',
    installedDate: '2023-08-20',
  },
];

// Mock Alerts
export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'weather',
    severity: 'medium',
    title: 'Heavy Rainfall Warning',
    message: 'Heavy rainfall expected in next 48 hours. Secure harvested crops and check drainage systems.',
    createdAt: '2024-01-16T08:00:00Z',
    actionRequired: true,
    actionUrl: '/weather-alerts',
  },
  {
    id: '2',
    type: 'inventory',
    severity: 'high',
    title: 'Low Fertilizer Stock',
    message: 'Organic fertilizer stock is below minimum threshold (23% remaining). Reorder required.',
    createdAt: '2024-01-16T06:30:00Z',
    actionRequired: true,
    actionUrl: '/inventory',
  },
];

// Helper functions to simulate API calls
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockDataStore {
  private static instance: MockDataStore;
  
  private farmers: Farmer[] = [...mockFarmers];
  private crops: Crop[] = [...mockCrops];
  private inventory: InventoryItem[] = [...mockInventoryItems];
  private harvests: HarvestRecord[] = [...mockHarvestRecords];
  private sales: Sale[] = [...mockSales];
  private customers: Customer[] = [...mockCustomers];
  private listings: MarketListing[] = [...mockMarketListings];
  private sensors: Sensor[] = [...mockSensors];
  private alerts: Alert[] = [...mockAlerts];

  public static getInstance(): MockDataStore {
    if (!MockDataStore.instance) {
      MockDataStore.instance = new MockDataStore();
    }
    return MockDataStore.instance;
  }

  // Farmers
  async getFarmers(): Promise<Farmer[]> {
    await delay(500);
    return [...this.farmers];
  }

  async getFarmer(id: string): Promise<Farmer | undefined> {
    await delay(300);
    return this.farmers.find(f => f.id === id);
  }

  async createFarmer(farmer: Omit<Farmer, 'id'>): Promise<Farmer> {
    await delay(800);
    const newFarmer = {
      ...farmer,
      id: Date.now().toString(),
    };
    this.farmers.push(newFarmer);
    return newFarmer;
  }

  async updateFarmer(id: string, updates: Partial<Farmer>): Promise<Farmer> {
    await delay(600);
    const index = this.farmers.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Farmer not found');
    
    this.farmers[index] = { ...this.farmers[index], ...updates };
    return this.farmers[index];
  }

  async deleteFarmer(id: string): Promise<void> {
    await delay(400);
    const index = this.farmers.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Farmer not found');
    
    this.farmers.splice(index, 1);
  }

  // Crops
  async getCrops(): Promise<Crop[]> {
    await delay(400);
    return [...this.crops];
  }

  // Inventory
  async getInventoryItems(): Promise<InventoryItem[]> {
    await delay(500);
    return [...this.inventory];
  }

  async updateInventoryItem(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem> {
    await delay(600);
    const index = this.inventory.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Item not found');
    
    this.inventory[index] = { ...this.inventory[index], ...updates };
    return this.inventory[index];
  }

  // Harvests
  async getHarvests(): Promise<HarvestRecord[]> {
    await delay(500);
    return [...this.harvests];
  }

  async createHarvest(harvest: Omit<HarvestRecord, 'id'>): Promise<HarvestRecord> {
    await delay(800);
    const newHarvest = {
      ...harvest,
      id: Date.now().toString(),
    };
    this.harvests.push(newHarvest);
    return newHarvest;
  }

  // Sales
  async getSales(): Promise<Sale[]> {
    await delay(500);
    return [...this.sales];
  }

  // Market Listings
  async getMarketListings(): Promise<MarketListing[]> {
    await delay(500);
    return [...this.listings];
  }

  // Sensors
  async getSensors(): Promise<Sensor[]> {
    await delay(400);
    return [...this.sensors];
  }

  // Alerts
  async getAlerts(): Promise<Alert[]> {
    await delay(300);
    return [...this.alerts];
  }

  async dismissAlert(id: string): Promise<void> {
    await delay(200);
    const index = this.alerts.findIndex(a => a.id === id);
    if (index !== -1) {
      this.alerts[index].dismissedAt = new Date().toISOString();
    }
  }
}
