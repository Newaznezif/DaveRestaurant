"use client";

import { useDashboardStats, useOrders, useLowStock } from "@/hooks/use-queries";
import { StatsCard } from "@/components/ui/chart";
import { BarChart } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DollarSign, ShoppingBag, Users, AlertTriangle, Clock, TrendingUp } from "lucide-react";
import { useTenantStore } from "@/stores/tenant.store";

export default function DashboardPage() {
  const { currentOrganization, currentBranch } = useTenantStore();
  const orgId = currentOrganization?.id || "";
  const branchId = currentBranch?.id || "";

  const { data: stats, isLoading: statsLoading, isError: statsError } = useDashboardStats(orgId, branchId);
  const { data: orders, isLoading: ordersLoading, isError: ordersError } = useOrders(branchId, { limit: 5 });
  const { data: lowStock, isLoading: lowStockLoading, isError: lowStockError } = useLowStock(branchId);

  if (statsError || ordersError || lowStockError) {
    return <ErrorState retry={() => window.location.reload()} />;
  }

  const revenueData = [
    { label: "Mon", value: 1200 },
    { label: "Tue", value: 1800 },
    { label: "Wed", value: 1500 },
    { label: "Thu", value: 2200 },
    { label: "Fri", value: 1900 },
    { label: "Sat", value: 2800 },
    { label: "Sun", value: 2100 },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          <LoadingState count={4} />
        ) : (
          <>
            <StatsCard
              title="Total Revenue"
              value={formatCurrency(stats?.revenue || 0)}
              description="Today's revenue"
              icon={<DollarSign className="h-4 w-4" />}
              trend={{ value: 12, isPositive: true }}
            />
            <StatsCard
              title="Orders"
              value={stats?.orders || 0}
              description="Today's orders"
              icon={<ShoppingBag className="h-4 w-4" />}
              trend={{ value: 8, isPositive: true }}
            />
            <StatsCard
              title="Customers"
              value={stats?.customers || 0}
              description="New customers today"
              icon={<Users className="h-4 w-4" />}
              trend={{ value: 5, isPositive: true }}
            />
            <StatsCard
              title="Low Stock Items"
              value={lowStock?.length || 0}
              description="Items needing attention"
              icon={<AlertTriangle className="h-4 w-4" />}
            />
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={revenueData} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <LoadingState count={3} />
            ) : orders && orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(order.total)}</p>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No recent orders"
                description="Orders will appear here when they are created"
              />
            )}
          </CardContent>
        </Card>
      </div>

      {lowStock && lowStock.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStock.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 rounded-md bg-destructive/10">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Current: {item.currentStock} | Min: {item.minStock}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Reorder
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}