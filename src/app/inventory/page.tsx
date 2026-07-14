"use client";

import { useState } from "react";
import { useInventory, useLowStock, useSuppliers } from "@/hooks/use-queries";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAppForm } from "@/hooks/use-form";
import { inventoryItemSchema, InventoryItemFormData } from "@/schemas/business.schema";
import { Plus, Edit, Trash2, Package, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { InventoryItem, Supplier } from "@/types";

export default function InventoryPage() {
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"items" | "suppliers">("items");
  const [search, setSearch] = useState("");

  const { data: items, isLoading: itemsLoading } = useInventory("");
  const { data: lowStock, isLoading: lowStockLoading } = useLowStock("");
  const { data: suppliers, isLoading: suppliersLoading } = useSuppliers("");

  const form = useAppForm(inventoryItemSchema, {
    defaultValues: {
      name: "",
      sku: "",
      barcode: "",
      currentStock: 0,
      minStock: 0,
      maxStock: undefined,
      unit: "",
      cost: 0,
      branchId: "",
    },
  });

  const handleAddItem = () => {
    setIsItemDialogOpen(true);
  };

  const onItemSubmit = async (data: InventoryItemFormData) => {
    try {
      // TODO: Implement create mutation
      setIsItemDialogOpen(false);
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const itemColumns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }: { row: { original: InventoryItem } }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }: { row: { original: InventoryItem } }) => row.original.sku || "-",
    },
    {
      accessorKey: "currentStock",
      header: "Current Stock",
      cell: ({ row }: { row: { original: InventoryItem } }) => row.original.currentStock,
    },
    {
      accessorKey: "minStock",
      header: "Min Stock",
      cell: ({ row }: { row: { original: InventoryItem } }) => row.original.minStock,
    },
    {
      accessorKey: "unit",
      header: "Unit",
      cell: ({ row }: { row: { original: InventoryItem } }) => row.original.unit,
    },
    {
      accessorKey: "cost",
      header: "Cost",
      cell: ({ row }: { row: { original: InventoryItem } }) => formatCurrency(row.original.cost),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: InventoryItem } }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const supplierColumns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }: { row: { original: Supplier } }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "contact",
      header: "Contact",
      cell: ({ row }: { row: { original: Supplier } }) => row.original.contact,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }: { row: { original: Supplier } }) => row.original.email || "-",
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }: { row: { original: Supplier } }) => row.original.phone || "-",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: Supplier } }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === "items" ? "default" : "outline"}
            onClick={() => setActiveTab("items")}
          >
            Items
          </Button>
          <Button
            variant={activeTab === "suppliers" ? "default" : "outline"}
            onClick={() => setActiveTab("suppliers")}
          >
            Suppliers
          </Button>
          {activeTab === "items" && (
            <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Inventory Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onItemSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              placeholder="Item name"
              className="flex h-9 w-full rounded-md border bg-background px-3 py-2 text-sm mt-1"
              {...form.register("name")}
            />
          </div>
          <div>
            <label className="text-sm font-medium">SKU</label>
            <input
              type="text"
              placeholder="SKU-001"
              className="flex h-9 w-full rounded-md border bg-background px-3 py-2 text-sm mt-1"
              {...form.register("sku")}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Current Stock</label>
              <input
                type="number"
                placeholder="0"
                className="flex h-9 w-full rounded-md border bg-background px-3 py-2 text-sm mt-1"
                {...form.register("currentStock", { valueAsNumber: true })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Min Stock</label>
              <input
                type="number"
                placeholder="0"
                className="flex h-9 w-full rounded-md border bg-background px-3 py-2 text-sm mt-1"
                {...form.register("minStock", { valueAsNumber: true })}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Unit</label>
            <input
              type="text"
              placeholder="kg, pcs, etc."
              className="flex h-9 w-full rounded-md border bg-background px-3 py-2 text-sm mt-1"
              {...form.register("unit")}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Cost</label>
            <input
              type="number"
              placeholder="0.00"
              className="flex h-9 w-full rounded-md border bg-background px-3 py-2 text-sm mt-1"
              {...form.register("cost", { valueAsNumber: true })}
            />
          </div>
          <Button type="submit" className="w-full">
            Create
          </Button>
        </form>
      </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {activeTab === "items" && (
        <>
          {lowStock && lowStock.length > 0 && (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Low Stock Alert ({lowStock.length} items)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lowStock.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 rounded bg-destructive/10">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Stock: {item.currentStock} / Min: {item.minStock}
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

          <Card>
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={itemColumns}
                data={items || []}
                isLoading={itemsLoading}
                searchKey="name"
                onSearch={setSearch}
              />
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === "suppliers" && (
        <Card>
          <CardHeader>
            <CardTitle>Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={supplierColumns}
              data={suppliers || []}
              isLoading={suppliersLoading}
              searchKey="name"
              onSearch={setSearch}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}