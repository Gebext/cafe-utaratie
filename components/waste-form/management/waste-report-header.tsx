"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WasteReportHeaderProps {
  onAddReport: () => void;
}

export function WasteReportHeader({ onAddReport }: WasteReportHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1
          className="text-3xl font-bold text-[#1e6091]"
          style={{ fontFamily: "Pirata One, cursive" }}
        >
          Treasure Loss Reports
        </h1>
        <p className="text-muted-foreground">
          Laporan kehilangan bahan baku dan inventori
        </p>
      </div>
      <Button
        onClick={onAddReport}
        className="bg-[#1e6091] hover:bg-[#154c74]"
        style={{ fontFamily: "Pirata One, cursive" }}
      >
        <Plus className="mr-2 h-4 w-4" />
        Buat Laporan Baru
      </Button>
    </div>
  );
}
