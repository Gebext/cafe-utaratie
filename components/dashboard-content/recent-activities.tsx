import { Badge } from "@/components/ui/badge";
import { Clock, ShoppingCart, Package, UserPlus } from "lucide-react";

const activities = [
  {
    type: "transaction",
    message: "Transaksi baru #TRX-001",
    time: "2 menit lalu",
    icon: ShoppingCart,
    status: "success",
  },
  {
    type: "inventory",
    message: "Stok kopi arabica rendah",
    time: "15 menit lalu",
    icon: Package,
    status: "warning",
  },
  {
    type: "customer",
    message: "Pelanggan baru mendaftar",
    time: "1 jam lalu",
    icon: UserPlus,
    status: "info",
  },
  {
    type: "transaction",
    message: "Pembayaran #TRX-002 berhasil",
    time: "2 jam lalu",
    icon: ShoppingCart,
    status: "success",
  },
];

export function RecentActivities() {
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div
          key={index}
          className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
        >
          <div className="rounded-full bg-white p-2">
            <activity.icon className="h-4 w-4 text-[#1e6091]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {activity.message}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">{activity.time}</span>
              <Badge
                variant={
                  activity.status === "success"
                    ? "default"
                    : activity.status === "warning"
                    ? "destructive"
                    : "secondary"
                }
                className="text-xs"
              >
                {activity.status}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
