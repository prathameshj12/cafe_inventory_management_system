import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, Plus, Edit, Trash2, Phone, Mail, MapPin, Download } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  address: string;
  categories: string[];
  status: "active" | "inactive";
  lastOrder: string;
  totalOrders: number;
}

export function Suppliers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contact: "",
    email: "",
    address: "",
    categories: [] as string[],
    status: "active" as "active" | "inactive"
  });

  const suppliers: Supplier[] = [
    {
      id: "1",
      name: "Premium Coffee Co.",
      contact: "+1 (555) 123-4567",
      email: "orders@premiumcoffee.com",
      address: "123 Coffee Street, Bean City, BC 12345",
      categories: ["Coffee Beans", "Equipment"],
      status: "active",
      lastOrder: "2025-01-18",
      totalOrders: 47
    },
    {
      id: "2",
      name: "Dairy Fresh",
      contact: "+1 (555) 234-5678",
      email: "sales@dairyfresh.com",
      address: "456 Milk Lane, Fresh Town, FT 67890",
      categories: ["Dairy", "Beverages"],
      status: "active",
      lastOrder: "2025-01-20",
      totalOrders: 32
    },
    {
      id: "3",
      name: "Bakery Delights",
      contact: "+1 (555) 345-6789",
      email: "wholesale@bakerydelights.com",
      address: "789 Pastry Ave, Bake City, BK 11223",
      categories: ["Pastries", "Snacks"],
      status: "active",
      lastOrder: "2025-01-19",
      totalOrders: 28
    },
    {
      id: "4",
      name: "Flavor Masters",
      contact: "+1 (555) 456-7890",
      email: "info@flavormasters.com",
      address: "321 Syrup Boulevard, Sweet Valley, SV 44556",
      categories: ["Syrups", "Flavorings"],
      status: "inactive",
      lastOrder: "2024-12-15",
      totalOrders: 15
    },
    {
      id: "5",
      name: "Tea Gardens",
      contact: "+1 (555) 567-8901",
      email: "orders@teagardens.com",
      address: "654 Green Leaf Road, Tea Hills, TH 77889",
      categories: ["Tea", "Herbs"],
      status: "active",
      lastOrder: "2025-01-17",
      totalOrders: 22
    }
  ];

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const categories = ["Coffee Beans", "Dairy", "Syrups", "Pastries", "Tea", "Equipment"];

  const handleAddSupplier = () => {
    if (!newSupplier.name || !newSupplier.email || !newSupplier.contact) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    toast.success("Supplier added successfully!");
    setIsAddDialogOpen(false);
    setNewSupplier({
      name: "",
      contact: "",
      email: "",
      address: "",
      categories: [],
      status: "active"
    });
  };

  const exportData = () => {
    const csvContent = [
      ['Supplier Name', 'Contact', 'Email', 'Address', 'Categories', 'Status', 'Last Order', 'Total Orders'],
      ...suppliers.map(s => [s.name, s.contact, s.email, s.address, s.categories.join('; '), s.status, s.lastOrder, s.totalOrders])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'suppliers-report.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const toggleCategory = (category: string) => {
    setNewSupplier(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Suppliers</h1>
          <p className="text-muted-foreground">Manage your supplier relationships</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={exportData}
            className="h-9 w-9 p-0"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Supplier
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Supplier</DialogTitle>
                <DialogDescription>
                  Enter the supplier information. Fields marked with * are required.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name*</Label>
                  <Input
                    id="name"
                    value={newSupplier.name}
                    onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                    className="col-span-3"
                    placeholder="Supplier name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contact" className="text-right">Contact*</Label>
                  <Input
                    id="contact"
                    value={newSupplier.contact}
                    onChange={(e) => setNewSupplier({...newSupplier, contact: e.target.value})}
                    className="col-span-3"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email*</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newSupplier.email}
                    onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                    className="col-span-3"
                    placeholder="supplier@example.com"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">Address</Label>
                  <Textarea
                    id="address"
                    value={newSupplier.address}
                    onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
                    className="col-span-3"
                    placeholder="Full address"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Categories</Label>
                  <div className="col-span-3 space-y-2">
                    {categories.map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`category-${category}`}
                          checked={newSupplier.categories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="rounded border border-input"
                        />
                        <Label htmlFor={`category-${category}`} className="text-sm">{category}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">Status</Label>
                  <Select value={newSupplier.status} onValueChange={(value: "active" | "inactive") => setNewSupplier({...newSupplier, status: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSupplier}>
                  Add Supplier
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSuppliers.map((supplier) => (
            <Card key={supplier.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{supplier.name}</h3>
                  <Badge variant={supplier.status === "active" ? "default" : "secondary"}>
                    {supplier.status}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {supplier.contact}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {supplier.email}
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{supplier.address}</span>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Categories:</p>
                <div className="flex flex-wrap gap-1">
                  {supplier.categories.map((category) => (
                    <Badge key={category} variant="outline" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex justify-between text-sm text-muted-foreground">
                <span>Last Order: {supplier.lastOrder}</span>
                <span>Total Orders: {supplier.totalOrders}</span>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}