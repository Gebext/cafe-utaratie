import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WasteReportStats } from "./types";

interface WasteReportStatsProps {
  stats: WasteReportStats;
  totalFromPagination: number;
}

export function WasteReportStatsCards({
  stats,
  totalFromPagination,
}: WasteReportStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border-[#c9d6df]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Laporan</CardTitle>
          <Badge variant="outline">{totalFromPagination}</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#1e6091]">
            {stats.totalReports}
          </div>
          <p className="text-xs text-muted-foreground">Laporan aktif</p>
        </CardContent>
      </Card>

      <Card className="border-[#c9d6df]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Terbuang</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {stats.totalWasted}
          </div>
          <p className="text-xs text-muted-foreground">Unit bahan baku</p>
        </CardContent>
      </Card>

      <Card className="border-[#c9d6df]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Badge variant="destructive">{stats.pendingReports}</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {stats.pendingReports}
          </div>
          <p className="text-xs text-muted-foreground">Menunggu tindakan</p>
        </CardContent>
      </Card>

      <Card className="border-[#c9d6df]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expired Items</CardTitle>
          <Badge variant="destructive">{stats.expiredItems}</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {stats.expiredItems}
          </div>
          <p className="text-xs text-muted-foreground">Barang kadaluarsa</p>
        </CardContent>
      </Card>
    </div>
  );
}
