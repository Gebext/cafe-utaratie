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
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari laporan..."
                value={filters.searchTerm}
                onChange={(e) =>
                  onFiltersChange({ searchTerm: e.target.value })
                }
                className="pl-10 border-[#c9d6df] focus-visible:ring-[#1e6091]"
              />
            </div>
          </div>

          <Select
            value={filters.selectedType}
            onValueChange={(value) => onFiltersChange({ selectedType: value })}
          >
            <SelectTrigger className="border-[#c9d6df]">
              <SelectValue placeholder="Jenis Laporan" />
            </SelectTrigger>
            <SelectContent>
              {reportTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === "all" ? "Semua Jenis" : type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.selectedStatus}
            onValueChange={(value) =>
              onFiltersChange({ selectedStatus: value })
            }
          >
            <SelectTrigger className="border-[#c9d6df]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {reportStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === "all" ? "Semua Status" : status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              value={filters.selectedDate}
              onChange={(e) =>
                onFiltersChange({ selectedDate: e.target.value })
              }
              className="pl-10 border-[#c9d6df] focus-visible:ring-[#1e6091]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
