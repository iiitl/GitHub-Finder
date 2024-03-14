import connect from "@/utils/db";
import Hackathon from "@/models/Hackathon";
import { NextResponse } from "next/server";

export async function GET() {
  await connect();
  const hackathons = await Hackathon.find();
  return NextResponse.json({ hackathons });
}
