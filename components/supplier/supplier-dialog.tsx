"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Supplier } from "./supplier-management";

interface SupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (supplier: Omit<Supplier, "ID_Supplier" | "Deleted_At">) => void;
  title: string;
  submitText: string;
  initialData?: Supplier;
}

interface Category {
  ID_Kategori: number;
  Nama_Kategori: string;
  Deleted_At: string | null;
}

export function SupplierDialog({
  open,
  onOpenChange,
  onSubmit,
  title,
  submitText,
  initialData,
}: SupplierDialogProps) {
  const [formData, setFormData] = useState({
    Nama_Supplier: "",
    Alamat: "",
    Nomor_Kontak: "",
    ID_Kategori: "",
    Nama_Kategori: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchCategories = async () => {
        setLoadingCategories(true);
        try {
          const res = await fetch("/api/kategori-produk");
          if (!res.ok) throw new Error("Failed to fetch categories");
          const json = await res.json();
          setCategories(json.data);
        } catch {
          // Bisa ganti dengan toast error kalau perlu
          console.error("Gagal memuat kategori");
          setCategories([]);
        } finally {
          setLoadingCategories(false);
        }
      };
      fetchCategories();
    }
  }, [open]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        Nama_Supplier: initialData.Nama_Supplier,
        Alamat: initialData.Alamat,
        Nomor_Kontak: initialData.Nomor_Kontak,
        ID_Kategori: initialData.ID_Kategori?.toString() || "",
        Nama_Kategori: initialData.Nama_Kategori,
      });
    } else {
      setFormData({
        Nama_Supplier: "",
        Alamat: "",
        Nomor_Kontak: "",
        ID_Kategori: "",
        Nama_Kategori: "",
      });
    }
  }, [initialData, open]);

  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find(
      (c) => c.ID_Kategori.toString() === categoryId
    );
    setFormData({
      ...formData,
      ID_Kategori: categoryId,
      Nama_Kategori: category?.Nama_Kategori || "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.Nama_Supplier.trim() ||
      !formData.Alamat.trim() ||
      !formData.Nomor_Kontak.trim() ||
      !formData.ID_Kategori
    ) {
      alert("Semua field harus diisi");
      return;
    }

    onSubmit({
      Nama_Supplier: formData.Nama_Supplier.trim(),
      Alamat: formData.Alamat.trim(),
      Nomor_Kontak: formData.Nomor_Kontak.trim(),
      ID_Kategori: Number(formData.ID_Kategori),
      Nama_Kategori: formData.Nama_Kategori,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle
            className="text-[#1e6091]"
            style={{ fontFamily: "Pirata One, cursive" }}
          >
            {title}
          </DialogTitle>
          <DialogDescription>
            Silahkan isi informasi supplier dengan lengkap.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="nama_supplier">Nama Supplier</Label>
            <Input
              id="nama_supplier"
              value={formData.Nama_Supplier}
              onChange={(e) =>
                setFormData({ ...formData, Nama_Supplier: e.target.value })
              }
              required
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="alamat">Alamat</Label>
            <Textarea
              id="alamat"
              value={formData.Alamat}
              onChange={(e) =>
                setFormData({ ...formData, Alamat: e.target.value })
              }
              required
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="nomor_kontak">Nomor Kontak</Label>
            <Input
              id="nomor_kontak"
              type="tel"
              pattern="[0-9]+"
              value={formData.Nomor_Kontak}
              onChange={(e) =>
                setFormData({ ...formData, Nomor_Kontak: e.target.value })
              }
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="kategori">Kategori</Label>
            <Select
              value={formData.ID_Kategori}
              onValueChange={handleCategoryChange}
              required
              disabled={loadingCategories}
            >
              <SelectTrigger id="kategori" className="w-full">
                <SelectValue
                  placeholder={
                    loadingCategories
                      ? "Memuat kategori..."
                      : "Pilih kategori supplier"
                  }
                  aria-label="Kategori Supplier"
                />
              </SelectTrigger>
              <SelectContent>
                {categories.length === 0 && !loadingCategories && (
                  <SelectItem value="" disabled>
                    Tidak ada kategori
                  </SelectItem>
                )}
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

          <DialogFooter>
            <Button type="submit" disabled={loadingCategories}>
              {submitText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
