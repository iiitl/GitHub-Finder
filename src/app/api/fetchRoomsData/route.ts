import connect from "@/utils/db";
import Room from "@/models/Room";
import { NextResponse } from "next/server";

export async function POST(request: any) {
  await connect();
  const roomID = await new Response(request.body).json();
  if (!roomID || !roomID.length) {
    return NextResponse.json("No roomID provided in the request body");
  }
  try {
    const rooms = await Room.find({ _id: { $in: roomID } });
    return NextResponse.json({ rooms });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json("Internal Server Error");
  }
}
