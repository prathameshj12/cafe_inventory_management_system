import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { AlertTriangle, Package, TrendingUp, DollarSign } from "lucide-react";

interface DashboardProps {
  onNavigate?: (view: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const stats = [
    {
      title: "Total Products",
      value: "247",
      icon: Package,
      change: "+12%",
      view: "productsOverview"
    },
    {
      title: "Low Stock Items",
      value: "8",
      icon: AlertTriangle,
      change: "-2",
      variant: "destructive" as const,
      view: "lowStock"
    },
    {
      title: "Monthly Sales",
      value: "$24,567",
      icon: DollarSign,
      change: "+18%",
      view: "monthlySales"
    },
    {
      title: "Top Category",
      value: "Coffee Beans",
      icon: TrendingUp,
      change: "65% of sales",
      view: "topCategories"
    }
  ];

  const lowStockItems = [
    { name: "Arabica Premium Blend", current: 5, minimum: 10, category: "Coffee Beans" },
    { name: "Oat Milk", current: 8, minimum: 15, category: "Dairy" },
    { name: "Vanilla Syrup", current: 3, minimum: 8, category: "Syrups" },
    { name: "Chocolate Croissant", current: 2, minimum: 12, category: "Pastries" }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Inventory Dashboard</h1>
        <p className="text-muted-foreground">Overview of your coffee shop inventory</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card 
            key={stat.title} 
            className="p-6 cursor-pointer transition-all hover:shadow-md hover:bg-accent/50"
            onClick={() => onNavigate?.(stat.view)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className={`text-sm ${stat.variant === 'destructive' ? 'text-destructive' : 'text-green-600'}`}>
                  {stat.change}
                </p>
              </div>
              <stat.icon className="h-8 w-8 text-muted-foreground" />
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <h2>Low Stock Alerts</h2>
        </div>
        <div className="space-y-3">
          {lowStockItems.map((item) => (
            <div key={item.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.category}</p>
              </div>
              <div className="text-right">
                <Badge variant="destructive">
                  {item.current}/{item.minimum}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.minimum - item.current} needed
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}