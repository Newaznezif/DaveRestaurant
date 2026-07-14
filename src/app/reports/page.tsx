"use client";

import { useState } from "react";
import { useDashboardStats } from "@/hooks/use-queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, LineChart, StatsCard } from "@/components/ui/chart";
import { FileText, Download, Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState<"sales" | "customers" | "inventory">("sales");
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "year">("today");

  const { data: stats, isLoading } = useDashboardStats("");

  const salesData = [
    { label: "Mon", value: 1200 },
    { label: "Tue", value: 1800 },
    { label: "Wed", value: 1500 },
    { label: "Thu", value: 2200 },
    { label: "Fri", value: 1900 },
    { label: "Sat", value: 2800 },
    { label: "Sun", value: 2100 },
  ];

  const customerData = [
    { label: "Jan", value: 45 },
    { label: "Feb", value: 52 },
    { label: "Mar", value: 48 },
    { label: "Apr", value: 61 },
    { label: "May", value: 55 },
    { label: "Jun", value: 67 },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <div className="flex items-center gap-2">
          <Button
            variant={activeReport === "sales" ? "default" : "outline"}
            onClick={() => setActiveReport("sales")}
          >
            Sales
          </Button>
          <Button
            variant={activeReport === "customers" ? "default" : "outline"}
            onClick={() => setActiveReport("customers")}
          >
            Customers
          </Button>
          <Button
            variant={activeReport === "inventory" ? "default" : "outline"}
            onClick={() => setActiveReport("inventory")}
          >
            Inventory
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Date Range:</span>
        <div className="flex gap-1">
          {["today", "week", "month", "year"].map((range) => (
            <Button
              key={range}
              size="sm"
              variant={dateRange === range ? "default" : "outline"}
              onClick={() => setDateRange(range as any)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Button>
          ))}
        </div>
        <Button size="sm" variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {activeReport === "sales" && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Revenue"
              value={formatCurrency(stats?.revenue || 0)}
              description="This period"
              icon={<FileText className="h-4 w-4" />}
              trend={{ value: 12, isPositive: true }}
            />
            <StatsCard
              title="Orders"
              value={stats?.orders || 0}
              description="This period"
              icon={<FileText className="h-4 w-4" />}
              trend={{ value: 8, isPositive: true }}
            />
            <StatsCard
              title="Average Order"
              value={formatCurrency((stats?.revenue || 0) / (stats?.orders || 1))}
              description="Per order"
              icon={<FileText className="h-4 w-4" />}
            />
            <StatsCard
              title="Growth"
              value="12.5%"
              description="vs last period"
              icon={<FileText className="h-4 w-4" />}
              trend={{ value: 12.5, isPositive: true }}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart data={salesData} />
            </CardContent>
          </Card>
        </>
      )}

      {activeReport === "customers" && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Customers"
              value={stats?.customers || 0}
              description="This period"
              icon={<FileText className="h-4 w-4" />}
              trend={{ value: 15, isPositive: true }}
            />
            <StatsCard
              title="New Customers"
              value={Math.floor((stats?.customers || 0) * 0.3)}
              description="This period"
              icon={<FileText className="h-4 w-4" />}
            />
            <StatsCard
              title="Returning"
              value={Math.floor((stats?.customers || 0) * 0.7)}
              description="This period"
              icon={<FileText className="h-4 w-4" />}
            />
            <StatsCard
              title="Retention"
              value="70%"
              description="Rate"
              icon={<FileText className="h-4 w-4" />}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customer Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={customerData} />
            </CardContent>
          </Card>
        </>
      )}

      {activeReport === "inventory" && (
        <Card>
          <CardHeader>
            <CardTitle>Inventory Report</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Inventory reports will be available when the inventory module is fully integrated.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}