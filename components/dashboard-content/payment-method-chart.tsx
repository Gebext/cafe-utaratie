"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { name: "Tunai", value: 45, color: "#1e6091" },
  { name: "Transfer", value: 35, color: "#2980b9" },
  { name: "E-Wallet", value: 15, color: "#5dade2" },
  { name: "Kartu", value: 5, color: "#aed6f1" },
];

export function PaymentMethodChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}%`, "Persentase"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
