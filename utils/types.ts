export type Product = {
  ID_Produk: number;
  Nama_Produk: string;
  ID_Kategori: number;
  Harga: string;
  Stok: number;
  ID_Supplier: number;
  Nama_Kategori?: string;
};

export type Category = {
  ID_Kategori: number;
  Nama_Kategori: string;
};

export type Supplier = {
  ID_Supplier: number;
  Nama_Supplier: string;
  Alamat: string;
  Nomor_Kontak: string;
  ID_Kategori: number;
  Deleted_At: string | null;
};

import type { RowDataPacket } from "mysql2";

export interface NewLaporanInput {
  ID_Karyawan: number;
  ID_Produk: number;
  Tanggal_Laporan: string;
  Jenis_Laporan: "Expired" | "Waste" | "Break";
  Jumlah_Terbuang: number;
  Alasan: string;
  Status_Laporan: "Pending" | "Dikonfirmasi" | "Ditindaklanjuti";
}

export interface ProdukPayload {
  Nama_Produk: string;
  ID_Kategori: number;
  Harga: number;
  Stok: number;
  ID_Supplier: number;
}

export interface ProdukRow extends RowDataPacket {
  ID_Produk: number;
  Nama_Produk: string;
  ID_Kategori: number;
  Harga: number;
  Stok: number;
  ID_Supplier: number;
  Deleted_At: string | null;
  Nama_Kategori?: string;
  Nama_Supplier?: string;
}

export type CreateSupplierInput = Omit<Supplier, "ID_Supplier" | "Deleted_At">;
export type UpdateSupplierInput = Partial<CreateSupplierInput>;
