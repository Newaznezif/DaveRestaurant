"use client";

import { useState } from "react";
import { useEmployees, useCreateEmployee, useOrganizations } from "@/hooks/use-queries";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAppForm } from "@/hooks/use-form";
import { employeeSchema, EmployeeFormData } from "@/schemas/business.schema";
import { Plus, Edit, Trash2, Shield } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Employee } from "@/types";

const ROLE_OPTIONS = [
  { value: "MANAGER", label: "Manager" },
  { value: "CASHIER", label: "Cashier" },
  { value: "WAITER", label: "Waiter" },
  { value: "KITCHEN_STAFF", label: "Kitchen Staff" },
  { value: "DELIVERY_DRIVER", label: "Delivery Driver" },
];

export default function EmployeesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [search, setSearch] = useState("");

  const { data: employees, isLoading, isError } = useEmployees("");
  const createMutation = useCreateEmployee();

  const form = useAppForm(employeeSchema, {
    defaultValues: {
      userId: "",
      employeeId: "",
      position: "",
      department: "",
      hireDate: "",
      salary: undefined,
      isActive: true,
    },
  });

  const handleAdd = () => {
    setEditingEmployee(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      await createMutation.mutateAsync(data);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };

  const columns = [
    {
      accessorKey: "employeeId",
      header: "Employee ID",
      cell: ({ row }: { row: { original: Employee } }) => (
        <div className="font-medium">{row.original.employeeId}</div>
      ),
    },
    {
      accessorKey: "position",
      header: "Position",
      cell: ({ row }: { row: { original: Employee } }) => row.original.position,
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }: { row: { original: Employee } }) => row.original.department || "-",
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }: { row: { original: Employee } }) => (
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
      cell: ({ row }: { row: { original: Employee } }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
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
        <h2 className="text-3xl font-bold tracking-tight">Employees</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Employee</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Employee ID</label>
                <input
                  type="text"
                  placeholder="EMP-001"
                  className="flex h-9 w-full rounded-md border bg-background px-3 py-2 text-sm mt-1"
                  {...form.register("employeeId")}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Position</label>
                <input
                  type="text"
                  placeholder="Manager"
                  className="flex h-9 w-full rounded-md border bg-background px-3 py-2 text-sm mt-1"
                  {...form.register("position")}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Department</label>
                <input
                  type="text"
                  placeholder="Operations"
                  className="flex h-9 w-full rounded-md border bg-background px-3 py-2 text-sm mt-1"
                  {...form.register("department")}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Hire Date</label>
                <input
                  type="date"
                  className="flex h-9 w-full rounded-md border bg-background px-3 py-2 text-sm mt-1"
                  {...form.register("hireDate")}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Salary</label>
                <input
                  type="number"
                  placeholder="50000"
                  className="flex h-9 w-full rounded-md border bg-background px-3 py-2 text-sm mt-1"
                  {...form.register("salary", { valueAsNumber: true })}
                />
              </div>
              <Button type="submit" className="w-full">
                Create
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={employees || []}
            isLoading={isLoading}
            searchKey="employeeId"
            onSearch={setSearch}
          />
        </CardContent>
      </Card>
    </div>
  );
}