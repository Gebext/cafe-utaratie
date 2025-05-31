import {
  Home,
  Coffee,
  Package,
  Truck,
  BookOpen,
  Users,
  ShoppingCart,
  ClipboardCheck,
  FileClock,
  ListTodo,
  BarChart3,
} from "lucide-react";

export const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
];

export const manajemenItems = [
  {
    title: "Menu & Produk",
    url: "/dashboard/products",
    icon: Coffee,
  },
  {
    title: "Bahan Baku",
    url: "/dashboard/inventory",
    icon: Package,
  },
  {
    title: "Supplier",
    url: "/dashboard/suppliers",
    icon: Truck,
  },
  {
    title: "Karyawan",
    url: "/dashboard/employees",
    icon: BookOpen,
  },
  {
    title: "Pelanggan",
    url: "/dashboard/customers",
    icon: Users,
  },
];

export const transaksiItems = [
  {
    title: "Transaksi Penjualan",
    url: "/dashboard/sales",
    icon: ShoppingCart,
  },
  {
    title: "Pembelian Bahan",
    url: "/dashboard/purchases",
    icon: ClipboardCheck,
  },
  {
    title: "Laporan Waste",
    url: "/dashboard/waste-report",
    icon: FileClock,
  },
];

export const laporanItems = [
  {
    title: "Ringkasan Laporan",
    url: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    title: "Detail Transaksi",
    url: "/dashboard/report/transactions",
    icon: ListTodo,
  },
  {
    title: "Detail Pembelian",
    url: "/dashboard/report/purchases",
    icon: ClipboardCheck,
  },
];
