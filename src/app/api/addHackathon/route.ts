import connect from "@/utils/db";
import Hackathon from "@/models/Hackathon";
import { NextResponse } from "next/server";

export async function POST(request: any) {
  const { deadline, link, description, name } = await request.json();
  await connect();
  await Hackathon.create({
    deadline: deadline,
    link: link,
    description: description,
    name: name,
  });
  return NextResponse.json({ message: "Hackathon Created" }, { status: 201 });
}
