import { hashPassword } from "@/utils/hash";
import * as model from "@/models/karyawanModel";

// Daftar semua karyawan
export async function listKaryawan(filter: { nama?: string; role?: string }) {
  return model.getAllKaryawan(filter);
}

//Tambah karyawan baru
export async function registerKaryawan(
  nama: string,
  email: string,
  password: string,
  role: string,
  kontak: string
) {
  const existing = await model.findKaryawanByEmail(email);
  if (existing) throw new Error("Email sudah digunakan");

  const hashed = await hashPassword(password);
  await model.createKaryawan(nama, email, hashed, role, kontak);

  return model.findKaryawanByEmail(email);
}

//Edit data karyawan
export async function editKaryawan(id: number, data: any) {
  const updateData: any = { ...data };

  if (data.password) {
    updateData.password = await hashPassword(data.password);
  }

  const fieldMap: Record<string, string> = {
    nama: "Nama_Karyawan",
    email: "Email",
    password: "Password",
    role: "Role",
    kontak: "Nomor_Kontak",
  };

  const filteredData: Record<string, any> = {};
  for (const [key, value] of Object.entries(updateData)) {
    const dbField = fieldMap[key];
    if (dbField) filteredData[dbField] = value;
  }

  if (Object.keys(filteredData).length === 0) {
    return model.getKaryawanById(id);
  }

  await model.updateKaryawan(id, filteredData);
  return model.getKaryawanById(id);
}

//Hapus karyawan (soft delete)
export async function removeKaryawan(id: number) {
  await model.deleteKaryawan(id);
}

//Ambil satu karyawan berdasarkan ID
export async function getKaryawanById(id: number) {
  return model.getKaryawanById(id);
}

//Daftar karyawan dengan pagination
export async function listKaryawanWithPagination(filter: {
  nama?: string;
  role?: string;
  limit: number;
  offset: number;
}) {
  return model.getAllKaryawanWithPagination(filter);
}
