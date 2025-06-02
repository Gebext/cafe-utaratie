import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  markPembelianAsPaid,
  getPembelianForPayment,
} from "@/models/pembelianModel";
import { increaseProductStock } from "@/models/produkModels";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const param = await params;
    const id = parseInt(param.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { status: "error", message: "ID pembelian tidak valid." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { metode_pembayaran, nomor_referensi } = body;

    const metodeValid = ["Tunai", "Kartu Kredit", "Transfer Bank"];
    if (!metodeValid.includes(metode_pembayaran)) {
      return NextResponse.json(
        { status: "error", message: "Metode pembayaran tidak valid." },
        { status: 400 }
      );
    }

    const pembelian = await getPembelianForPayment(id);

    if (!pembelian) {
      return NextResponse.json(
        { status: "error", message: "Pembelian tidak ditemukan." },
        { status: 404 }
      );
    }

    if (pembelian.Is_Paid) {
      return NextResponse.json(
        { status: "error", message: "Pembelian sudah dibayar." },
        { status: 400 }
      );
    }

    const updated = await markPembelianAsPaid(id);
    if (!updated) {
      return NextResponse.json(
        { status: "error", message: "Gagal memperbarui status pembayaran." },
        { status: 500 }
      );
    }

    await db.query(
      `
      INSERT INTO Pembayaran (
        ID_Pembelian,
        Tanggal_Pembayaran,
        Metode_Pembayaran,
        Jumlah,
        Nomor_Referensi
      ) VALUES (?, CURDATE(), ?, ?, ?)
    `,
      [id, metode_pembayaran, pembelian.Total_Biaya, nomor_referensi || null]
    );

    // Validasi data stok
    const idProduk = Number(pembelian.ID_Produk);
    const jumlahBeli = Number(pembelian.Jumlah_Beli);

    if (
      !isNaN(idProduk) &&
      !isNaN(jumlahBeli) &&
      idProduk > 0 &&
      jumlahBeli > 0
    ) {
      try {
        await increaseProductStock(idProduk, jumlahBeli);
        console.log("Stok berhasil diperbarui");
      } catch (err) {
        console.error("Gagal update stok:", err);
      }
    } else {
      console.warn("ID_Produk atau Jumlah_Beli tidak valid untuk update stok.");
    }

    return NextResponse.json({
      status: "success",
      message: "Pembayaran berhasil diproses.",
    });
  } catch (err: any) {
    console.error("Error saat proses pembayaran:", err);
    return NextResponse.json(
      {
        status: "error",
        message: "Terjadi kesalahan pada server. Silakan coba lagi.",
      },
      { status: 500 }
    );
  }
}
