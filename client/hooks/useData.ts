import { useState, useEffect } from 'react';
import { MockDataStore } from '@/lib/mockData';
import type {
  Farmer,
  Crop,
  InventoryItem,
  HarvestRecord,
  Sale,
  Customer,
  MarketListing,
  Sensor,
  Alert,
} from '@/types';

const dataStore = MockDataStore.getInstance();

// Generic hook for async data fetching
function useAsyncData<T>(fetchFn: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFn();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, deps);

  return { data, loading, error, refetch: () => setData(null) };
}

// Farmers
export function useFarmers() {
  const { data, loading, error, refetch } = useAsyncData(() => dataStore.getFarmers());
  
  const createFarmer = async (farmer: Omit<Farmer, 'id'>) => {
    await dataStore.createFarmer(farmer);
    refetch();
  };

  const updateFarmer = async (id: string, updates: Partial<Farmer>) => {
    await dataStore.updateFarmer(id, updates);
    refetch();
  };

  const deleteFarmer = async (id: string) => {
    await dataStore.deleteFarmer(id);
    refetch();
  };

  return {
    farmers: data || [],
    loading,
    error,
    createFarmer,
    updateFarmer,
    deleteFarmer,
    refetch,
  };
}

export function useFarmer(id: string | undefined) {
  return useAsyncData(
    () => id ? dataStore.getFarmer(id) : Promise.resolve(undefined),
    [id]
  );
}

// Crops
export function useCrops() {
  const { data, loading, error } = useAsyncData(() => dataStore.getCrops());
  
  return {
    crops: data || [],
    loading,
    error,
  };
}

// Inventory
export function useInventory() {
  const { data, loading, error, refetch } = useAsyncData(() => dataStore.getInventoryItems());
  
  const updateItem = async (id: string, updates: Partial<InventoryItem>) => {
    await dataStore.updateInventoryItem(id, updates);
    refetch();
  };

  return {
    items: data || [],
    loading,
    error,
    updateItem,
    refetch,
  };
}

// Harvests
export function useHarvests() {
  const { data, loading, error, refetch } = useAsyncData(() => dataStore.getHarvests());
  
  const createHarvest = async (harvest: Omit<HarvestRecord, 'id'>) => {
    await dataStore.createHarvest(harvest);
    refetch();
  };

  return {
    harvests: data || [],
    loading,
    error,
    createHarvest,
    refetch,
  };
}

// Sales
export function useSales() {
  const { data, loading, error } = useAsyncData(() => dataStore.getSales());
  
  return {
    sales: data || [],
    loading,
    error,
  };
}

// Market Listings
export function useMarketListings() {
  const { data, loading, error } = useAsyncData(() => dataStore.getMarketListings());
  
  return {
    listings: data || [],
    loading,
    error,
  };
}

// Sensors
export function useSensors() {
  const { data, loading, error } = useAsyncData(() => dataStore.getSensors());
  
  return {
    sensors: data || [],
    loading,
    error,
  };
}

// Alerts
export function useAlerts() {
  const { data, loading, error, refetch } = useAsyncData(() => dataStore.getAlerts());
  
  const dismissAlert = async (id: string) => {
    await dataStore.dismissAlert(id);
    refetch();
  };

  return {
    alerts: data || [],
    loading,
    error,
    dismissAlert,
    refetch,
  };
}

// Search and filter utilities
export function useFilteredData<T>(
  data: T[],
  searchTerm: string,
  searchFields: (keyof T)[]
) {
  const [filteredData, setFilteredData] = useState<T[]>(data);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        return value && 
          value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );

    setFilteredData(filtered);
  }, [data, searchTerm, searchFields]);

  return filteredData;
}

// Pagination hook
export function usePagination<T>(data: T[], itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return {
    currentData,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}
