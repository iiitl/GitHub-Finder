"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const page = () => {
  const chatBoxRef = useRef(null);
  const [currentUser, setCurrentUser] = useState();
  const [currentRoom, setCurrentRoom] = useState("");
  const { data: session }: any = useSession();
  const router = useRouter();
  const [socket, setSocket] = useState<any>(undefined);
  const [inbox, setInbox] = useState<
    Array<{ sender: string; message: string; date: string; avatar_url: string }>
  >([]);
  const [userAvatar, setUserAvatar] = useState("");
  const [message, setMessage] = useState<any>("");
  const [roomName, setRoomName] = useState<any>("");
  const [sender, setSender] = useState("");
  const [allRooms, setAllRooms] = useState([]);
  // function formatISODate(isoString: any) {
  //   const date = new Date(isoString);
  //   const formattedDate = new Intl.DateTimeFormat("en-US", {
  //     day: "2-digit",
  //     month: "short",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   }).format(date);
  //   return formattedDate;
  // }
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
  const fetchCurrentUserData = async () => {
    try {
      const data = await getCurrentUser(session?.user.email);
      if (data) {
        setCurrentUser(data.currentUser);
        setSender(data.currentUser?.username);
        setUserAvatar(data.currentUser?.avatar);
        getRooms(data.currentUser.rooms);
        if (data.currentUser?.rooms.length > 0) {
          setRoomName(data.currentUser?.rooms[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching current user data: ", error);
    }
  };
  const getRooms = async (arr: any) => {
    try {
      const res = await axios.post(`/api/fetchRoomsData`, arr);
      setAllRooms(res.data.rooms);
      console.log(res.data.rooms);
    } catch (error) {
      console.log("Error loading hackathons: ", error);
    }
  };
  const updateInbox = async () => {
    try {
      const response = await axios.put("/api/addMessageToInbox", {
        id: roomName,
        time: new Date(),
        sender: sender,
        message: message,
        avatar_url: userAvatar,
      });
      setMessage("");
      scrollToBottom();
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      (chatBoxRef.current as any).scrollTo({
        top: (chatBoxRef.current as any).scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const socket = io("https://github-finder-server.onrender.com");
    // const socket = io("http://localhost:3001");
    socket.on("message", (message, sender, date, avatar_url) => {
      const newMessage = {
        sender: sender,
        message: message,
        date: date,
        avatar_url: avatar_url,
      };
      setInbox((prevInbox) => [...prevInbox, newMessage]);
    });
    setSocket(socket);
  }, []);
  useEffect(() => {
    if (session?.user?.email) {
      fetchCurrentUserData();
    }
  }, [session?.user?.email]);
  const handleSendMessage = () => {
    socket.emit("message", message, roomName, sender, new Date(), userAvatar);
    updateInbox();
  };
  const handleJoinRoom = (room: string) => {
    socket?.emit("joinRoom", room);
  };
  const getRoom = async () => {
    try {
      const res = await fetch(`/api/getRoomById?id=${roomName}`);
      if (!res.ok) {
        throw new Error("Failed to fetch Rooms");
      }

      return res.json();
    } catch (error) {
      console.log("Error loading Rooms: ", error);
    }
  };
  const setRoom = async () => {
    const room = await getRoom();
    setInbox(room.currentRoom.messages);
    setCurrentRoom(room.currentRoom);
    scrollToBottom();
  };
  useEffect(() => {
    handleJoinRoom(roomName);
    if (roomName != "") {
      setRoom();
    }
  }, [roomName]);
  console.log("allroom", allRooms)
  return (
    <div className="h-[88vh] overflow-hidden flex ">
      {/* Left Sidebar (Inbox) */}
      <div className="w-1/4 h-full bg-gray-800 p-4 overflow-scroll">
      <h1 className="text-2xl p-2 font-bold ">Inbox</h1>
        <ul className="flex flex-col">
          {allRooms?.map((item: any, i: any) => (
            <button
              key={i}
              className="py-1 rounded text-sm"
              onClick={() => {
                setRoomName(item._id);
              }}
            >
                <div className="flex flex-col justify-start items-start">
                {item.members.map((user: any, i: any) => {
                  if (user != (currentUser as any).username) {
                    return ( 
                    <div key={i} className="flex justify-center items-center">
                      <img className="w-8 rounded-full m-2"
                src="data:image/png;base64,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" alt="" />
                      {user}
                    </div>
                )}
                })}
              </div>
            </button>
          ))}
        </ul>
      </div>

      {/* Right Chat Section */}
      {roomName != "" ? (
      <div
        className="w-3/4 bg-gray-600 text-gray-900 overflow-scroll "
        id="chatBox"
        ref={chatBoxRef}
      >
        <div className="md:h-[12%] h-[5%] bg-gray-700 p-4 absolute w-full">
          <p className="text-base text-black">Members : </p>
          <div className="flex flex-row gap-3 ">
            {(currentRoom as any)?.members?.map((m: any, i: any) => {
              if( m != (currentUser as any)?.username ){
                return (
                  <button 
                  className="text-gay-900 font-bold capitalize"
                  key={i} onClick={() => router.push(`/profile/${m}`)}>
                    {m}
                  </button>
                );
              }
            })}
          </div>
        </div>
        <div className="md:h-[88%] h-[90%] overflow-scroll px-4">
        <h1 className="text-2xl font-bold p-4 my-2">Chat</h1>
          <div>
            {inbox.map((i: any, id: any) => (
              <div className="py-2" key={id}>
                <div className="flex items-center">
                  {(i.sender === (currentUser as any)?.username) ? (
                     <div className="flex items-end w-full flex-row-reverse">
                      <img
                     src={i.avatar_url}
                     alt="lolo"
                     className="rounded-full w-8 h-8 m-2 object-cover"
                   />
                    <div>
                    <p className="bg-blue-600 text-white p-2 rounded-lg">
                      {i.message}
                    </p>
                    <p className="text-xs text-end text-black font-semibold">{i.sender}</p>
                    </div>
                    
                     </div>
                  ) : (
                    <div className="flex justify-start">
                      <img
                    src={i.avatar_url}
                    alt="lolo"
                    className="rounded-full w-8 h-8 m-2 object-cover"
                  />
                    <div>
                    <p className="bg-gray-400 text-white p-2 rounded-lg">
                      {i.message}
                    </p>
                    <p className="text-xs text-start text-black font-semibold">{i.sender}</p>
                    </div>
                    </div>
                  )}
                </div>
                {scrollToBottom()}
              </div>
            ))}
          </div>
        </div>
        <div className="flex md:w-full w-[80%] md:h-[10%] h-[4%] my-2 px-2">
            <input
              value={message}
              className="text-black focus:outline-none bg-blue-200 md:w-[85%] w-[90%] rounded-l-lg active:border-none px-4 py-2"
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <button 
            onClick={handleSendMessage}
            className="font-extrabold bg-blue-600 md:w-[15%] rounded-r-lg px-4"
            >Send</button>
          </div>
      </div>) 
      : ( 
        <div className="text-xl font-bold text-gray-700 mt-4">
          You have no rooms
        </div>
      )
      }
    </div>
  );
};

export default page;
