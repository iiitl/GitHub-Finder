"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AddHackathon from "@/components/AddHackathon";
import { useRouter } from "next/navigation";
import RemoveHackathon from "@/components/RemoveHackathon";
import ApplyHackathon from "@/components/ApplyHackathon";
import Link from "next/link";
import ViewHackathon from "@/components/ViewHackathon";

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

const getData = async () => {
  try {
    const res = await fetch("/api/getHackathon");
    if (!res.ok) {
      throw new Error("Failed to fetch hackathons");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading hackathons: ", error);
  }
};

const Page = () => {
  const convertDate = (inputDate: any) => {
    const date = new Date(inputDate);
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear().toString();

    return day + "/" + month + "/" + year;
  };
  const { data: session }: any = useSession();

  const router = useRouter();
  const [hackathons, setHackathons] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [ongoingHackathons, setOngoingHackathons] = useState(false);
  const [closedHackathons, setClosedHackathons] = useState(false);

  // const [reg, setReg] = useState(false);
  let reg = false;
  const getReg = () => {
    return reg;
  };
  const setReg = (change: any) => {
    reg = change;
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData();
        if (data) {
          setHackathons(data.hackathons);
        }
      } catch (error) {
        console.error("Error fetching hackathons: ", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCurrentUserData = async () => {
      try {
        const data = await getCurrentUser(session?.user.email);
        if (data) {
          setCurrentUser(data.currentUser);
        }
      } catch (error) {
        console.error("Error fetching current user data: ", error);
      }
    };

    if (session?.user?.email) {
      fetchCurrentUserData();
    }
  }, [session?.user?.email]);


  useEffect(() => {
    if (hackathons) {
      const ongoing = hackathons.filter(
        (hackathon: any) => new Date(hackathon.deadline) > new Date()
      );
      const closed = hackathons.filter(
        (hackathon: any) => new Date(hackathon.deadline) < new Date()
      );
      if (ongoing.length > 0) {
        setOngoingHackathons(true);
      }
      if (closed.length > 0) {
        setClosedHackathons(true);
      }
    }
  }
  , [hackathons]);

  return (
    <>
      <div>
        <div>
          {currentUser?.["role"] === "admin" ? <AddHackathon /> : null}
        </div>
        <div className=" mx-4 mt-4">
        
          <div className=" ">
          Ongoing
          <div className="shadow-md rounded-md  ">
            <table className="min-w-full overflow-x-auto border-gray-600 border  mb-4 rounded-xl container">
            <thead className="uppercase bg-gray-50 dark:bg-gray-700 text-gray-100 ">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider ">
                    <span className="">Hackathon Name</span>
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider ">
                    <span className="   ">Deadline</span>
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    <span className="md:visible invisible  absolute md:relative">Link</span>
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  <span className=" invisible md:visible absolute md:relative ">Description</span>
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  <span className=" ">Apply</span>
                  </th>
                </tr>
              </thead>
        {ongoingHackathons ? (

              <tbody>
                {hackathons?.map(
                  (hackathon, index) =>
                    new Date((hackathon as any)?.["deadline"]) > new Date() && (
                      <tr key={index}>
                        <td className="py-2 px-3 text-sm">
                          {hackathon?.["name"]}
                        </td>
                        <td className="py-2 px-3 text-sm  " >
                          {convertDate(hackathon?.["deadline"])}
                        </td>
                        <td className="py-2 px-3 text-sm">
                          <a
                            href={hackathon?.["link"]}
                            target="_blank"
                            className="text-blue-500 invisible md:visible absolute md:relative"
                          >
                            Website
                          </a>
                        </td>
                        <td className="py-2 px-3 text-sm  invisible md:visible absolute md:relative">
                          {hackathon?.["description"]}
                        </td>
                        <td className="py-2 px-3 text-sm flex">
                          <div className="flex">
                            {(currentUser as any)?.hackathon.map(
                              (h: any, index: any) => {
                                h === hackathon?.["_id"] ? setReg(true) : null;
                              }
                            )}
                            {getReg() ? null : (
                              <ApplyHackathon
                                id={`${hackathon?.["_id"]}`}
                                userEmail={`${session?.user?.email}`}
                              />
                            )}
                            {setReg(false)}
                            {currentUser?.["role"] === "admin" ? (
                              <RemoveHackathon id={`${hackathon?.["_id"]}`} />
                            ) : (
                              null
                            )}
                          </div>
                          <div className="flex px-4 border text-center bg-red-600 rounded-full justify-center text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium py-2 border-gray-600 mx-4 text-xs">
                            <ViewHackathon hackathon={hackathon} />
                          </div>
                        </td>
                      </tr>
                    )
                )}
              </tbody>
        ): <p className="my-4">No Ongoing Hackthon</p>}

            </table>
          </div>
          </div>
       
          <div className="shadow-md rounded-md ">
          Closed
          <table className="min-w-full overflow-x-auto border-gray-600 border  mb-4 rounded-xl container">
          <thead className="uppercase bg-gray-50 dark:bg-gray-700 text-gray-100 ">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider ">
                  <span className="">Hackathon Name</span>
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider ">
                  <span className=" ">Deadline</span>
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  <span className="invisible md:visible  absolute md:relative ">Link</span>
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                <span className=" invisible md:visible absolute md:relative ">Description</span>
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                <span className=" ">Apply</span>
                </th>
              </tr>
            </thead>
        {closedHackathons ? (

            <tbody>
              {hackathons?.map(
                (hackathon, index) =>
                  new Date((hackathon as any)?.["deadline"]) < new Date() && (
                    <tr key={index}>
                      <td className="py-2 px-3 text-sm ">
                        {hackathon?.["name"]}
                      </td>
                      <td className="py-2 px-3 text-sm  ">
                        {convertDate(hackathon?.["deadline"])}
                      </td>
                      <td className="py-2 px-3 text-sm">
                        <a
                          href={hackathon?.["link"]}
                          target="_blank"
                          className="text-blue-500 invisible md:visible absolute md:relative"
                        >
                          Website
                        </a>
                      </td>
                      <td className="py-2 px-3 text-sm  invisible md:visible absolute md:relative">
                        {hackathon?.["description"]}
                      </td>
                      <td className="py-2 px-3 text-sm">
                          <div className="flex">
                          {(currentUser as any)?.hackathon.map(
                            (h: any, index: any) => {
                              h === hackathon?.["_id"] ? setReg(true) : null;
                            }
                          )}
                          {setReg(false)}
                          {currentUser?.["role"] === "admin" ? (
                            <RemoveHackathon id={`${hackathon?.["_id"]}`} />
                          ) : (
                            <></>
                          )}
                        <div className="flex flex-row w-1/2 border text-center bg-red-600 rounded-full justify-center text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium    py-1 border-gray-600  mx-4 text-xs">
                          <ViewHackathon hackathon={hackathon} />
                        </div>
                          </div>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
        ) : <p>No Closed Hackthon</p>}
          </table>
        </div>
        </div>
      </div>
    </>
  );
};

export default Page;