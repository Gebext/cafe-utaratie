"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { id } from "date-fns/locale";

interface Purchase {
  ID_Pembelian: number;
  Tanggal_Pembelian: string;
  Total_Biaya: string;
}

interface PurchaseTrendsChartProps {
  data: Purchase[];
}

export function PurchaseTrendsChart({ data }: PurchaseTrendsChartProps) {
  // Generate last 30 days data
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = startOfDay(subDays(new Date(), 29 - i));
    return {
      date: format(date, "yyyy-MM-dd"),
      displayDate: format(date, "dd/MM", { locale: id }),
      amount: 0,
      count: 0,
    };
  });

  // Aggregate purchases by date
  data.forEach((purchase) => {
    const purchaseDate = format(
      new Date(purchase.Tanggal_Pembelian),
      "yyyy-MM-dd"
    );
    const dayData = last30Days.find((day) => day.date === purchaseDate);
    if (dayData) {
      dayData.amount += Number(purchase.Total_Biaya);
      dayData.count += 1;
    }
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={last30Days}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
        <XAxis
          dataKey="displayDate"
          stroke="#6b7280"
          fontSize={12}
          interval="preserveStartEnd"
          tick={{ fontSize: 10 }}
        />
        <YAxis
          stroke="#6b7280"
          fontSize={12}
          tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
        />
        <Tooltip
          formatter={(value: number) => [
            `Rp ${value.toLocaleString("id-ID")}`,
            "Total Pembelian",
          ]}
          labelFormatter={(label) => `Tanggal: ${label}`}
          contentStyle={{
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
          }}
        />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="#1e6091"
          strokeWidth={2}
          dot={{ fill: "#1e6091", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: "#1e6091", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
