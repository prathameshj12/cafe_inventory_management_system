import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { DollarSign, TrendingUp, TrendingDown, ShoppingBag, Calendar, Package, Users, Clock, Download } from "lucide-react";

interface SalesData {
  date: string;
  amount: number;
  transactions: number;
  averageOrder: number;
}

interface ProductSales {
  id: string;
  name: string;
  category: string;
  quantitySold: number;
  revenue: number;
  unitPrice: number;
  margin: number;
}

interface DailySales {
  day: string;
  sales: number;
  orders: number;
}

export function MonthlySales() {
  const [selectedMonth, setSelectedMonth] = useState("2024-01");
  const [viewMode, setViewMode] = useState<"overview" | "products" | "trends">("overview");

  // Mock monthly data
  const monthlyData: SalesData[] = [
    { date: "2024-01", amount: 24567, transactions: 1234, averageOrder: 19.91 },
    { date: "2023-12", amount: 22890, transactions: 1156, averageOrder: 19.80 },
    { date: "2023-11", amount: 26543, transactions: 1345, averageOrder: 19.74 },
    { date: "2023-10", amount: 23456, transactions: 1189, averageOrder: 19.73 },
    { date: "2023-09", amount: 25123, transactions: 1278, averageOrder: 19.65 },
    { date: "2023-08", amount: 27890, transactions: 1423, averageOrder: 19.61 }
  ];

  // Mock daily data for current month
  const dailySalesData: DailySales[] = [
    { day: "Jan 1", sales: 890, orders: 45 },
    { day: "Jan 2", sales: 1234, orders: 62 },
    { day: "Jan 3", sales: 1567, orders: 78 },
    { day: "Jan 4", sales: 1890, orders: 95 },
    { day: "Jan 5", sales: 2123, orders: 107 },
    { day: "Jan 6", sales: 1789, orders: 89 },
    { day: "Jan 7", sales: 2234, orders: 112 },
    { day: "Jan 8", sales: 1654, orders: 83 },
    { day: "Jan 9", sales: 1987, orders: 99 },
    { day: "Jan 10", sales: 2345, orders: 118 },
    { day: "Jan 11", sales: 2567, orders: 129 },
    { day: "Jan 12", sales: 1876, orders: 94 },
    { day: "Jan 13", sales: 2123, orders: 106 },
    { day: "Jan 14", sales: 1789, orders: 90 },
    { day: "Jan 15", sales: 2456, orders: 123 }
  ];

  // Mock product sales data
  const productSalesData: ProductSales[] = [
    {
      id: "P001",
      name: "Arabica Premium Blend",
      category: "Coffee Beans",
      quantitySold: 156,
      revenue: 3899.44,
      unitPrice: 24.99,
      margin: 45.2
    },
    {
      id: "P002",
      name: "Espresso Blend",
      category: "Coffee Beans",
      quantitySold: 234,
      revenue: 5265.00,
      unitPrice: 22.50,
      margin: 42.8
    },
    {
      id: "P003",
      name: "Cappuccino",
      category: "Beverages",
      quantitySold: 445,
      revenue: 2224.50,
      unitPrice: 4.99,
      margin: 78.5
    },
    {
      id: "P004",
      name: "Latte",
      category: "Beverages",
      quantitySold: 389,
      revenue: 2140.45,
      unitPrice: 5.50,
      margin: 76.2
    },
    {
      id: "P005",
      name: "Chocolate Croissant",
      category: "Pastries",
      quantitySold: 267,
      revenue: 798.33,
      unitPrice: 2.99,
      margin: 65.5
    },
    {
      id: "P006",
      name: "Blueberry Muffin",
      category: "Pastries",
      quantitySold: 198,
      revenue: 691.02,
      unitPrice: 3.49,
      margin: 68.8
    },
    {
      id: "P007",
      name: "Vanilla Syrup",
      category: "Syrups",
      quantitySold: 89,
      revenue: 800.11,
      unitPrice: 8.99,
      margin: 72.1
    },
    {
      id: "P008",
      name: "Earl Grey Tea",
      category: "Tea",
      quantitySold: 67,
      revenue: 870.33,
      unitPrice: 12.99,
      margin: 58.2
    }
  ];

  // Category breakdown for pie chart
  const categoryData = [
    { name: "Coffee Beans", value: 9164.44, color: "#8B4513" },
    { name: "Beverages", value: 4364.95, color: "#D2691E" },
    { name: "Pastries", value: 1489.35, color: "#CD853F" },
    { name: "Syrups", value: 800.11, color: "#DEB887" },
    { name: "Tea", value: 870.33, color: "#F4A460" }
  ];

  const currentMonthData = monthlyData.find(m => m.date === selectedMonth) || monthlyData[0];
  const previousMonthData = monthlyData[1];
  
  const monthlyGrowth = ((currentMonthData.amount - previousMonthData.amount) / previousMonthData.amount * 100);
  const transactionGrowth = ((currentMonthData.transactions - previousMonthData.transactions) / previousMonthData.transactions * 100);

  const months = [
    { value: "2024-01", label: "January 2024" },
    { value: "2023-12", label: "December 2023" },
    { value: "2023-11", label: "November 2023" },
    { value: "2023-10", label: "October 2023" },
    { value: "2023-09", label: "September 2023" },
    { value: "2023-08", label: "August 2023" }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const exportChartAsImage = async (chartId: string, filename: string) => {
    const html2canvas = (await import('html2canvas')).default;
    const chartElement = document.getElementById(chartId);
    
    if (chartElement) {
      const canvas = await html2canvas(chartElement, {
        backgroundColor: '#ffffff',
        scale: 2
      });
      
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-green-500" />
            Monthly Sales
          </h1>
          <p className="text-muted-foreground">Detailed sales analysis and performance metrics</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="products">Products</SelectItem>
              <SelectItem value="trends">Trends</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-semibold">{formatCurrency(currentMonthData.amount)}</p>
              <p className={`text-sm flex items-center gap-1 ${monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {monthlyGrowth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {formatPercentage(monthlyGrowth)}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-semibold">{currentMonthData.transactions.toLocaleString()}</p>
              <p className={`text-sm flex items-center gap-1 ${transactionGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {transactionGrowth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {formatPercentage(transactionGrowth)}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-muted-foreground">Avg Order Value</p>
              <p className="text-2xl font-semibold">{formatCurrency(currentMonthData.averageOrder)}</p>
              <p className="text-sm text-green-600">+0.6%</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-muted-foreground">Daily Average</p>
              <p className="text-2xl font-semibold">{formatCurrency(currentMonthData.amount / 31)}</p>
              <p className="text-sm text-muted-foreground">Per day</p>
            </div>
          </div>
        </Card>
      </div>

      {viewMode === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Sales Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3>Daily Sales Trend</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => exportChartAsImage('daily-sales-chart', 'daily-sales-trend')}
                className="h-9 w-9 p-0"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div id="daily-sales-chart">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailySalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Sales"]} />
                  <Line type="monotone" dataKey="sales" stroke="#22c55e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Category Breakdown */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3>Sales by Category</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => exportChartAsImage('category-breakdown-chart', 'sales-by-category')}
                className="h-9 w-9 p-0"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div id="category-breakdown-chart">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Revenue"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {viewMode === "products" && (
        <div className="space-y-6">
          <Card>
            <div className="p-4 border-b flex items-center justify-between">
              <h3>Top Selling Products</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const csvContent = [
                    ['Date', 'Product', 'Category', 'Quantity Sold', 'Unit Price', 'Revenue'],
                    ...productSalesData.map(p => [selectedMonth, p.name, p.category, p.quantitySold, p.unitPrice, p.revenue])
                  ].map(row => row.join(',')).join('\n');
                  
                  const blob = new Blob([csvContent], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'product-sales-report.csv';
                  link.click();
                  window.URL.revokeObjectURL(url);
                }}
                className="h-9 w-9 p-0"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Qty Sold</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Margin %</TableHead>
                  <TableHead>Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productSalesData
                  .sort((a, b) => b.revenue - a.revenue)
                  .map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.quantitySold}</TableCell>
                      <TableCell>{formatCurrency(product.unitPrice)}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(product.revenue)}</TableCell>
                      <TableCell>
                        <Badge variant={product.margin > 60 ? "default" : product.margin > 40 ? "secondary" : "outline"}>
                          {product.margin.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${Math.min((product.revenue / Math.max(...productSalesData.map(p => p.revenue))) * 100, 100)}%` }}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {viewMode === "trends" && (
        <div className="space-y-6">
          {/* Monthly Comparison */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3>6-Month Revenue Trend</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => exportChartAsImage('monthly-revenue-chart', '6-month-revenue-trend')}
                className="h-9 w-9 p-0"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div id="monthly-revenue-chart">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={[...monthlyData].reverse()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Revenue"]} />
                  <Bar dataKey="amount" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Transaction Trends */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3>Transaction Volume Trends</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => exportChartAsImage('transaction-trends-chart', 'transaction-volume-trends')}
                className="h-9 w-9 p-0"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div id="transaction-trends-chart">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="transactions" stroke="#3b82f6" strokeWidth={2} name="Transactions" />
                  <Line type="monotone" dataKey="averageOrder" stroke="#f59e0b" strokeWidth={2} name="Avg Order Value" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}