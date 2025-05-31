import {
  findSuppliers,
  findSupplierById,
  insertSupplier,
  updateSupplierById,
  softDeleteSupplierById,
} from "@/models/supplierModel";
import {
  CreateSupplierInput,
  UpdateSupplierInput,
  Supplier,
} from "@/utils/types";

export async function getSuppliers(
  page = 1,
  limit = 10,
  search = "",
  filters: {
    id_kategori?: number;
    alamat?: string;
    nomor_kontak?: string;
  } = {}
) {
  return await findSuppliers({
    page,
    limit,
    search,
    ...filters,
  });
}

export async function getSupplier(id: number): Promise<Supplier | null> {
  return await findSupplierById(id);
}

export async function createSupplier(
  data: CreateSupplierInput
): Promise<Supplier & { Nama_Kategori: string | null }> {
  return await insertSupplier(data);
}

export async function updateSupplier(
  id: number,
  data: UpdateSupplierInput
): Promise<void> {
  await updateSupplierById(id, data);
}

export async function deleteSupplier(id: number): Promise<void> {
  await softDeleteSupplierById(id);
}
