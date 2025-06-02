import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "./utils";

interface PaymentStatsProps {
  totalPayments: number;
  paginationTotal: number;
  totalAmount: number;
  methodStats: Record<string, number>;
}

export function PaymentStats({
  totalPayments,
  paginationTotal,
  totalAmount,
  methodStats,
}: PaymentStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border-[#c9d6df]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Pembayaran
          </CardTitle>
          <Badge variant="outline">{paginationTotal}</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#1e6091]">
            {totalPayments}
          </div>
          <p className="text-xs text-muted-foreground">Transaksi berhasil</p>
        </CardContent>
      </Card>

      <Card className="border-[#c9d6df]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Nilai</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(totalAmount)}
          </div>
          <p className="text-xs text-muted-foreground">Nilai pembayaran</p>
        </CardContent>
      </Card>

      <Card className="border-[#c9d6df]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tunai</CardTitle>
          <Badge variant="default">{methodStats["Tunai"] || 0}</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#1e6091]">
            {methodStats["Tunai"] || 0}
          </div>
          <p className="text-xs text-muted-foreground">Pembayaran tunai</p>
        </CardContent>
      </Card>

      <Card className="border-[#c9d6df]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Transfer</CardTitle>
          <Badge variant="secondary">{methodStats["Transfer Bank"] || 0}</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#1e6091]">
            {methodStats["Transfer Bank"] || 0}
          </div>
          <p className="text-xs text-muted-foreground">Transfer bank</p>
        </CardContent>
      </Card>
    </div>
  );
}
