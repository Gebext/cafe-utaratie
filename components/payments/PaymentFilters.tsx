"use client";

import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PaymentFilters } from "./types";

interface PaymentFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filters: PaymentFilters;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

export function PaymentFilter({
  searchTerm,
  setSearchTerm,
  filters,
  onFilterChange,
  onClearFilters,
}: PaymentFilterProps) {
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
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari pembayaran..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-[#c9d6df] focus-visible:ring-[#1e6091]"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <div>
              <Input
                type="date"
                placeholder="Tanggal Pembayaran"
                value={filters.tanggal}
                onChange={(e) => onFilterChange("tanggal", e.target.value)}
                className="border-[#c9d6df] focus-visible:ring-[#1e6091]"
              />
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full border-[#c9d6df]">
                    <Filter className="mr-2 h-4 w-4" />
                    {filters.metode || "Metode Pembayaran"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => onFilterChange("metode", "")}
                  >
                    Semua Metode
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onFilterChange("metode", "Tunai")}
                  >
                    Tunai
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onFilterChange("metode", "Transfer Bank")}
                  >
                    Transfer Bank
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onFilterChange("metode", "Kartu Kredit")}
                  >
                    Kartu Kredit
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div>
              <Button
                variant="outline"
                onClick={onClearFilters}
                className="w-full border-[#c9d6df]"
              >
                Reset Filter
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
