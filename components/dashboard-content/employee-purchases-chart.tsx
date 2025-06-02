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
  Nama_Karyawan: string;
  Total_Biaya: string;
}

interface EmployeePurchasesChartProps {
  data: Purchase[];
}

export function EmployeePurchasesChart({ data }: EmployeePurchasesChartProps) {
  // Aggregate by employee
  const employeeData: Record<string, { amount: number; count: number }> = {};
  data.forEach((purchase) => {
    const employee = purchase.Nama_Karyawan;
    if (!employeeData[employee]) {
      employeeData[employee] = { amount: 0, count: 0 };
    }
    employeeData[employee].amount += Number(purchase.Total_Biaya);
    employeeData[employee].count += 1;
  });

  // Convert to array and sort
  const chartData = Object.entries(employeeData)
    .map(([name, data]) => ({
      name: name.length > 12 ? `${name.substring(0, 12)}...` : name,
      fullName: name,
      amount: data.amount,
      count: data.count,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
        <XAxis dataKey="name" stroke="#6b7280" fontSize={10} />
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
          labelFormatter={(label, payload) =>
            payload?.[0]?.payload?.fullName || label
          }
          contentStyle={{
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
          }}
        />
        <Bar dataKey="amount" fill="#2563eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
