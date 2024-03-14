import connect from "@/utils/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PUT(request: any) {
  await connect();

  try {
    const { roomId, usernames } = await new Response(request.body).json();

    if (!roomId || !usernames || !Array.isArray(usernames)) {
      return NextResponse.json({ error: "Invalid request body" });
    }

    // Update the rooms array for each user
    await Promise.all(usernames.map(async (username) => {
      await User.findOneAndUpdate(
        { username: username },
        { $addToSet: { rooms: roomId } },
        { new: true }
      );
    }));
    return NextResponse.json({ message: "Rooms added to users successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
