import { NextRequest, NextResponse } from "next/server";
import { getPembayaranService } from "@/services/pembayaranService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const tanggal = searchParams.get("tanggal") || undefined;
    const metode = searchParams.get("metode") || undefined;
    const referensi = searchParams.get("referensi") || undefined;

    const result = await getPembayaranService({
      limit,
      offset,
      tanggal,
      metode,
      referensi,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching pembayaran:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Terjadi kesalahan saat mengambil data",
      },
      { status: 500 }
    );
  }
}
