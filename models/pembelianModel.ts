import { db } from "@/lib/db";

export async function getPembelianList(filters: {
  start_date?: string;
  end_date?: string;
  is_paid?: string;
  nama_supplier?: string;
  nama_produk?: string;
  limit: number;
  offset: number;
}) {
  const {
    start_date,
    end_date,
    is_paid,
    nama_supplier,
    nama_produk,
    limit,
    offset,
  } = filters;

  const values: any[] = [];
  let whereClause = "WHERE p.Deleted_At IS NULL";

  if (start_date && end_date) {
    whereClause += " AND p.Tanggal_Pembelian BETWEEN ? AND ?";
    values.push(start_date, end_date);
  }

  if (is_paid !== undefined) {
    whereClause += " AND p.Is_Paid = ?";
    values.push(is_paid === "true" ? 1 : 0);
  }

  if (nama_supplier) {
    whereClause += " AND s.Nama_Supplier LIKE ?";
    values.push(`%${nama_supplier}%`);
  }

  if (nama_produk) {
    whereClause += " AND pr.Nama_Produk LIKE ?";
    values.push(`%${nama_produk}%`);
  }

  const dataQuery = `
    SELECT 
      p.ID_Pembelian, p.Tanggal_Pembelian, p.Jumlah, p.Total_Biaya, p.Is_Paid,
      s.ID_Supplier, s.Nama_Supplier,
      k.ID_Karyawan, k.Nama_Karyawan,
      pr.ID_Produk, pr.Nama_Produk
    FROM Pembelian p
    JOIN Supplier s ON p.ID_Supplier = s.ID_Supplier
    JOIN Karyawan k ON p.ID_Karyawan = k.ID_Karyawan
    JOIN Produk pr ON p.ID_Produk = pr.ID_Produk
    ${whereClause}
    ORDER BY p.Tanggal_Pembelian ASC
    LIMIT ? OFFSET ?
  `;
  values.push(limit, offset);

  const [data] = await db.query(dataQuery, values);

  const countQuery = `
    SELECT COUNT(*) as total
    FROM Pembelian p
    JOIN Supplier s ON p.ID_Supplier = s.ID_Supplier
    JOIN Karyawan k ON p.ID_Karyawan = k.ID_Karyawan
    JOIN Produk pr ON p.ID_Produk = pr.ID_Produk
    ${whereClause}
  `;
  const [countRows] = await db.query(countQuery, values.slice(0, -2)); // exclude limit & offset
  const total = (countRows as any)[0].total;

  return {
    data,
    total,
  };
}
