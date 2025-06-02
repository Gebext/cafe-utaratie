import {
  countProdukTotal,
  createProduk,
  deleteProduk,
  getProdukById,
  getProdukByName,
  getProdukList,
  updateProduk,
} from "@/models/produkModels";

export interface ProdukPayload {
  Nama_Produk: string;
  ID_Kategori: number;
  Harga: number;
  Stok: number;
  ID_Supplier: number;
}
export const fetchProduk = async ({
  limit,
  offset,
  search,
  kategori,
}: {
  limit: number;
  offset: number;
  search?: string;
  kategori?: string;
}) => {
  return await getProdukList({ limit, offset, search, kategori });
};

export const fetchProdukTotal = async (search = "", kategori = "") => {
  return await countProdukTotal(search, kategori);
};

export const fetchProdukById = async (id: number) => {
  return await getProdukById(id);
};

export const fetchProdukByName = async (nama: string) => {
  return await getProdukByName(nama);
};

export const addProduk = async (data: ProdukPayload) => {
  return await createProduk(data);
};

export const editProduk = async (id: number, data: ProdukPayload) => {
  return await updateProduk(id, data);
};

export const removeProduk = async (id: number) => {
  return await deleteProduk(id);
};
