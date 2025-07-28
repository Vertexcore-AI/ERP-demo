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
  Users,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  DollarSign,
  Filter,
} from 'lucide-react';
import { useFarmers, useFilteredData, usePagination } from '@/hooks/useData';
import type { Farmer } from '@/types';

const statusColors = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
  suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
};

const farmTypeColors = {
  organic: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  conventional: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  mixed: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
};

export default function FarmerManagement() {
  const { farmers, loading, error, createFarmer, updateFarmer, deleteFarmer } = useFarmers();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [farmTypeFilter, setFarmTypeFilter] = useState<string>('all');
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Filter farmers based on search and filters
  const searchFilteredFarmers = useFilteredData(farmers, searchTerm, ['name', 'farmerId', 'contact.email']);
  
  const filteredFarmers = useMemo(() => {
    return searchFilteredFarmers.filter(farmer => {
      const statusMatch = statusFilter === 'all' || farmer.status === statusFilter;
      const typeMatch = farmTypeFilter === 'all' || farmer.farmType === farmTypeFilter;
      return statusMatch && typeMatch;
    });
  }, [searchFilteredFarmers, statusFilter, farmTypeFilter]);

  const { currentData, currentPage, totalPages, goToPage, hasNext, hasPrev } = usePagination(filteredFarmers, 10);

  const [formData, setFormData] = useState<Partial<Farmer>>({
    name: '',
    farmerId: '',
    address: {
      street: '',
      city: '',
      district: '',
      province: '',
      postalCode: '',
      country: 'Sri Lanka',
    },
    contact: {
      phone: '',
      email: '',
      whatsapp: '',
    },
    farmSize: 0,
    farmType: 'conventional',
    status: 'active',
    crops: [],
    totalHarvest: 0,
    revenue: 0,
    notes: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      farmerId: '',
      address: {
        street: '',
        city: '',
        district: '',
        province: '',
        postalCode: '',
        country: 'Sri Lanka',
      },
      contact: {
        phone: '',
        email: '',
        whatsapp: '',
      },
      farmSize: 0,
      farmType: 'conventional',
      status: 'active',
      crops: [],
      totalHarvest: 0,
      revenue: 0,
      notes: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedFarmer) {
        await updateFarmer(selectedFarmer.id, formData);
      } else {
        await createFarmer({
          ...formData,
          joinDate: new Date().toISOString().split('T')[0],
        } as Omit<Farmer, 'id'>);
      }
      
      setDialogOpen(false);
      setSelectedFarmer(null);
      resetForm();
    } catch (error) {
      console.error('Error saving farmer:', error);
    }
  };

  const handleEdit = (farmer: Farmer) => {
    setSelectedFarmer(farmer);
    setFormData(farmer);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (selectedFarmer) {
      try {
        await deleteFarmer(selectedFarmer.id);
        setDeleteDialogOpen(false);
        setSelectedFarmer(null);
      } catch (error) {
        console.error('Error deleting farmer:', error);
      }
    }
  };

  const handleView = (farmer: Farmer) => {
    setSelectedFarmer(farmer);
    setViewDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading farmers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600">Error loading farmers: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Farmer Management</h1>
          <p className="text-muted-foreground">
            Manage farmer profiles and agricultural partnerships
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setSelectedFarmer(null); }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Farmer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedFarmer ? 'Edit Farmer' : 'Add New Farmer'}</DialogTitle>
              <DialogDescription>
                {selectedFarmer ? 'Update farmer information' : 'Add a new farmer to the system'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farmerId">Farmer ID *</Label>
                  <Input
                    id="farmerId"
                    value={formData.farmerId || ''}
                    onChange={(e) => setFormData({...formData, farmerId: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.contact?.phone || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      contact: {...formData.contact!, phone: e.target.value}
                    })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.contact?.email || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      contact: {...formData.contact!, email: e.target.value}
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  value={formData.address?.street || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: {...formData.address!, street: e.target.value}
                  })}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.address?.city || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: {...formData.address!, city: e.target.value}
                    })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District *</Label>
                  <Input
                    id="district"
                    value={formData.address?.district || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: {...formData.address!, district: e.target.value}
                    })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">Province *</Label>
                  <Input
                    id="province"
                    value={formData.address?.province || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: {...formData.address!, province: e.target.value}
                    })}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="farmSize">Farm Size (acres) *</Label>
                  <Input
                    id="farmSize"
                    type="number"
                    step="0.1"
                    value={formData.farmSize || ''}
                    onChange={(e) => setFormData({...formData, farmSize: parseFloat(e.target.value) || 0})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farmType">Farm Type *</Label>
                  <Select
                    value={formData.farmType}
                    onValueChange={(value: 'organic' | 'conventional' | 'mixed') =>
                      setFormData({...formData, farmType: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="organic">Organic</SelectItem>
                      <SelectItem value="conventional">Conventional</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'active' | 'inactive' | 'suspended') =>
                      setFormData({...formData, status: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
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
                  {selectedFarmer ? 'Update Farmer' : 'Add Farmer'}
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
            <CardTitle className="text-sm font-medium">Total Farmers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmers.length}</div>
            <p className="text-xs text-muted-foreground">
              {farmers.filter(f => f.status === 'active').length} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Farm Area</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {farmers.reduce((sum, f) => sum + f.farmSize, 0).toFixed(1)} acres
            </div>
            <p className="text-xs text-muted-foreground">
              Avg: {(farmers.reduce((sum, f) => sum + f.farmSize, 0) / farmers.length || 0).toFixed(1)} acres/farmer
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Harvest</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(farmers.reduce((sum, f) => sum + f.totalHarvest, 0) / 1000).toFixed(1)}k MT
            </div>
            <p className="text-xs text-muted-foreground">
              This season
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(farmers.reduce((sum, f) => sum + f.revenue, 0) / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">
              This year
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Farmers Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search farmers..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={farmTypeFilter} onValueChange={setFarmTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="organic">Organic</SelectItem>
                <SelectItem value="conventional">Conventional</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Farmers Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Farmer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Farm Details</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((farmer) => (
                <TableRow key={farmer.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{farmer.name}</div>
                      <div className="text-sm text-muted-foreground">{farmer.farmerId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Phone className="mr-1 h-3 w-3" />
                        {farmer.contact.phone}
                      </div>
                      {farmer.contact.email && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="mr-1 h-3 w-3" />
                          {farmer.contact.email}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{farmer.farmSize} acres</div>
                      <Badge variant="secondary" className={farmTypeColors[farmer.farmType]}>
                        {farmer.farmType}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">{farmer.totalHarvest} MT</div>
                      <div className="text-sm text-muted-foreground">${farmer.revenue.toLocaleString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={statusColors[farmer.status]}>
                      {farmer.status}
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
                        <DropdownMenuItem onClick={() => handleView(farmer)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(farmer)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => { setSelectedFarmer(farmer); setDeleteDialogOpen(true); }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, filteredFarmers.length)} of {filteredFarmers.length} farmers
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



      {/* View Farmer Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Farmer Details</DialogTitle>
          </DialogHeader>
          {selectedFarmer && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {selectedFarmer.name}</div>
                    <div><strong>Farmer ID:</strong> {selectedFarmer.farmerId}</div>
                    <div><strong>Join Date:</strong> {new Date(selectedFarmer.joinDate).toLocaleDateString()}</div>
                    <div>
                      <strong>Status:</strong> 
                      <Badge variant="secondary" className={`ml-2 ${statusColors[selectedFarmer.status]}`}>
                        {selectedFarmer.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Phone className="mr-2 h-3 w-3" />
                      {selectedFarmer.contact.phone}
                    </div>
                    {selectedFarmer.contact.email && (
                      <div className="flex items-center">
                        <Mail className="mr-2 h-3 w-3" />
                        {selectedFarmer.contact.email}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Address</h4>
                <div className="text-sm text-muted-foreground">
                  {selectedFarmer.address.street}, {selectedFarmer.address.city}, {selectedFarmer.address.district}, {selectedFarmer.address.province}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <h4 className="font-medium mb-2">Farm Size</h4>
                  <div className="text-2xl font-bold">{selectedFarmer.farmSize} acres</div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Total Harvest</h4>
                  <div className="text-2xl font-bold">{selectedFarmer.totalHarvest} MT</div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Total Revenue</h4>
                  <div className="text-2xl font-bold">${selectedFarmer.revenue.toLocaleString()}</div>
                </div>
              </div>

              {selectedFarmer.notes && (
                <div>
                  <h4 className="font-medium mb-2">Notes</h4>
                  <div className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                    {selectedFarmer.notes}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Farmer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedFarmer?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
