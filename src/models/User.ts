import mongoose from "mongoose";
import Hackathon from "./Hackathon";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    repo: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    role: {
      type: String,
      default: "user",
    },
    hackathon: [
      {
        type: String,
        ref: "Hackathon",
      },
    ],
    rooms : [{type:String}]
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
