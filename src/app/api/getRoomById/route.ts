import connect from "@/utils/db";
import Room from "@/models/Room";
import { NextResponse } from "next/server";


export async function GET(request: any) {
    const id = request.nextUrl.searchParams.get("id");
    await connect();
    const currentRoom = await Room.findById( id );
    return NextResponse.json({ currentRoom });
  }
  