"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { formatCurrency, formatDate, getPaymentMethodBadge } from "./utils";
import type { Payment } from "./types";

interface PaymentTableProps {
  payments: Payment[];
  loading: boolean;
  offset: number;
  limit: number;
  total: number;
  onPageChange: (offset: number) => void;
  onLimitChange?: (limit: number) => void;
  onViewDetail?: (payment: Payment) => void;
  onEdit?: (payment: Payment) => void;
  onDelete?: (payment: Payment) => void;
}

export function PaymentTable({
  payments,
  loading,
  total,
  onViewDetail,
}: PaymentTableProps) {
  return (
    <Card className="border-[#c9d6df]">
      <CardHeader>
        <CardTitle
          className="text-[#1e6091]"
          style={{ fontFamily: "Pirata One, cursive" }}
        >
          Daftar Pembayaran ({total})
        </CardTitle>
        <CardDescription>Kelola semua transaksi pembayaran</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#1e6091]" />
            <span className="ml-2 text-lg text-[#1e6091]">
              Loading treasure data...
            </span>
          </div>
        ) : (
          <>
            <div className="rounded-md border border-[#c9d6df]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Referensi</TableHead>
                    <TableHead>Produk</TableHead>
                    <TableHead>Penanggung Jawab</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Metode</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Tidak ada pembayaran yang ditemukan
                      </TableCell>
                    </TableRow>
                  ) : (
                    payments.map((payment) => {
                      const method = getPaymentMethodBadge(
                        payment.Metode_Pembayaran
                      );
                      return (
                        <TableRow key={payment.ID_Pembayaran}>
                          <TableCell>{payment.ID_Pembayaran}</TableCell>
                          <TableCell>
                            <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                              {payment.Nomor_Referensi}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {payment.Nama_Produk}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {payment.Nama_Supplier}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{payment.Nama_Karyawan}</TableCell>
                          <TableCell>
                            {formatDate(payment.Tanggal_Pembayaran)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={method.variant}
                              className={method.color}
                            >
                              {payment.Metode_Pembayaran}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-green-600">
                              {formatCurrency(payment.Jumlah)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onViewDetail?.(payment)}
                              >
                                Detail
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
