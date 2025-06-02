"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WasteReportDialog } from "./waste-report-dialog";
import { WasteReport, WasteReportFilters } from "./management/types";
import { calculateStats, filterReports } from "./management/utils";
import { WasteReportHeader } from "./management/waste-report-header";
import { WasteReportStatsCards } from "./management/waste-report-stats";
import { WasteReportChartCard } from "./management/waste-report-chart-card";
import { WasteReportFiltersCard } from "./management/waste-report-filters";
import { WasteReportTable } from "./management/waste-report-table";
import { WasteReportDetailDialog } from "./waste-report-detail-dialog";
import { useWasteReports } from "./management/use-waste-report";

export function WasteReportManagement() {
  const [filters, setFilters] = useState<WasteReportFilters>({
    searchTerm: "",
    selectedType: "all",
    selectedStatus: "all",
    selectedDate: "",
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewingReport, setViewingReport] = useState<WasteReport | null>(null);

  const { reports, isLoading, error, pagination, addReport } = useWasteReports({
    selectedType: filters.selectedType,
    selectedStatus: filters.selectedStatus,
    selectedDate: filters.selectedDate,
  });

  const filteredReports = filterReports(reports, filters.searchTerm);
  const stats = calculateStats(reports);

  const handleFiltersChange = (newFilters: Partial<WasteReportFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleAddReport = (
    reportData: Omit<WasteReport, "ID_Laporan" | "Deleted_At">
  ) => {
    addReport(reportData);
    setIsAddDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <WasteReportHeader onAddReport={() => setIsAddDialogOpen(true)} />

      <WasteReportStatsCards
        stats={stats}
        totalFromPagination={pagination.total}
      />

      <WasteReportChartCard data={reports} />

      <WasteReportFiltersCard
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Gagal memuat data laporan: {error}
          </AlertDescription>
        </Alert>
      )}

      <WasteReportTable
        reports={filteredReports}
        isLoading={isLoading}
        onViewReport={setViewingReport}
      />

      <WasteReportDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddReport}
      />

      <WasteReportDetailDialog
        open={!!viewingReport}
        onOpenChange={(open) => !open && setViewingReport(null)}
        report={viewingReport}
      />
    </div>
  );
}
