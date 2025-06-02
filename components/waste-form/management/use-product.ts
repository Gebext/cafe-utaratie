"use client";

import { useState, useEffect } from "react";
import type { Produk, ApiResponse } from "./types";

export function useProduk() {
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduk = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch 100 records
        const response = await fetch("/api/produk?limit=100&offset=0");

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result: ApiResponse<Produk> = await response.json();

        if (result.status === "success") {
          setProdukList(result.data);
        } else {
          throw new Error(result.message || "Failed to fetch produk data");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Error fetching produk data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduk();
  }, []);

  return {
    produkList,
    isLoading,
    error,
  };
}
