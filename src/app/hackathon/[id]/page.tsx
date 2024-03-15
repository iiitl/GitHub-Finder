"use client";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const page = () => {
  const [currentUser,setCurrentUser] = useState();
  const { data: session }: any = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const pathParts = pathname.split("/");
  const id = pathParts[pathParts.length - 1];
  const [hackathon, setHackathon] = useState();
  const [hackathonUsers, setHackathonUsers] = useState([]);
  const handleChat = async(user:any)=>{
    const userName = user?.username;
    const arr2 = (currentUser as any)?.rooms;
    var flag = "";
    try {
      const res = await axios.post(`/api/getChatRoomOfUser`,{"userName":userName,"rooms":arr2});
      flag =res.data.message;
    } catch (error) {
      console.log("Error loading rooms: ", error);
      
    }
    if("No matching rooms found" == flag){
      const arr = [];
      arr.push(user?.username);
      arr.push((currentUser as any)?.username);
      var roomID= "";
      try {
        const res = await axios.post(`/api/createNewChatRoom`,arr );
        roomID=res.data.roomId;
      } catch (error) {
        console.log("Error loading rooms: ", error);
      }
      try {
        const res = await axios.put(`/api/addRoomToUser`,{"usernames":arr,"roomId":roomID} );
        roomID=res.data.roomId;
      } catch (error) {
        console.log("Error loading hackathons: ", error);
      }
      console.log("created")
    } else{
      console.log("exists")
    }
    router.push(`/chat`)
  };
  const getData = async () => {
    try {
      const res = await fetch(`/api/getHackathon/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch hackathons");
      }

      return res.json();
    } catch (error) {
      console.log("Error loading hackathons: ", error);
    }
  };
  const getHackathonUsers = async (arr: any) => {
    try {
      const res = await axios.post(`/api/fetchUsersByUsername`, arr);
      setHackathonUsers(res.data.users);
    } catch (error) {
      console.log("Error loading hackathons: ", error);
    }
  };
  const fetchCurrentUserData = async () => {
    try {
      const data = await getData();
      setHackathon(data);
      getHackathonUsers(data.user);
    } catch (error) {
      console.error("Error fetching current user data: ", error);
    }
  };
  useEffect(() => {
    fetchCurrentUserData();
  }, []);
  const getCurrentUser = async (email: any) => {
    try {
      const res = await fetch(`/api/getCurrentUser?userEmail=${email}`);
      if (!res.ok) {
        throw new Error("Failed to fetch hackathons");
      }
      return res.json();
    } catch (error) {
      console.log("Error loading hackathons: ", error);
    }
  };
  const fetchUserCurrent = async () => {
    try {
      const data = await getCurrentUser(session?.user.email);
      if (data) {
        setCurrentUser((data as any)?.currentUser)
      }
    } catch (error) {
      console.error("Error fetching current user data: ", error);
    }
  };
  useEffect(()=>{
    if(session?.user?.email){
      fetchUserCurrent();
    }
  },[session?.user?.email])
  return (
    <div>
      <p>Hackathon Data :</p>
      <div>name : {hackathon?.["name"]}</div>
      <div>link : {hackathon?.["link"]}</div>
      <div>dealine : {new Date(hackathon?.["deadline"]!).toDateString()}</div>
      <div>description : {hackathon?.["description"]}</div>
      <div className="flex flex-col">
        <table>
          <thead className="uppercase bg-gray-50 dark:bg-gray-700 text-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                Tags
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {hackathonUsers?.map((u: any, index: any) => (
              <tr key={index}>
                <td className="flex flex-row gap-2">
                  <img
                    className="rounded-full w-16 h-16 object-cover my-2"
                    src={u.avatar}
                    alt={`Avatar of ${u.username}`}
                  />
                  {u.username}
                </td>
                <td>{u.tags.join(", ")}</td>
                <td>
                  <button
                    onClick={() => router.push(`/profile/${u.username}`)}
                    className="bg-blue-900 px-3 py-2 rounded-lg"
                  >
                    View Profile
                  </button>
                  <button onClick={()=>{handleChat(u)}}
                    className="bg-red-900 ml-3 px-3 py-2 rounded-lg"
                  >
                    Chat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default page;
