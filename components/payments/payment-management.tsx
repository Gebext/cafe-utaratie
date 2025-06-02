"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

import { PaymentDialog } from "./payment-dialog";
import { PaymentDetailDialog } from "./payment-detail-dialog";
import type { Payment, PaymentFilters, ApiResponse } from "./types";
import { PaymentStats } from "./PaymentStats";
import { PaymentFilter } from "./PaymentFilters";
import { PaymentTable } from "./PaymentTable";
import Pagination from "../ui/pagination";

export function PaymentManagement() {
  // State
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<PaymentFilters>({
    tanggal: "",
    metode: "",
    referensi: "",
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [viewingPayment, setViewingPayment] = useState<Payment | null>(null);

  // Fetch data
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build URL with filters and pagination
        const params = new URLSearchParams();

        // Add pagination parameters
        params.append("limit", limit.toString());
        params.append("offset", offset.toString());

        // Add filters
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value.trim() !== "") {
            params.append(key, value);
          }
        });

        // Add search term
        if (searchTerm && searchTerm.trim() !== "") {
          params.append("search", searchTerm);
        }

        const url = `/api/pembayaran?${params.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

        if (result.status === "success") {
          setPayments(result.data);
          setTotal(result.pagination.total);
        } else {
          throw new Error(result.message || "Failed to fetch data");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [filters, searchTerm, limit, offset]);

  // Calculate statistics (for current page data)
  const totalAmount = payments.reduce(
    (sum, payment) => sum + Number.parseFloat(payment.Jumlah),
    0
  );
  const methodStats = payments.reduce((acc, payment) => {
    acc[payment.Metode_Pembayaran] = (acc[payment.Metode_Pembayaran] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Handle pagination
  const handlePageChange = (newOffset: number) => {
    setOffset(newOffset);
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setOffset(0); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters({
      tanggal: "",
      metode: "",
      referensi: "",
    });
    setSearchTerm("");
    setOffset(0); // Reset to first page when clearing filters
  };

  // Handle search term change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setOffset(0); // Reset to first page when search changes
  };

  // Handle payment actions
  const handleAddPayment = (paymentData: Omit<Payment, "ID_Pembayaran">) => {
    const newPayment: Payment = {
      ...paymentData,
      ID_Pembayaran: Math.max(0, ...payments.map((p) => p.ID_Pembayaran)) + 1,
    };
    setPayments([newPayment, ...payments]);
    setIsAddDialogOpen(false);
    // Refresh data to get updated pagination
    setOffset(0);
  };

  const handleEditPayment = (paymentData: Omit<Payment, "ID_Pembayaran">) => {
    if (editingPayment) {
      setPayments(
        payments.map((p) =>
          p.ID_Pembayaran === editingPayment.ID_Pembayaran
            ? { ...paymentData, ID_Pembayaran: editingPayment.ID_Pembayaran }
            : p
        )
      );
      setEditingPayment(null);
    }
  };

  const handleViewDetail = (payment: Payment) => {
    setViewingPayment(payment);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1
            className="text-3xl font-bold text-[#1e6091]"
            style={{ fontFamily: "Pirata One, cursive" }}
          >
            Treasure Payments
          </h1>
          <p className="text-muted-foreground">
            Kelola pembayaran dan transaksi keuangan
          </p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#1e6091] hover:bg-[#154c74]"
          style={{ fontFamily: "Pirata One, cursive" }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Pembayaran Baru
        </Button>
      </div>
      {/* Stats Cards */}
      <PaymentStats
        totalPayments={payments.length}
        paginationTotal={total}
        totalAmount={totalAmount}
        methodStats={methodStats}
      />
      {/* Filters */}
      <PaymentFilter
        searchTerm={searchTerm}
        setSearchTerm={handleSearchChange}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />
      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Gagal memuat data pembayaran: {error}
          </AlertDescription>
        </Alert>
      )}
      {/* Data Table with Pagination */}
      <PaymentTable
        payments={payments}
        loading={loading}
        offset={offset}
        limit={limit}
        total={total}
        onPageChange={handlePageChange}
        onViewDetail={handleViewDetail}
        onEdit={setEditingPayment}
      />
      <Pagination
        offset={offset}
        limit={limit}
        total={total}
        onPageChange={handlePageChange}
      />
      ;{/* Dialogs */}
      <PaymentDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddPayment}
        title="Tambah Pembayaran Baru"
        submitText="Tambah Pembayaran"
      />
      <PaymentDialog
        open={!!editingPayment}
        onOpenChange={(open) => !open && setEditingPayment(null)}
        onSubmit={handleEditPayment}
        title="Edit Pembayaran"
        submitText="Simpan Perubahan"
        initialData={editingPayment || undefined}
      />
      <PaymentDetailDialog
        open={!!viewingPayment}
        onOpenChange={(open) => !open && setViewingPayment(null)}
        payment={viewingPayment}
      />
    </div>
  );
}
