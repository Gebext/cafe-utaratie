"use client";

import { LogOut, Anchor } from "lucide-react";

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

import {
  navigationItems,
  manajemenItems,
  transaksiItems,
} from "@/src/constant/navigationItems";

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
              Caffe Utaratie
            </h2>
            <p className="text-xs text-muted-foreground">Crew Dashboard</p>
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
            Manajemen
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {manajemenItems.map((item) => (
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
            Transaksi
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {transaksiItems.map((item) => (
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
        <button
          className="flex items-center gap-2 text-sm text-[#1e6091] font-semibold"
          style={{ fontFamily: "Pirata One, cursive" }}
          onClick={() => {
            // logout logic here
            console.log("Logout clicked");
          }}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
