// Definisikan tipe parameter filter yang digunakan
export interface GetPembayaranParams {
  limit?: number;
  offset?: number;
  tanggal?: string;
  metode?: string;
  referensi?: string;
}

import { getPembayaran } from "@/models/pembayaranModel";

export async function getPembayaranService(params: GetPembayaranParams) {
  try {
    const result = await getPembayaran(params);
    return {
      status: "success",
      message: "Data laporan berhasil diambil",
      data: result.data,
      pagination: result.pagination,
    };
  } catch (error) {
    // Optional: kamu bisa custom error handling di sini
    throw new Error("Gagal mengambil data pembayaran");
  }
}
