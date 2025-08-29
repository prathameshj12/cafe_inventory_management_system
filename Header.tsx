import { useState } from "react";
import { Button } from "./ui/button";
import { Avatar } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { User, Settings, LogOut, Users, ChevronDown } from "lucide-react";

interface User {
  username: string;
  role: string;
  fullName: string;
  email: string;
}

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onUserSwitch: () => void;
  onSettings: () => void;
}

export function Header({ user, onLogout, onUserSwitch, onSettings }: HeaderProps) {
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

  return (
    <header className="border-b bg-card px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">Coffee Shop Inventory</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{user.fullName}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-3">
                <Avatar className="h-8 w-8">
                  <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-sm font-medium">
                    {getInitials(user.fullName)}
                  </div>
                </Avatar>
                <div className="flex items-center gap-1">
                  <Badge variant={getRoleColor(user.role)} className="text-xs">
                    {user.role}
                  </Badge>
                  <ChevronDown className="h-3 w-3" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user.fullName}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <Badge variant={getRoleColor(user.role)} className="text-xs mt-1">
                  {user.role}
                </Badge>
              </div>
              
              <DropdownMenuSeparator />
              
              {user.role === 'Admin' && (
                <DropdownMenuItem onClick={onUserSwitch}>
                  <Users className="mr-2 h-4 w-4" />
                  Switch User
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem onClick={onSettings}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={onLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}