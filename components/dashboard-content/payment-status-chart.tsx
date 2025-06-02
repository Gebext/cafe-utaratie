"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface Purchase {
  Is_Paid: number | string | boolean;
  Total_Biaya: string;
}

interface PaymentStatusChartProps {
  data: Purchase[];
}

export function PaymentStatusChart({ data }: PaymentStatusChartProps) {
  const isPaid = (purchase: Purchase): boolean => {
    if (typeof purchase.Is_Paid === "boolean") return purchase.Is_Paid;
    if (typeof purchase.Is_Paid === "string")
      return (
        purchase.Is_Paid === "1" || purchase.Is_Paid.toLowerCase() === "true"
      );
    return purchase.Is_Paid === 1;
  };

  const paidCount = data.filter(isPaid).length;
  const unpaidCount = data.length - paidCount;

  const chartData = [
    {
      name: "Lunas",
      value: paidCount,
      color: "#10b981",
      percentage: Math.round((paidCount / Math.max(data.length, 1)) * 100),
    },
    {
      name: "Belum Lunas",
      value: unpaidCount,
      color: "#ef4444",
      percentage: Math.round((unpaidCount / Math.max(data.length, 1)) * 100),
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name: string) => [
            `${value} transaksi`,
            name,
          ]}
          contentStyle={{
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
          }}
        />
        <Legend
          formatter={(value, entry: any) => (
            <span style={{ color: entry.color }}>
              {value} ({entry.payload.percentage}%)
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
