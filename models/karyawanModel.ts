import { db } from "../lib/db";

interface Karyawan {
  ID_Karyawan: number;
  Nama_Karyawan: string;
  Email: string;
  Password: string;
  Role: string;
  Nomor_Kontak: string;
  Deleted_At: Date | null;
}

export async function findKaryawanByEmail(email: string) {
  const [rows] = await db.query(
    "SELECT * FROM Karyawan WHERE Email = ? AND Deleted_At IS NULL",
    [email]
  );
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}

export async function createKaryawan(
  nama: string,
  email: string,
  password: string,
  role: string,
  kontak: string
) {
  await db.query(
    `INSERT INTO Karyawan (Nama_Karyawan, Email, Password, Role, Nomor_Kontak) VALUES (?, ?, ?, ?, ?)`,
    [nama, email, password, role, kontak]
  );
}
