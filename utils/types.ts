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

export type CreateSupplierInput = Omit<Supplier, "ID_Supplier" | "Deleted_At">;
export type UpdateSupplierInput = Partial<CreateSupplierInput>;
