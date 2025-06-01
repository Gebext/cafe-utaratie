import { NextRequest, NextResponse } from "next/server";
import { createSupplier, getSuppliers } from "@/services/supplierService";
import { registerKaryawan } from "@/services/karyawanService";
import { error, success } from "@/lib/response";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const search = searchParams.get("search") || "";

  const filters = {
    id_kategori: searchParams.get("id_kategori")
      ? Number(searchParams.get("id_kategori"))
      : undefined,
    alamat: searchParams.get("alamat") || undefined,
    nomor_kontak: searchParams.get("nomor_kontak") || undefined,
    nama_kategori: searchParams.get("nama_kategori") || undefined, // <== ini yang kurang
  };

  const { data, total } = await getSuppliers(page, limit, search, filters);

  return NextResponse.json({
    status: "success",
    message: "List supplier berhasil diambil",
    data,
    pagination: {
      total,
      limit,
      offset: (page - 1) * limit,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Bisa tambahkan validasi singkat di sini (optional)
    const { Nama_Supplier, Alamat, Nomor_Kontak, ID_Kategori } = body;
    if (!Nama_Supplier || !Alamat || !Nomor_Kontak || !ID_Kategori) {
      return error("Semua field harus diisi", 400);
    }

    const newSupplier = await createSupplier({
      Nama_Supplier,
      Alamat,
      Nomor_Kontak,
      ID_Kategori,
    });

    return success("Supplier berhasil ditambahkan", newSupplier, 201);
  } catch (err: any) {
    return error(err.message || "Gagal menambahkan supplier", 400);
  }
}
