import connect from "@/utils/db";
import Hackathon from "@/models/Hackathon";
import { NextResponse } from "next/server";
import User from "@/models/User";

export async function PUT(request: any) {
  await connect();
  const { userEmail, id } = await request.json();
  const user = await User.findOne({ email: userEmail });
  const hackathon = await Hackathon.findById(id);
  if (!user) {
    return NextResponse.json({ message: "User not found" });
  }
  if (!hackathon) {
    return NextResponse.json({ message: "Hackathon not found" });
  }
  user.hackathon.push(id);
  hackathon.user.push(user?.username);
  user.save();
  hackathon.save();
  return NextResponse.json({ message: "Added" }, { status: 201 });
}
