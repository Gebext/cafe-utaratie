"use client";

import { useState, useEffect } from "react";
import type { Karyawan, ApiResponse } from "./types";

export function useKaryawan() {
  const [karyawanList, setKaryawanList] = useState<Karyawan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKaryawan = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch 100 records
        const response = await fetch("/api/karyawan?limit=100&offset=0");

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result: ApiResponse<Karyawan> = await response.json();

        if (result.status === "success") {
          setKaryawanList(result.data);
        } else {
          throw new Error(result.message || "Failed to fetch karyawan data");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Error fetching karyawan data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKaryawan();
  }, []);

  return {
    karyawanList,
    isLoading,
    error,
  };
}
