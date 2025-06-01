// lib/laporanService.ts
import { db } from "@/lib/db";
import {
  buildFilterQueryWithJoin,
  LaporanBahanBakuJoin,
} from "@/models/laporanModel";
import { getInsertLaporanSQL, NewLaporanInput } from "@/models/produkModels";

type Filters = {
  jenis?: string;
  status?: string;
  tanggal?: string;
  limit: number;
  offset: number;
};

export async function getLaporanBahanBaku(filters: Filters) {
  const { selectSQL, countSQL, params } = buildFilterQueryWithJoin(filters);

  // Query data dengan limit dan offset untuk pagination
  const [data] = await db.query(`${selectSQL} LIMIT ? OFFSET ?`, [
    ...params,
    filters.limit,
    filters.offset,
  ]);

  // Query total count data sesuai filter
  const [countResult]: any = await db.query(countSQL, params);

  return {
    data: data as LaporanBahanBakuJoin[],
    total: countResult[0].total,
  };
}

export async function createLaporanBahanBaku(data: NewLaporanInput) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Insert laporan
    const insertSQL = getInsertLaporanSQL();
    const [result]: any = await conn.query(insertSQL, [
      data.ID_Karyawan,
      data.ID_Produk,
      data.Tanggal_Laporan,
      data.Jenis_Laporan,
      data.Jumlah_Terbuang,
      data.Alasan,
      data.Status_Laporan,
    ]);

    const insertedId = result.insertId;

    // 2. Update stok produk
    const updateStokSQL = `
      UPDATE Produk
      SET Stok = Stok - ?
      WHERE ID_Produk = ? AND Stok >= ?
    `;
    const [stokResult]: any = await conn.query(updateStokSQL, [
      data.Jumlah_Terbuang,
      data.ID_Produk,
      data.Jumlah_Terbuang,
    ]);
    if (stokResult.affectedRows === 0) {
      throw new Error(
        "Stok produk tidak mencukupi atau produk tidak ditemukan"
      );
    }

    // 3. Ambil data lengkap dengan join
    const [joinedResult]: any = await conn.query(
      `
      SELECT 
        lb.ID_Laporan,
        lb.ID_Karyawan,
        k.Nama_Karyawan,
        lb.ID_Produk,
        p.Nama_Produk,
        lb.Tanggal_Laporan,
        lb.Jenis_Laporan,
        lb.Jumlah_Terbuang,
        lb.Alasan,
        lb.Status_Laporan,
        lb.Deleted_At
      FROM Laporan_Bahan_Baku lb
      LEFT JOIN Karyawan k ON lb.ID_Karyawan = k.ID_Karyawan
      LEFT JOIN Produk p ON lb.ID_Produk = p.ID_Produk
      WHERE lb.ID_Laporan = ?
      `,
      [insertedId]
    );

    await conn.commit();

    return joinedResult[0];
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}
