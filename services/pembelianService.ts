import { getPembelianList } from "../models/pembelianModel";

export async function fetchLaporanPembelian(query: any) {
  const limit = parseInt(query.limit) || 10;
  const offset = parseInt(query.offset) || 0;

  const filters = {
    start_date: query.start_date,
    end_date: query.end_date,
    is_paid: query.is_paid,
    nama_supplier: query.nama_supplier,
    nama_produk: query.nama_produk,
    limit,
    offset,
  };

  const { data, total } = await getPembelianList(filters);

  return {
    status: "success",
    message: "Data laporan berhasil diambil",
    data,
    pagination: {
      total,
      limit,
      offset,
    },
  };
}
