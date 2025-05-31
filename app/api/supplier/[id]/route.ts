import { NextRequest } from "next/server";
import {
  getSupplier,
  updateSupplier,
  deleteSupplier,
} from "@/services/supplierService";
import { success, error } from "@/lib/response";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const supplier = await getSupplier(Number(id));

  if (!supplier) return error("Supplier tidak ditemukan", 404);

  return success("Supplier berhasil diambil", supplier);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const body = await req.json();

  await updateSupplier(Number(id), body);
  return success("Supplier berhasil diperbarui");
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  await deleteSupplier(Number(id));
  return success("Supplier berhasil dihapus");
}
