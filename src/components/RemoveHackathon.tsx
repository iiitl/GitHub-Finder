"use client";
import { useRouter } from "next/navigation";
const RemoveHackathon = ({ id }: any) => {
  const router = useRouter();
  const removeTopic = async () => {
    const confirmed = confirm("Are you sure?");

    if (confirmed) {
      const res = await fetch(`/api/deleteHackathon?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      }
    }
  };
  return (
    <button onClick={removeTopic} className="rounded-full py-2 px-3 bg-red-500">
      delete
    </button>
  );
};

export default RemoveHackathon;
