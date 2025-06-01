import { NextRequest } from "next/server";
import * as service from "@/services/karyawanService";
import { success, error } from "@/lib/response"; // asumsikan helper kamu ada di sini

// GET: ambil semua karyawan dengan filter + pagination
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const nama = searchParams.get("nama") || undefined;
  const role = searchParams.get("role") || undefined;

  // Ambil pagination dari query
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = parseInt(searchParams.get("offset") || "0");

  try {
    const result = await service.listKaryawanWithPagination({
      nama,
      role,
      limit,
      offset,
    });
    return success("List produk berhasil diambil", result.data, {
      total: result.total,
      limit,
      offset,
    });
  } catch (err) {
    return error("Gagal mengambil data karyawan", 500);
  }
}

// POST: buat karyawan baru
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nama, email, password, role, kontak } = body;

  try {
    const newKaryawan = await service.registerKaryawan(
      nama,
      email,
      password,
      role,
      kontak
    );
    return success("Karyawan berhasil ditambahkan", newKaryawan); // ✅
  } catch (err: any) {
    return error(err.message, 400);
  }
}
