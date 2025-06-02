// Shared types for the application
export interface Purchase {
  ID_Pembelian: number;
  Tanggal_Pembelian: string;
  Jumlah: number;
  Total_Biaya: string;
  Is_Paid: number;
  ID_Supplier: number;
  Nama_Supplier: string;
  ID_Karyawan: number;
  Nama_Karyawan: string;
  ID_Produk: number;
  Nama_Produk: string;
}

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

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

// More flexible filter types
export interface PurchaseFilters {
  start_date?: string;
  end_date?: string;
  is_paid?: string | number;
  nama_supplier?: string;
  nama_produk?: string;
  search?: string;
}

export interface PaymentFilters {
  tanggal?: string;
  metode?: string;
  referensi?: string;
  search?: string;
}

// Generic filter type for API calls
export type ApiFilters = Record<string, string | number | undefined>;
