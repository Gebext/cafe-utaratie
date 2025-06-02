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
import { Karyawan } from "./karyawan-management";
import { KaryawanTableRow } from "./KaryawanTableRow";

interface KaryawanTableProps {
  data: Karyawan[];
  onView: (karyawan: Karyawan) => void;
  onEdit: (karyawan: Karyawan) => void;
  onDelete: (karyawan: Karyawan) => void;
}

export function KaryawanTable({
  data,
  onView,
  onEdit,
  onDelete,
}: KaryawanTableProps) {
  const safeData = Array.isArray(data) ? data : [];
  return (
    <Card className="border-[#c9d6df]">
      <CardHeader>
        <CardTitle
          className="text-[#1e6091]"
          style={{ fontFamily: "Pirata One, cursive" }}
        >
          Daftar Kru ({data.length})
        </CardTitle>
        <CardDescription>
          Kelola semua karyawan di restoran terapung Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-[#c9d6df]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Karyawan</TableHead>
                <TableHead>Posisi</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safeData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Tidak ada karyawan yang ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                safeData.map((k) => (
                  <KaryawanTableRow
                    key={k.ID_Karyawan}
                    karyawan={k}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
