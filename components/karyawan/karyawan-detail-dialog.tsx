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
import type { Karyawan } from "./karyawan-management";

interface KaryawanDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  karyawan: Karyawan | null;
}

export function KaryawanDetailDialog({
  open,
  onOpenChange,
  karyawan,
}: KaryawanDetailDialogProps) {
  if (!karyawan) return null;

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Get role badge color
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Manajer":
        return "default" as const;
      case "Kasir":
        return "secondary" as const;
      case "Chef":
        return "outline" as const;
      case "Pelayan":
        return "destructive" as const;
      default:
        return "outline" as const;
    }
  };

  // Get One Piece themed role description
  const getRoleDescription = (role: string) => {
    switch (role) {
      case "Manajer":
        return "Kapten kapal yang memimpin seluruh kru";
      case "Kasir":
        return "Navigator yang mengelola harta karun";
      case "Chef":
        return "Koki kapal yang menyiapkan makanan lezat";
      case "Pelayan":
        return "Kru yang melayani para tamu dengan baik";
      default:
        return "Anggota kru penting di kapal";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle
            className="text-[#1e6091]"
            style={{ fontFamily: "Pirata One, cursive" }}
          >
            Detail Kru
          </DialogTitle>
          <DialogDescription>Informasi lengkap tentang kru</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16 bg-[#1e6091] text-white">
              <AvatarFallback className="text-black">
                {getInitials(karyawan.Nama_Karyawan)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold">{karyawan.Nama_Karyawan}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={getRoleBadgeVariant(karyawan.Role)}>
                  {karyawan.Role}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  ID: {karyawan.ID_Karyawan}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-[#c9d6df]">
              <h4 className="font-medium text-[#1e6091] mb-1">
                Posisi di Resto
              </h4>
              <p className="text-sm">{getRoleDescription(karyawan.Role)}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Email
                </h4>
                <p>{karyawan.Email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Nomor Kontak
                </h4>
                <p>{karyawan.Nomor_Kontak}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Status
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
