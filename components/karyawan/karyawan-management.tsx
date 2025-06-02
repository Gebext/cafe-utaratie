"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

import { KaryawanHeader } from "./KaryawanHeader";
import { KaryawanFilter } from "./KaryawanFilter";
import { KaryawanTable } from "./KaryawanTable";
import { KaryawanDetailDialog } from "./karyawan-detail-dialog";
import { KaryawanDialog } from "./karyawan-dialog";
import { DeleteKaryawanDialog } from "./delete-karyawan-dialog";
import Pagination from "../ui/pagination";

export interface Karyawan {
  ID_Karyawan: number;
  Nama_Karyawan: string;
  Role: string;
  Nomor_Kontak: string;
  Email: string;
  Password: string;
}

export function KaryawanManagement() {
  const [karyawan, setKaryawan] = useState<Karyawan[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedKaryawan, setSelectedKaryawan] = useState<Karyawan | null>(
    null
  );

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  // Pagination State
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10); // fixed 5 per page
  const [total, setTotal] = useState(0);

  const fetchKaryawan = useCallback(async () => {
    try {
      const res = await fetch("/api/karyawan");
      if (!res.ok) throw new Error("Fetch error");

      const json = await res.json();
      setKaryawan(json.data);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data karyawan");
    }
  }, []);

  useEffect(() => {
    fetchKaryawan();
  }, [fetchKaryawan]);

  // Filter + Pagination
  const filtered = karyawan.filter((k) => {
    const matchesSearch = k.Nama_Karyawan.toLowerCase().includes(
      searchTerm.toLowerCase()
    );
    const matchesRole = selectedRole === "all" || k.Role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const paginatedKaryawan = filtered.slice(offset, offset + limit);

  useEffect(() => {
    setTotal(filtered.length);
    if (offset >= filtered.length && offset !== 0) {
      setOffset(0); // reset if filter causes out-of-bound offset
    }
  }, [filtered, offset]);

  const handleAddClick = () => {
    setSelectedKaryawan(null);
    setOpenDialog(true);
  };

  const handleEdit = (k: Karyawan) => {
    setSelectedKaryawan(k);
    setOpenDialog(true);
  };

  const handleDelete = (k: Karyawan) => {
    setSelectedKaryawan(k);
    setOpenDeleteDialog(true);
  };

  const handleView = (k: Karyawan) => {
    setSelectedKaryawan(k);
    setOpenDetailDialog(true);
  };

  const handleAddOrUpdateKaryawan = async (
    newData: Omit<Karyawan, "ID_Karyawan"> & { Password: string }
  ) => {
    const body = {
      nama: newData.Nama_Karyawan,
      role: newData.Role,
      kontak: newData.Nomor_Kontak,
      email: newData.Email,
      password: newData.Password,
    };

    try {
      const isEdit = !!selectedKaryawan;

      const res = await fetch(
        isEdit
          ? `/api/karyawan/${selectedKaryawan!.ID_Karyawan}`
          : "/api/karyawan",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) throw new Error();

      const json = await res.json();
      const updatedData: Karyawan = json.data;

      setKaryawan((prev) =>
        isEdit
          ? prev.map((k) =>
              k.ID_Karyawan === updatedData.ID_Karyawan ? updatedData : k
            )
          : [...prev, updatedData]
      );

      toast.success(
        isEdit
          ? "Karyawan berhasil diperbarui"
          : "Karyawan berhasil ditambahkan"
      );
    } catch (error) {
      console.error(error);
      toast.error(
        selectedKaryawan
          ? "Gagal memperbarui karyawan"
          : "Gagal menambahkan karyawan"
      );
    } finally {
      setOpenDialog(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedKaryawan) return;

    try {
      const res = await fetch(`/api/karyawan/${selectedKaryawan.ID_Karyawan}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      setKaryawan((prev) =>
        prev.filter((k) => k.ID_Karyawan !== selectedKaryawan.ID_Karyawan)
      );

      toast.success("Karyawan berhasil dihapus");
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus karyawan");
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  return (
    <section className="space-y-6">
      <KaryawanHeader onAddClick={handleAddClick} />

      <KaryawanFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        roles={["all", "Manajer", "Kasir", "Chef", "Pelayan"]}
      />

      <KaryawanTable
        data={paginatedKaryawan}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Pagination
        offset={offset}
        limit={limit}
        total={total}
        onPageChange={setOffset}
      />

      <KaryawanDetailDialog
        open={openDetailDialog}
        onOpenChange={setOpenDetailDialog}
        karyawan={selectedKaryawan}
      />

      <KaryawanDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onSubmit={handleAddOrUpdateKaryawan}
        title={selectedKaryawan ? "Edit Kru Kapal" : "Tambah Kru Baru"}
        submitText={selectedKaryawan ? "Update" : "Tambah"}
        initialData={selectedKaryawan ?? undefined}
      />

      <DeleteKaryawanDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onConfirm={handleConfirmDelete}
        karyawanName={selectedKaryawan?.Nama_Karyawan || ""}
      />
    </section>
  );
}
