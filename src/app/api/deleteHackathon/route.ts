import connect from "@/utils/db";
import Hackathon from "@/models/Hackathon";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function DELETE(request: any) {
  const id = request.nextUrl.searchParams.get("id");

  try {
    await connect();

    // Find the hackathon to be deleted
    const hackathon = await Hackathon.findById(id);

    // Remove the hackathon reference from the user(s)
    await User.updateMany({ hackathon: id }, { $pull: { hackathon: id } });

    // Delete the hackathon
    await Hackathon.findByIdAndDelete(id);

    return NextResponse.json({ message: "Hackathon deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
