import connect from "@/utils/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(request: any) {
  const username = request.nextUrl.searchParams.get("username");
  await connect();
  const currentUser = await User.findOne({ username: username });
  return NextResponse.json({ currentUser });
}
