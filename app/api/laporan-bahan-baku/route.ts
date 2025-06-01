// app/api/laporan-bahan-baku/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  createLaporanBahanBaku,
  getLaporanBahanBaku,
} from "@/services/laporanService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const jenis = searchParams.get("jenis") ?? undefined;
    const status = searchParams.get("status") ?? undefined;
    const tanggal = searchParams.get("tanggal") ?? undefined;

    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const { data, total } = await getLaporanBahanBaku({
      jenis,
      status,
      tanggal,
      limit,
      offset,
    });

    return NextResponse.json({
      status: "success",
      message: "Data laporan berhasil diambil",
      data,
      pagination: {
        total,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error("Error fetching laporan:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Gagal mengambil data laporan",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const requiredFields = [
      "ID_Karyawan",
      "ID_Produk",
      "Tanggal_Laporan",
      "Jenis_Laporan",
      "Jumlah_Terbuang",
      "Alasan",
      "Status_Laporan",
    ];
    for (const field of requiredFields) {
      if (!(field in body)) {
        return NextResponse.json(
          { status: "error", message: `Field ${field} wajib diisi` },
          { status: 400 }
        );
      }
    }

    const laporan = await createLaporanBahanBaku(body);

    return NextResponse.json({
      status: "success",
      message: "Laporan berhasil dibuat",
      data: laporan,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        status: "error",
        message: err.message || "Gagal menambahkan laporan",
      },
      { status: 500 }
    );
  }
}
