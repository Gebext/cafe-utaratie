import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility functions for data formatting
export const formatCurrency = (amount: string | number): string => {
  const numAmount =
    typeof amount === "string" ? Number.parseFloat(amount) : amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(numAmount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getPaymentStatusBadge = (isPaid: number) => {
  return isPaid === 1
    ? { variant: "default" as const, label: "Lunas" }
    : { variant: "destructive" as const, label: "Belum Lunas" };
};

export const getPaymentMethodBadge = (method: string) => {
  switch (method) {
    case "Tunai":
      return {
        variant: "default" as const,
        color: "bg-green-100 text-green-800",
      };
    case "Transfer Bank":
      return {
        variant: "secondary" as const,
        color: "bg-blue-100 text-blue-800",
      };
    case "Kartu Kredit":
      return {
        variant: "outline" as const,
        color: "bg-purple-100 text-purple-800",
      };
    default:
      return {
        variant: "outline" as const,
        color: "bg-gray-100 text-gray-800",
      };
  }
};
