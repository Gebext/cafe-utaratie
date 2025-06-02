"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ShoppingCart,
  Users,
  AlertTriangle,
  DollarSign,
  Loader2,
  TrendingUp,
  Package,
} from "lucide-react";

import { formatCurrency } from "../lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { PurchaseTrendsChart } from "./purchase-trends-chart";
import { PaymentStatusChart } from "./payment-status-chart";
import { TopSuppliersChart } from "./top-suppliers-chart";
import { EmployeePurchasesChart } from "./employee-purchases-chart";
import { WasteReportsChart } from "./waste-report-chart";
import { MonthlyTrendsChart } from "./monthly-trends-chart";
import { PaymentMethodsChart } from "./payment-methods-chart";
import { RecentTransactions } from "./recent-transaction";

interface Purchase {
  ID_Pembelian: number;
  Tanggal_Pembelian: string;
  Jumlah: number;
  Total_Biaya: string;
  Is_Paid: number | string | boolean;
  ID_Supplier: number;
  Nama_Supplier: string;
  ID_Karyawan: number;
  Nama_Karyawan: string;
  ID_Produk: number;
  Nama_Produk: string;
}

interface Payment {
  ID_Pembayaran: number;
  Tanggal_Pembayaran: string;
  Metode_Pembayaran: string;
  Jumlah: string;
  Nomor_Referensi: string;
  ID_Pembelian: number;
  Nama_Supplier: string;
  Nama_Karyawan: string;
  Nama_Produk: string;
}

interface WasteReport {
  ID_Laporan: number;
  ID_Karyawan: number;
  Nama_Karyawan: string;
  ID_Produk: number;
  Nama_Produk: string;
  Tanggal_Laporan: string;
  Jenis_Laporan: "Expired" | "Waste" | "Break";
  Jumlah_Terbuang: number;
  Alasan: string;
  Status_Laporan: "Pending" | "Dikonfirmasi" | "Ditindaklanjuti";
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export function DashboardContent() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [wasteReports, setWasteReports] = useState<WasteReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [purchasesRes, paymentsRes, wasteRes] = await Promise.all([
          fetch("http://localhost:3000/api/pembelian?limit=1000"),
          fetch("http://localhost:3000/api/pembayaran?limit=1000"),
          fetch("http://localhost:3000/api/laporan-bahan-baku?limit=1000"),
        ]);

        if (!purchasesRes.ok || !paymentsRes.ok || !wasteRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [purchasesData, paymentsData, wasteData] = await Promise.all([
          purchasesRes.json() as Promise<ApiResponse<Purchase>>,
          paymentsRes.json() as Promise<ApiResponse<Payment>>,
          wasteRes.json() as Promise<ApiResponse<WasteReport>>,
        ]);

        setPurchases(purchasesData.data || []);
        setPayments(paymentsData.data || []);
        setWasteReports(wasteData.data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Calculate statistics
  const totalPurchases = purchases.length;
  const totalPurchaseAmount = purchases.reduce(
    (sum, p) => sum + Number(p.Total_Biaya),
    0
  );
  const unpaidPurchases = purchases.filter((p) => {
    if (typeof p.Is_Paid === "boolean") return !p.Is_Paid;
    if (typeof p.Is_Paid === "string")
      return p.Is_Paid === "0" || p.Is_Paid.toLowerCase() === "false";
    return p.Is_Paid === 0;
  }).length;
  const totalWasteItems = wasteReports.reduce(
    (sum, w) => sum + w.Jumlah_Terbuang,
    0
  );
  const totalPayments = payments.length;
  const totalPaymentAmount = payments.reduce(
    (sum, p) => sum + Number(p.Jumlah),
    0
  );
  const uniqueSuppliers = new Set(purchases.map((p) => p.Nama_Supplier)).size;

  const quickStats = [
    {
      title: "Total Pembelian",
      value: formatCurrency(totalPurchaseAmount),
      subtitle: `${totalPurchases} transaksi`,
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Total Pembayaran",
      value: formatCurrency(totalPaymentAmount),
      subtitle: `${totalPayments} pembayaran`,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Belum Dibayar",
      value: unpaidPurchases.toString(),
      subtitle: "transaksi pending",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      title: "Total Waste",
      value: totalWasteItems.toString(),
      subtitle: "item terbuang",
      icon: Package,
      color: "text-orange-600",
    },
    {
      title: "Active Suppliers",
      value: uniqueSuppliers.toString(),
      subtitle: "mitra aktif",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Efisiensi",
      value: `${Math.round(
        ((totalPurchases - unpaidPurchases) / Math.max(totalPurchases, 1)) * 100
      )}%`,
      subtitle: "pembayaran selesai",
      icon: TrendingUp,
      color: "text-indigo-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#1e6091]" />
          <p className="text-lg text-[#1e6091]">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Gagal memuat data dashboard: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-lg bg-gradient-to-r from-[#1e6091] to-[#2980b9] p-6 text-white">
        <h1
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "Pirata One, cursive" }}
        >
          Dashboard Caffe Utaratie
        </h1>
        <p className="opacity-90">
          Analisis data operasional restoran terapung
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="border-[#c9d6df]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Purchase Trends */}
        <Card className="border-[#c9d6df]">
          <CardHeader>
            <CardTitle
              className="text-[#1e6091]"
              style={{ fontFamily: "Pirata One, cursive" }}
            >
              Tren Pembelian Harian
            </CardTitle>
            <CardDescription>
              Volume pembelian dalam 30 hari terakhir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PurchaseTrendsChart data={purchases} />
          </CardContent>
        </Card>

        {/* Payment Status */}
        <Card className="border-[#c9d6df]">
          <CardHeader>
            <CardTitle
              className="text-[#1e6091]"
              style={{ fontFamily: "Pirata One, cursive" }}
            >
              Status Pembayaran
            </CardTitle>
            <CardDescription>
              Distribusi status pembayaran pembelian
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentStatusChart data={purchases} />
          </CardContent>
        </Card>
      </div>

      {/* Secondary Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Suppliers */}
        <Card className="border-[#c9d6df]">
          <CardHeader>
            <CardTitle
              className="text-[#1e6091]"
              style={{ fontFamily: "Pirata One, cursive" }}
            >
              Top Suppliers
            </CardTitle>
            <CardDescription>
              Supplier dengan volume pembelian tertinggi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TopSuppliersChart data={purchases} />
          </CardContent>
        </Card>

        {/* Employee Purchases */}
        <Card className="border-[#c9d6df]">
          <CardHeader>
            <CardTitle
              className="text-[#1e6091]"
              style={{ fontFamily: "Pirata One, cursive" }}
            >
              Pembelian per Karyawan
            </CardTitle>
            <CardDescription>
              Volume pembelian berdasarkan karyawan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmployeePurchasesChart data={purchases} />
          </CardContent>
        </Card>

        {/* Waste Reports */}
        <Card className="border-[#c9d6df]">
          <CardHeader>
            <CardTitle
              className="text-[#1e6091]"
              style={{ fontFamily: "Pirata One, cursive" }}
            >
              Laporan Waste
            </CardTitle>
            <CardDescription>Distribusi jenis waste/kehilangan</CardDescription>
          </CardHeader>
          <CardContent>
            <WasteReportsChart data={wasteReports} />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card className="border-[#c9d6df]">
          <CardHeader>
            <CardTitle
              className="text-[#1e6091]"
              style={{ fontFamily: "Pirata One, cursive" }}
            >
              Tren Bulanan
            </CardTitle>
            <CardDescription>
              Perbandingan pembelian vs pembayaran bulanan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlyTrendsChart purchases={purchases} payments={payments} />
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
            <CardDescription>
              Distribusi metode pembayaran yang digunakan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentMethodsChart data={payments} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="border-[#c9d6df]">
        <CardHeader>
          <CardTitle
            className="text-[#1e6091]"
            style={{ fontFamily: "Pirata One, cursive" }}
          >
            Transaksi Terbaru
          </CardTitle>
          <CardDescription>
            10 transaksi pembelian dan pembayaran terbaru
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentTransactions purchases={purchases} payments={payments} />
        </CardContent>
      </Card>
    </div>
  );
}
