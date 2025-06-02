import { NextRequest, NextResponse } from "next/server";
import { createSupplier, getSuppliers } from "@/services/supplierService";
import { error, success } from "@/lib/response";
import { isNamaSupplierExist } from "@/models/supplierModel";
import { getKategoriProdukById } from "@/models/kategoriProdukModel";

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
    nama_kategori: searchParams.get("nama_kategori") || undefined,
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
    const { Nama_Supplier, Alamat, Nomor_Kontak, ID_Kategori } = body;

    // === VALIDASI FIELD WAJIB ===
    if (!Nama_Supplier || !Alamat || !Nomor_Kontak || !ID_Kategori) {
      return error("Semua field harus diisi", 400);
    }

    // === VALIDASI PANJANG FIELD ===
    if (Nama_Supplier.length < 3 || Nama_Supplier.length > 100) {
      return error("Nama Supplier harus antara 3 - 100 karakter", 400);
    }

    if (Alamat.length < 5 || Alamat.length > 255) {
      return error("Alamat harus antara 5 - 255 karakter", 400);
    }

    // === VALIDASI NOMOR KONTAK ===
    const phoneRegex = /^(\+62|0)[0-9]{9,15}$/;
    if (!phoneRegex.test(Nomor_Kontak)) {
      return error(
        "Nomor kontak tidak valid (contoh: 081234567890 atau +6281234567890)",
        400
      );
    }

    // === CEK NAMA SUPPLIER SUDAH ADA ===
    const namaExist = await isNamaSupplierExist(Nama_Supplier);
    if (namaExist) {
      return error("Nama Supplier sudah terdaftar", 400);
    }

    // === CEK ID_KATEGORI ADA DI DATABASE ===
    const kategori = await getKategoriProdukById(ID_Kategori);
    if (!kategori) {
      return error("Kategori tidak ditemukan", 400);
    }

    // === BUAT SUPPLIER BARU ===
    const newSupplier = await createSupplier({
      Nama_Supplier,
      Alamat,
      Nomor_Kontak,
      ID_Kategori,
    });

    return success("Supplier berhasil ditambahkan", newSupplier, 201);
  } catch (err: any) {
    return error(err.message || "Gagal menambahkan supplier", 500);
  }
}
