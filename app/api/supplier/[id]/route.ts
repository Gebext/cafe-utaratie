import { NextRequest } from "next/server";
import {
  getSupplier,
  updateSupplier,
  deleteSupplier,
} from "@/services/supplierService";
import { success, error } from "@/lib/response";
import { findSupplierById } from "@/models/supplierModel";

function isValidId(id: any) {
  return !isNaN(id) && Number(id) > 0;
}

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (!isValidId(id)) return error("ID tidak valid", 400);

  const supplier = await getSupplier(id);
  if (!supplier) return error("Supplier tidak ditemukan", 404);

  return success("Supplier berhasil diambil", supplier);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (!isValidId(id)) return error("ID tidak valid", 400);

  const body = await req.json();
  const { Nama_Supplier, Alamat, Nomor_Kontak, ID_Kategori } = body;

  if (
    !Nama_Supplier ||
    Nama_Supplier.length < 3 ||
    Nama_Supplier.length > 100
  ) {
    return error("Nama Supplier harus 3–100 karakter", 400);
  }
  if (!Alamat || Alamat.length < 5 || Alamat.length > 255) {
    return error("Alamat harus 5–255 karakter", 400);
  }
  if (!Nomor_Kontak || Nomor_Kontak.length < 8 || Nomor_Kontak.length > 20) {
    return error("Nomor Kontak harus 8–20 karakter", 400);
  }
  if (!ID_Kategori || isNaN(ID_Kategori)) {
    return error("ID Kategori tidak valid", 400);
  }

  const existingSupplier = await getSupplier(id);
  if (!existingSupplier) return error("Supplier tidak ditemukan", 404);

  // Cek apakah nama supplier sudah digunakan oleh supplier lain
  if (
    Nama_Supplier !== existingSupplier.Nama_Supplier &&
    (await findSupplierById(Nama_Supplier))
  ) {
    return error("Nama Supplier sudah digunakan", 400);
  }

  try {
    await updateSupplier(id, body);
    const updatedSupplier = await getSupplier(id);
    return success("Supplier berhasil diperbarui", updatedSupplier);
  } catch (err: any) {
    console.error("PUT error:", err);
    return error(err.message || "Gagal memperbarui supplier", 500);
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (!isValidId(id)) return error("ID tidak valid", 400);

  const existingSupplier = await getSupplier(id);
  if (!existingSupplier) return error("Supplier tidak ditemukan", 404);

  try {
    await deleteSupplier(id);
    return success("Supplier berhasil dihapus");
  } catch (err: any) {
    console.error("DELETE error:", err);
    return error(err.message || "Gagal menghapus supplier", 500);
  }
}
