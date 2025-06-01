"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Karyawan } from "./karyawan-management";

interface KaryawanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    karyawan: Omit<Karyawan, "ID_Karyawan"> & { Password: string }
  ) => void;
  title: string;
  submitText: string;
  initialData?: Karyawan;
}

export function KaryawanDialog({
  open,
  onOpenChange,
  onSubmit,
  title,
  submitText,
  initialData,
}: KaryawanDialogProps) {
  const [formData, setFormData] = useState({
    Nama_Karyawan: "",
    Role: "",
    Nomor_Kontak: "",
    Email: "",
    Password: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        Nama_Karyawan: initialData.Nama_Karyawan,
        Role: initialData.Role,
        Nomor_Kontak: initialData.Nomor_Kontak,
        Email: initialData.Email,
        Password: "",
      });
    } else {
      setFormData({
        Nama_Karyawan: "",
        Role: "",
        Nomor_Kontak: "",
        Email: "",
        Password: "",
      });
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.Nama_Karyawan ||
      !formData.Role ||
      !formData.Nomor_Kontak ||
      !formData.Email ||
      !formData.Password
    ) {
      return;
    }

    onSubmit({
      Nama_Karyawan: formData.Nama_Karyawan,
      Role: formData.Role,
      Nomor_Kontak: formData.Nomor_Kontak,
      Email: formData.Email,
      Password: formData.Password,
    });

    setFormData({
      Nama_Karyawan: "",
      Role: "",
      Nomor_Kontak: "",
      Email: "",
      Password: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle
            className="text-[#1e6091]"
            style={{ fontFamily: "Pirata One, cursive" }}
          >
            {title}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Edit informasi kru yang sudah ada"
              : "Tambahkan kru baru ke dalam tim"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="Nama_Karyawan">Nama Karyawan</Label>
              <Input
                id="Nama_Karyawan"
                value={formData.Nama_Karyawan}
                onChange={(e) =>
                  setFormData({ ...formData, Nama_Karyawan: e.target.value })
                }
                placeholder="Masukkan nama karyawan"
                className="border-[#c9d6df] focus-visible:ring-[#1e6091]"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Role">Posisi</Label>
              <Select
                value={formData.Role}
                onValueChange={(value) =>
                  setFormData({ ...formData, Role: value })
                }
              >
                <SelectTrigger className="border-[#c9d6df] focus:ring-[#1e6091]">
                  <SelectValue placeholder="Pilih posisi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manajer">Manajer</SelectItem>
                  <SelectItem value="Kasir">Kasir</SelectItem>
                  <SelectItem value="Chef">Chef</SelectItem>
                  <SelectItem value="Pelayan">Pelayan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Nomor_Kontak">Nomor Kontak</Label>
              <Input
                id="Nomor_Kontak"
                value={formData.Nomor_Kontak}
                onChange={(e) =>
                  setFormData({ ...formData, Nomor_Kontak: e.target.value })
                }
                placeholder="Masukkan nomor kontak"
                className="border-[#c9d6df] focus-visible:ring-[#1e6091]"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Email">Email</Label>
              <Input
                id="Email"
                type="email"
                value={formData.Email}
                onChange={(e) =>
                  setFormData({ ...formData, Email: e.target.value })
                }
                placeholder="Masukkan email"
                className="border-[#c9d6df] focus-visible:ring-[#1e6091]"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Password">Password</Label>
              <Input
                id="Password"
                type="password"
                value={formData.Password}
                onChange={(e) =>
                  setFormData({ ...formData, Password: e.target.value })
                }
                placeholder="Masukkan password"
                className="border-[#c9d6df] focus-visible:ring-[#1e6091]"
                required={!initialData}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="bg-[#1e6091] hover:bg-[#154c74]"
              style={{ fontFamily: "Pirata One, cursive" }}
            >
              {submitText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
