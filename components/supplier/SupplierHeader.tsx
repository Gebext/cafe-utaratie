import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface SupplierHeaderProps {
  onAddClick: () => void;
}

export function SupplierHeader({ onAddClick }: SupplierHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1
          className="text-3xl font-bold text-[#1e6091]"
          style={{ fontFamily: "Pirata One, cursive" }}
        >
          Trading Partners
        </h1>
        <p className="text-muted-foreground">
          Kelola mitra dagang untuk pasokan bahan makanan
        </p>
      </div>
      <Button
        onClick={onAddClick}
        className="bg-[#1e6091] hover:bg-[#154c74]"
        style={{ fontFamily: "Pirata One, cursive" }}
      >
        <Plus className="mr-2 h-4 w-4" />
        Tambah Mitra Baru
      </Button>
    </div>
  );
}
