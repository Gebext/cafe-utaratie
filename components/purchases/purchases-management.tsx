"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { PurchaseStats } from "./purchase-stats";
import { PurchaseFilter } from "./purchase-filter";
import { PurchaseTable } from "./purchase-table";
import { PurchaseDialog } from "./purchase-dialog";
import { PurchaseDetailDialog } from "./purchase-detail-dialog";
import type { Purchase, PurchaseFilters, ApiResponse } from "./types";
import Pagination from "../ui/pagination";

export function PurchaseManagement() {
  // State
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<PurchaseFilters>({
    start_date: "",
    end_date: "",
    is_paid: "",
    nama_supplier: "",
    nama_produk: "",
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [viewingPurchase, setViewingPurchase] = useState<Purchase | null>(null);

  // Fetch data
  useEffect(() => {
    const fetchPurchases = async () => {
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

        const url = `${
          process.env.NEXT_PUBLIC_API
        }/api/pembelian?${params.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

        if (result.status === "success") {
          setPurchases(result.data);
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

    fetchPurchases();
  }, [filters, searchTerm, limit, offset]);

  // Helper function to determine if a purchase is paid
  const isPurchasePaid = (purchase: Purchase): boolean => {
    if (typeof purchase.Is_Paid === "boolean") {
      return purchase.Is_Paid;
    } else if (typeof purchase.Is_Paid === "string") {
      return (
        purchase.Is_Paid === "1" || purchase.Is_Paid.toLowerCase() === "true"
      );
    } else {
      return purchase.Is_Paid === 1;
    }
  };

  // Calculate statistics (for current page data)
  const totalAmount = purchases.reduce(
    (sum, purchase) => sum + Number.parseFloat(purchase.Total_Biaya),
    0
  );
  const unpaidCount = purchases.filter((p) => !isPurchasePaid(p)).length;
  const unpaidAmount = purchases
    .filter((p) => !isPurchasePaid(p))
    .reduce(
      (sum, purchase) => sum + Number.parseFloat(purchase.Total_Biaya),
      0
    );

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
      start_date: "",
      end_date: "",
      is_paid: "",
      nama_supplier: "",
      nama_produk: "",
    });
    setSearchTerm("");
    setOffset(0); // Reset to first page when clearing filters
  };

  // Handle search term change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setOffset(0); // Reset to first page when search changes
  };

  // Handle purchase actions
  const handleAddPurchase = (purchaseData: Omit<Purchase, "ID_Pembelian">) => {
    const newPurchase: Purchase = {
      ...purchaseData,
      ID_Pembelian: Math.max(0, ...purchases.map((p) => p.ID_Pembelian)) + 1,
    };
    setPurchases([newPurchase, ...purchases]);
    setIsAddDialogOpen(false);
    // Refresh data to get updated pagination
    setOffset(0);
  };

  const handleEditPurchase = (purchaseData: Omit<Purchase, "ID_Pembelian">) => {
    if (editingPurchase) {
      setPurchases(
        purchases.map((p) =>
          p.ID_Pembelian === editingPurchase.ID_Pembelian
            ? { ...purchaseData, ID_Pembelian: editingPurchase.ID_Pembelian }
            : p
        )
      );
      setEditingPurchase(null);
    }
  };

  const handleViewDetail = (purchase: Purchase) => {
    setViewingPurchase(purchase);
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
            Treasure Acquisitions
          </h1>
          <p className="text-muted-foreground">
            Kelola pembelian bahan baku dan inventori
          </p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#1e6091] hover:bg-[#154c74]"
          style={{ fontFamily: "Pirata One, cursive" }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Pembelian Baru
        </Button>
      </div>

      {/* Stats Cards */}
      <PurchaseStats
        totalPurchases={purchases.length}
        paginationTotal={total}
        totalAmount={totalAmount}
        unpaidCount={unpaidCount}
        unpaidAmount={unpaidAmount}
      />

      {/* Filters */}
      <PurchaseFilter
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
            Gagal memuat data pembelian: {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Data Table with Pagination */}
      <PurchaseTable
        purchases={purchases}
        loading={loading}
        total={total}
        onViewDetail={handleViewDetail}
        onEdit={setEditingPurchase}
      />

      <Pagination
        offset={offset}
        limit={limit}
        total={total}
        onPageChange={handlePageChange}
      />

      {/* Dialogs */}
      <PurchaseDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddPurchase}
        title="Tambah Pembelian Baru"
        submitText="Tambah Pembelian"
      />

      <PurchaseDialog
        open={!!editingPurchase}
        onOpenChange={(open) => !open && setEditingPurchase(null)}
        onSubmit={handleEditPurchase}
        title="Edit Pembelian"
        submitText="Simpan Perubahan"
        initialData={editingPurchase || undefined}
      />

      <PurchaseDetailDialog
        open={!!viewingPurchase}
        onOpenChange={(open) => !open && setViewingPurchase(null)}
        purchase={viewingPurchase}
      />
    </div>
  );
}
