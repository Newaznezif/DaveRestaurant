"use client";

import { useState } from "react";
import { useCategories, useProducts, useCreateCategory, useCreateProduct } from "@/hooks/use-queries";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAppForm } from "@/hooks/use-form";
import { categorySchema, productSchema, CategoryFormData, ProductFormData } from "@/schemas/business.schema";
import { Plus, Edit, Trash2, Package, Tag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Category, Product } from "@/types";

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState<"categories" | "products">("categories");
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: categories, isLoading: categoriesLoading } = useCategories("");
  const { data: products, isLoading: productsLoading } = useProducts("");
  const createCategoryMutation = useCreateCategory();
  const createProductMutation = useCreateProduct();

  const categoryForm = useAppForm(categorySchema, {
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
      sortOrder: 0,
      organizationId: "",
    },
  });

  const productForm = useAppForm(productSchema, {
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      cost: undefined,
      isActive: true,
      isAvailable: true,
      categoryId: "",
      organizationId: "",
    },
  });

  const onCategorySubmit = async (data: CategoryFormData) => {
    try {
      await createCategoryMutation.mutateAsync(data);
      setIsCategoryDialogOpen(false);
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const onProductSubmit = async (data: ProductFormData) => {
    try {
      await createProductMutation.mutateAsync(data);
      setIsProductDialogOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const categoryColumns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }: { row: { original: Category } }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }: { row: { original: Category } }) => row.original.description || "-",
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }: { row: { original: Category } }) => (
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
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: Category } }) => (
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

  const productColumns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }: { row: { original: Product } }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }: { row: { original: Product } }) => formatCurrency(row.original.price),
    },
    {
      accessorKey: "isAvailable",
      header: "Available",
      cell: ({ row }: { row: { original: Product } }) => (
        <span
          className={
            row.original.isAvailable
              ? "text-green-600"
              : "text-red-600"
          }
        >
          {row.original.isAvailable ? "Yes" : "No"}
        </span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Active",
      cell: ({ row }: { row: { original: Product } }) => (
        <span
          className={
            row.original.isActive
              ? "text-green-600"
              : "text-red-600"
          }
        >
          {row.original.isActive ? "Yes" : "No"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: Product } }) => (
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
        <h2 className="text-3xl font-bold tracking-tight">Menu Management</h2>
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === "categories" ? "default" : "outline"}
            onClick={() => setActiveTab("categories")}
          >
            Categories
          </Button>
          <Button
            variant={activeTab === "products" ? "default" : "outline"}
            onClick={() => setActiveTab("products")}
          >
            Products
          </Button>
        </div>
      </div>

      {activeTab === "categories" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Categories</CardTitle>
              <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Category</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <input
                        type="text"
                        placeholder="Category name"
                        className="flex h-9 w-full rounded-md border bg-background px-3 py-2 text-sm mt-1"
                        {...categoryForm.register("name")}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <textarea
                        placeholder="Category description"
                        className="flex w-full rounded-md border bg-background px-3 py-2 text-sm mt-1"
                        {...categoryForm.register("description")}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Create
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={categoryColumns}
              data={categories || []}
              isLoading={categoriesLoading}
              searchKey="name"
              onSearch={setSearch}
            />
          </CardContent>
        </Card>
      )}

      {activeTab === "products" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Products</CardTitle>
              <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Product</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={productForm.handleSubmit(onProductSubmit)} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <input
                        type="text"
                        placeholder="Product name"
                        className="flex h-9 w-full rounded-md border bg-background px-3 py-2 text-sm mt-1"
                        {...productForm.register("name")}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <textarea
                        placeholder="Product description"
                        className="flex w-full rounded-md border bg-background px-3 py-2 text-sm mt-1"
                        {...productForm.register("description")}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Price</label>
                        <input
                          type="number"
                          placeholder="0.00"
                          className="flex h-9 w-full rounded-md border bg-background px-3 py-2 text-sm mt-1"
                          {...productForm.register("price", { valueAsNumber: true })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Cost</label>
                        <input
                          type="number"
                          placeholder="0.00"
                          className="flex h-9 w-full rounded-md border bg-background px-3 py-2 text-sm mt-1"
                          {...productForm.register("cost", { valueAsNumber: true })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <select
                        className="flex h-9 w-full rounded-md border bg-background px-3 py-2 text-sm mt-1"
                        {...productForm.register("categoryId")}
                      >
                        <option value="">Select category</option>
                        {categories?.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <Button type="submit" className="w-full">
                      Create
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={productColumns}
              data={products || []}
              isLoading={productsLoading}
              searchKey="name"
              onSearch={setSearch}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}