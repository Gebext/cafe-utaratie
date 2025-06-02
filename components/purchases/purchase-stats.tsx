import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "./utils";

interface PurchaseStatsProps {
  totalPurchases: number;
  paginationTotal: number;
  totalAmount: number;
  unpaidCount: number;
  unpaidAmount: number;
}

export function PurchaseStats({
  totalPurchases,
  paginationTotal,
  totalAmount,
  unpaidCount,
  unpaidAmount,
}: PurchaseStatsProps) {
  const averageAmount = totalPurchases > 0 ? totalAmount / totalPurchases : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border-[#c9d6df]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pembelian</CardTitle>
          <Badge variant="outline">{paginationTotal}</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#1e6091]">
            {totalPurchases}
          </div>
          <p className="text-xs text-muted-foreground">Transaksi aktif</p>
        </CardContent>
      </Card>

      <Card className="border-[#c9d6df]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Nilai</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#1e6091]">
            {formatCurrency(totalAmount)}
          </div>
          <p className="text-xs text-muted-foreground">Nilai pembelian</p>
        </CardContent>
      </Card>

      <Card className="border-[#c9d6df]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Belum Lunas</CardTitle>
          <Badge variant="destructive">{unpaidCount}</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(unpaidAmount)}
          </div>
          <p className="text-xs text-muted-foreground">Perlu dibayar</p>
        </CardContent>
      </Card>

      <Card className="border-[#c9d6df]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rata-rata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#1e6091]">
            {formatCurrency(averageAmount)}
          </div>
          <p className="text-xs text-muted-foreground">Per transaksi</p>
        </CardContent>
      </Card>
    </div>
  );
}
