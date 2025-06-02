import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SupplierStatsProps {
  totalSuppliers: number;
  categoriesCount: number;
  baratieCount: number;
}

export function SupplierStats({
  totalSuppliers,
  categoriesCount,
  baratieCount,
}: SupplierStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="border-[#c9d6df]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Supplier</CardTitle>
          <Badge variant="outline">{totalSuppliers}</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#1e6091]">
            {totalSuppliers}
          </div>
          <p className="text-xs text-muted-foreground">Mitra dagang aktif</p>
        </CardContent>
      </Card>
      <Card className="border-[#c9d6df]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Kategori</CardTitle>
          <Badge variant="outline">{categoriesCount}</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#1e6091]">
            {categoriesCount}
          </div>
          <p className="text-xs text-muted-foreground">Jenis pasokan</p>
        </CardContent>
      </Card>
      <Card className="border-[#c9d6df]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Baratie Partners
          </CardTitle>
          <Badge variant="default">{baratieCount}</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#1e6091]">
            {baratieCount}
          </div>
          <p className="text-xs text-muted-foreground">Mitra khusus Baratie</p>
        </CardContent>
      </Card>
    </div>
  );
}
