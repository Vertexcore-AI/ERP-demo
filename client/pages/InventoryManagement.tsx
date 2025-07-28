import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Package,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  PackageCheck,
  PackageX,
  BarChart3,
  Calendar,
  MapPin,
  Filter,
  ArrowUpDown,
  Minus,
} from 'lucide-react';
import { useInventory, useFilteredData, usePagination } from '@/hooks/useData';
import type { InventoryItem } from '@/types';

const categoryColors = {
  seeds: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  fertilizer: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  pesticide: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  equipment: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
  tools: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
  other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
};

const getStockStatus = (current: number, min: number, max: number) => {
  const percentage = (current / max) * 100;
  if (current <= min) return { status: 'critical', color: 'text-red-600', bgColor: 'bg-red-100' };
  if (percentage <= 30) return { status: 'low', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
  if (percentage >= 90) return { status: 'high', color: 'text-blue-600', bgColor: 'bg-blue-100' };
  return { status: 'normal', color: 'text-green-600', bgColor: 'bg-green-100' };
};

export default function InventoryManagement() {
  const { items, loading, error, updateItem } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [stockAction, setStockAction] = useState<'in' | 'out'>('in');
  const [stockQuantity, setStockQuantity] = useState(0);
  const [stockReason, setStockReason] = useState('');

  // Filter items based on search and filters
  const searchFilteredItems = useFilteredData(items, searchTerm, ['name', 'brand', 'supplier', 'location']);
  
  const filteredItems = useMemo(() => {
    return searchFilteredItems.filter(item => {
      const categoryMatch = categoryFilter === 'all' || item.category === categoryFilter;
      
      let stockMatch = true;
      if (stockFilter === 'critical') {
        stockMatch = item.currentStock <= item.minStockLevel;
      } else if (stockFilter === 'low') {
        const percentage = (item.currentStock / item.maxStockLevel) * 100;
        stockMatch = percentage <= 30 && item.currentStock > item.minStockLevel;
      } else if (stockFilter === 'high') {
        const percentage = (item.currentStock / item.maxStockLevel) * 100;
        stockMatch = percentage >= 90;
      }
      
      return categoryMatch && stockMatch;
    });
  }, [searchFilteredItems, categoryFilter, stockFilter]);

  const { currentData, currentPage, totalPages, goToPage, hasNext, hasPrev } = usePagination(filteredItems, 10);

  // Calculate summary statistics
  const totalItems = items.length;
  const totalValue = items.reduce((sum, item) => sum + (item.currentStock * item.pricePerUnit), 0);
  const criticalItems = items.filter(item => item.currentStock <= item.minStockLevel).length;
  const lowStockItems = items.filter(item => {
    const percentage = (item.currentStock / item.maxStockLevel) * 100;
    return percentage <= 30 && item.currentStock > item.minStockLevel;
  }).length;

  const handleStockUpdate = async () => {
    if (!selectedItem) return;

    try {
      const newStock = stockAction === 'in' 
        ? selectedItem.currentStock + stockQuantity
        : selectedItem.currentStock - stockQuantity;

      if (newStock < 0) {
        alert('Cannot reduce stock below zero');
        return;
      }

      await updateItem(selectedItem.id, {
        currentStock: newStock,
        lastRestocked: stockAction === 'in' ? new Date().toISOString().split('T')[0] : selectedItem.lastRestocked,
      });

      setStockDialogOpen(false);
      setSelectedItem(null);
      setStockQuantity(0);
      setStockReason('');
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const openStockDialog = (item: InventoryItem, action: 'in' | 'out') => {
    setSelectedItem(item);
    setStockAction(action);
    setStockDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600">Error loading inventory: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">
            Track seeds, fertilizers, equipment, and agricultural supplies
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              {items.filter(i => i.currentStock > 0).length} in stock
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Current stock value
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalItems}</div>
            <p className="text-xs text-muted-foreground">
              Below minimum level
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Need restocking
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="seeds">Seeds</SelectItem>
                <SelectItem value="fertilizer">Fertilizer</SelectItem>
                <SelectItem value="pesticide">Pesticide</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="tools">Tools</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Inventory Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item) => {
                const stockStatus = getStockStatus(item.currentStock, item.minStockLevel, item.maxStockLevel);
                const stockPercentage = (item.currentStock / item.maxStockLevel) * 100;
                
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.brand && `${item.brand} • `}{item.supplier}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={categoryColors[item.category]}>
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{item.currentStock} {item.unit}</span>
                          <span className="text-muted-foreground">
                            {stockPercentage.toFixed(0)}%
                          </span>
                        </div>
                        <Progress value={stockPercentage} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          Min: {item.minStockLevel} • Max: {item.maxStockLevel}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          ${(item.currentStock * item.pricePerUnit).toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ${item.pricePerUnit}/{item.unit}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin className="mr-1 h-3 w-3" />
                        {item.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={`${stockStatus.color} ${stockStatus.bgColor} dark:bg-opacity-20`}
                      >
                        {stockStatus.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Stock Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openStockDialog(item, 'in')}>
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Add Stock
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openStockDialog(item, 'out')}>
                            <TrendingDown className="mr-2 h-4 w-4" />
                            Remove Stock
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Item
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            View History
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, filteredItems.length)} of {filteredItems.length} items
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={!hasPrev}
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(page)}
                      className="w-8"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={!hasNext}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stock Update Dialog */}
      <Dialog open={stockDialogOpen} onOpenChange={setStockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {stockAction === 'in' ? 'Add Stock' : 'Remove Stock'}
            </DialogTitle>
            <DialogDescription>
              {stockAction === 'in' 
                ? `Add stock to ${selectedItem?.name}` 
                : `Remove stock from ${selectedItem?.name}`
              }
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Current Stock</Label>
                  <div className="text-2xl font-bold">
                    {selectedItem.currentStock} {selectedItem.unit}
                  </div>
                </div>
                <div>
                  <Label>After Update</Label>
                  <div className="text-2xl font-bold">
                    {stockAction === 'in' 
                      ? selectedItem.currentStock + stockQuantity
                      : selectedItem.currentStock - stockQuantity
                    } {selectedItem.unit}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">
                  Quantity to {stockAction === 'in' ? 'Add' : 'Remove'}
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Select value={stockReason} onValueChange={setStockReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {stockAction === 'in' ? (
                      <>
                        <SelectItem value="purchase">New Purchase</SelectItem>
                        <SelectItem value="return">Return from Field</SelectItem>
                        <SelectItem value="donation">Donation</SelectItem>
                        <SelectItem value="transfer">Transfer In</SelectItem>
                        <SelectItem value="adjustment">Stock Adjustment</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="usage">Field Usage</SelectItem>
                        <SelectItem value="sale">Sale</SelectItem>
                        <SelectItem value="waste">Waste/Expired</SelectItem>
                        <SelectItem value="transfer">Transfer Out</SelectItem>
                        <SelectItem value="adjustment">Stock Adjustment</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setStockDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleStockUpdate}
              disabled={stockQuantity <= 0 || !stockReason}
            >
              {stockAction === 'in' ? 'Add Stock' : 'Remove Stock'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
