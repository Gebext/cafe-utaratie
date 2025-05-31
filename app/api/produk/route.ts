import { NextRequest } from "next/server";
import {
  getProdukList,
  createProduk,
  countProdukTotal,
} from "@/models/produkModels";
import { success, error } from "@/lib/response";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = parseInt(searchParams.get("offset") || "0");
  const search = searchParams.get("search") || "";
  const kategori = searchParams.get("kategori") || "";

  try {
    const data = await getProdukList({ limit, offset, search, kategori });
    const total = await countProdukTotal(search, kategori);
    return success("List produk berhasil diambil", data, {
      total,
      limit,
      offset,
    });
  } catch (err) {
    return error("Gagal mengambil data produk");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const createdProduct = await createProduk(body);
    return success("Produk berhasil ditambahkan", createdProduct);
  } catch (err: any) {
    return error(err.message || "Gagal menambahkan produk");
  }
}
