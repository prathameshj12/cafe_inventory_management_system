import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, TrendingDown, Package, DollarSign, ShoppingBag, Percent, Download } from "lucide-react";

interface CategoryData {
  name: string;
  revenue: number;
  quantity: number;
  products: number;
  growth: number;
  margin: number;
  marketShare: number;
}

interface ProductInCategory {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  growth: number;
}

export function TopCategories() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock category data
  const categoryData: CategoryData[] = [
    {
      name: "Coffee Beans",
      revenue: 15678.50,
      quantity: 892,
      products: 12,
      growth: 15.2,
      margin: 45.8,
      marketShare: 65.2
    },
    {
      name: "Beverages",
      revenue: 8934.75,
      quantity: 1456,
      products: 8,
      growth: 8.7,
      margin: 78.5,
      marketShare: 18.9
    },
    {
      name: "Pastries",
      revenue: 3245.80,
      quantity: 567,
      products: 15,
      growth: -2.1,
      margin: 65.2,
      marketShare: 8.7
    },
    {
      name: "Syrups",
      revenue: 2156.90,
      quantity: 234,
      products: 6,
      growth: 12.4,
      margin: 72.1,
      marketShare: 4.5
    },
    {
      name: "Tea",
      revenue: 1890.45,
      quantity: 123,
      products: 9,
      growth: 6.8,
      margin: 58.9,
      marketShare: 2.7
    }
  ];

  // Mock trend data for categories over time
  const trendData = [
    { month: "Aug", "Coffee Beans": 14200, "Beverages": 8100, "Pastries": 3400, "Syrups": 1980, "Tea": 1750 },
    { month: "Sep", "Coffee Beans": 14800, "Beverages": 8300, "Pastries": 3300, "Syrups": 2050, "Tea": 1820 },
    { month: "Oct", "Coffee Beans": 15100, "Beverages": 8500, "Pastries": 3350, "Syrups": 2100, "Tea": 1850 },
    { month: "Nov", "Coffee Beans": 15400, "Beverages": 8700, "Pastries": 3250, "Syrups": 2120, "Tea": 1870 },
    { month: "Dec", "Coffee Beans": 15200, "Beverages": 8800, "Pastries": 3200, "Syrups": 2080, "Tea": 1880 },
    { month: "Jan", "Coffee Beans": 15678, "Beverages": 8935, "Pastries": 3246, "Syrups": 2157, "Tea": 1890 }
  ];

  // Mock products within categories
  const categoryProducts: Record<string, ProductInCategory[]> = {
    "Coffee Beans": [
      { id: "P001", name: "Arabica Premium Blend", sales: 156, revenue: 3899.44, growth: 18.5 },
      { id: "P002", name: "Espresso Blend", sales: 234, revenue: 5265.00, growth: 12.3 },
      { id: "P003", name: "Colombian Single Origin", sales: 189, revenue: 4234.55, growth: 8.9 },
      { id: "P004", name: "French Roast", sales: 145, revenue: 2987.65, growth: 15.7 }
    ],
    "Beverages": [
      { id: "P005", name: "Cappuccino", sales: 445, revenue: 2224.50, growth: 10.2 },
      { id: "P006", name: "Latte", sales: 389, revenue: 2140.45, growth: 8.7 },
      { id: "P007", name: "Americano", sales: 298, revenue: 1492.50, growth: 6.8 },
      { id: "P008", name: "Mocha", sales: 234, revenue: 1756.80, growth: 12.1 }
    ],
    "Pastries": [
      { id: "P009", name: "Chocolate Croissant", sales: 167, revenue: 798.33, growth: -5.2 },
      { id: "P010", name: "Blueberry Muffin", sales: 198, revenue: 691.02, growth: 2.3 },
      { id: "P011", name: "Cinnamon Roll", sales: 145, revenue: 579.80, growth: -8.1 },
      { id: "P012", name: "Danish Pastry", sales: 57, revenue: 285.75, growth: 1.5 }
    ]
  };

  const periods = [
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" }
  ];

  const categories = ["all", ...categoryData.map(cat => cat.name)];

  const totalRevenue = categoryData.reduce((sum, cat) => sum + cat.revenue, 0);
  const topCategory = categoryData[0];
  const avgGrowth = categoryData.reduce((sum, cat) => sum + cat.growth, 0) / categoryData.length;
  const totalProducts = categoryData.reduce((sum, cat) => sum + cat.products, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const pieChartData = categoryData.map((cat, index) => ({
    name: cat.name,
    value: cat.revenue,
    color: ['#8B4513', '#D2691E', '#CD853F', '#DEB887', '#F4A460'][index]
  }));

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
            <TrendingUp className="h-6 w-6 text-blue-500" />
            Top Categories
          </h1>
          <p className="text-muted-foreground">Category performance analysis and trending insights</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periods.map((period) => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-muted-foreground">Top Category</p>
              <p className="text-xl font-semibold">{topCategory.name}</p>
              <p className="text-sm text-green-600">{formatPercentage(topCategory.growth)}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-muted-foreground">Total Revenue</p>
              <p className="text-xl font-semibold">{formatCurrency(totalRevenue)}</p>
              <p className="text-sm text-muted-foreground">All categories</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Percent className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-muted-foreground">Avg Growth</p>
              <p className="text-xl font-semibold">{formatPercentage(avgGrowth)}</p>
              <p className="text-sm text-muted-foreground">Across categories</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-muted-foreground">Total Products</p>
              <p className="text-xl font-semibold">{totalProducts}</p>
              <p className="text-sm text-muted-foreground">Active SKUs</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Revenue Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Revenue by Category</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => exportChartAsImage('category-revenue-chart', 'revenue-by-category')}
              className="h-9 w-9 p-0"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
          <div id="category-revenue-chart">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Revenue"]} />
                <Bar dataKey="revenue" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Market Share Pie Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Market Share Distribution</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => exportChartAsImage('market-share-chart', 'market-share-distribution')}
              className="h-9 w-9 p-0"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
          <div id="market-share-chart">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Revenue"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Trend Analysis */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3>6-Month Category Trends</h3>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => exportChartAsImage('category-trends-chart', '6-month-category-trends')}
              className="h-9 w-9 p-0"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const csvContent = [
                  ['Month', 'Category', 'Revenue', 'Quantity', 'Price'],
                  ...trendData.flatMap(month => 
                    Object.entries(month).filter(([key]) => key !== 'month').map(([category, revenue]) => [
                      month.month, category, revenue, Math.floor(Number(revenue) / 50), 50
                    ])
                  )
                ].map(row => row.join(',')).join('\n');
                
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'category-trends-report.csv';
                link.click();
                window.URL.revokeObjectURL(url);
              }}
              className="h-9 w-9 p-0"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div id="category-trends-chart">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(Number(value)), ""]} />
              <Line type="monotone" dataKey="Coffee Beans" stroke="#8B4513" strokeWidth={2} />
              <Line type="monotone" dataKey="Beverages" stroke="#D2691E" strokeWidth={2} />
              <Line type="monotone" dataKey="Pastries" stroke="#CD853F" strokeWidth={2} />
              <Line type="monotone" dataKey="Syrups" stroke="#DEB887" strokeWidth={2} />
              <Line type="monotone" dataKey="Tea" stroke="#F4A460" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Category Performance Table */}
      <Card>
        <div className="p-4 border-b">
          <h3>Category Performance Details</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Quantity Sold</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Growth</TableHead>
              <TableHead>Margin</TableHead>
              <TableHead>Market Share</TableHead>
              <TableHead>Performance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoryData.map((category) => (
              <TableRow key={category.name}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="font-medium">{formatCurrency(category.revenue)}</TableCell>
                <TableCell>{category.quantity.toLocaleString()}</TableCell>
                <TableCell>{category.products}</TableCell>
                <TableCell>
                  <div className={`flex items-center gap-1 ${category.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {category.growth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {formatPercentage(category.growth)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={category.margin > 60 ? "default" : category.margin > 40 ? "secondary" : "outline"}>
                    {category.margin.toFixed(1)}%
                  </Badge>
                </TableCell>
                <TableCell>{category.marketShare.toFixed(1)}%</TableCell>
                <TableCell>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${category.marketShare}%` }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Top Products in Selected Category */}
      {selectedCategory !== "all" && categoryProducts[selectedCategory] && (
        <Card>
          <div className="p-4 border-b">
            <h3>Top Products in {selectedCategory}</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Sales Volume</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Growth</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryProducts[selectedCategory]
                .sort((a, b) => b.revenue - a.revenue)
                .map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sales}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(product.revenue)}</TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-1 ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.growth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {formatPercentage(product.growth)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ 
                            width: `${Math.min((product.revenue / Math.max(...categoryProducts[selectedCategory].map(p => p.revenue))) * 100, 100)}%` 
                          }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}