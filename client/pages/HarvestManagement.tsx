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
import { Textarea } from '@/components/ui/textarea';
import { 
  Wheat,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Calendar,
  TrendingUp,
  DollarSign,
  Package,
  MapPin,
  Star,
  Filter,
  BarChart3,
} from 'lucide-react';
import { useHarvests, useFarmers, useFilteredData, usePagination } from '@/hooks/useData';
import type { HarvestRecord } from '@/types';

const qualityColors = {
  excellent: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  good: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  average: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  poor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
};

const statusColors = {
  harvested: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  stored: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  sold: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
  processed: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
};

export default function HarvestManagement() {
  const { harvests, loading, error, createHarvest } = useHarvests();
  const { farmers } = useFarmers();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [qualityFilter, setQualityFilter] = useState<string>('all');
  const [selectedHarvest, setSelectedHarvest] = useState<HarvestRecord | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Filter harvests based on search and filters
  const searchFilteredHarvests = useFilteredData(harvests, searchTerm, ['cropName', 'grade', 'storageLocation']);
  
  const filteredHarvests = useMemo(() => {
    return searchFilteredHarvests.filter(harvest => {
      const statusMatch = statusFilter === 'all' || harvest.status === statusFilter;
      const qualityMatch = qualityFilter === 'all' || harvest.quality === qualityFilter;
      return statusMatch && qualityMatch;
    });
  }, [searchFilteredHarvests, statusFilter, qualityFilter]);

  const { currentData, currentPage, totalPages, goToPage, hasNext, hasPrev } = usePagination(filteredHarvests, 10);

  const [formData, setFormData] = useState<Partial<HarvestRecord>>({
    farmerId: '',
    cropPlanId: '',
    cropName: '',
    harvestDate: '',
    quantity: 0,
    unit: 'kg',
    quality: 'good',
    moistureContent: 0,
    grade: '',
    pricePerUnit: 0,
    totalValue: 0,
    storageLocation: '',
    status: 'harvested',
    notes: '',
  });

  const resetForm = () => {
    setFormData({
      farmerId: '',
      cropPlanId: '',
      cropName: '',
      harvestDate: '',
      quantity: 0,
      unit: 'kg',
      quality: 'good',
      moistureContent: 0,
      grade: '',
      pricePerUnit: 0,
      totalValue: 0,
      storageLocation: '',
      status: 'harvested',
      notes: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createHarvest({
        ...formData,
        totalValue: (formData.quantity || 0) * (formData.pricePerUnit || 0),
      } as Omit<HarvestRecord, 'id'>);
      
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating harvest record:', error);
    }
  };

  const handleView = (harvest: HarvestRecord) => {
    setSelectedHarvest(harvest);
    setViewDialogOpen(true);
  };

  // Calculate summary statistics
  const totalHarvest = harvests.reduce((sum, h) => sum + h.quantity, 0);
  const totalValue = harvests.reduce((sum, h) => sum + h.totalValue, 0);
  const averageQuality = harvests.filter(h => h.quality === 'excellent' || h.quality === 'good').length / harvests.length * 100;
  const harvestsThisMonth = harvests.filter(h => {
    const harvestDate = new Date(h.harvestDate);
    const now = new Date();
    return harvestDate.getMonth() === now.getMonth() && harvestDate.getFullYear() === now.getFullYear();
  }).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading harvest records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600">Error loading harvest records: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Harvest Management</h1>
          <p className="text-muted-foreground">
            Record harvest data, quality metrics, and yield analytics
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setSelectedHarvest(null); }}>
              <Plus className="mr-2 h-4 w-4" />
              Record Harvest
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Record New Harvest</DialogTitle>
              <DialogDescription>
                Add a new harvest record to track yield and quality metrics
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="farmerId">Farmer *</Label>
                  <Select
                    value={formData.farmerId}
                    onValueChange={(value) => setFormData({...formData, farmerId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select farmer" />
                    </SelectTrigger>
                    <SelectContent>
                      {farmers.map((farmer) => (
                        <SelectItem key={farmer.id} value={farmer.id}>
                          {farmer.name} ({farmer.farmerId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cropName">Crop Name *</Label>
                  <Input
                    id="cropName"
                    value={formData.cropName || ''}
                    onChange={(e) => setFormData({...formData, cropName: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="harvestDate">Harvest Date *</Label>
                  <Input
                    id="harvestDate"
                    type="date"
                    value={formData.harvestDate || ''}
                    onChange={(e) => setFormData({...formData, harvestDate: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="quantity"
                      type="number"
                      step="0.01"
                      value={formData.quantity || ''}
                      onChange={(e) => {
                        const quantity = parseFloat(e.target.value) || 0;
                        setFormData({
                          ...formData,
                          quantity,
                          totalValue: quantity * (formData.pricePerUnit || 0)
                        });
                      }}
                      required
                      className="flex-1"
                    />
                    <Select
                      value={formData.unit}
                      onValueChange={(value) => setFormData({...formData, unit: value})}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="MT">MT</SelectItem>
                        <SelectItem value="tons">tons</SelectItem>
                        <SelectItem value="lbs">lbs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="quality">Quality *</Label>
                  <Select
                    value={formData.quality}
                    onValueChange={(value: 'excellent' | 'good' | 'average' | 'poor') =>
                      setFormData({...formData, quality: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="average">Average</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Input
                    id="grade"
                    value={formData.grade || ''}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                    placeholder="A+, A, B, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="moistureContent">Moisture (%)</Label>
                  <Input
                    id="moistureContent"
                    type="number"
                    step="0.1"
                    value={formData.moistureContent || ''}
                    onChange={(e) => setFormData({...formData, moistureContent: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="pricePerUnit">Price per Unit *</Label>
                  <Input
                    id="pricePerUnit"
                    type="number"
                    step="0.01"
                    value={formData.pricePerUnit || ''}
                    onChange={(e) => {
                      const price = parseFloat(e.target.value) || 0;
                      setFormData({
                        ...formData,
                        pricePerUnit: price,
                        totalValue: (formData.quantity || 0) * price
                      });
                    }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalValue">Total Value</Label>
                  <Input
                    id="totalValue"
                    type="number"
                    value={formData.totalValue || 0}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storageLocation">Storage Location *</Label>
                  <Input
                    id="storageLocation"
                    value={formData.storageLocation || ''}
                    onChange={(e) => setFormData({...formData, storageLocation: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'harvested' | 'stored' | 'sold' | 'processed') =>
                      setFormData({...formData, status: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="harvested">Harvested</SelectItem>
                      <SelectItem value="stored">Stored</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="processed">Processed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Record Harvest
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Harvest</CardTitle>
            <Wheat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalHarvest / 1000).toFixed(1)}k MT</div>
            <p className="text-xs text-muted-foreground">
              {harvests.length} records
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalValue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              Avg: ${(totalValue / harvests.length || 0).toLocaleString()}/record
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Rate</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageQuality.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Excellent & Good quality
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{harvestsThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              New harvest records
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Harvest Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search harvests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="harvested">Harvested</SelectItem>
                <SelectItem value="stored">Stored</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="processed">Processed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={qualityFilter} onValueChange={setQualityFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Quality</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="average">Average</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Harvest Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Crop & Farmer</TableHead>
                <TableHead>Harvest Details</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Storage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((harvest) => {
                const farmer = farmers.find(f => f.id === harvest.farmerId);
                
                return (
                  <TableRow key={harvest.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{harvest.cropName}</div>
                        <div className="text-sm text-muted-foreground">
                          {farmer?.name || 'Unknown Farmer'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          {harvest.quantity} {harvest.unit}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(harvest.harvestDate).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant="secondary" className={qualityColors[harvest.quality]}>
                          {harvest.quality}
                        </Badge>
                        {harvest.grade && (
                          <div className="text-sm text-muted-foreground">
                            Grade: {harvest.grade}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          ${harvest.totalValue.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ${harvest.pricePerUnit}/{harvest.unit}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin className="mr-1 h-3 w-3" />
                        {harvest.storageLocation}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColors[harvest.status]}>
                        {harvest.status}
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
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleView(harvest)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Record
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Generate Report
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
                Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, filteredHarvests.length)} of {filteredHarvests.length} records
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



      {/* View Harvest Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Harvest Record Details</DialogTitle>
          </DialogHeader>
          {selectedHarvest && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Crop:</strong> {selectedHarvest.cropName}</div>
                    <div><strong>Farmer:</strong> {farmers.find(f => f.id === selectedHarvest.farmerId)?.name}</div>
                    <div><strong>Harvest Date:</strong> {new Date(selectedHarvest.harvestDate).toLocaleDateString()}</div>
                    <div>
                      <strong>Status:</strong> 
                      <Badge variant="secondary" className={`ml-2 ${statusColors[selectedHarvest.status]}`}>
                        {selectedHarvest.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Quantity & Quality</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Quantity:</strong> {selectedHarvest.quantity} {selectedHarvest.unit}</div>
                    <div>
                      <strong>Quality:</strong> 
                      <Badge variant="secondary" className={`ml-2 ${qualityColors[selectedHarvest.quality]}`}>
                        {selectedHarvest.quality}
                      </Badge>
                    </div>
                    {selectedHarvest.grade && (
                      <div><strong>Grade:</strong> {selectedHarvest.grade}</div>
                    )}
                    {selectedHarvest.moistureContent && (
                      <div><strong>Moisture:</strong> {selectedHarvest.moistureContent}%</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Financial Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Price per Unit:</strong> ${selectedHarvest.pricePerUnit}</div>
                    <div><strong>Total Value:</strong> ${selectedHarvest.totalValue.toLocaleString()}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Storage</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-3 w-3" />
                      {selectedHarvest.storageLocation}
                    </div>
                  </div>
                </div>
              </div>

              {selectedHarvest.notes && (
                <div>
                  <h4 className="font-medium mb-2">Notes</h4>
                  <div className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                    {selectedHarvest.notes}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
