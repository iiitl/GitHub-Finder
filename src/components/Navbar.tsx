"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { FiAlignRight } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";

const Navbar = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [crossButton, setCrossButton] = useState(false);
  const [toggleBtn, setToggleBtn] = useState(false);
  const [searchedUser, setSearchedUser] = useState<any>([]);
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

  const getTop5Users = (allUsers: any[], searchInput: string): any[] => {
    const filteredUsers = allUsers.filter(user =>
      user.name.toLowerCase().startsWith(searchInput.toLowerCase())
    );
    const sortedUsers = filteredUsers.sort((a, b) => {
      if (a.name.length < b.name.length) return -1;
      if (a.name.length > b.name.length) return 1;
      return 0;
    });
    const top5Users = sortedUsers.slice(0, 5);
    return top5Users;
  };
 

  const Menu = () => {
    return (
      <div className="flex bg-[rgb(10,1,31)] w-56 delay-75 rounded-lg border border-gray-500 flex-col list-none md:invisible visible absolute right-2 top-20 items-end justify-end p-4">
        <Link href="/" passHref>
          <li className="hover:text-gray-300 list-none text-sm align-middle font-serif">
            Home
          </li>
        </Link>
        <Link href="/hackathon" passHref>
          <li className="hover:text-gray-300 list-none text-sm font-serif mt-2">
            Hackathons
          </li>
        </Link>
        <li className="text-black pt-2 font-serif flex justify-end">
              <input
                className="h-8 w-[70%] text-base px-4 py-2 rounded-l-md focus:outline-none"
                value={inputText}
                onChange={
                  handleSearch
                }
              />
              {crossButton ?
                (<button 
                onClick={() => {setSearchedUser([]); setInputText(""); setCrossButton(false)}}
                className="font-bold text-black bg-white px-2 rounded-r-md">X</button>) : 
                <CiSearch className="font-bold h-8 text-black bg-white text-3xl rounded-r-md"/>
                }
            </li>
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
                      className="hover:text-gray-300 bg-[rgb(175,129,235)] mt-2 px-6 text-sm text-black py-2 rounded-3xl font-serif"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
      </div>
    )
  }

  const handleSearch = (e:any) => {
    
    setInputText(e.target.value)
    if(e.target.value === ""){
      return setSearchedUser([]);
    }
    const top5Users = getTop5Users(allUsers, inputText);
    if(top5Users){
      setCrossButton(true);
    }
    setSearchedUser(top5Users);
  }

  useEffect(()=> {
    setInputText("");
    setSearchedUser([]);
  },[])

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
      {toggleBtn && <Menu/>}
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
            <li className="text-black pt-2 font-serif flex md:visible invisible">
              <input
                className="w-full h-8 align-middle text-base px-4 py-2 rounded-l-md focus:outline-none"
                value={inputText}
                onChange={
                  handleSearch
                }
              />
              {crossButton ?
                (<button 
                onClick={() => {setSearchedUser([]); setInputText(""); setCrossButton(false)}}
                className="font-bold text-black bg-white px-2 rounded-r-md">X</button>) : 
                <CiSearch className="font-bold h-8 text-black bg-white text-3xl rounded-r-md"/>
                }
            </li>
            <div className="relative">
                {searchedUser ? (
                  <div className="absolute md:left-0 right-40 top-14 bg-[rgb(10,1,31)] w-60 rounded-lg border border-gray-500">
                    {searchedUser.map((user: any) => (
                      <Link href={`/profile/${user.username}`} key={user._id}>
                        <li className="hover:text-gray-300 text-sm px-4 py-2 font-serif">
                          {user.name}
                        </li>
                      </Link>
                    ))}
                  </div>
                ) : (<div className="absolute md:left-0 right-10 top-14 bg-[rgb(10,1,31)] w-60 rounded-lg border border-gray-500">
                  <p className="hover:text-gray-300 text-sm px-4 py-2 font-serif">NO USER FOUND</p>
                  </div>) }
            </div>
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
            <button className="visible md:invisible md:absolute mt-2"
              onClick={() => setToggleBtn(!toggleBtn)}
            >
              <FiAlignRight />
            </button>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;