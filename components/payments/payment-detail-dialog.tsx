"use client";

import { DialogFooter } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar,
  User,
  Package,
  CreditCard,
  Hash,
  Building,
} from "lucide-react";
import { formatCurrency, getPaymentMethodBadge } from "./utils";
import type { Payment } from "./types";

interface PaymentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment | null;
}

export function PaymentDetailDialog({
  open,
  onOpenChange,
  payment,
}: PaymentDetailDialogProps) {
  if (!payment) return null;

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Get method badge
  const method = getPaymentMethodBadge(payment.Metode_Pembayaran);

  // Get One Piece themed method description
  const getMethodDescription = (method: string) => {
    switch (method) {
      case "Tunai":
        return "Pembayaran dengan Berry tunai, mata uang resmi dunia bajak laut";
      case "Transfer Bank":
        return "Transfer melalui jaringan perbankan antar pulau";
      case "Kartu Kredit":
        return "Pembayaran menggunakan kartu kredit dari World Government Bank";
      default:
        return "Metode pembayaran khusus untuk transaksi restoran";
    }
  };

  const onBayar = () => {};

  // Format date with time
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle
            className="text-[#1e6091]"
            style={{ fontFamily: "Pirata One, cursive" }}
          >
            Detail Pembayaran #{payment.ID_Pembayaran}
          </DialogTitle>
          <DialogDescription>
            Informasi lengkap tentang transaksi pembayaran
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-[#c9d6df]">
              <div>
                <h3 className="text-lg font-bold">Pembayaran Berhasil</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={method.variant} className={method.color}>
                    {payment.Metode_Pembayaran}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Pembelian #{payment.ID_Pembelian}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(payment.Jumlah)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Dibayar
                </div>
              </div>
            </div>

            {/* Reference Number */}
            <div className="p-2 border border-[#c9d6df] rounded-lg bg-blue-50">
              <div className="flex items-center gap-2 mb-1">
                <Hash className="h-4 w-4 text-[#1e6091]" />
                <h4 className="font-medium text-[#1e6091] text-sm">
                  Nomor Referensi
                </h4>
              </div>
              <div className="font-mono text-md font-bold bg-white px-2 py-1 rounded border">
                {payment.Nomor_Referensi}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Simpan nomor ini sebagai bukti pembayaran
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-[#c9d6df] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-[#1e6091]" />
                  <h4 className="font-medium text-[#1e6091]">
                    Tanggal & Waktu
                  </h4>
                </div>
                <p className="text-sm">
                  {formatDateTime(payment.Tanggal_Pembayaran)}
                </p>
              </div>
              <div className="p-4 border border-[#c9d6df] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-[#1e6091]" />
                  <h4 className="font-medium text-[#1e6091]">
                    Penanggung Jawab
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6 bg-[#1e6091] text-white">
                    <AvatarFallback className="text-xs">
                      {getInitials(payment.Nama_Karyawan)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{payment.Nama_Karyawan}</span>
                </div>
              </div>
              <div className="p-4 border border-[#c9d6df] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-[#1e6091]" />
                  <h4 className="font-medium text-[#1e6091]">Produk</h4>
                </div>
                <p className="text-sm font-medium">{payment.Nama_Produk}</p>
              </div>
              <div className="p-4 border border-[#c9d6df] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Building className="h-4 w-4 text-[#1e6091]" />
                  <h4 className="font-medium text-[#1e6091]">Supplier</h4>
                </div>
                <p className="text-sm">{payment.Nama_Supplier}</p>
              </div>
            </div>

            {/* Payment Method Details */}
            <div className="p-4 border border-[#c9d6df] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-[#1e6091]" />
                <h4 className="font-medium text-[#1e6091]">
                  Metode Pembayaran
                </h4>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={method.variant} className={method.color}>
                  {payment.Metode_Pembayaran}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {getMethodDescription(payment.Metode_Pembayaran)}
              </p>
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
