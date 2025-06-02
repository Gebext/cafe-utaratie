"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { SupplierHeader } from "./SupplierHeader";
import { SupplierStats } from "./SupplierStats";
import { SupplierFilters } from "./SupplierFilters";
import { SupplierTable } from "./SupplierTable";
import { SupplierDialog } from "./supplier-dialog";
import { DeleteSupplierDialog } from "./delete-supplier-dialog";
import { SupplierDetailDialog } from "./supplier-detail-dialog";
import Pagination from "../ui/pagination";

export interface Supplier {
  ID_Supplier: number;
  Nama_Supplier: string;
  Nama_Kategori: string;
  Alamat: string;
  Nomor_Kontak: string;
  ID_Kategori?: number;
  Deleted_at?: number;
}

export interface Category {
  ID_Kategori: number;
  Nama_Kategori: string;
  Deleted_At: string | null;
}

const CATEGORY_BADGE_VARIANTS: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  Bahan_Makanan: "default",
  Bumbu: "secondary",
  Minuman: "outline",
  Baratie: "destructive",
  Sayuran: "secondary",
  "Ikan Segar": "default",
  Daging: "destructive",
  Lainnya: "secondary",
};

export default function SupplierManagement() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10); // ✅ hanya 10 data per halaman
  const [total, setTotal] = useState(0);

  const [showDialog, setShowDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/kategori-produk");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const json = await res.json();
        const categoriesData: Category[] = json.data;
        setCategories([
          { ID_Kategori: 0, Nama_Kategori: "all", Deleted_At: null },
          ...categoriesData,
        ]);
      } catch {
        toast.error("Gagal memuat data kategori");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setOffset(0);
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    if (categories.length === 0) return;

    const fetchSuppliers = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchTerm.trim() !== "") params.append("search", searchTerm);
        if (selectedCategory !== "all") {
          const selectedCatObj = categories.find(
            (cat) => cat.Nama_Kategori === selectedCategory
          );
          if (selectedCatObj) {
            params.append("id_kategori", selectedCatObj.ID_Kategori.toString());
          }
        }

        const page = Math.floor(offset / limit) + 1;
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        const res = await fetch(`/api/supplier?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch suppliers");

        const json = await res.json();
        setSuppliers(json.data); // tampilkan data dari backend (max 10)
        setTotal(json.pagination.total);
      } catch {
        toast.error("Gagal memuat data supplier");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuppliers();
  }, [searchTerm, selectedCategory, categories, offset, limit]);

  const openAddDialog = () => {
    setSelectedSupplier(null);
    setShowDialog(true);
  };
  const openEditDialog = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowDialog(true);
  };
  const openDeleteDialog = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowDeleteDialog(true);
  };
  const openDetailDialog = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowDetailDialog(true);
  };

  async function handleSaveSupplier(
    data: Omit<Supplier, "ID_Supplier" | "Nama_Kategori">
  ) {
    try {
      if (selectedSupplier) {
        const res = await fetch(
          `/api/supplier/${selectedSupplier.ID_Supplier}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );
        if (!res.ok) throw new Error("Failed to update supplier");

        const updatedSupplier = await res.json();

        setSuppliers((prev) =>
          prev.map((sup) =>
            sup.ID_Supplier === selectedSupplier.ID_Supplier
              ? { ...sup, ...updatedSupplier.data }
              : sup
          )
        );
        toast.success("Supplier berhasil diperbarui");
      } else {
        const res = await fetch("/api/supplier", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to add supplier");

        const newSupplier = await res.json();
        setSuppliers((prev) => [...prev, newSupplier.data]);
        toast.success("Supplier berhasil ditambahkan");
      }
      setShowDialog(false);
      setSelectedSupplier(null);
    } catch {
      toast.error("Gagal menyimpan data supplier");
    }
  }

  async function handleDeleteSupplier() {
    if (!selectedSupplier) return;
    try {
      const res = await fetch(`/api/supplier/${selectedSupplier.ID_Supplier}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete supplier");

      setSuppliers((prev) =>
        prev.filter((sup) => sup.ID_Supplier !== selectedSupplier.ID_Supplier)
      );

      toast.success("Supplier berhasil dihapus");
      setShowDeleteDialog(false);
      setSelectedSupplier(null);
    } catch {
      toast.error("Gagal menghapus supplier");
    }
  }

  const getCategoryBadgeVariant = (category: string) =>
    CATEGORY_BADGE_VARIANTS[category] || "default";

  return (
    <div className="space-y-6">
      <SupplierHeader onAddClick={openAddDialog} />
      <SupplierStats
        totalSuppliers={suppliers.length}
        categoriesCount={categories.length - 1}
        baratieCount={
          suppliers.filter((s) => s.Nama_Supplier.includes("Baratie")).length
        }
      />
      <SupplierFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categories={categories.map((c) => c.Nama_Kategori)}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <SupplierTable
        suppliers={suppliers}
        isLoading={isLoading}
        onView={openDetailDialog}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
        getCategoryBadgeVariant={getCategoryBadgeVariant}
      />

      <Pagination
        offset={offset}
        limit={limit}
        total={total}
        onPageChange={setOffset}
      />

      <SupplierDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        initialData={selectedSupplier || undefined}
        title={selectedSupplier ? "Edit Supplier" : "Tambah Supplier"}
        submitText={selectedSupplier ? "Update" : "Tambah"}
        onSubmit={handleSaveSupplier}
      />

      <DeleteSupplierDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        supplier={selectedSupplier}
        onDelete={handleDeleteSupplier}
      />

      <SupplierDetailDialog
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        supplier={selectedSupplier}
      />
    </div>
  );
}
