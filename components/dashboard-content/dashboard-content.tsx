"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Users, AlertTriangle, DollarSign } from "lucide-react";
import { SalesChart } from "@/components/dashboard-content/sales-chart";
import { PaymentMethodChart } from "@/components//dashboard-content/payment-method-chart";
import { TopProductsChart } from "@/components//dashboard-content/top-products-chart";
import { RecentActivities } from "@/components//dashboard-content/recent-activities";

const quickStats = [
  {
    title: "Penjualan Hari Ini",
    value: "Rp 3.500.000",
    change: "+12%",
    changeType: "positive" as const,
    icon: DollarSign,
  },
  {
    title: "Transaksi Hari Ini",
    value: "85",
    change: "+8%",
    changeType: "positive" as const,
    icon: ShoppingCart,
  },
  {
    title: "Stok Rendah",
    value: "4",
    change: "Perlu Perhatian",
    changeType: "negative" as const,
    icon: AlertTriangle,
  },
  {
    title: "Total Pelanggan",
    value: "1,200",
    change: "+25 baru",
    changeType: "positive" as const,
    icon: Users,
  },
];

export function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-lg bg-gradient-to-r from-[#1e6091] to-[#2980b9] p-6 text-white">
        <h1
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "Pirata One, cursive" }}
        >
          Selamat Datang di Caffe Urataie!
        </h1>
        <p className="opacity-90">Kelola restoran terapung Anda dengan mudah</p>
      </div>

      {/* Quick Stats - Bento Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="border-[#c9d6df]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-[#1e6091]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#1e6091]">
                {stat.value}
              </div>
              <Badge
                variant={
                  stat.changeType === "positive" ? "default" : "destructive"
                }
                className="mt-1"
              >
                {stat.change}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section - Bento Style */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2 border-[#c9d6df]">
          <CardHeader>
            <CardTitle
              className="text-[#1e6091]"
              style={{ fontFamily: "Pirata One, cursive" }}
            >
              Penjualan Mingguan
            </CardTitle>
            <CardDescription>Tren penjualan 7 hari terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesChart />
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="border-[#c9d6df]">
          <CardHeader>
            <CardTitle
              className="text-[#1e6091]"
              style={{ fontFamily: "Pirata One, cursive" }}
            >
              Metode Pembayaran
            </CardTitle>
            <CardDescription>Distribusi pembayaran hari ini</CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentMethodChart />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section - Bento Style */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="border-[#c9d6df]">
          <CardHeader>
            <CardTitle
              className="text-[#1e6091]"
              style={{ fontFamily: "Pirata One, cursive" }}
            >
              Menu Terlaris
            </CardTitle>
            <CardDescription>
              Produk dengan penjualan tertinggi minggu ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TopProductsChart />
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="border-[#c9d6df]">
          <CardHeader>
            <CardTitle
              className="text-[#1e6091]"
              style={{ fontFamily: "Pirata One, cursive" }}
            >
              Aktivitas Terakhir
            </CardTitle>
            <CardDescription>Update terbaru dari restoran</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivities />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
