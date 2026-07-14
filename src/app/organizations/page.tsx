"use client";

import { useState } from "react";
import { useOrganizations, useCreateOrganization, useUpdateOrganization } from "@/hooks/use-queries";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField, FormSelect } from "@/components/ui/form-field";
import { useAppForm } from "@/hooks/use-form";
import { organizationSchema, OrganizationFormData } from "@/schemas/business.schema";
import { Plus, Edit, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Organization } from "@/types";

export default function OrganizationsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [search, setSearch] = useState("");

  const { data: organizations, isLoading, isError } = useOrganizations();
  const createMutation = useCreateOrganization();
  const updateMutation = useUpdateOrganization();

  const form = useAppForm(organizationSchema, {
    defaultValues: {
      name: "",
      slug: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
  });

  const handleEdit = (org: Organization) => {
    setEditingOrg(org);
    form.reset({
      name: org.name,
      slug: org.slug,
      email: org.email || "",
      phone: org.phone || "",
      address: org.address || "",
      city: org.city || "",
      state: org.state || "",
      country: org.country || "",
      postalCode: org.postalCode || "",
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingOrg(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: OrganizationFormData) => {
    try {
      if (editingOrg) {
        await updateMutation.mutateAsync({ id: editingOrg.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving organization:", error);
    }
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }: { row: { original: Organization } }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "slug",
      header: "Slug",
      cell: ({ row }: { row: { original: Organization } }) => row.original.slug,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }: { row: { original: Organization } }) => row.original.email || "-",
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }: { row: { original: Organization } }) => row.original.phone || "-",
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }: { row: { original: Organization } }) => formatDate(row.original.createdAt),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: Organization } }) => (
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
        <h2 className="text-3xl font-bold tracking-tight">Organizations</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add Organization
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingOrg ? "Edit Organization" : "Add Organization"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                form={form}
                name="name"
                label="Name"
                placeholder="Organization name"
                required
              />
              <FormField
                form={form}
                name="slug"
                label="Slug"
                placeholder="organization-slug"
                required
              />
              <FormField
                form={form}
                name="email"
                label="Email"
                type="email"
                placeholder="contact@organization.com"
              />
              <FormField
                form={form}
                name="phone"
                label="Phone"
                placeholder="+1 (555) 123-4567"
              />
              <FormField
                form={form}
                name="address"
                label="Address"
                placeholder="Street address"
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  form={form}
                  name="city"
                  label="City"
                  placeholder="City"
                />
                <FormField
                  form={form}
                  name="state"
                  label="State"
                  placeholder="State"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  form={form}
                  name="country"
                  label="Country"
                  placeholder="Country"
                />
                <FormField
                  form={form}
                  name="postalCode"
                  label="Postal Code"
                  placeholder="12345"
                />
              </div>
              <Button type="submit" className="w-full">
                {editingOrg ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Organizations</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={organizations || []}
            isLoading={isLoading}
            searchKey="name"
            onSearch={setSearch}
          />
        </CardContent>
      </Card>
    </div>
  );
}