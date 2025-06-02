import { NextRequest, NextResponse } from "next/server";
import {
  createLaporanBahanBaku,
  getLaporanBahanBaku,
} from "@/services/laporanService";
import { getKaryawanById } from "@/services/karyawanService";
import { getProdukById } from "@/models/produkModels";

// Helper function - NOT exported
function isValidDate(dateStr: string) {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

// Allowed values extracted outside handlers
const allowedJenis = ["Expired", "Waste", "Break"];
const allowedStatus = ["Pending", "Dikonfirmasi", "Ditindaklanjuti"];

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
      if (!(field in body) || body[field] === "") {
        return NextResponse.json(
          { status: "error", message: `Field ${field} wajib diisi` },
          { status: 400 }
        );
      }
    }

    const {
      ID_Karyawan,
      ID_Produk,
      Tanggal_Laporan,
      Jenis_Laporan,
      Jumlah_Terbuang,
      Alasan,
      Status_Laporan,
    } = body;

    const idKaryawanNum = Number(ID_Karyawan);
    const idProdukNum = Number(ID_Produk);
    const jumlahTerbuangNum = Number(Jumlah_Terbuang);

    if (isNaN(idKaryawanNum) || isNaN(idProdukNum)) {
      return NextResponse.json(
        {
          status: "error",
          message: "ID Karyawan dan ID Produk harus berupa angka",
        },
        { status: 400 }
      );
    }

    // Validasi relasi
    const karyawan = await getKaryawanById(idKaryawanNum);
    if (!karyawan) {
      return NextResponse.json(
        { status: "error", message: "ID Karyawan tidak ditemukan" },
        { status: 404 }
      );
    }

    const produk = await getProdukById(idProdukNum);
    if (!produk) {
      return NextResponse.json(
        { status: "error", message: "ID Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    if (!isValidDate(Tanggal_Laporan)) {
      return NextResponse.json(
        { status: "error", message: "Format tanggal tidak valid (YYYY-MM-DD)" },
        { status: 400 }
      );
    }

    if (!allowedJenis.includes(Jenis_Laporan)) {
      return NextResponse.json(
        { status: "error", message: "Jenis laporan tidak valid" },
        { status: 400 }
      );
    }

    if (!allowedStatus.includes(Status_Laporan)) {
      return NextResponse.json(
        { status: "error", message: "Status laporan tidak valid" },
        { status: 400 }
      );
    }

    if (
      typeof Alasan !== "string" ||
      Alasan.length < 5 ||
      Alasan.length > 255
    ) {
      return NextResponse.json(
        {
          status: "error",
          message: "Alasan harus berupa teks antara 5–255 karakter",
        },
        { status: 400 }
      );
    }

    if (isNaN(jumlahTerbuangNum) || jumlahTerbuangNum <= 0) {
      return NextResponse.json(
        { status: "error", message: "Jumlah terbuang harus lebih dari 0" },
        { status: 400 }
      );
    }

    // Create laporan with normalized data
    const laporan = await createLaporanBahanBaku({
      ID_Karyawan: idKaryawanNum,
      ID_Produk: idProdukNum,
      Tanggal_Laporan,
      Jenis_Laporan,
      Jumlah_Terbuang: jumlahTerbuangNum,
      Alasan,
      Status_Laporan,
    });

    return NextResponse.json({
      status: "success",
      message: "Laporan berhasil dibuat",
      data: laporan,
    });
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      {
        status: "error",
        message: err.message || "Gagal menambahkan laporan",
      },
      { status: 500 }
    );
  }
}
