"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import type { WasteReport } from "./waste-report-management";

interface WasteReportChartProps {
  data: WasteReport[];
}

export function WasteReportChart({ data }: WasteReportChartProps) {
  // Prepare data for pie chart (by type)
  const typeData = data.reduce((acc, report) => {
    const existing = acc.find((item) => item.name === report.Jenis_Laporan);
    if (existing) {
      existing.value += report.Jumlah_Terbuang;
    } else {
      acc.push({
        name: report.Jenis_Laporan,
        value: report.Jumlah_Terbuang,
        color:
          report.Jenis_Laporan === "Expired"
            ? "#ef4444"
            : report.Jenis_Laporan === "Waste"
            ? "#f97316"
            : "#8b5cf6",
      });
    }
    return acc;
  }, [] as Array<{ name: string; value: number; color: string }>);

  // Prepare data for bar chart (by status)
  const statusData = data.reduce((acc, report) => {
    const existing = acc.find((item) => item.name === report.Status_Laporan);
    if (existing) {
      existing.value += report.Jumlah_Terbuang;
    } else {
      acc.push({
        name: report.Status_Laporan,
        value: report.Jumlah_Terbuang,
      });
    }
    return acc;
  }, [] as Array<{ name: string; value: number }>);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart - By Type */}
      <div>
        <h4 className="text-sm font-medium mb-4 text-center">
          Kehilangan per Jenis
        </h4>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={typeData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {typeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} unit`, "Jumlah"]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart - By Status */}
      <div>
        <h4 className="text-sm font-medium mb-4 text-center">
          Kehilangan per Status
        </h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#c9d6df" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              formatter={(value) => [`${value} unit`, "Jumlah"]}
              labelStyle={{ color: "#1e6091" }}
            />
            <Bar dataKey="value" fill="#1e6091" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
