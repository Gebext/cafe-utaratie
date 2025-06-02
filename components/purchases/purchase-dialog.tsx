"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Purchase } from "./types";

interface PurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (purchase: Omit<Purchase, "ID_Pembelian">) => void;
  title: string;
  submitText: string;
  initialData?: Purchase;
}

export function PurchaseDialog({
  open,
  onOpenChange,
  onSubmit,
  title,
  submitText,
  initialData,
}: PurchaseDialogProps) {
  const [formData, setFormData] = useState({
    Tanggal_Pembelian: "",
    Jumlah: "",
    Total_Biaya: "",
    Is_Paid: 0,
    ID_Supplier: "",
    Nama_Supplier: "",
    ID_Karyawan: "",
    Nama_Karyawan: "",
    ID_Produk: "",
    Nama_Produk: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        Tanggal_Pembelian: new Date(initialData.Tanggal_Pembelian)
          .toISOString()
          .split("T")[0],
        Jumlah: initialData.Jumlah.toString(),
        Total_Biaya: initialData.Total_Biaya,
        Is_Paid: initialData.Is_Paid,
        ID_Supplier: initialData.ID_Supplier.toString(),
        Nama_Supplier: initialData.Nama_Supplier,
        ID_Karyawan: initialData.ID_Karyawan.toString(),
        Nama_Karyawan: initialData.Nama_Karyawan,
        ID_Produk: initialData.ID_Produk.toString(),
        Nama_Produk: initialData.Nama_Produk,
      });
    } else {
      setFormData({
        Tanggal_Pembelian: new Date().toISOString().split("T")[0],
        Jumlah: "",
        Total_Biaya: "",
        Is_Paid: 0,
        ID_Supplier: "",
        Nama_Supplier: "",
        ID_Karyawan: "",
        Nama_Karyawan: "",
        ID_Produk: "",
        Nama_Produk: "",
      });
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.Tanggal_Pembelian ||
      !formData.Jumlah ||
      !formData.Total_Biaya ||
      !formData.Nama_Supplier
    ) {
      return;
    }

    onSubmit({
      Tanggal_Pembelian: new Date(formData.Tanggal_Pembelian).toISOString(),
      Jumlah: Number.parseInt(formData.Jumlah),
      Total_Biaya: formData.Total_Biaya,
      Is_Paid: formData.Is_Paid,
      ID_Supplier: Number.parseInt(formData.ID_Supplier) || 1,
      Nama_Supplier: formData.Nama_Supplier,
      ID_Karyawan: Number.parseInt(formData.ID_Karyawan) || 1,
      Nama_Karyawan: formData.Nama_Karyawan,
      ID_Produk: Number.parseInt(formData.ID_Produk) || 1,
      Nama_Produk: formData.Nama_Produk,
    });

    setFormData({
      Tanggal_Pembelian: new Date().toISOString().split("T")[0],
      Jumlah: "",
      Total_Biaya: "",
      Is_Paid: 0,
      ID_Supplier: "",
      Nama_Supplier: "",
      ID_Karyawan: "",
      Nama_Karyawan: "",
      ID_Produk: "",
      Nama_Produk: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle
            className="text-[#1e6091]"
            style={{ fontFamily: "Pirata One, cursive" }}
          >
            {title}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Edit informasi pembelian"
              : "Tambahkan pembelian baru"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="Tanggal_Pembelian">Tanggal Pembelian</Label>
                <Input
                  id="Tanggal_Pembelian"
                  type="date"
                  value={formData.Tanggal_Pembelian}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      Tanggal_Pembelian: e.target.value,
                    })
                  }
                  className="border-[#c9d6df] focus-visible:ring-[#1e6091]"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="Jumlah">Jumlah</Label>
                <Input
                  id="Jumlah"
                  type="number"
                  value={formData.Jumlah}
                  onChange={(e) =>
                    setFormData({ ...formData, Jumlah: e.target.value })
                  }
                  placeholder="0"
                  className="border-[#c9d6df] focus-visible:ring-[#1e6091]"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="Total_Biaya">Total Biaya (Rp)</Label>
                <Input
                  id="Total_Biaya"
                  type="number"
                  value={formData.Total_Biaya}
                  onChange={(e) =>
                    setFormData({ ...formData, Total_Biaya: e.target.value })
                  }
                  placeholder="0"
                  className="border-[#c9d6df] focus-visible:ring-[#1e6091]"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="Is_Paid">Status Pembayaran</Label>
                <Select
                  value={formData.Is_Paid.toString()}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      Is_Paid: Number.parseInt(value),
                    })
                  }
                >
                  <SelectTrigger className="border-[#c9d6df] focus:ring-[#1e6091]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Belum Lunas</SelectItem>
                    <SelectItem value="1">Lunas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="Nama_Supplier">Nama Supplier</Label>
                <Input
                  id="Nama_Supplier"
                  value={formData.Nama_Supplier}
                  onChange={(e) =>
                    setFormData({ ...formData, Nama_Supplier: e.target.value })
                  }
                  placeholder="Nama supplier"
                  className="border-[#c9d6df] focus-visible:ring-[#1e6091]"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="Nama_Karyawan">Nama Karyawan</Label>
                <Input
                  id="Nama_Karyawan"
                  value={formData.Nama_Karyawan}
                  onChange={(e) =>
                    setFormData({ ...formData, Nama_Karyawan: e.target.value })
                  }
                  placeholder="Nama karyawan"
                  className="border-[#c9d6df] focus-visible:ring-[#1e6091]"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Nama_Produk">Nama Produk</Label>
              <Input
                id="Nama_Produk"
                value={formData.Nama_Produk}
                onChange={(e) =>
                  setFormData({ ...formData, Nama_Produk: e.target.value })
                }
                placeholder="Nama produk"
                className="border-[#c9d6df] focus-visible:ring-[#1e6091]"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-[#1e6091] hover:bg-[#154c74]"
              style={{ fontFamily: "Pirata One, cursive" }}
            >
              {submitText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
