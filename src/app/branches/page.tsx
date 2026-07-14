"use client";

import { useState } from "react";
import { useBranches, useCreateBranch, useUpdateBranch, useOrganizations } from "@/hooks/use-queries";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAppForm } from "@/hooks/use-form";
import { branchSchema, BranchFormData } from "@/schemas/business.schema";
import { Plus, Edit, Trash2, MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Branch, Organization } from "@/types";

export default function BranchesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [search, setSearch] = useState("");

  const { data: branches, isLoading, isError } = useBranches();
  const { data: organizations } = useOrganizations();
  const createMutation = useCreateBranch();
  const updateMutation = useUpdateBranch();

  const form = useAppForm(branchSchema, {
    defaultValues: {
      name: "",
      slug: "",
      address: "",
      phone: "",
      email: "",
      openingTime: "08:00",
      closingTime: "22:00",
      isActive: true,
      organizationId: "",
    },
  });

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    form.reset({
      name: branch.name,
      slug: branch.slug,
      address: branch.address,
      phone: branch.phone || "",
      email: branch.email || "",
      openingTime: branch.openingTime || "08:00",
      closingTime: branch.closingTime || "22:00",
      isActive: branch.isActive,
      organizationId: branch.organizationId,
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingBranch(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: BranchFormData) => {
    try {
      if (editingBranch) {
        await updateMutation.mutateAsync({ id: editingBranch.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving branch:", error);
    }
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }: { row: { original: Branch } }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }: { row: { original: Branch } }) => row.original.address,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }: { row: { original: Branch } }) => row.original.phone || "-",
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }: { row: { original: Branch } }) => (
        <span
          className={
            row.original.isActive
              ? "text-green-600"
              : "text-red-600"
          }
        >
          {row.original.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }: { row: { original: Branch } }) => formatDate(row.original.createdAt),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: Branch } }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Branches</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add Branch
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBranch ? "Edit Branch" : "Add Branch"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  placeholder="Branch name"
                  className="flex h-9 w-full rounded-md border bg-background px-3 py-2 text-sm mt-1"
                  {...form.register("name")}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Slug</label>
                <input
                  type="text"
                  placeholder="branch-slug"
                  className="flex h-9 w-full rounded-md border bg-background px-3 py-2 text-sm mt-1"
                  {...form.register("slug")}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Address</label>
                <input
                  type="text"
                  placeholder="Branch address"
                  className="flex h-9 w-full rounded-md border bg-background px-3 py-2 text-sm mt-1"
                  {...form.register("address")}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <input
                  type="text"
                  placeholder="+1 (555) 123-4567"
                  className="flex h-9 w-full rounded-md border bg-background px-3 py-2 text-sm mt-1"
                  {...form.register("phone")}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  placeholder="branch@restaurant.com"
                  className="flex h-9 w-full rounded-md border bg-background px-3 py-2 text-sm mt-1"
                  {...form.register("email")}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Opening Time</label>
                  <input
                    type="time"
                    className="flex h-9 w-full rounded-md border bg-background px-3 py-2 text-sm mt-1"
                    {...form.register("openingTime")}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Closing Time</label>
                  <input
                    type="time"
                    className="flex h-9 w-full rounded-md border bg-background px-3 py-2 text-sm mt-1"
                    {...form.register("closingTime")}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Organization</label>
                <select
                  className="flex h-9 w-full rounded-md border bg-background px-3 py-2 text-sm mt-1"
                  {...form.register("organizationId")}
                >
                  <option value="">Select organization</option>
                  {organizations?.map((org) => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" className="w-full">
                {editingBranch ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Branches</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={branches || []}
            isLoading={isLoading}
            searchKey="name"
            onSearch={setSearch}
          />
        </CardContent>
      </Card>
    </div>
  );
}