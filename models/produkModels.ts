// models/produkModel.ts
import { db } from "@/lib/db";
import type { ProdukPayload, ProdukRow } from "@/utils/types";
import type { RowDataPacket } from "mysql2";

export async function getProdukList({
  limit = 10,
  offset = 0,
  search = "",
  kategori = "",
}: {
  limit: number;
  offset: number;
  search?: string;
  kategori?: string;
}): Promise<ProdukRow[]> {
  const query = `
    SELECT p.*, k.Nama_Kategori, s.Nama_Supplier FROM Produk p
    JOIN Kategori_Produk k ON p.ID_Kategori = k.ID_Kategori
    JOIN Supplier s ON p.ID_Supplier = s.ID_Supplier
    WHERE p.Deleted_At IS NULL
    ${search ? "AND p.Nama_Produk LIKE ?" : ""}
    ${kategori ? "AND k.Nama_Kategori = ?" : ""}
    LIMIT ? OFFSET ?
  `;
  const params = [
    ...(search ? [`%${search}%`] : []),
    ...(kategori ? [kategori] : []),
    limit,
    offset,
  ];
  const [rows] = await db.query<ProdukRow[]>(query, params);
  return rows;
}

export async function countProdukTotal(
  search = "",
  kategori = ""
): Promise<number> {
  const query = `
    SELECT COUNT(*) as total FROM Produk p
    JOIN Kategori_Produk k ON p.ID_Kategori = k.ID_Kategori
    WHERE p.Deleted_At IS NULL
    ${search ? "AND p.Nama_Produk LIKE ?" : ""}
    ${kategori ? "AND k.Nama_Kategori = ?" : ""}
  `;
  const params = [
    ...(search ? [`%${search}%`] : []),
    ...(kategori ? [kategori] : []),
  ];
  const [rows] = await db.query<(RowDataPacket & { total: number })[]>(
    query,
    params
  );
  return rows[0]?.total ?? 0;
}

export async function getProdukById(id: number): Promise<ProdukRow | null> {
  const [rows] = await db.query<ProdukRow[]>(
    `SELECT p.*, k.Nama_Kategori, s.Nama_Supplier
     FROM Produk p
     JOIN Kategori_Produk k ON p.ID_Kategori = k.ID_Kategori
     JOIN Supplier s ON p.ID_Supplier = s.ID_Supplier
     WHERE p.ID_Produk = ? AND p.Deleted_At IS NULL`,
    [id]
  );
  return rows[0] ?? null;
}

export async function getProdukByName(nama: string): Promise<ProdukRow[]> {
  const [rows] = await db.query<ProdukRow[]>(
    `SELECT p.*, k.Nama_Kategori, s.Nama_Supplier
     FROM Produk p
     JOIN Kategori_Produk k ON p.ID_Kategori = k.ID_Kategori
     JOIN Supplier s ON p.ID_Supplier = s.ID_Supplier
     WHERE p.Nama_Produk LIKE ? AND p.Deleted_At IS NULL`,
    [`%${nama}%`]
  );
  return rows;
}

export async function createProduk(data: ProdukPayload): Promise<ProdukRow> {
  const { Nama_Produk, ID_Kategori, Harga, Stok, ID_Supplier } = data;

  const [result]: any = await db.query(
    `INSERT INTO Produk (Nama_Produk, ID_Kategori, Harga, Stok, ID_Supplier)
     VALUES (?, ?, ?, ?, ?)`,
    [Nama_Produk, ID_Kategori, Harga, Stok, ID_Supplier]
  );

  return (await getProdukById(result.insertId)) as ProdukRow;
}

export async function updateProduk(
  id: number,
  data: ProdukPayload
): Promise<ProdukRow | null> {
  const { Nama_Produk, ID_Kategori, Harga, Stok, ID_Supplier } = data;

  await db.query(
    `UPDATE Produk
     SET Nama_Produk = ?, ID_Kategori = ?, Harga = ?, Stok = ?, ID_Supplier = ?
     WHERE ID_Produk = ?`,
    [Nama_Produk, ID_Kategori, Harga, Stok, ID_Supplier, id]
  );

  return await getProdukById(id);
}

export async function deleteProduk(id: number): Promise<void> {
  await db.query(`UPDATE Produk SET Deleted_At = NOW() WHERE ID_Produk = ?`, [
    id,
  ]);
}

export function getInsertLaporanSQL(): string {
  return `
    INSERT INTO Laporan_Bahan_Baku (
      ID_Karyawan,
      ID_Produk,
      Tanggal_Laporan,
      Jenis_Laporan,
      Jumlah_Terbuang,
      Alasan,
      Status_Laporan
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
}
