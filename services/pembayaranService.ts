import { getPembayaran } from "@/models/pembayaranModel";

export async function getPembayaranService(params: {
  limit?: number;
  offset?: number;
  tanggal?: string;
  metode?: string;
  referensi?: string;
}) {
  const result = await getPembayaran(params);
  return {
    status: "success",
    message: "Data laporan berhasil diambil",
    data: result.data,
    pagination: result.pagination,
  };
}
