import { hashPassword } from "@/utils/hash";
import * as model from "../models/karyawanModel";

export async function listKaryawan(filter: { nama?: string; role?: string }) {
  return await model.getAllKaryawan(filter);
}

export async function registerKaryawan(
  nama: string,
  email: string,
  password: string,
  role: string,
  kontak: string
) {
  const existing = await model.findKaryawanByEmail(email);
  if (existing) {
    throw new Error("Email sudah digunakan");
  }

  const hashed = await hashPassword(password);
  await model.createKaryawan(nama, email, hashed, role, kontak);

  return await model.findKaryawanByEmail(email); // ✅ return data karyawan
}

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
    if (dbField) {
      filteredData[dbField] = value;
    }
  }

  if (Object.keys(filteredData).length === 0) {
    return await model.getKaryawanById(id); // Tetap return data eksisting
  }

  await model.updateKaryawan(id, filteredData);
  const updated = await model.getKaryawanById(id);
  return updated;
}

export async function removeKaryawan(id: number) {
  await model.deleteKaryawan(id);
}

export async function getKaryawanById(id: number) {
  return await model.getKaryawanById(id);
}
