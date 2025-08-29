export interface Permission {
  module: string;
  actions: string[];
}

export interface Role {
  name: string;
  description: string;
  permissions: Permission[];
  level: number; // Higher number = more privileges
}

export const PERMISSIONS = {
  DASHBOARD: {
    VIEW: 'dashboard.view',
  },
  INVENTORY: {
    VIEW: 'inventory.view',
    CREATE: 'inventory.create',
    UPDATE: 'inventory.update',
    DELETE: 'inventory.delete',
  },
  STOCK: {
    VIEW: 'stock.view',
    ADD: 'stock.add',
    DEDUCT: 'stock.deduct',
    HISTORY: 'stock.history',
  },
  SALES: {
    VIEW: 'sales.view',
    CREATE: 'sales.create',
    PROCESS: 'sales.process',
  },
  SUPPLIERS: {
    VIEW: 'suppliers.view',
    CREATE: 'suppliers.create',
    UPDATE: 'suppliers.update',
    DELETE: 'suppliers.delete',
  },
  REPORTS: {
    VIEW: 'reports.view',
    BASIC: 'reports.basic',
    ADVANCED: 'reports.advanced',
    EXPORT: 'reports.export',
  },
  USER_MANAGEMENT: {
    VIEW: 'users.view',
    CREATE: 'users.create',
    UPDATE: 'users.update',
    DELETE: 'users.delete',
    CHANGE_ROLES: 'users.change_roles',
    RESET_PASSWORDS: 'users.reset_passwords',
  },
  SETTINGS: {
    VIEW: 'settings.view',
    SYSTEM: 'settings.system',
    PERSONAL: 'settings.personal',
  },
} as const;

export const ROLES: Record<string, Role> = {
  ADMIN: {
    name: 'Admin',
    description: 'Full system access with user management capabilities',
    level: 4,
    permissions: [
      {
        module: 'Dashboard',
        actions: [PERMISSIONS.DASHBOARD.VIEW],
      },
      {
        module: 'Inventory Management',
        actions: [
          PERMISSIONS.INVENTORY.VIEW,
          PERMISSIONS.INVENTORY.CREATE,
          PERMISSIONS.INVENTORY.UPDATE,
          PERMISSIONS.INVENTORY.DELETE,
        ],
      },
      {
        module: 'Stock Management',
        actions: [
          PERMISSIONS.STOCK.VIEW,
          PERMISSIONS.STOCK.ADD,
          PERMISSIONS.STOCK.DEDUCT,
          PERMISSIONS.STOCK.HISTORY,
        ],
      },
      {
        module: 'Sales Management',
        actions: [
          PERMISSIONS.SALES.VIEW,
          PERMISSIONS.SALES.CREATE,
          PERMISSIONS.SALES.PROCESS,
        ],
      },
      {
        module: 'Supplier Management',
        actions: [
          PERMISSIONS.SUPPLIERS.VIEW,
          PERMISSIONS.SUPPLIERS.CREATE,
          PERMISSIONS.SUPPLIERS.UPDATE,
          PERMISSIONS.SUPPLIERS.DELETE,
        ],
      },
      {
        module: 'Reports & Analytics',
        actions: [
          PERMISSIONS.REPORTS.VIEW,
          PERMISSIONS.REPORTS.BASIC,
          PERMISSIONS.REPORTS.ADVANCED,
          PERMISSIONS.REPORTS.EXPORT,
        ],
      },
      {
        module: 'User Management',
        actions: [
          PERMISSIONS.USER_MANAGEMENT.VIEW,
          PERMISSIONS.USER_MANAGEMENT.CREATE,
          PERMISSIONS.USER_MANAGEMENT.UPDATE,
          PERMISSIONS.USER_MANAGEMENT.DELETE,
          PERMISSIONS.USER_MANAGEMENT.CHANGE_ROLES,
          PERMISSIONS.USER_MANAGEMENT.RESET_PASSWORDS,
        ],
      },
      {
        module: 'System Settings',
        actions: [
          PERMISSIONS.SETTINGS.VIEW,
          PERMISSIONS.SETTINGS.SYSTEM,
          PERMISSIONS.SETTINGS.PERSONAL,
        ],
      },
    ],
  },
  MANAGER: {
    name: 'Manager',
    description: 'Inventory, supplier management and staff supervision',
    level: 3,
    permissions: [
      {
        module: 'Dashboard',
        actions: [PERMISSIONS.DASHBOARD.VIEW],
      },
      {
        module: 'Inventory Management',
        actions: [
          PERMISSIONS.INVENTORY.VIEW,
          PERMISSIONS.INVENTORY.CREATE,
          PERMISSIONS.INVENTORY.UPDATE,
          PERMISSIONS.INVENTORY.DELETE,
        ],
      },
      {
        module: 'Stock Management',
        actions: [
          PERMISSIONS.STOCK.VIEW,
          PERMISSIONS.STOCK.ADD,
          PERMISSIONS.STOCK.DEDUCT,
          PERMISSIONS.STOCK.HISTORY,
        ],
      },
      {
        module: 'Sales Management',
        actions: [
          PERMISSIONS.SALES.VIEW,
          PERMISSIONS.SALES.CREATE,
          PERMISSIONS.SALES.PROCESS,
        ],
      },
      {
        module: 'Supplier Management',
        actions: [
          PERMISSIONS.SUPPLIERS.VIEW,
          PERMISSIONS.SUPPLIERS.CREATE,
          PERMISSIONS.SUPPLIERS.UPDATE,
          PERMISSIONS.SUPPLIERS.DELETE,
        ],
      },
      {
        module: 'Reports & Analytics',
        actions: [
          PERMISSIONS.REPORTS.VIEW,
          PERMISSIONS.REPORTS.BASIC,
          PERMISSIONS.REPORTS.ADVANCED,
          PERMISSIONS.REPORTS.EXPORT,
        ],
      },
      {
        module: 'Personal Settings',
        actions: [
          PERMISSIONS.SETTINGS.VIEW,
          PERMISSIONS.SETTINGS.PERSONAL,
        ],
      },
    ],
  },
  STAFF: {
    name: 'Staff',
    description: 'Inventory updates, sales entry, and basic reporting',
    level: 2,
    permissions: [
      {
        module: 'Dashboard',
        actions: [PERMISSIONS.DASHBOARD.VIEW],
      },
      {
        module: 'Inventory Management',
        actions: [
          PERMISSIONS.INVENTORY.VIEW,
          PERMISSIONS.INVENTORY.UPDATE,
        ],
      },
      {
        module: 'Stock Management',
        actions: [
          PERMISSIONS.STOCK.VIEW,
          PERMISSIONS.STOCK.ADD,
          PERMISSIONS.STOCK.DEDUCT,
          PERMISSIONS.STOCK.HISTORY,
        ],
      },
      {
        module: 'Sales Management',
        actions: [
          PERMISSIONS.SALES.VIEW,
          PERMISSIONS.SALES.CREATE,
          PERMISSIONS.SALES.PROCESS,
        ],
      },
      {
        module: 'Supplier Management',
        actions: [PERMISSIONS.SUPPLIERS.VIEW],
      },
      {
        module: 'Reports & Analytics',
        actions: [
          PERMISSIONS.REPORTS.VIEW,
          PERMISSIONS.REPORTS.BASIC,
        ],
      },
      {
        module: 'Personal Settings',
        actions: [
          PERMISSIONS.SETTINGS.VIEW,
          PERMISSIONS.SETTINGS.PERSONAL,
        ],
      },
    ],
  },
  CASHIER: {
    name: 'Cashier',
    description: 'Sales processing and basic inventory viewing',
    level: 1,
    permissions: [
      {
        module: 'Dashboard',
        actions: [PERMISSIONS.DASHBOARD.VIEW],
      },
      {
        module: 'Inventory Management',
        actions: [PERMISSIONS.INVENTORY.VIEW],
      },
      {
        module: 'Sales Management',
        actions: [
          PERMISSIONS.SALES.VIEW,
          PERMISSIONS.SALES.CREATE,
          PERMISSIONS.SALES.PROCESS,
        ],
      },
      {
        module: 'Reports & Analytics',
        actions: [
          PERMISSIONS.REPORTS.VIEW,
          PERMISSIONS.REPORTS.BASIC,
        ],
      },
      {
        module: 'Personal Settings',
        actions: [
          PERMISSIONS.SETTINGS.VIEW,
          PERMISSIONS.SETTINGS.PERSONAL,
        ],
      },
    ],
  },
};

export const hasPermission = (userRole: string, permission: string): boolean => {
  const role = ROLES[userRole.toUpperCase()];
  if (!role) return false;

  return role.permissions.some(modulePermission =>
    modulePermission.actions.includes(permission)
  );
};

export const canAccessModule = (userRole: string, module: string): boolean => {
  switch (module.toLowerCase()) {
    case 'dashboard':
      return hasPermission(userRole, PERMISSIONS.DASHBOARD.VIEW);
    case 'inventory':
      return hasPermission(userRole, PERMISSIONS.INVENTORY.VIEW);
    case 'stock':
      return hasPermission(userRole, PERMISSIONS.STOCK.VIEW);
    case 'sales':
      return hasPermission(userRole, PERMISSIONS.SALES.VIEW);
    case 'suppliers':
      return hasPermission(userRole, PERMISSIONS.SUPPLIERS.VIEW);
    case 'reports':
      return hasPermission(userRole, PERMISSIONS.REPORTS.VIEW);
    case 'users':
      return hasPermission(userRole, PERMISSIONS.USER_MANAGEMENT.VIEW);
    case 'settings':
      return hasPermission(userRole, PERMISSIONS.SETTINGS.VIEW);
    default:
      return false;
  }
};

export const getUserRole = (roleName: string): Role | null => {
  return ROLES[roleName.toUpperCase()] || null;
};

export const getAllRoles = (): Role[] => {
  return Object.values(ROLES);
};