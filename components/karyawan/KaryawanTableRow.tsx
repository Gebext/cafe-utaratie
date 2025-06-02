import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Karyawan } from "./karyawan-management";

interface Props {
  karyawan: Karyawan;
  onView: (k: Karyawan) => void;
  onEdit: (k: Karyawan) => void;
  onDelete: (k: Karyawan) => void;
}

export function KaryawanTableRow({
  karyawan,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Manajer":
        return "default";
      case "Kasir":
        return "secondary";
      case "Chef":
        return "outline";
      case "Pelayan":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{karyawan.Nama_Karyawan}</TableCell>
      <TableCell>
        <Badge variant={getRoleBadgeVariant(karyawan.Role)}>
          {karyawan.Role}
        </Badge>
      </TableCell>
      <TableCell>{karyawan.Nomor_Kontak}</TableCell>
      <TableCell>{karyawan.Email}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => onView(karyawan)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(karyawan)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(karyawan)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
