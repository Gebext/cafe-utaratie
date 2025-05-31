"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Filter, Search } from "lucide-react";

type Props = {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
};

type Category = {
  ID_Kategori: number;
  Nama_Kategori: string;
};

export default function CardFilter({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/kategori-produk")
      .then((res) => res.json())
      .then((data) => setCategories(data.data))
      .catch((err) => console.error("Gagal memuat kategori", err));
  }, []);

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
                placeholder="Cari menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-[#c9d6df] focus-visible:ring-[#1e6091]"
              />
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-[#c9d6df]">
                <Filter className="mr-2 h-4 w-4" />
                {selectedCategory === "all"
                  ? "Semua Kategori"
                  : selectedCategory}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedCategory("all")}>
                Semua Kategori
              </DropdownMenuItem>
              {categories.map((cat) => (
                <DropdownMenuItem
                  key={cat.ID_Kategori}
                  onClick={() => setSelectedCategory(cat.Nama_Kategori)}
                >
                  {cat.Nama_Kategori}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
