import { useState } from "react";
import { Login } from "./components/Login";
import { UserSwitcher } from "./components/UserSwitcher";
import { Header } from "./components/Header";
import { AppSidebar } from "./components/AppSidebar";
import { Dashboard } from "./components/Dashboard";
import { InventoryTable } from "./components/InventoryTable";
import { StockManagement } from "./components/StockManagement";
import { SalesEntry } from "./components/SalesEntry";
import { Suppliers } from "./components/Suppliers";
import { Reports } from "./components/Reports";
import { UserManagement } from "./components/UserManagement";
import { ProductsOverview } from "./components/ProductsOverview";
import { LowStock } from "./components/LowStock";
import { MonthlySales } from "./components/MonthlySales";
import { TopCategories } from "./components/TopCategories";
import { Settings } from "./components/Settings";
import { ROLES, hasPermission, PERMISSIONS } from "./utils/permissions";
import { Toaster } from "./components/ui/sonner";

interface User {
  username: string;
  role: string;
  fullName: string;
  email: string;
}

type AppState = "login" | "userSwitch" | "authenticated";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState("dashboard");
  const [appState, setAppState] = useState<AppState>("login");

  const handleLogin = (userData: User) => {
    setUser(userData);
    setAppState("authenticated");
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView("dashboard");
    setAppState("login");
  };

  const handleUserSwitch = () => {
    setAppState("userSwitch");
  };

  const handleUserSelect = (userData: User) => {
    setUser(userData);
    setAppState("authenticated");
  };

  const handleBackToApp = () => {
    setAppState("authenticated");
  };

  const handleNewLogin = () => {
    setAppState("login");
  };

  const handleSettings = () => {
    setCurrentView("settings");
    setAppState("authenticated");
  };

  const handleViewChange = (view: string) => {
    // Additional permission check for sensitive modules
    if (view === 'users' && user?.role !== 'Admin') {
      alert('Access denied. Admin privileges required.');
      return;
    }
    setCurrentView(view);
  };

  const renderCurrentView = () => {
    if (!user) return null;

    switch (currentView) {
      case "dashboard":
        return <Dashboard onNavigate={handleViewChange} />;
      case "inventory":
        if (!hasPermission(user.role, PERMISSIONS.INVENTORY.VIEW)) {
          return <div className="p-6"><h1>Access Denied</h1><p>You don't have permission to view inventory.</p></div>;
        }
        return <InventoryTable />;
      case "stock":
        if (!hasPermission(user.role, PERMISSIONS.STOCK.VIEW)) {
          return <div className="p-6"><h1>Access Denied</h1><p>You don't have permission to manage stock.</p></div>;
        }
        return <StockManagement />;
      case "sales":
        if (!hasPermission(user.role, PERMISSIONS.SALES.VIEW)) {
          return <div className="p-6"><h1>Access Denied</h1><p>You don't have permission to access sales.</p></div>;
        }
        return <SalesEntry />;
      case "suppliers":
        if (!hasPermission(user.role, PERMISSIONS.SUPPLIERS.VIEW)) {
          return <div className="p-6"><h1>Access Denied</h1><p>You don't have permission to view suppliers.</p></div>;
        }
        return <Suppliers />;
      case "reports":
        if (!hasPermission(user.role, PERMISSIONS.REPORTS.VIEW)) {
          return <div className="p-6"><h1>Access Denied</h1><p>You don't have permission to view reports.</p></div>;
        }
        return <Reports />;
      case "users":
        if (!hasPermission(user.role, PERMISSIONS.USER_MANAGEMENT.VIEW)) {
          return <div className="p-6"><h1>Access Denied</h1><p>You don't have permission to manage users.</p></div>;
        }
        return <UserManagement />;
      case "productsOverview":
        if (!hasPermission(user.role, PERMISSIONS.INVENTORY.VIEW)) {
          return <div className="p-6"><h1>Access Denied</h1><p>You don't have permission to view inventory.</p></div>;
        }
        return <ProductsOverview />;
      case "lowStock":
        if (!hasPermission(user.role, PERMISSIONS.INVENTORY.VIEW)) {
          return <div className="p-6"><h1>Access Denied</h1><p>You don't have permission to view inventory.</p></div>;
        }
        return <LowStock />;
      case "monthlySales":
        if (!hasPermission(user.role, PERMISSIONS.SALES.VIEW)) {
          return <div className="p-6"><h1>Access Denied</h1><p>You don't have permission to view sales.</p></div>;
        }
        return <MonthlySales />;
      case "topCategories":
        if (!hasPermission(user.role, PERMISSIONS.REPORTS.VIEW)) {
          return <div className="p-6"><h1>Access Denied</h1><p>You don't have permission to view reports.</p></div>;
        }
        return <TopCategories />;
      case "settings":
        return <Settings user={user} />;
      default:
        return <Dashboard onNavigate={handleViewChange} />;
    }
  };

  // Show login screen
  if (appState === "login") {
    return <Login onLogin={handleLogin} />;
  }

  // Show user switcher
  if (appState === "userSwitch" && user) {
    return (
      <UserSwitcher
        currentUser={user}
        onUserSelect={handleUserSelect}
        onBack={handleBackToApp}
        onNewLogin={handleNewLogin}
      />
    );
  }

  // Show authenticated app
  if (appState === "authenticated" && user) {
    return (
      <>
        <div className="flex h-screen bg-background">
          <AppSidebar 
            currentView={currentView} 
            onViewChange={handleViewChange}
            onLogout={handleLogout}
            user={user}
          />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header 
              user={user}
              onLogout={handleLogout}
              onUserSwitch={handleUserSwitch}
              onSettings={handleSettings}
            />
            <main className="flex-1 overflow-auto">
              {renderCurrentView()}
            </main>
          </div>
        </div>
        <Toaster />
      </>
    );
  }

  // Fallback to login
  return <Login onLogin={handleLogin} />;
}