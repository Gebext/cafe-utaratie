"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Purchase {
  Nama_Supplier: string;
  Total_Biaya: string;
}

interface TopSuppliersChartProps {
  data: Purchase[];
}

export function TopSuppliersChart({ data }: TopSuppliersChartProps) {
  // Aggregate by supplier
  const supplierData: Record<string, number> = {};
  data.forEach((purchase) => {
    const supplier = purchase.Nama_Supplier;
    supplierData[supplier] =
      (supplierData[supplier] || 0) + Number(purchase.Total_Biaya);
  });

  // Convert to array and sort
  const chartData = Object.entries(supplierData)
    .map(([name, amount]) => ({
      name: name.length > 15 ? `${name.substring(0, 15)}...` : name,
      fullName: name,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="horizontal">
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
        <XAxis
          type="number"
          stroke="#6b7280"
          fontSize={12}
          tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
        />
        <YAxis
          dataKey="name"
          type="category"
          stroke="#6b7280"
          fontSize={10}
          width={80}
        />
        <Tooltip
          formatter={(value: number) => [
            `Rp ${value.toLocaleString("id-ID")}`,
            "Total Pembelian",
          ]}
          labelFormatter={(label, payload) =>
            payload?.[0]?.payload?.fullName || label
          }
          contentStyle={{
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
          }}
        />
        <Bar dataKey="amount" fill="#1e6091" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
