import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Search, Package, Filter, Plus, Edit, Trash2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  currentStock: number;
  minimumStock: number;
  unitPrice: number;
  supplier: string;
  lastUpdated: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

export function ProductsOverview() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Mock data for products
  const products: Product[] = [
    {
      id: "P001",
      name: "Arabica Premium Blend",
      category: "Coffee Beans",
      sku: "CB-APB-001",
      currentStock: 5,
      minimumStock: 10,
      unitPrice: 24.99,
      supplier: "Coffee World Co.",
      lastUpdated: "2024-01-15",
      status: "Low Stock"
    },
    {
      id: "P002",
      name: "Espresso Blend",
      category: "Coffee Beans",
      sku: "CB-ESP-002",
      currentStock: 25,
      minimumStock: 15,
      unitPrice: 22.50,
      supplier: "Coffee World Co.",
      lastUpdated: "2024-01-14",
      status: "In Stock"
    },
    {
      id: "P003",
      name: "Whole Milk",
      category: "Dairy",
      sku: "DY-WM-003",
      currentStock: 12,
      minimumStock: 20,
      unitPrice: 3.99,
      supplier: "Fresh Dairy Ltd.",
      lastUpdated: "2024-01-16",
      status: "Low Stock"
    },
    {
      id: "P004",
      name: "Oat Milk",
      category: "Dairy",
      sku: "DY-OM-004",
      currentStock: 8,
      minimumStock: 15,
      unitPrice: 5.49,
      supplier: "Plant Based Co.",
      lastUpdated: "2024-01-15",
      status: "Low Stock"
    },
    {
      id: "P005",
      name: "Vanilla Syrup",
      category: "Syrups",
      sku: "SY-VAN-005",
      currentStock: 3,
      minimumStock: 8,
      unitPrice: 8.99,
      supplier: "Flavor Masters",
      lastUpdated: "2024-01-14",
      status: "Low Stock"
    },
    {
      id: "P006",
      name: "Caramel Syrup",
      category: "Syrups",
      sku: "SY-CAR-006",
      currentStock: 15,
      minimumStock: 8,
      unitPrice: 9.49,
      supplier: "Flavor Masters",
      lastUpdated: "2024-01-13",
      status: "In Stock"
    },
    {
      id: "P007",
      name: "Chocolate Croissant",
      category: "Pastries",
      sku: "PT-CHC-007",
      currentStock: 2,
      minimumStock: 12,
      unitPrice: 2.99,
      supplier: "Bakery Fresh",
      lastUpdated: "2024-01-16",
      status: "Low Stock"
    },
    {
      id: "P008",
      name: "Blueberry Muffin",
      category: "Pastries",
      sku: "PT-BLM-008",
      currentStock: 18,
      minimumStock: 15,
      unitPrice: 3.49,
      supplier: "Bakery Fresh",
      lastUpdated: "2024-01-15",
      status: "In Stock"
    },
    {
      id: "P009",
      name: "Earl Grey Tea",
      category: "Tea",
      sku: "T-EG-009",
      currentStock: 30,
      minimumStock: 10,
      unitPrice: 12.99,
      supplier: "Tea Gardens",
      lastUpdated: "2024-01-12",
      status: "In Stock"
    },
    {
      id: "P010",
      name: "Green Tea",
      category: "Tea",
      sku: "T-GT-010",
      currentStock: 22,
      minimumStock: 10,
      unitPrice: 11.99,
      supplier: "Tea Gardens",
      lastUpdated: "2024-01-11",
      status: "In Stock"
    }
  ];

  const categories = ["all", "Coffee Beans", "Dairy", "Syrups", "Pastries", "Tea"];
  const statuses = ["all", "In Stock", "Low Stock", "Out of Stock"];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || product.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "default";
      case "Low Stock":
        return "destructive";
      case "Out of Stock":
        return "outline";
      default:
        return "secondary";
    }
  };

  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.status === "Low Stock").length;
  const outOfStockCount = products.filter(p => p.status === "Out of Stock").length;
  const totalValue = products.reduce((sum, product) => sum + (product.currentStock * product.unitPrice), 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Products Overview</h1>
        <p className="text-muted-foreground">Manage all products in your inventory</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-muted-foreground">Total Products</p>
              <p className="text-2xl font-semibold">{totalProducts}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-muted-foreground">Low Stock</p>
              <p className="text-2xl font-semibold text-orange-500">{lowStockCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-muted-foreground">Out of Stock</p>
              <p className="text-2xl font-semibold text-red-500">{outOfStockCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-muted-foreground">Total Value</p>
              <p className="text-2xl font-semibold">${totalValue.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products by name, SKU, or supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === "all" ? "All Statuses" : status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </Card>

      {/* Products Table */}
      <Card>
        <div className="p-4 border-b">
          <h3>Products ({filteredProducts.length})</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Min Stock</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.currentStock}</TableCell>
                <TableCell>{product.minimumStock}</TableCell>
                <TableCell>${product.unitPrice}</TableCell>
                <TableCell>${(product.currentStock * product.unitPrice).toFixed(2)}</TableCell>
                <TableCell>{product.supplier}</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(product.status)}>
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell>{product.lastUpdated}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}