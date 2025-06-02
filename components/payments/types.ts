export interface Payment {
  ID_Pembayaran: number;
  Tanggal_Pembayaran: string;
  Metode_Pembayaran: string;
  Jumlah: string;
  Nomor_Referensi: string;
  ID_Pembelian: number;
  Nama_Supplier: string;
  Nama_Karyawan: string;
  Nama_Produk: string;
}

export interface PaymentFilters {
  tanggal: string;
  metode: string;
  referensi: string;
}

export interface ApiResponse {
  status: string;
  message: string;
  data: Payment[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}
