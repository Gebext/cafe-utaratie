import { NextRequest } from "next/server";
import {
  getProdukById,
  updateProduk,
  deleteProduk,
} from "@/models/produkModels";
import { success, error } from "@/lib/response";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await getProdukById(Number(params.id));
    if (!data) return error("Produk tidak ditemukan", 404);
    return success("Detail produk ditemukan", data);
  } catch {
    return error("Gagal mengambil detail produk");
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const updatedProduk = await updateProduk(Number(params.id), body);
    return success("Produk berhasil diperbarui", updatedProduk);
  } catch {
    return error("Gagal memperbarui produk");
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteProduk(Number(params.id));
    return success("Produk berhasil dihapus");
  } catch {
    return error("Gagal menghapus produk");
  }
}
