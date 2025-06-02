import { db } from "@/lib/db";

export interface PembelianFilters {
  start_date?: string;
  end_date?: string;
  is_paid?: string;
  nama_supplier?: string;
  nama_produk?: string;
  limit: number;
  offset: number;
}

export interface CreatePembelianInput {
  ID_Supplier: number;
  ID_Karyawan: number;
  ID_Produk: number;
  Tanggal_Pembelian: string;
  Jumlah: number;
  Total_Biaya: number;
  Is_Paid?: boolean;
}

export async function getPembelianList(filters: PembelianFilters) {
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

  // Untuk count query, jangan bawa limit & offset
  const countValues = values.slice(0, values.length - 2);

  const [countRows] = await db.query(countQuery, countValues);
  const total = (countRows as any)[0].total || 0;

  return {
    data,
    total,
  };
}

export async function insertPembelian(input: CreatePembelianInput) {
  const {
    ID_Supplier,
    ID_Karyawan,
    ID_Produk,
    Tanggal_Pembelian,
    Jumlah,
    Total_Biaya,
    Is_Paid = false,
  } = input;

  const insertQuery = `
    INSERT INTO Pembelian (
      ID_Supplier,
      ID_Karyawan,
      ID_Produk,
      Tanggal_Pembelian,
      Jumlah,
      Total_Biaya,
      Is_Paid
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    ID_Supplier,
    ID_Karyawan,
    ID_Produk,
    Tanggal_Pembelian,
    Jumlah,
    Total_Biaya,
    Is_Paid ? 1 : 0,
  ];

  const [result]: any = await db.query(insertQuery, values);
  return result.insertId;
}

export async function getPembelianById(id: number) {
  const query = `
    SELECT 
      p.ID_Pembelian, p.Tanggal_Pembelian, p.Jumlah, p.Total_Biaya, p.Is_Paid,
      s.ID_Supplier, s.Nama_Supplier,
      k.ID_Karyawan, k.Nama_Karyawan,
      pr.ID_Produk, pr.Nama_Produk
    FROM Pembelian p
    JOIN Supplier s ON p.ID_Supplier = s.ID_Supplier
    JOIN Karyawan k ON p.ID_Karyawan = k.ID_Karyawan
    JOIN Produk pr ON p.ID_Produk = pr.ID_Produk
    WHERE p.ID_Pembelian = ?
  `;

  const [rows] = await db.query(query, [id]);
  return (rows as any[])[0];
}

export async function getSupplierIdByProductId(id_produk: number) {
  const [rows] = await db.query(
    `SELECT ID_Supplier FROM Produk WHERE ID_Produk = ? LIMIT 1`,
    [id_produk]
  );
  const result = (rows as any[])[0];
  return result?.ID_Supplier || null;
}

export async function getProductDetailsById(id_produk: number) {
  const [rows] = await db.query(
    `SELECT ID_Supplier, Harga FROM Produk WHERE ID_Produk = ? LIMIT 1`,
    [id_produk]
  );
  return (rows as any[])[0] || null;
}

export async function markPembelianAsPaid(id: number) {
  const [result]: any = await db.query(
    `UPDATE Pembelian SET Is_Paid = 1 WHERE ID_Pembelian = ? AND Is_Paid = 0`,
    [id]
  );
  return result.affectedRows > 0;
}

export async function getPembelianForPayment(id: number) {
  const [rows] = await db.query(
    `SELECT ID_Pembelian, Tanggal_Pembelian, Total_Biaya FROM Pembelian WHERE ID_Pembelian = ?`,
    [id]
  );
  return (rows as any[])[0] || null;
}
