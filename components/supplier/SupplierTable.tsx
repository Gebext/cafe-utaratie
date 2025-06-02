import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Loader2, MapPin, Phone } from "lucide-react";
import { Supplier } from "./supplier-management"; // Pastikan import interface Supplier dari file utama

interface SupplierTableProps {
  suppliers: Supplier[];
  isLoading: boolean;
  onView: (supplier: Supplier) => void;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
  getCategoryBadgeVariant: (
    category: string
  ) => "default" | "secondary" | "outline" | "destructive";
}

export function SupplierTable({
  suppliers,
  isLoading,
  onView,
  onEdit,
  onDelete,
  getCategoryBadgeVariant,
}: SupplierTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#1e6091]" />
        <span className="ml-2 text-lg text-[#1e6091]">
          Loading trading partners...
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-[#c9d6df]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Supplier</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Alamat</TableHead>
            <TableHead>Kontak</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                Tidak ada supplier yang ditemukan
              </TableCell>
            </TableRow>
          ) : (
            suppliers.map((supplier) => (
              <TableRow key={supplier.ID_Supplier}>
                <TableCell>
                  <div className="font-medium">{supplier.Nama_Supplier}</div>
                  {supplier.Nama_Supplier.includes("Baratie") && (
                    <Badge variant="default" className="text-xs mt-1">
                      Partner Khusus
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={getCategoryBadgeVariant(supplier.Nama_Kategori)}
                  >
                    {supplier.Nama_Kategori}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="truncate max-w-[200px]">
                      {supplier.Alamat}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span>{supplier.Nomor_Kontak}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(supplier)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(supplier)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(supplier)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
