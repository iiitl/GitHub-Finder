import { NextResponse } from "next/server";
import Room from "@/models/Room"; 
import connect from "@/utils/db";
await connect();

export async function PUT(request: any) {
  try {
    const { id, time, sender, message, avatar_url } = await new Response(request.body).json();

    const room = await Room.findById(id);

    if (!room) {
      return NextResponse.json("Room not found", { status: 404 });
    }

    room.messages.push({
      time,
      sender,
      message,
      avatar_url,
    });

    await room.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
