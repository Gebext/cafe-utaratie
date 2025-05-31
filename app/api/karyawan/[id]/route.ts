import { NextRequest } from "next/server";
import * as service from "@/services/karyawanService";
import { success, error } from "@/lib/response";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = parseInt(context.params.id);

  try {
    const data = await service.getKaryawanById(id);
    if (!data) {
      return error("Karyawan tidak ditemukan", 404);
    }

    return success("Data karyawan berhasil diambil", data);
  } catch (err) {
    console.error("GET error:", err);
    return error("Gagal mengambil data karyawan", 500);
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = parseInt(context.params.id);
  const body = await req.json();

  try {
    const updated = await service.editKaryawan(id, body);
    return success("Karyawan berhasil diperbarui", updated);
  } catch (err: any) {
    console.error("PUT error:", err);
    return error(err.message || "Gagal memperbarui karyawan", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = parseInt(context.params.id);

  try {
    await service.removeKaryawan(id);
    return success("Karyawan berhasil dihapus");
  } catch (err) {
    console.error("DELETE error:", err);
    return error("Gagal menghapus karyawan", 500);
  }
}
