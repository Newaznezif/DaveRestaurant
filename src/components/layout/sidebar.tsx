"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui.store";
import { useAuthStore } from "@/stores/auth.store";
import {
  LayoutDashboard,
  ShoppingCart,
  ChefHat,
  Truck,
  Users,
  Package,
  BarChart3,
  Settings,
  Table2,
  Calendar,
  ShoppingBag,
  FileText,
  Bell,
  LogOut,
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["SUPER_ADMIN", "RESTAURANT_OWNER", "MANAGER"],
  },
  {
    title: "POS",
    href: "/pos",
    icon: ShoppingCart,
    roles: ["CASHIER", "MANAGER", "RESTAURANT_OWNER", "SUPER_ADMIN"],
  },
  {
    title: "Kitchen",
    href: "/kitchen",
    icon: ChefHat,
    roles: ["KITCHEN_STAFF", "MANAGER", "RESTAURANT_OWNER", "SUPER_ADMIN"],
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ShoppingBag,
    roles: ["CASHIER", "WAITER", "MANAGER", "RESTAURANT_OWNER", "SUPER_ADMIN"],
  },
  {
    title: "Menu",
    href: "/menu",
    icon: Package,
    roles: ["MANAGER", "RESTAURANT_OWNER", "SUPER_ADMIN"],
  },
  {
    title: "Tables",
    href: "/tables",
    icon: Table2,
    roles: ["WAITER", "MANAGER", "RESTAURANT_OWNER", "SUPER_ADMIN"],
  },
  {
    title: "Reservations",
    href: "/reservations",
    icon: Calendar,
    roles: ["WAITER", "MANAGER", "RESTAURANT_OWNER", "SUPER_ADMIN"],
  },
  {
    title: "Employees",
    href: "/employees",
    icon: Users,
    roles: ["MANAGER", "RESTAURANT_OWNER", "SUPER_ADMIN"],
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: Package,
    roles: ["MANAGER", "RESTAURANT_OWNER", "SUPER_ADMIN"],
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    roles: ["MANAGER", "RESTAURANT_OWNER", "SUPER_ADMIN"],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
    roles: ["MANAGER", "RESTAURANT_OWNER", "SUPER_ADMIN"],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["MANAGER", "RESTAURANT_OWNER", "SUPER_ADMIN"],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed } = useUIStore();
  const { user, logout } = useAuthStore();

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user?.role || "")
  );

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r bg-card transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            D
          </div>
          {!sidebarCollapsed && <span>DaveRestaurant</span>}
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {!sidebarCollapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-2">
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <LogOut className="h-5 w-5" />
          {!sidebarCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}