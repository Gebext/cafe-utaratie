// GET & POST
import { NextResponse } from "next/server";
import {
  fetchAllKategoriProduk,
  addKategoriProduk,
} from "@/services/kategoriProdukService";

export async function GET() {
  try {
    const data = await fetchAllKategoriProduk();
    return NextResponse.json({
      status: "success",
      message: "Kategori produk berhasil diambil",
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: "Gagal mengambil data kategori produk",
        data: null,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { Nama_Kategori } = await req.json();
    await addKategoriProduk(Nama_Kategori);
    return NextResponse.json({
      status: "success",
      message: "Kategori produk berhasil ditambahkan",
      data: null,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Gagal menambahkan kategori produk",
        data: null,
      },
      { status: 400 }
    );
  }
}
