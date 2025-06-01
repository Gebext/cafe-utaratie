// models/laporanModel.ts

export interface LaporanBahanBakuJoin {
  ID_Laporan: number;
  ID_Karyawan: number;
  Nama_Karyawan: string;
  ID_Produk: number;
  Nama_Produk: string;
  Tanggal_Laporan: string;
  Jenis_Laporan: "Expired" | "Waste" | "Break";
  Jumlah_Terbuang: number;
  Alasan: string;
  Status_Laporan: "Pending" | "Dikonfirmasi" | "Ditindaklanjuti";
  Deleted_At: string | null;
}

/**
 * Build dynamic SQL queries with optional filters, including JOIN to Karyawan and Produk.
 */
export function buildFilterQueryWithJoin(filters: {
  jenis?: string;
  status?: string;
  tanggal?: string;
}) {
  const whereClauses = ["lb.Deleted_At IS NULL"];
  const params: any[] = [];

  if (filters.jenis) {
    whereClauses.push("lb.Jenis_Laporan = ?");
    params.push(filters.jenis);
  }
  if (filters.status) {
    whereClauses.push("lb.Status_Laporan = ?");
    params.push(filters.status);
  }
  if (filters.tanggal) {
    whereClauses.push("lb.Tanggal_Laporan = ?");
    params.push(filters.tanggal);
  }

  const whereSQL = whereClauses.length
    ? `WHERE ${whereClauses.join(" AND ")}`
    : "";

  const selectSQL = `
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
    ${whereSQL}
  `;

  const countSQL = `
    SELECT COUNT(*) as total
    FROM Laporan_Bahan_Baku lb
    LEFT JOIN Karyawan k ON lb.ID_Karyawan = k.ID_Karyawan
    LEFT JOIN Produk p ON lb.ID_Produk = p.ID_Produk
    ${whereSQL}
  `;

  return {
    selectSQL,
    countSQL,
    params,
  };
}
