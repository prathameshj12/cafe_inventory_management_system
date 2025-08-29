import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Coffee, Eye, EyeOff, User, Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface User {
  username: string;
  role: string;
  fullName: string;
  email: string;
}

interface LoginProps {
  onLogin: (user: User) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetLoading, setIsResetLoading] = useState(false);

  // Demo users with credentials
  const demoUsers: (User & { password: string })[] = [
    {
      username: "admin",
      password: "admin123",
      role: "Admin",
      fullName: "John Administrator",
      email: "admin@coffeeshop.com"
    },
    {
      username: "manager",
      password: "manager123",
      role: "Manager",
      fullName: "Sarah Manager",
      email: "sarah.m@coffeeshop.com"
    },
    {
      username: "staff",
      password: "staff123",
      role: "Staff",
      fullName: "Mike Wilson",
      email: "mike.w@coffeeshop.com"
    },
    {
      username: "cashier",
      password: "cashier123",
      role: "Cashier",
      fullName: "Alex Parker",
      email: "alex.p@coffeeshop.com"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login delay
    setTimeout(() => {
      const user = demoUsers.find(
        u => u.username === credentials.username && u.password === credentials.password
      );

      if (user) {
        const { password, ...userWithoutPassword } = user;
        onLogin(userWithoutPassword);
      } else {
        alert("Invalid credentials. Check the demo credentials below.");
      }
      setIsLoading(false);
    }, 1000);
  };

  const quickLogin = (user: User & { password: string }) => {
    setIsLoading(true);
    setTimeout(() => {
      const { password, ...userWithoutPassword } = user;
      onLogin(userWithoutPassword);
      setIsLoading(false);
    }, 500);
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "destructive";
      case "manager":
        return "default";
      case "staff":
        return "secondary";
      case "cashier":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleDescription = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "Full system access & user management";
      case "manager":
        return "Inventory, suppliers & reports management";
      case "staff":
        return "Inventory updates & sales entry";
      case "cashier":
        return "Sales entry & basic inventory view";
      default:
        return "Limited access";
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetLoading(true);

    // Simulate password reset
    setTimeout(() => {
      const user = demoUsers.find(u => u.email === resetEmail);
      if (user) {
        toast.success(`Password reset instructions sent to ${resetEmail}`);
        setResetEmail("");
        setIsResetDialogOpen(false);
      } else {
        toast.error("Email address not found in our system");
      }
      setIsResetLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Coffee className="h-8 w-8 text-amber-600" />
            <h1 className="text-2xl font-semibold">CoffeeStock</h1>
          </div>
          <p className="text-muted-foreground">Inventory Management System</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="demo">Demo Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({
                    ...prev,
                    username: e.target.value
                  }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({
                      ...prev,
                      password: e.target.value
                    }))}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              
              <div className="text-center">
                <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="link" className="text-sm">
                      Forgot your password?
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Reset Password
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handlePasswordReset} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="resetEmail">Email Address</Label>
                        <Input
                          id="resetEmail"
                          type="email"
                          placeholder="Enter your email address"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          required
                        />
                        <p className="text-sm text-muted-foreground">
                          We'll send password reset instructions to this email address.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Demo Email Addresses:</p>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          {demoUsers.map(user => (
                            <div key={user.email}>
                              <span className="font-mono">{user.email}</span> - {user.role}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsResetDialogOpen(false)}
                          className="flex-1"
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to Login
                        </Button>
                        <Button type="submit" disabled={isResetLoading} className="flex-1">
                          {isResetLoading ? "Sending..." : "Send Reset Link"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="demo" className="space-y-3">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground">Quick login with demo accounts</p>
            </div>
            
            {demoUsers.map((user) => (
              <Card 
                key={user.username} 
                className="p-3 cursor-pointer transition-all hover:shadow-md hover:bg-accent/50"
                onClick={() => quickLogin(user)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center bg-primary text-primary-foreground text-sm font-medium rounded-full">
                    {getInitials(user.fullName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{user.fullName}</p>
                      <Badge variant={getRoleColor(user.role)} className="text-xs">
                        {user.role}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{getRoleDescription(user.role)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {user.username} / {user.password}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-xs text-muted-foreground">
            Coffee Shop Inventory Management v1.0
          </p>
        </div>
      </Card>
    </div>
  );
}