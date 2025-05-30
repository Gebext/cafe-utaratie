// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { loginUser } from "../../../../services/authService";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  console.log(email, password);

  try {
    const { token, user } = await loginUser({ email, password });

    const res = NextResponse.json({
      success: true,
      user: {
        id: user.ID_Karyawan,
        nama: user.Nama_Karyawan,
        role: user.Role,
        email: user.Email,
      },
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
