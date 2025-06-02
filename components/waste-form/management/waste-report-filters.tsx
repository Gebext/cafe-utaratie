"use client";

import { Search, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WasteReportFilters } from "./types";

interface WasteReportFiltersProps {
  filters: WasteReportFilters;
  onFiltersChange: (filters: Partial<WasteReportFilters>) => void;
}

const reportTypes = ["all", "Expired", "Waste", "Break"];
const reportStatuses = ["all", "Pending", "Dikonfirmasi", "Ditindaklanjuti"];

export function WasteReportFiltersCard({
  filters,
  onFiltersChange,
}: WasteReportFiltersProps) {
  return (
    <Card className="border-[#c9d6df]">
      <CardHeader>
        <CardTitle
          className="text-[#1e6091]"
          style={{ fontFamily: "Pirata One, cursive" }}
        >
          Filter & Pencarian
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Pencarian */}
          <div className="lg:col-span-2 flex flex-col gap-1 w-full">
            <label className="text-sm font-medium text-muted-foreground">
              Cari Laporan
            </label>
            <div className="relative w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ketik kata kunci..."
                value={filters.searchTerm}
                onChange={(e) =>
                  onFiltersChange({ searchTerm: e.target.value })
                }
                className="w-full pl-10 border-[#c9d6df] focus-visible:ring-[#1e6091]"
              />
            </div>
          </div>

          {/* Jenis Laporan */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium text-muted-foreground">
              Jenis Laporan
            </label>
            <Select
              value={filters.selectedType}
              onValueChange={(value) =>
                onFiltersChange({ selectedType: value })
              }
            >
              <SelectTrigger className="w-full border-[#c9d6df]">
                <SelectValue placeholder="Pilih jenis" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "all" ? "Semua Jenis" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium text-muted-foreground">
              Status
            </label>
            <Select
              value={filters.selectedStatus}
              onValueChange={(value) =>
                onFiltersChange({ selectedStatus: value })
              }
            >
              <SelectTrigger className="w-full border-[#c9d6df]">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                {reportStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "all" ? "Semua Status" : status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tanggal */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium text-muted-foreground">
              Tanggal
            </label>
            <div className="relative w-full">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={filters.selectedDate}
                onChange={(e) =>
                  onFiltersChange({ selectedDate: e.target.value })
                }
                className="w-full pl-10 border-[#c9d6df] focus-visible:ring-[#1e6091]"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
