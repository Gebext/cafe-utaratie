"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Category = {
  ID_Kategori: number;
  Nama_Kategori: string;
};

type Supplier = {
  ID_Supplier: number;
  Nama_Supplier: string;
  Alamat: string;
  Nomor_Kontak: string;
  Deleted_At: string;
  ID_Kategori: number;
};

type Product = {
  ID_Produk: number | undefined;
  Nama_Produk: string;
  ID_Kategori: number;
  Harga: number;
  Stok: number;
  ID_Supplier: number;
  Nama_Kategori: string;
};

type ProductDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (produk: Product) => void;
  defaultValue?: Product;
};

export default function ProductDialog({
  open,
  onOpenChange,
  onSuccess,
  defaultValue,
}: ProductDialogProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  // Inisialisasi form, jika ada defaultValue gunakan itu (edit mode)
  const [formData, setFormData] = useState({
    Nama_Produk: defaultValue?.Nama_Produk || "",
    ID_Kategori: defaultValue?.ID_Kategori.toString() || "",
    Harga: defaultValue?.Harga.toString() || "",
    Stok: defaultValue?.Stok.toString() || "",
    ID_Supplier: defaultValue?.ID_Supplier.toString() || "",
  });

  // Update formData kalau defaultValue berubah (misal buka dialog edit produk berbeda)
  useEffect(() => {
    setFormData({
      Nama_Produk: defaultValue?.Nama_Produk || "",
      ID_Kategori: defaultValue?.ID_Kategori?.toString() || "",
      Harga: defaultValue?.Harga?.toString() || "",
      Stok: defaultValue?.Stok?.toString() || "",
      ID_Supplier: defaultValue?.ID_Supplier?.toString() || "",
    });
  }, [defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Validasi sederhana
    if (
      !formData.Nama_Produk.trim() ||
      !formData.ID_Kategori ||
      !formData.Harga ||
      !formData.Stok ||
      !formData.ID_Supplier
    ) {
      toast.error("Semua field harus diisi");
      return;
    }

    const harga = parseInt(formData.Harga);
    const stok = parseInt(formData.Stok);
    const idKategori = parseInt(formData.ID_Kategori);
    const idSupplier = parseInt(formData.ID_Supplier);

    if (
      isNaN(harga) ||
      harga < 0 ||
      isNaN(stok) ||
      stok < 0 ||
      isNaN(idKategori) ||
      isNaN(idSupplier)
    ) {
      toast.error("Field numeric harus diisi dengan angka valid");
      return;
    }

    try {
      // Tentukan method dan URL untuk tambah/edit produk
      const isEdit = Boolean(defaultValue?.ID_Produk);
      const url = isEdit
        ? `/api/produk/${defaultValue?.ID_Produk}`
        : "/api/produk";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Nama_Produk: formData.Nama_Produk,
          ID_Kategori: idKategori,
          Harga: harga,
          Stok: stok,
          ID_Supplier: idSupplier,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan produk");

      toast.success(
        isEdit ? "Produk berhasil diperbarui" : "Produk berhasil ditambahkan"
      );
      onOpenChange(false);
      onSuccess?.(data.data);

      if (!isEdit) {
        setFormData({
          Nama_Produk: "",
          ID_Kategori: "",
          Harga: "",
          Stok: "",
          ID_Supplier: "",
        });
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetch("/api/kategori-produk")
      .then((res) => res.json())
      .then((data) => setCategories(data.data));

    fetch("/api/supplier")
      .then((res) => res.json())
      .then((data) => setSuppliers(data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle
            className="text-[#1e6091]"
            style={{ fontFamily: "Pirata One, cursive" }}
          >
            {defaultValue ? "Edit Menu" : "Tambah Menu Baru"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Nama Produk</Label>
            <Input
              name="Nama_Produk"
              value={formData.Nama_Produk}
              onChange={handleChange}
              placeholder="Contoh: Ikan Hiu"
              className="border-[#c9d6df]"
            />
          </div>

          <div>
            <Label>Kategori</Label>
            <Select
              value={formData.ID_Kategori}
              onValueChange={(val) =>
                setFormData({ ...formData, ID_Kategori: val })
              }
            >
              <SelectTrigger className="border-[#c9d6df]">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem
                    key={category.ID_Kategori}
                    value={category.ID_Kategori.toString()}
                  >
                    {category.Nama_Kategori}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Harga</Label>
            <Input
              type="number"
              name="Harga"
              value={formData.Harga}
              onChange={handleChange}
              placeholder="Contoh: 5000"
              className="border-[#c9d6df]"
            />
          </div>

          <div>
            <Label>Stok</Label>
            <Input
              type="number"
              name="Stok"
              value={formData.Stok}
              onChange={handleChange}
              placeholder="Contoh: 2"
              className="border-[#c9d6df]"
            />
          </div>

          <div>
            <Label>Supplier</Label>
            <Select
              value={formData.ID_Supplier}
              onValueChange={(val) =>
                setFormData({ ...formData, ID_Supplier: val })
              }
            >
              <SelectTrigger className="border-[#c9d6df]">
                <SelectValue placeholder="Pilih supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem
                    key={supplier.ID_Supplier}
                    value={supplier.ID_Supplier.toString()}
                  >
                    {supplier.Nama_Supplier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            className="bg-[#1e6091] hover:bg-[#154c74]"
            style={{ fontFamily: "Pirata One, cursive" }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {defaultValue ? "Simpan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
