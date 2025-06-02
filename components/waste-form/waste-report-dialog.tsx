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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { WasteReport } from "./waste-report-management";

interface WasteReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (report: Omit<WasteReport, "ID_Laporan" | "Deleted_At">) => void;
  title: string;
  submitText: string;
  initialData?: WasteReport;
}

export function WasteReportDialog({
  open,
  onOpenChange,
  onSubmit,
  title,
  submitText,
  initialData,
}: WasteReportDialogProps) {
  const [formData, setFormData] = useState({
    ID_Karyawan: "",
    Nama_Karyawan: "",
    ID_Produk: "",
    Nama_Produk: "",
    Tanggal_Laporan: "",
    Jenis_Laporan: "" as "Expired" | "Waste" | "Break" | "",
    Jumlah_Terbuang: "",
    Alasan: "",
    Status_Laporan: "Pending" as "Pending" | "Dikonfirmasi" | "Ditindaklanjuti",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ID_Karyawan: initialData.ID_Karyawan.toString(),
        Nama_Karyawan: initialData.Nama_Karyawan,
        ID_Produk: initialData.ID_Produk.toString(),
        Nama_Produk: initialData.Nama_Produk,
        Tanggal_Laporan: new Date(initialData.Tanggal_Laporan)
          .toISOString()
          .split("T")[0],
        Jenis_Laporan: initialData.Jenis_Laporan,
        Jumlah_Terbuang: initialData.Jumlah_Terbuang.toString(),
        Alasan: initialData.Alasan,
        Status_Laporan: initialData.Status_Laporan,
      });
    } else {
      setFormData({
        ID_Karyawan: "",
        Nama_Karyawan: "",
        ID_Produk: "",
        Nama_Produk: "",
        Tanggal_Laporan: new Date().toISOString().split("T")[0],
        Jenis_Laporan: "",
        Jumlah_Terbuang: "",
        Alasan: "",
        Status_Laporan: "Pending",
      });
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.ID_Karyawan ||
      !formData.Nama_Karyawan ||
      !formData.ID_Produk ||
      !formData.Nama_Produk ||
      !formData.Tanggal_Laporan ||
      !formData.Jenis_Laporan ||
      !formData.Jumlah_Terbuang ||
      !formData.Alasan
    ) {
      return;
    }

    onSubmit({
      ID_Karyawan: Number.parseInt(formData.ID_Karyawan),
      Nama_Karyawan: formData.Nama_Karyawan,
      ID_Produk: Number.parseInt(formData.ID_Produk),
      Nama_Produk: formData.Nama_Produk,
      Tanggal_Laporan: new Date(formData.Tanggal_Laporan).toISOString(),
      Jenis_Laporan: formData.Jenis_Laporan as "Expired" | "Waste" | "Break",
      Jumlah_Terbuang: Number.parseInt(formData.Jumlah_Terbuang),
      Alasan: formData.Alasan,
      Status_Laporan: formData.Status_Laporan,
    });

    setFormData({
      ID_Karyawan: "",
      Nama_Karyawan: "",
      ID_Produk: "",
      Nama_Produk: "",
      Tanggal_Laporan: new Date().toISOString().split("T")[0],
      Jenis_Laporan: "",
      Jumlah_Terbuang: "",
      Alasan: "",
      Status_Laporan: "Pending",
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
              ? "Edit laporan kehilangan bahan baku"
              : "Buat laporan kehilangan bahan baku baru"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="ID_Karyawan">ID Karyawan</Label>
                <Input
                  id="ID_Karyawan"
                  type="number"
                  value={formData.ID_Karyawan}
                  onChange={(e) =>
                    setFormData({ ...formData, ID_Karyawan: e.target.value })
                  }
                  placeholder="ID Karyawan"
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
                  placeholder="Nama Karyawan"
                  className="border-[#c9d6df] focus-visible:ring-[#1e6091]"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="ID_Produk">ID Produk</Label>
                <Input
                  id="ID_Produk"
                  type="number"
                  value={formData.ID_Produk}
                  onChange={(e) =>
                    setFormData({ ...formData, ID_Produk: e.target.value })
                  }
                  placeholder="ID Produk"
                  className="border-[#c9d6df] focus-visible:ring-[#1e6091]"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="Nama_Produk">Nama Produk</Label>
                <Input
                  id="Nama_Produk"
                  value={formData.Nama_Produk}
                  onChange={(e) =>
                    setFormData({ ...formData, Nama_Produk: e.target.value })
                  }
                  placeholder="Nama Produk"
                  className="border-[#c9d6df] focus-visible:ring-[#1e6091]"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="Tanggal_Laporan">Tanggal Laporan</Label>
                <Input
                  id="Tanggal_Laporan"
                  type="date"
                  value={formData.Tanggal_Laporan}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      Tanggal_Laporan: e.target.value,
                    })
                  }
                  className="border-[#c9d6df] focus-visible:ring-[#1e6091]"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="Jenis_Laporan">Jenis Laporan</Label>
                <Select
                  value={formData.Jenis_Laporan}
                  onValueChange={(value: "Expired" | "Waste" | "Break") =>
                    setFormData({ ...formData, Jenis_Laporan: value })
                  }
                >
                  <SelectTrigger className="border-[#c9d6df] focus:ring-[#1e6091]">
                    <SelectValue placeholder="Pilih jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Expired">Expired</SelectItem>
                    <SelectItem value="Waste">Waste</SelectItem>
                    <SelectItem value="Break">Break</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="Jumlah_Terbuang">Jumlah Terbuang</Label>
                <Input
                  id="Jumlah_Terbuang"
                  type="number"
                  value={formData.Jumlah_Terbuang}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      Jumlah_Terbuang: e.target.value,
                    })
                  }
                  placeholder="Jumlah"
                  className="border-[#c9d6df] focus-visible:ring-[#1e6091]"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="Status_Laporan">Status</Label>
                <Select
                  value={formData.Status_Laporan}
                  onValueChange={(
                    value: "Pending" | "Dikonfirmasi" | "Ditindaklanjuti"
                  ) => setFormData({ ...formData, Status_Laporan: value })}
                >
                  <SelectTrigger className="border-[#c9d6df] focus:ring-[#1e6091]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Dikonfirmasi">Dikonfirmasi</SelectItem>
                    <SelectItem value="Ditindaklanjuti">
                      Ditindaklanjuti
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Alasan">Alasan</Label>
              <Textarea
                id="Alasan"
                value={formData.Alasan}
                onChange={(e) =>
                  setFormData({ ...formData, Alasan: e.target.value })
                }
                placeholder="Jelaskan alasan kehilangan..."
                className="border-[#c9d6df] focus-visible:ring-[#1e6091]"
                rows={3}
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
