"use client";
import { NextApiRequest, NextApiResponse } from "next";
import connect from "@/utils/db";
import User from "@/models/User";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connect();

    if (req.method === "DELETE") {
      const { userId, hackathonId } = req.query;
      await User.findByIdAndUpdate(
        userId,
        { $pull: { hackathon: hackathonId } },
        { new: true }
      );

      res.status(200).json({ success: true });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Invalid request method" });
    }
  } catch (error) {
    console.error("Error removing user hackathon:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export default handler;
