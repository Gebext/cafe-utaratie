// app/api/produk/route.ts
import { NextRequest } from "next/server";
import {
  fetchProduk,
  addProduk,
  fetchProdukTotal,
  fetchProdukByName,
} from "@/services/produkService";

import { getKategoriProdukById } from "@/models/kategoriProdukModel";
import { getSupplier } from "@/services/supplierService";

import { success, error } from "@/lib/response";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = parseInt(searchParams.get("offset") || "0");
  const search = searchParams.get("search") || "";
  const kategori = searchParams.get("kategori") || "";

  try {
    const data = await fetchProduk({ limit, offset, search, kategori });
    const total = await fetchProdukTotal(search, kategori);

    return success("List produk berhasil diambil", data, {
      total,
      limit,
      offset,
    });
  } catch (err) {
    console.error("GET /produk error:", err);
    return error("Gagal mengambil data produk", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      Nama_Produk,
      ID_Kategori,
      ID_Supplier,
      Harga,
      Stok,
      Status, // belum digunakan
      Deskripsi, // belum digunakan
    } = body;

    // ✅ Validasi dasar
    if (
      !Nama_Produk ||
      typeof Nama_Produk !== "string" ||
      Nama_Produk.trim() === ""
    ) {
      return error("Nama produk wajib diisi", 400);
    }
    if (isNaN(Harga) || Harga < 0) {
      return error("Harga harus berupa angka positif", 400);
    }
    if (isNaN(Stok) || Stok < 0) {
      return error("Stok harus berupa angka positif", 400);
    }

    // ✅ Validasi kategori
    const kategori = await getKategoriProdukById(ID_Kategori);
    if (!kategori) {
      return error("Kategori tidak ditemukan", 400);
    }

    // ✅ Validasi supplier
    const supplier = await getSupplier(ID_Supplier);
    if (!supplier) {
      return error("Supplier tidak ditemukan", 400);
    }

    // ✅ Cek duplikasi nama
    const existing = await fetchProdukByName(Nama_Produk);
    const alreadyExist = existing.find(
      (p) => p.Nama_Produk.toLowerCase() === Nama_Produk.toLowerCase()
    );
    if (alreadyExist) {
      return error("Produk dengan nama tersebut sudah ada", 400);
    }

    const createdProduct = await addProduk(body);
    return success("Produk berhasil ditambahkan", createdProduct);
  } catch (err: any) {
    console.error("POST /produk error:", err);
    return error(err?.message || "Gagal menambahkan produk", 500);
  }
}
