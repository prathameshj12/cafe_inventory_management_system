import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ReportDownloader } from "./ReportDownloader";
import { Download, TrendingUp, Package, Users } from "lucide-react";

export function Reports() {
  const stockByCategory = [
    { category: "Coffee Beans", value: 45, items: 12 },
    { category: "Dairy", value: 25, items: 8 },
    { category: "Syrups", value: 18, items: 15 },
    { category: "Pastries", value: 8, items: 6 },
    { category: "Tea", value: 22, items: 9 },
    { category: "Equipment", value: 5, items: 3 }
  ];

  const monthlyConsumption = [
    { month: "Aug", consumption: 120 },
    { month: "Sep", consumption: 135 },
    { month: "Oct", consumption: 145 },
    { month: "Nov", consumption: 155 },
    { month: "Dec", consumption: 170 },
    { month: "Jan", consumption: 165 }
  ];

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

  const totalValue = stockByCategory.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Reports & Analytics</h1>
          <p className="text-muted-foreground">Insights into your inventory performance with downloadable reports</p>
        </div>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="sales">Sales Reports</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Reports</TabsTrigger>
          <TabsTrigger value="operational">Operational</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3>Stock Value by Category</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const chartElement = document.getElementById('stock-value-chart');
                    if (chartElement) {
                      import('html2canvas').then(html2canvas => {
                        html2canvas.default(chartElement, { backgroundColor: '#ffffff', scale: 2 })
                          .then(canvas => {
                            const link = document.createElement('a');
                            link.download = 'stock-value-by-category.png';
                            link.href = canvas.toDataURL();
                            link.click();
                          });
                      });
                    }
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              <div id="stock-value-chart" className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stockByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, value }) => `${category}: ${value}k`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stockByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}k`, 'Value']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3>Monthly Consumption Trend</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const chartElement = document.getElementById('consumption-trend-chart');
                    if (chartElement) {
                      import('html2canvas').then(html2canvas => {
                        html2canvas.default(chartElement, { backgroundColor: '#ffffff', scale: 2 })
                          .then(canvas => {
                            const link = document.createElement('a');
                            link.download = 'monthly-consumption-trend.png';
                            link.href = canvas.toDataURL();
                            link.click();
                          });
                      });
                    }
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              <div id="consumption-trend-chart" className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyConsumption}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value, 'Items Consumed']} />
                    <Bar dataKey="consumption" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <h4 className="text-muted-foreground">Total Inventory Value</h4>
              <p className="text-2xl font-semibold">${totalValue}k</p>
              <p className="text-sm text-green-600">+5.2% from last month</p>
            </Card>
            
            <Card className="p-6">
              <h4 className="text-muted-foreground">Items Below Minimum</h4>
              <p className="text-2xl font-semibold">8</p>
              <p className="text-sm text-destructive">Requires attention</p>
            </Card>
            
            <Card className="p-6">
              <h4 className="text-muted-foreground">Active Suppliers</h4>
              <p className="text-2xl font-semibold">4</p>
              <p className="text-sm text-muted-foreground">1 inactive</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="mb-4">Category Breakdown</h3>
            <div className="space-y-4">
              {stockByCategory.map((category, index) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span>{category.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${category.value}k</p>
                    <p className="text-sm text-muted-foreground">{category.items} items</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5" />
                <h3>Sales Reports</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Generate comprehensive sales reports for different time periods with detailed analytics.
              </p>
              <ReportDownloader reportType="sales" />
            </Card>

            <Card className="p-6">
              <h4 className="mb-4">Sample Sales Metrics</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Sales (This Month)</span>
                  <span className="font-semibold">$12,450</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Average Order Value</span>
                  <span className="font-semibold">$8.75</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Transactions</span>
                  <span className="font-semibold">1,423</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Top Selling Product</span>
                  <span className="font-semibold">Cappuccino</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5" />
                <h3>Inventory Reports</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Export current inventory data with stock levels, supplier information, and reorder alerts.
              </p>
              <ReportDownloader reportType="inventory" />
            </Card>

            <Card className="p-6">
              <h4 className="mb-4">Current Inventory Status</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Products</span>
                  <span className="font-semibold">247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Low Stock Items</span>
                  <span className="font-semibold text-destructive">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Out of Stock</span>
                  <span className="font-semibold text-destructive">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Value</span>
                  <span className="font-semibold">${totalValue}k</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operational" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5" />
                <h3>Supplier Reports</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Generate reports on supplier performance, contact information, and order history.
              </p>
              <ReportDownloader reportType="suppliers" />
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5" />
                <h3>User Management Reports</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Export user data including roles, permissions, and activity logs (Admin only).
              </p>
              <ReportDownloader reportType="users" />
            </Card>
          </div>

          <Card className="p-6">
            <h4 className="mb-4">Operational Metrics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Active Suppliers</p>
                <p className="text-xl font-semibold">4</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Pending Orders</p>
                <p className="text-xl font-semibold">12</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-xl font-semibold">6</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Last Backup</p>
                <p className="text-xl font-semibold">Today</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}