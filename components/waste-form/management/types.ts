export interface WasteReport {
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

export interface WasteReportApiResponse {
  status: string;
  message: string;
  data: WasteReport[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface WasteReportFilters {
  searchTerm: string;
  selectedType: string;
  selectedStatus: string;
  selectedDate: string;
}

export interface WasteReportStats {
  totalReports: number;
  totalWasted: number;
  pendingReports: number;
  expiredItems: number;
}

export interface Karyawan {
  ID_Karyawan: number;
  Nama_Karyawan: string;
}

export interface Produk {
  ID_Produk: number;
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
