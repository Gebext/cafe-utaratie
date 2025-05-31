import { NextRequest } from "next/server";
import {
  getSupplier,
  updateSupplier,
  deleteSupplier,
} from "@/services/supplierService";
import { success, error } from "@/lib/response";
import { editKaryawan } from "@/services/karyawanService";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const supplier = await getSupplier(Number(id));

  if (!supplier) return error("Supplier tidak ditemukan", 404);

  return success("Supplier berhasil diambil", supplier);
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = parseInt(context.params.id);
  const body = await req.json();

  try {
    const updated = await editKaryawan(id, body);
    return success("Karyawan berhasil diperbarui", updated);
  } catch (err: any) {
    console.error("PUT error:", err);
    return error(err.message || "Gagal memperbarui karyawan", 500);
  }
}
