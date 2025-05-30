// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { registerUser } from "../../../../services/authService";

export async function POST(req: Request) {
  const body = await req.json();
  const { nama, email, password, role, kontak } = body;

  try {
    await registerUser({ nama, email, password, role, kontak });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
