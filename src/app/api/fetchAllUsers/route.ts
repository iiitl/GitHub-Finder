import connect from "@/utils/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(request: any) {
  await connect();
  const allUsers = await User.find({});
  return NextResponse.json({ allUsers });
}
