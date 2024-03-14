import connect from "@/utils/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(request: any) {
  const userEmail = request.nextUrl.searchParams.get("userEmail");
  await connect();
  const currentUser = await User.findOne({ email: userEmail });
  return NextResponse.json({ currentUser });
}
