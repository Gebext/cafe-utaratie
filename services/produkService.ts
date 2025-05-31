// services/produkService.ts
import {
  getProdukList,
  countProdukTotal,
  getProdukById,
  createProduk,
  updateProduk,
  deleteProduk,
} from "@/models/produkModels";

export async function fetchProduk(params: any) {
  const limit = parseInt(params.limit) || 10;
  const page = parseInt(params.page) || 1;
  const offset = (page - 1) * limit;
  const search = params.search || "";
  const kategori = params.kategori || "";

  const data = await getProdukList({ limit, offset, search, kategori });
  const total = await countProdukTotal(search, kategori);

  return {
    data,
    page,
    totalPage: Math.ceil(total / limit),
    total,
  };
}

export async function fetchProdukById(id: number) {
  return getProdukById(id);
}

export async function addProduk(data: any) {
  return createProduk(data);
}

export async function editProduk(id: number, data: any) {
  return updateProduk(id, data);
}

export async function removeProduk(id: number) {
  return deleteProduk(id);
}
