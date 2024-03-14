import React, { useState } from "react";
import { useRouter } from "next/navigation";

const AddHackathon = () => {
  const router = useRouter();
  const [deadline, setDeadline] = useState("");
  const [link, setLink] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    // Perform actions with the form data, for example, send it to an API or perform other operations
    // console.log('Form submitted:', formData);
    try {
      const res = await fetch("/api/addHackathon", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ deadline, name, link, description }),
      });

      if (res.ok) {
        router.push("/");
      } else {
        throw new Error("Failed to create a topic");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-md mx-auto m-4 p-6 bg-gray-100 rounded-md text-black">
      <h2 className="text-2xl mb-4">Create a Hackathon</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Deadline:</label>
          <input
            type="date"
            name="deadline"
            value={deadline}
            onChange={(e: any) => {
              setDeadline(e.target.value);
            }}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Link:</label>
          <input
            type="text"
            name="link"
            value={link}
            onChange={(e: any) => {
              setLink(e.target.value);
            }}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e: any) => {
              setName(e.target.value);
            }}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description:</label>
          <textarea
            name="description"
            value={description}
            onChange={(e: any) => {
              setDescription(e.target.value);
            }}
            className="border border-gray-300 rounded-md p-2 w-full h-20"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
        >
          Create Hackathon
        </button>
      </form>
    </div>
  );
};

export default AddHackathon;
