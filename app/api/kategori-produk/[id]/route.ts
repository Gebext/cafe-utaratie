import { NextResponse } from "next/server";
import {
  editKategoriProduk,
  removeKategoriProduk,
} from "@/services/kategoriProdukService";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { status: "error", message: "ID tidak valid", data: null },
        { status: 400 }
      );
    }

    const { Nama_Kategori } = await req.json();
    if (!Nama_Kategori || typeof Nama_Kategori !== "string") {
      return NextResponse.json(
        {
          status: "error",
          message: "Nama_Kategori wajib diisi dan harus string",
          data: null,
        },
        { status: 400 }
      );
    }

    await editKategoriProduk(id, Nama_Kategori);

    return NextResponse.json({
      status: "success",
      message: "Kategori produk berhasil diperbarui",
      data: null,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Gagal memperbarui kategori produk",
        data: null,
      },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { status: "error", message: "ID tidak valid", data: null },
        { status: 400 }
      );
    }

    await removeKategoriProduk(id);

    return NextResponse.json({
      status: "success",
      message: "Kategori produk berhasil dihapus",
      data: null,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Gagal menghapus kategori produk",
        data: null,
      },
      { status: 400 }
    );
  }
}
