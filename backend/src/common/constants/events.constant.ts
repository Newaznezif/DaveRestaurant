export const DomainEvents = {
  // Order Events
  ORDER_CREATED: 'order.created',
  ORDER_CONFIRMED: 'order.confirmed',
  ORDER_PREPARING: 'order.preparing',
  ORDER_READY: 'order.ready',
  ORDER_SERVED: 'order.served',
  ORDER_DELIVERED: 'order.delivered',
  ORDER_CANCELLED: 'order.cancelled',
  ORDER_REFUNDED: 'order.refunded',
  ORDER_ITEM_READY: 'order.item.ready',
  ORDER_SPLIT: 'order.split',
  ORDER_MERGED: 'order.merged',

  // Payment Events
  PAYMENT_INITIATED: 'payment.initiated',
  PAYMENT_COMPLETED: 'payment.completed',
  PAYMENT_FAILED: 'payment.failed',
  PAYMENT_REFUNDED: 'payment.refunded',
  PAYMENT_PARTIAL_REFUND: 'payment.partial_refund',

  // Reservation Events
  RESERVATION_CREATED: 'reservation.created',
  RESERVATION_CONFIRMED: 'reservation.confirmed',
  RESERVATION_SEATED: 'reservation.seated',
  RESERVATION_CANCELLED: 'reservation.cancelled',
  RESERVATION_NO_SHOW: 'reservation.no_show',
  RESERVATION_COMPLETED: 'reservation.completed',

  // Inventory Events
  INVENTORY_LOW_STOCK: 'inventory.low_stock',
  INVENTORY_OUT_OF_STOCK: 'inventory.out_of_stock',
  INVENTORY_EXPIRED: 'inventory.expired',
  INVENTORY_ADJUSTED: 'inventory.adjusted',
  INVENTORY_TRANSFERRED: 'inventory.transferred',

  // Delivery Events
  DELIVERY_ASSIGNED: 'delivery.assigned',
  DELIVERY_PICKED_UP: 'delivery.picked_up',
  DELIVERY_IN_TRANSIT: 'delivery.in_transit',
  DELIVERY_DELIVERED: 'delivery.delivered',
  DELIVERY_FAILED: 'delivery.failed',
  DELIVERY_LOCATION_UPDATED: 'delivery.location_updated',

  // User Events
  USER_REGISTERED: 'user.registered',
  USER_LOGGED_IN: 'user.logged_in',
  USER_PASSWORD_CHANGED: 'user.password_changed',
  USER_DEACTIVATED: 'user.deactivated',
  USER_VERIFIED: 'user.verified',

  // Subscription Events
  SUBSCRIPTION_CREATED: 'subscription.created',
  SUBSCRIPTION_RENEWED: 'subscription.renewed',
  SUBSCRIPTION_EXPIRED: 'subscription.expired',
  SUBSCRIPTION_DOWNGRADED: 'subscription.downgraded',
  SUBSCRIPTION_CANCELLED: 'subscription.cancelled',

  // Notification Events
  NOTIFICATION_SENT: 'notification.sent',
  NOTIFICATION_DELIVERED: 'notification.delivered',
  NOTIFICATION_READ: 'notification.read',
  NOTIFICATION_FAILED: 'notification.failed',

  // Table Events
  TABLE_STATUS_CHANGED: 'table.status_changed',
  TABLE_OCCUPIED: 'table.occupied',
  TABLE_VACATED: 'table.vacated',

  // Employee Events
  EMPLOYEE_CLOCK_IN: 'employee.clock_in',
  EMPLOYEE_CLOCK_OUT: 'employee.clock_out',
  EMPLOYEE_SHIFT_STARTED: 'employee.shift_started',
  EMPLOYEE_SHIFT_ENDED: 'employee.shift_ended',

  // Loyalty Events
  LOYALTY_POINTS_EARNED: 'loyalty.points_earned',
  LOYALTY_POINTS_REDEEMED: 'loyalty.points_redeemed',
  LOYALTY_TIER_CHANGED: 'loyalty.tier_changed',
} as const;

export type DomainEvent = (typeof DomainEvents)[keyof typeof DomainEvents];