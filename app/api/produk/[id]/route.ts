import { NextRequest } from "next/server";

import { success, error } from "@/lib/response";
import {
  deleteProduk,
  getProdukById,
  updateProduk,
} from "@/models/produkModels";

function isValidId(id: string): boolean {
  return !isNaN(Number(id)) && Number(id) > 0;
}

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const param = await params;
  const { id } = param;
  if (!isValidId(id)) return error("ID produk tidak valid", 400);

  try {
    const produk = await getProdukById(Number(id));
    if (!produk) return error("Produk tidak ditemukan", 404);
    return success("Detail produk ditemukan", produk);
  } catch (err) {
    console.error("GET /produk/[id] error:", err);
    return error("Gagal mengambil detail produk", 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const param = await params;
  const { id } = param;
  if (!isValidId(id)) return error("ID produk tidak valid", 400);

  try {
    const body = await req.json();

    // Validasi umum (jika diperlukan)
    if ("Harga" in body && (isNaN(body.Harga) || body.Harga < 0)) {
      return error("Harga harus berupa angka positif", 400);
    }

    if ("Stok" in body && (isNaN(body.Stok) || body.Stok < 0)) {
      return error("Stok harus berupa angka positif", 400);
    }

    const updated = await updateProduk(Number(id), body);
    return success("Produk berhasil diperbarui", updated);
  } catch (err) {
    console.error("PUT /produk/[id] error:", err);
    return error("Gagal memperbarui produk", 500);
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const param = await params;
  const { id } = param;

  if (!isValidId(id)) return error("ID produk tidak valid", 400);

  try {
    const produk = await getProdukById(Number(id));
    if (!produk) return error("Produk tidak ditemukan", 404);

    await deleteProduk(Number(id));
    return success("Produk berhasil dihapus");
  } catch (err) {
    console.error("DELETE /produk/[id] error:", err);
    return error("Gagal menghapus produk", 500);
  }
}
