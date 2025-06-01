import { NextResponse } from "next/server";
import { fetchLaporanPembelian } from "@/services/pembelianService";

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
