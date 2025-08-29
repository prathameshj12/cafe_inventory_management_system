import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Coffee, User, Search, ArrowLeft } from "lucide-react";

interface User {
  username: string;
  role: string;
  fullName: string;
  email: string;
}

interface UserSwitcherProps {
  currentUser: User;
  onUserSelect: (user: User) => void;
  onBack: () => void;
  onNewLogin: () => void;
}

export function UserSwitcher({ currentUser, onUserSelect, onBack, onNewLogin }: UserSwitcherProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Predefined users for demo purposes
  const availableUsers: User[] = [
    {
      username: "admin",
      role: "Admin",
      fullName: "John Administrator",
      email: "admin@coffeeshop.com"
    },
    {
      username: "manager",
      role: "Manager", 
      fullName: "Sarah Manager",
      email: "sarah.m@coffeeshop.com"
    },
    {
      username: "staff1",
      role: "Staff",
      fullName: "Mike Wilson",
      email: "mike.w@coffeeshop.com"
    },
    {
      username: "staff2",
      role: "Staff",
      fullName: "Emily Johnson",
      email: "emily.j@coffeeshop.com"
    },
    {
      username: "cashier1",
      role: "Cashier",
      fullName: "Alex Parker",
      email: "alex.p@coffeeshop.com"
    },
    {
      username: "cashier2",
      role: "Cashier",
      fullName: "Lisa Chen",
      email: "lisa.c@coffeeshop.com"
    }
  ];

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

  const getRolePermissions = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "Full system access, user management, reports";
      case "manager":
        return "Inventory, suppliers, reports, staff supervision";
      case "staff":
        return "Inventory updates, sales entry, basic reports";
      case "cashier":
        return "Sales entry, basic inventory view";
      default:
        return "Limited access";
    }
  };

  const filteredUsers = availableUsers.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Coffee className="h-6 w-6 text-amber-600" />
            <h1 className="text-xl font-semibold">Switch User</h1>
          </div>
          <Badge variant="outline">Currently: {currentUser.fullName}</Badge>
        </div>

        <Tabs defaultValue="quick-switch" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quick-switch">Quick Switch</TabsTrigger>
            <TabsTrigger value="new-login">New Login</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quick-switch" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {filteredUsers.map((user) => (
                <Card 
                  key={user.username} 
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    user.username === currentUser.username ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => onUserSelect(user)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-sm font-medium">
                        {getInitials(user.fullName)}
                      </div>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm truncate">{user.fullName}</p>
                        <Badge variant={getRoleColor(user.role)} className="text-xs">
                          {user.role}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mb-2">{user.email}</p>
                      <p className="text-xs text-muted-foreground">{getRolePermissions(user.role)}</p>
                    </div>
                  </div>
                  {user.username === currentUser.username && (
                    <div className="mt-2 text-xs text-primary font-medium">Current User</div>
                  )}
                </Card>
              ))}
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Click on any user to switch accounts instantly
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="new-login" className="space-y-4">
            <div className="text-center py-8">
              <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">Login with Different Account</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Use this option to login with credentials not in the quick switch list
              </p>
              <Button onClick={onNewLogin}>
                Go to Login Page
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}