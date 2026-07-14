export const Permissions = {
  // Orders
  ORDER_CREATE: 'order:create',
  ORDER_READ: 'order:read',
  ORDER_UPDATE: 'order:update',
  ORDER_CANCEL: 'order:cancel',
  ORDER_REFUND: 'order:refund',
  ORDER_DELETE: 'order:delete',
  ORDER_SPLIT: 'order:split',
  ORDER_MERGE: 'order:merge',

  // Menu
  MENU_CREATE: 'menu:create',
  MENU_READ: 'menu:read',
  MENU_UPDATE: 'menu:update',
  MENU_DELETE: 'menu:delete',
  MENU_CATEGORY_CREATE: 'menu:category:create',
  MENU_CATEGORY_UPDATE: 'menu:category:update',
  MENU_CATEGORY_DELETE: 'menu:category:delete',

  // Inventory
  INVENTORY_READ: 'inventory:read',
  INVENTORY_CREATE: 'inventory:create',
  INVENTORY_UPDATE: 'inventory:update',
  INVENTORY_ADJUST: 'inventory:adjust',
  INVENTORY_TRANSFER: 'inventory:transfer',

  // Tables
  TABLE_CREATE: 'table:create',
  TABLE_READ: 'table:read',
  TABLE_UPDATE: 'table:update',
  TABLE_DELETE: 'table:delete',
  TABLE_MERGE: 'table:merge',

  // Reservations
  RESERVATION_CREATE: 'reservation:create',
  RESERVATION_READ: 'reservation:read',
  RESERVATION_UPDATE: 'reservation:update',
  RESERVATION_CANCEL: 'reservation:cancel',

  // Payments
  PAYMENT_PROCESS: 'payment:process',
  PAYMENT_READ: 'payment:read',
  PAYMENT_REFUND: 'payment:refund',
  PAYMENT_VOID: 'payment:void',

  // Employees
  EMPLOYEE_CREATE: 'employee:create',
  EMPLOYEE_READ: 'employee:read',
  EMPLOYEE_UPDATE: 'employee:update',
  EMPLOYEE_TERMINATE: 'employee:terminate',
  EMPLOYEE_MANAGE_PAYROLL: 'employee:manage_payroll',
  EMPLOYEE_MANAGE_SHIFTS: 'employee:manage_shifts',

  // Customers
  CUSTOMER_CREATE: 'customer:create',
  CUSTOMER_READ: 'customer:read',
  CUSTOMER_UPDATE: 'customer:update',

  // Reports
  REPORT_VIEW_SALES: 'report:view_sales',
  REPORT_VIEW_FINANCIAL: 'report:view_financial',
  REPORT_VIEW_INVENTORY: 'report:view_inventory',
  REPORT_VIEW_EMPLOYEE: 'report:view_employee',
  REPORT_EXPORT: 'report:export',

  // Settings
  SETTINGS_READ: 'settings:read',
  SETTINGS_UPDATE: 'settings:update',
  SYSTEM_CONFIG: 'system:config',

  // Subscriptions
  SUBSCRIPTION_READ: 'subscription:read',
  SUBSCRIPTION_MANAGE: 'subscription:manage',

  // Audit
  AUDIT_VIEW: 'audit:view',

  // Branch Management
  BRANCH_CREATE: 'branch:create',
  BRANCH_READ: 'branch:read',
  BRANCH_UPDATE: 'branch:update',
  BRANCH_DELETE: 'branch:delete',

  // Organization
  ORG_READ: 'org:read',
  ORG_UPDATE: 'org:update',
  ORG_DELETE: 'org:delete',

  // Delivery
  DELIVERY_ASSIGN: 'delivery:assign',
  DELIVERY_TRACK: 'delivery:track',
  DELIVERY_CANCEL: 'delivery:cancel',

  // KDS
  KDS_VIEW: 'kds:view',
  KDS_UPDATE_STATUS: 'kds:update_status',

  // POS
  POS_OPEN_REGISTER: 'pos:open_register',
  POS_CLOSE_REGISTER: 'pos:close_register',
  POS_X_REPORT: 'pos:x_report',
  POS_Z_REPORT: 'pos:z_report',

  // Reviews
  REVIEW_MODERATE: 'review:moderate',

  // Marketing
  CAMPAIGN_CREATE: 'campaign:create',
  CAMPAIGN_SEND: 'campaign:send',
  COUPON_CREATE: 'coupon:create',
  COUPON_MANAGE: 'coupon:manage',

  // Loyalty
  LOYALTY_MANAGE: 'loyalty:manage',
  LOYALTY_ADJUST_POINTS: 'loyalty:adjust_points',

  // Suppliers
  SUPPLIER_CREATE: 'supplier:create',
  SUPPLIER_READ: 'supplier:read',
  SUPPLIER_UPDATE: 'supplier:update',
  SUPPLIER_MANAGE_PO: 'supplier:manage_po',

  // Chat
  CHAT_SEND: 'chat:send',
  CHAT_READ: 'chat:read',
  CHAT_MANAGE: 'chat:manage',
} as const;

export type Permission = (typeof Permissions)[keyof typeof Permissions];