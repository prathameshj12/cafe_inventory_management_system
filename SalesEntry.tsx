import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ShoppingCart, Plus, Minus, X, DollarSign, Receipt } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  currentStock: number;
  unit: string;
  category: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

interface Sale {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  timestamp: string;
  customerName?: string;
}

export function SalesEntry() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [customerName, setCustomerName] = useState("");

  const products: Product[] = [
    { id: "1", name: "Espresso", price: 3.50, currentStock: 100, unit: "cups", category: "Coffee" },
    { id: "2", name: "Cappuccino", price: 4.25, currentStock: 100, unit: "cups", category: "Coffee" },
    { id: "3", name: "Americano", price: 3.75, currentStock: 100, unit: "cups", category: "Coffee" },
    { id: "4", name: "Latte", price: 4.50, currentStock: 100, unit: "cups", category: "Coffee" },
    { id: "5", name: "Chocolate Croissant", price: 3.50, currentStock: 12, unit: "pieces", category: "Pastries" },
    { id: "6", name: "Blueberry Muffin", price: 2.75, currentStock: 8, unit: "pieces", category: "Pastries" },
    { id: "7", name: "Green Tea", price: 2.95, currentStock: 50, unit: "cups", category: "Tea" }
  ];

  const recentSales: Sale[] = [
    {
      id: "1",
      items: [
        { product: products[0], quantity: 2, subtotal: 7.00 },
        { product: products[4], quantity: 1, subtotal: 3.50 }
      ],
      total: 10.50,
      paymentMethod: "card",
      timestamp: "2025-01-21 14:30",
      customerName: "John Doe"
    },
    {
      id: "2", 
      items: [
        { product: products[1], quantity: 1, subtotal: 4.25 }
      ],
      total: 4.25,
      paymentMethod: "cash",
      timestamp: "2025-01-21 14:15"
    }
  ];

  const addToCart = () => {
    if (!selectedProductId || !quantity) return;
    
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    const qty = Number(quantity);
    const subtotal = product.price * qty;

    const existingItem = cart.find(item => item.product.id === selectedProductId);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.product.id === selectedProductId
          ? { ...item, quantity: item.quantity + qty, subtotal: item.subtotal + subtotal }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: qty, subtotal }]);
    }

    setSelectedProductId("");
    setQuantity("1");
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(cart.map(item =>
      item.product.id === productId
        ? { ...item, quantity: newQuantity, subtotal: item.product.price * newQuantity }
        : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const processSale = () => {
    if (cart.length === 0) return;

    // Here you would typically save the sale and update inventory
    console.log("Processing sale:", {
      items: cart,
      total,
      paymentMethod,
      customerName: customerName || undefined,
      timestamp: new Date().toISOString()
    });

    // Clear the cart
    setCart([]);
    setCustomerName("");
    setPaymentMethod("cash");
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Sales Entry</h1>
        <p className="text-muted-foreground">Record new sales transactions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="h-5 w-5" />
              <h2>Add Items</h2>
            </div>

            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <Label htmlFor="product">Product</Label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - ${product.price.toFixed(2)} ({product.currentStock} available)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-24">
                <Label htmlFor="quantity">Qty</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={addToCart}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4">Current Cart</h2>
            
            {cart.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Cart is empty</p>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${item.subtotal.toFixed(2)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5" />
              <h2>Payment</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="customer">Customer Name (Optional)</Label>
                <Input
                  id="customer"
                  placeholder="Enter customer name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="payment">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="digital">Digital Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-2">
                  <span>Subtotal:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Tax (8.5%):</span>
                  <span>${(total * 0.085).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center font-semibold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>${(total * 1.085).toFixed(2)}</span>
                </div>
              </div>

              <Button 
                onClick={processSale}
                disabled={cart.length === 0}
                className="w-full"
              >
                <Receipt className="h-4 w-4 mr-2" />
                Process Sale
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4">Recent Sales</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recentSales.map((sale) => (
                <div key={sale.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-sm">${sale.total.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{sale.timestamp}</p>
                    </div>
                    <Badge variant="outline">{sale.paymentMethod}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {sale.items.length} item(s)
                    {sale.customerName && ` • ${sale.customerName}`}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}