"use client";
import { useRouter } from "next/navigation";

const ApplyHackathon = ({ id, userEmail }: any) => {
  const router = useRouter();
  const addUsertoHackathon = async () => {
    try {
      const res = await fetch(`/api/addUsertoHackathon`, {
        method: "PUT",
        body: JSON.stringify({ userEmail, id }),
      });

      if (res.ok) {
        router.push("/login");
      } else {
        throw new Error("Failed to add");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button
      onClick={() => {
        addUsertoHackathon();
      }}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Apply
    </button>
  );
};

export default ApplyHackathon;
