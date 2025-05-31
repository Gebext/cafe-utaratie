import { db } from "@/lib/db";

export async function getSupplier() {
  const [rows] = await db.query(
    "SELECT * FROM Supplier WHERE Deleted_At IS NULL"
  );
  return rows; // <-- semua supplier dikembalikan sebagai array
}
