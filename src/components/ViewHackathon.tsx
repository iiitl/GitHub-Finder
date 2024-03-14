"use client";
import React from "react";
import { useRouter } from "next/navigation";

const ViewHackathon = ({ hackathon }: any) => {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        router.push(`/hackathon/${hackathon?.["_id"]}`);
      }}
    >
      View
    </button>
  );
};

export default ViewHackathon;
