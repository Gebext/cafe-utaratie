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
import type { Payment } from "./types";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payment: Omit<Payment, "ID_Pembayaran">) => void;
  title: string;
  submitText: string;
  initialData?: Payment;
}

export function PaymentDialog({
  open,
  onOpenChange,
  onSubmit,
  title,
  submitText,
  initialData,
}: PaymentDialogProps) {
  const [formData, setFormData] = useState({
    Tanggal_Pembayaran: "",
    Metode_Pembayaran: "",
    Jumlah: "",
    Nomor_Referensi: "",
    ID_Pembelian: "",
    Nama_Supplier: "",
    Nama_Karyawan: "",
    Nama_Produk: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        Tanggal_Pembayaran: new Date(initialData.Tanggal_Pembayaran)
          .toISOString()
          .split("T")[0],
        Metode_Pembayaran: initialData.Metode_Pembayaran,
        Jumlah: initialData.Jumlah,
        Nomor_Referensi: initialData.Nomor_Referensi,
        ID_Pembelian: initialData.ID_Pembelian.toString(),
        Nama_Supplier: initialData.Nama_Supplier,
        Nama_Karyawan: initialData.Nama_Karyawan,
        Nama_Produk: initialData.Nama_Produk,
      });
    } else {
      setFormData({
        Tanggal_Pembayaran: new Date().toISOString().split("T")[0],
        Metode_Pembayaran: "",
        Jumlah: "",
        Nomor_Referensi: "",
        ID_Pembelian: "",
        Nama_Supplier: "",
        Nama_Karyawan: "",
        Nama_Produk: "",
      });
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.Tanggal_Pembayaran ||
      !formData.Metode_Pembayaran ||
      !formData.Jumlah ||
      !formData.Nomor_Referensi
    ) {
      return;
    }

    onSubmit({
      Tanggal_Pembayaran: new Date(formData.Tanggal_Pembayaran).toISOString(),
      Metode_Pembayaran: formData.Metode_Pembayaran,
      Jumlah: formData.Jumlah,
      Nomor_Referensi: formData.Nomor_Referensi,
      ID_Pembelian: Number.parseInt(formData.ID_Pembelian),
      Nama_Supplier: formData.Nama_Supplier,
      Nama_Karyawan: formData.Nama_Karyawan,
      Nama_Produk: formData.Nama_Produk,
    });

    setFormData({
      Tanggal_Pembayaran: new Date().toISOString().split("T")[0],
      Metode_Pembayaran: "",
      Jumlah: "",
      Nomor_Referensi: "",
      ID_Pembelian: "",
      Nama_Supplier: "",
      Nama_Karyawan: "",
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
              ? "Edit informasi pembayaran"
              : "Tambahkan pembayaran baru"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="Tanggal_Pembayaran">Tanggal Pembayaran</Label>
                <Input
                  id="Tanggal_Pembayaran"
                  type="date"
                  value={formData.Tanggal_Pembayaran}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      Tanggal_Pembayaran: e.target.value,
                    })
                  }
                  className="border-[#c9d6df] focus-visible:ring-[#1e6091]"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="Metode_Pembayaran">Metode Pembayaran</Label>
                <Select
                  value={formData.Metode_Pembayaran}
                  onValueChange={(value) =>
                    setFormData({ ...formData, Metode_Pembayaran: value })
                  }
                >
                  <SelectTrigger className="border-[#c9d6df] focus:ring-[#1e6091]">
                    <SelectValue placeholder="Pilih metode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tunai">Tunai</SelectItem>
                    <SelectItem value="Transfer Bank">Transfer Bank</SelectItem>
                    <SelectItem value="Kartu Kredit">Kartu Kredit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="Jumlah">Jumlah (Rp)</Label>
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
              <div className="grid gap-2">
                <Label htmlFor="Nomor_Referensi">Nomor Referensi</Label>
                <Input
                  id="Nomor_Referensi"
                  value={formData.Nomor_Referensi}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      Nomor_Referensi: e.target.value,
                    })
                  }
                  placeholder="REF-001"
                  className="border-[#c9d6df] focus-visible:ring-[#1e6091]"
                  required
                />
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
