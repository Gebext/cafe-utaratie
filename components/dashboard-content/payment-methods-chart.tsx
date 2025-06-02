"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface Payment {
  Metode_Pembayaran: string;
  Jumlah: string;
}

interface PaymentMethodsChartProps {
  data: Payment[];
}

export function PaymentMethodsChart({ data }: PaymentMethodsChartProps) {
  // Aggregate by payment method
  const methodData: Record<string, { count: number; amount: number }> = {};
  data.forEach((payment) => {
    const method = payment.Metode_Pembayaran;
    if (!methodData[method]) {
      methodData[method] = { count: 0, amount: 0 };
    }
    methodData[method].count += 1;
    methodData[method].amount += Number(payment.Jumlah);
  });

  const colors = {
    Tunai: "#10b981",
    "Transfer Bank": "#3b82f6",
    "Kartu Kredit": "#8b5cf6",
    "E-Wallet": "#f59e0b",
  };

  const chartData = Object.entries(methodData).map(([name, data]) => ({
    name,
    value: data.count,
    amount: data.amount,
    color: colors[name as keyof typeof colors] || "#6b7280",
    percentage: Math.round(
      (data.count /
        Math.max(
          Object.values(methodData).reduce((acc, curr) => acc + curr.count, 0),
          1
        )) *
        100
    ),
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        Tidak ada data pembayaran
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={90}
          paddingAngle={5}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name: string, props: any) => [
            `${value} transaksi (${props.payload.percentage}%)`,
            name,
          ]}
          contentStyle={{
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
