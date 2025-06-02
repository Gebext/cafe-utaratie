"use client";

import { useState, useEffect } from "react";
import {
  WasteReport,
  WasteReportApiResponse,
  WasteReportFilters,
} from "./types";

export function useWasteReports(
  filters: Pick<
    WasteReportFilters,
    "selectedType" | "selectedStatus" | "selectedDate"
  >
) {
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        let url = `/api/laporan-bahan-baku?`;
        const params = new URLSearchParams();

        if (filters.selectedType !== "all")
          params.append("jenis", filters.selectedType);
        if (filters.selectedStatus !== "all")
          params.append("status", filters.selectedStatus);
        if (filters.selectedDate)
          params.append("tanggal", filters.selectedDate);

        url += params.toString();

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result: WasteReportApiResponse = await response.json();

        if (result.status === "success") {
          setReports(result.data);
          setPagination(result.pagination);
          setError(null);
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
  }, [filters.selectedType, filters.selectedStatus, filters.selectedDate]);

  const addReport = (
    reportData: Omit<WasteReport, "ID_Laporan" | "Deleted_At">
  ) => {
    const newReport: WasteReport = {
      ...reportData,
      ID_Laporan: Math.max(0, ...reports.map((r) => r.ID_Laporan)) + 1,
      Deleted_At: null,
    };
    setReports([...reports, newReport]);
  };

  return {
    reports,
    isLoading,
    error,
    pagination,
    addReport,
  };
}
