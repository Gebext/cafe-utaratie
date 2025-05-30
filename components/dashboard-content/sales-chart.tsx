"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const data = [
  { day: "Sen", sales: 2400000 },
  { day: "Sel", sales: 1800000 },
  { day: "Rab", sales: 3200000 },
  { day: "Kam", sales: 2800000 },
  { day: "Jum", sales: 3500000 },
  { day: "Sab", sales: 4200000 },
  { day: "Min", sales: 3800000 },
];

export function SalesChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1e6091" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#1e6091" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#c9d6df" />
        <XAxis dataKey="day" stroke="#666" />
        <YAxis
          stroke="#666"
          tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
        />
        <Tooltip
          formatter={(value: number) => [
            `Rp ${value.toLocaleString("id-ID")}`,
            "Penjualan",
          ]}
          labelStyle={{ color: "#1e6091" }}
        />
        <Area
          type="monotone"
          dataKey="sales"
          stroke="#1e6091"
          strokeWidth={2}
          fill="url(#salesGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
