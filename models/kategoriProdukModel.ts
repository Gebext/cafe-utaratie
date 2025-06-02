import { db } from "@/lib/db";

export async function getKategoriProduk() {
  const [rows] = await db.query(
    `SELECT * FROM Kategori_Produk WHERE Deleted_At IS NULL`
  );
  return rows;
}

export async function createKategoriProduk(nama: string) {
  await db.query(`INSERT INTO Kategori_Produk (Nama_Kategori) VALUES (?)`, [
    nama,
  ]);
}

export async function updateKategoriProduk(id: number, nama: string) {
  await db.query(
    `UPDATE Kategori_Produk SET Nama_Kategori = ? WHERE ID_Kategori = ?`,
    [nama, id]
  );
}

export async function deleteKategoriProduk(id: number) {
  await db.query(
    `UPDATE Kategori_Produk SET Deleted_At = NOW() WHERE ID_Kategori = ?`,
    [id]
  );
}

export async function getKategoriProdukById(id: number) {
  const [rows] = (await db.query(
    `SELECT * FROM Kategori_Produk WHERE ID_Kategori = ? AND Deleted_At IS NULL`,
    [id]
  )) as unknown as [any[]];
  return rows.length > 0 ? rows[0] : null;
}
