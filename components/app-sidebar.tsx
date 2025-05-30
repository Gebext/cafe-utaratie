import {
  BarChart3,
  Coffee,
  Home,
  Package,
  Settings,
  ShoppingCart,
  TrendingUp,
  Users,
  Anchor,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CaffeLogo } from "@/components/caffe-logo";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Penjualan",
    url: "/dashboard/sales",
    icon: TrendingUp,
  },
  {
    title: "Produk",
    url: "/dashboard/products",
    icon: Coffee,
  },
  {
    title: "Bahan Baku",
    url: "/dashboard/inventory",
    icon: Package,
  },
  {
    title: "Pelanggan",
    url: "/dashboard/customers",
    icon: Users,
  },
  {
    title: "Laporan",
    url: "/dashboard/reports",
    icon: BarChart3,
  },
];

const quickActions = [
  {
    title: "Transaksi Baru",
    url: "/dashboard/new-transaction",
    icon: ShoppingCart,
  },
  {
    title: "Pengaturan",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-[#c9d6df]">
      <SidebarHeader className="border-b border-[#c9d6df] p-4">
        <div className="flex items-center gap-3">
          <div className="scale-75">
            <CaffeLogo />
          </div>
          <div>
            <h2
              className="text-lg font-bold text-[#1e6091]"
              style={{ fontFamily: "Pirata One, cursive" }}
            >
              Caffe Urataie
            </h2>
            <p className="text-xs text-muted-foreground">Floating Restaurant</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel
            className="text-[#1e6091] font-semibold"
            style={{ fontFamily: "Pirata One, cursive" }}
          >
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel
            className="text-[#1e6091] font-semibold"
            style={{ fontFamily: "Pirata One, cursive" }}
          >
            Quick Actions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickActions.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-[#c9d6df] p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Anchor className="h-4 w-4 text-[#1e6091]" />
          <span>Crew Portal v1.0</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
