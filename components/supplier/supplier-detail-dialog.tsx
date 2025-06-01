"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Phone, Package } from "lucide-react";
import type { Supplier } from "./supplier-management";

interface SupplierDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: Supplier | null;
}

export function SupplierDetailDialog({
  open,
  onOpenChange,
  supplier,
}: SupplierDetailDialogProps) {
  if (!supplier) return null;

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Get category badge color
  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case "Ikan Segar":
        return "default" as const;
      case "Sayuran":
        return "secondary" as const;
      case "Bumbu":
        return "outline" as const;
      case "Daging":
        return "destructive" as const;
      case "Lainnya":
        return "secondary" as const;
      default:
        return "outline" as const;
    }
  };

  // Get One Piece themed category description
  const getCategoryDescription = (category: string) => {
    switch (category) {
      case "Ikan Segar":
        return "Menyediakan hasil laut segar dari All Blue untuk hidangan terbaik";
      case "Sayuran":
        return "Pasokan sayuran segar dari kebun terbaik untuk menu sehat";
      case "Bumbu":
        return "Rempah-rempah pilihan untuk cita rasa istimewa ala chef Sanji";
      case "Daging":
        return "Daging berkualitas tinggi untuk hidangan utama restoran";
      case "Lainnya":
        return "Berbagai kebutuhan lainnya untuk operasional restoran";
      default:
        return "Mitra dagang terpercaya untuk kebutuhan restoran";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle
            className="text-[#1e6091]"
            style={{ fontFamily: "Pirata One, cursive" }}
          >
            Detail Mitra Dagang
          </DialogTitle>
          <DialogDescription>
            Informasi lengkap tentang supplier
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16 bg-[#1e6091] text-white">
              <AvatarFallback>
                {getInitials(supplier.Nama_Supplier)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold">{supplier.Nama_Supplier}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={getCategoryBadgeVariant(supplier.Nama_Kategori)}
                >
                  {supplier.Nama_Kategori}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  ID: {supplier.ID_Supplier}
                </span>
                {supplier.Nama_Supplier.includes("Baratie") && (
                  <Badge variant="default" className="text-xs">
                    Partner Khusus
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-[#c9d6df]">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-[#1e6091]" />
                <h4 className="font-medium text-[#1e6091]">Spesialisasi</h4>
              </div>
              <p className="text-sm">
                {getCategoryDescription(supplier.Nama_Kategori)}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 border border-[#c9d6df] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-[#1e6091]" />
                  <h4 className="font-medium text-[#1e6091]">Alamat</h4>
                </div>
                <p className="text-sm">{supplier.Alamat}</p>
              </div>
              <div className="p-4 border border-[#c9d6df] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="h-4 w-4 text-[#1e6091]" />
                  <h4 className="font-medium text-[#1e6091]">Kontak</h4>
                </div>
                <p className="text-sm">{supplier.Nomor_Kontak}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Status Kemitraan
              </h4>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                Aktif
              </Badge>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
