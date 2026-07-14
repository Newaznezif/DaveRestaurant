"use client";

import { useState } from "react";
import { useCustomers } from "@/hooks/use-queries";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppForm } from "@/hooks/use-form";
import { customerSchema, CustomerFormData } from "@/schemas/business.schema";
import { Plus, Edit, Trash2, Gift } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Customer } from "@/types";

const TIER_OPTIONS = [
  { value: "BRONZE", label: "Bronze" },
  { value: "SILVER", label: "Silver" },
  { value: "GOLD", label: "Gold" },
  { value: "PLATINUM", label: "Platinum" },
  { value: "DIAMOND", label: "Diamond" },
];

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");

  const { data: customers, isLoading, isError } = useCustomers("");

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }: { row: { original: Customer } }) => (
        <div className="font-medium">#{row.original.id.slice(-6)}</div>
      ),
    },
    {
      accessorKey: "loyaltyPoints",
      header: "Points",
      cell: ({ row }: { row: { original: Customer } }) => (
        <div className="flex items-center gap-1">
          <Gift className="h-4 w-4 text-yellow-500" />
          {row.original.loyaltyPoints}
        </div>
      ),
    },
    {
      accessorKey: "loyaltyTier",
      header: "Tier",
      cell: ({ row }: { row: { original: Customer } }) => (
        <span className="capitalize">{row.original.loyaltyTier.toLowerCase()}</span>
      ),
    },
    {
      accessorKey: "totalOrders",
      header: "Total Orders",
      cell: ({ row }: { row: { original: Customer } }) => row.original.totalOrders,
    },
    {
      accessorKey: "totalSpent",
      header: "Total Spent",
      cell: ({ row }: { row: { original: Customer } }) => formatCurrency(row.original.totalSpent),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: Customer } }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <div className="flex items-center gap-2">
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="h-9 w-40 rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="all">All Tiers</option>
            {TIER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={customers || []}
            isLoading={isLoading}
            searchKey="id"
            onSearch={setSearch}
          />
        </CardContent>
      </Card>
    </div>
  );
}