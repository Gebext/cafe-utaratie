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
