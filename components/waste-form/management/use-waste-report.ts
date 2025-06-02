"use client";

import { useState, useEffect } from "react";
import { WasteReport, WasteReportApiResponse } from "./types";

interface UseWasteReportsParams {
  selectedType: string;
  selectedStatus: string;
  selectedDate: string;
  limit: number;
  offset: number;
}

export function useWasteReports(params: UseWasteReportsParams) {
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: params.limit,
    offset: params.offset,
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const searchParams = new URLSearchParams();

        // Add pagination parameters
        searchParams.append("limit", params.limit.toString());
        searchParams.append("offset", params.offset.toString());

        // Add filter parameters
        if (params.selectedType !== "all")
          searchParams.append("jenis", params.selectedType);
        if (params.selectedStatus !== "all")
          searchParams.append("status", params.selectedStatus);
        if (params.selectedDate)
          searchParams.append("tanggal", params.selectedDate);

        const url = `/api/laporan-bahan-baku?${searchParams.toString()}`;

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
  }, [
    params.selectedType,
    params.selectedStatus,
    params.selectedDate,
    params.limit,
    params.offset,
  ]);

  const addReport = async (
    reportData: Omit<WasteReport, "ID_Laporan" | "Deleted_At">
  ) => {
    try {
      const response = await fetch("/api/laporan-bahan-baku", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new Error(`Gagal menambahkan laporan: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status === "success") {
        // Tambahkan ke state hanya jika berhasil di server
        setReports((prev) => [...prev, result.data]);
      } else {
        throw new Error(result.message || "Terjadi kesalahan saat menambahkan");
      }
    } catch (error) {
      console.error("Error saat menambahkan laporan:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    }
  };

  return {
    reports,
    isLoading,
    error,
    pagination,
    addReport,
  };
}
