// services/kategoriProdukService.ts
import {
  getKategoriProduk,
  createKategoriProduk,
  updateKategoriProduk,
  deleteKategoriProduk,
} from "@/models/kategoriProdukModel";

export const fetchAllKategoriProduk = async () => {
  return await getKategoriProduk();
};

export const addKategoriProduk = async (nama: string) => {
  if (!["Makanan", "Minuman", "Lainnya"].includes(nama)) {
    throw new Error("Kategori tidak valid");
  }
  return await createKategoriProduk(nama);
};

export const editKategoriProduk = async (id: number, nama: string) => {
  return await updateKategoriProduk(id, nama);
};

export const removeKategoriProduk = async (id: number) => {
  return await deleteKategoriProduk(id);
};
