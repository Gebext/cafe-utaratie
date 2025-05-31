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
  const body = await req.json();
  const { nama, email, password, role, kontak } = body;

  try {
    const newKaryawan = await registerKaryawan(
      nama,
      email,
      password,
      role,
      kontak
    );

    return success("Karyawan berhasil ditambahkan", newKaryawan, 201);
  } catch (err: any) {
    return error(err.message, 400);
  }
}
