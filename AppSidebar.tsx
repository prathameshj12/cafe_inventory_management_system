import { useState } from "react";
import { Button } from "./ui/button";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  BarChart3, 
  Settings,
  Coffee,
  Menu,
  X,
  ArrowUpDown,
  ShoppingCart,
  LogOut,
  UserCog
} from "lucide-react";
import { canAccessModule } from "../utils/permissions";

interface User {
  username: string;
  role: string;
  fullName: string;
  email: string;
}

interface AppSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  user: User;
}

export function AppSidebar({ currentView, onViewChange, onLogout, user }: AppSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation = [
    { 
      id: "dashboard", 
      label: "Dashboard", 
      icon: LayoutDashboard,
      module: "dashboard"
    },
    { 
      id: "inventory", 
      label: "Product Management", 
      icon: Package,
      module: "inventory"
    },
    { 
      id: "stock", 
      label: "Stock Management", 
      icon: ArrowUpDown,
      module: "stock"
    },
    { 
      id: "sales", 
      label: "Sales Entry", 
      icon: ShoppingCart,
      module: "sales"
    },
    { 
      id: "suppliers", 
      label: "Suppliers", 
      icon: Users,
      module: "suppliers"
    },
    { 
      id: "reports", 
      label: "Reports", 
      icon: BarChart3,
      module: "reports"
    },
    { 
      id: "users", 
      label: "User Management", 
      icon: UserCog,
      module: "users",
      adminOnly: true
    },
    { 
      id: "settings", 
      label: "Settings", 
      icon: Settings,
      module: "settings"
    },
  ];

  // Filter navigation items based on user permissions
  const filteredNavigation = navigation.filter(item => {
    // If it's admin only, check if user is admin
    if (item.adminOnly && user.role !== 'Admin') {
      return false;
    }
    // Check if user has access to the module
    return canAccessModule(user.role, item.module);
  });

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
      
      <div className={`
        fixed left-0 top-0 h-full bg-card border-r z-50 transition-all duration-300 flex flex-col
        ${isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-16' : 'w-64'}
        lg:relative lg:translate-x-0
      `}>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <Coffee className="h-8 w-8 text-primary" />
                <h2 className="font-semibold">CoffeeStock</h2>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <nav className="p-4 space-y-2 flex-1">
          {filteredNavigation.map((item) => (
            <Button
              key={item.id}
              variant={currentView === item.id ? "default" : "ghost"}
              className={`w-full justify-start ${isCollapsed ? 'px-2' : ''}`}
              onClick={() => onViewChange(item.id)}
            >
              <item.icon className="h-4 w-4" />
              {!isCollapsed && (
                <span className="ml-2 flex items-center gap-2">
                  {item.label}
                  {item.adminOnly && (
                    <span className="text-xs bg-destructive text-destructive-foreground px-1 rounded">
                      ADMIN
                    </span>
                  )}
                </span>
              )}
            </Button>
          ))}
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className={`w-full justify-start text-destructive hover:text-destructive ${isCollapsed ? 'px-2' : ''}`}
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>

        {!isCollapsed && (
          <div className="p-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">Coffee Shop Pro</p>
              <p className="text-xs text-muted-foreground">Version 1.0.0</p>
              <p className="text-xs text-muted-foreground mt-1">
                User: {user.role}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu button */}
      {isCollapsed && (
        <Button
          variant="outline"
          size="sm"
          className="fixed top-4 left-4 z-50 lg:hidden"
          onClick={() => setIsCollapsed(false)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}
    </>
  );
}