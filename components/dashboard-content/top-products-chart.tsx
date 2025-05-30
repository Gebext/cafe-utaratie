"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const data = [
  { name: "Kopi Latte", sales: 45 },
  { name: "Nasi Goreng", sales: 38 },
  { name: "Cappuccino", sales: 32 },
  { name: "Sandwich", sales: 28 },
  { name: "Americano", sales: 25 },
];

export function TopProductsChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} layout="horizontal">
        <CartesianGrid strokeDasharray="3 3" stroke="#c9d6df" />
        <XAxis type="number" stroke="#666" />
        <YAxis dataKey="name" type="category" stroke="#666" width={80} />
        <Tooltip
          formatter={(value) => [`${value} porsi`, "Terjual"]}
          labelStyle={{ color: "#1e6091" }}
        />
        <Bar dataKey="sales" fill="#1e6091" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
