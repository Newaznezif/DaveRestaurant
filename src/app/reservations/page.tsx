"use client";

import { useState } from "react";
import { useReservations, useReservationsByDate, useTables } from "@/hooks/use-queries";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField, FormSelect } from "@/components/ui/form-field";
import { useAppForm } from "@/hooks/use-form";
import { reservationSchema, ReservationFormData } from "@/schemas/business.schema";
import { Plus, Edit, Trash2, Calendar, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Reservation, Table } from "@/types";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "SEATED", label: "Seated" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "NO_SHOW", label: "No Show" },
];

export default function ReservationsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [search, setSearch] = useState("");

  const { data: reservations, isLoading, isError } = useReservations("");
  const { data: tables } = useTables("");

  const form = useAppForm(reservationSchema, {
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      partySize: 2,
      date: selectedDate,
      time: "19:00",
      notes: "",
    },
  });

  const columns = [
    {
      accessorKey: "customerName",
      header: "Customer",
      cell: ({ row }: { row: { original: Reservation } }) => (
        <div className="font-medium">{row.original.customerName}</div>
      ),
    },
    {
      accessorKey: "partySize",
      header: "Party Size",
      cell: ({ row }: { row: { original: Reservation } }) => row.original.partySize,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }: { row: { original: Reservation } }) => formatDate(row.original.date),
    },
    {
      accessorKey: "time",
      header: "Time",
      cell: ({ row }: { row: { original: Reservation } }) => row.original.time,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: { original: Reservation } }) => (
        <span className="capitalize px-2 py-1 text-xs rounded-full bg-primary/10">
          {row.original.status.toLowerCase()}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: Reservation } }) => (
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
        <h2 className="text-3xl font-bold tracking-tight">Reservations</h2>
        <div className="flex items-center gap-2">
          <FormField
            form={form}
            name="date"
            type="date"
            className="w-auto"
          />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Reservation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Reservation</DialogTitle>
              </DialogHeader>
              <form className="space-y-4">
                <FormField
                  form={form}
                  name="customerName"
                  label="Customer Name"
                  placeholder="John Doe"
                  required
                />
                <FormField
                  form={form}
                  name="customerPhone"
                  label="Phone"
                  placeholder="+1 (555) 123-4567"
                />
                <FormField
                  form={form}
                  name="customerEmail"
                  label="Email"
                  type="email"
                  placeholder="john@example.com"
                />
                <FormField
                  form={form}
                  name="partySize"
                  label="Party Size"
                  type="number"
                  placeholder="2"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    form={form}
                    name="date"
                    label="Date"
                    type="date"
                    required
                  />
                  <FormField
                    form={form}
                    name="time"
                    label="Time"
                    type="time"
                    required
                  />
                </div>
                <FormSelect
                  form={form}
                  name="tableId"
                  label="Table"
                  options={tables?.map((table) => ({
                    value: table.id,
                    label: `Table ${table.number} (${table.capacity} seats)`,
                  })) || []}
                  placeholder="Select table"
                />
                <Button type="submit" className="w-full">
                  Create
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reservations for {formatDate(selectedDate)}</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={reservations || []}
            isLoading={isLoading}
            searchKey="customerName"
            onSearch={setSearch}
          />
        </CardContent>
      </Card>
    </div>
  );
}