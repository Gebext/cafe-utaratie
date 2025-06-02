import { useState, useEffect } from "react";
import { Payment, ApiResponse } from "./types";

interface Filters {
  tanggal: string;
  metode: string;
  referensi: string;
}

export const usePaymentData = (filters: Filters) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
  });

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value.trim() !== "") {
            params.append(key, value);
          }
        });

        const url = `http://localhost:3000/api/pembayaran?${params.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

        if (result.status === "success") {
          setPayments(result.data);
          setPagination(result.pagination);
        } else {
          throw new Error(result.message || "Failed to fetch data");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [filters]);

  return { payments, loading, error, pagination };
};
