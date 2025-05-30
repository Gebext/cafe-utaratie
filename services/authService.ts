// services/authService.ts
import { findKaryawanByEmail, createKaryawan } from "../models/karyawanModel";
import { comparePassword, hashPassword } from "../utils/hash";
import { signToken } from "../lib/jwt";

export async function registerUser({
  nama,
  email,
  password,
  role,
  kontak,
}: any) {
  const existing = await findKaryawanByEmail(email);
  if (existing) throw new Error("Email sudah terdaftar");

  const hashed = await hashPassword(password);
  await createKaryawan(nama, email, hashed, role, kontak);
}

export async function loginUser({ email, password }: any) {
  const user = (await findKaryawanByEmail(email)) as {
    ID_Karyawan: number;
    Password: string;
    Role: string;
    Nama_Karyawan: string;
    Email: string;
  } | null;

  if (!user) throw new Error("Email tidak ditemukan");

  const match = await comparePassword(password, user.Password);
  if (!match) throw new Error("Password salah");

  const token = signToken({ id: user.ID_Karyawan, role: user.Role });
  return { token, user };
}
