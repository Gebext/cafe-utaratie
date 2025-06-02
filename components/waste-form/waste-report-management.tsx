"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Loader2,
  Calendar,
  AlertTriangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WasteReportDialog } from "./waste-report-dialog";
import { WasteReportChart } from "./waste-report-chart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { DeleteWasteReportDialog } from "./delete-waste-report-dialog";
import { WasteReportDetailDialog } from "./waste-report-detail-dialog";

export interface WasteReport {
  ID_Laporan: number;
  ID_Karyawan: number;
  Nama_Karyawan: string;
  ID_Produk: number;
  Nama_Produk: string;
  Tanggal_Laporan: string;
  Jenis_Laporan: "Expired" | "Waste" | "Break";
  Jumlah_Terbuang: number;
  Alasan: string;
  Status_Laporan: "Pending" | "Dikonfirmasi" | "Ditindaklanjuti";
  Deleted_At: string | null;
}

export interface WasteReportApiResponse {
  status: string;
  message: string;
  data: WasteReport[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export function WasteReportManagement() {
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<WasteReport | null>(null);
  const [deletingReport, setDeletingReport] = useState<WasteReport | null>(
    null
  );
  const [viewingReport, setViewingReport] = useState<WasteReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
  });

  const reportTypes = ["all", "Expired", "Waste", "Break"];
  const reportStatuses = ["all", "Pending", "Dikonfirmasi", "Ditindaklanjuti"];

  // Fetch waste report data from API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        let url = "http://localhost:3000/api/laporan-bahan-baku?";
        const params = new URLSearchParams();

        if (selectedType !== "all") params.append("jenis", selectedType);
        if (selectedStatus !== "all") params.append("status", selectedStatus);
        if (selectedDate) params.append("tanggal", selectedDate);

        url += params.toString();

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result: WasteReportApiResponse = await response.json();

        if (result.status === "success") {
          setReports(result.data);
          setPagination(result.pagination);
        } else {
          throw new Error(result.message || "Failed to fetch data");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Error fetching waste report data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [selectedType, selectedStatus, selectedDate]);

  // Filter reports based on search term
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.Nama_Produk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.Nama_Karyawan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.Alasan.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Calculate statistics
  const totalWasted = reports.reduce(
    (sum, report) => sum + report.Jumlah_Terbuang,
    0
  );
  const pendingReports = reports.filter(
    (r) => r.Status_Laporan === "Pending"
  ).length;
  const expiredItems = reports.filter(
    (r) => r.Jenis_Laporan === "Expired"
  ).length;

  // Handle add report (would connect to API in real implementation)
  const handleAddReport = (
    reportData: Omit<WasteReport, "ID_Laporan" | "Deleted_At">
  ) => {
    const newReport: WasteReport = {
      ...reportData,
      ID_Laporan: Math.max(0, ...reports.map((r) => r.ID_Laporan)) + 1,
      Deleted_At: null,
    };
    setReports([...reports, newReport]);
    setIsAddDialogOpen(false);
  };

  // Handle edit report (would connect to API in real implementation)
  const handleEditReport = (
    reportData: Omit<WasteReport, "ID_Laporan" | "Deleted_At">
  ) => {
    if (editingReport) {
      setReports(
        reports.map((r) =>
          r.ID_Laporan === editingReport.ID_Laporan
            ? { ...r, ...reportData }
            : r
        )
      );
      setEditingReport(null);
    }
  };

  // Handle delete report (would connect to API in real implementation)
  const handleDeleteReport = () => {
    if (deletingReport) {
      setReports(
        reports.filter((r) => r.ID_Laporan !== deletingReport.ID_Laporan)
      );
      setDeletingReport(null);
    }
  };

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
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1
            className="text-3xl font-bold text-[#1e6091]"
            style={{ fontFamily: "Pirata One, cursive" }}
          >
            Treasure Loss Reports
          </h1>
          <p className="text-muted-foreground">
            Laporan kehilangan bahan baku dan inventori
          </p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#1e6091] hover:bg-[#154c74]"
          style={{ fontFamily: "Pirata One, cursive" }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Buat Laporan Baru
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[#c9d6df]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Laporan</CardTitle>
            <Badge variant="outline">{pagination.total}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1e6091]">
              {reports.length}
            </div>
            <p className="text-xs text-muted-foreground">Laporan aktif</p>
          </CardContent>
        </Card>
        <Card className="border-[#c9d6df]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Terbuang
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalWasted}</div>
            <p className="text-xs text-muted-foreground">Unit bahan baku</p>
          </CardContent>
        </Card>
        <Card className="border-[#c9d6df]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Badge variant="destructive">{pendingReports}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingReports}
            </div>
            <p className="text-xs text-muted-foreground">Menunggu tindakan</p>
          </CardContent>
        </Card>
        <Card className="border-[#c9d6df]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired Items</CardTitle>
            <Badge variant="destructive">{expiredItems}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {expiredItems}
            </div>
            <p className="text-xs text-muted-foreground">Barang kadaluarsa</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="border-[#c9d6df]">
        <CardHeader>
          <CardTitle
            className="text-[#1e6091]"
            style={{ fontFamily: "Pirata One, cursive" }}
          >
            Analisis Kehilangan
          </CardTitle>
          <CardDescription>
            Distribusi jenis laporan kehilangan bahan baku
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WasteReportChart data={reports} />
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="border-[#c9d6df]">
        <CardHeader>
          <CardTitle
            className="text-[#1e6091]"
            style={{ fontFamily: "Pirata One, cursive" }}
          >
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari laporan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-[#c9d6df] focus-visible:ring-[#1e6091]"
                />
              </div>
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="border-[#c9d6df]">
                <SelectValue placeholder="Jenis Laporan" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "all" ? "Semua Jenis" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="border-[#c9d6df]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {reportStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "all" ? "Semua Status" : status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-10 border-[#c9d6df] focus-visible:ring-[#1e6091]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Gagal memuat data laporan: {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Reports Table */}
      <Card className="border-[#c9d6df]">
        <CardHeader>
          <CardTitle
            className="text-[#1e6091]"
            style={{ fontFamily: "Pirata One, cursive" }}
          >
            Daftar Laporan ({filteredReports.length})
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
                  {filteredReports.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Tidak ada laporan yang ditemukan
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReports.map((report) => (
                      <TableRow key={report.ID_Laporan}>
                        <TableCell>{report.ID_Laporan}</TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {report.Nama_Produk}
                          </div>
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
                            variant={getStatusBadgeVariant(
                              report.Status_Laporan
                            )}
                          >
                            {report.Status_Laporan}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setViewingReport(report)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingReport(report)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeletingReport(report)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
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

      {/* Dialogs */}
      <WasteReportDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddReport}
        title="Buat Laporan Baru"
        submitText="Buat Laporan"
      />

      <WasteReportDialog
        open={!!editingReport}
        onOpenChange={(open) => !open && setEditingReport(null)}
        onSubmit={handleEditReport}
        title="Edit Laporan"
        submitText="Simpan Perubahan"
        initialData={editingReport || undefined}
      />

      <DeleteWasteReportDialog
        open={!!deletingReport}
        onOpenChange={(open) => !open && setDeletingReport(null)}
        onConfirm={handleDeleteReport}
        reportId={deletingReport?.ID_Laporan || 0}
      />

      <WasteReportDetailDialog
        open={!!viewingReport}
        onOpenChange={(open) => !open && setViewingReport(null)}
        report={viewingReport}
      />
    </div>
  );
}
