"use client";

import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format, startOfMonth, subMonths } from "date-fns";
import { id } from "date-fns/locale";

interface Purchase {
  Tanggal_Pembelian: string;
  Total_Biaya: string;
}

interface Payment {
  Tanggal_Pembayaran: string;
  Jumlah: string;
}

interface MonthlyTrendsChartProps {
  purchases: Purchase[];
  payments: Payment[];
}

export function MonthlyTrendsChart({
  purchases,
  payments,
}: MonthlyTrendsChartProps) {
  // Generate last 6 months data
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = startOfMonth(subMonths(new Date(), 5 - i));
    return {
      month: format(date, "yyyy-MM"),
      displayMonth: format(date, "MMM yyyy", { locale: id }),
      purchases: 0,
      payments: 0,
    };
  });

  // Aggregate purchases by month
  purchases.forEach((purchase) => {
    const purchaseMonth = format(
      new Date(purchase.Tanggal_Pembelian),
      "yyyy-MM"
    );
    const monthData = last6Months.find(
      (month) => month.month === purchaseMonth
    );
    if (monthData) {
      monthData.purchases += Number(purchase.Total_Biaya);
    }
  });

  // Aggregate payments by month
  payments.forEach((payment) => {
    const paymentMonth = format(
      new Date(payment.Tanggal_Pembayaran),
      "yyyy-MM"
    );
    const monthData = last6Months.find((month) => month.month === paymentMonth);
    if (monthData) {
      monthData.payments += Number(payment.Jumlah);
    }
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={last6Months}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
        <XAxis dataKey="displayMonth" stroke="#6b7280" fontSize={12} />
        <YAxis
          stroke="#6b7280"
          fontSize={12}
          tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
        />
        <Tooltip
          formatter={(value: number, name: string) => [
            `Rp ${value.toLocaleString("id-ID")}`,
            name === "purchases" ? "Pembelian" : "Pembayaran",
          ]}
          contentStyle={{
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
          }}
        />
        <Legend
          formatter={(value) =>
            value === "purchases" ? "Pembelian" : "Pembayaran"
          }
        />
        <Area
          type="monotone"
          dataKey="purchases"
          fill="#1e6091"
          fillOpacity={0.3}
          stroke="#1e6091"
          strokeWidth={2}
        />
        <Bar dataKey="payments" fill="#10b981" radius={[4, 4, 0, 0]} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
