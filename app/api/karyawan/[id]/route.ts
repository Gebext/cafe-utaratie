import { NextRequest } from "next/server";
import * as service from "@/services/karyawanService";
import { success, error } from "@/lib/response";

function isValidId(id: any): id is number {
  return !isNaN(id) && Number(id) > 0;
}

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = parseInt(context.params.id, 10);
  if (!isValidId(id)) return error("ID tidak valid", 400);

  try {
    const data = await service.getKaryawanById(id);
    if (!data) return error("Karyawan tidak ditemukan", 404);
    return success("Data karyawan berhasil diambil", data);
  } catch {
    return error("Gagal mengambil data karyawan", 500);
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = parseInt(context.params.id, 10);
  if (!isValidId(id)) return error("ID tidak valid", 400);

  const body = await req.json();

  if (
    "email" in body &&
    body.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)
  ) {
    return error("Format email tidak valid", 400);
  }

  if ("password" in body && body.password.length < 6) {
    return error("Password minimal 6 karakter", 400);
  }

  if ("role" in body && !["admin", "kasir"].includes(body.role)) {
    return error("Role hanya boleh 'admin' atau 'kasir'", 400);
  }

  try {
    const updated = await service.editKaryawan(id, body);
    return success("Karyawan berhasil diperbarui", updated);
  } catch (err: any) {
    return error(err.message || "Gagal memperbarui karyawan", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = parseInt(context.params.id, 10);
  if (!isValidId(id)) return error("ID tidak valid", 400);

  try {
    await service.removeKaryawan(id);
    return success("Karyawan berhasil dihapus");
  } catch {
    return error("Gagal menghapus karyawan", 500);
  }
}
