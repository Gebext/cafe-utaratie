"use client";

import { Eye, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  formatDate,
  getStatusBadgeVariant,
  getTypeBadgeVariant,
} from "./utils";
import { WasteReport } from "./types";

interface WasteReportTableProps {
  reports: WasteReport[];
  isLoading: boolean;
  onViewReport: (report: WasteReport) => void;
}

export function WasteReportTable({
  reports,
  isLoading,
  onViewReport,
}: WasteReportTableProps) {
  return (
    <Card className="border-[#c9d6df]">
      <CardHeader>
        <CardTitle
          className="text-[#1e6091]"
          style={{ fontFamily: "Pirata One, cursive" }}
        >
          Daftar Laporan ({reports.length})
        </CardTitle>
        <CardDescription>
          Kelola semua laporan kehilangan bahan baku
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#1e6091]" />
            <span className="ml-2 text-lg text-[#1e6091]">
              Loading treasure loss reports...
            </span>
          </div>
        ) : (
          <div className="rounded-md border border-[#c9d6df]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Produk</TableHead>
                  <TableHead>Pelapor</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Tidak ada laporan yang ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((report) => (
                    <TableRow key={report.ID_Laporan}>
                      <TableCell>{report.ID_Laporan}</TableCell>
                      <TableCell>
                        <div className="font-medium">{report.Nama_Produk}</div>
                      </TableCell>
                      <TableCell>{report.Nama_Karyawan}</TableCell>
                      <TableCell>
                        {formatDate(report.Tanggal_Laporan)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getTypeBadgeVariant(report.Jenis_Laporan)}
                        >
                          {report.Jenis_Laporan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-red-600">
                          {report.Jumlah_Terbuang}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(report.Status_Laporan)}
                        >
                          {report.Status_Laporan}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewReport(report)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
