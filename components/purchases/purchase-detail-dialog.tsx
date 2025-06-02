"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Calendar,
  User,
  Package,
  Building,
  Hash,
  DollarSign,
} from "lucide-react";
import { formatCurrency, formatDateTime, getPaymentStatusBadge } from "./utils";
import type { Purchase } from "./types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";

interface PurchaseDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchase: Purchase | null;
  onSuccess?: (updatedPurchase: Purchase) => void;
}

export function PurchaseDetailDialog({
  open,
  onOpenChange,
  purchase,
  onSuccess,
}: PurchaseDetailDialogProps) {
  const [loading, setLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [metodePembayaran, setMetodePembayaran] = useState<string>("");

  if (!purchase) return null;

  const paidStatus =
    typeof purchase.Is_Paid === "string"
      ? Number.parseInt(purchase.Is_Paid)
      : purchase.Is_Paid;
  const status = getPaymentStatusBadge(paidStatus);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

  const getStatusDescription = (isPaid: string | number | boolean) => {
    let paid: number;
    if (typeof isPaid === "boolean") paid = isPaid ? 1 : 0;
    else if (typeof isPaid === "string") paid = parseInt(isPaid);
    else paid = isPaid;

    return paid === 1
      ? "Pembayaran telah diselesaikan dengan sempurna"
      : "Masih ada hutang yang perlu diselesaikan dengan supplier";
  };

  const onBayar = async () => {
    if (!metodePembayaran) {
      toast.error("Mohon pilih metode pembayaran terlebih dahulu");
      return;
    }

    try {
      setLoading(true);
      const nomorReferensi = `INV-${Date.now()}`;

      const response = await fetch(
        `/api/pembelian/bayar/${purchase.ID_Pembelian}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            metode_pembayaran: metodePembayaran,
            nomor_referensi: nomorReferensi,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Gagal membayar");
      }

      toast.success("✅ Pembayaran berhasil diproses");

      const updatedPurchase: Purchase = {
        ...purchase,
        Is_Paid: 1,
      };

      onSuccess?.(updatedPurchase);
      onOpenChange(false);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.message || "Terjadi kesalahan saat memproses pembayaran"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-[#1e6091] font-display">
            Detail Pembelian #{purchase.ID_Pembelian}
          </DialogTitle>
          <DialogDescription>
            Informasi lengkap tentang transaksi pembelian
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Produk & Status */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-[#c9d6df]">
            <div>
              <h3 className="text-lg font-bold">{purchase.Nama_Produk}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={status.variant}>{status.label}</Badge>
                <span className="text-sm text-muted-foreground">
                  Qty: {purchase.Jumlah}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#1e6091]">
                {formatCurrency(purchase.Total_Biaya)}
              </div>
              <div className="text-sm text-muted-foreground">Total Biaya</div>
            </div>
          </div>

          {/* Info Transaksi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg bg-blue-50">
              <div className="flex items-center gap-2 mb-1">
                <Hash className="h-4 w-4 text-[#1e6091]" />
                <h4 className="font-medium text-sm text-[#1e6091]">
                  ID Transaksi
                </h4>
              </div>
              <div className="font-mono text-md font-bold bg-white px-2 py-1 rounded border">
                TRX-{purchase.ID_Pembelian.toString().padStart(6, "0")}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Nomor referensi untuk transaksi ini
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-[#1e6091]" />
                <h4 className="font-medium text-[#1e6091]">
                  Tanggal Pembelian
                </h4>
              </div>
              <p className="text-sm">
                {formatDateTime(purchase.Tanggal_Pembelian)}
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-[#1e6091]" />
                <h4 className="font-medium text-[#1e6091]">Pembeli</h4>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6 bg-[#1e6091] text-white">
                  <AvatarFallback className="text-xs">
                    {getInitials(purchase.Nama_Karyawan)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{purchase.Nama_Karyawan}</span>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-4 w-4 text-[#1e6091]" />
                <h4 className="font-medium text-[#1e6091]">Supplier</h4>
              </div>
              <p className="text-sm">{purchase.Nama_Supplier}</p>
            </div>
          </div>

          {/* Status Pembayaran */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-[#1e6091]" />
              <h4 className="font-medium text-[#1e6091]">Status Pembayaran</h4>
            </div>
            <Badge variant={status.variant}>{status.label}</Badge>
            <p className="text-sm text-muted-foreground mt-2">
              {getStatusDescription(purchase.Is_Paid)}
            </p>
          </div>

          {/* Rincian Biaya */}
          <div className="p-4 border rounded-lg bg-green-50">
            <h4 className="font-medium text-[#1e6091] mb-3">Rincian Biaya</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Jumlah Unit:</span>
                <span>{purchase.Jumlah}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Harga per Unit:</span>
                <span>
                  {formatCurrency(
                    parseFloat(purchase.Total_Biaya) / purchase.Jumlah
                  )}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between font-medium">
                <span>Total Biaya:</span>
                <span className="text-[#1e6091]">
                  {formatCurrency(purchase.Total_Biaya)}
                </span>
              </div>
            </div>
          </div>

          {/* Form Pembayaran */}
          {paidStatus !== 1 && showPaymentForm && (
            <div className="p-4 border rounded-lg bg-yellow-50 space-y-4">
              <h4 className="font-semibold text-[#1e6091]">Pembayaran</h4>
              <div>
                <label className="block text-sm mb-1 font-medium text-gray-700">
                  Metode Pembayaran
                </label>
                <Select
                  value={metodePembayaran}
                  onValueChange={setMetodePembayaran}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih metode pembayaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tunai">Tunai</SelectItem>
                    <SelectItem value="Kartu Kredit">Kartu Kredit</SelectItem>
                    <SelectItem value="Transfer Bank">Transfer Bank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-xs text-muted-foreground">
                Nomor Referensi akan dibuat otomatis saat dikirim.
              </div>
            </div>
          )}
        </div>

        {/* Tombol Aksi */}
        <DialogFooter>
          {paidStatus !== 1 && (
            <Button
              variant="outline"
              onClick={() => {
                if (!showPaymentForm) {
                  setShowPaymentForm(true);
                } else {
                  onBayar();
                }
              }}
              disabled={loading}
            >
              {loading
                ? "Memproses..."
                : showPaymentForm
                ? "Konfirmasi Bayar"
                : "Bayar"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
