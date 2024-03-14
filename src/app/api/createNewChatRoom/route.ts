import connect from "@/utils/db";
import Room from "@/models/Room";
import { NextResponse } from "next/server";

export async function POST(request: any) {
  await connect();
  
  try {
    const userNames = await new Response(request.body).json();

    if (!userNames || !userNames.length) {
      return NextResponse.json({ error: "No usernames provided in the request body" });
    }

    const createdRoom = await Room.create({
      members: userNames,
      messages: [],
    });

    return NextResponse.json({ message: "Room Created", roomId: createdRoom._id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
