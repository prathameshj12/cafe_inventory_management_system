import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Search, Plus, Edit, Trash2, Download } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Product {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  supplier: string;
  lastUpdated: string;
  price: number;
}

export function InventoryTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    currentStock: "",
    minimumStock: "",
    unit: "",
    supplier: "",
    price: ""
  });

  const products: Product[] = [
    {
      id: "1",
      name: "Arabica Premium Blend",
      category: "Coffee Beans",
      currentStock: 5,
      minimumStock: 10,
      unit: "kg",
      supplier: "Premium Coffee Co.",
      lastUpdated: "2025-01-20",
      price: 45.00
    },
    {
      id: "2",
      name: "Espresso Roast",
      category: "Coffee Beans",
      currentStock: 25,
      minimumStock: 15,
      unit: "kg",
      supplier: "Roasters United",
      lastUpdated: "2025-01-19",
      price: 38.50
    },
    {
      id: "3",
      name: "Oat Milk",
      category: "Dairy",
      currentStock: 8,
      minimumStock: 15,
      unit: "L",
      supplier: "Dairy Fresh",
      lastUpdated: "2025-01-21",
      price: 4.25
    },
    {
      id: "4",
      name: "Vanilla Syrup",
      category: "Syrups",
      currentStock: 3,
      minimumStock: 8,
      unit: "bottles",
      supplier: "Flavor Masters",
      lastUpdated: "2025-01-18",
      price: 12.99
    },
    {
      id: "5",
      name: "Chocolate Croissant",
      category: "Pastries",
      currentStock: 2,
      minimumStock: 12,
      unit: "pieces",
      supplier: "Bakery Delights",
      lastUpdated: "2025-01-21",
      price: 3.50
    },
    {
      id: "6",
      name: "Green Tea Leaves",
      category: "Tea",
      currentStock: 18,
      minimumStock: 10,
      unit: "kg",
      supplier: "Tea Gardens",
      lastUpdated: "2025-01-20",
      price: 28.00
    }
  ];

  const categories = ["Coffee Beans", "Dairy", "Syrups", "Pastries", "Tea", "Equipment"];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (current: number, minimum: number) => {
    if (current <= minimum) return { label: "Low Stock", variant: "destructive" as const };
    if (current <= minimum * 1.5) return { label: "Medium", variant: "secondary" as const };
    return { label: "In Stock", variant: "default" as const };
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.currentStock || !newProduct.minimumStock) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    toast.success("Product added successfully!");
    setIsAddDialogOpen(false);
    setNewProduct({
      name: "",
      category: "",
      currentStock: "",
      minimumStock: "",
      unit: "",
      supplier: "",
      price: ""
    });
  };

  const exportData = () => {
    const csvContent = [
      ['Product Name', 'Category', 'Current Stock', 'Minimum Stock', 'Unit', 'Supplier', 'Price', 'Last Updated'],
      ...products.map(p => [p.name, p.category, p.currentStock, p.minimumStock, p.unit, p.supplier, p.price, p.lastUpdated])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'inventory-report.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Inventory Management</h1>
          <p className="text-muted-foreground">Manage your coffee shop inventory</p>
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
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Enter the details for the new product. Fields marked with * are required.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name*</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="col-span-3"
                    placeholder="Product name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">Category*</Label>
                  <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="currentStock" className="text-right">Current Stock*</Label>
                  <Input
                    id="currentStock"
                    type="number"
                    value={newProduct.currentStock}
                    onChange={(e) => setNewProduct({...newProduct, currentStock: e.target.value})}
                    className="col-span-3"
                    placeholder="0"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="minimumStock" className="text-right">Min Stock*</Label>
                  <Input
                    id="minimumStock"
                    type="number"
                    value={newProduct.minimumStock}
                    onChange={(e) => setNewProduct({...newProduct, minimumStock: e.target.value})}
                    className="col-span-3"
                    placeholder="0"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="unit" className="text-right">Unit</Label>
                  <Input
                    id="unit"
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                    className="col-span-3"
                    placeholder="kg, L, pieces, etc."
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="supplier" className="text-right">Supplier</Label>
                  <Input
                    id="supplier"
                    value={newProduct.supplier}
                    onChange={(e) => setNewProduct({...newProduct, supplier: e.target.value})}
                    className="col-span-3"
                    placeholder="Supplier name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="col-span-3"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProduct}>
                  Add Product
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products or suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => {
              const status = getStockStatus(product.currentStock, product.minimumStock);
              return (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    {product.currentStock} {product.unit}
                    <span className="text-muted-foreground text-sm ml-1">
                      (min: {product.minimumStock})
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </TableCell>
                  <TableCell>{product.supplier}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.lastUpdated}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}