"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Package, AlertTriangle } from "lucide-react";
import { WasteReport } from "./waste-report-management";

interface WasteReportDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: WasteReport | null;
}

export function WasteReportDetailDialog({
  open,
  onOpenChange,
  report,
}: WasteReportDetailDialogProps) {
  if (!report) return null;

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Dikonfirmasi":
        return "default" as const;
      case "Ditindaklanjuti":
        return "secondary" as const;
      case "Pending":
        return "destructive" as const;
      default:
        return "outline" as const;
    }
  };

  // Get type badge variant
  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "Expired":
        return "destructive" as const;
      case "Waste":
        return "secondary" as const;
      case "Break":
        return "outline" as const;
      default:
        return "outline" as const;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get type description
  const getTypeDescription = (type: string) => {
    switch (type) {
      case "Expired":
        return "Bahan baku yang telah melewati tanggal kadaluarsa";
      case "Waste":
        return "Sisa bahan baku yang tidak dapat digunakan";
      case "Break":
        return "Bahan baku yang rusak atau pecah";
      default:
        return "Jenis kehilangan tidak diketahui";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle
            className="text-[#1e6091]"
            style={{ fontFamily: "Pirata One, cursive" }}
          >
            Detail Laporan #{report.ID_Laporan}
          </DialogTitle>
          <DialogDescription>
            Informasi lengkap tentang laporan kehilangan bahan baku
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-[#c9d6df]">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <div>
                  <h3 className="text-lg font-bold">{report.Nama_Produk}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={getTypeBadgeVariant(report.Jenis_Laporan)}>
                      {report.Jenis_Laporan}
                    </Badge>
                    <Badge
                      variant={getStatusBadgeVariant(report.Status_Laporan)}
                    >
                      {report.Status_Laporan}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">
                  {report.Jumlah_Terbuang}
                </div>
                <div className="text-sm text-muted-foreground">
                  Unit terbuang
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-[#c9d6df] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-[#1e6091]" />
                  <h4 className="font-medium text-[#1e6091]">
                    Tanggal Laporan
                  </h4>
                </div>
                <p className="text-sm">{formatDate(report.Tanggal_Laporan)}</p>
              </div>
              <div className="p-4 border border-[#c9d6df] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-[#1e6091]" />
                  <h4 className="font-medium text-[#1e6091]">Pelapor</h4>
                </div>
                <p className="text-sm">{report.Nama_Karyawan}</p>
                <p className="text-xs text-muted-foreground">
                  ID: {report.ID_Karyawan}
                </p>
              </div>
              <div className="p-4 border border-[#c9d6df] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-[#1e6091]" />
                  <h4 className="font-medium text-[#1e6091]">Produk</h4>
                </div>
                <p className="text-sm">{report.Nama_Produk}</p>
                <p className="text-xs text-muted-foreground">
                  ID: {report.ID_Produk}
                </p>
              </div>
              <div className="p-4 border border-[#c9d6df] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-[#1e6091]" />
                  <h4 className="font-medium text-[#1e6091]">
                    Jenis Kehilangan
                  </h4>
                </div>
                <p className="text-sm">
                  {getTypeDescription(report.Jenis_Laporan)}
                </p>
              </div>
            </div>

            {/* Reason */}
            <div className="p-4 border border-[#c9d6df] rounded-lg">
              <h4 className="font-medium text-[#1e6091] mb-2">
                Alasan Kehilangan
              </h4>
              <p className="text-sm">{report.Alasan}</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
