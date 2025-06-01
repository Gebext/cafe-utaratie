import { NextRequest } from "next/server";
import {
  getSupplier,
  updateSupplier,
  deleteSupplier,
} from "@/services/supplierService";
import { success, error } from "@/lib/response";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supplier = await getSupplier(Number(id));

  if (!supplier) return error("Supplier tidak ditemukan", 404);

  return success("Supplier berhasil diambil", supplier);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const body = await req.json();

  try {
    await updateSupplier(id, body);
    const updatedSupplier = await getSupplier(id); // ambil data terbaru
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

  try {
    await deleteSupplier(id);
    return success("Supplier berhasil dihapus");
  } catch (err: any) {
    console.error("DELETE error:", err);
    return error(err.message || "Gagal menghapus supplier", 500);
  }
}
