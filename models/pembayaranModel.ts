import { db } from "@/lib/db";

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

  const [rows]: [any[], any] = await db.query(query, queryValues);

  // Get total count
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM Pembayaran p
    JOIN Pembelian pb ON pb.ID_Pembelian = p.ID_Pembelian
    JOIN Supplier s ON s.ID_Supplier = pb.ID_Supplier
    JOIN Karyawan k ON k.ID_Karyawan = pb.ID_Karyawan
    JOIN Produk pr ON pr.ID_Produk = pb.ID_Produk
    ${where}
  `;

  const [countResult]: [any[], any] = await db.query(countQuery, values);
  const total = countResult[0]?.total || 0;

  return {
    data: rows,
    pagination: {
      total,
      limit,
      offset,
    },
  };
}
