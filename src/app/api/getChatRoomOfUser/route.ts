import connect from "@/utils/db";
import Room from "@/models/Room";
import { NextResponse } from "next/server";

export async function POST(request: any) {
  await connect();

  try {
    const { userName, rooms } = await new Response(request.body).json();

    if (!userName || !rooms || !Array.isArray(rooms)) {
      return NextResponse.json({ error: "Invalid request body" });
    }

    const roomPromises = rooms.map(async (roomId) => {
      const room = await Room.findById(roomId);
      return room && room.members.length === 2 && room.members.includes(userName) ? room : null;
    });

    const foundRooms = await Promise.all(roomPromises);
    const validRooms = foundRooms.filter((room) => room !== null);

    if (validRooms.length > 0) {
      return NextResponse.json({ rooms: validRooms });
    } else {
      return NextResponse.json({ message: "No matching rooms found" });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
