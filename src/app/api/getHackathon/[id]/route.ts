import connect from "@/utils/db";
import Hackathon from "@/models/Hackathon";
import { NextResponse } from "next/server";

export async function GET(req: any) {
  const id = req.url.split("/");
  const id2 = id[id.length - 1];
  await connect();
  const hackathons = await Hackathon.findById(id2);
  return NextResponse.json(hackathons);
}
