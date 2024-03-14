import mongoose from "mongoose";
import User from "./User";

const { Schema } = mongoose;
const hackathonSchema = new Schema(
  {
    deadline: {
      type: Date,
    },
    link: {
      type: String,
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },

    user: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Hackathon ||
  mongoose.model("Hackathon", hackathonSchema);
