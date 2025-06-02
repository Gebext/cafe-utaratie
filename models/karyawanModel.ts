import { db } from "../lib/db";

//  Temukan karyawan berdasarkan email
export async function findKaryawanByEmail(email: string) {
  const [rows] = await db.query(
    "SELECT * FROM Karyawan WHERE Email = ? AND Deleted_At IS NULL",
    [email]
  );
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}

//  Ambil semua karyawan (tanpa pagination)
export async function getAllKaryawan(filter: { nama?: string; role?: string }) {
  let query = "SELECT * FROM Karyawan WHERE Deleted_At IS NULL";
  const params: any[] = [];

  if (filter.nama) {
    query += " AND Nama_Karyawan LIKE ?";
    params.push(`%${filter.nama}%`);
  }

  if (filter.role) {
    query += " AND Role = ?";
    params.push(filter.role);
  }

  const [rows] = await db.query(query, params);
  return rows;
}

//  Buat karyawan baru
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

//  Update karyawan berdasarkan ID
export async function updateKaryawan(
  id: number,
  data: Partial<{
    Nama_Karyawan: string;
    Email: string;
    Password: string;
    Role: string;
    Nomor_Kontak: string;
  }>
) {
  if (Object.keys(data).length === 0) return;

  const fields = Object.keys(data)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = Object.values(data);

  await db.query(`UPDATE Karyawan SET ${fields} WHERE ID_Karyawan = ?`, [
    ...values,
    id,
  ]);
}

//  Soft-delete karyawan
export async function deleteKaryawan(id: number) {
  await db.query(
    `UPDATE Karyawan SET Deleted_At = NOW() WHERE ID_Karyawan = ?`,
    [id]
  );
}

//  Ambil karyawan berdasarkan ID
export async function getKaryawanById(id: number) {
  const [rows] = await db.query(
    "SELECT * FROM Karyawan WHERE ID_Karyawan = ? AND Deleted_At IS NULL",
    [id]
  );
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}

//  Ambil semua karyawan dengan pagination
export async function getAllKaryawanWithPagination(filter: {
  nama?: string;
  role?: string;
  limit: number;
  offset: number;
}) {
  let baseQuery = "FROM Karyawan WHERE Deleted_At IS NULL";
  const params: any[] = [];

  if (filter.nama) {
    baseQuery += " AND Nama_Karyawan LIKE ?";
    params.push(`%${filter.nama}%`);
  }

  if (filter.role) {
    baseQuery += " AND Role = ?";
    params.push(filter.role);
  }

  const [dataRows] = await db.query(`SELECT * ${baseQuery} LIMIT ? OFFSET ?`, [
    ...params,
    filter.limit,
    filter.offset,
  ]);

  const [countRows]: any[] = await db.query(
    `SELECT COUNT(*) as total ${baseQuery}`,
    params
  );

  return {
    data: dataRows,
    total: countRows[0]?.total || 0,
  };
}
