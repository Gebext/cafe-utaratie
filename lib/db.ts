import mysql from "mysql2/promise";

export const db = await mysql.createPool({
  uri: process.env.DATABASE_URL,
});
