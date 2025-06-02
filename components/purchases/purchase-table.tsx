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
import { formatCurrency, formatDate, getPaymentStatusBadge } from "./utils";
import type { Purchase } from "./types";

interface PurchaseTableProps {
  purchases: Purchase[];
  loading: boolean;
  total: number;
  onViewDetail?: (purchase: Purchase) => void;
  onEdit?: (purchase: Purchase) => void;
  onDelete?: (purchase: Purchase) => void;
}

export function PurchaseTable({
  purchases,
  loading,

  total,
  onViewDetail,
}: PurchaseTableProps) {
  return (
    <Card className="border-[#c9d6df]">
      <CardHeader>
        <CardTitle
          className="text-[#1e6091]"
          style={{ fontFamily: "Pirata One, cursive" }}
        >
          Daftar Pembelian ({total})
        </CardTitle>
        <CardDescription>
          Kelola semua transaksi pembelian bahan baku
        </CardDescription>
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
                    <TableHead>Produk</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Pembeli</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Tidak ada pembelian yang ditemukan
                      </TableCell>
                    </TableRow>
                  ) : (
                    purchases.map((purchase) => {
                      const status = getPaymentStatusBadge(purchase.Is_Paid);
                      return (
                        <TableRow key={purchase.ID_Pembelian}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {purchase.Nama_Produk}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Qty: {purchase.Jumlah}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{purchase.Nama_Supplier}</TableCell>
                          <TableCell>{purchase.Nama_Karyawan}</TableCell>
                          <TableCell>
                            {formatDate(purchase.Tanggal_Pembelian)}
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {formatCurrency(purchase.Total_Biaya)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={status.variant}>
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onViewDetail?.(purchase)}
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
