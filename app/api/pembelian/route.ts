import { NextResponse } from "next/server";
import {
  insertPembelian,
  getPembelianById,
  getProductDetailsById,
} from "@/models/pembelianModel";
import { fetchLaporanPembelian } from "@/services/pembelianService";

function validatePembelianInput(input: any) {
  if (!input || typeof input !== "object") {
    throw new Error("Data tidak valid.");
  }

  const { ID_Karyawan, ID_Produk, Tanggal_Pembelian, Jumlah, Is_Paid } = input;

  const numericFields = [
    { key: "ID_Karyawan", value: ID_Karyawan },
    { key: "ID_Produk", value: ID_Produk },
    { key: "Jumlah", value: Jumlah },
  ];

  for (const field of numericFields) {
    if (
      typeof field.value !== "number" ||
      isNaN(field.value) ||
      field.value <= 0
    ) {
      throw new Error(`${field.key} harus berupa angka positif`);
    }
  }

  if (
    typeof Tanggal_Pembelian !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(Tanggal_Pembelian)
  ) {
    throw new Error("Tanggal_Pembelian harus dalam format YYYY-MM-DD");
  }

  if (Is_Paid !== undefined && typeof Is_Paid !== "boolean") {
    throw new Error("Is_Paid harus berupa boolean");
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query: any = {};
    searchParams.forEach((value, key) => {
      query[key] = value;
    });

    const result = await fetchLaporanPembelian(query);
    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/pembelian error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Gagal mengambil data laporan",
        error: String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    validatePembelianInput(body);

    const { ID_Produk, Jumlah } = body;

    // Ambil info produk (ID_Supplier dan Harga)
    const product = await getProductDetailsById(ID_Produk);
    if (!product) {
      throw new Error("Produk tidak ditemukan.");
    }

    const ID_Supplier = product.ID_Supplier;
    const Harga = product.Harga;

    const Total_Biaya = Jumlah * Harga;

    const insertId = await insertPembelian({
      ...body,
      ID_Supplier,
      Total_Biaya,
    });

    const insertedData = await getPembelianById(insertId);

    return NextResponse.json({
      status: "success",
      message: "Data pembelian berhasil ditambahkan",
      data: insertedData,
    });
  } catch (error) {
    console.error("POST /api/pembelian error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Gagal menambahkan pembelian",
        error: String(error),
      },
      { status: 400 }
    );
  }
}
