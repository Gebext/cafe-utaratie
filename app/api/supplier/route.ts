import { NextResponse } from "next/server";
import { getSupplier } from "@/models/supplierModel";

export async function GET() {
  try {
    const suppliers = await getSupplier();
    return NextResponse.json({ success: true, data: suppliers });
  } catch (error: any) {
    console.error("Error fetching suppliers:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch suppliers" },
      { status: 500 }
    );
  }
}
