export interface Purchase {
  ID_Pembelian: number;
  Tanggal_Pembelian: string;
  Jumlah: number;
  Total_Biaya: string;
  Is_Paid: number | string | boolean; // Can be number, string, or boolean from API
  ID_Supplier: number;
  Nama_Supplier: string;
  ID_Karyawan: number;
  Nama_Karyawan: string;
  ID_Produk: number;
  Nama_Produk: string;
}

export interface PurchaseFilters {
  start_date: string;
  end_date: string;
  is_paid: string;
  nama_supplier: string;
  nama_produk: string;
}

export interface ApiResponse {
  status: string;
  message: string;
  data: Purchase[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}
