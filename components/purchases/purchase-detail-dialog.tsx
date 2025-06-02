"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

interface PurchaseDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchase: Purchase | null;
}

export function PurchaseDetailDialog({
  open,
  onOpenChange,
  purchase,
}: PurchaseDetailDialogProps) {
  if (!purchase) return null;

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Get status badge
  const paidStatus =
    typeof purchase.Is_Paid === "string"
      ? Number.parseInt(purchase.Is_Paid)
      : purchase.Is_Paid;
  const status = getPaymentStatusBadge(paidStatus);

  // Get One Piece themed descriptions
  const getStatusDescription = (isPaid: number | string) => {
    const paidStatus =
      typeof isPaid === "string" ? Number.parseInt(isPaid) : isPaid;
    return paidStatus === 1
      ? "Pembayaran telah diselesaikan dengan sempurna"
      : "Masih ada hutang yang perlu diselesaikan dengan supplier";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle
            className="text-[#1e6091]"
            style={{ fontFamily: "Pirata One, cursive" }}
          >
            Detail Pembelian #{purchase.ID_Pembelian}
          </DialogTitle>
          <DialogDescription>
            Informasi lengkap tentang transaksi pembelian
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-6">
            {/* Header Info */}
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

            {/* Transaction ID */}
            <div className="p-2 border border-[#c9d6df] rounded-lg bg-blue-50">
              <div className="flex items-center gap-2 mb-1">
                <Hash className="h-4 w-4 text-[#1e6091]" />
                <h4 className="font-medium text-[#1e6091] text-sm">
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

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-[#c9d6df] rounded-lg">
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
              <div className="p-4 border border-[#c9d6df] rounded-lg">
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
              <div className="p-4 border border-[#c9d6df] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-[#1e6091]" />
                  <h4 className="font-medium text-[#1e6091]">Produk</h4>
                </div>
                <p className="text-sm font-medium">{purchase.Nama_Produk}</p>
                <p className="text-xs text-muted-foreground">
                  Jumlah: {purchase.Jumlah} unit
                </p>
              </div>
              <div className="p-4 border border-[#c9d6df] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Building className="h-4 w-4 text-[#1e6091]" />
                  <h4 className="font-medium text-[#1e6091]">Supplier</h4>
                </div>
                <p className="text-sm">{purchase.Nama_Supplier}</p>
              </div>
            </div>

            {/* Payment Status Details */}
            <div className="p-4 border border-[#c9d6df] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-[#1e6091]" />
                <h4 className="font-medium text-[#1e6091]">
                  Status Pembayaran
                </h4>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {getStatusDescription(purchase.Is_Paid)}
              </p>
            </div>

            {/* Cost Breakdown */}
            <div className="p-4 border border-[#c9d6df] rounded-lg bg-green-50">
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
                      Number.parseFloat(purchase.Total_Biaya) / purchase.Jumlah
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
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
