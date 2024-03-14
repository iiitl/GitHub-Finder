"use client";
import React from 'react';
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const ChatBox = () => {
    const [socket, setSocket] = useState<any>(undefined);
    const [inbox, setInbox] = useState<Array<{ sender: string; message: string; date: string }>>([]);
    const [message,setMessage] = useState<any>("");
    const [roomName,setRoomName] = useState<any>("");
    const [sender,setSender] = useState("");
    function formatISODate(isoString:any) {
        const date = new Date(isoString);
        const formattedDate = new Intl.DateTimeFormat('en-US', {day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',}).format(date);
      
        return formattedDate;
      }
    useEffect(() => {
        const socket = io("http://localhost:3001");
    
        socket.on("message", (message, sender, date) => {
            const newMessage = {
              sender: sender,
              message: message,
              date: date,
            };
            setInbox((prevInbox) => [...prevInbox, newMessage]);
          });
          
    
        setSocket(socket);
      }, []);
      const handleSendMessage=()=>{
        socket.emit("message",message,roomName,sender,new Date());
      }
      const handleJoinRoom=()=>{
        socket.emit("joinRoom",roomName)
      }
  // Temporary data for inbox and chat
  const inboxData = [
    { id: 1, name: 'User 1' },
    { id: 2, name: 'User 2' },
    { id: 3, name: 'User 3' },
    // Add more inbox items as needed
  ];

  return (
    <div className="flex h-screen">
      {/* Left Sidebar (Inbox) */}
      <div className="w-1/4 bg-red-900 p-4">
        <h1 className="text-xl font-bold">Inbox</h1>
        <ul>
          {inboxData.map((item) => (
            <li key={item.id} className="py-2">
              {item.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Right Chat Section */}
      <div className="w-3/4 p-4 bg-blue-900">
        <h1 className="text-xl font-bold">Chat</h1>
        <div>
          {inbox.map((i:any) => (
            <div className="py-2">
               {i.message} by : {i.sender} at : {formatISODate(i.date)}
            </div>
          ))}
        </div>
        <div className='flex flex-row'>
        <input className='text-black' onChange={(e)=>{setMessage(e.target.value)}}/>
        <button onClick={handleSendMessage}>Send</button>
        </div>
        <div className='flex flex-row mt-4'>
        <input className='text-black'  onChange={(e)=>{setRoomName(e.target.value)}}/>
        <button onClick={handleJoinRoom}>Join Room</button>
        </div>
        <div className='flex flex-row mt-4'>
        <input className='text-black'  onChange={(e)=>{setSender(e.target.value)}}/>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
