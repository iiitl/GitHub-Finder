"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { FiAlignRight } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";

const Navbar = () => {
  const [allUsers, setAllUsers] = useState(null);
  const [inputText, setInputText] = useState("");
  const getUsers = async () => {
    try {
      const res = await fetch("/api/fetchAllUsers");
      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      return res.json();
    } catch (error) {
      console.log("Error loading users: ", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUsers();
        if (data) {
          console.log(data.allUsers);
          setAllUsers(data.allUsers);
        }
      } catch (error) {
        console.error("Error fetching hackathons: ", error);
      }
    };

    fetchData();
  }, [inputText]);

  const { data: session }: any = useSession();
  return (
    <div className=" w-screen bg-[rgb(10,1,31)] rounded-lg border-b border-gray-500 ">
      <div className="mx-4">
        <ul className="flex justify-between items-center  p-4">
          <div className="">
            <Link href="/">
              <li>
                <img src="/favicon.ico" className="h-12" alt="Logo" />
              </li>
            </Link>
          </div>
          <div className="flex gap-10   ">
            <div className="flex gap-10  invisible md:visible  absolute md:relative">
              <Link href="/" passHref>
                <li className="hover:text-gray-300 text-sm align-middle pt-2 font-serif">
                  Home
                </li>
              </Link>
              <Link href="/hackathon" passHref>
                <li className="hover:text-gray-300 text-sm pt-2 font-serif">
                  Hackathons
                </li>
              </Link>
            </div>
            <li className="text-black pt-2 font-serif">
              <input
                className=" w-full h-5 align-middle mt-1"
                value={inputText}
                onChange={(e: any) => {
                  setInputText(e.target.value);
                }}
              />
            </li>
            <div className="flex gap-10  invisible md:visible absolute md:relative">
              {session ? (
                <Link href="/chat" passHref>
                  <li className="hover:text-gray-300 text-sm pt-2 font-serif">
                    Chat
                  </li>
                </Link>
              ) : (
                <></>
              )}
              {!session ? (
                <Link href="/login" passHref>
                  <li className="hover:text-gray-300 bg-[rgb(175,129,235)] px-6 text-sm text-black py-2 rounded-3xl font-serif ">
                    Login
                  </li>
                </Link>
              ) : (
                <>
                  <Link href="/profile" passHref>
                    <li className="hover:text-gray-300  text-sm pt-2 font-serif">
                      Profile
                    </li>
                  </Link>

                  <li className="">
                    <button
                      onClick={() => signOut()}
                      className="hover:text-gray-300 bg-[rgb(175,129,235)] px-6 text-sm text-black py-2 rounded-3xl font-serif"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </div>
            <div className="visible md:invisible md:absolute mt-2">
              <FiAlignRight />
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
