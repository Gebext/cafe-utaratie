import {
  Home,
  Package,
  Truck,
  BookOpen,
  ClipboardCheck,
  FileClock,
  ListTodo,
  BarChart3,
  ShoppingBag,
  CreditCard,
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
];

export const transaksiItems = [
  {
    title: "Pembelian",
    url: "/dashboard/purchases",
    icon: ShoppingBag,
  },
  {
    title: "Pembayaran",
    url: "/dashboard/payments",
    icon: CreditCard,
  },
  {
    title: "Laporan Waste",
    url: "/dashboard/waste-report",
    icon: FileClock,
  },
];
