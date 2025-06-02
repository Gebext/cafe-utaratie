// services/kategoriProdukService.ts
import {
  getKategoriProduk,
  getKategoriProdukById,
  createKategoriProduk,
  updateKategoriProduk,
  deleteKategoriProduk,
} from "@/models/kategoriProdukModel";

const dissAwllowed = ["Makanan", "Minuman", "Lainnya"];

export const fetchAllKategoriProduk = async () => {
  return await getKategoriProduk();
};

export const fetchKategoriProdukById = async (id: number) => {
  return await getKategoriProdukById(id);
};

export const addKategoriProduk = async (nama: string) => {
  if (dissAwllowed.includes(nama)) {
    throw new Error("Kategori tidak valid");
  }
  return await createKategoriProduk(nama);
};

export const editKategoriProduk = async (id: number, nama: string) => {
  if (dissAwllowed.includes(nama)) {
    throw new Error("Kategori tidak valid");
  }
  return await updateKategoriProduk(id, nama);
};

export const removeKategoriProduk = async (id: number) => {
  return await deleteKategoriProduk(id);
};
