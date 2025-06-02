"use client";

import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WasteReportDialog } from "./waste-report-dialog";
import { WasteReportDetailDialog } from "./waste-report-detail-dialog";
import { WasteReport, WasteReportFilters } from "./management/types";
import { useWasteReports } from "./management/use-waste-report";
import { calculateStats, filterReports } from "./management/utils";
import { WasteReportHeader } from "./management/waste-report-header";
import { WasteReportStatsCards } from "./management/waste-report-stats";
import { WasteReportChartCard } from "./management/waste-report-chart-card";
import { WasteReportFiltersCard } from "./management/waste-report-filters";
import { WasteReportTable } from "./management/waste-report-table";

export function WasteReportManagement() {
  const [filters, setFilters] = useState<WasteReportFilters>({
    searchTerm: "",
    selectedType: "all",
    selectedStatus: "all",
    selectedDate: "",
  });
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewingReport, setViewingReport] = useState<WasteReport | null>(null);

  const { reports, isLoading, error, pagination, addReport } = useWasteReports({
    selectedType: filters.selectedType,
    selectedStatus: filters.selectedStatus,
    selectedDate: filters.selectedDate,
    limit,
    offset,
  });

  // Reset offset when filters change
  useEffect(() => {
    setOffset(0);
  }, [filters.selectedType, filters.selectedStatus, filters.selectedDate]);

  const handleFiltersChange = (newFilters: Partial<WasteReportFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handlePageChange = (newOffset: number) => {
    setOffset(newOffset);
  };

  const handleAddReport = (
    reportData: Omit<WasteReport, "ID_Laporan" | "Deleted_At">
  ) => {
    addReport(reportData);
    setIsAddDialogOpen(false);
  };

  // For client-side search filtering
  const filteredReports = filters.searchTerm
    ? filterReports(reports, filters.searchTerm)
    : reports;
  const stats = calculateStats(reports);

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
        offset={offset}
        limit={limit}
        total={pagination.total}
        onViewReport={setViewingReport}
        onPageChange={handlePageChange}
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
