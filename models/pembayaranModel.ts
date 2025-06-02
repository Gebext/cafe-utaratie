import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

// Interface tipe data pembayaran
export interface Pembayaran {
  ID_Pembayaran: number;
  Tanggal_Pembayaran: string;
  Metode_Pembayaran: string;
  Jumlah: number;
  Nomor_Referensi: string;
  ID_Pembelian: number;
  Nama_Supplier: string;
  Nama_Karyawan: string;
  Nama_Produk: string;
}

export interface PembayaranPayload {
  ID_Pembelian: number;
  Tanggal_Pembayaran: string;
  Metode_Pembayaran: "Tunai" | "Kartu Kredit" | "Transfer Bank";
  Jumlah: number;
  Nomor_Referensi?: string;
}

// Fungsi model untuk mengambil data pembayaran dengan filter, limit, dan offset
export async function getPembayaran({
  limit = 10,
  offset = 0,
  tanggal,
  metode,
  referensi,
}: {
  limit?: number;
  offset?: number;
  tanggal?: string;
  metode?: string;
  referensi?: string;
}) {
  const values: any[] = [];
  let where = "WHERE p.Deleted_At IS NULL";

  if (tanggal) {
    where += " AND p.Tanggal_Pembayaran = ?";
    values.push(tanggal);
  }

  if (metode) {
    where += " AND p.Metode_Pembayaran = ?";
    values.push(metode);
  }

  if (referensi) {
    where += " AND p.Nomor_Referensi LIKE ?";
    values.push(`%${referensi}%`);
  }

  const query = `
    SELECT 
      p.ID_Pembayaran,
      p.Tanggal_Pembayaran,
      p.Metode_Pembayaran,
      p.Jumlah,
      p.Nomor_Referensi,
      pb.ID_Pembelian,
      s.Nama_Supplier,
      k.Nama_Karyawan,
      pr.Nama_Produk
    FROM Pembayaran p
    JOIN Pembelian pb ON pb.ID_Pembelian = p.ID_Pembelian
    JOIN Supplier s ON s.ID_Supplier = pb.ID_Supplier
    JOIN Karyawan k ON k.ID_Karyawan = pb.ID_Karyawan
    JOIN Produk pr ON pr.ID_Produk = pb.ID_Produk
    ${where}
    ORDER BY p.Tanggal_Pembayaran ASC
    LIMIT ? OFFSET ?
  `;

  const queryValues = [...values, limit, offset];

  // Query untuk data utama, cast ke array Pembayaran
  const [rows] = await db.query<RowDataPacket[]>(query, queryValues);
  const pembayaranRows = rows as Pembayaran[];

  // Query untuk total data, cast ke array objek yang punya properti total
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM Pembayaran p
    JOIN Pembelian pb ON pb.ID_Pembelian = p.ID_Pembelian
    JOIN Supplier s ON s.ID_Supplier = pb.ID_Supplier
    JOIN Karyawan k ON k.ID_Karyawan = pb.ID_Karyawan
    JOIN Produk pr ON pr.ID_Produk = pb.ID_Produk
    ${where}
  `;

  const [countResult] = await db.query<RowDataPacket[]>(countQuery, values);
  const countRows = countResult as Array<{ total: number }>;

  const total = countRows[0]?.total ?? 0;

  return {
    data: pembayaranRows,
    pagination: {
      total,
      limit,
      offset,
    },
  };
}

export async function insertPembayaran(data: PembayaranPayload) {
  const {
    ID_Pembelian,
    Tanggal_Pembayaran,
    Metode_Pembayaran,
    Jumlah,
    Nomor_Referensi,
  } = data;

  const [result]: any = await db.query(
    `INSERT INTO Pembayaran (ID_Pembelian, Tanggal_Pembayaran, Metode_Pembayaran, Jumlah, Nomor_Referensi)
     VALUES (?, ?, ?, ?, ?)`,
    [
      ID_Pembelian,
      Tanggal_Pembayaran,
      Metode_Pembayaran,
      Jumlah,
      Nomor_Referensi || null,
    ]
  );

  return result.insertId;
}
