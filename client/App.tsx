import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import FarmerManagement from "./pages/FarmerManagement";
import InventoryManagement from "./pages/InventoryManagement";
import HarvestManagement from "./pages/HarvestManagement";
import CropMarketplace from "./pages/CropMarketplace";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";
import {
  Users,
  Sprout,
  Package,
  Wheat,
  DollarSign,
  Store,
  Gauge,
  Globe
} from "lucide-react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/farmers" element={<FarmerManagement />} />
            <Route
              path="/crop-planning"
              element={
                <PlaceholderPage
                  title="Crop Planning"
                  description="Plan crop rotations, seasonal planting schedules, and agricultural strategies."
                  icon={<Sprout className="h-8 w-8 text-muted-foreground" />}
                />
              }
            />
            <Route path="/inventory" element={<InventoryManagement />} />
            <Route path="/harvest" element={<HarvestManagement />} />
            <Route
              path="/sales-finance"
              element={
                <PlaceholderPage
                  title="Sales & Finance"
                  description="Manage sales transactions, financial reporting, and revenue analytics."
                  icon={<DollarSign className="h-8 w-8 text-muted-foreground" />}
                />
              }
            />
            <Route path="/marketplace" element={<CropMarketplace />} />
            <Route
              path="/sensors"
              element={
                <PlaceholderPage
                  title="Sensor Dashboard"
                  description="Monitor IoT sensors for soil conditions, weather data, and crop health."
                  icon={<Gauge className="h-8 w-8 text-muted-foreground" />}
                />
              }
            />
            <Route
              path="/national-analytics"
              element={
                <PlaceholderPage
                  title="National Analytics"
                  description="View country-wide agricultural statistics, trends, and comparative data."
                  icon={<Globe className="h-8 w-8 text-muted-foreground" />}
                />
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
