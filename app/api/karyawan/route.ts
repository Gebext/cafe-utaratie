import { NextRequest } from "next/server";
import * as service from "@/services/karyawanService";
import { success, error } from "@/lib/response";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidRole(role: string) {
  return ["admin", "kasir"].includes(role.toLowerCase());
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const nama = searchParams.get("nama") || undefined;
  const role = searchParams.get("role") || undefined;
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  if (isNaN(limit) || limit < 0 || isNaN(offset) || offset < 0) {
    return error("Limit dan offset harus berupa angka positif", 400);
  }

  try {
    const result = await service.listKaryawanWithPagination({
      nama,
      role,
      limit,
      offset,
    });

    return success("List karyawan berhasil diambil", result.data, {
      total: result.total,
      limit,
      offset,
    });
  } catch {
    return error("Gagal mengambil data karyawan", 500);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nama, email, password, role, kontak } = body;

  if (!nama || !email || !password || !role || !kontak) {
    return error("Semua field wajib diisi", 400);
  }

  if (!isValidEmail(email)) {
    return error("Format email tidak valid", 400);
  }

  if (password.length < 6) {
    return error("Password minimal 6 karakter", 400);
  }

  if (!isValidRole(role)) {
    return error("Role hanya boleh 'admin' atau 'kasir'", 400);
  }

  try {
    const newKaryawan = await service.registerKaryawan(
      nama,
      email,
      password,
      role,
      kontak
    );
    return success("Karyawan berhasil ditambahkan", newKaryawan);
  } catch (err: any) {
    return error(err.message || "Gagal menambahkan karyawan", 400);
  }
}
