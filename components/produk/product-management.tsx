"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CardFilter from "@/components/produk/cardFilter";
import CardTableProduk from "@/components/table/ProdukTable";
import ProductDialog from "./productDialog";
import Pagination from "@/components/ui/pagination";

type Product = {
  ID_Produk: number | undefined;
  Nama_Produk: string;
  ID_Kategori: number;
  Harga: number;
  Stok: number;
  ID_Supplier: number;
  Nama_Kategori: string;
};

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  // pagination
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editData, setEditData] = useState<Product | undefined>(undefined);

  const fetchData = async () => {
    setLoading(true);
    const kategoriParam = selectedCategory === "all" ? "" : selectedCategory;
    try {
      const res = await fetch(
        `/api/produk?limit=${limit}&offset=${offset}&search=${searchTerm}&kategori=${kategoriParam}`
      );
      const data = await res.json();
      setProducts(data.data);
      setTotal(data.pagination.total);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [limit, offset, searchTerm, selectedCategory]);

  useEffect(() => {
    setOffset(0);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1
            className="text-3xl font-bold text-[#1e6091]"
            style={{ fontFamily: "Pirata One, cursive" }}
          >
            Treasure Menu
          </h1>
          <p className="text-muted-foreground">
            Kelola menu makanan dan minuman restoran
          </p>
        </div>
        <Button
          onClick={() => {
            setEditData(undefined); // Reset to create mode
            setIsDialogOpen(true);
          }}
          className="bg-[#1e6091] hover:bg-[#154c74]"
          style={{ fontFamily: "Pirata One, cursive" }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Menu Baru
        </Button>
      </div>

      {/* Filter */}
      <CardFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Table Produk */}
      <CardTableProduk
        description="Kelola semua bahan menu makanan dan minuman di restoran"
        title="Daftar Bahan Baku"
        products={products}
        loading={loading}
        onEdit={(produk) => {
          setEditData(produk);
          setIsDialogOpen(true);
        }}
        onDelete={(deletedProduct) => {
          setProducts((prev) =>
            prev.filter((p) => p.ID_Produk !== deletedProduct.ID_Produk)
          );
          setTotal((prev) => prev - 1);
        }}
      />

      {/* Pagination */}
      <Pagination
        offset={offset}
        limit={limit}
        total={total}
        onPageChange={setOffset}
      />

      {/* Dialog Tambah/Edit Produk */}
      <ProductDialog
        open={isDialogOpen}
        onOpenChange={(val) => {
          setIsDialogOpen(val);
          if (!val) setEditData(undefined);
        }}
        defaultValue={editData}
        onSuccess={(produk) => {
          if (editData) {
            // Update produk yang di-edit
            setProducts((prev) =>
              prev.map((p) => (p.ID_Produk === produk.ID_Produk ? produk : p))
            );
          } else {
            // Tambahkan ke awal (jika offset 0)
            if (offset === 0) {
              setProducts((prev) => [produk, ...prev.slice(0, limit - 1)]);
            }
            setTotal((prev) => prev + 1);
          }
        }}
      />
    </div>
  );
}
