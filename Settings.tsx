import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { User, Shield, Settings as SettingsIcon, Info, Edit, Trash2, UserPlus } from "lucide-react";
import { ROLES, hasPermission, PERMISSIONS } from "../utils/permissions";
import { toast } from "sonner@2.0.3";

interface User {
  username: string;
  role: string;
  fullName: string;
  email: string;
}

interface SettingsUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastLogin: string;
  permissions: string[];
}

interface SettingsProps {
  user: User;
}

export function Settings({ user }: SettingsProps) {
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SettingsUser | null>(null);
  const [newUser, setNewUser] = useState({
    username: "",
    fullName: "",
    email: "",
    role: "",
    status: "active" as "active" | "inactive"
  });

  // Mock users data - in real app this would come from backend
  const allUsers: SettingsUser[] = [
    {
      id: "1",
      username: "admin",
      fullName: "System Administrator",
      email: "admin@coffeeshop.com",
      role: "Admin",
      status: "active",
      lastLogin: "2025-01-21 14:30",
      permissions: ["ALL"]
    },
    {
      id: "2",
      username: "john_manager",
      fullName: "John Smith",
      email: "john@coffeeshop.com",
      role: "Manager",
      status: "active",
      lastLogin: "2025-01-21 09:15",
      permissions: ["INVENTORY.VIEW", "INVENTORY.EDIT", "SALES.VIEW", "REPORTS.VIEW"]
    },
    {
      id: "3",
      username: "sarah_staff",
      fullName: "Sarah Johnson",
      email: "sarah@coffeeshop.com",
      role: "Staff",
      status: "active",
      lastLogin: "2025-01-20 16:45",
      permissions: ["INVENTORY.VIEW", "SALES.VIEW"]
    },
    {
      id: "4",
      username: "mike_cashier",
      fullName: "Mike Wilson",
      email: "mike@coffeeshop.com",
      role: "Cashier",
      status: "active",
      lastLogin: "2025-01-21 08:00",
      permissions: ["SALES.VIEW", "SALES.CREATE"]
    }
  ];

  const handleEditUser = (editUser: SettingsUser) => {
    setSelectedUser(editUser);
    setNewUser({
      username: editUser.username,
      fullName: editUser.fullName,
      email: editUser.email,
      role: editUser.role,
      status: editUser.status
    });
    setIsEditUserDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (!newUser.username || !newUser.fullName || !newUser.email || !newUser.role) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    toast.success(selectedUser ? "User updated successfully!" : "User added successfully!");
    setIsEditUserDialogOpen(false);
    setSelectedUser(null);
    setNewUser({
      username: "",
      fullName: "",
      email: "",
      role: "",
      status: "active"
    });
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === "1") {
      toast.error("Cannot delete system administrator");
      return;
    }
    toast.success("User deleted successfully!");
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Settings</h1>
          <p className="text-muted-foreground">Configure your application settings and manage users</p>
        </div>
      </div>

      <Tabs defaultValue="user-info" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="user-info" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            User Info
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Role Permissions
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            System Settings
          </TabsTrigger>
          <TabsTrigger value="app-info" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Application Info
          </TabsTrigger>
        </TabsList>

        <TabsContent value="user-info" className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4">Current User Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Full Name</Label>
                  <Input value={user.fullName} disabled className="mt-1" />
                </div>
                <div>
                  <Label>Username</Label>
                  <Input value={user.username} disabled className="mt-1" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input value={user.email} disabled className="mt-1" />
                </div>
                <div>
                  <Label>Role</Label>
                  <div className="mt-1">
                    <Badge variant={getRoleColor(user.role)}>{user.role}</Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t">
              <h4 className="mb-4">Account Actions</h4>
              <div className="flex gap-2">
                <Button variant="outline">Change Password</Button>
                <Button variant="outline">Update Profile</Button>
              </div>
            </div>
          </Card>

          {user.role === 'Admin' && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3>User Management</h3>
                <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setSelectedUser(null);
                      setNewUser({
                        username: "",
                        fullName: "",
                        email: "",
                        role: "",
                        status: "active"
                      });
                    }}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{selectedUser ? "Edit User" : "Add New User"}</DialogTitle>
                      <DialogDescription>
                        {selectedUser ? "Modify user information and role." : "Create a new user account with the specified role and permissions."}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">Username*</Label>
                        <Input
                          id="username"
                          value={newUser.username}
                          onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                          className="col-span-3"
                          placeholder="username"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="fullName" className="text-right">Full Name*</Label>
                        <Input
                          id="fullName"
                          value={newUser.fullName}
                          onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                          className="col-span-3"
                          placeholder="Full name"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email*</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                          className="col-span-3"
                          placeholder="email@example.com"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">Role*</Label>
                        <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Manager">Manager</SelectItem>
                            <SelectItem value="Staff">Staff</SelectItem>
                            <SelectItem value="Cashier">Cashier</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">Status</Label>
                        <Select value={newUser.status} onValueChange={(value: "active" | "inactive") => setNewUser({...newUser, status: value})}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveUser}>
                        {selectedUser ? "Update User" : "Add User"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allUsers.map((settingsUser) => (
                    <TableRow key={settingsUser.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{settingsUser.fullName}</div>
                          <div className="text-sm text-muted-foreground">{settingsUser.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleColor(settingsUser.role)}>{settingsUser.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={settingsUser.status === "active" ? "default" : "secondary"}>
                          {settingsUser.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{settingsUser.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditUser(settingsUser)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {settingsUser.id !== "1" && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteUser(settingsUser.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4">Current Role Permissions</h3>
            {ROLES[user.role.toUpperCase()] && (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  {ROLES[user.role.toUpperCase()].description}
                </p>
                <div className="space-y-4">
                  {ROLES[user.role.toUpperCase()].permissions.map((permission, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <p className="font-medium mb-2">{permission.module}</p>
                      <div className="flex flex-wrap gap-2">
                        {permission.actions.map((action, actionIndex) => (
                          <Badge key={actionIndex} variant="outline" className="text-xs">
                            {action.split('.').pop()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {user.role === 'Admin' && (
            <Card className="p-6">
              <h3 className="mb-4">Role Management</h3>
              <p className="text-muted-foreground mb-6">
                Configure permissions for different user roles
              </p>
              <div className="space-y-4">
                {Object.entries(ROLES).map(([roleKey, roleData]) => (
                  <div key={roleKey} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant={getRoleColor(roleKey.toLowerCase())}>{roleKey}</Badge>
                        <span className="text-sm text-muted-foreground">{roleData.description}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {roleData.permissions.map((permission, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span>{permission.module}</span>
                          <div className="flex flex-wrap gap-1">
                            {permission.actions.map((action, actionIndex) => (
                              <Badge key={actionIndex} variant="outline" className="text-xs">
                                {action.split('.').pop()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          {hasPermission(user.role, PERMISSIONS.SETTINGS.SYSTEM) ? (
            <>
              <Card className="p-6">
                <h3 className="mb-4">General Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Low Stock Threshold</Label>
                      <Input type="number" defaultValue="10" className="mt-1" />
                      <p className="text-xs text-muted-foreground mt-1">Items below this number will show as low stock</p>
                    </div>
                    <div>
                      <Label>Currency</Label>
                      <Select defaultValue="USD">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Tax Rate (%)</Label>
                      <Input type="number" step="0.01" defaultValue="8.5" className="mt-1" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Timezone</Label>
                      <Select defaultValue="America/New_York">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                          <SelectItem value="America/Chicago">Central Time</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto-backup</Label>
                        <p className="text-xs text-muted-foreground">Automatically backup data daily</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-xs text-muted-foreground">Send alerts for low stock</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t">
                  <Button>Save Settings</Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-4">Data Management</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Backup Database</p>
                      <p className="text-sm text-muted-foreground">Create a backup of all data</p>
                    </div>
                    <Button variant="outline">Create Backup</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Import Data</p>
                      <p className="text-sm text-muted-foreground">Import products and suppliers from CSV</p>
                    </div>
                    <Button variant="outline">Import CSV</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-destructive">Reset All Data</p>
                      <p className="text-sm text-muted-foreground">Permanently delete all data (cannot be undone)</p>
                    </div>
                    <Button variant="destructive">Reset</Button>
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-6">
              <h3>Access Denied</h3>
              <p className="text-muted-foreground">You don't have permission to access system settings.</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="app-info" className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4">Application Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Application Name</span>
                  <span className="font-medium">Coffee Shop Inventory</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Backup</span>
                  <span className="font-medium">Never</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Database Size</span>
                  <span className="font-medium">~2.3 MB</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Products</span>
                  <span className="font-medium">247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Suppliers</span>
                  <span className="font-medium">15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Users</span>
                  <span className="font-medium">{user.role === 'Admin' ? '6' : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Installation Date</span>
                  <span className="font-medium">January 1, 2025</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">System Health</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Database Connection</span>
                <Badge variant="default">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Storage Usage</span>
                <Badge variant="secondary">23% Used</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Last System Check</span>
                <Badge variant="default">2 minutes ago</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Performance</span>
                <Badge variant="default">Optimal</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">Support & Documentation</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                View Documentation
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Contact Support
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Check for Updates
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Send Feedback
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}