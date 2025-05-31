import { NextRequest } from "next/server";
import * as service from "@/services/karyawanService";
import { success, error } from "@/lib/response"; // asumsikan helper kamu ada di sini

// GET: ambil semua karyawan, bisa difilter
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const nama = searchParams.get("nama") || undefined;
  const role = searchParams.get("role") || undefined;

  try {
    const data = await service.listKaryawan({ nama, role });
    return success("Data karyawan berhasil diambil", data);
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
