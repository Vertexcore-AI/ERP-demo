import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Store,
  Plus,
  Search,
  Eye,
  MessageCircle,
  MapPin,
  Calendar,
  TrendingUp,
  DollarSign,
  Package,
  Star,
  Filter,
  Heart,
  Share,
} from 'lucide-react';
import { useMarketListings, useFilteredData, usePagination } from '@/hooks/useData';
import type { MarketListing } from '@/types';

const statusColors = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  sold: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  expired: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  withdrawn: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
};

const qualityColors = {
  excellent: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  good: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  average: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
};

export default function CropMarketplace() {
  const { listings, loading, error } = useMarketListings();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const [qualityFilter, setQualityFilter] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [selectedListing, setSelectedListing] = useState<MarketListing | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [inquiryDialogOpen, setInquiryDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter listings based on search and filters
  const searchFilteredListings = useFilteredData(listings, searchTerm, ['cropName', 'location', 'description']);
  
  const filteredListings = useMemo(() => {
    return searchFilteredListings.filter(listing => {
      const statusMatch = statusFilter === 'all' || listing.status === statusFilter;
      const qualityMatch = qualityFilter === 'all' || listing.quality === qualityFilter;
      
      let priceMatch = true;
      if (priceRange === 'low') {
        priceMatch = listing.pricePerUnit < 100;
      } else if (priceRange === 'medium') {
        priceMatch = listing.pricePerUnit >= 100 && listing.pricePerUnit < 500;
      } else if (priceRange === 'high') {
        priceMatch = listing.pricePerUnit >= 500;
      }
      
      return statusMatch && qualityMatch && priceMatch;
    });
  }, [searchFilteredListings, statusFilter, qualityFilter, priceRange]);

  const { currentData, currentPage, totalPages, goToPage, hasNext, hasPrev } = usePagination(filteredListings, 12);

  const [inquiryForm, setInquiryForm] = useState({
    buyerName: '',
    buyerEmail: '',
    buyerPhone: '',
    quantity: 0,
    proposedPrice: 0,
    message: '',
  });

  const handleView = (listing: MarketListing) => {
    setSelectedListing(listing);
    setViewDialogOpen(true);
  };

  const handleInquiry = (listing: MarketListing) => {
    setSelectedListing(listing);
    setInquiryDialogOpen(true);
  };

  const submitInquiry = () => {
    // In a real app, this would send the inquiry to the seller
    console.log('Inquiry submitted:', inquiryForm);
    setInquiryDialogOpen(false);
    setInquiryForm({
      buyerName: '',
      buyerEmail: '',
      buyerPhone: '',
      quantity: 0,
      proposedPrice: 0,
      message: '',
    });
  };

  // Calculate summary statistics
  const activeListings = listings.filter(l => l.status === 'active').length;
  const totalValue = listings.reduce((sum, l) => sum + (l.quantity * l.pricePerUnit), 0);
  const averagePrice = listings.length > 0 ? listings.reduce((sum, l) => sum + l.pricePerUnit, 0) / listings.length : 0;
  const totalViews = listings.reduce((sum, l) => sum + l.views, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600">Error loading marketplace: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Crop Marketplace</h1>
          <p className="text-muted-foreground">
            Connect with buyers, manage crop listings, and track market prices
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Listing
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeListings}</div>
            <p className="text-xs text-muted-foreground">
              {listings.length} total listings
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalValue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              Total listed value
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averagePrice.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              Per unit average
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">
              Market engagement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Marketplace Listings</CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search crops, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select value={qualityFilter} onValueChange={setQualityFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Quality</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="average">Average</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="low">Under $100</SelectItem>
                <SelectItem value="medium">$100-$500</SelectItem>
                <SelectItem value="high">$500+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Listings Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {currentData.map((listing) => (
                <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{listing.cropName}</CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="mr-1 h-3 w-3" />
                          {listing.location}
                        </div>
                      </div>
                      <Badge variant="secondary" className={statusColors[listing.status]}>
                        {listing.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">${listing.pricePerUnit}</div>
                        <div className="text-sm text-muted-foreground">per {listing.unit}</div>
                      </div>
                      <Badge variant="secondary" className={qualityColors[listing.quality]}>
                        {listing.quality}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium">{listing.quantity} {listing.unit}</span>
                        <div className="text-muted-foreground">Available</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">Min: {listing.minOrderQuantity} {listing.unit}</div>
                        <div className="text-muted-foreground">Order</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Eye className="mr-1 h-3 w-3" />
                        {listing.views}
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="mr-1 h-3 w-3" />
                        {listing.inquiries}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {new Date(listing.harvestDate).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1" onClick={() => handleView(listing)}>
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleInquiry(listing)}
                      >
                        <MessageCircle className="mr-1 h-3 w-3" />
                        Inquire
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {currentData.map((listing) => (
                <Card key={listing.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <h3 className="font-semibold text-lg">{listing.cropName}</h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="mr-1 h-3 w-3" />
                              {listing.location}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold">${listing.pricePerUnit}</div>
                            <div className="text-sm text-muted-foreground">per {listing.unit}</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{listing.quantity} {listing.unit}</div>
                            <div className="text-sm text-muted-foreground">Available</div>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="secondary" className={statusColors[listing.status]}>
                              {listing.status}
                            </Badge>
                            <Badge variant="secondary" className={qualityColors[listing.quality]}>
                              {listing.quality}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleView(listing)}>
                          <Eye className="mr-1 h-3 w-3" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleInquiry(listing)}>
                          <MessageCircle className="mr-1 h-3 w-3" />
                          Inquire
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * 12 + 1} to {Math.min(currentPage * 12, filteredListings.length)} of {filteredListings.length} listings
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

      {/* View Listing Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crop Listing Details</DialogTitle>
          </DialogHeader>
          {selectedListing && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Product Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Crop:</strong> {selectedListing.cropName}</div>
                    <div><strong>Quantity:</strong> {selectedListing.quantity} {selectedListing.unit}</div>
                    <div><strong>Min Order:</strong> {selectedListing.minOrderQuantity} {selectedListing.unit}</div>
                    <div>
                      <strong>Quality:</strong> 
                      <Badge variant="secondary" className={`ml-2 ${qualityColors[selectedListing.quality]}`}>
                        {selectedListing.quality}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Pricing & Availability</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Price:</strong> ${selectedListing.pricePerUnit} per {selectedListing.unit}</div>
                    <div><strong>Total Value:</strong> ${(selectedListing.quantity * selectedListing.pricePerUnit).toLocaleString()}</div>
                    <div><strong>Harvest Date:</strong> {new Date(selectedListing.harvestDate).toLocaleDateString()}</div>
                    <div><strong>Available From:</strong> {new Date(selectedListing.availableFrom).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Location</h4>
                <div className="flex items-center text-sm">
                  <MapPin className="mr-2 h-4 w-4" />
                  {selectedListing.location}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <div className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                  {selectedListing.description}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="text-center">
                  <div className="text-lg font-bold">{selectedListing.views}</div>
                  <div className="text-sm text-muted-foreground">Views</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{selectedListing.inquiries}</div>
                  <div className="text-sm text-muted-foreground">Inquiries</div>
                </div>
                <div className="text-center">
                  <Badge variant="secondary" className={statusColors[selectedListing.status]}>
                    {selectedListing.status}
                  </Badge>
                  <div className="text-sm text-muted-foreground mt-1">Status</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => handleInquiry(selectedListing!)}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Send Inquiry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inquiry Dialog */}
      <Dialog open={inquiryDialogOpen} onOpenChange={setInquiryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Inquiry</DialogTitle>
            <DialogDescription>
              Send an inquiry to the seller about {selectedListing?.cropName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="buyerName">Your Name *</Label>
                <Input
                  id="buyerName"
                  value={inquiryForm.buyerName}
                  onChange={(e) => setInquiryForm({...inquiryForm, buyerName: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyerEmail">Email *</Label>
                <Input
                  id="buyerEmail"
                  type="email"
                  value={inquiryForm.buyerEmail}
                  onChange={(e) => setInquiryForm({...inquiryForm, buyerEmail: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="buyerPhone">Phone</Label>
                <Input
                  id="buyerPhone"
                  value={inquiryForm.buyerPhone}
                  onChange={(e) => setInquiryForm({...inquiryForm, buyerPhone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity Needed</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={inquiryForm.quantity}
                  onChange={(e) => setInquiryForm({...inquiryForm, quantity: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="proposedPrice">Proposed Price (optional)</Label>
              <Input
                id="proposedPrice"
                type="number"
                step="0.01"
                value={inquiryForm.proposedPrice}
                onChange={(e) => setInquiryForm({...inquiryForm, proposedPrice: parseFloat(e.target.value) || 0})}
                placeholder={`Current price: $${selectedListing?.pricePerUnit}`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={inquiryForm.message}
                onChange={(e) => setInquiryForm({...inquiryForm, message: e.target.value})}
                rows={4}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setInquiryDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={submitInquiry}
              disabled={!inquiryForm.buyerName || !inquiryForm.buyerEmail || !inquiryForm.message}
            >
              Send Inquiry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
