import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { AlertTriangle, ShoppingCart, Package, Truck, CheckCircle, Clock, Send, Plus } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface LowStockItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  currentStock: number;
  minimumStock: number;
  neededQuantity: number;
  unitPrice: number;
  supplier: string;
  supplierEmail: string;
  supplierPhone: string;
  lastOrderDate?: string;
  urgencyLevel: "High" | "Medium" | "Low";
}

interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export function LowStock() {
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const [selectedUrgency, setSelectedUrgency] = useState("all");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");

  // Mock data for low stock items
  const lowStockItems: LowStockItem[] = [
    {
      id: "P001",
      name: "Arabica Premium Blend",
      category: "Coffee Beans",
      sku: "CB-APB-001",
      currentStock: 5,
      minimumStock: 10,
      neededQuantity: 15, // Recommended order quantity
      unitPrice: 24.99,
      supplier: "Coffee World Co.",
      supplierEmail: "orders@coffeeworld.com",
      supplierPhone: "+1-555-0123",
      lastOrderDate: "2024-01-01",
      urgencyLevel: "High"
    },
    {
      id: "P003",
      name: "Whole Milk",
      category: "Dairy",
      sku: "DY-WM-003",
      currentStock: 12,
      minimumStock: 20,
      neededQuantity: 25,
      unitPrice: 3.99,
      supplier: "Fresh Dairy Ltd.",
      supplierEmail: "orders@freshdairy.com",
      supplierPhone: "+1-555-0124",
      lastOrderDate: "2024-01-10",
      urgencyLevel: "Medium"
    },
    {
      id: "P004",
      name: "Oat Milk",
      category: "Dairy",
      sku: "DY-OM-004",
      currentStock: 8,
      minimumStock: 15,
      neededQuantity: 20,
      unitPrice: 5.49,
      supplier: "Plant Based Co.",
      supplierEmail: "sales@plantbased.com",
      supplierPhone: "+1-555-0125",
      lastOrderDate: "2024-01-05",
      urgencyLevel: "High"
    },
    {
      id: "P005",
      name: "Vanilla Syrup",
      category: "Syrups",
      sku: "SY-VAN-005",
      currentStock: 3,
      minimumStock: 8,
      neededQuantity: 12,
      unitPrice: 8.99,
      supplier: "Flavor Masters",
      supplierEmail: "orders@flavormasters.com",
      supplierPhone: "+1-555-0126",
      lastOrderDate: "2023-12-20",
      urgencyLevel: "High"
    },
    {
      id: "P007",
      name: "Chocolate Croissant",
      category: "Pastries",
      sku: "PT-CHC-007",
      currentStock: 2,
      minimumStock: 12,
      neededQuantity: 20,
      unitPrice: 2.99,
      supplier: "Bakery Fresh",
      supplierEmail: "orders@bakeryfresh.com",
      supplierPhone: "+1-555-0127",
      lastOrderDate: "2024-01-14",
      urgencyLevel: "High"
    },
    {
      id: "P011",
      name: "Decaf Coffee Beans",
      category: "Coffee Beans",
      sku: "CB-DEC-011",
      currentStock: 6,
      minimumStock: 12,
      neededQuantity: 18,
      unitPrice: 21.99,
      supplier: "Coffee World Co.",
      supplierEmail: "orders@coffeeworld.com",
      supplierPhone: "+1-555-0123",
      lastOrderDate: "2024-01-08",
      urgencyLevel: "Medium"
    },
    {
      id: "P012",
      name: "Almond Milk",
      category: "Dairy",
      sku: "DY-AM-012",
      currentStock: 4,
      minimumStock: 10,
      neededQuantity: 15,
      unitPrice: 4.99,
      supplier: "Plant Based Co.",
      supplierEmail: "sales@plantbased.com",
      supplierPhone: "+1-555-0125",
      lastOrderDate: "2024-01-12",
      urgencyLevel: "Medium"
    },
    {
      id: "P013",
      name: "Hazelnut Syrup",
      category: "Syrups",
      sku: "SY-HAZ-013",
      currentStock: 2,
      minimumStock: 8,
      neededQuantity: 10,
      unitPrice: 9.99,
      supplier: "Flavor Masters",
      supplierEmail: "orders@flavormasters.com",
      supplierPhone: "+1-555-0126",
      lastOrderDate: "2023-12-28",
      urgencyLevel: "High"
    }
  ];

  const suppliers = ["all", ...Array.from(new Set(lowStockItems.map(item => item.supplier)))];
  const urgencyLevels = ["all", "High", "Medium", "Low"];

  const filteredItems = lowStockItems.filter((item) => {
    const matchesSupplier = selectedSupplier === "all" || item.supplier === selectedSupplier;
    const matchesUrgency = selectedUrgency === "all" || item.urgencyLevel === selectedUrgency;
    return matchesSupplier && matchesUrgency;
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High":
        return "destructive";
      case "Medium":
        return "default";
      case "Low":
        return "secondary";
      default:
        return "outline";
    }
  };

  const addToOrder = (item: LowStockItem, quantity?: number) => {
    const orderQuantity = quantity || item.neededQuantity;
    const existingOrderItem = orderItems.find(orderItem => orderItem.productId === item.id);
    
    if (existingOrderItem) {
      setOrderItems(orderItems.map(orderItem => 
        orderItem.productId === item.id 
          ? { ...orderItem, quantity: orderQuantity }
          : orderItem
      ));
    } else {
      setOrderItems([...orderItems, {
        productId: item.id,
        quantity: orderQuantity,
        unitPrice: item.unitPrice
      }]);
    }
    
    toast.success(`${item.name} added to order`);
  };

  const removeFromOrder = (productId: string) => {
    setOrderItems(orderItems.filter(item => item.productId !== productId));
    toast.success("Item removed from order");
  };

  const getOrderTotal = () => {
    return orderItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  const submitOrder = () => {
    if (orderItems.length === 0) {
      toast.error("Please add items to your order");
      return;
    }

    // Group items by supplier
    const ordersBySupplier: Record<string, { items: any[], supplierInfo: any }> = {};
    
    orderItems.forEach(orderItem => {
      const product = lowStockItems.find(p => p.id === orderItem.productId);
      if (product) {
        if (!ordersBySupplier[product.supplier]) {
          ordersBySupplier[product.supplier] = {
            items: [],
            supplierInfo: {
              name: product.supplier,
              email: product.supplierEmail,
              phone: product.supplierPhone
            }
          };
        }
        ordersBySupplier[product.supplier].items.push({
          ...orderItem,
          productName: product.name,
          sku: product.sku
        });
      }
    });

    // Simulate sending orders to suppliers
    Object.keys(ordersBySupplier).forEach(supplier => {
      const supplierOrder = ordersBySupplier[supplier];
      console.log(`Order sent to ${supplier}:`, supplierOrder);
    });

    toast.success(`Orders sent to ${Object.keys(ordersBySupplier).length} supplier(s)`);
    setOrderItems([]);
    setOrderNotes("");
    setIsOrderDialogOpen(false);
  };

  const totalLowStockItems = lowStockItems.length;
  const highUrgencyCount = lowStockItems.filter(item => item.urgencyLevel === "High").length;
  const totalOrderValue = getOrderTotal();
  const uniqueSuppliers = new Set(lowStockItems.map(item => item.supplier)).size;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-orange-500" />
            Low Stock Items
          </h1>
          <p className="text-muted-foreground">Items that need immediate attention and reordering</p>
        </div>
        
        <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Order Cart ({orderItems.length})
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Order</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {orderItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No items in order</p>
              ) : (
                <>
                  <div className="space-y-2">
                    {orderItems.map(orderItem => {
                      const product = lowStockItems.find(p => p.id === orderItem.productId);
                      return product ? (
                        <div key={orderItem.productId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.supplier} • ${orderItem.unitPrice} each
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>Qty: {orderItem.quantity}</span>
                            <span className="font-medium">${(orderItem.quantity * orderItem.unitPrice).toFixed(2)}</span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeFromOrder(orderItem.productId)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium">Total: ${totalOrderValue.toFixed(2)}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="orderNotes">Order Notes (Optional)</Label>
                      <Textarea
                        id="orderNotes"
                        placeholder="Add any special instructions or notes for suppliers..."
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                      />
                    </div>
                    
                    <Button 
                      onClick={submitOrder} 
                      className="w-full mt-4"
                      disabled={orderItems.length === 0}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Orders to Suppliers
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-muted-foreground">Total Low Stock</p>
              <p className="text-2xl font-semibold text-orange-500">{totalLowStockItems}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-muted-foreground">High Urgency</p>
              <p className="text-2xl font-semibold text-red-500">{highUrgencyCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Truck className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-muted-foreground">Suppliers</p>
              <p className="text-2xl font-semibold">{uniqueSuppliers}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-muted-foreground">Order Value</p>
              <p className="text-2xl font-semibold">${totalOrderValue.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((supplier) => (
                <SelectItem key={supplier} value={supplier}>
                  {supplier === "all" ? "All Suppliers" : supplier}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Urgency" />
            </SelectTrigger>
            <SelectContent>
              {urgencyLevels.map((urgency) => (
                <SelectItem key={urgency} value={urgency}>
                  {urgency === "all" ? "All Urgency Levels" : urgency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Low Stock Items Table */}
      <Card>
        <div className="p-4 border-b">
          <h3>Low Stock Items ({filteredItems.length})</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Current/Min Stock</TableHead>
              <TableHead>Needed Qty</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead>Last Order</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                <TableCell>
                  <div className="text-center">
                    <span className="text-red-600 font-medium">{item.currentStock}</span>
                    <span className="text-muted-foreground">/{item.minimumStock}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{item.neededQuantity}</Badge>
                </TableCell>
                <TableCell>${item.unitPrice}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{item.supplier}</p>
                    <p className="text-xs text-muted-foreground">{item.supplierPhone}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getUrgencyColor(item.urgencyLevel)}>
                    {item.urgencyLevel}
                  </Badge>
                </TableCell>
                <TableCell>{item.lastOrderDate || "Never"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addToOrder(item)}
                      disabled={orderItems.some(orderItem => orderItem.productId === item.id)}
                    >
                      {orderItems.some(orderItem => orderItem.productId === item.id) ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Package className="h-4 w-4" />
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