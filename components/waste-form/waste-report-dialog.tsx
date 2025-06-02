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

interface WasteReport {
  ID_Karyawan: number;
  Nama_Karyawan: string;
  ID_Produk: number;
  Nama_Produk: string;
  Tanggal_Laporan: string;
  Jenis_Laporan: "Expired" | "Waste" | "Break";
  Jumlah_Terbuang: number;
  Alasan: string;
  Status_Laporan: "Pending" | "Dikonfirmasi" | "Ditindaklanjuti";
}

interface Karyawan {
  ID_Karyawan: number;
  Nama_Karyawan: string;
}

interface Produk {
  ID_Produk: number;
  Nama_Produk: string;
}

interface WasteReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (report: Omit<WasteReport, "ID_Laporan" | "Deleted_At">) => void;
}

export function WasteReportDialog({
  open,
  onOpenChange,
  onSubmit,
}: WasteReportDialogProps) {
  const [formData, setFormData] = useState({
    ID_Karyawan: 0,
    Nama_Karyawan: "",
    ID_Produk: 0,
    Nama_Produk: "",
    Tanggal_Laporan: "",
    Jenis_Laporan: "" as "Expired" | "Waste" | "Break" | "",
    Jumlah_Terbuang: "",
    Alasan: "",
    Status_Laporan: "Pending" as "Pending" | "Dikonfirmasi" | "Ditindaklanjuti",
  });

  const [karyawanList, setKaryawanList] = useState<Karyawan[]>([]);
  const [produkList, setProdukList] = useState<Produk[]>([]);

  const [loadingKaryawan, setLoadingKaryawan] = useState(false);
  const [loadingProduk, setLoadingProduk] = useState(false);

  useEffect(() => {
    if (!open) return;

    setFormData((f) => ({
      ...f,
      ID_Karyawan: 0,
      Nama_Karyawan: "",
      ID_Produk: 0,
      Nama_Produk: "",
      Tanggal_Laporan: new Date().toISOString().split("T")[0],
      Jenis_Laporan: "",
      Jumlah_Terbuang: "",
      Alasan: "",
      Status_Laporan: "Pending",
    }));

    setLoadingKaryawan(true);
    fetch("/api/karyawan")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setKaryawanList(data);
        else setKaryawanList([]);
      })
      .catch(() => setKaryawanList([]))
      .finally(() => setLoadingKaryawan(false));

    setLoadingProduk(true);
    fetch("/api/produk")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProdukList(data);
        else setProdukList([]);
      })
      .catch(() => setProdukList([]))
      .finally(() => setLoadingProduk(false));
  }, [open]);

  useEffect(() => {
    if (!formData.Nama_Karyawan) {
      setFormData((f) => ({ ...f, ID_Karyawan: 0 }));
      return;
    }
    const selected = karyawanList.find(
      (k) => k.Nama_Karyawan === formData.Nama_Karyawan
    );
    setFormData((f) => ({
      ...f,
      ID_Karyawan: selected ? selected.ID_Karyawan : 0,
    }));
  }, [formData.Nama_Karyawan, karyawanList]);

  useEffect(() => {
    if (!formData.Nama_Produk) {
      setFormData((f) => ({ ...f, ID_Produk: 0 }));
      return;
    }
    const selected = produkList.find(
      (p) => p.Nama_Produk === formData.Nama_Produk
    );
    setFormData((f) => ({
      ...f,
      ID_Produk: selected ? selected.ID_Produk : 0,
    }));
  }, [formData.Nama_Produk, produkList]);

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
      ID_Karyawan: formData.ID_Karyawan,
      Nama_Karyawan: formData.Nama_Karyawan,
      ID_Produk: formData.ID_Produk,
      Nama_Produk: formData.Nama_Produk,
      Tanggal_Laporan: new Date(formData.Tanggal_Laporan).toISOString(),
      Jenis_Laporan: formData.Jenis_Laporan,
      Jumlah_Terbuang: Number(formData.Jumlah_Terbuang),
      Alasan: formData.Alasan,
      Status_Laporan: formData.Status_Laporan,
    });

    setFormData({
      ID_Karyawan: 0,
      Nama_Karyawan: "",
      ID_Produk: 0,
      Nama_Produk: "",
      Tanggal_Laporan: new Date().toISOString().split("T")[0],
      Jenis_Laporan: "",
      Jumlah_Terbuang: "",
      Alasan: "",
      Status_Laporan: "Pending",
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle
            className="text-2xl text-[#1e6091] text-center"
            style={{ fontFamily: "Pirata One, cursive" }}
          >
            Tambah Laporan Limbah
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Buat laporan kehilangan bahan baku baru dengan mengisi form di bawah
            ini.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6 py-2">
            {/* Section 1: Data Karyawan dan Produk */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">
                Informasi Karyawan & Produk
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="Nama_Karyawan"
                    className="text-sm font-medium"
                  >
                    Nama Karyawan <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.Nama_Karyawan}
                    onValueChange={(value) =>
                      setFormData({ ...formData, Nama_Karyawan: value })
                    }
                    required
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue
                        placeholder={
                          loadingKaryawan ? "Loading..." : "Pilih Nama Karyawan"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingKaryawan ? (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      ) : karyawanList.length > 0 ? (
                        karyawanList.map((k) => (
                          <SelectItem
                            key={k.ID_Karyawan}
                            value={k.Nama_Karyawan}
                          >
                            {k.Nama_Karyawan}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="empty" disabled>
                          Tidak ada data karyawan
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="Nama_Produk" className="text-sm font-medium">
                    Nama Produk <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.Nama_Produk}
                    onValueChange={(value) =>
                      setFormData({ ...formData, Nama_Produk: value })
                    }
                    required
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue
                        placeholder={
                          loadingProduk ? "Loading..." : "Pilih Nama Produk"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingProduk ? (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      ) : produkList.length > 0 ? (
                        produkList.map((p) => (
                          <SelectItem key={p.ID_Produk} value={p.Nama_Produk}>
                            {p.Nama_Produk}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="empty" disabled>
                          Tidak ada data produk
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Section 2: Detail Laporan */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">
                Detail Laporan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="Tanggal_Laporan"
                    className="text-sm font-medium"
                  >
                    Tanggal Laporan <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="Tanggal_Laporan"
                    type="date"
                    className="h-11"
                    value={formData.Tanggal_Laporan}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        Tanggal_Laporan: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="Jenis_Laporan"
                    className="text-sm font-medium"
                  >
                    Jenis Laporan <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.Jenis_Laporan}
                    onValueChange={(value) =>
                      setFormData({ ...formData, Jenis_Laporan: value as any })
                    }
                    required
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Pilih jenis laporan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Expired">Expired</SelectItem>
                      <SelectItem value="Waste">Waste</SelectItem>
                      <SelectItem value="Break">Break</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="Jumlah_Terbuang"
                    className="text-sm font-medium"
                  >
                    Jumlah Terbuang <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="Jumlah_Terbuang"
                    type="number"
                    min={0}
                    step="0.01"
                    className="h-11"
                    placeholder="Masukkan jumlah"
                    value={formData.Jumlah_Terbuang}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        Jumlah_Terbuang: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="Status_Laporan"
                    className="text-sm font-medium"
                  >
                    Status Laporan <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.Status_Laporan}
                    onValueChange={(value) =>
                      setFormData({ ...formData, Status_Laporan: value as any })
                    }
                    required
                  >
                    <SelectTrigger className="h-11">
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
            </div>

            {/* Section 3: Alasan */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">
                Keterangan
              </h3>
              <div className="space-y-2">
                <Label htmlFor="Alasan" className="text-sm font-medium">
                  Alasan <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="Alasan"
                  className="min-h-[100px] resize-none"
                  placeholder="Jelaskan alasan terjadinya limbah/kehilangan..."
                  value={formData.Alasan}
                  onChange={(e) =>
                    setFormData({ ...formData, Alasan: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-11"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 bg-[#1e6091] hover:bg-[#1e6091]/90"
            >
              Tambah Laporan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
