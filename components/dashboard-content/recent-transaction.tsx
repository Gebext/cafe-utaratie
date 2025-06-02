"use client";

import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "../lib/utils";

interface Purchase {
  ID_Pembelian: number;
  Tanggal_Pembelian: string;
  Total_Biaya: string;
  Nama_Supplier: string;
  Nama_Karyawan: string;
  Nama_Produk: string;
  Is_Paid: number | string | boolean;
}

interface Payment {
  ID_Pembayaran: number;
  Tanggal_Pembayaran: string;
  Jumlah: string;
  Metode_Pembayaran: string;
  Nomor_Referensi: string;
  Nama_Supplier: string;
}

interface RecentTransactionsProps {
  purchases: Purchase[];
  payments: Payment[];
}

export function RecentTransactions({
  purchases,
  payments,
}: RecentTransactionsProps) {
  // Combine and sort transactions
  const allTransactions = [
    ...purchases.map((p) => ({
      id: `P-${p.ID_Pembelian}`,
      type: "purchase" as const,
      date: new Date(p.Tanggal_Pembelian),
      amount: Number(p.Total_Biaya),
      description: `Pembelian ${p.Nama_Produk}`,
      supplier: p.Nama_Supplier,
      employee: p.Nama_Karyawan,
      status: (() => {
        if (typeof p.Is_Paid === "boolean")
          return p.Is_Paid ? "paid" : "unpaid";
        if (typeof p.Is_Paid === "string")
          return p.Is_Paid === "1" || p.Is_Paid.toLowerCase() === "true"
            ? "paid"
            : "unpaid";
        return p.Is_Paid === 1 ? "paid" : "unpaid";
      })(),
    })),
    ...payments.map((p) => ({
      id: `PAY-${p.ID_Pembayaran}`,
      type: "payment" as const,
      date: new Date(p.Tanggal_Pembayaran),
      amount: Number(p.Jumlah),
      description: `Pembayaran ${p.Metode_Pembayaran}`,
      supplier: p.Nama_Supplier,
      reference: p.Nomor_Referensi,
      status: "completed" as const,
    })),
  ];

  // Sort by date (newest first) and take top 10
  const recentTransactions = allTransactions
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10);

  const getStatusBadge = (type: string, status: string) => {
    if (type === "purchase") {
      return status === "paid" ? (
        <Badge variant="default" className="text-xs">
          Lunas
        </Badge>
      ) : (
        <Badge variant="destructive" className="text-xs">
          Belum Lunas
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="text-xs">
        Selesai
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    return type === "purchase" ? "📦" : "💳";
  };

  if (recentTransactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        Tidak ada transaksi terbaru
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recentTransactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 border border-[#c9d6df] rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="text-2xl">{getTypeIcon(transaction.type)}</div>
            <div>
              <div className="font-medium text-sm">
                {transaction.description}
              </div>
              <div className="text-xs text-muted-foreground">
                {transaction.supplier} •{" "}
                {transaction.type === "purchase"
                  ? transaction.employee
                  : transaction.reference}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDate(transaction.date.toISOString())}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium text-sm">
              {formatCurrency(transaction.amount)}
            </div>
            <div className="mt-1">
              {getStatusBadge(transaction.type, transaction.status)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
