import { db } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import {
  CreateSupplierInput,
  UpdateSupplierInput,
  Supplier,
} from "@/utils/types";

export async function findSuppliers({
  page,
  limit,
  search,
  id_kategori,
  alamat,
  nomor_kontak,
}: {
  page: number;
  limit: number;
  search?: string;
  id_kategori?: number;
  alamat?: string;
  nomor_kontak?: string;
}): Promise<{
  data: (Supplier & { Nama_Kategori: string | null })[];
  total: number;
}> {
  const offset = (page - 1) * limit;

  const whereClauses = ["Supplier.Deleted_At IS NULL"];
  const values: any[] = [];

  if (search) {
    whereClauses.push("Supplier.Nama_Supplier LIKE ?");
    values.push(`%${search}%`);
  }

  if (id_kategori !== undefined) {
    whereClauses.push("Supplier.ID_Kategori = ?");
    values.push(id_kategori);
  }

  if (alamat) {
    whereClauses.push("Supplier.Alamat LIKE ?");
    values.push(`%${alamat}%`);
  }

  if (nomor_kontak) {
    whereClauses.push("Supplier.Nomor_Kontak LIKE ?");
    values.push(`%${nomor_kontak}%`);
  }

  const whereSQL = whereClauses.length
    ? `WHERE ${whereClauses.join(" AND ")}`
    : "";

  // Query data dengan join ke Kategori_Produk untuk mendapatkan Nama_Kategori
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT Supplier.*, Kategori_Produk.Nama_Kategori
     FROM Supplier
     LEFT JOIN Kategori_Produk ON Supplier.ID_Kategori = Kategori_Produk.ID_Kategori
     ${whereSQL}
     ORDER BY Supplier.ID_Supplier DESC
     LIMIT ? OFFSET ?`,
    [...values, limit, offset]
  );

  // Query count total data tanpa limit dan offset, join tidak perlu untuk count
  const [[{ count }]] = await db.query<RowDataPacket[]>(
    `SELECT COUNT(*) as count FROM Supplier ${whereSQL}`,
    values
  );

  return {
    data: rows as (Supplier & { Nama_Kategori: string | null })[],
    total: count,
  };
}

export async function findSupplierById(
  id: number
): Promise<(Supplier & { Nama_Kategori: string | null }) | null> {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT Supplier.*, Kategori_Produk.Nama_Kategori
     FROM Supplier
     LEFT JOIN Kategori_Produk ON Supplier.ID_Kategori = Kategori_Produk.ID_Kategori
     WHERE Supplier.ID_Supplier = ? AND Supplier.Deleted_At IS NULL`,
    [id]
  );
  return rows.length > 0
    ? (rows[0] as Supplier & { Nama_Kategori: string | null })
    : null;
}

export async function insertSupplier(
  data: CreateSupplierInput
): Promise<Supplier & { Nama_Kategori: string | null }> {
  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO Supplier (Nama_Supplier, Alamat, Nomor_Kontak, ID_Kategori)
     VALUES (?, ?, ?, ?)`,
    [data.Nama_Supplier, data.Alamat, data.Nomor_Kontak, data.ID_Kategori]
  );

  const insertId = result.insertId;

  // Query ulang supplier yang baru dibuat, termasuk join kategori
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT Supplier.*, Kategori_Produk.Nama_Kategori
     FROM Supplier
     LEFT JOIN Kategori_Produk ON Supplier.ID_Kategori = Kategori_Produk.ID_Kategori
     WHERE Supplier.ID_Supplier = ?`,
    [insertId]
  );

  return rows[0] as Supplier & { Nama_Kategori: string | null };
}

export async function updateSupplierById(
  id: number,
  data: UpdateSupplierInput
): Promise<void> {
  await db.query(
    `UPDATE Supplier SET Nama_Supplier = ?, Alamat = ?, Nomor_Kontak = ?, ID_Kategori = ?
     WHERE ID_Supplier = ?`,
    [data.Nama_Supplier, data.Alamat, data.Nomor_Kontak, data.ID_Kategori, id]
  );
}

export async function softDeleteSupplierById(id: number): Promise<void> {
  await db.query(
    `UPDATE Supplier SET Deleted_At = NOW() WHERE ID_Supplier = ?`,
    [id]
  );
}
