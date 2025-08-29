import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Textarea } from "./ui/textarea";
import { Plus, Minus, Package, Search, Filter } from "lucide-react";

interface StockTransaction {
  id: string;
  productName: string;
  type: "add" | "deduct";
  quantity: number;
  unit: string;
  reason: string;
  timestamp: string;
  user: string;
}

interface Product {
  id: string;
  name: string;
  currentStock: number;
  unit: string;
  category: string;
}

export function StockManagement() {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [transactionType, setTransactionType] = useState<"add" | "deduct">("add");
  const [searchTerm, setSearchTerm] = useState("");

  const products: Product[] = [
    { id: "1", name: "Arabica Premium Blend", currentStock: 5, unit: "kg", category: "Coffee Beans" },
    { id: "2", name: "Espresso Roast", currentStock: 25, unit: "kg", category: "Coffee Beans" },
    { id: "3", name: "Oat Milk", currentStock: 8, unit: "L", category: "Dairy" },
    { id: "4", name: "Vanilla Syrup", currentStock: 3, unit: "bottles", category: "Syrups" },
    { id: "5", name: "Chocolate Croissant", currentStock: 2, unit: "pieces", category: "Pastries" }
  ];

  const transactions: StockTransaction[] = [
    {
      id: "1",
      productName: "Arabica Premium Blend",
      type: "add",
      quantity: 10,
      unit: "kg",
      reason: "New delivery from Premium Coffee Co.",
      timestamp: "2025-01-21 14:30",
      user: "Admin"
    },
    {
      id: "2",
      productName: "Oat Milk",
      type: "deduct",
      quantity: 2,
      unit: "L",
      reason: "Expired stock removal",
      timestamp: "2025-01-21 09:15",
      user: "Manager"
    },
    {
      id: "3",
      productName: "Vanilla Syrup",
      type: "add",
      quantity: 5,
      unit: "bottles",
      reason: "Emergency restock",
      timestamp: "2025-01-20 16:45",
      user: "Staff"
    }
  ];

  const selectedProductData = products.find(p => p.id === selectedProduct);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !quantity || !reason) return;
    
    // Here you would typically save the transaction
    console.log("Stock transaction:", {
      productId: selectedProduct,
      type: transactionType,
      quantity: Number(quantity),
      reason
    });
    
    // Reset form
    setSelectedProduct("");
    setQuantity("");
    setReason("");
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Stock Management</h1>
        <p className="text-muted-foreground">Add or deduct inventory stock</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5" />
            <h2>Stock Transaction</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant={transactionType === "add" ? "default" : "outline"}
                onClick={() => setTransactionType("add")}
                className="justify-start"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Stock
              </Button>
              <Button
                type="button"
                variant={transactionType === "deduct" ? "destructive" : "outline"}
                onClick={() => setTransactionType("deduct")}
                className="justify-start"
              >
                <Minus className="h-4 w-4 mr-2" />
                Deduct Stock
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} (Current: {product.currentStock} {product.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProductData && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Current Stock</p>
                <p className="text-lg">{selectedProductData.currentStock} {selectedProductData.unit}</p>
                <p className="text-xs text-muted-foreground">{selectedProductData.category}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="0.1"
                step="0.1"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for stock adjustment"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              {transactionType === "add" ? "Add Stock" : "Deduct Stock"}
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4">Recent Transactions</h2>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredTransactions.map(transaction => (
              <div key={transaction.id} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-sm">{transaction.productName}</p>
                    <p className="text-xs text-muted-foreground">{transaction.timestamp}</p>
                  </div>
                  <Badge variant={transaction.type === "add" ? "default" : "destructive"}>
                    {transaction.type === "add" ? "+" : "-"}{transaction.quantity} {transaction.unit}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{transaction.reason}</p>
                <p className="text-xs text-muted-foreground">By: {transaction.user}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="mb-4">Transaction History</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>User</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map(transaction => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.timestamp}</TableCell>
                <TableCell className="font-medium">{transaction.productName}</TableCell>
                <TableCell>
                  <Badge variant={transaction.type === "add" ? "default" : "destructive"}>
                    {transaction.type === "add" ? "Add" : "Deduct"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {transaction.type === "add" ? "+" : "-"}{transaction.quantity} {transaction.unit}
                </TableCell>
                <TableCell>{transaction.reason}</TableCell>
                <TableCell>{transaction.user}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}