"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface WasteReport {
  Jenis_Laporan: "Expired" | "Waste" | "Break";
  Jumlah_Terbuang: number;
}

interface WasteReportsChartProps {
  data: WasteReport[];
}

export function WasteReportsChart({ data }: WasteReportsChartProps) {
  // Aggregate by waste type
  const wasteData: Record<string, number> = {};
  data.forEach((report) => {
    const type = report.Jenis_Laporan;
    wasteData[type] = (wasteData[type] || 0) + report.Jumlah_Terbuang;
  });

  const colors = {
    Expired: "#ef4444",
    Waste: "#f97316",
    Break: "#8b5cf6",
  };

  const chartData = Object.entries(wasteData).map(([name, value]) => ({
    name,
    value,
    color: colors[name as keyof typeof colors] || "#6b7280",
    percentage: Math.round(
      (value /
        Math.max(
          Object.values(wasteData).reduce((a, b) => a + b, 0),
          1
        )) *
        100
    ),
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        Tidak ada data waste report
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
          innerRadius={40}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name: string) => [`${value} item`, name]}
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
