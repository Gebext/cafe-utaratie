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

/**
 * Ambil daftar supplier dengan pagination dan filter.
 * Bisa menambah validasi atau pengolahan sebelum panggil model.
 */
export async function getSuppliers(
  page = 1,
  limit = 10,
  search = "",
  filters: {
    id_kategori?: number;
    alamat?: string;
    nomor_kontak?: string;
    nama_kategori?: string;
  } = {}
) {
  // Contoh validasi sederhana: pastikan page dan limit positif
  if (page < 1) page = 1;
  if (limit < 1) limit = 10;

  // Bisa tambahkan aturan bisnis lainnya di sini

  return await findSuppliers({
    page,
    limit,
    search,
    ...filters,
  });
}

/**
 * Ambil data supplier berdasarkan ID.
 * Return null jika tidak valid atau tidak ditemukan.
 */
export async function getSupplier(id: number): Promise<Supplier | null> {
  if (typeof id !== "number" || id <= 0) return null;
  return await findSupplierById(id);
}

/**
 * Buat supplier baru.
 * Bisa ditambah validasi data sebelum insert.
 */
export async function createSupplier(
  data: CreateSupplierInput
): Promise<Supplier & { Nama_Kategori: string | null }> {
  // Contoh validasi bisa ditambahkan di sini sebelum insert
  return await insertSupplier(data);
}

/**
 * Update supplier berdasarkan ID.
 * Validasi ID dan data bisa ditambahkan.
 */
export async function updateSupplier(
  id: number,
  data: UpdateSupplierInput
): Promise<void> {
  if (typeof id !== "number" || id <= 0) throw new Error("ID tidak valid");
  // Validasi data juga bisa ditambahkan
  await updateSupplierById(id, data);
}

/**
 * Soft delete supplier berdasarkan ID.
 */
export async function deleteSupplier(id: number): Promise<void> {
  if (typeof id !== "number" || id <= 0) throw new Error("ID tidak valid");
  await softDeleteSupplierById(id);
}
